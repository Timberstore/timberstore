import { SEL } from '../../core/selectors.js';

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

function cleanProductTexts(root = document) {
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
