import { SEL } from '../../core/selectors.js';
import { TEXTS } from '../../core/texts.js';
import { SHOPTET_EVENTS } from '../../core/events.js';

let observer;
let frame = 0;
let bound = false;

function syncSummary() {
  frame = 0;
  const popup = document.querySelector(SEL.headerCartPopup);
  const footer = popup?.querySelector(SEL.cartPopupFooter);
  if (!footer) return;
  const cart = document.querySelector(SEL.headerCart);
  const amount = cart?.querySelector(SEL.headerCartPrice)?.textContent.trim();
  let summary = footer.querySelector('.ts-cart-summary');
  // The native header already formats the actual total, including discounts.
  // Never recalculate totals or fetch an independent cart snapshot.
  if (!cart?.classList.contains('full') || !amount) {
    summary?.remove();
    return;
  }
  if (!summary) {
    summary = document.createElement('div');
    summary.className = 'ts-cart-summary';
    const label = document.createElement('span');
    label.textContent = TEXTS.header.cartTotal;
    summary.append(label, document.createElement('strong'));
    footer.prepend(summary);
  }
  const value = summary.querySelector('strong');
  if (value.textContent !== amount) value.textContent = amount;
}

function scheduleSummary() {
  if (!frame) frame = window.requestAnimationFrame(syncSummary);
}

export default {
  name: 'cart-presentation',
  pages: ['*'],
  init() {
    if (!observer) observer = new MutationObserver(scheduleSummary);
    observer.disconnect();
    for (const selector of [SEL.headerCartPopup, SEL.headerCart]) {
      const node = document.querySelector(selector);
      if (node) observer.observe(node, { childList: true, subtree: true, characterData: true });
    }
    if (!bound) {
      document.addEventListener(SHOPTET_EVENTS.cartUpdated, scheduleSummary);
      bound = true;
    }
    syncSummary();
  },
};
