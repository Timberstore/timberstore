// Shared horizontal gestures. Mouse support is opt-in for the product gallery;
// other modules retain their existing touch/pen behaviour.

const MIN_DISTANCE = 40; // px of horizontal travel that counts as a swipe
const CLICK_THRESHOLD = 10; // px after which the gesture is no longer a tap

/**
 * Calls onSwipe('next' | 'prev') for a horizontal swipe over `el`.
 * The element needs `touch-action: pan-y` (CSS) so vertical scrolling stays
 * with the browser and horizontal moves reach us.
 */
export function bindSwipe(el, onSwipe, mouse = false) {
  let pointerId = null;
  let startX = 0;
  let startY = 0;
  let suppressClick = false;

  el.addEventListener('pointerdown', (e) => {
    if (e.button > 0 || (e.pointerType === 'mouse' && !mouse)) return;
    pointerId = e.pointerId;
    startX = e.clientX;
    startY = e.clientY;
    suppressClick = false;
  });

  el.addEventListener('pointermove', (e) => {
    if (e.pointerId !== pointerId) return;
    if (Math.abs(e.clientX - startX) > CLICK_THRESHOLD) {
      suppressClick = true;
      if (mouse && e.pointerType === 'mouse') el.setPointerCapture(e.pointerId);
    }
  });

  el.addEventListener('pointerup', (e) => {
    if (e.pointerId !== pointerId) return;
    pointerId = null;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (Math.abs(dx) >= MIN_DISTANCE && Math.abs(dx) > Math.abs(dy)) {
      onSwipe(dx < 0 ? 'next' : 'prev');
    }
  });

  if (mouse) {
    // Capture a fast movement that leaves the image before its first move event.
    el.addEventListener('pointerleave', () => {
      if (pointerId !== null) {
        suppressClick = true;
        el.setPointerCapture(pointerId);
      }
    });
    el.addEventListener('dragstart', (e) => e.preventDefault());
    el.addEventListener(
      'mousemove',
      (e) => {
        if (pointerId !== null && suppressClick) e.stopPropagation();
      },
      true,
    );
  }

  el.addEventListener('pointercancel', () => {
    // Browser took over (vertical scroll) — not a swipe.
    pointerId = null;
  });

  // A swipe must not open the link or lightbox underneath.
  el.addEventListener(
    'click',
    (e) => {
      if (!suppressClick || !e.isTrusted) return;
      e.preventDefault();
      e.stopPropagation();
      suppressClick = false;
    },
    true,
  );
}
