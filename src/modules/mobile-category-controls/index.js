import { SEL } from '../../core/selectors.js';

const ROOT_CLASS = 'ts-mobile-category-controls';
const OPEN_CLASS = 'ts-mobile-category-controls--sort-open';
const FILTER_OPEN_CLASS = 'ts-mobile-category-controls--filter-open';
const FILTER_HEADING_OPEN = 'ts-filter-heading-open';

function isMobile() {
  return window.matchMedia('(max-width: 991px)').matches;
}

function sortControls() {
  return [...document.querySelectorAll(SEL.listSortingControl)];
}

function currentSortControl() {
  return sortControls().find((el) => el.classList.contains(SEL.listSortingCurrentClass));
}

function cleanLabel(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function currentSortLabel() {
  return cleanLabel(currentSortControl()?.textContent) || 'Odporúčame';
}

function createChevron() {
  const span = document.createElement('span');
  span.className = 'ts-mobile-category-controls__chevron';
  span.setAttribute('aria-hidden', 'true');
  return span;
}

function createButton(label, modifier) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `ts-mobile-category-controls__button ts-mobile-category-controls__button--${modifier}`;

  const text = document.createElement('span');
  text.className = 'ts-mobile-category-controls__button-text';
  text.textContent = label;

  button.append(text, createChevron());
  return button;
}

function createSortMenu() {
  const menu = document.createElement('div');
  menu.className = 'ts-mobile-category-controls__sort-menu';

  sortControls().forEach((nativeControl) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'ts-mobile-category-controls__sort-option';
    item.dataset.sort = nativeControl.dataset.sort || '';
    item.textContent = cleanLabel(nativeControl.textContent);
    item.classList.toggle(
      'ts-mobile-category-controls__sort-option--current',
      nativeControl.classList.contains(SEL.listSortingCurrentClass),
    );
    menu.append(item);
  });

  return menu;
}

function isElementVisible(element) {
  if (!element) return false;
  const style = window.getComputedStyle(element);
  return style.display !== 'none' && style.visibility !== 'hidden' && element.offsetHeight > 0;
}

function nativeFiltersOpen() {
  const filters = document.querySelector('#filters');
  return isElementVisible(filters);
}

function filterItems() {
  return [
    ...document.querySelectorAll(
      '#category-filter-hover > .slider-wrapper, #category-filter-hover > .filter-section:not(.filter-section-count)',
    ),
  ];
}

function syncFilterHeadings() {
  filterItems().forEach((item) => {
    const heading = item.querySelector(':scope > h4');
    if (!heading) return;

    const panel =
      item.querySelector(':scope > form') ||
      item.querySelector(':scope > .param-filter-top') ||
      item.querySelector(':scope > .price-filter');

    const open =
      isElementVisible(panel) ||
      item.classList.contains('is-active') ||
      item.classList.contains('active') ||
      item.classList.contains('open') ||
      item.classList.contains('opened') ||
      heading.getAttribute('aria-expanded') === 'true';

    heading.classList.toggle(FILTER_HEADING_OPEN, open);
    heading.setAttribute('aria-expanded', String(open));
  });
}

function sync(root) {
  const sortText = root.querySelector(
    '.ts-mobile-category-controls__button--sort .ts-mobile-category-controls__button-text',
  );
  if (sortText) sortText.textContent = currentSortLabel();

  const current = currentSortControl()?.dataset.sort || '';
  root.querySelectorAll('.ts-mobile-category-controls__sort-option').forEach((option) => {
    option.classList.toggle(
      'ts-mobile-category-controls__sort-option--current',
      option.dataset.sort === current,
    );
  });

  const total = document.querySelector(SEL.listItemsTotal);
  const totalCopy = root.querySelector('.ts-mobile-category-controls__total');
  if (totalCopy) totalCopy.textContent = cleanLabel(total?.textContent);

  const filterOpen = nativeFiltersOpen();
  const filterButton = root.querySelector('.ts-mobile-category-controls__button--filter');

  root.classList.toggle(FILTER_OPEN_CLASS, filterOpen);
  filterButton?.classList.toggle('is-active', filterOpen);
  filterButton?.setAttribute('aria-expanded', String(filterOpen));

  syncFilterHeadings();
}

function closeSort(root) {
  root.classList.remove(OPEN_CLASS);
  root
    .querySelector('.ts-mobile-category-controls__button--sort')
    ?.setAttribute('aria-expanded', 'false');
}

function bindFilterHeadingSync() {
  const hover = document.querySelector('#category-filter-hover');
  if (!hover || hover.dataset.tsMobileHeadingSync === '1') return;

  hover.dataset.tsMobileHeadingSync = '1';
  hover.addEventListener('click', (event) => {
    if (!event.target.closest('.slider-wrapper > h4, .filter-section > h4')) return;
    setTimeout(syncFilterHeadings, 30);
    setTimeout(syncFilterHeadings, 180);
  });
}

function build() {
  const root = document.createElement('section');
  root.className = ROOT_CLASS;
  root.setAttribute('aria-label', 'Radenie a filtrovanie produktov');

  const row = document.createElement('div');
  row.className = 'ts-mobile-category-controls__row';

  const filterButton = createButton('Filtrovať', 'filter');
  filterButton.setAttribute('aria-expanded', 'false');

  const sortButton = createButton(currentSortLabel(), 'sort');
  sortButton.setAttribute('aria-expanded', 'false');

  row.append(filterButton, sortButton);

  const menu = createSortMenu();

  const total = document.createElement('div');
  total.className = 'ts-mobile-category-controls__total';
  total.setAttribute('aria-live', 'polite');

  root.append(row, menu, total);

  root.addEventListener('click', (event) => {
    const filter = event.target.closest('.ts-mobile-category-controls__button--filter');
    if (filter) {
      closeSort(root);
      const nativeTrigger = document.querySelector(SEL.mobileFilterTrigger);
      nativeTrigger?.click();
      setTimeout(() => sync(root), 30);
      setTimeout(() => sync(root), 180);
      return;
    }

    const sort = event.target.closest('.ts-mobile-category-controls__button--sort');
    if (sort) {
      const open = !root.classList.contains(OPEN_CLASS);
      root.classList.toggle(OPEN_CLASS, open);
      sort.setAttribute('aria-expanded', String(open));
      return;
    }

    const option = event.target.closest('.ts-mobile-category-controls__sort-option');
    if (option) {
      const native = sortControls().find(
        (control) => (control.dataset.sort || '') === option.dataset.sort,
      );
      closeSort(root);
      native?.click();
      setTimeout(() => sync(root), 30);
      setTimeout(() => sync(root), 180);
    }
  });

  return root;
}

function render() {
  document.querySelectorAll(`.${ROOT_CLASS}`).forEach((el) => el.remove());
  if (!isMobile()) return;

  const filters = document.querySelector(SEL.filtersWrapper);
  if (!filters || !sortControls().length) return;

  const root = build();
  filters.before(root);
  bindFilterHeadingSync();
  sync(root);
}

export default {
  name: 'mobile-category-controls',
  pages: ['category'],
  init() {
    render();
  },
};
