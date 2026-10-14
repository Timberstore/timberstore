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
  // Apollo information toast; retain its native click-to-dismiss hook.
  informationMessageClose: '.site-msg.information .js-close-information-msg',
  // Apollo header/service contacts, verified on the live storefront.
  headerServiceBar: '.top-navigation-bar',
  headerContacts: '.top-navigation-bar > .container > .top-navigation-contacts',
  headerPhoneLabel: 'a.project-phone > span',
  headerEmail: '.project-email',
  headerContactForm: '.contact-box a[href="/kontakty"]',
  headerAccount:
    '#header .header-top .top-nav-button-login, #header .header-top .top-nav-button-account',
  socialFacebook: 'a[data-testid="contactboxFacebook"][href]',
  socialInstagram: 'a[data-testid="contactboxInstagram"][href]',
  footerContacts: '#footer .custom-footer__contact .contact-box',
  footerContactList: ':scope > ul:not(.contact-box-icon-list)',
  headerRow: '#header .header-top',
  headerCart: '#header .header-top [data-testid="headerCart"]',
  headerCartControls: '[data-testid="headerCart"]',
  headerCartArrow: '.ts-cart-preview-toggle',
  headerCartPrice: '[data-testid="headerCartPrice"]',
  cartRoot: '.in-kosik #cart-wrapper',
  cartItems: '.in-kosik #cart-wrapper .cart-table tr.removeable',
  cartTable: '.in-kosik #cart-wrapper .cart-table',
  cartTitle: '.in-kosik :is(h1, .cart-header__headline > .h4)',
  cartHelp: '.ordering-process .cart-header__contact .checkout-box-wrapper',
  cartHelpTitle: ':scope > h2',
  cartHelpList: '.contact-box > ul',
  cartHelpPhone: '.tel a:not(:has(a))',
  cartHelpEmail: '.mail a',
  checkoutDispatchLines: '.ordering-process .site-msg-custom li',
  checkoutContactRoot: '.ordering-process #content',
  checkoutListPanel: '.ts-checkout-summary-products',
  checkoutProductParts: 'h2.h4, h4, .cart-items, .order-recapitulation',
  checkoutPriceParts: '.order-summary-item',
  checkoutNativeProductPanel: '.order-summary-top',
  checkoutNativePricePanel: '.order-summary-bottom',
  checkoutMethodRecaps:
    '.recapitulation-single:has([data-testid="recapDeliveryMethod"], [data-testid="recapPaymentMethod"])',
  checkoutSummary: '.ordering-process #summary-box',
  checkoutSidebar: '.ordering-process #checkoutSidebar',
  checkoutMethods: '.in-krok-1 .order-delivery-payment-form',
  checkoutRecapPrice: '.recapitulation-single [data-testid="recapItemPrice"]',
  checkoutSelectedMethod:
    '.in-krok-1 input[name="shippingId"]:checked, .in-krok-1 input[name="billingId"]:checked',
  checkoutMethodRow: '.radio-wrapper',
  checkoutMethodPrice: '.payment-shipping-price',
  cartFirstStep: '.ordering-process .cart-header > li:first-child :is(a, span)',
  cartSummaryTitle: '.in-kosik #cart-wrapper .cart-summary > h2',
  cartName: 'a.main-link',
  cartAvailabilityLabel: '.availability-label',
  cartAvailabilityAmount: '.availability-amount',
  cartRelatedToggle: '.show-related',
  cartRelatedOpenClass: 'related-visible',
  cartFormItemId: 'input[name="itemId"]',
  cartFooter: '.in-kosik #cart-wrapper .cart-summary > .extras-wrapper',
  cartSummary: '.cart-summary',
  cartBack: 'a.next-step-back:not(.colorbox-close)',
  detailSku: '[itemprop="sku"]',
  detailStockAmount: '.availability-value .availability-amount',
  nativeQuantity: '.quantity',
  nativeQuantityButtons: '.increase, .decrease',
  nativeQuantityIncreaseClass: 'increase',
  nativeQuantityDecreaseClass: 'decrease',
  cartQuantityInput:
    '.in-kosik #cart-wrapper .cart-table .quantity input[name="amount"], #cart-widget .quantity input[name="amount"]',
  cartRelatedForm:
    '.in-kosik #cart-wrapper tr.related.visible .cart-related-product form.pr-action',
  cartRelatedProduct: '.cart-related-product',
  cartRelatedLink: '.cart-related-name[href]',
  cartRelatedAvailability: '.cart-related-availability',
  relatedDetailForm: '#product-detail-form',
  cartDeliveryTime: '.in-kosik #cart-wrapper .delivery-time',
  cartShipping: '.in-kosik #cart-wrapper .extras-wrap',
  cartShippingDelivery: '.extra.delivery',
  cartShippingPanel: '.extra-content',
  cartShippingComplete: '.extra-item.is-free-shipping',
  cartShippingRange: '.price-range',
  cartShippingFill: '.price-range > div',
  cartPopupFooter: '.cart-widget-button',
  cartMessages: '.messages',
  cartSuccessMessage: '.msg.msg-success',
  headerCartWrapper: '#header .header-top .click-cart',
  headerLoginPopup: '#login.popup-widget',
  headerCartPopup: '#cart-widget.popup-widget',
  headerMobileTools: '.top-navigation-bar > .container > .top-navigation-tools',
  headerResponsiveTools: ':scope > .responsive-tools',
  mobileMenuContacts: '#header .navigation-in-bottom .top-navigation-contacts',
  mobileContactTitle: ':scope > strong',
  contactPhone: '.project-phone',
};
