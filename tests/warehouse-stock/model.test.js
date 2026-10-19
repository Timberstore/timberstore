import test from 'node:test';
import assert from 'node:assert/strict';
import {
  quantity,
  mapWarehouses,
  fromNative,
  fromApi,
  validRecord,
} from '../../shared/warehouse-stock/model.js';
import { detailIdentity } from '../../src/core/warehouse-identity.js';
const id = {
  productId: '101',
  guid: '11111111-1111-1111-1111-111111111111',
  code: '0001',
  unit: 'ks',
};
const mapping = { hricov: '7', csnk: '9' };
const product = (amount = '17', claim = '5') => ({
  guid: id.guid,
  visibility: 'normal',
  variants: [
    {
      code: '0001',
      visible: true,
      unit: 'ks',
      perStockAmounts: [
        { stockId: 9, amount: '45', claim: '0' },
        { stockId: 7, amount, claim },
      ],
    },
    {
      code: '0002',
      visible: true,
      unit: 'm',
      perStockAmounts: [
        { stockId: 7, amount: '0', claim: '0' },
        { stockId: 9, amount: '8.125', claim: '0' },
      ],
    },
  ],
});
test('unknown never becomes zero; bounds and fractions stay strict', () => {
  for (const value of [
    null,
    undefined,
    false,
    '',
    ' ',
    '12 ks',
    '>100',
    Infinity,
    NaN,
    '1,25',
    1e13,
  ])
    assert.equal(quantity(value), null);
  assert.equal(quantity('0'), 0);
  assert.equal(quantity('12.125'), 12.125);
  assert.equal(quantity('-3'), -3);
});
test('warehouse identity is exact and never inferred from generic ext', () => {
  assert.equal(mapWarehouses([{ id: 'ext', title: 'Sklad' }]), null);
  assert.deepEqual(
    mapWarehouses([
      { id: 9, title: 'Centrálny sklad' },
      { id: 7, title: 'Dolný Hričov' },
    ]),
    mapping,
  );
  assert.equal(
    mapWarehouses([
      { id: 7, title: 'Centrálny sklad' },
      { id: 7, title: 'Dolný Hričov' },
    ]),
    null,
  );
});
test('real observed public ext response is refused, not labeled central', () => {
  const result = fromNative(
    {
      stocks: { ext: { title: 'Sklad' } },
      products: { 101: { codes: { '0001': { amount: '23', stocks: { ext: '23' } } } } },
    },
    id,
    1000,
    30000,
  );
  assert.equal(result.state, 'unknown');
  assert.equal(result.reason, 'required-warehouses-not-exposed');
});
test('native missing stock, boolean false and missing unit are not guessed', () => {
  const base = {
    stocks: { 7: { title: 'Dolný Hričov' }, 9: { title: 'Centrálny sklad' } },
    products: { 101: { codes: { '0001': { stocks: { 7: '12', 9: '45' } } } } },
  };
  const known = fromNative(base, id, 1000, 30000);
  assert.deepEqual(
    known.warehouses.map((r) => r.quantity),
    [12, 45],
  );
  assert.equal(fromNative(base, { ...id, unit: null }, 1000, 30000).state, 'unknown');
  delete base.products[101].codes['0001'].stocks[9];
  assert.equal(fromNative(base, id, 1000, 30000).state, 'unknown');
  base.products[101].codes['0001'].stocks[9] = false;
  assert.equal(fromNative(base, id, 1000, 30000).state, 'unknown');
});
test('reservation semantics must be explicit; never subtract claims twice', () => {
  assert.equal(fromApi(product(), id, mapping, undefined, 1000, 30000).state, 'unknown');
  assert.deepEqual(
    fromApi(product(), id, mapping, 'physical-minus-claim', 1000, 30000).warehouses.map(
      (r) => r.quantity,
    ),
    [12, 45],
  );
  assert.deepEqual(
    fromApi(product('12', '5'), id, mapping, 'available', 1000, 30000).warehouses.map(
      (r) => r.quantity,
    ),
    [12, 45],
  );
  assert.deepEqual(
    fromApi(product('-1', '0'), id, mapping, 'physical-minus-claim', 1000, 30000).warehouses.map(
      (r) => r.quantity,
    ),
    [0, 45],
  );
  assert.equal(
    fromApi(product('12', null), id, mapping, 'physical-minus-claim', 1000, 30000).state,
    'unknown',
  );
});
test('variants, fractions, hidden products, unknown warehouse and expiry', () => {
  const second = fromApi(product(), { ...id, code: '0002' }, mapping, 'available', 1000, 30000);
  assert.deepEqual(
    second.warehouses.map((r) => r.quantity),
    [0, 8.125],
  );
  assert.equal(second.unit, 'm');
  assert(validRecord(second, { ...id, code: '0002' }, 2000));
  assert(!validRecord(second, id, 2000));
  assert(!validRecord(second, { ...id, code: '0002' }, 31000));
  assert.equal(
    fromApi({ ...product(), visibility: 'hidden' }, id, mapping, 'available', 1000, 30000).state,
    'unknown',
  );
  assert.equal(
    fromApi(product(), id, { ...mapping, csnk: '22' }, 'available', 1000, 30000).state,
    'unknown',
  );
  assert.equal(
    fromApi(product(), { ...id, guid: 'different' }, mapping, 'available', 1000, 30000).state,
    'unknown',
  );
});
test('variant identity uses SKU, not priceId or the previously selected option', () => {
  const p = {
    id: 101,
    guid: id.guid,
    hasVariants: true,
    codes: [{ code: '0001' }, { code: '0002' }],
  };
  const tracking = {
    301: { base_id: 101, content_ids: ['0001'] },
    302: { base_id: 101, content_ids: ['0002'] },
    303: { base_id: 999, content_ids: ['0001'] },
  };
  assert.equal(detailIdentity(p, '301', tracking).code, '0001');
  assert.equal(detailIdentity(p, '302', tracking).code, '0002');
  assert.equal(detailIdentity(p, '0', tracking), null);
  assert.equal(detailIdentity(p, '303', tracking), null);
  assert.equal(detailIdentity(p, '404', tracking), null);
  // A stale visible SKU must not be used when the selected priceId has no mapping.
  assert.equal(detailIdentity(p, '404', tracking), null);
});

test('empty optional environment IDs use exact warehouse names', () => {
  assert.deepEqual(
    mapWarehouses(
      [
        { id: 7, title: 'Dolný Hričov' },
        { id: 9, title: 'Centrálny sklad' },
      ],
      { hricov: '', csnk: '' },
    ),
    { hricov: '7', csnk: '9' },
  );
});

test('real names read source IDs in any order; TIMBER SKLAD never aliases a target', () => {
  // Synthetic ID fixtures, not verified IDs of TimberStore warehouses.
  const stocks = [
    { id: 11, title: 'TIMBER SKLAD' },
    { id: 9, title: 'Centrálny sklad' },
    { id: 7, title: 'Dolný Hričov' },
  ];
  assert.deepEqual(mapWarehouses(stocks), { hricov: '7', csnk: '9' });
  assert.deepEqual(mapWarehouses([...stocks].reverse()), { hricov: '7', csnk: '9' });
  assert.equal(mapWarehouses(stocks, { hricov: 11, csnk: 9 }), null);
  assert.equal(
    mapWarehouses([
      { id: 7, title: 'SKLAD-HRICOV' },
      { id: 9, title: 'SKLAD-CSNK' },
    ]),
    null,
  );
  assert.equal(
    mapWarehouses([
      { id: 'ext', title: 'Dolný Hričov' },
      { id: 9, title: 'Centrálny sklad' },
    ]),
    null,
  );
  const native = {
    stocks: Object.fromEntries(stocks.map(({ id, title }) => [id, { title }])),
    products: {
      101: { codes: { '0001': { amount: '999', stocks: { 7: '3', 9: '6', 11: '990' } } } },
    },
  };
  assert.deepEqual(fromNative(native, id, 1000, 30000).warehouses, [
    { key: 'hricov', quantity: 3 },
    { key: 'csnk', quantity: 6 },
  ]);
});

test('pair display uses Slovak forms without converting pairs to pieces', async () => {
  const { stockUnit } = await import('../../src/core/warehouse-unit.js');
  assert.equal(stockUnit('pár', 1), 'pár');
  assert.equal(stockUnit('pár', 2), 'páry');
  assert.equal(stockUnit('pár', 193), 'párov');
  assert.equal(stockUnit('pár', 1.5), 'páru');
  assert.equal(stockUnit('ks', 193), 'ks');
  assert.equal(stockUnit('sada', 2), 'sada');
});
