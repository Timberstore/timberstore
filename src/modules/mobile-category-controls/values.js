// Presentation of the original option rows. Inputs, labels, count nodes and
// their Shoptet handlers remain in place; only label text receives a flex item.
import { SEL } from '../../core/selectors.js';
import { TEXTS } from '../../core/texts.js';

const LIMIT = 10;

export function enhanceValues(filters, expanded) {
  const lists = new Map();
  const labels = new Set();
  const rows = new Set();
  const buttons = new Map();
  let nextId = 0;

  function refresh() {
    for (const fieldset of filters.querySelectorAll(SEL.categoryFilterFieldset)) {
      const options = [...fieldset.children].filter(
        (row) =>
          row.querySelector(SEL.categoryFilterCheckbox) &&
          row.querySelector(SEL.categoryFilterLabel),
      );
      for (const row of options) {
        rows.add(row);
        if (!row.classList.contains('ts-mobile-category__option')) {
          row.classList.add('ts-mobile-category__option');
        }
        const label = row.querySelector(SEL.categoryFilterLabel);
        if (!label.querySelector('.ts-mobile-category__value')) {
          const text = [...label.childNodes].filter((node) => node.nodeType === Node.TEXT_NODE);
          if (text.length) {
            const value = document.createElement('span');
            value.className = 'ts-mobile-category__value';
            text[0].before(value);
            value.append(...text);
            labels.add(value);
          }
        }
      }
      if (options.length <= LIMIT && !lists.has(fieldset)) continue;
      if (!lists.has(fieldset)) {
        const input = options[0].querySelector(SEL.categoryFilterCheckbox);
        const group = fieldset.closest(SEL.categoryFilterGroup);
        const key = group.id || `${input.dataset.filterCode}:${input.dataset.filterId}`;
        const originalId = fieldset.getAttribute('id');
        if (!originalId) fieldset.id = `ts-mobile-category-values-${++nextId}`;
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'ts-mobile-category__more';
        button.setAttribute('aria-controls', fieldset.id);
        fieldset.append(button);
        const list = { key, button, originalId };
        lists.set(fieldset, list);
        buttons.set(button, list);
      }
      const list = lists.get(fieldset);
      const open = expanded.has(list.key);
      for (const [index, row] of options.entries()) {
        // Native checked state is authoritative, including selections restored
        // by AJAX. A selected value after the first ten is never collapsed.
        const hide =
          !open && index >= LIMIT && !row.querySelector(SEL.categoryFilterCheckbox).checked;
        if (row.classList.contains('ts-mobile-category__option--hidden') !== hide) {
          row.classList.toggle('ts-mobile-category__option--hidden', hide);
        }
      }
      const text = open ? TEXTS.mobileCategory.less : TEXTS.mobileCategory.more;
      if (list.button.textContent !== text) list.button.textContent = text;
      list.button.hidden = options.length <= LIMIT;
      list.button.setAttribute('aria-expanded', String(open));
    }
  }

  function toggle(button) {
    const list = buttons.get(button);
    if (!list) return;
    if (expanded.has(list.key)) expanded.delete(list.key);
    else expanded.add(list.key);
    refresh();
  }

  function dispose() {
    for (const [fieldset, list] of lists) {
      list.button.remove();
      if (list.originalId === null) fieldset.removeAttribute('id');
    }
    for (const value of labels) value.replaceWith(...value.childNodes);
    for (const row of rows) {
      row.classList.remove('ts-mobile-category__option', 'ts-mobile-category__option--hidden');
    }
  }

  return { refresh, toggle, dispose };
}
