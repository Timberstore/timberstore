import test from 'node:test';
import assert from 'node:assert/strict';
import { readSearchState, writeSearchState, changeSearchState, buildSearchRequest, searchProducts, purchaseContractProblems } from '../shared/luigi/search.js';
const config = { trackerId: 'test', facets: ['brand', 'color', 'price_amount'], sorts: ['price_amount:asc'] };
test('filter combinations survive URL/history roundtrip and changing sort', () => {
  const original = { query: 'BLUM 450', filters: ['brand:BLUM', 'color:Biela', 'price_amount:1|100'], sort: '', page: 3 };
  const sorted = changeSearchState(original, { sort: 'price_amount:asc' });
  assert.equal(sorted.page, 1);
  assert.deepEqual(readSearchState(writeSearchState(sorted)), sorted);
  assert.deepEqual(readSearchState(writeSearchState(original)), original);
  const url = buildSearchRequest(sorted, config);
  assert.deepEqual(url.searchParams.getAll('f[]'), [...original.filters, 'type:product']);
  assert.equal(url.searchParams.get('dynamic_facets_size'), '0');
});
test('internal fields are rejected in requests and unexpected API responses', async () => {
  const state = readSearchState('?q=x&f%5B%5D=creation_time%3A2026');
  assert.throws(() => buildSearchRequest(state, config), /Unapproved/);
  assert.throws(() => buildSearchRequest(readSearchState('?q=x'), { ...config, facets: ['creation_time'] }), /Unapproved/);
  await assert.rejects(searchProducts(readSearchState('?q=x'), config, async () => ({ ok: true, json: async () => ({ results: { total_hits: 1, hits: [{ type: 'product' }], facets: [{ name: 'creation_time' }] } }) })), /Unapproved/);
});
test('a failed API or mixed count is not accepted as a successful product search', async () => {
  const state = readSearchState('?q=x');
  await assert.rejects(searchProducts(state, config, async () => ({ ok: false, status: 503 })), /503/);
  await assert.rejects(searchProducts(state, config, async () => ({ ok: true, json: async () => ({ results: { total_hits: 2, hits: [{ type: 'article' }] } }) })), /Non-product/);
});
test('price + minimum alone cannot qualify a buy control', () => {
  const problems = purchaseContractProblems({ identity: '/sku/', sku: 'test', unit: 'balenie', prices: { gross: 100 }, purchase: { minimum: 1 } });
  assert(problems.includes('prices.net'));
  assert(problems.includes('purchase.step'));
  assert(problems.includes('purchase.packMultiple'));
  assert(problems.includes('purchase.orderable'));
});
// Synthetic contract tests only, never claimed as live product acceptance.
const complete = { identity: '/test/', sku: 'test', title: 'Synthetic contract fixture', unit: 'm', prices: { gross: 2.46, net: 2, currency: 'EUR', context: 'anonymous' }, stock: { warehouses: [{ id: 'test', label: 'Skladom', quantity: 0, unit: 'm', displayQuantity: '0 m' }] }, purchase: { orderable: false, minimum: 0.5, step: 0.1, packMultiple: 1, maximum: null, binding: 'supplier-supported-binding' }, variant: { selectionRequired: false }, flags: { codes: [] }, source: { updatedAt: '2026-11-03T00:00:00Z' } };
test('zero stock/unorderable and decimal quantities remain explicit, not guessed', () => {
  assert.deepEqual(purchaseContractProblems(complete), []);
  assert(purchaseContractProblems({ ...complete, purchase: { ...complete.purchase, step: undefined } }).includes('purchase.step'));
  assert(purchaseContractProblems({ ...complete, variant: { selectionRequired: true } }).includes('variant.selectionContract'));
});
