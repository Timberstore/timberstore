import { SEL } from '../../core/selectors.js';
import { TEXTS } from '../../core/texts.js';
import { resizeQuantity } from './quantity.js';
import { showCode } from './rows.js';

const requests = new Map();
const pending = new WeakSet();
const settled = new WeakSet();
const waiting = [];
let active = 0;

function fetchDocument(url) {
  // Preload hidden native related rows, bounded to four concurrent documents.
  return new Promise((resolve) => {
    waiting.push(async () => {
      const controller = new AbortController();
      const timer = window.setTimeout(() => controller.abort(), 8000);
      try {
        const response = await fetch(url, { credentials: 'same-origin', signal: controller.signal });
        resolve(response.ok ? new DOMParser().parseFromString(await response.text(), 'text/html') : null);
      } catch { resolve(null); }
      finally { window.clearTimeout(timer); active--; drain(); }
    });
    drain();
  });
}
function drain() {
  while (active < 4 && waiting.length) { active++; void waiting.shift()(); }
}

export async function sourceQuantity(url, priceId, expectedCode) {
  // Related forms omit minimum/maximum/amount completely. Read the existing
  // public product document once per URL; never execute its scripts or invent
  // an unrestricted range. Match the exact variant before borrowing its UI.
  if (url.origin !== window.location.origin) return null;
  if (!requests.has(url.href)) {
    requests.set(
      url.href,
      fetchDocument(url.href),
    );
  }
  const doc = await requests.get(url.href);
  const detail = doc?.querySelector(SEL.relatedDetailForm);
  const sku = detail?.querySelector(SEL.detailSku);
  const code = sku?.getAttribute('content') || sku?.textContent.trim();
  if (
    !detail ||
    (priceId
      ? detail.querySelector(SEL.cartFormPriceId)?.value !== priceId
      : !expectedCode || code !== expectedCode)
  )
    return null;
  const quantity = detail.querySelector(SEL.nativeQuantity);
  const amount = quantity?.querySelector(SEL.cartFormAmount);
  if (
    !amount ||
    !(Number(amount.min) > 0) ||
    !(Number(amount.max) >= Number(amount.min)) ||
    !(Number(amount.step) > 0)
  )
    return null;
  return {
    quantity,
    unit: doc.querySelector(SEL.sourceProductPriceUnit)?.textContent.trim(),
    code,
    stock: detail.querySelector(SEL.detailStockAmount),
  };
}

async function enhance(form) {
  if (pending.has(form) || settled.has(form) || form.querySelector('.ts-cart-quantity')) return;
  const product = form.closest(SEL.cartRelatedProduct);
  const href = product?.querySelector(SEL.cartRelatedLink)?.href;
  const priceId = form.querySelector(SEL.cartFormPriceId)?.value;
  if (!href || !priceId) return;
  form.querySelector(SEL.cartFormSubmit)?.setAttribute('aria-label', TEXTS.cart.addToCart);
  pending.add(form);
  const pendingSubmit = form.querySelector(SEL.cartFormSubmit);
  const wasDisabled = pendingSubmit?.disabled;
  if (pendingSubmit) pendingSubmit.disabled = true;
  form.classList.add('ts-related-pending');
  form.setAttribute('aria-busy', 'true');
  const loading = document.createElement('span');
  loading.className = 'ts-related-loading';
  loading.setAttribute('role', 'status');
  loading.textContent = TEXTS.cart.loadingRelated;
  form.prepend(loading);
  const source = await sourceQuantity(new URL(href), priceId);
  pending.delete(form);
  settled.add(form);
  // One synchronous presentation update when verified data arrives. On failure
  // restore the original native purchase; never invent min/max, stock or code.
  loading.remove();
  if (pendingSubmit) pendingSubmit.disabled = wasDisabled;
  form.classList.remove('ts-related-pending');
  form.removeAttribute('aria-busy');
  if (!source || !form.isConnected) return;
  const quantity = source.quantity.cloneNode(true);
  const name = product.querySelector(SEL.cartRelatedLink);
  showCode(name.parentElement, source.code);
  if (source.stock && !product.querySelector(SEL.cartAvailabilityAmount)) {
    const stock = source.stock.cloneNode(true);
    stock.removeAttribute('id');
    product.querySelector(SEL.cartRelatedAvailability)?.append(stock);
  }
  quantity.querySelectorAll('[id]').forEach((node) => node.removeAttribute('id'));
  const input = quantity.querySelector(SEL.cartFormAmount);
  input.value = input.min;
  form.querySelectorAll(SEL.cartFormAmount).forEach((node) => node.remove());
  const submit = form.querySelector(SEL.cartFormSubmit);
  if (!submit) return;
  form.classList.add('ts-cart-related-form');
  for (const button of quantity.querySelectorAll(SEL.nativeQuantityButtons)) {
    const direction = button.classList.contains(SEL.nativeQuantityIncreaseClass)
      ? 'increase'
      : 'decrease';
    // Native delegated .increase inside cart-table would update an existing
    // cart item instead of this pending related purchase. Borrow its API only.
    button.classList.remove(SEL.nativeQuantityIncreaseClass, SEL.nativeQuantityDecreaseClass);
    button.dataset.tsCartDirection = direction;
    button.setAttribute('aria-label', TEXTS.qty[direction]);
    button.addEventListener('click', () => {
      window.shoptet?.quantity?.updateQuantity?.(
        input,
        input.min,
        input.max,
        input.dataset.decimals,
        direction,
      );
      resizeQuantity(input);
    });
  }
  form.insertBefore(quantity, submit);
  for (const eventName of ['input', 'change']) {
    form.addEventListener(eventName, (event) => {
      if (event.target !== input) return;
      // Keep input-level pack add-on handlers, but stop cart-table's delegated
      // updateQuantityInCart: this product does not have an itemId yet.
      event.stopPropagation();
      if (eventName === 'change')
        window.shoptet?.quantity?.enforceAndAnnounceLimits?.(input, event);
      resizeQuantity(input);
    });
  }
  form.addEventListener('submit', (event) => {
    window.shoptet?.quantity?.enforceAndAnnounceLimits?.(input, event);
    if (!input.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
      input.reportValidity();
    }
  });
  resizeQuantity(input);
}

export function syncRelated() {
  document.querySelectorAll(SEL.cartRelatedForm).forEach((form) => {
    void enhance(form);
  });
}
