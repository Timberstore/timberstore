// Page type detection — the only place that reads Shoptet body classes.
// Verified on timberstore.sk (2026-09-26).
const PAGE_CLASSES = {
  order: 'in-moja-objednavka',
  home: 'type-index',
  category: 'type-category',
  detail: 'type-detail',
  search: 'type-search',
  cart: 'ordering-process',
};

export function getPageType(body = document.body) {
  for (const [type, cls] of Object.entries(PAGE_CLASSES)) {
    if (body.classList.contains(cls)) return type;
  }
  return 'other';
}
