// Stock names identify warehouses; never infer them from availability labels.
export const WAREHOUSES = [
  { key: 'hricov', title: 'SKLAD-HRICOV' },
  { key: 'csnk', title: 'SKLAD-CSNK' },
];
export const unknown = (reason) => ({ state: 'unknown', reason });
export function quantity(value) {
  if (typeof value !== 'number' && typeof value !== 'string') return null;
  if (typeof value === 'string' && !/^-?\d+(?:\.\d+)?$/.test(value)) return null;
  const number = Number(value);
  return Number.isFinite(number) && Math.abs(number) <= 1e12 ? number : null;
}
export function mapWarehouses(stocks, explicit = {}) {
  const result = {};
  for (const warehouse of WAREHOUSES) {
    const configuredId =
      explicit[warehouse.key] == null ? '' : String(explicit[warehouse.key]).trim();
    const matches = stocks.filter((stock) =>
      configuredId
        ? String(stock.id) === configuredId
        : stock.title?.trim().toUpperCase() === warehouse.title,
    );
    if (matches.length !== 1) return null;
    result[warehouse.key] = String(matches[0].id);
  }
  return result.hricov !== result.csnk ? result : null;
}
export function makeRecord(identity, amounts, { unit, asOf, expiresAt, source }) {
  if (!unit || typeof unit !== 'string' || unit.length > 30) return unknown('unit-unverified');
  if (!Number.isFinite(asOf) || !Number.isFinite(expiresAt) || expiresAt <= asOf)
    return unknown('invalid-expiry');
  const rows = [];
  for (const { key } of WAREHOUSES) {
    const amount = quantity(amounts[key]);
    if (amount === null) return unknown('incomplete-amounts');
    rows.push({ key, quantity: Math.max(0, amount) });
  }
  return {
    state: 'known',
    productId: String(identity.productId),
    guid: identity.guid || null,
    code: String(identity.code),
    unit,
    warehouses: rows,
    asOf,
    expiresAt,
    source,
  };
}
export function fromNative(payload, identity, now, ttlMs) {
  const stocks = payload?.stocks;
  if (!stocks || !payload.products) return unknown('invalid-native-response');
  const mapping = mapWarehouses(Object.entries(stocks).map(([id, stock]) => ({ ...stock, id })));
  if (!mapping) return unknown('required-warehouses-not-exposed');
  const variant = payload.products[String(identity.productId)]?.codes?.[String(identity.code)];
  if (!variant?.stocks) return unknown('variant-not-found');
  const amounts = Object.fromEntries(
    WAREHOUSES.map(({ key }) => [key, variant.stocks[mapping[key]]]),
  );
  return makeRecord(identity, amounts, {
    unit: identity.unit,
    asOf: now,
    expiresAt: now + ttlMs,
    source: 'shoptet-native',
  });
}
// Semantics must be confirmed against a real API response and an order claim.
// No default: never accidentally subtract a claim twice or expose physical stock.
export function fromApi(product, identity, mapping, mode, now, ttlMs) {
  if (!mapping || !['available', 'physical-minus-claim'].includes(mode))
    return unknown('api-semantics-unverified');
  if (product?.visibility !== 'normal') return unknown('product-not-public');
  if (String(product.guid).toLowerCase() !== String(identity.guid).toLowerCase())
    return unknown('product-mismatch');
  const variant = product.variants?.find((item) => item.code === String(identity.code));
  if (!variant || variant.visible !== true || !Array.isArray(variant.perStockAmounts))
    return unknown('variant-stock-unavailable');
  const amounts = {};
  for (const { key } of WAREHOUSES) {
    const records = variant.perStockAmounts.filter((row) => String(row.stockId) === mapping[key]);
    if (records.length !== 1) return unknown('incomplete-amounts');
    const amount = quantity(records[0].amount);
    const claim = quantity(records[0].claim);
    if (amount === null || (mode === 'physical-minus-claim' && (claim === null || claim < 0)))
      return unknown('incomplete-amounts');
    amounts[key] = mode === 'available' ? amount : Math.round((amount - claim) * 1e6) / 1e6;
  }
  return makeRecord(identity, amounts, {
    unit: variant.unit,
    asOf: now,
    expiresAt: now + ttlMs,
    source: 'shoptet-api',
  });
}
export function validRecord(record, identity, now) {
  return (
    record?.state === 'known' &&
    record.productId === String(identity.productId) &&
    record.code === String(identity.code) &&
    (!identity.guid || record.guid?.toLowerCase() === identity.guid.toLowerCase()) &&
    Number.isFinite(record.asOf) &&
    record.asOf <= now + 5000 &&
    Number.isFinite(record.expiresAt) &&
    record.expiresAt > record.asOf &&
    record.expiresAt > now &&
    record.expiresAt - record.asOf <= 60000 &&
    typeof record.unit === 'string' &&
    record.unit.length > 0 &&
    record.unit.length <= 30 &&
    Array.isArray(record.warehouses) &&
    record.warehouses.length === 2 &&
    WAREHOUSES.every(
      ({ key }, i) =>
        record.warehouses[i].key === key &&
        quantity(record.warehouses[i].quantity) !== null &&
        record.warehouses[i].quantity >= 0,
    )
  );
}
