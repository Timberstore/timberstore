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

function findSupportBox(sidebar) {
  const headings = sidebar.querySelectorAll('h1, h2, h3, h4, h5, strong');
  for (const heading of headings) {
    if (normalize(heading.textContent).includes('sme tu pre vas')) {
      return directSidebarChild(heading, sidebar);
    }
  }
  return null;
}

function reorderNativeSidebar(sidebar) {
  const topProducts = sidebar.querySelector(SEL.globalTopProducts);
  const support = findSupportBox(sidebar);
  if (!topProducts || !support || topProducts === support) return;

  const topProductsBlock = directSidebarChild(topProducts, sidebar) || topProducts;
  if (support.nextElementSibling !== topProductsBlock) support.after(topProductsBlock);
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

    const price = document.createElement('span');
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

function render(root) {
  const sidebar = document.querySelector(SEL.sidebarLeft);
  if (!sidebar) return;

  reorderNativeSidebar(sidebar);

  const source = root.querySelector(SEL.categoryBestsellers) || document.querySelector(SEL.categoryBestsellers);
  if (!source) {
    sidebar.querySelector(`.${BOX_CLASS}`)?.remove();
    return;
  }

  // Apollo owns this block and its expand/collapse logic. Keep it in the DOM,
  // but remove it from the main column. We render a small read-only sidebar view.
  source.classList.add('ts-category-bestsellers-source');

  const data = [...source.querySelectorAll(SEL.categoryBestsellerProduct)]
    .map(productData)
    .filter(Boolean)
    .slice(0, 10);

  sidebar.querySelector(`.${BOX_CLASS}`)?.remove();
  if (!data.length) return;

  const box = buildBox(data);
  const topProducts = sidebar.querySelector(SEL.globalTopProducts);
  const topProductsBlock = topProducts ? directSidebarChild(topProducts, sidebar) || topProducts : null;

  if (topProductsBlock) topProductsBlock.before(box);
  else {
    const support = findSupportBox(sidebar);
    if (support) support.before(box);
    else sidebar.append(box);
  }
}

export default {
  name: 'category-bestsellers-sidebar',
  pages: ['category'],
  init(root) {
    render(root);
  },
};
