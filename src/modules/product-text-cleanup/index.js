import { SEL } from '../../core/selectors.js';
import { TEXTS } from '../../core/texts.js';

let observer;

function cleanValue(text) {
  if (!text) return text;

  return text
    .replace(/\s+,/g, ',')
    .replace(/,([^\s\d])/g, ', $1')
    .replace(/[ \t]{2,}/g, ' ');
}

function cleanTextNodes(element) {
  if (!element) return;

  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || parent.closest('script, style, textarea, input, select, option')) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const nodes = [];
  let node;
  while ((node = walker.nextNode())) nodes.push(node);

  nodes.forEach((textNode) => {
    const original = textNode.nodeValue;
    const cleaned = cleanValue(original);
    if (cleaned !== original) textNode.nodeValue = cleaned;
  });
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
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
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

function cleanProductTexts(root = document) {
  for (const heading of root.querySelectorAll(SEL.productVariantsHeading)) {
    if (heading.textContent !== TEXTS.productMetadata.variants) {
      heading.textContent = TEXTS.productMetadata.variants;
    }
  }
  metadata(root, SEL.productMetadataCode, TEXTS.productMetadata.code);
  metadata(root, SEL.productMetadataBrand, TEXTS.productMetadata.brand);
  root.querySelectorAll(SEL.productTextDetailAreas).forEach(cleanTextNodes);
  root.querySelectorAll(SEL.productTextCards).forEach(cleanTextNodes);
}

function ensureObserver() {
  if (observer || !document.body) return;

  observer = new MutationObserver((mutations) => {
    if (mutations.some((mutation) => mutation.addedNodes?.length)) {
      cleanProductTexts(document);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

export default {
  name: 'product-text-cleanup',
  pages: ['*'],
  init(root) {
    cleanProductTexts(root);
    ensureObserver();
  },
};
