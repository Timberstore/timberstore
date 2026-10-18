import { SEL } from '../../core/selectors.js';
import { TEXTS } from '../../core/texts.js';
import { SHOPTET_EVENTS } from '../../core/events.js';
import { readWarehouseRows } from '../../core/warehouse-stock.js';

let listening = false;

function render() {
  const target = document.querySelector(SEL.detailAvailability);
  if (!target) return;
  const rows = readWarehouseRows();
  const previous = target.parentElement.querySelector('[data-ts-warehouse-availability]');
  if (!rows) {
    previous?.remove();
    target.classList.remove('ts-warehouse-availability__native--hidden');
    return;
  }
  // Keep the shop's unit, including metres and sets; never assume pieces.
  const amount = target.querySelector(SEL.cartAvailabilityAmount)?.textContent || '';
  const unit = amount.match(/([\p{L}]+)\s*\)?\s*$/u)?.[1];
  if (!unit) {
    previous?.remove();
    target.classList.remove('ts-warehouse-availability__native--hidden');
    return;
  }
  const signature = JSON.stringify([rows, unit]);
  if (previous?.dataset.tsWarehouseAvailability === signature) return;
  const block = document.createElement('div');
  block.className = 'ts-warehouse-availability';
  block.dataset.tsWarehouseAvailability = signature;
  for (const row of rows) {
    const line = document.createElement('div');
    line.className = `ts-warehouse-availability__row ts-warehouse-availability__row--${row.kind}`;
    const label = document.createElement('strong');
    label.textContent = TEXTS.warehouseAvailability[row.kind];
    label.style.color =
      row.kind === 'local' ? 'var(--ts-color-success)' : 'var(--ts-color-warning)';
    const quantity = document.createElement('span');
    quantity.textContent = `${row.quantity} ${unit}`;
    line.append(label, document.createTextNode(' '), quantity);
    block.append(line);
  }
  if (previous) previous.replaceWith(block);
  else target.after(block);
  target.classList.add('ts-warehouse-availability__native--hidden');
}

export default {
  name: 'warehouse-availability',
  pages: ['detail'],
  init() {
    render();
    if (listening) return;
    listening = true;
    document.addEventListener(SHOPTET_EVENTS.dataLayerUpdated, render);
  },
};
