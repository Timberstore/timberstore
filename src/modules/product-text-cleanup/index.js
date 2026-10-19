import { SEL } from '../../core/selectors.js';
import { TEXTS } from '../../core/texts.js';

let observer;

function cleanValue(text) {
  return text
    .replace(/\s+,/g, ',')
    .replace(/,([^\s\d])/g, ', $1')
    .replace(/[ \t]{2,}/g, ' ');
}

function cleanTextNodes(element) {
  const walker = document.createTreeWalker(element, 4 /* NodeFilter.SHOW_TEXT */, {
    acceptNode(node) {
      if (node.parentElement.closest('script, style, textarea, input, select, option')) {
        return 2; // NodeFilter.FILTER_REJECT
      }
      return 1; // NodeFilter.FILTER_ACCEPT
    },
  });

  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const cleaned = cleanValue(node.nodeValue);
    if (cleaned !== node.nodeValue) node.nodeValue = cleaned;
    // Preserve every native price/space/currency node; only style the amount.
    const parent = node.parentElement;
    if (!parent.matches(SEL.productPriceNumber) || parent.querySelector('.ts-price-number'))
      continue;
    const match = node.nodeValue.match(/\d[\d\s.,]*\d|\d/);
    if (!match) continue;
    const amount = node.splitText(match.index);
    amount.splitText(match[0].length);
    const span = document.createElement('span');
    span.className = 'ts-price-number';
    amount.before(span);
    span.append(amount);
  }
}

// Presentation only: reuse native SKU/brand value spans and their attributes.
// Re-query on AJAX; never nest wrappers or replace links/product data.
function metadata(root, selector, text) {
  for (const element of root.querySelectorAll(selector)) {
    const value = element.querySelector(SEL.productMetadataValue);
    if (!value || value.querySelector('img')) continue;
    let label = element.querySelector(SEL.productMetadataLabel);
    if (!label) {
      const node = [...element.childNodes].find(
        (n) => n.nodeType === 3 /* Node.TEXT_NODE */ && n.textContent.trim(),
      );
      if (!node) continue;
      label = document.createElement('span');
      node.replaceWith(label);
    }
    if (label.textContent !== text) label.textContent = text;
    element.classList.add('ts-product-meta');
    label.classList.add('ts-product-meta__label');
    value.classList.add('ts-product-meta__value');
  }
}

function cleanProductTexts(root) {
  for (const heading of root.querySelectorAll(SEL.productVariantsHeading)) {
    if (heading.textContent !== TEXTS.productMetadata.variants) {
      heading.textContent = TEXTS.productMetadata.variants;
    }
  }
  metadata(root, SEL.productMetadataCode, TEXTS.productMetadata.code);
  metadata(root, SEL.productMetadataBrand, TEXTS.productMetadata.brand);
  root
    .querySelectorAll(SEL.productTextDetailAreas + ', ' + SEL.productTextCards)
    .forEach(cleanTextNodes);
}

function ensureObserver() {
  if (observer || !document.body) return;

  observer = new MutationObserver(() => cleanProductTexts(document));

  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
}

export default {
  name: 'product-text-cleanup',
  pages: ['*'],
  init(root) {
    cleanProductTexts(root);
    ensureObserver();
  },
};
