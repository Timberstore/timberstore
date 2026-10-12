import { SEL } from '../../core/selectors.js';
import { TEXTS } from '../../core/texts.js';
import { getCartInfo } from '../../core/cart.js';

const seen = new WeakSet();
let previousPercent;

export function syncBottom() {
  const footer = document.querySelector(SEL.cartFooter);
  for (const delivery of document.querySelectorAll(SEL.cartDeliveryTime)) {
    if (!delivery.classList.contains('ts-cart-delivery'))
      delivery.classList.add('ts-cart-delivery', 'icon-van');
    for (const node of [...delivery.childNodes]) {
      if (
        node.nodeType !== Node.TEXT_NODE ||
        !node.textContent.includes(TEXTS.cart.nativeDeliveryPrefix)
      )
        continue;
      const label = document.createElement('span');
      label.textContent = TEXTS.cart.deliveryPrefix;
      node.replaceWith(label); // Keep Shoptet's original dynamic date node.
    }
    if (footer) {
      let column = footer.querySelector(':scope > .ts-cart-delivery-col');
      if (!column) {
        column = document.createElement('div');
        column.className = 'extras-col ts-cart-delivery-col';
        footer.prepend(column);
      }
      if (delivery.parentElement !== column) {
        const previous = delivery.parentElement;
        column.append(delivery);
        if (previous.classList.contains('text-center') && !previous.textContent.trim())
          previous.remove();
      }
    }
  }
  for (const root of document.querySelectorAll(SEL.cartShipping)) {
    const delivery = root.querySelector(SEL.cartShippingDelivery);
    if (!delivery) continue;
    // Apollo wraps the raw message asynchronously after AJAX. Let it own that
    // structure; the observer will resync when its extra-content appears.
    const panel = delivery.closest(SEL.cartShippingPanel);
    if (!panel || !root.contains(panel)) continue;
    if (!panel.classList.contains('ts-cart-shipping')) panel.classList.add('ts-cart-shipping');
    const info = getCartInfo();
    const threshold = Number(info?.freeShippingFrom);
    const left = info?.leftToFreeShipping?.priceLeft;
    const complete =
      threshold > 0 &&
      Number.isFinite(left) &&
      left <= 0 &&
      !!panel.closest(SEL.cartShippingComplete);
    if (panel.classList.contains('ts-cart-shipping-complete') !== complete)
      panel.classList.toggle('ts-cart-shipping-complete', complete);
    let range = panel.querySelector(SEL.cartShippingRange);
    if (!range && complete) {
      range = document.createElement('div');
      range.className = 'price-range ts-cart-progress';
      const fill = document.createElement('div');
      fill.style.width = '100%';
      range.append(fill);
      panel.append(range);
    }
    const fill = panel.querySelector(SEL.cartShippingFill);
    if (!range || !fill) continue;
    if (!range.classList.contains('ts-cart-progress')) range.classList.add('ts-cart-progress');
    const percent = parseFloat(fill.style.width);
    // Use the server-rendered percentage: it accounts for actual eligible
    // value/discounts. cartInfo validates a real configured threshold exists.
    if (!(threshold > 0) || !Number.isFinite(percent) || percent < 0 || percent > 100) {
      range.hidden = true;
      continue;
    }
    range.hidden = false;
    if (seen.has(fill)) continue;
    seen.add(fill);
    range.setAttribute('role', 'progressbar');
    range.setAttribute('aria-label', TEXTS.cart.shippingProgress);
    range.setAttribute('aria-valuemin', '0');
    range.setAttribute('aria-valuemax', '100');
    range.setAttribute('aria-valuenow', String(percent));
    if (
      previousPercent !== undefined &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      fill.style.width = `${previousPercent}%`;
      window.requestAnimationFrame(() => {
        if (fill.isConnected) fill.style.width = `${percent}%`;
      });
    }
    previousPercent = percent;
  }
}
