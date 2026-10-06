import { SEL } from '../../core/selectors.js';
import { TEXTS } from '../../core/texts.js';

let resizeBound = false;
let resizeTimer = null;
let expandedState = false;

function getBar() {
  return document.querySelector(SEL.categoryFilterBar);
}

function getItems(bar) {
  if (!bar) return [];
  return [...bar.children].filter((item) => item.matches(SEL.categoryFilterItem));
}

function closeDropdowns(bar) {
  getItems(bar).forEach((item) => {
    item.classList.remove('is-active');
    item.querySelector(SEL.categoryFilterHeading)?.setAttribute('aria-expanded', 'false');
  });
}

function setExpanded(bar, expanded) {
  const button = bar?.querySelector(':scope > .timber-filter-more');
  expandedState = Boolean(expanded);
  bar?.classList.toggle('timber-filter-expanded', expandedState);

  if (button) {
    button.textContent = expandedState ? TEXTS.categoryFilter.less : TEXTS.categoryFilter.more;
    button.setAttribute('aria-expanded', String(expandedState));
  }

  if (!expandedState && bar) closeDropdowns(bar);
}

function ensureControls(bar) {
  let button = bar.querySelector(':scope > .timber-filter-more');

  if (!button) {
    button = document.createElement('button');
    button.type = 'button';
    button.className = 'timber-filter-more';
    button.setAttribute('aria-expanded', 'false');
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      setExpanded(bar, !bar.classList.contains('timber-filter-expanded'));
    });
    bar.append(button);
  }

  let breakElement = bar.querySelector(':scope > .timber-filter-break');
  if (!breakElement) {
    breakElement = document.createElement('span');
    breakElement.className = 'timber-filter-break';
    breakElement.setAttribute('aria-hidden', 'true');
    bar.append(breakElement);
  }

  // Legacy CSS expects these two helpers to stay last in DOM order.
  bar.append(button, breakElement);
  return { button };
}

function visibleLimit(bar, items, button) {
  if (!items.length) return 0;

  const computed = window.getComputedStyle(bar);
  const available =
    bar.clientWidth -
    (parseFloat(computed.paddingLeft) || 0) -
    (parseFloat(computed.paddingRight) || 0);

  const originalText = button.textContent;
  const originalHidden = button.hidden;

  button.hidden = false;
  button.textContent = TEXTS.categoryFilter.more;

  const buttonWidth = Math.ceil(button.getBoundingClientRect().width);
  let used = buttonWidth + 4;
  let limit = 0;

  items.forEach((item) => item.classList.remove('timber-filter-overflow'));

  for (const item of items) {
    const itemWidth = Math.ceil(item.getBoundingClientRect().width);
    if (limit > 0 && used + itemWidth > available) break;

    if (limit === 0 || used + itemWidth <= available) {
      used += itemWidth;
      limit += 1;
    } else {
      break;
    }
  }

  button.textContent = originalText;
  button.hidden = originalHidden;
  return Math.max(1, limit);
}

function refresh() {
  const bar = getBar();
  if (!bar) return;

  // Phone controls own their layout. Do not append hidden desktop helpers:
  // Apollo's mobile last-row radius depends on the native child order.
  if (window.innerWidth < 768) {
    bar.querySelector(':scope > .timber-filter-more')?.remove();
    bar.querySelector(':scope > .timber-filter-break')?.remove();
    bar.classList.remove('timber-filter-expanded');
    getItems(bar).forEach((item) => item.classList.remove('timber-filter-overflow'));
    expandedState = false;
    return;
  }

  const { button } = ensureControls(bar);
  const items = getItems(bar);

  // Mobile/tablet keeps native Apollo behaviour.
  if (window.innerWidth < 992) {
    expandedState = false;
    bar.classList.remove('timber-filter-expanded');
    items.forEach((item) => item.classList.remove('timber-filter-overflow'));
    button.hidden = true;
    button.textContent = TEXTS.categoryFilter.more;
    button.setAttribute('aria-expanded', 'false');
    return;
  }

  items.forEach((item) => item.classList.remove('timber-filter-overflow'));

  const limit = visibleLimit(bar, items, button);
  items.forEach((item, index) => {
    item.classList.toggle('timber-filter-overflow', index >= limit);
  });

  const hasMore = items.length > limit;
  button.hidden = !hasMore;

  if (!hasMore) {
    expandedState = false;
    setExpanded(bar, false);
    return;
  }

  setExpanded(bar, expandedState);
}

function bindResize() {
  if (resizeBound) return;
  resizeBound = true;

  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(refresh, 160);
  });
}

export default {
  name: 'category-filter-compact',
  pages: ['category'],
  init() {
    bindResize();
    refresh();
  },
};
