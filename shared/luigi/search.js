// LB1 · Documented Search API boundary. Not registered in the storefront bundle.
// A native renderer / approved vendor template must own presentation and purchase.
const ENDPOINT = 'https://live.luigisbox.com/search';
const INTERNAL = /^(?:creation_time|#.*|uuid|category_uuid|boost|boosted_via|.*as_received.*)$/;
const asParams = (value) => new URLSearchParams(value);

function customerField(field, fields) {
  if (!fields.includes(field) || INTERNAL.test(field)) {
    throw new Error(`Unapproved customer field: ${field}`);
  }
}

export function readSearchState(search) {
  const params = asParams(search);
  const page = Number(params.get('page') || 1);
  if (!Number.isSafeInteger(page) || page < 1) throw new Error('Invalid page');
  return {
    query: params.get('q') || '',
    filters: params.getAll('f[]'),
    sort: params.get('sort') || '',
    page,
  };
}

export function writeSearchState(state) {
  const params = new URLSearchParams();
  params.set('q', state.query);
  for (const filter of state.filters) params.append('f[]', filter);
  if (state.sort) params.set('sort', state.sort);
  if (state.page > 1) params.set('page', String(state.page));
  return params;
}

export function changeSearchState(state, patch) {
  // Filter/sort/query changes retain the other selections, but restart pagination.
  return { ...state, ...patch, page: patch.page ?? 1 };
}

export function buildSearchRequest(state, config) {
  const { trackerId, facets, sorts, size = 24 } = config;
  if (typeof state.query !== 'string' || !Array.isArray(state.filters) ||
      !Number.isSafeInteger(state.page) || state.page < 1) throw new Error('Invalid search state');
  if (!trackerId || !Array.isArray(facets) || !Array.isArray(sorts)) {
    throw new Error('Tracker and approved facet/sort contracts are required');
  }
  if (!Number.isInteger(size) || size < 1 || size > 200) throw new Error('Invalid size');
  for (const facet of facets) customerField(facet, facets);
  for (const filter of state.filters) {
    const colon = filter.indexOf(':');
    if (colon < 1 || !filter.slice(colon + 1)) throw new Error('Invalid filter');
    customerField(filter.slice(0, colon), facets);
  }
  if (state.sort) {
    if (!sorts.includes(state.sort)) throw new Error('Unapproved sort');
    const field = state.sort.slice(0, state.sort.lastIndexOf(':'));
    if (INTERNAL.test(field)) throw new Error('Internal sort');
  }
  const url = new URL(ENDPOINT);
  url.search = writeSearchState(state);
  url.searchParams.set('tracker_id', trackerId);
  // Observed TIMBER STORE content type is product; not the docs' sample item type.
  url.searchParams.append('f[]', 'type:product');
  url.searchParams.set('size', String(size));
  url.searchParams.set('facets', facets.join(','));
  url.searchParams.set('dynamic_facets_size', '0');
  // No user/client IDs are generated here. Analytics identity requires a separate
  // approved collector/consent contract before this boundary is connected to UI.
  return url;
}

export async function searchProducts(state, config, fetchResponse = fetch, signal) {
  const response = await fetchResponse(buildSearchRequest(state, config), { signal });
  if (!response.ok) throw new Error(`Luigi Search HTTP ${response.status}`);
  const data = await response.json();
  const results = data.results;
  if (!results || !Array.isArray(results.hits) ||
      !Number.isSafeInteger(results.total_hits) || results.total_hits < 0) {
    throw new Error('Invalid Search response contract');
  }
  if (results.hits.some((hit) => hit.type !== 'product')) {
    throw new Error('Non-product result in product collection');
  }
  // A contract violation is surfaced, never hidden by CSS or silently omitted.
  for (const facet of results.facets || []) customerField(facet.name, config.facets);
  return results;
}

// Provisional normalized contract, not claimed to be existing Luigi field names.
// Used for supplier handoff/preflight only; does not enable a cart control.
export function purchaseContractProblems(product) {
  const missing = [];
  const required = (name, valid) => { if (!valid) missing.push(name); };
  const positive = (n) => typeof n === 'number' && Number.isFinite(n) && n > 0;
  const money = (n) => typeof n === 'number' && Number.isFinite(n) && n >= 0;
  required('identity', typeof product.identity === 'string' && !!product.identity);
  required('sku', typeof product.sku === 'string' && !!product.sku);
  required('title', typeof product.title === 'string' && !!product.title.trim());
  required('unit', typeof product.unit === 'string' && !!product.unit);
  required('prices.gross', money(product.prices?.gross));
  required('prices.net', money(product.prices?.net));
  required('prices.currency', typeof product.prices?.currency === 'string' && !!product.prices.currency);
  required('prices.context', typeof product.prices?.context === 'string' && !!product.prices.context);
  required('stock.warehouses', Array.isArray(product.stock?.warehouses) && product.stock.warehouses.length > 0 &&
    product.stock.warehouses.every((w) => typeof w.id === 'string' && typeof w.unit === 'string' &&
      money(w.quantity) && typeof w.label === 'string' && typeof w.displayQuantity === 'string'));
  required('purchase.orderable', typeof product.purchase?.orderable === 'boolean');
  required('purchase.minimum', positive(product.purchase?.minimum));
  required('purchase.step', positive(product.purchase?.step));
  required('purchase.packMultiple', positive(product.purchase?.packMultiple));
  required('purchase.maximum', product.purchase?.maximum === null || (positive(product.purchase?.maximum) && product.purchase.maximum >= product.purchase.minimum));
  required('purchase.binding', typeof product.purchase?.binding === 'string' && !!product.purchase.binding);
  required('variant.selectionRequired', typeof product.variant?.selectionRequired === 'boolean');
  if (product.variant?.selectionRequired) required('variant.selectionContract', !!product.variant.selectionContract);
  required('flags.codes', Array.isArray(product.flags?.codes) && product.flags.codes.every((c) => typeof c === 'string'));
  required('source.updatedAt', typeof product.source?.updatedAt === 'string' &&
    Number.isFinite(Date.parse(product.source.updatedAt)));
  return missing;
}
