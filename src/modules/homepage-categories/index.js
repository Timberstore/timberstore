import { SEL } from '../../core/selectors.js';
import { TEXTS } from '../../core/texts.js';

const ITEMS = [
  { name: 'Knopky', img: 'https://765909.myshoptet.com/user/documents/upload/Najoblubenejsie%20Kategorie/Knopky.jpg', url: '/knopky/' },
  { name: 'Úchytky', img: 'https://765909.myshoptet.com/user/documents/upload/Najoblubenejsie%20Kategorie/Uchytky.jpg', url: '/uchytky/' },
  { name: 'Smetné koše', img: 'https://765909.myshoptet.com/user/documents/upload/Najoblubenejsie%20Kategorie/Smetne%20kose.jpg', url: '/smetne-kose/' },
  { name: 'Organizéry', img: 'https://765909.myshoptet.com/user/documents/upload/Najoblubenejsie%20Kategorie/Organizer.jpg', url: '/priborniky--protismykove-podlozky/' },
  { name: 'Stolové nohy', img: 'https://765909.myshoptet.com/user/documents/upload/Najoblubenejsie%20Kategorie/Stolove%20Nohy.jpg', url: '/stolove-nohy/' },
  { name: 'Drezy', img: 'https://765909.myshoptet.com/user/documents/upload/Najoblubenejsie%20Kategorie/Drezy.jpg', url: '/drezy/' },
  { name: 'Batérie', img: 'https://765909.myshoptet.com/user/documents/upload/Najoblubenejsie%20Kategorie/Baterie.jpg', url: '/baterie/' },
  { name: 'Nábytkové závesy', img: 'https://765909.myshoptet.com/user/documents/upload/Najoblubenejsie%20Kategorie/PANTY.jpg', url: '/nabytkove-zavesy-panty/' },
  { name: 'Zásuvkové výsuvy', img: 'https://765909.myshoptet.com/user/documents/upload/Najoblubenejsie%20Kategorie/Vysuvy.jpg', url: '/zasuvkove-vysuvy/' },
  { name: 'Káblové priechodky', img: 'https://765909.myshoptet.com/user/documents/upload/Najoblubenejsie%20Kategorie/Priechodky.jpg', url: '/kablove-priechodky/' },
  { name: 'Elektrické zásuvky', img: 'https://765909.myshoptet.com/user/documents/upload/Najoblubenejsie%20Kategorie/Elektricke%20Zasuvky.jpg', url: '/elektricke-zasuvky/' },
  { name: 'Stolárske pomôcky', img: 'https://765909.myshoptet.com/user/documents/upload/Najoblubenejsie%20Kategorie/Stolarske%20pomocky.jpg', url: '/stolarske-pomocky/' },
];

function buildCategorySection() {
  const section = document.createElement('section');
  section.className = 'ts-home-categories';

  const title = document.createElement('h2');
  title.className = 'ts-home-categories__title';
  title.textContent = TEXTS.homeCategories.title;

  const grid = document.createElement('div');
  grid.className = 'ts-home-categories__grid';

  ITEMS.forEach((item) => {
    const link = document.createElement('a');
    link.className = 'ts-home-categories__item';
    link.href = item.url;

    const img = document.createElement('img');
    img.src = item.img;
    img.alt = item.name;
    img.loading = 'lazy';

    const name = document.createElement('span');
    name.textContent = item.name;

    link.append(img, name);
    grid.append(link);
  });

  section.append(title, grid);
  return section;
}

function ensureCategories(root) {
  // During staged migration the legacy Shoptet banner still runs. Never render a
  // second category block while that legacy block is present.
  if (document.querySelector('.ts-home-categories, .timber-categories-banner')) return;

  const firstTitle = root.querySelector(SEL.homepageGroupTitle);
  if (!firstTitle?.parentNode) return;

  firstTitle.parentNode.insertBefore(buildCategorySection(), firstTitle);
}

function findTitle(root, needle) {
  return [...root.querySelectorAll(SEL.homepageGroupTitle)].find((title) =>
    title.textContent.trim().toLowerCase().includes(needle),
  );
}

function productsAfter(title) {
  let element = title?.nextElementSibling;
  while (element) {
    if (element.matches(SEL.homepageProducts)) return element;
    element = element.nextElementSibling;
  }
  return null;
}

function findMiddleBanners(root) {
  const link = root.querySelector(SEL.homepageMiddleBannerLink);
  return (
    link?.closest('.middle-banners-wrapper') ||
    link?.closest('.content-wrapper') ||
    link?.closest('.banners-content') ||
    link?.closest('.next-to-carousel-banners') ||
    null
  );
}

function reorderHomepage(root) {
  const saleTitle = findTitle(root, TEXTS.homeCategories.saleTitleNeedle);
  const newsTitle = findTitle(root, TEXTS.homeCategories.newsTitleNeedle);
  if (!saleTitle || !newsTitle) return;

  const saleProducts = productsAfter(saleTitle);
  const newsProducts = productsAfter(newsTitle);
  if (!saleProducts || !newsProducts) return;

  const parent = saleProducts.parentNode;
  let reference = saleProducts;

  parent.insertBefore(newsTitle, reference.nextSibling);
  reference = newsTitle;

  parent.insertBefore(newsProducts, reference.nextSibling);
  reference = newsProducts;

  const middleBanners = findMiddleBanners(root);
  if (middleBanners) {
    parent.insertBefore(middleBanners, reference.nextSibling);
    reference = middleBanners;
  }

  const benefits = root.querySelector(SEL.homepageBenefits);
  if (benefits) parent.insertBefore(benefits, reference.nextSibling);
}

export default {
  name: 'homepage-categories',
  pages: ['home'],
  init(root) {
    ensureCategories(root);
    reorderHomepage(root);
  },
};
