// M2 · The mobile add-to-cart Colorbox resizes with jQuery's default elastic
// animation, which feels slow and janky on phones. Disable jQuery animations only
// for the short add-to-cart popup opening window, then restore the previous state.
//
// We hook the cart form submit rather than changing Colorbox globally, so product
// galleries and unrelated modals keep their native transitions.

import { SEL } from '../../core/selectors.js';

const MOBILE = '(max-width: 767px)';
const FALLBACK_RESTORE_MS = 1200;

let restoreActiveAnimation = null;

function disableAnimationForCartPopup() {
  if (!window.matchMedia?.(MOBILE).matches) return;

  const $ = window.jQuery;
  if (!$?.fx) return;

  // A repeated submit should never leave a previous temporary override behind.
  restoreActiveAnimation?.();

  const previousFxOff = $.fx.off;
  let restored = false;
  let timer = null;

  const restore = () => {
    if (restored) return;
    restored = true;
    if (timer) window.clearTimeout(timer);
    $(document).off('.tsCartModalSpeed');
    $.fx.off = previousFxOff;
    if (restoreActiveAnimation === restore) restoreActiveAnimation = null;
  };

  restoreActiveAnimation = restore;
  $.fx.off = true;

  // Colorbox fires these after opening/closing. The timeout is a safety net for
  // failed requests or future template changes where no modal opens.
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
          disableAnimationForCartPopup();
        }
      },
      true,
    );
  },
};
