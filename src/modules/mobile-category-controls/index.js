import { SEL } from '../../core/selectors.js';

const ROOT_CLASS = 'ts-mobile-category-controls';
const SORT_OPEN_CLASS = 'ts-mobile-category-controls--sort-open';

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

function nativeFiltersOpen() {
  const filters = document.querySelector('#filters');
  if (!filters) return false;
  const style = window.getComputedStyle(filters);
  return style.display !== 'none' && style.visibility !== 'hidden' && filters.offsetHeight > 0;
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

  const filterButton = root.querySelector('.ts-mobile-category-controls__button--filter');
  const open = nativeFiltersOpen();
  filterButton?.classList.toggle('is-active', open);
  filterButton?.setAttribute('aria-expanded', String(open));
}

function closeSort(root) {
  root.classList.remove(SORT_OPEN_CLASS);
  root
    .querySelector('.ts-mobile-category-controls__button--sort')
    ?.setAttribute('aria-expanded', 'false');
}

function observeNativeFilter(root) {
  const filters = document.querySelector('#filters');
  if (!filters || filters.dataset.tsMobileFilterObserved === '1') return;

  filters.dataset.tsMobileFilterObserved = '1';

  const observer = new MutationObserver(() => {
    requestAnimationFrame(() => sync(root));
  });

  observer.observe(filters, {
    attributes: true,
    attributeFilter: ['class', 'style', 'aria-hidden'],
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

  root.append(row, menu);

  const filterSlot = document.createElement('div');
  filterSlot.className = 'ts-mobile-category-controls__filter-slot';

  root.append(filterSlot, total);

  root.addEventListener('click', (event) => {
    const filter = event.target.closest('.ts-mobile-category-controls__button--filter');
    if (filter) {
      closeSort(root);
      document.querySelector(SEL.mobileFilterTrigger)?.click();
      setTimeout(() => sync(root), 30);
      setTimeout(() => sync(root), 180);
      return;
    }

    const sort = event.target.closest('.ts-mobile-category-controls__button--sort');
    if (sort) {
      const open = !root.classList.contains(SORT_OPEN_CLASS);
      root.classList.toggle(SORT_OPEN_CLASS, open);
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
  const existing = document.querySelector(`.${ROOT_CLASS}`);
  let filters = document.querySelector(SEL.filtersWrapper);

  // If a previous render already moved the native Apollo filter inside our toolbar,
  // detach it before removing the toolbar so the native filter DOM is never destroyed.
  if (existing && filters && existing.contains(filters)) {
    existing.before(filters);
  }

  existing?.remove();
  if (!isMobile()) return;

  filters = document.querySelector(SEL.filtersWrapper);
  if (!filters || !sortControls().length) return;

  const root = build();
  filters.before(root);
  root.querySelector('.ts-mobile-category-controls__filter-slot')?.append(filters);

  observeNativeFilter(root);
  sync(root);
}

export default {
  name: 'mobile-category-controls',
  pages: ['category'],
  init() {
    render();
  },
};
