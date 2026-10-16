import { SEL } from './selectors.js';
import { TEXTS } from './texts.js';

function visible(element) {
  return element.getClientRects().length > 0 && getComputedStyle(element).visibility !== 'hidden';
}

// Shoptet's existing CloudZoom plugin stores the trap height at initialization.
// Use its own jQuery API after a responsive geometry change, never a new zoom.
export function refreshProductZoom(gallery) {
  const jq = window.jQuery;
  const image = gallery.querySelector(SEL.productMainImage);
  if (!image || typeof jq?.fn?.CloudZoom !== 'function') return;
  const zoom = jq(image).data('zoom');
  if (typeof zoom?.destroy !== 'function') return;
  zoom.destroy();
  jq(image).CloudZoom(window.shoptet?.config?.cloudZoomOptions);
}

// Read only the currently visible native variant. Unknown/custom availability
// labels never acquire an invented dispatch promise, including supplier stock.
export function getProductDispatchState(info) {
  const labels = [
    ...info.querySelectorAll(
      `${SEL.productDetailAvailability} ${SEL.productDetailAvailabilityLabel}`,
    ),
  ].filter(visible);
  if (labels.length !== 1) return null;
  const label = labels[0];
  const name = label.textContent.trim().toLocaleLowerCase('sk');
  const state =
    name === TEXTS.productDetail.stockLabel
      ? 'stock'
      : name === TEXTS.productDetail.centralLabel
        ? 'central'
        : null;
  if (!state) return null;

  const quantity = info.querySelector(SEL.productDetailAmount);
  const submit = info.querySelector(SEL.productDetailSubmit);
  if (!quantity || !submit || submit.disabled) return null;
  if (quantity) {
    const requested = Number(quantity.value);
    if (!(requested > 0) || !quantity.validity.valid) return null;
    const scope =
      label.closest(SEL.productDetailAvailabilityVariant) ||
      label.closest(SEL.productDetailAvailability);
    const amount = [...scope.querySelectorAll(SEL.productDetailAvailabilityAmount)].find(visible);
    // A displayed >100 is a conservative lower bound, never an exact inventory.
    const count = amount?.textContent.replace(/\s/g, '').match(/\d+(?:[,.]\d+)?/);
    if (count && requested > Number(count[0].replace(',', '.'))) return null;
  }
  return state;
}
