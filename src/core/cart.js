// Cart contents from Shoptet's dataLayer — the only place that reads it.
// Items look like { code, priceId, quantity, … } (verified in Shoptet's main.js, 2026-09-26).

/** Map of priceId (string) → quantity in the cart. Empty map when unavailable. */
export function getCartQuantities() {
  const map = new Map();
  let items = [];
  try {
    items = window.getShoptetDataLayer?.('cart') || [];
  } catch {
    return map;
  }
  for (const item of items) {
    if (item && item.priceId != null) {
      const id = String(item.priceId);
      map.set(id, (map.get(id) || 0) + (Number(item.quantity) || 0));
    }
  }
  return map;
}

/** Native shipping eligibility/threshold metadata; never invent a fallback limit. */
export function getCartInfo() {
  try {
    return window.getShoptetDataLayer?.('cartInfo') || null;
  } catch {
    return null;
  }
}

/** Authoritative server shipping remainder, formatted amount and progress.
 * Only the progress percentage is derived; no price or eligibility is computed.
 */
export function getCartShippingPresentation() {
  const info = getCartInfo();
  const threshold = Number(info?.freeShippingFrom);
  const left = info?.leftToFreeShipping?.priceLeft;
  const formatted = info?.leftToFreeShipping?.formattedPrice;
  if (!(threshold > 0) || typeof left !== 'number' || !Number.isFinite(left)) return null;
  if (left > 0 && typeof formatted !== 'string') return null;
  return {
    complete: left <= 0,
    remaining: formatted,
    percent: Math.max(0, Math.min(100, 100 * (1 - left / threshold))),
  };
}
