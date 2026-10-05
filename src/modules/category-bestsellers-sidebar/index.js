import { SEL } from '../../core/selectors.js';

const BOX_CLASS = 'ts-category-bestsellers-sidebar';
const TITLE = 'Najpredávanejšie v kategórii';

function normalize(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

function directSidebarChild(node, sidebar) {
  let current = node;
  while (current && current.parentElement && current.parentElement !== sidebar) {
    current = current.parentElement;
  }
  return current?.parentElement === sidebar ? current : null;
}

function findBoxByHeading(sidebar, needle) {
  const target = normalize(needle);
  for (const heading of sidebar.querySelectorAll('h1, h2, h3, h4, h5, strong')) {
    if (normalize(heading.textContent).includes(target)) {
      return directSidebarChild(heading, sidebar);
    }
  }
  return null;
}

function findCategoryBox(sidebar) {
  // Apollo's native category navigation box. Use its structural class first;
  // heading text is only a fallback for unexpected markup variants.
  return (
    sidebar.querySelector('.box-categories') ||
    findBoxByHeading(sidebar, 'Kategórie') ||
    findBoxByHeading(sidebar, 'Kategorie')
  );
}

function findSupportBox(sidebar) {
  return findBoxByHeading(sidebar, 'Sme tu pre vás');
}

function nativeTopProductsBox(sidebar) {
  const wrapper = sidebar.querySelector(SEL.globalTopProducts);
  return wrapper ? directSidebarChild(wrapper, sidebar) || wrapper : null;
}

function productData(product) {
  const nameLink = product.querySelector('a.name');
  if (!nameLink) return null;

  const image = product.querySelector('a.image img');
  const price =
    product.querySelector('.price-final strong') ||
    product.querySelector('.price-final') ||
    product.querySelector('.prices .price') ||
    product.querySelector('.price');

  return {
    href: nameLink.href,
    name: nameLink.textContent.trim(),
    image: image?.currentSrc || image?.src || image?.dataset?.src || '',
    alt: image?.alt || nameLink.textContent.trim(),
    price: price?.textContent.trim() || '',
  };
}

function buildBox(products) {
  const box = document.createElement('section');
  box.className = BOX_CLASS;
  box.setAttribute('aria-label', TITLE);

  const heading = document.createElement('h3');
  heading.className = `${BOX_CLASS}__title`;
  heading.textContent = TITLE;

  const list = document.createElement('ol');
  list.className = `${BOX_CLASS}__list`;

  products.forEach((data) => {
    const item = document.createElement('li');
    item.className = `${BOX_CLASS}__item`;

    const link = document.createElement('a');
    link.className = `${BOX_CLASS}__link`;
    link.href = data.href;

    const rank = document.createElement('span');
    rank.className = `${BOX_CLASS}__rank`;
    rank.setAttribute('aria-hidden', 'true');

    const media = document.createElement('span');
    media.className = `${BOX_CLASS}__media`;
    if (data.image) {
      const img = document.createElement('img');
      img.src = data.image;
      img.alt = data.alt;
      img.loading = 'lazy';
      media.append(img);
    }

    const body = document.createElement('span');
    body.className = `${BOX_CLASS}__body`;

    const name = document.createElement('span');
    name.className = `${BOX_CLASS}__name`;
    name.textContent = data.name;

    const price = document.createElement('strong');
    price.className = `${BOX_CLASS}__price`;
    price.textContent = data.price;

    body.append(name, price);
    link.append(rank, media, body);
    item.append(link);
    list.append(item);
  });

  box.append(heading, list);
  return box;
}

function copyTop10Frame(categoryBestsellers, globalTopBox) {
  if (!globalTopBox) return;
  const style = getComputedStyle(globalTopBox);
  categoryBestsellers.style.border = style.border;
  categoryBestsellers.style.borderRadius = style.borderRadius;
  categoryBestsellers.style.background = style.background;
  categoryBestsellers.style.boxShadow = style.boxShadow;
}

function placeSidebarBoxes(sidebar, categoryBestsellers) {
  const categoryBox = findCategoryBox(sidebar);
  const supportBox = findSupportBox(sidebar);
  const globalTopBox = nativeTopProductsBox(sidebar);

  copyTop10Frame(categoryBestsellers, globalTopBox);

  // Requested fixed order:
  // Kategórie -> Najpredávanejšie v kategórii -> Sme tu pre vás -> TOP 10.
  if (categoryBox) categoryBox.after(categoryBestsellers);
  else sidebar.prepend(categoryBestsellers);

  if (supportBox) categoryBestsellers.after(supportBox);
  if (globalTopBox && supportBox) supportBox.after(globalTopBox);
  else if (globalTopBox) categoryBestsellers.after(globalTopBox);
}

function render(root) {
  const sidebar = document.querySelector(SEL.sidebarLeft);
  if (!sidebar) return;

  const source =
    root.querySelector?.(SEL.categoryBestsellers) ||
    document.querySelector(SEL.categoryBestsellers);

  sidebar.querySelector(`.${BOX_CLASS}`)?.remove();

  if (!source) return;

  // Keep Apollo's original block in the DOM so Shoptet's own bestseller JS and
  // accessibility logic remain intact. Only the visual position changes.
  source.classList.add('ts-category-bestsellers-source');

  const data = [...source.querySelectorAll(SEL.categoryBestsellerProduct)]
    .map(productData)
    .filter(Boolean)
    .slice(0, 10);

  if (!data.length) return;

  placeSidebarBoxes(sidebar, buildBox(data));
}

export default {
  name: 'category-bestsellers-sidebar',
  pages: ['category'],
  init(root) {
    render(root);
  },
};
