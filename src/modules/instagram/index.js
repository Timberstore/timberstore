import { SEL } from '../../core/selectors.js';
import { setupHorizontalSlider } from '../../core/horizontal-slider.js';
import { TEXTS } from '../../core/texts.js';

let discoveryObserver;

function sync(block) {
  let heading = block.querySelector('.ts-instagram__heading');
  const wrapper = block.querySelector(SEL.instagramFollow);
  let follow = wrapper?.matches('a[href]') ? wrapper : wrapper?.querySelector('a[href]');
  if (!heading && !follow) {
    const source = document.querySelector(SEL.socialInstagram);
    if (source) {
      follow = source.cloneNode(false);
      follow.removeAttribute('data-testid');
      follow.className = 'instagram-follow-btn';
    }
  }
  if (!heading && follow) {
    heading = document.createElement('h2');
    heading.className = 'ts-instagram__heading';
    // Reuse the configured official profile destination; do not invent a URL.
    follow.classList.add('instagram-follow-btn', 'ts-instagram__profile');
    follow.classList.remove('btn', 'btn-primary', 'btn-secondary');
    follow.textContent = TEXTS.instagram.title;
    follow.rel = 'noopener noreferrer';
    heading.append(follow);
    block.prepend(heading);
  }
  if (wrapper && wrapper !== follow && !heading?.contains(wrapper)) wrapper.remove();
  if (heading && follow && !heading.contains(follow)) follow.remove();
  const items = [...block.querySelectorAll(SEL.instagramItem)];
  for (const item of items) {
    item.hidden = false;
    // Keep native media URLs and post permalinks, including their feed order.
    const img = item.querySelector('img');
    if (img) {
      // Shoptet unveil selects img:not([loading]). Setting loading first
      // used to skip its data-src -> src promotion, leaving empty cards.
      // Resolve only this native image's supplied source before lazy loading.
      const source = (window.devicePixelRatio > 1 && img.dataset.srcRetina) || img.dataset.src;
      if (source && img.getAttribute('src') !== source) img.setAttribute('src', source);
      img.loading = 'lazy';
      img.decoding = 'async';
      img.width = 400;
      img.height = 400;
    }
  }
  let empty = block.querySelector('.ts-instagram__empty');
  if (!empty) {
    empty = document.createElement('p');
    empty.className = 'ts-instagram__empty';
    empty.textContent = TEXTS.instagram.unavailable;
    block.append(empty);
  }
  empty.hidden = items.length > 0;
  block.dataset.tsFeedCount = String(items.length);
  setupHorizontalSlider(block, {
    widgetSelector: SEL.instagramWidget,
    itemSelector: SEL.instagramItem,
    prefix: 'ts-instagram',
    pageLabel: TEXTS.instagram.page,
  });
}

function refresh() {
  let blocks = [...document.querySelectorAll(SEL.instagramBlock)];
  const real = blocks.filter((block) => !block.classList.contains('ts-instagram--fallback'));
  if (real.length) {
    for (const block of blocks) {
      if (block.classList.contains('ts-instagram--fallback')) block.remove();
    }
    blocks = real;
  } else if (!blocks.length) {
    const placement = document.querySelector(SEL.instagramPlacement);
    if (placement) {
      const fallback = document.createElement('div');
      fallback.className = 'content-wrapper instagram-block ts-instagram--fallback';
      placement.append(fallback);
      blocks = [fallback];
    }
  }
  for (const block of blocks) sync(block);
}

export default {
  name: 'instagram',
  pages: ['home'],
  init() {
    refresh();
    if (discoveryObserver) return;
    // Apollo moves the widget out of the footer. Observe relevant additions
    // anywhere on the page so consent/delayed insertion still works. Ignore
    // unrelated mutations; one observer and no polling or extra feed requests.
    discoveryObserver = new MutationObserver((records) => {
      const relevant = records.some((record) =>
        record.type === 'attributes'
          ? record.target.matches(SEL.instagramImage)
          : [...record.addedNodes, ...record.removedNodes].some(
              (node) =>
                node.nodeType === 1 &&
                (node.matches(SEL.instagramChanges) || node.querySelector(SEL.instagramChanges)),
            ),
      );
      if (relevant) refresh();
    });
    discoveryObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-src', 'data-src-retina'],
    });
  },
};
