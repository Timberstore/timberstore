import { SEL } from '../../core/selectors.js';
import { TEXTS } from '../../core/texts.js';
import { SHOPTET_EVENTS } from '../../core/events.js';
import { readWarehouseRows, readWarehousePreview } from '../../core/warehouse-stock.js';

let listening = false;
let selectedScenario;

function render() {
  const target = document.querySelector(SEL.detailAvailability);
  if (!target) return;
  let preview = readWarehousePreview();
  if (preview && selectedScenario) {
    const options = new URL(window.location.href);
    options.searchParams.set('ts_stock_demo', selectedScenario);
    window.history.replaceState(null, '', options);
    preview = readWarehousePreview();
  }
  const rows = preview ? preview.rows : readWarehouseRows();
  const previous = target.querySelector('[data-ts-warehouse-availability]');
  const restoreNative = () => {
    previous?.remove();
    Array.from(target.children).forEach((child) =>
      child.classList.remove('ts-warehouse-availability__native--hidden'),
    );
  };
  if (!rows) return restoreNative();
  const amount = target.querySelector(SEL.cartAvailabilityAmount)?.textContent || '';
  const unit = amount.match(/([\p{L}]+)\s*\)?\s*$/u)?.[1];
  if (!unit) return restoreNative();
  const signature = JSON.stringify([rows, unit, preview?.scenario]);
  if (previous?.dataset.tsWarehouseAvailability === signature) return;
  const block = document.createElement('div');
  block.className = 'ts-warehouse-availability';
  block.dataset.tsWarehouseAvailability = signature;
  block.setAttribute('aria-live', 'polite');
  if (preview) {
    const note = document.createElement('p');
    note.textContent = TEXTS.warehouseAvailability.previewNotice;
    block.append(note);
    const label = document.createElement('label');
    label.textContent = TEXTS.warehouseAvailability.previewLabel;
    const select = document.createElement('select');
    select.className = 'form-control';
    select.setAttribute('aria-label', TEXTS.warehouseAvailability.previewLabel);
    for (const [value, text] of Object.entries(TEXTS.warehouseAvailability.scenarios)) {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = text;
      option.selected = value === preview.scenario;
      select.append(option);
    }
    select.addEventListener('change', () => {
      selectedScenario = select.value;
      render();
      target.querySelector('[data-ts-warehouse-availability] select')?.focus();
    });
    label.append(select);
    block.append(label);
  }
  if (!rows.length) {
    const unavailable = document.createElement('strong');
    unavailable.textContent = TEXTS.warehouseAvailability.empty;
    block.append(unavailable);
  }
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
  else target.append(block);
  Array.from(target.children)
    .filter((child) => child !== block)
    .forEach((child) => child.classList.add('ts-warehouse-availability__native--hidden'));
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
