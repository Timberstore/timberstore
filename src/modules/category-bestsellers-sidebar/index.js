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

function nativeTopProductsBox(sidebar) {
  const wrapper = sidebar.querySelector(SEL.globalTopProducts);
  return wrapper ? directSidebarChild(wrapper, sidebar) || wrapper : null;
}

function reorderNativeSidebar(sidebar) {
  const topProducts = nativeTopProductsBox(sidebar);
  const support = findSupportBox(sidebar);
  if (!topProducts || !support || topProducts === support) return;

  if (support.nextElementSibling !== topProducts) support.after(topProducts);
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

// Use Apollo/Shoptet's native Top 10 markup deliberately. This makes the new
// category bestseller box inherit exactly the same border, spacing, numbering,
// thumbnail and typography rules as the existing "Top 10 produktov" box.
function buildBox(products) {
  const box = document.createElement('div');
  box.className = `box box-bg-variant box-sm box-topProducts ${BOX_CLASS}`;

  const wrapper = document.createElement('div');
  wrapper.className = 'top-products-wrapper';

  const heading = document.createElement('h4');
  const headingText = document.createElement('span');
  headingText.textContent = TITLE;
  heading.append(headingText);

  const list = document.createElement('ol');
  list.className = 'top-products';

  products.forEach((data) => {
    const item = document.createElement('li');
    item.className = 'display-image';

    const imageLink = document.createElement('a');
    imageLink.className = 'top-products-image';
    imageLink.href = data.href;
    imageLink.setAttribute('aria-hidden', 'true');
    imageLink.tabIndex = -1;

    if (data.image) {
      const img = document.createElement('img');
      img.src = data.image;
      img.alt = data.alt;
      img.loading = 'lazy';
      imageLink.append(img);
    }

    const contentLink = document.createElement('a');
    contentLink.className = 'top-products-content';
    contentLink.href = data.href;

    const name = document.createElement('span');
    name.className = 'top-products-name';
    name.textContent = data.name;

    const price = document.createElement('strong');
    price.textContent = data.price;

    contentLink.append(name, price);
    item.append(imageLink, contentLink);
    list.append(item);
  });

  wrapper.append(heading, list);
  box.append(wrapper);
  return box;
}

function render(root) {
  const sidebar = document.querySelector(SEL.sidebarLeft);
  if (!sidebar) return;

  reorderNativeSidebar(sidebar);

  const source =
    root.querySelector?.(SEL.categoryBestsellers) ||
    document.querySelector(SEL.categoryBestsellers);

  if (!source) {
    sidebar.querySelector(`.${BOX_CLASS}`)?.remove();
    return;
  }

  // Apollo owns this native block and its expand/collapse logic. Keep the
  // original node in the DOM and only hide it visually; the sidebar gets a
  // read-only representation, so we do not interfere with Shoptet handlers.
  source.classList.add('ts-category-bestsellers-source');

  const data = [...source.querySelectorAll(SEL.categoryBestsellerProduct)]
    .map(productData)
    .filter(Boolean)
    .slice(0, 10);

  sidebar.querySelector(`.${BOX_CLASS}`)?.remove();
  if (!data.length) return;

  const box = buildBox(data);
  const support = findSupportBox(sidebar);
  const topProducts = nativeTopProductsBox(sidebar);

  // Requested order:
  // category bestsellers -> "Sme tu pre vás" -> global "Top 10 produktov".
  if (support) support.before(box);
  else if (topProducts) topProducts.before(box);
  else sidebar.append(box);
}

export default {
  name: 'category-bestsellers-sidebar',
  pages: ['category'],
  init(root) {
    render(root);
  },
};
