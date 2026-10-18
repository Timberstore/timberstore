import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createApiStockProvider,
  createShoptetRequest,
} from '../../backend/warehouse-stock/provider.js';
import { createStockServer, validItems } from '../../backend/warehouse-stock/server.js';
const id = { productId: '101', guid: '11111111-1111-1111-1111-111111111111', code: '0001' };
const data = {
  guid: id.guid,
  visibility: 'normal',
  variants: [
    {
      code: '0001',
      visible: true,
      unit: 'ks',
      perStockAmounts: [
        { stockId: 7, amount: '17', claim: '5' },
        { stockId: 9, amount: '45', claim: '0' },
      ],
    },
  ],
};
test('API disabled until real credentials/semantics verification', async () => {
  const provider = createApiStockProvider({
    request: () => {
      throw Error('must not call');
    },
  });
  assert.equal((await provider.batch([id]))[0].state, 'unknown');
});
test('per-GUID cache and single flight do not reset observation age', async () => {
  let time = 1000,
    products = 0;
  const provider = createApiStockProvider({
    verified: true,
    mode: 'physical-minus-claim',
    now: () => time,
    request: async (path) => {
      if (path === '/api/eshop') return { data: { contactInformation: { eshopId: 765909 } } };
      if (path === '/api/stocks')
        return {
          data: {
            stocks: [
              { id: 7, title: 'SKLAD-HRICOV' },
              { id: 9, title: 'SKLAD-CSNK' },
            ],
          },
        };
      products++;
      await new Promise((r) => setTimeout(r, 5));
      return { data };
    },
  });
  const results = await Promise.all([provider.batch([id]), provider.batch([id])]);
  assert.equal(products, 1);
  assert.equal(results[0][0].warehouses[0].quantity, 12);
  time = 2000;
  assert.equal((await provider.batch([id]))[0].asOf, 1000);
  time = 31001;
  await provider.batch([id]);
  assert.equal(products, 2);
});
test('server upstream requests are read-only and token stays in headers', async () => {
  let options;
  const request = createShoptetRequest({
    accessToken: 'TEST-SECRET-NOT-A-REAL-TOKEN',
    fetcher: async (url, opts) => {
      options = opts;
      assert(url.startsWith('https://api.myshoptet.com/api/'));
      return { ok: true, json: async () => ({ data: {} }) };
    },
  });
  await request('/api/stocks');
  assert.equal(options.method, 'GET');
  assert.equal(options.headers['Shoptet-Access-Token'], 'TEST-SECRET-NOT-A-REAL-TOKEN');
  await assert.rejects(request('/api/orders'));
  assert.throws(() => createShoptetRequest({}));
});
test('backend global concurrency and API budget bound upstream load', async () => {
  let active = 0,
    max = 0;
  const provider = createApiStockProvider({
    verified: true,
    mode: 'available',
    maxPerMinute: 10,
    request: async (path) => {
      if (path === '/api/eshop') return { data: { contactInformation: { eshopId: 765909 } } };
      if (path === '/api/stocks')
        return {
          data: {
            stocks: [
              { id: 7, title: 'SKLAD-HRICOV' },
              { id: 9, title: 'SKLAD-CSNK' },
            ],
          },
        };
      active++;
      max = Math.max(max, active);
      await new Promise((r) => setTimeout(r, 5));
      active--;
      return { data: { ...data, guid: path.split('/')[3].split('?')[0] } };
    },
  });
  await provider.batch(
    Array.from({ length: 12 }, (_, i) => ({
      ...id,
      guid: `${String(i).padStart(8, '0')}-1111-1111-1111-111111111111`,
    })),
  );
  assert(max <= 4);
});
test('input contracts reject oversized batches and unrelated identifiers', () => {
  assert(validItems([id]));
  assert(!validItems(Array(25).fill(id)));
  assert(!validItems([{ ...id, guid: '../../orders' }]));
  assert(!validItems([{ ...id, code: null }]));
});
test('public HTTP boundary: CORS, validation, sanitized output and no-source 503', async (t) => {
  const server = createStockServer({
    provider: {
      batch: async (items) =>
        items.map((i) => ({ ...i, state: 'unknown', reason: 'test-contract' })),
    },
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  t.after(() => server.close());
  const url = `http://127.0.0.1:${server.address().port}/v1/warehouse-stock/batch`;
  let response = await fetch(url, {
    method: 'POST',
    headers: { Origin: 'https://other.test' },
    body: JSON.stringify({ items: [id] }),
  });
  assert.equal(response.status, 403);
  response = await fetch(url, {
    method: 'POST',
    headers: { Origin: 'https://www.timberstore.sk' },
    body: JSON.stringify({ items: [id] }),
  });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('access-control-allow-origin'), 'https://www.timberstore.sk');
  assert(!(await response.text()).includes('Shoptet-Access-Token'));
  response = await fetch(url, { method: 'POST', body: 'invalid' });
  assert.equal(response.status, 400);
  response = await fetch(url, { method: 'POST', body: 'a'.repeat(17000) });
  assert.equal(response.status, 413);
  const empty = createStockServer();
  await new Promise((r) => empty.listen(0, '127.0.0.1', r));
  t.after(() => empty.close());
  response = await fetch(`http://127.0.0.1:${empty.address().port}/v1/warehouse-stock/batch`, {
    method: 'POST',
    body: JSON.stringify({ items: [id] }),
  });
  assert.equal(response.status, 503);
});

test('token for a different shop never exposes product stocks', async () => {
  let calls = 0;
  const provider = createApiStockProvider({
    verified: true,
    mode: 'available',
    request: async () => {
      calls++;
      return { data: { contactInformation: { eshopId: 999 } } };
    },
  });
  assert.equal((await provider.batch([id]))[0].state, 'unknown');
  assert.equal(calls, 1);
});
