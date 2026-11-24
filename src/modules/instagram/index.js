import { addContactIcon } from '../../core/contact-icons.js';
import { SEL } from '../../core/selectors.js';
import { setupHorizontalSlider } from '../../core/horizontal-slider.js';
import { INSTAGRAM_FEEDS, SOCIALS } from '../../core/contacts.js';
import { TEXTS } from '../../core/texts.js';

let discoveryObserver;
let feedRequest;
let publicItems = [];

async function loadItem(post, feedUrl) {
  try {
    const link = document.createElement('a');
    link.href = post.url;
    if (link.origin !== 'https://www.instagram.com' || !/^\/(p|reel)\/[\w-]+\/?$/.test(link.pathname)) return;
    const image = new URL(post.image, feedUrl);
    if (!/^instagram-media\/[a-f0-9]{64}\.jpg$/.test(post.image) &&
      !image.href.startsWith('https://cdn.myshoptet.com/usr/www.timberstore.sk/user/system/instagram/')) return;
    const thumbnail = new Image(400, 400);
    thumbnail.alt = typeof post.alt === 'string' ? post.alt : '';
    thumbnail.referrerPolicy = 'no-referrer';
    thumbnail.src = image.href;
    await thumbnail.decode();
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.append(thumbnail);
    const item = document.createElement('div');
    item.className = 'instagram-widget-item';
    item.append(link);
    return item;
  } catch { /* Reject malformed entries and broken images. */ }
}

async function loadPublicFeed() {
  let best = [];
  for (const url of INSTAGRAM_FEEDS) {
    const controller = new AbortController();
    let timeout;
    try {
      const deadline = new Promise((resolve) => {
        timeout = setTimeout(() => { controller.abort(); resolve([]); }, 6000);
      });
      const response = await fetch(url, {
        signal: controller.signal, credentials: 'omit', referrerPolicy: 'no-referrer',
      });
      if (!response.ok) continue;
      const { posts } = await response.json();
      if (!Array.isArray(posts)) continue;
      const checked = Promise.all(posts.slice(0, 40).map((post) => loadItem(post, url)));
      const valid = (await Promise.race([checked, deadline])).filter(Boolean);
      if (valid.length >= 6) return valid;
      if (valid.length > best.length) best = valid;
    } catch { /* Try the other CDN. */ }
    finally { clearTimeout(timeout); }
  }
  return best;
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
    if (block.parentElement !== footer || contact.previousElementSibling !== block)
      contact.before(block);
  } else {
    const marker = placements.get(block);
    if (marker?.parentNode) marker.replaceWith(block);
    placements.delete(block);
    block.classList.remove('ts-instagram--in-footer');
  }
}

function sync(block) {
  const wrapper = block.querySelector(SEL.instagramFollow);
  if (!wrapper?.matches('.ts-instagram__profile')) wrapper?.remove();
  if (!block.querySelector('.ts-instagram__heading')) {
    const heading = document.createElement('h2');
    heading.className = 'ts-instagram__heading';
    const follow = document.createElement('a');
    follow.href = SOCIALS.instagram;
    follow.target = '_blank';
    follow.className = 'instagram-follow-btn ts-instagram__profile';
    follow.textContent = TEXTS.instagram.title;
    follow.rel = 'noopener noreferrer';
    addContactIcon(follow, 'instagram');
    heading.append(follow);
    block.prepend(heading);
  }
  const items = [...block.querySelectorAll(SEL.instagramItem)];
  for (const item of items) {
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
      if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) item.remove();
    }
  }
  let empty = block.querySelector('.ts-instagram__empty');
  if (!empty) {
    empty = document.createElement('p');
    empty.className = 'ts-instagram__empty';
    empty.textContent = TEXTS.instagram.unavailable;
    block.append(empty);
  }
  const count = block.querySelectorAll(SEL.instagramItem).length;
  empty.hidden = count > 0;
  block.dataset.tsFeedCount = String(count);
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
  const blocks = [...document.querySelectorAll(SEL.instagramBlock)];
  const native = blocks.filter((block) => !block.classList.contains('ts-instagram--fallback'));
  let fallback = blocks.find((block) => block.classList.contains('ts-instagram--fallback'));
  const placement = document.querySelector(SEL.instagramPlacement);
  if (!fallback && placement) {
    fallback = document.createElement('div');
    fallback.className = 'content-wrapper instagram-block ts-instagram--fallback';
    placement.append(fallback);
  }
  if (fallback && publicItems.length && !fallback.querySelector(SEL.instagramWidget)) {
    const widget = document.createElement('div');
    widget.className = 'instagram-widget';
    widget.append(...publicItems);
    fallback.append(widget);
    fallback.dataset.tsFeedSource = 'public-data';
  }

  const visible = (!publicItems.length && native.find((block) => block.querySelector(SEL.instagramItem))) || fallback;
  for (const block of [...native, fallback].filter(Boolean)) block.hidden = block !== visible;
  if (nativeSlot) nativeSlot.hidden = !nativeSlot.contains(visible);
  if (visible) {
    placeSection(visible);
    sync(visible);
  }
}

function requestFeed() {
  if (feedRequest || publicItems.length) return;
  feedRequest = loadPublicFeed().then((items) => {
    publicItems = items;
    refresh();
  }).finally(() => {
    feedRequest = null;
  });
}

export default {
  name: 'instagram',
  pages: ['home'],
  init() {
    refresh();
    if (discoveryObserver) return;
    requestFeed();
    window.addEventListener('online', requestFeed);
    document.body.addEventListener('error', (event) => {
      const image = event.target;
      if (!(image instanceof HTMLImageElement) || !image.matches(SEL.instagramImage)) return;
      image.closest(SEL.instagramItem).remove();
    }, true);
    stacked.addEventListener('change', refresh);
    window.addEventListener('load', refresh, { once: true });
    // Apollo moves the widget out of the footer. Observe relevant additions
    // anywhere on the page so consent/delayed insertion still works. Ignore
    // unrelated mutations and keep the public gallery during native updates.
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
