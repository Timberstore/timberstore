import { SEL } from '../../core/selectors.js';
import { TEXTS } from '../../core/texts.js';
import { SHOPTET_EVENTS } from '../../core/events.js';
import { getOrderStatus } from '../../core/order.js';
// Ordinary page CSS cannot cross Shoptet's shadow boundary. Keep the override
// with the other native overrides, bundled as text and installed in that root.
import styles from '../../styles/overrides/order-detail.css?shadow';

let bound = false;
const observed = new WeakSet();
const statusTargets = new WeakSet();

function sync(root) {
  const layout = root.querySelector(SEL.orderLayout);
  if (!layout) return; // Login and native return forms keep their original UI.
  const flags = layout.querySelector(SEL.orderHeaderFlags);
  if (flags && !statusTargets.has(flags)) {
    statusTargets.add(flags);
    getOrderStatus(root).then((status) => {
      if (!status || !flags.isConnected) return;
      // Do not duplicate a native fulfilment status if Shoptet adds it later.
      if ([...flags.children].some((flag) => flag.textContent.trim() === status.name)) return;
      const badge = document.createElement('span');
      badge.className = `flag ts-order-status ts-order-status--${status.kind}`;
      badge.textContent = status.name;
      flags.prepend(badge);
    });
  }
  for (const price of layout.querySelectorAll(SEL.orderMethodPrice)) {
    // Only an explicit native euro zero can become ZADARMO. No arithmetic,
    // inferred totals, duplicated amounts or modifications of other currencies.
    if (!price.children.length && /^0(?:[,.]0+)?\s*€$/u.test(price.textContent.trim())) {
      price.textContent = TEXTS.order.free;
    }
    price.classList.toggle('ts-order-free', price.textContent.trim() === TEXTS.order.free);
  }
  for (const flag of layout.querySelectorAll(SEL.orderFlags)) {
    // Native info is also used for cancellation. Only recolour the explicit
    // cancelled label; do not derive fulfilment status from a payment badge.
    const cancelled = TEXTS.order.cancelled.includes(flag.textContent.trim());
    flag.classList.toggle('ts-order-cancelled', cancelled);
  }
}

function mount() {
  const host = document.querySelector(SEL.orderHost);
  const root = host?.shadowRoot;
  if (!root) return;
  if (!root.querySelector('style[data-ts-order-style]')) {
    const style = document.createElement('style');
    style.dataset.tsOrderStyle = '';
    style.textContent = styles;
    root.append(style);
  }
  if (!observed.has(root)) {
    new MutationObserver(() => sync(root)).observe(root, {
      childList: true,
      characterData: true,
      subtree: true,
    });
    observed.add(root);
    host.dataset.tsInit = 'order-detail';
  }
  sync(root);
}

export default {
  name: 'order-detail',
  pages: ['order'],
  init() {
    if (!bound) {
      document.addEventListener(SHOPTET_EVENTS.orderDataLoaded, mount);
      bound = true;
    }
    mount();
  },
};
