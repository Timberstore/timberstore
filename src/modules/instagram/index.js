import { SEL } from '../../core/selectors.js';
import { setupHorizontalSlider } from '../../core/horizontal-slider.js';
import { INSTAGRAM_FEED } from '../../core/contacts.js';
import { TEXTS } from '../../core/texts.js';

let discoveryObserver;
let feedRequest;

function loadPublicFeed(block) {
  if (feedRequest) return;
  feedRequest = fetch(INSTAGRAM_FEED, { credentials: 'omit', referrerPolicy: 'no-referrer' })
    .then((response) => {
      if (!response.ok) throw new Error('Feed unavailable');
      return response.json();
    })
    .then((data) => {
      if (!block.isConnected || document.querySelector(SEL.instagramWidget)) return;
      const posts = data.posts?.filter((post) => {
        try {
          const link = new URL(post.url);
          const image = new URL(post.image);
          return link.origin === 'https://www.instagram.com' && /^\/(p|reel)\//.test(link.pathname)
            && image.origin === 'https://cdn.myshoptet.com'
            && image.pathname.startsWith('/usr/www.timberstore.sk/user/system/instagram/');
        } catch { return false; }
      });
      if (!posts || posts.length < 6) return;
      const widget = document.createElement('div');
      widget.className = 'instagram-widget';
      for (const post of posts.slice(0, 40)) {
        const item = document.createElement('div');
        item.className = 'instagram-widget-item';
        const link = document.createElement('a');
        link.href = post.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        const image = document.createElement('img');
        image.loading = 'lazy';
        image.decoding = 'async';
        image.width = image.height = 400;
        image.alt = typeof post.alt === 'string' ? post.alt : '';
        image.src = post.image;
        link.append(image);
        item.append(link);
        widget.append(item);
      }
      block.append(widget);
      block.dataset.tsFeedSource = 'public-data';
      refresh();
    })
    .catch(() => { /* Keep the existing profile link and honest unavailable message. */ });
}
const placements = new WeakMap();
const stacked = window.matchMedia('(max-width: 767px)');

function placeSection(block) {
  if (stacked.matches) {
    if (!document.querySelector(SEL.apolloReady)) return;
    const contact = document.querySelector(SEL.footerContacts);
    const footer = document.querySelector(SEL.footerColumns);
    if (!contact || !footer) return;
    if (!placements.has(block)) {
      const marker = document.createComment('');
      block.before(marker);
      placements.set(block, marker);
    }
    block.classList.add('ts-instagram--in-footer');
    if (block.parentElement !== footer || contact.nextElementSibling !== block)
      contact.after(block);
  } else {
    const marker = placements.get(block);
    if (marker?.parentNode) marker.replaceWith(block);
    placements.delete(block);
    block.classList.remove('ts-instagram--in-footer');
  }
}

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
    arrows: true,
    desktopPager: true,
    pageLabel: TEXTS.instagram.page,
    previousLabel: TEXTS.instagram.previous,
    nextLabel: TEXTS.instagram.next,
  });
}

function refresh() {
  const nativeSlot = document.querySelector(SEL.instagramNativeSlot);
  if (nativeSlot && !nativeSlot.querySelector(SEL.instagramWidget)) nativeSlot.hidden = true;
  let blocks = [...document.querySelectorAll(SEL.instagramBlock)];
  const real = blocks.filter((block) => !block.classList.contains('ts-instagram--fallback'));
  if (real.length) {
    for (const block of blocks) {
      if (block.classList.contains('ts-instagram--fallback')) {
        placements.get(block)?.remove();
        placements.delete(block);
        block.remove();
      }
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
  for (const block of blocks) {
    placeSection(block);
    sync(block);
    if (!document.querySelector(SEL.instagramWidget)) loadPublicFeed(block);
  }
}

export default {
  name: 'instagram',
  pages: ['home'],
  init() {
    refresh();
    if (discoveryObserver) return;
    stacked.addEventListener('change', refresh);
    window.addEventListener('load', refresh, { once: true });
    window.requestAnimationFrame(refresh);
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
