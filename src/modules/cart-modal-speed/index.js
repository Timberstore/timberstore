// M2 · The mobile add-to-cart Colorbox resize animation is visually fine,
// but its default speed feels slow on phones. Temporarily shorten Colorbox's
// default resize speed only while the add-to-cart popup is opening, then restore it.
//
// We hook the cart form submit rather than changing Colorbox permanently, so product
// galleries and unrelated modals keep their native speed.

import { SEL } from '../../core/selectors.js';

const MOBILE = '(max-width: 767px)';
const CART_MODAL_SPEED_MS = 120;
const FALLBACK_RESTORE_MS = 5000;

let restoreActiveSpeed = null;

function speedUpCartPopup() {
  if (!window.matchMedia?.(MOBILE).matches) return;

  const $ = window.jQuery;
  if (!$?.colorbox?.settings) return;

  restoreActiveSpeed?.();

  const previousSpeed = $.colorbox.settings.speed;
  let restored = false;
  let timer = null;

  const restore = () => {
    if (restored) return;
    restored = true;
    if (timer) window.clearTimeout(timer);
    $(document).off('.tsCartModalSpeed');
    $.colorbox.settings.speed = previousSpeed;
    if (restoreActiveSpeed === restore) restoreActiveSpeed = null;
  };

  restoreActiveSpeed = restore;
  $.colorbox.settings.speed = CART_MODAL_SPEED_MS;

  // Keep the faster speed active across the add-to-cart AJAX request and restore
  // it only after Colorbox has finished opening. Timeout is a safety net.
  $(document).one('cbox_complete.tsCartModalSpeed cbox_closed.tsCartModalSpeed', restore);
  timer = window.setTimeout(restore, FALLBACK_RESTORE_MS);
}

export default {
  name: 'cart-modal-speed',
  pages: ['*'],
  init() {
    if (document.documentElement.dataset.tsCartModalSpeedInit) return;
    document.documentElement.dataset.tsCartModalSpeedInit = '1';

    document.addEventListener(
      'submit',
      (event) => {
        if (event.target instanceof HTMLFormElement && event.target.matches(SEL.cartForm)) {
          speedUpCartPopup();
        }
      },
      true,
    );
  },
};
