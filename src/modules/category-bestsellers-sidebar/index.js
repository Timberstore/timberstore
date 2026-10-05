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

function sidebarRoot() {
  const sidebar = document.querySelector(SEL.sidebarLeft);
  if (!sidebar) return null;
  // Shoptet 3G uses .sidebar-inner as the stable container for sidebar page elements.
  // Never treat .sidebar-left itself as the element list; that caused whole groups
  // of widgets to be cloned/moved together.
  return sidebar.querySelector('.sidebar-inner') || sidebar;
}

function findCategoryBox(root) {
  return root.querySelector(':scope > .box-categories, :scope > .box.box-categories');
}

function findSupportBox(root) {
  for (const child of root.children) {
    if (normalize(child.textContent).includes('sme tu pre vas')) return child;
  }
  return null;
}

function findGlobalTop10Box(root) {
  const wrapper = root.querySelector(SEL.globalTopProducts);
  if (!wrapper) return null;
  // TOP 10 is a Shoptet page element. Clone only its own .box container,
  // never a parent that also contains Categories / support banner.
  return wrapper.closest('.box') || wrapper.parentElement;
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

function buildFromTop10(top10Box, products) {
  if (!top10Box) return null;

  // Clone the native TOP 10 widget itself. This guarantees identical Apollo
  // border, radius, padding, background, typography and responsive behaviour.
  const box = top10Box.cloneNode(true);
  box.classList.add(BOX_CLASS);
  box.removeAttribute('id');
  box.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'));

  const wrapper = box.querySelector('.top-products-wrapper') || box;
  const heading = wrapper.querySelector('h1, h2, h3, h4, h5');
  if (heading) {
    const span = heading.querySelector('span');
    if (span) span.textContent = TITLE;
    else heading.textContent = TITLE;
  }

  const oldList = wrapper.querySelector('.top-products, ol, ul');
  const list = document.createElement(oldList?.tagName?.toLowerCase() || 'ol');
  list.className = oldList?.className || 'top-products';

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

  if (oldList) oldList.replaceWith(list);
  else wrapper.append(list);

  return box;
}

function reorder(root, bestsellerBox, supportBox, top10Box, categoryBox) {
  if (!categoryBox) return;

  // Work only with the four actual sibling widgets inside .sidebar-inner.
  // Final requested order:
  // Categories -> category bestsellers -> support -> global TOP 10.
  categoryBox.after(bestsellerBox);

  if (supportBox) bestsellerBox.after(supportBox);
  if (top10Box) {
    if (supportBox) supportBox.after(top10Box);
    else bestsellerBox.after(top10Box);
  }
}

function render(root) {
  const sideRoot = sidebarRoot();
  if (!sideRoot) return;

  sideRoot.querySelector(`:scope > .${BOX_CLASS}`)?.remove();

  const source =
    root.querySelector?.(SEL.categoryBestsellers) ||
    document.querySelector(SEL.categoryBestsellers);

  if (!source) return;
  source.classList.add('ts-category-bestsellers-source');

  const products = [...source.querySelectorAll(SEL.categoryBestsellerProduct)]
    .map(productData)
    .filter(Boolean)
    .slice(0, 10);

  if (!products.length) return;

  const categoryBox = findCategoryBox(sideRoot);
  const supportBox = findSupportBox(sideRoot);
  const top10Box = findGlobalTop10Box(sideRoot);
  if (!categoryBox || !top10Box) return;

  const bestsellerBox = buildFromTop10(top10Box, products);
  if (!bestsellerBox) return;

  reorder(sideRoot, bestsellerBox, supportBox, top10Box, categoryBox);
}

export default {
  name: 'category-bestsellers-sidebar',
  pages: ['category'],
  init(root) {
    render(root);
  },
};
