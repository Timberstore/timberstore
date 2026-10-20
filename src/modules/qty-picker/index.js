// C3 · Quantity field in product tiles and table rows at every breakpoint.
//
// "Do košíka" in a listing adds one pack; ordering 40 hinges means opening every
// detail. We add − [field] + inside Shoptet's own cart form and only write the
// hidden amount input; Shoptet's submit button stays in charge of adding to the
// cart. The step is the pack size the multiply_order add-on writes into that input
// (e.g. 100 or 1000 pieces): − / + move by whole packs and a typed number is
// rounded up to whole packs, never below one pack.

import { SEL } from '../../core/selectors.js';
import { TEXTS } from '../../core/texts.js';

function parse(value) {
  const n = parseFloat(String(value).replace(',', '.'));
  return Number.isFinite(n) && n > 0 ? n : NaN;
}

function makeButton(text, label, modifier) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = `ts-qty__btn ts-qty__btn--${modifier}`;
  btn.setAttribute('aria-label', label);
  btn.textContent = text;
  return btn;
}

function bind(form) {
  const amount = form.querySelector(SEL.cartFormAmount);
  const submit = form.querySelector(SEL.cartFormSubmit);
  if (!amount || !submit) return;

  let step = parse(amount.value) || 1;
  let touched = false;

  const box = document.createElement('div');
  box.className = 'ts-qty';
  const minus = makeButton('−', TEXTS.qty.decrease, 'minus');
  const plus = makeButton('+', TEXTS.qty.increase, 'plus');
  // No name attribute: only the hidden Shoptet input is submitted.
  const field = document.createElement('input');
  field.type = 'text';
  field.inputMode = 'numeric';
  field.autocomplete = 'off';
  field.className = 'ts-qty__value';
  field.setAttribute('aria-label', TEXTS.qty.value);
  field.value = String(step);
  box.append(minus, field, plus);
  form.insertBefore(box, submit);

  // Keep the add-on's pack size until the first edit. Native bounds, when
  // present, are read at each edit; server-side stock validation stays native.
  const syncStep = () => {
    if (!touched) field.value = String((step = parse(amount.value) || 1));
  };
  const commit = (render = true) => {
    touched = true;
    const min = Math.ceil((parse(amount.min) || step) / step) * step;
    const max = Math.floor((parse(amount.max) || Infinity) / step) * step;
    const qty = Math.max(min, Math.min(max, Math.ceil((parse(field.value) || min) / step) * step));
    amount.value = String(qty);
    if (render) field.value = amount.value;
    amount.dispatchEvent(new Event('change', { bubbles: true }));
  };
  const change = (direction) => {
    syncStep();
    field.value = String((parse(amount.value) || step) + direction * step);
    commit();
  };
  minus.addEventListener('click', () => change(-1));
  plus.addEventListener('click', () => change(1));
  field.addEventListener('focus', () => {
    syncStep();
    field.select();
  });
  field.addEventListener('input', () => commit(false));
  field.addEventListener('change', () => commit());
  field.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') commit();
  });

  if (document.readyState !== 'complete') window.addEventListener('load', syncStep, { once: true });
}

export default {
  name: 'qty-picker',
  pages: ['home', 'category', 'search'],
  init(root) {
    root
      .querySelectorAll(
        `${SEL.classicProductCard} ${SEL.cartForm}, .ts-recommendation ${SEL.cartForm}`,
      )
      .forEach((form) => {
        if (form.dataset.tsInit || form.querySelector(SEL.nativeQuantity)) return;
        form.dataset.tsInit = 'qty-picker';
        bind(form);
      });
  },
};
