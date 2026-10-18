import test from 'node:test';
import assert from 'node:assert/strict';
import { getWarehouseRows, getWarehousePreviewRows } from '../src/core/warehouse-stock.js';
const fixture = (local, central) => ({
  stocks: [
    { id: 1, title: 'Dolný Hričov' },
    { id: 2, title: 'Centrálny sklad' },
  ],
  product: {
    hasVariants: false,
    codes: [
      {
        code: '467126',
        stocks: [
          { id: 1, quantity: local },
          { id: 2, quantity: central },
        ],
      },
    ],
  },
});
test('shows both warehouses independently', () => {
  assert.deepEqual(getWarehouseRows(fixture('9', '232')), [
    { kind: 'local', quantity: '9' },
    { kind: 'central', quantity: '232' },
  ]);
});
test('hides zero local stock', () => {
  assert.deepEqual(getWarehouseRows(fixture('0', '> 100')), [
    { kind: 'central', quantity: '> 100' },
  ]);
});
test('hides zero central stock and preserves decimal units', () => {
  assert.deepEqual(getWarehouseRows(fixture('1.5', '0')), [{ kind: 'local', quantity: '1,5' }]);
});
test('keeps native unavailable presentation when both are zero', () =>
  assert.equal(getWarehouseRows(fixture(0, 0)), null));
test('never treats the current ext aggregate as central stock', () => {
  const data = {
    stocks: [{ id: 'ext', title: 'Sklad' }],
    product: { codes: [{ stocks: [{ id: 'ext', quantity: '> 100' }] }] },
  };
  assert.equal(getWarehouseRows(data), null);
});
test('missing, malformed, hidden or duplicate warehouses do not imply zero', () => {
  for (const mutate of [
    (d) => d.product.codes[0].stocks.pop(),
    (d) => (d.product.codes[0].stocks[0].quantity = 'unknown'),
    (d) => (d.stocks[0].visibleOnEshop = 0),
    (d) => d.stocks.push(d.stocks[0]),
    (d) => (d.product.hasVariants = true),
  ]) {
    const d = fixture('9', '232');
    mutate(d);
    assert.equal(getWarehouseRows(d), null);
  }
});

test('synthetic preview is unavailable outside preview mode', () => {
  assert.equal(getWarehousePreviewRows('both', false), null);
  assert.equal(getWarehousePreviewRows('unexpected', true), null);
  assert.equal(getWarehousePreviewRows('__proto__', true), null);
});
test('preview supports all four warehouse scenarios', () => {
  assert.deepEqual(getWarehousePreviewRows('both', true), [
    { kind: 'local', quantity: '7' },
    { kind: 'central', quantity: '140' },
  ]);
  assert.deepEqual(getWarehousePreviewRows('central', true), [
    { kind: 'central', quantity: '140' },
  ]);
  assert.deepEqual(getWarehousePreviewRows('local', true), [{ kind: 'local', quantity: '7' }]);
  assert.deepEqual(getWarehousePreviewRows('empty', true), []);
});
