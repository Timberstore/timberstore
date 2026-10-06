// Shoptet (Apollo template) selectors — the only place that knows Shoptet markup.
// When the template changes, fix it here.
export const SEL = {
  // Homepage banner carousel (Bootstrap 3 carousel rendered by Shoptet)
  carousel: '#carousel.carousel',
  carouselItem: '.item',
  // Slide images; Shoptet already picks the mobile/desktop file server-side, slides 2+ are loading="lazy"
  carouselImage: '.item img',
  // Product detail gallery: main image + thumbnails (verified 2026-09-26)
  productImage: '.p-image-wrapper .p-image',
  productThumbnail: '.p-thumbnails a.p-thumbnail',
  productThumbnailActiveClass: 'highlighted',
  // Thumbnail strip: .p-thumbnails (overflow hidden) > .p-thumbnails-inner (absolute, moved by
  // style.left/top with a 0.3 s transition). Arrows move it by one thumbnail and carry the
  // busy class while it slides (verified 2026-09-29).
  productThumbnails: '.p-thumbnails',
  productThumbnailsInner: '.p-thumbnails-inner',
  productThumbnailsNext: '.p-thumbnails-arrows .thumbnail-next',
  productThumbnailsPrev: '.p-thumbnails-arrows .thumbnail-prev',
  productThumbnailsVerticalClass: 'p-thumbnails-vertical',
  productThumbnailsBusyClass: 'clicked',
  // Transparent layer cloud-zoom puts over the main image (rebuilt ~201 ms after every photo switch)
  productZoomTrap: '.mousetrap',

  // Product listing (category, search). Final DOM after Apollo has moved the
  // availability into .p-tools and the cart form into .product-btn (verified 2026-09-26).
  // The add-to-cart popup's "Ostatní zákazníci tiež nakúpili" block is also
  // #products.products-block; .products-related tells it apart from the listing.
  productList: '#products:not(.products-related)',
  productCard: '#products:not(.products-related) > .product',
  cartForm: 'form.pr-action',
  cartFormAmount: 'input[name="amount"]', // hidden; the multiply_order add-on writes the pack size here
  cartFormPriceId: 'input[name="priceId"]',
  cartFormSubmit: '[data-testid="buttonAddToCart"]',
  // Native sorting buttons above the listing (data-sort="price" | "-price" | …)
  listSorting: '.listSorting',
  listSortingControl: '.listSorting__control',
  listSortingCurrentClass: 'listSorting__control--current',

  // Apollo category bestsellers + left sidebar (verified against current 3G markup, 2026-10-05).
  categoryBestsellers: '.products-top-wrapper',
  categoryBestsellerProduct: '.products-top > .product',
  sidebarLeft: '.sidebar-left',
  globalTopProducts: '.box-topProducts:not(.ts-category-bestsellers-sidebar) .top-products-wrapper',

  // Apollo homepage groups used by the migrated category banner/reordering block.
  homepageGroupTitle: '.homepage-group-title',
  homepageProducts: '.products',
  homepageMiddleBannerLink:
    'a[href*="kineticke"], a[href*="led-pas"], a[href*="lepid"], a[href*="krabic"]',
  homepageBenefits: '.position--benefitHomepage',

  // Legacy timber-menu.js migration (Apollo markup).
  navigationSubmenuItem: '#navigation .menu-level-2 > li',
  navigationSubmenuTitleLink: '.menu-content-title[href]',
  navigationSubmenuContentLink: '.menu-content a[href]',
  categoryTree: '#categories',
  breadcrumbLinks: '.breadcrumbs-wrapper a[href], .breadcrumbs a[href], .breadcrumb a[href]',
  productTextDetailAreas:
    '.p-detail-inner-header h1, .p-detail h1, .product-top h1, h1[itemprop="name"], .p-short-description, .description-inner, .basic-description, .p-detail-tabs',
  productTextCards:
    '.products-block .product, .products-block .p, .products .product, .products .p, .product[data-micro="product"], .p[data-micro="product"]',
  categoryFilterBar: '#category-filter-hover',
  categoryFilterItem: '.slider-wrapper, .filter-section:not(.filter-section-count)',
  categoryFilterHeading: ':scope > h4',
  // Mobile Apollo keeps price/availability outside #category-filter-hover.
  categoryHeader: '#category-header',
  categoryFilters: '#filters',
  categoryFiltersWrapper: '#filters-wrapper',
  categoryFiltersInnerWrapper: '.filters-wrapper',
  categoryFilterGroup:
    '.slider-wrapper, .filter-section:not(.filter-section-count):not(.filter-section-button)',
  categoryFilterActiveClass: 'is-active',
  categoryFilterVisibleClass: 'visible',
  categoryFilterRowClass: 'row-filter',
  categoryFilterFieldset: '.filter-section form > fieldset',
  categoryFilterCheckbox: ':scope > input[type="checkbox"]',
  categoryFilterLabel: ':scope > .filter-label',
  categoryFilterReset: 'p#clear-filters',
  categoryFilterResetLink: 'p#clear-filters a[href]',
  footerOnlinePayments: '.custom-footer__onlinePayments p',
  legacyEmptyCartScript: 'script[src*="timber-empty-cart.js"]',
};
