import { SEL } from '../../core/selectors.js';
import { initLegacyEmptyCart } from '../../legacy/timber-empty-cart.js';

let initialized = false;

export default {
  name: 'empty-cart',
  pages: ['cart'],
  init() {
    // Staged migration: while Shoptet still includes the old script, let the
    // live legacy file own the feature. Once that include is removed, the
    // bundled GitHub copy takes over automatically without another code deploy.
    if (document.querySelector(SEL.legacyEmptyCartScript)) return;
    if (initialized) return;

    initialized = true;
    initLegacyEmptyCart();
  },
};
