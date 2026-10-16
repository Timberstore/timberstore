// PD · Preserve Apollo's native nodes, variant callbacks and form ownership.
import { SEL } from '../../core/selectors.js';
import { TEXTS } from '../../core/texts.js';
import { getProductDispatchState, refreshProductZoom } from '../../core/product.js';
import { log } from '../../core/log.js';

let readyObserver;

function sync(info, dispatch) {
  const availability = info.querySelector(SEL.productDetailAvailability);
  if (availability && !dispatch.isConnected) availability.after(dispatch);
  for (const table of info.querySelectorAll(SEL.productDetailLooseParameters)) {
    table.classList.toggle(
      'ts-product-empty-parameters',
      !table.textContent.trim() &&
        !table.querySelector('input, select, textarea, button, img, iframe'),
    );
  }
  const state = getProductDispatchState(info);
  const message =
    state === 'stock'
      ? TEXTS.productDetail.stockDispatch
      : state === 'central'
        ? TEXTS.productDetail.centralDispatch
        : '';
  if (dispatch.textContent !== message) dispatch.textContent = message;
  dispatch.hidden = !message;
  if (dispatch.dataset.stock !== (state || '')) dispatch.dataset.stock = state || '';

  const price = info.querySelector(SEL.productDetailPrice);
  if (price) {
    let vat = price.nextElementSibling;
    if (!vat?.classList.contains('ts-product-vat')) {
      vat = document.createElement('span');
      vat.className = 'ts-product-vat';
      vat.textContent = TEXTS.productDetail.vat;
      price.after(vat);
    }
    vat.hidden = !/\d/.test(price.innerText);
  }
  const submit = info.querySelector(SEL.productDetailSubmit);
  // Keep its children, native icon, disabled state and accessible product name.
  for (const node of submit?.childNodes || []) {
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === TEXTS.cart.addToCart) {
      node.textContent = TEXTS.productDetail.addToCart;
    }
  }
}

function enhance(info) {
  if (info.dataset.tsProductDetail) return;
  const grid = info.querySelector(SEL.productDetailGrid);
  if (!grid) return;
  const cart = info.querySelector(SEL.productDetailCart);
  const panel = document.createElement('section');
  panel.className = 'ts-product-purchase';
  panel.setAttribute('aria-label', TEXTS.productDetail.purchase);
  // Include any gifts/discount blocks between the grid and cart in their
  // existing order. No cloning, new form, replacement inputs or AJAX handlers.
  const last =
    cart && grid.compareDocumentPosition(cart) & Node.DOCUMENT_POSITION_FOLLOWING ? cart : grid;
  const end = last.nextSibling;
  let node = grid;
  grid.before(panel);
  while (node && node !== end) {
    const next = node.nextSibling;
    panel.append(node);
    node = next;
  }

  const dispatch = document.createElement('p');
  dispatch.className = 'ts-product-dispatch';
  dispatch.setAttribute('aria-live', 'polite');
  dispatch.setAttribute('aria-atomic', 'true');
  dispatch.hidden = true;
  const availability = grid.querySelector(SEL.productDetailAvailability);
  if (availability) availability.after(dispatch);
  else panel.append(dispatch);

  info.dataset.tsProductDetail = 'ready';
  const detail = info.closest(SEL.productDetail);
  detail?.classList.add('ts-product-detail');
  const gallery = detail?.querySelector(SEL.productImage);
  if (gallery && typeof ResizeObserver === 'function') {
    let previousSize = '';
    const sizeObserver = new ResizeObserver(() => {
      const { width, height } = gallery.getBoundingClientRect();
      if (!(width > 0 && height > 0)) return;
      const size = `${Math.round(width)}:${Math.round(height)}`;
      if (size === previousSize) return;
      previousSize = size;
      try {
        refreshProductZoom(gallery);
      } catch (error) {
        log.error('product-detail zoom', error);
      }
    });
    sizeObserver.observe(gallery);
  }
  const observer = new MutationObserver(update);
  const observe = () =>
    observer.observe(info, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['class', 'style', 'hidden', 'disabled', 'min', 'max', 'step'],
    });
  function update() {
    observer.disconnect();
    try {
      sync(info, dispatch);
    } finally {
      observe();
    }
  }
  // The amount value property changes without a DOM mutation on native +/-.
  info.addEventListener('input', update);
  info.addEventListener('change', update);
  info.addEventListener('click', (event) => {
    if (event.target.closest(SEL.nativeQuantityButtons)) queueMicrotask(update);
  });
  update();
}

function initDetails() {
  document.querySelectorAll(SEL.productDetailInfo).forEach(enhance);
}

export default {
  name: 'product-detail',
  pages: ['detail'],
  init() {
    if (document.body.classList.contains(SEL.productDetailReadyClass)) {
      initDetails();
      return;
    }
    if (readyObserver) return;
    // Apollo creates its final wrappers before publishing its own ready state.
    readyObserver = new MutationObserver(() => {
      if (!document.body.classList.contains(SEL.productDetailReadyClass)) return;
      readyObserver.disconnect();
      readyObserver = null;
      initDetails();
    });
    readyObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  },
};
