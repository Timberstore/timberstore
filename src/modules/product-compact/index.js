// PD Compact · Presentation only; Shoptet retains every price/stock/form node.
import { SEL } from '../../core/selectors.js';
import { TEXTS } from '../../core/texts.js';

let readiness;
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
      // only relocate the redundant suffix to the left-hand row label.
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
