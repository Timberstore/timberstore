// Shoptet custom events — the only place with their names.
export const SHOPTET_EVENTS = {
  // Fired after Shoptet replaces page content via AJAX (filters, pagination, sorting)
  pageContentLoaded: 'ShoptetDOMPageContentLoaded',
  // Fired after "load more products" appends the next page to the listing
  moreProductsLoaded: 'ShoptetDOMPageMoreProductsLoaded',
  // Cart changed (add, remove, amount); the dataLayer cart is already updated
  cartUpdated: 'ShoptetCartUpdated',
  // Emitted after the cart wrapper is replaced, including rejected quantities.
  cartContentLoaded: 'ShoptetDOMCartContentLoaded',
  dataLayerUpdated: 'ShoptetDataLayerUpdated',
  orderDataLoaded: 'OrderWithdrawDataLoaded',
};

// Events after which modules re-run on the (partly) new DOM.
export const CONTENT_EVENTS = [SHOPTET_EVENTS.pageContentLoaded, SHOPTET_EVENTS.moreProductsLoaded];
