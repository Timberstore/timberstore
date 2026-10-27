// M2 · Open only the add-to-cart dialog without the native size tween. Apollo
// rearranges recommendation forms in onComplete; running it synchronously keeps
// the unprocessed layout out of paint. Restore defaults for galleries/other modals.

import { SEL } from '../../core/selectors.js';

const CART_MODAL_SPEED_MS = 0;
const FALLBACK_RESTORE_MS = 5000;

let restoreActiveSpeed = null;

function speedUpCartPopup() {
  const $ = window.jQuery;
  if (!$?.colorbox?.settings) return;

  // Native add first shows a white full-page spinner, hides it after the POST,
  // then opens the dark dialog after a second request. Mark only the spinner
  // inserted by this synchronous submit so CSS can keep the page unwashed.
  // Observe until the end of this task: invalid submissions cannot accidentally
  // affect a later gallery, filter, shipping or checkout spinner.
  let loadingSpinner;
  const spinner = new MutationObserver((records) => {
    for (const record of records) for (const node of record.addedNodes)
      if (node instanceof Element && node.matches(SEL.cartSpinner)) {
        loadingSpinner = node;
        node.classList.add('ts-cart-add-spinner');
      }
  });
  spinner.observe(document.body, { childList: true });
  window.setTimeout(() => spinner.disconnect(), 0);

  restoreActiveSpeed?.();

  const previousSpeed = $.colorbox.settings.speed;
  let restored = false;
  let timer = null;

  const restore = () => {
    if (restored) return;
    restored = true;
    if (timer) window.clearTimeout(timer);
    $(document).off('.tsCartModalSpeed');
    loadingSpinner?.classList.remove('ts-cart-add-spinner');
    $.colorbox.settings.speed = previousSpeed;
    if (restoreActiveSpeed === restore) restoreActiveSpeed = null;
  };

  restoreActiveSpeed = restore;
  $.colorbox.settings.speed = CART_MODAL_SPEED_MS;

  // Keep the cart-only speed across the add-to-cart AJAX request and restore
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
        if (event.target instanceof HTMLFormElement && event.target.matches(SEL.cartModalForm)) {
          speedUpCartPopup();
        }
      },
      true,
    );
  },
};
