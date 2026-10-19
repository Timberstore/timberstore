// PD Compact · Presentation only; Shoptet retains every price/stock/form node.
import { SEL } from '../../core/selectors.js';
import { TEXTS } from '../../core/texts.js';
import { splitShippingName } from '../../core/shipping.js';

let readiness;
let popupObserver;

function syncShippingPopup() {
  for (const label of document.querySelectorAll(SEL.compactShippingName)) {
    // Match the existing checkout formatter. No price/logo/tooltip/control moves.
    if (label.children.length) continue;
    const parts = splitShippingName(label.textContent);
    if (!parts) continue;
    const name = document.createElement('strong');
    name.textContent = parts.name;
    const delivery = document.createElement('span');
    delivery.className = 'ts-shipping__delivery';
    delivery.textContent = parts.delivery;
    label.replaceChildren(name, document.createTextNode(' '), delivery);
  }
}

function observeShippingPopup() {
  if (popupObserver) return;
  popupObserver = new MutationObserver((mutations) => {
    if (mutations.some((m) => m.target.closest?.(SEL.compactShippingPopup) ||
      [...m.addedNodes].some((n) => n.nodeType === Node.ELEMENT_NODE &&
        (n.matches(SEL.compactShippingPopup) || n.querySelector(SEL.compactShippingPopup))))) {
      syncShippingPopup();
    }
  });
  popupObserver.observe(document.body, { childList: true, subtree: true, characterData: true });
  syncShippingPopup();
  let viewportWidth = window.innerWidth;
  window.addEventListener('resize', () => {
    if (window.innerWidth === viewportWidth) return;
    viewportWidth = window.innerWidth;
    if (!document.querySelector(SEL.compactShippingPopup)) return;
    // jQuery bridge to the existing Shoptet Colorbox sizing API. Its pixel
    // width otherwise survives a desktop-to-mobile resize and overflows.
    window.jQuery?.colorbox?.resize({ width: Math.min(960, viewportWidth - 16) });
  });
}
function enhance(info) {
  if (info.dataset.tsCompact) return;
  info.dataset.tsCompact = 'ready';
  function sync() {
    const label = info.querySelector(SEL.compactDeliveryLabel);
    if (label && !label.parentElement.classList.contains('ts-product-delivery')) {
      const date = label.parentElement.querySelector(SEL.compactDeliveryDate);
      if (date) {
        const badge = document.createElement('span');
        badge.className = 'ts-product-delivery';
        label.before(badge);
        badge.append(label, date);
      }
    }
    const details = info.querySelector(SEL.compactDescriptionLink);
    const social = info.querySelector(SEL.compactSocial);
    if (details && social) {
      const links = document.createElement('div');
      links.className = 'ts-product-links';
      details.before(links);
      links.append(details, social);
    }
    for (const price of info.querySelectorAll(SEL.compactAdditionalPrice)) {
      price.dataset.tsLabel = TEXTS.productCompact.vat;
      // Native AJAX may replace this text. Keep the native amount/currency;
      // only relocate the redundant suffix to the inline parenthetical label.
      const walker = document.createTreeWalker(price, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        const value = node.nodeValue.replace(TEXTS.productCompact.vatSuffix, '');
        if (value !== node.nodeValue) node.nodeValue = value;
      }
    }
  }
  sync();
  new MutationObserver(sync).observe(info, { childList: true, characterData: true, subtree: true });
}
export default {
  name: 'product-compact',
  pages: ['detail'],
  init() {
    observeShippingPopup();
    const run = () => document.querySelectorAll(SEL.compactInfo).forEach(enhance);
    if (document.body.classList.contains(SEL.compactReadyClass)) return run();
    if (readiness) return;
    readiness = new MutationObserver(() => {
      if (!document.body.classList.contains(SEL.compactReadyClass)) return;
      readiness.disconnect();
      readiness = null;
      run();
    });
    readiness.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  },
};
