// M2/C3 · Reuse the native recommendation cards and quantity handlers. Missing
// units come from the exact product's public Shoptet document, never from stock
// labels or a guessed "ks". One cached document per URL, no scripts executed.
import { SEL } from '../../core/selectors.js';
import { COLORBOX_EVENTS } from '../../core/events.js';
import qtyPicker from '../qty-picker/index.js';
import { sourceQuantity } from '../cart-presentation/related.js';

const sources = new WeakMap();
let resizePending = false;
let listening = false;
const completed = new WeakSet();

function resizePopup(card) {
  const popup = card.closest(SEL.cartPopup);
  if (!popup || !completed.has(popup) || resizePending) return;
  resizePending = true;
  requestAnimationFrame(() => {
    resizePending = false;
    if (document.querySelector(SEL.cartPopup) === popup && popup.getClientRects().length)
      window.shoptet?.modal?.resize?.();
  });
}

function quantityUnit(card) {
  // Both native order-limit messages describe this card's selling unit. Read
  // their shared suffix, never availability text or an assumed default unit.
  const units = [...card.querySelectorAll(SEL.recommendationUnitHints)].map((hint) =>
    (hint.getAttribute('data-original-title') || hint.getAttribute('title') || '')
      .match(/\d[\d\s.,]*\s+(\p{L}[\p{L}\p{N}²³/._ -]{0,31})\.\s*$/u)?.[1].trim(),
  );
  return units.length === 2 && units[0] && units[0] === units[1] ? '/ ' + units[0] : null;
}

async function supplyUnit(card) {
  const href = card.querySelector(SEL.recommendationLink)?.href;
  const priceId = card.querySelector(SEL.cartFormPriceId)?.value;
  const code = card.querySelector(SEL.recommendationSku)?.textContent.trim();
  const key = href + '#' + (priceId || code);
  if (!href || (!priceId && !code)) return;
  let source = sources.get(card);
  if (source?.key !== key) {
    card.querySelector('.ts-recommendation-unit')?.remove();
    source = { key };
    sources.set(card, source);
  }
  if (card.querySelector(SEL.productPriceUnit)) {
    card.classList.remove('ts-unit-pending');
    return;
  }
  if (source.pending) return;
  let unit = quantityUnit(card);
  if (source.failed && !unit) return;
  source.pending = true;
  if (!unit) {
    card.classList.add('ts-unit-pending');
    unit = (await sourceQuantity(new URL(href), priceId, code))?.unit;
  }
  source.pending = false;
  if (sources.get(card) !== source) return;
  card.classList.remove('ts-unit-pending');
  if (!unit) {
    source.failed = true;
    return;
  }
  if (!card.isConnected || sources.get(card) !== source || card.querySelector(SEL.productPriceUnit))
    return;
  const price = card.querySelector(SEL.recommendationPrice);
  if (!price) return;
  const span = document.createElement('span');
  span.className = 'ts-recommendation-unit';
  span.textContent = ' ' + unit.replace(/\s+/g, ' ');
  price.append(span);
  resizePopup(card);
}

export function prepareRecommendations(root) {
  // Colorbox is jQuery-based. Resize only after its opening animation completes,
  // once per native popup node; async unit insertion can then resize it again.
  if (!listening && window.jQuery) {
    listening = true;
    window.jQuery(document).on(COLORBOX_EVENTS.complete + '.tsRecommendations', () => {
      const popup = document.querySelector(SEL.cartPopup);
      if (popup && !completed.has(popup)) {
        completed.add(popup);
        resizePopup(popup);
      }
    });
  }
  for (const card of root.querySelectorAll(SEL.recommendationCard)) {
    if (!card.classList.contains('ts-recommendation')) {
      card.classList.add('ts-recommendation', 'ts-card');
    }
    // Keep native quantity handlers; reuse the picker only for this card's
    // missing UI. Classic listings retain their original page/init scope.
    qtyPicker.init(card);
    void supplyUnit(card);
  }
}
