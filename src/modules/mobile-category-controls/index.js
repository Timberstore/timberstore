// Mobile presentation only. Apollo owns accordion clicks and Shoptet owns
// filter/sort requests. Move the real nodes, never their forms or inputs.
import { SEL } from '../../core/selectors.js';
import { TEXTS } from '../../core/texts.js';
import { enhanceValues } from './values.js';

const media = window.matchMedia('(max-width: 767px)');
const CLOSED_ARROW = String.fromCodePoint(0xe900);
const OPEN_ARROW = String.fromCodePoint(0xe915);
let state = null;
let listening = false;
let panel = null;
const expandedValues = new Set();

function resizePopup() {
  if (!state || !panel) return;
  const viewport = window.visualViewport;
  const bottom = viewport ? viewport.offsetTop + viewport.height : window.innerHeight;
  const available = Math.max(
    120,
    Math.min(
      (viewport?.height || window.innerHeight) * 0.72,
      bottom - state.root.getBoundingClientRect().bottom - 20,
    ),
  );
  state.root.style.setProperty('--ts-mobile-category-max-height', `${Math.floor(available)}px`);
}

function closePanel(restoreFocus = false) {
  if (!state || !panel) return;
  const button = panel === 'filters' ? state.filterButton : state.sortButton;
  panel = null;
  sync();
  if (restoreFocus) button.focus();
}

function move(node, host) {
  const marker = document.createComment('ts-mobile-category original position');
  node.before(marker);
  host.append(node);
  return { node, marker };
}

function restore({ node, marker }) {
  if (marker.isConnected) marker.replaceWith(node);
}

function bindDesktopOriginAccordion(filters) {
  // A page loaded as desktop has Apollo row-layout handlers instead of accordions.
  // Invoke Apollo's own initializer on a narrow viewport, retaining exact handler
  // references so leaving mobile removes only the listeners we just requested.
  const jq = window.jQuery;
  if (!jq?._data || typeof window.initFilterAccordion !== 'function') return [];
  const headings = [...filters.querySelectorAll(SEL.categoryFilterGroup)]
    .map((group) => group.querySelector(SEL.categoryFilterHeading))
    .filter(Boolean);
  const clicks = (heading) =>
    (jq._data(heading, 'events')?.click || []).map((entry) => entry.handler);
  const before = new Map(headings.map((heading) => [heading, clicks(heading)]));
  if (headings.every((heading) => before.get(heading).length)) return [];
  window.initFilterAccordion();
  const added = [];
  for (const heading of headings) {
    for (const handler of clicks(heading).filter((entry) => !before.get(heading).includes(entry))) {
      if (before.get(heading).length) jq(heading).off('click', handler);
      else added.push([heading, handler]);
    }
  }
  return added;
}

function button(name, label, controls) {
  const element = document.createElement('button');
  element.type = 'button';
  element.className = 'ts-mobile-category__button';
  element.dataset.tsPanel = name;
  element.setAttribute('aria-controls', controls);
  element.setAttribute('aria-expanded', 'false');
  const text = document.createElement('span');
  text.className = 'ts-mobile-category__label';
  text.textContent = label;
  const arrow = document.createElement('span');
  arrow.className = 'ts-mobile-category__arrow';
  arrow.setAttribute('aria-hidden', 'true');
  arrow.textContent = CLOSED_ARROW;
  element.append(text, arrow);
  return element;
}

function sync() {
  if (!state) return;
  state.values.refresh();
  if (document.body.classList.contains(SEL.categoryFilterRowClass)) {
    document.body.classList.remove(SEL.categoryFilterRowClass);
  }
  const current = state.sorting.querySelector(`.${SEL.listSortingCurrentClass}`);
  const label = (
    current || state.sorting.querySelector(SEL.listSortingControl)
  )?.textContent.trim();
  const sortLabel = state.sortButton.querySelector('.ts-mobile-category__label');
  if (sortLabel.textContent !== (label || '')) sortLabel.textContent = label || '';
  state.sortButton.title = label || '';
  for (const [name, element, target] of [
    ['filters', state.filterButton, state.filterPanel],
    ['sorting', state.sortButton, state.sortPanel],
  ]) {
    const open = panel === name;
    element.setAttribute('aria-expanded', String(open));
    const arrow = element.querySelector('.ts-mobile-category__arrow');
    const glyph = open ? OPEN_ARROW : CLOSED_ARROW;
    if (arrow.textContent !== glyph) arrow.textContent = glyph;
    target.hidden = !open;
  }
  for (const group of state.filters.querySelectorAll(SEL.categoryFilterGroup)) {
    group
      .querySelector(SEL.categoryFilterHeading)
      ?.setAttribute(
        'aria-expanded',
        String(group.classList.contains(SEL.categoryFilterActiveClass)),
      );
  }
  resizePopup();
}

function dispose() {
  if (!state) return;
  state.observer.disconnect();
  state.values.dispose();
  for (const [heading, handler] of state.apolloBindings) {
    window.jQuery(heading).off('click', handler);
  }
  for (const [element, attributes] of state.attributes) {
    element.classList.remove('ts-mobile-category__row', 'ts-mobile-category__heading');
    for (const [name, value] of attributes) {
      if (value === null) element.removeAttribute(name);
      else element.setAttribute(name, value);
    }
  }
  state.filters.classList.toggle(SEL.categoryFilterVisibleClass, state.wasVisible);
  const displacedWrapper = state.filters.parentElement;
  restore(state.filterMove);
  // Apollo can wrap/reposition the moved node in its delayed desktop setup.
  // Remove only its now-empty extra wrapper, never a native form/control.
  if (
    displacedWrapper !== state.filterPanel &&
    displacedWrapper?.matches(SEL.categoryFiltersInnerWrapper) &&
    !displacedWrapper.children.length
  )
    displacedWrapper.remove();
  restore(state.sortMove);
  state.wrapper.classList.remove('ts-mobile-category-source');
  document.body.classList.toggle(SEL.categoryFilterRowClass, state.wasRowFilter);
  state.root.remove();
  state = null;
}

function refresh() {
  if (!media.matches) {
    dispose();
    panel = null;
    expandedValues.clear();
    return;
  }
  const header = document.querySelector(SEL.categoryHeader);
  const filters = document.querySelector(SEL.categoryFilters);
  const sorting = header?.querySelector(SEL.listSorting);
  const wrapper = document.querySelector(SEL.categoryFiltersWrapper);
  if (
    state &&
    state.root.isConnected &&
    state.filters === filters &&
    state.sorting === sorting &&
    filters.parentElement === state.filterPanel &&
    sorting.parentElement === state.sortPanel
  ) {
    document.body.classList.remove(SEL.categoryFilterRowClass);
    sync();
    return;
  }
  dispose();
  if (!header || !filters || !sorting || !wrapper) return;

  const root = document.createElement('div');
  root.className = 'ts-mobile-category';
  const toolbar = document.createElement('div');
  toolbar.className = 'ts-mobile-category__toolbar';
  toolbar.setAttribute('role', 'group');
  toolbar.setAttribute('aria-label', TEXTS.mobileCategory.controls);
  const slot = document.createElement('div');
  slot.className = 'ts-mobile-category__slot';
  const filterPanel = document.createElement('div');
  filterPanel.id = 'ts-mobile-category-filters';
  filterPanel.className = 'ts-mobile-category__panel filters-wrapper';
  const sortPanel = document.createElement('div');
  sortPanel.id = 'ts-mobile-category-sorting';
  sortPanel.className = 'ts-mobile-category__panel ts-mobile-category__sorting';
  const filterButton = button('filters', TEXTS.mobileCategory.filter, filterPanel.id);
  const sortButton = button('sorting', '', sortPanel.id);
  toolbar.append(filterButton, sortButton);
  slot.append(filterPanel, sortPanel);
  root.append(toolbar, slot);
  header.prepend(root);

  state = {
    root,
    filters,
    sorting,
    wrapper,
    filterPanel,
    sortPanel,
    filterButton,
    sortButton,
    wasVisible: filters.classList.contains(SEL.categoryFilterVisibleClass),
    wasRowFilter: document.body.classList.contains(SEL.categoryFilterRowClass),
    filterMove: move(filters, filterPanel),
    sortMove: move(sorting, sortPanel),
    attributes: new Map(),
    apolloBindings: bindDesktopOriginAccordion(filters),
    values: enhanceValues(filters, expandedValues),
  };
  wrapper.classList.add('ts-mobile-category-source');
  // Apollo's desktop row layout uses absolute dropdowns. Suspend that layout
  // while narrow, then restore its original body class with the native nodes.
  document.body.classList.remove(SEL.categoryFilterRowClass);
  filters.classList.add(SEL.categoryFilterVisibleClass);
  for (const group of filters.querySelectorAll(SEL.categoryFilterGroup)) {
    group.classList.add('ts-mobile-category__row');
    state.attributes.set(group, []);
    const heading = group.querySelector(SEL.categoryFilterHeading);
    if (!heading) continue;
    state.attributes.set(
      heading,
      ['role', 'tabindex', 'aria-expanded'].map((name) => [name, heading.getAttribute(name)]),
    );
    heading.classList.add('ts-mobile-category__heading');
    heading.setAttribute('role', 'button');
    heading.setAttribute('tabindex', '0');
  }

  root.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-ts-panel]');
    const more = event.target.closest('.ts-mobile-category__more');
    if (trigger) {
      panel = panel === trigger.dataset.tsPanel ? null : trigger.dataset.tsPanel;
      sync();
    } else if (more) {
      state.values.toggle(more);
    } else if (event.target.closest(SEL.listSortingControl)) {
      // Let the original click bubble to Shoptet's request handler.
      panel = null;
      sync();
    }
  });
  root.addEventListener('change', () => state.values.refresh());
  root.addEventListener('keydown', (event) => {
    if (
      ['Enter', ' '].includes(event.key) &&
      event.target.matches('.ts-mobile-category__heading')
    ) {
      event.preventDefault();
      // Invoke Apollo's existing click handler; do not implement an accordion.
      event.target.click();
    }
  });
  state.observer = new MutationObserver(() => {
    if (
      !root.isConnected ||
      filters.parentElement !== filterPanel ||
      sorting.parentElement !== sortPanel
    ) {
      refresh();
    } else sync();
  });
  // Only native class changes matter. Our ARIA updates cannot retrigger this.
  state.observer.observe(filters, { subtree: true, attributes: true, attributeFilter: ['class'] });
  state.observer.observe(sorting, { subtree: true, attributes: true, attributeFilter: ['class'] });
  // Also recover after Apollo's delayed row setup or a native AJAX replacement.
  state.observer.observe(header.parentElement, { subtree: true, childList: true });
  state.observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  sync();
}

export default {
  name: 'mobile-category-controls',
  pages: ['category'],
  init() {
    if (!listening) {
      listening = true;
      media.addEventListener('change', refresh);
      window.addEventListener('resize', resizePopup, { passive: true });
      window.addEventListener('scroll', resizePopup, { passive: true });
      window.visualViewport?.addEventListener('resize', resizePopup, { passive: true });
      window.visualViewport?.addEventListener('scroll', resizePopup, { passive: true });
      document.addEventListener('pointerdown', (event) => {
        if (state && !state.root.contains(event.target)) closePanel();
      });
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && panel) {
          event.preventDefault();
          closePanel(true);
        }
      });
    }
    // Run after Apollo's synchronous AJAX handlers, regardless of listener order.
    queueMicrotask(refresh);
  },
};
