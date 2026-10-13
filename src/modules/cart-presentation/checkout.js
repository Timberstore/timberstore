import { SEL } from '../../core/selectors.js';

// Native method prices are numeric; recap spans omit those attributes. Borrow
// the selected method value when available, never compute or overwrite prices.
export function syncCheckoutPriceAccents() {
  const summary = document.querySelector(SEL.checkoutSummary);
  if (!summary) return;
  const prices = [...summary.querySelectorAll(SEL.checkoutRecapPrice)];
  const methods = [...document.querySelectorAll(SEL.checkoutSelectedMethod)]
    .map((input) => input.closest(SEL.checkoutMethodRow)?.querySelector(SEL.checkoutMethodPrice))
    .filter(Boolean);
  prices.forEach((price, index) => {
    const method = prices.length === 2 && methods.length === 2 ? methods[index] : null;
    const raw =
      method?.getAttribute('data-shipping-price-wv') ??
      method?.getAttribute('data-billing-price-wv');
    const known = raw != null && raw.trim() !== '' && Number.isFinite(Number(raw));
    // The final step has server-formatted recap amounts but no method radios.
    const free = known
      ? Number(raw) === 0 && !method.classList.contains('shipping-price-not-specified')
      : /^(?:ZADARMO|0(?:[,.]0+)?\s*€)$/i.test(price.textContent.trim());
    if (price.classList.contains('ts-checkout-free-price') !== free)
      price.classList.toggle('ts-checkout-free-price', free);
  });
}
