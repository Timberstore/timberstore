import { TEXTS } from '../../core/texts.js';
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

export function syncCheckoutDispatchNote() {
  const expected =
    TEXTS.checkout.dispatchPrefix + TEXTS.checkout.dispatchAccent + TEXTS.checkout.dispatchSuffix;
  for (const line of document.querySelectorAll(SEL.checkoutDispatchLines)) {
    const text = line.textContent.replace(/\s+/g, ' ').trim();
    if (
      ![
        TEXTS.checkout.originalDispatchNote,
        TEXTS.checkout.previousDispatchNote,
        expected,
      ].includes(text)
    )
      continue;
    if (line.querySelector('.ts-checkout-dispatch-accent') && text === expected) continue;
    const accent = document.createElement('span');
    accent.className = 'ts-checkout-dispatch-accent';
    accent.textContent = TEXTS.checkout.dispatchAccent;
    line.replaceChildren(TEXTS.checkout.dispatchPrefix, accent, TEXTS.checkout.dispatchSuffix);
    line.classList.remove('ts-checkout-dispatch-note');
  }
  const stockExpected =
    TEXTS.checkout.stockPrefix + TEXTS.checkout.stockAccent + TEXTS.checkout.stockSuffix;
  for (const line of document.querySelectorAll(SEL.checkoutDispatchLines)) {
    const text = line.textContent.replace(/\s+/g, ' ').trim();
    if (![TEXTS.checkout.stockNotice, stockExpected].includes(text)) continue;
    if (line.querySelector('.ts-checkout-stock-accent') && text === stockExpected) continue;
    const accent = document.createElement('span');
    accent.className = 'ts-checkout-stock-accent';
    accent.textContent = TEXTS.checkout.stockAccent;
    line.replaceChildren(TEXTS.checkout.stockPrefix, accent, TEXTS.checkout.stockSuffix);
  }
}

// Native totals, legal controls and buttons stay in their original form/DOM.
let layoutObserver;
let observedParts = [];
export function syncCheckoutSummaryLayout() {
  const sidebar = document.querySelector(SEL.checkoutSidebar);
  const list = sidebar?.querySelector(SEL.checkoutListPanel);
  if (!sidebar || !list) return;
  const parts = [list, ...sidebar.querySelectorAll(SEL.checkoutPinnedParts)];
  if (!layoutObserver && typeof ResizeObserver !== 'undefined')
    layoutObserver = new ResizeObserver(syncCheckoutSummaryLayout);
  if (
    layoutObserver &&
    (parts.length !== observedParts.length || parts.some((part, i) => part !== observedParts[i]))
  ) {
    layoutObserver.disconnect();
    for (const part of parts) layoutObserver.observe(part);
    observedParts = parts;
  }
  const offset =
    parseFloat(getComputedStyle(sidebar).getPropertyValue('--ts-checkout-sticky-top')) || 0;
  const lowerHeight = parts.slice(1).reduce((height, part) => {
    const style = getComputedStyle(part);
    if (style.display === 'none') return height;
    return (
      height +
      part.getBoundingClientRect().height +
      (parseFloat(style.marginTop) || 0) +
      (parseFloat(style.marginBottom) || 0)
    );
  }, 0);
  const room = Math.floor(window.innerHeight - offset - 16 - lowerHeight);
  const ready = window.innerWidth >= 1200 && room >= Math.min(320, list.scrollHeight + 2);
  if (sidebar.classList.contains('ts-checkout-sticky-ready') !== ready)
    sidebar.classList.toggle('ts-checkout-sticky-ready', ready);
  const height = `${Math.max(0, room)}px`;
  if (sidebar.style.getPropertyValue('--ts-checkout-list-max') !== height)
    sidebar.style.setProperty('--ts-checkout-list-max', height);
}
