import { SEL } from '../../core/selectors.js';
import { TEXTS } from '../../core/texts.js';
import { resizeQuantity } from './quantity.js';

const requests = new Map();
const pending = new WeakSet();

async function sourceQuantity(url, priceId) {
  // Related forms omit minimum/maximum/amount completely. Read the existing
  // public product document once per URL; never execute its scripts or invent
  // an unrestricted range. Match the exact variant before borrowing its UI.
  if (url.origin !== window.location.origin) return null;
  if (!requests.has(url.href)) {
    requests.set(
      url.href,
      fetch(url.href, { credentials: 'same-origin' })
        .then((response) => (response.ok ? response.text() : null))
        .then((html) => (html ? new DOMParser().parseFromString(html, 'text/html') : null))
        .catch(() => null),
    );
  }
  const doc = await requests.get(url.href);
  const detail = doc?.querySelector(SEL.relatedDetailForm);
  if (detail?.querySelector(SEL.cartFormPriceId)?.value !== priceId) return null;
  const quantity = detail.querySelector(SEL.nativeQuantity);
  const amount = quantity?.querySelector(SEL.cartFormAmount);
  if (
    !amount ||
    !(Number(amount.min) > 0) ||
    !(Number(amount.max) >= Number(amount.min)) ||
    !(Number(amount.step) > 0)
  )
    return null;
  return quantity;
}

async function enhance(form) {
  if (pending.has(form) || form.querySelector('.ts-cart-quantity')) return;
  const product = form.closest(SEL.cartRelatedProduct);
  const href = product?.querySelector(SEL.cartRelatedLink)?.href;
  const priceId = form.querySelector(SEL.cartFormPriceId)?.value;
  if (!href || !priceId) return;
  pending.add(form);
  const source = await sourceQuantity(new URL(href), priceId);
  if (!source || !form.isConnected) return; // Native add-to-cart remains available.
  const quantity = source.cloneNode(true);
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
