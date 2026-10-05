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
  // Apollo may wrap this banner several levels deep. Find the visible text
  // anywhere inside the sidebar, then climb to the sidebar's direct child.
  for (const node of sidebar.querySelectorAll('*')) {
    if (!normalize(node.textContent).includes('sme tu pre vas')) continue;
    const box = directSidebarChild(node, sidebar);
    if (box) return box;
  }
  return null;
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

function buildBox(products, globalTopBox) {
  // Clone the existing TOP 10 box itself so border, radius, padding, background,
  // shadow and internal Apollo spacing are literally identical.
  const box = globalTopBox ? globalTopBox.cloneNode(true) : document.createElement('section');
  box.classList.add(BOX_CLASS);
  box.removeAttribute('id');
  box.setAttribute('aria-label', TITLE);

  // Remove any duplicated ids from the clone.
  box.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'));

  const wrapper = box.querySelector('.top-products-wrapper') || box;
  const oldHeading = wrapper.querySelector('h1, h2, h3, h4, h5');
  const oldList = wrapper.querySelector('ol, ul');

  const heading = oldHeading || document.createElement('h4');
  heading.textContent = TITLE;

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

  if (!oldHeading) wrapper.prepend(heading);
  if (oldList) oldList.replaceWith(list);
  else wrapper.append(list);

  return box;
}

function placeSidebarBoxes(sidebar, categoryBestsellers, globalTopBox) {
  const categoryBox = findCategoryBox(sidebar);
  const supportBox = findSupportBox(sidebar);

  // Requested fixed order:
  // Kategórie -> Najpredávanejšie v kategórii -> Sme tu pre vás -> TOP 10.
  if (categoryBox) categoryBox.after(categoryBestsellers);
  else sidebar.prepend(categoryBestsellers);

  if (supportBox) {
    categoryBestsellers.after(supportBox);
    if (globalTopBox) supportBox.after(globalTopBox);
  } else if (globalTopBox) {
    categoryBestsellers.after(globalTopBox);
  }
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

  const globalTopBox = nativeTopProductsBox(sidebar);
  placeSidebarBoxes(sidebar, buildBox(data, globalTopBox), globalTopBox);
}

export default {
  name: 'category-bestsellers-sidebar',
  pages: ['category'],
  init(root) {
    render(root);
  },
};
