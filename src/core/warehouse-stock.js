// Named warehouse data only: Shoptet's synthetic "ext" can be an aggregate.
const normalize = (value) =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

export function positiveQuantity(value) {
  if (typeof value !== 'number' && typeof value !== 'string') return null;
  const text = String(value)
    .trim()
    .replace(/\u00a0/g, ' ');
  if (!/^(?:>\s*)?\d+(?:[.,]\d+)?$/.test(text)) return null;
  const amount = Number(text.replace(/^>\s*/, '').replace(',', '.'));
  if (!Number.isFinite(amount)) return null;
  return { positive: amount > 0, text: text.replace('.', ',') };
}

export function getWarehouseRows(data) {
  // Variant selection requires its own verified binding before enabling here.
  if (!data?.product || data.product.hasVariants || data.product.codes?.length !== 1) return null;
  const definitions = data.stocks;
  const quantities = data.product.codes[0].stocks;
  if (!Array.isArray(definitions) || !Array.isArray(quantities)) return null;
  const names = { local: 'dolny hricov', central: 'centralny sklad' };
  const rows = [];
  for (const [kind, title] of Object.entries(names)) {
    const matches = definitions.filter(
      (stock) => normalize(stock.title) === title && stock.visibleOnEshop !== 0,
    );
    if (matches.length !== 1) return null;
    const matchesQuantity = quantities.filter(
      (stock) => String(stock.id) === String(matches[0].id),
    );
    if (matchesQuantity.length !== 1) return null;
    const quantity = positiveQuantity(matchesQuantity[0].quantity);
    if (!quantity) return null;
    if (quantity.positive) rows.push({ kind, quantity: quantity.text });
  }
  return rows.length ? rows : null;
}

export function readWarehouseRows() {
  try {
    return getWarehouseRows(window.getShoptetDataLayer?.());
  } catch {
    return null;
  }
}
