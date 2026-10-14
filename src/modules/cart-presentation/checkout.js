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
  const recaps = [...summary.querySelectorAll(SEL.checkoutMethodRecaps)];
  recaps.forEach((row, index) => {
    // Native recap order is shipping, then payment. Do not replace their prices.
    if (recaps.length !== 2) return;
    if (!row.classList.contains('ts-checkout-method-recap'))
      row.classList.add('ts-checkout-method-recap');
    row.classList.toggle('ts-checkout-shipping-recap', index === 0);
    let label = row.querySelector('.ts-checkout-method-label');
    if (!label) {
      label = document.createElement('span');
      label.className = 'ts-checkout-method-label';
      row.prepend(label);
    }
    const text = index === 0 ? TEXTS.checkout.shippingLabel : TEXTS.checkout.billingLabel;
    if (label.textContent !== text) label.textContent = text;
  });
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

// Establish our two visual groups before Apollo's window.load wrapper pass.
// Native nodes stay under #summary-box; radios, forms and buttons are untouched.
// Later Apollo wrappers live inside these groups and have no layout of their own.
export function syncCheckoutSummaryStructure() {
  const summary = document.querySelector(SEL.checkoutSummary);
  if (!summary) return;
  for (const [className, nativePanel, items] of [
    ['ts-checkout-summary-products', SEL.checkoutNativeProductPanel, SEL.checkoutProductParts],
    ['ts-checkout-summary-prices', SEL.checkoutNativePricePanel, SEL.checkoutPriceParts],
  ]) {
    let group = summary.querySelector(`:scope > .${className}`);
    const native = summary.querySelector(nativePanel);
    const nodes = [...summary.querySelectorAll(items)];
    if (native) nodes.unshift(native);
    if (!nodes.length) continue;
    if (!group) {
      group = document.createElement('div');
      group.className = className;
      summary.append(group);
    }
    if (native && !group.contains(native)) group.append(native);
    const target = native || group;
    for (const node of nodes) {
      if (node !== native && !target.contains(node)) target.append(node);
    }
  }
}
