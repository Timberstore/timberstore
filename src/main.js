import './legacy/timber-menu-guard.js';
import { start } from './core/index.js';
import carouselSwipe from './modules/carousel-swipe/index.js';
import gallerySwipe from './modules/gallery-swipe/index.js';
import listView from './modules/list-view/index.js';
import qtyPicker from './modules/qty-picker/index.js';
import cartCount from './modules/cart-count/index.js';
import cartModalSpeed from './modules/cart-modal-speed/index.js';
import categoryBestsellersSidebar from './modules/category-bestsellers-sidebar/index.js';
import homepageCategories from './modules/homepage-categories/index.js';
import menuCardClick from './modules/menu-card-click/index.js';
import sidebarActivePath from './modules/sidebar-active-path/index.js';
import productTextCleanup from './modules/product-text-cleanup/index.js';
import categoryFilterCompact from './modules/category-filter-compact/index.js';
import footerPayments from './modules/footer-payments/index.js';
import emptyCart from './modules/empty-cart/index.js';

// Register every module here. Order = init order.
// qty-picker before cart-count: the badge goes into the button the qty field sits next to.
start([
  carouselSwipe,
  homepageCategories,
  menuCardClick,
  sidebarActivePath,
  productTextCleanup,
  categoryFilterCompact,
  footerPayments,
  emptyCart,
  gallerySwipe,
  categoryBestsellersSidebar,
  listView,
  qtyPicker,
  cartCount,
  cartModalSpeed,
]);
