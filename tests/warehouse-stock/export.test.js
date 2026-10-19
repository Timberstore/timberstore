import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseStockCsv,
  createExportStockProvider,
  createExportReader,
} from '../../backend/warehouse-stock/export-provider.js';
import { providerFromEnv, createStockServer } from '../../backend/warehouse-stock/server.js';
import { validRecord, EXPORT_MAX_AGE } from '../../shared/warehouse-stock/model.js';

// Explicit synthetic fixtures, never the user's real SKUs/counts.
const header =
  'code;unit;productVisibility;variantVisibility;stock:Dolný Hričov;stock:Centrálny sklad';
const csv = `${header}\r\nTEST-A;pár;visible;1;12;45\r\nTEST-B;pár;visible;1;0;8\r\nTEST-ZERO;pár;visible;1;0;0\r\nTEST-M;m;visible;1;2,125;-1\r\nTEST-H;ks;hidden;1;5;6\r\nTEST-V;ks;visible;0;3;4\r\nTEST-UNKNOWN;ks;visible;1;;12\r\n`;
const identity = { productId: '101', guid: '11111111-1111-1111-1111-111111111111', code: 'TEST-A' };

test('Shoptet CSV uses named stocks, exact SKU and units, skips hidden/unknown rows', () => {
  const index = parseStockCsv(csv);
  assert.deepEqual(index.get('TEST-A'), {
    amounts: { hricov: 12, csnk: 45 },
    unit: 'pár',
    guid: null,
  });
  assert.deepEqual(index.get('TEST-M').amounts, { hricov: 2.125, csnk: -1 });
  for (const code of ['TEST-H', 'TEST-V', 'TEST-UNKNOWN']) assert(!index.has(code));
  assert.throws(() => parseStockCsv(csv.replace('stock:Centrálny sklad', 'stock')));
  assert.throws(() => parseStockCsv(csv + 'TEST-A;pár;visible;1;0;1\n'));
  assert.throws(() =>
    parseStockCsv(csv, { columns: { hricov: 'stock:Dolný Hričov', csnk: 'stock:Dolný Hričov' } }),
  );
});
test('CSV quoting/BOM, localized decimals and leading zero SKUs stay exact', () => {
  const value = `\uFEFF"code";unit;productVisibility;variantVisibility;stock:Dolný Hričov;stock:Centrálny sklad\n"0001";"m;set";visible;1;"1,25";0\n`;
  assert.equal(parseStockCsv(value).get('0001').unit, 'm;set');
  assert.equal(parseStockCsv(value).get('0001').amounts.hricov, 1.25);
  assert.throws(() => parseStockCsv(value.replace('"0001"', '"0001')));
  assert.throws(() =>
    parseStockCsv(
      csv
        .replace('12;45', '>100;45')
        .replace('0;8', 'false;8')
        .replace('0;0', ';0')
        .replace('2,125;-1', ';-1'),
    ),
  );
});
test('export stays disabled without explicit available-stock verification', async () => {
  let reads = 0;
  const p = createExportStockProvider({
    readExport: async () => {
      reads++;
      return { csv, observedAt: 1000 };
    },
  });
  await p.refresh();
  assert.equal((await p.batch([identity]))[0].reason, 'export-verification-required');
  assert.equal(reads, 0);
  const physical = createExportStockProvider({
    verified: true,
    mode: 'physical-minus-claim',
    readExport: () => {
      throw Error();
    },
  });
  assert.equal((await physical.batch([identity]))[0].state, 'unknown');
});
test('one export refresh covers concurrent batches, keeps age and expires on failed sync', async () => {
  let time = 1000,
    reads = 0,
    fail = false;
  const p = createExportStockProvider({
    verified: true,
    mode: 'available',
    now: () => time,
    readExport: async () => {
      reads++;
      await new Promise((r) => setTimeout(r, 5));
      if (fail) throw Error();
      return { csv, observedAt: time };
    },
  });
  await Promise.all([p.refresh(), p.refresh()]);
  assert.equal(reads, 1);
  let [a, b, z] = await p.batch([
    identity,
    { ...identity, code: 'TEST-B' },
    { ...identity, code: 'TEST-ZERO' },
  ]);
  assert.deepEqual(
    a.warehouses.map((r) => r.quantity),
    [12, 45],
  );
  assert.deepEqual(
    b.warehouses.map((r) => r.quantity),
    [0, 8],
  );
  assert.deepEqual(
    z.warehouses.map((r) => r.quantity),
    [0, 0],
  );
  time = 100000;
  a = (await p.batch([identity]))[0];
  assert.equal(a.asOf, 1000);
  assert(validRecord(a, identity, time));
  assert(!validRecord({ ...a, source: 'shoptet-api' }, identity, time));
  fail = true;
  time = 301000;
  await p.refresh();
  assert.equal(p.status().state, 'export-refresh-failed');
  a = (await p.batch([identity]))[0];
  assert.equal(a.asOf, 1000);
  assert(validRecord(a, identity, time));
  time = 1000 + EXPORT_MAX_AGE;
  assert.equal((await p.batch([identity]))[0].state, 'unknown');
  assert.equal(reads, 3);
});
test('export validates optional GUID and never returns another variant SKU', async () => {
  const p = createExportStockProvider({
    verified: true,
    mode: 'available',
    now: () => 1000,
    readExport: async () => ({
      csv: header + ';guid\nTEST-A;pár;visible;1;12;45;22222222-2222-2222-2222-222222222222',
      observedAt: 1000,
    }),
  });
  await p.refresh();
  assert.equal((await p.batch([identity]))[0].state, 'unknown');
  assert.equal((await p.batch([{ ...identity, code: 'TEST-MISSING' }]))[0].state, 'unknown');
});
test('secured export fetch is GET-only, bounded, host-restricted and errors redact URL', async () => {
  const secretUrl =
    'https://www.timberstore.sk/action/ExportProducts/export/?hash=TEST-NOT-A-REAL-SECRET';
  let opts;
  const reader = createExportReader({
    url: secretUrl,
    now: () => 100000,
    fetcher: async (url, options) => {
      assert.equal(url, secretUrl);
      opts = options;
      return new Response(csv, { headers: { 'Content-Type': 'text/csv', Age: '20' } });
    },
  });
  const value = await reader();
  assert.equal(value.observedAt, 80000);
  assert.equal(opts.method, 'GET');
  assert.equal(opts.redirect, 'error');
  assert.equal(opts.credentials, 'omit');
  assert.throws(() => createExportReader({ url: 'https://attacker.test/export' }));
  assert.throws(() => createExportReader({ url: 'http://www.timberstore.sk/export' }));
  for (const response of [
    new Response('<html>login</html>', { headers: { 'Content-Type': 'text/html' } }),
    new Response(csv, { headers: { Age: '900' } }),
    new Response(csv, { headers: { 'Content-Length': String(40 * 1024 * 1024) } }),
  ]) {
    await assert.rejects(
      createExportReader({ url: secretUrl, fetcher: async () => response })(),
      /export-fetch-failed/,
    );
  }
  await assert.rejects(
    createExportReader({
      url: secretUrl,
      fetcher: async () => {
        throw Error(secretUrl);
      },
    })(),
    (error) => !error.message.includes('hash='),
  );
});
test('Enterprise export config needs no API token, health distinguishes readiness', async (t) => {
  assert.equal(providerFromEnv({ STOCK_SOURCE: 'export' }), null);
  assert.throws(() => providerFromEnv({ STOCK_SOURCE: 'other' }));
  const disabled = providerFromEnv({
    STOCK_SOURCE: 'export',
    SHOPTET_EXPORT_URL: 'https://www.timberstore.sk/action/ExportProducts/export/?hash=TEST',
  });
  assert.equal((await disabled.batch([identity]))[0].reason, 'export-verification-required');
  const p = createExportStockProvider({
    verified: true,
    mode: 'available',
    now: () => 1000,
    readExport: async () => ({ csv, observedAt: 1000 }),
  });
  await p.refresh();
  const server = createStockServer({ provider: p });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  t.after(() => server.close());
  const response = await fetch(`http://127.0.0.1:${server.address().port}/health`);
  assert.equal((await response.json()).source.state, 'export-ready');
});

test('16,000 catalog rows are indexed once, not downloaded per product', async () => {
  const large =
    header +
    '\n' +
    Array.from({ length: 16000 }, (_, i) => `TEST-${i};ks;visible;1;${i % 20};0`).join('\n');
  let reads = 0;
  const provider = createExportStockProvider({
    verified: true,
    mode: 'available',
    now: () => 1000,
    readExport: async () => {
      reads++;
      return { csv: large, observedAt: 1000 };
    },
  });
  await provider.refresh();
  for (let n = 0; n < 10; n++) {
    const items = Array.from({ length: 24 }, (_, i) => ({
      ...identity,
      code: `TEST-${n * 24 + i}`,
    }));
    assert((await provider.batch(items)).every((item) => item.state === 'known'));
  }
  assert.equal(reads, 1);
});

test('TIMBER SKLAD has no effect on the two named CSV warehouses', () => {
  // Model-only row; these are not observations of the user's actual export.
  const input = header + ';stock:TIMBER SKLAD\nTEST-THIRD;pár;visible;1;3;6;990\n';
  assert.deepEqual(parseStockCsv(input).get('TEST-THIRD').amounts, { hricov: 3, csnk: 6 });
});

test('column override cannot relabel TIMBER SKLAD as Hricov', () => {
  const input =
    header.replace('stock:Dolný Hričov', 'stock:TIMBER SKLAD') + '\nTEST-SWAP;pár;visible;1;3;6';
  assert.throws(
    () =>
      parseStockCsv(input, {
        columns: { hricov: 'stock:TIMBER SKLAD', csnk: 'stock:Centrálny sklad' },
      }),
    /warehouse-column-mismatch/,
  );
  const defaultHeader =
    header.replace('stock:Dolný Hričov', 'stock:Dolný Hričov (predvolené)') +
    '\nTEST-DEFAULT;pár;visible;1;3;6';
  assert.equal(
    parseStockCsv(defaultHeader, {
      columns: { hricov: 'stock:Dolný Hričov (predvolené)', csnk: 'stock:Centrálny sklad' },
    }).get('TEST-DEFAULT').amounts.hricov,
    3,
  );
});

test('CSV -> existing HTTP batch -> existing frontend service preserves source age and pair unit', async (t) => {
  const { createStockService } = await import('../../src/core/warehouse-stock.js');
  let time = 1000;
  const provider = createExportStockProvider({
    verified: true,
    mode: 'available',
    now: () => time,
    readExport: async () => ({ csv, observedAt: 1000 }),
  });
  await provider.refresh();
  time = 100000;
  const server = createStockServer({ provider });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(() => server.close());
  const service = createStockService({
    endpoint: `http://127.0.0.1:${server.address().port}/v1/warehouse-stock/batch`,
    now: () => time,
  });
  const record = await service.get(identity);
  assert.equal(record.state, 'known');
  assert.equal(record.source, 'shoptet-export');
  assert.equal(record.asOf, 1000);
  assert.equal(record.unit, 'pár');
  assert.deepEqual(record.warehouses, [
    { key: 'hricov', quantity: 12 },
    { key: 'csnk', quantity: 45 },
  ]);
});
