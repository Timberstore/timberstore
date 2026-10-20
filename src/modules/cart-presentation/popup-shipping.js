import { SEL } from '../../core/selectors.js';
import { TEXTS } from '../../core/texts.js';
import { getCartShippingPresentation } from '../../core/cart.js';

export function syncPopupShipping(popup) {
  const footer = popup.querySelector(SEL.cartPopupFooter);
  const blocks = [...popup.querySelectorAll(SEL.cartPopupShipping)];
  // AJAX replaces the inner list; Apollo may leave the previous footer message.
  // Prefer the fresh server node, move it intact and discard only stale text blocks.
  const shipping = blocks.find((node) => !footer?.contains(node)) || blocks[0];
  const message = shipping?.querySelector(SEL.cartPopupShippingMessage);
  const state = getCartShippingPresentation();
  if (!footer || !message || !state) return;
  if (!footer.contains(shipping)) footer.prepend(shipping);
  for (const old of blocks) if (old !== shipping) old.remove();
  // Apollo's locale prefix check mistakes native Slovak "Nakúpte" for the
  // completed message. Use Shoptet's server remainder, not that text heuristic.
  for (const node of [shipping, shipping.closest(SEL.cartPopupFooter)]) {
    if (node && node.classList.contains(SEL.cartPopupFreeClass) !== state.complete)
      node.classList.toggle(SEL.cartPopupFreeClass, state.complete);
  }
  paintShipping(shipping, message, state);
}

export function paintShipping(shipping, message, state) {
  const percent = `${state.percent}%`;
  if (shipping.style.getPropertyValue('--bar-percentage') !== percent)
    shipping.style.setProperty('--bar-percentage', percent);
  const t = TEXTS.header;
  const expected = state.complete
    ? t.shippingCompletePrefix + t.shippingFreeWord
    : t.shippingRemainingPrefix + state.remaining + t.shippingRemainingSuffix + t.shippingFreeWord;
  // This verified message contains only text/strong/br, no controls/listeners.
  // Keep the original div (including its truck pseudo-element) and native form.
  if (
    message.textContent.replace(/\s+/g, ' ').trim() === expected.replace(/\s+/g, ' ').trim() &&
    message.querySelector('strong')
  )
    return;
  const free = document.createElement('strong');
  free.textContent = t.shippingFreeWord;
  if (state.complete) message.replaceChildren(t.shippingCompletePrefix, free);
  else {
    const amount = document.createElement('strong');
    amount.className = SEL.cartPopupRemainderClass;
    amount.textContent = state.remaining;
    message.replaceChildren(
      t.shippingRemainingPrefix,
      amount,
      document.createTextNode(' '),
      t.shippingRemainingSuffix,
      free,
    );
  }
}

// Text-only native delivery fragments have no controls. Preserve server values
// and percentage; remove only forced line breaks so each context wraps naturally.
export function normalizeNativeShipping(root) {
  for (const delivery of root.querySelectorAll(SEL.cartShippingDelivery)) {
    delivery.querySelectorAll('br').forEach((node) => node.replaceWith(' '));
  }
}
