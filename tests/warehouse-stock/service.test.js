import test from 'node:test';
import assert from 'node:assert/strict';
import { createStockService } from '../../src/core/warehouse-stock.js';
const identity = (n) => ({
  productId: String(n),
  guid: `${String(n).padStart(8, '0')}-1111-1111-1111-111111111111`,
  code: `SKU-${n}`,
  unit: 'ks',
});
function known(item, time) {
  return {
    ...item,
    state: 'known',
    asOf: time,
    expiresAt: time + 30000,
    source: 'test-contract',
    warehouses: [
      { key: 'hricov', quantity: 12 },
      { key: 'csnk', quantity: 45 },
    ],
  };
}
test('client batches 50 items, deduplicates and caps concurrent requests at 2', async () => {
  let calls = 0,
    active = 0,
    max = 0;
  const svc = createStockService({
    endpoint: 'https://stock.test/batch',
    now: () => 1000,
    fetcher: async (_, opts) => {
      calls++;
      active++;
      max = Math.max(max, active);
      await new Promise((r) => setTimeout(r, 10));
      active--;
      return {
        ok: true,
        json: async () => ({ items: JSON.parse(opts.body).items.map((i) => known(i, 1000)) }),
      };
    },
  });
  const work = Array.from({ length: 50 }, (_, n) => svc.get(identity(n)));
  work.push(svc.get(identity(1)));
  const results = await Promise.all(work);
  assert.equal(calls, 3);
  assert(max <= 2);
  assert(results.every((r) => r.state === 'known'));
  await svc.get(identity(1));
  assert.equal(calls, 3);
});
test('expired data and failed refresh return unknown, never stale quantities', async () => {
  let time = 1000,
    calls = 0;
  const svc = createStockService({
    endpoint: 'https://stock.test/batch',
    now: () => time,
    fetcher: async (_, opts) => {
      calls++;
      if (calls > 1) throw Error('offline');
      return {
        ok: true,
        json: async () => ({ items: JSON.parse(opts.body).items.map((i) => known(i, time)) }),
      };
    },
  });
  assert.equal((await svc.get(identity(1))).state, 'known');
  time = 31001;
  assert.equal((await svc.get(identity(1))).state, 'unknown');
});
test('mismatched response SKU never leaks into the requested product', async () => {
  const svc = createStockService({
    endpoint: 'https://stock.test/batch',
    now: () => 1000,
    fetcher: async () => ({ ok: true, json: async () => ({ items: [known(identity(9), 1000)] }) }),
  });
  assert.equal((await svc.get(identity(1))).state, 'unknown');
});

test('native data needs verification; unknown warehouses trigger bounded discovery', async (t) => {
  const previous = globalThis.window;
  globalThis.window = { location: { origin: 'https://www.timberstore.sk' } };
  t.after(() => {
    globalThis.window = previous;
  });
  const item = identity(101);
  let time = 1000,
    calls = 0,
    exposed = true;
  const svc = createStockService({
    endpoint: null,
    nativeUrl: () => '/action/ProductStockAmount/',
    now: () => time,
    fetcher: async () => {
      calls++;
      const stocks = exposed
        ? { 7: { title: 'SKLAD-HRICOV' }, 9: { title: 'SKLAD-CSNK' } }
        : { ext: { title: 'Sklad' } };
      const products = { 101: { codes: { 'SKU-101': { stocks: { 7: '12', 9: '45' } } } } };
      return { ok: true, json: async () => ({ payload: { stocks, products } }) };
    },
  });
  assert.equal((await svc.get(item)).reason, 'native-semantics-unverified');
  exposed = false;
  time += 31000;
  assert.equal((await svc.get(item)).reason, 'required-warehouses-not-exposed');
  time += 31000;
  await svc.get(item);
  assert.equal(calls, 2);
  time += 301000;
  await svc.get(item);
  assert.equal(calls, 3);
});
