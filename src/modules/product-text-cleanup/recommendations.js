// M2/C3 · Reuse the native recommendation cards and quantity handlers. Missing
// units come from the exact product's public Shoptet document, never from stock
// labels or a guessed "ks". One cached document per URL, no scripts executed.
import { SEL } from '../../core/selectors.js';
import { whenIdleAfterLoad } from '../../core/idle.js';
import qtyPicker from '../qty-picker/index.js';
import { sourceQuantity } from '../cart-presentation/related.js';

const sources = new WeakMap();
const queued = new WeakSet();
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
  if (card.querySelector(SEL.productPriceUnit) || source.pending || source.failed) return;
  source.pending = true;
  const data = await sourceQuantity(new URL(href), priceId, code);
  source.pending = false;
  if (!data?.unit) {
    source.failed = true;
    return;
  }
  if (!card.isConnected || sources.get(card) !== source || card.querySelector(SEL.productPriceUnit))
    return;
  const price = card.querySelector(SEL.recommendationPrice);
  if (!price) return;
  const span = document.createElement('span');
  span.className = 'ts-recommendation-unit';
  span.textContent = ' ' + data.unit.replace(/\s+/g, ' ');
  price.append(span);
}

export function prepareRecommendations(root) {
  // CSS owns purchase modal dimensions. Native Colorbox still opens/closes it;
  // late unit insertion must not start another animated resize cycle.
  for (const card of root.querySelectorAll(SEL.recommendationCard)) {
    if (!card.classList.contains('ts-recommendation')) {
      card.classList.add('ts-recommendation', 'ts-card');
    }
    // Apollo relocates the mobile final price into p-tools. Reuse the same
    // native price group inside this card so VAT/unit remain together; no copy.
    const prices = card.querySelector(SEL.recommendationPrices);
    const price = card.querySelector(SEL.recommendationPrice);
    if (prices && price && price.parentElement !== prices) prices.append(price);
    // Keep native quantity handlers; reuse the picker only for this card's
    // missing UI. Classic listings retain their original page/init scope.
    qtyPicker.init(card);
    if (!queued.has(card)) {
      queued.add(card);
      whenIdleAfterLoad(() => {
        queued.delete(card);
        if (card.isConnected) void supplyUnit(card);
      });
    }
  }
}
