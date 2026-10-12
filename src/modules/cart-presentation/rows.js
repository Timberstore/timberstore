import { SEL } from '../../core/selectors.js';
import { TEXTS } from '../../core/texts.js';
import { getCartInfo } from '../../core/cart.js';

export function showCode(parent, code) {
  if (!parent || !code) return;
  let label = parent.querySelector(':scope > .ts-cart-code');
  if (!label) {
    label = document.createElement('span');
    label.className = 'ts-cart-code';
    parent.append(label);
  }
  const text = `${TEXTS.cart.productCode} ${code}`;
  if (label.textContent !== text) label.textContent = text;
}

export function syncRows() {
  const items = getCartInfo()?.cartItems || [];
  for (const row of document.querySelectorAll(SEL.cartItems)) {
    const name = row.querySelector(SEL.cartName);
    if (!name) continue;
    let info = row.querySelector('.ts-cart-info');
    if (!info) {
      info = document.createElement('div');
      info.className = 'ts-cart-info';
      name.before(info);
      info.append(name);
    }
    const id = row.querySelector(SEL.cartFormItemId)?.value;
    const priceId = row.querySelector(SEL.cartFormPriceId)?.value;
    const item = items.find((item) =>
      id ? String(item.itemId) === id : String(item.priceId) === priceId,
    );
    showCode(info, item?.code);
    const label = row.querySelector(SEL.cartAvailabilityLabel);
    if (label) {
      let availability = info.querySelector('.ts-cart-availability');
      if (!availability) {
        availability = document.createElement('span');
        availability.className = 'ts-cart-availability';
        info.append(availability);
      }
      const count = row.querySelector(SEL.cartAvailabilityAmount);
      if (label.parentElement !== availability) availability.append(label);
      if (count && count.parentElement !== availability) availability.append(count);
    }
    const toggle = row.querySelector(SEL.cartRelatedToggle);
    if (toggle) {
      if (toggle.parentElement !== info) info.append(toggle);
      if (
        toggle.getAttribute('aria-expanded') !==
        String(row.classList.contains(SEL.cartRelatedOpenClass))
      )
        toggle.setAttribute(
          'aria-expanded',
          String(row.classList.contains(SEL.cartRelatedOpenClass)),
        );
      toggle.removeAttribute('aria-hidden');
      toggle.removeAttribute('tabindex');
    }
  }
  for (const table of document.querySelectorAll(SEL.cartTable)) {
    if (table.previousElementSibling?.classList.contains('ts-cart-head')) continue;
    const heading = document.createElement('div');
    heading.className = 'ts-cart-head';
    for (const text of TEXTS.cart.columns) {
      const label = document.createElement('span');
      label.textContent = text;
      heading.append(label);
    }
    table.before(heading);
  }
}
