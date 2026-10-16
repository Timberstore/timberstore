import { SEL } from '../../core/selectors.js';
import { TEXTS } from '../../core/texts.js';
import { syncQuantities, resizeQuantity } from './quantity.js';
import { syncRelated } from './related.js';
import { syncBottom } from './bottom.js';
import { syncPopupShipping } from './popup-shipping.js';
import { syncRows } from './rows.js';
import {
  syncCheckoutPriceAccents,
  syncCheckoutDispatchNote,
  syncCheckoutSummaryStructure,
  syncShippingNames,
} from './checkout.js';
import { SHOPTET_EVENTS } from '../../core/events.js';

let observer;
let frame = 0;
let bound = false;
let refreshing = false;
let refreshSpinner;

function syncPresentation(event) {
  if (event?.type === SHOPTET_EVENTS.cartContentLoaded) refreshing = true;
  if (frame) window.cancelAnimationFrame(frame);
  frame = 0;
  if (!document.querySelector(SEL.cartRoot)) {
    updatePresentation();
    return;
  }
  // Reconnect after replacement and finish in the mutation microtask, before
  // paint. Do not observe our own idempotent writes as another DOM refresh.
  observer?.disconnect();
  try {
    updatePresentation();
  } finally {
    if (observer) observe();
  }
}

function updatePresentation() {
  for (const message of document.querySelectorAll(
    `${SEL.cartMessages} ${SEL.cartSuccessMessage}`,
  )) {
    if (
      message.textContent.trim() === TEXTS.header.quantityChanged &&
      !message.classList.contains('ts-cart-quantity-confirmation')
    ) {
      message.classList.add('ts-cart-quantity-confirmation');
    }
  }
  syncSummary();
  syncQuantities();
  syncRows();
  syncRelated();
  syncBottom();
  syncCheckoutSummaryStructure();
  syncCheckoutPriceAccents();
  syncCheckoutDispatchNote();
  syncShippingNames();
  syncRefreshSpinner();
}

function syncRefreshSpinner() {
  if (!refreshing) return;
  const root = document.querySelector(SEL.cartRoot);
  const summary = root?.querySelector(SEL.cartSummary);
  const pending = summary && !summary.querySelector(SEL.cartSummaryPrices);
  root?.classList.toggle('ts-cart-refresh-pending', !!pending);
  if (pending) {
    // On a rejected amount Shoptet can remove its spinner before fetching the
    // replacement HTML. Reuse its API only when there is no existing mask.
    if (!document.querySelector(SEL.cartSpinner) && typeof window.showSpinner === 'function') {
      window.showSpinner();
      refreshSpinner = document.querySelector(SEL.cartSpinner);
    }
    return;
  }
  refreshing = false;
  if (refreshSpinner?.isConnected) window.hideSpinner?.();
  refreshSpinner = null;
}

function syncSummary() {
  const popup = document.querySelector(SEL.headerCartPopup);
  const footer = popup?.querySelector(SEL.cartPopupFooter);
  if (!footer) return;
  syncPopupShipping(popup);
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
  if (!frame) frame = window.requestAnimationFrame(syncPresentation);
}

function onMutation() {
  if (document.querySelector(SEL.cartRoot)) {
    syncPresentation();
    return;
  }
  // Preserve the existing popup/checkout scheduling outside the full cart.
  syncSummary();
  syncCheckoutSummaryStructure();
  syncCheckoutPriceAccents();
  syncShippingNames();
  scheduleSummary();
}

function onCartRefresh(event) {
  if (document.querySelector(SEL.cartRoot)) syncPresentation(event);
  else {
    observe();
    syncSummary();
    scheduleSummary();
  }
}

function observe() {
  observer.disconnect();
  for (const selector of [
    SEL.headerCartPopup,
    SEL.headerCart,
    SEL.cartMessages,
    SEL.cartRoot,
    SEL.cartFirstStep,
    SEL.checkoutSidebar,
    SEL.checkoutMethods,
  ]) {
    const node = document.querySelector(selector);
    if (node)
      observer.observe(node, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ['class', 'data-shipping-price-wv', 'data-billing-price-wv'],
      });
  }
}

export default {
  name: 'cart-presentation',
  pages: ['*'],
  init() {
    if (!observer)
      // Includes background tabs, where animation frames can be suspended.
      observer = new MutationObserver(onMutation);
    observe();
    if (!bound) {
      window.addEventListener('resize', scheduleSummary);
      for (const event of [SHOPTET_EVENTS.cartUpdated, SHOPTET_EVENTS.cartContentLoaded])
        document.addEventListener(event, onCartRefresh);
      document.addEventListener('input', (event) => {
        if (event.target instanceof Element && event.target.matches(SEL.cartQuantityInput))
          resizeQuantity(event.target);
      });
      document.addEventListener('click', (event) => {
        if (!(event.target instanceof Element)) return;
        const input = event.target.closest(SEL.nativeQuantity)?.querySelector(SEL.cartFormAmount);
        if (input?.matches(SEL.cartQuantityInput))
          window.requestAnimationFrame(() => resizeQuantity(input));
      });
      bound = true;
    }
    syncPresentation();
  },
};
