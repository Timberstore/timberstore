import { SEL } from '../../core/selectors.js';

export function resizeQuantity(input) {
  const box = input.closest(SEL.nativeQuantity);
  if (!box) return;
  if (!box.classList.contains('ts-cart-quantity')) box.classList.add('ts-cart-quantity');
  const digits = String(input.value).length;
  const width = String(Math.max(1, digits));
  if (box.style.getPropertyValue('--ts-cart-digits') !== width)
    box.style.setProperty('--ts-cart-digits', width);
}

export function syncQuantities() {
  document.querySelectorAll(SEL.cartQuantityInput).forEach(resizeQuantity);
}
