// M1 · Move the native thumbnail track continuously, retaining Shoptet links,
// arrow offsets, active photo and lightbox. Re-read nodes after variant redraws.
import { SEL } from '../../core/selectors.js';

const DRAG_THRESHOLD = 8;

export function bindStripDrag(strip) {
  let pointer = null;
  let inner;
  let vertical = false;
  let start = 0;
  let cross = 0;
  let origin = 0;
  let minimum = 0;
  let dragging = false;
  let suppressClick = false;
  strip.classList.add('ts-gallery-strip');

  function bounds() {
    const thumbs = [...strip.querySelectorAll(SEL.productThumbnail)];
    const extent = Math.max(
      0,
      ...thumbs.map((t) =>
        vertical ? t.offsetTop + t.offsetHeight : t.offsetLeft + t.offsetWidth,
      ),
    );
    return Math.min(0, (vertical ? strip.clientHeight : strip.clientWidth) - extent);
  }

  function position() {
    return parseFloat(getComputedStyle(inner)[vertical ? 'top' : 'left']) || 0;
  }

  function finish(event) {
    if (event.pointerId !== pointer) return;
    const id = pointer;
    pointer = null;
    dragging = false;
    strip.classList.remove('ts-gallery-strip--dragging');
    if (strip.hasPointerCapture(id)) strip.releasePointerCapture(id);
  }

  strip.addEventListener(
    'pointerdown',
    (event) => {
      if (!event.isPrimary || event.button > 0) return;
      inner = strip.querySelector(SEL.productThumbnailsInner);
      vertical = strip.classList.contains(SEL.productThumbnailsVerticalClass);
      // A vertical finger gesture belongs to page scrolling, never this strip.
      if (!inner || (vertical && event.pointerType !== 'mouse')) return;
      minimum = bounds();
      if (minimum >= -1) return;
      pointer = event.pointerId;
      start = vertical ? event.clientY : event.clientX;
      cross = vertical ? event.clientX : event.clientY;
      origin = position();
      dragging = false;
      suppressClick = false;
      inner.classList.add('ts-gallery-strip__track');
    },
    { passive: true },
  );

  strip.addEventListener(
    'pointermove',
    (event) => {
      if (event.pointerId !== pointer) return;
      const distance = (vertical ? event.clientY : event.clientX) - start;
      const perpendicular = (vertical ? event.clientX : event.clientY) - cross;
      if (!dragging) {
        if (
          Math.abs(perpendicular) > DRAG_THRESHOLD &&
          Math.abs(perpendicular) > Math.abs(distance)
        ) {
          finish(event);
          return;
        }
        if (Math.abs(distance) < DRAG_THRESHOLD) return;
        // Native strip arrows may have a pending jQuery animation. Complete it
        // so its own callbacks clear busy classes before taking over the offset.
        window.jQuery?.(inner).stop(true, true);
        origin = position();
        strip.classList.add('ts-gallery-strip--dragging');
        strip.setPointerCapture(pointer);
        dragging = true;
        suppressClick = true;
      }
      if (event.cancelable) event.preventDefault();
      const value = Math.max(minimum, Math.min(0, origin + distance));
      inner.style[vertical ? 'top' : 'left'] = `${value}px`;
      strip.classList.toggle(SEL.productThumbnailsOverflowPrevClass, value < -1);
      strip.classList.toggle(SEL.productThumbnailsOverflowNextClass, value > minimum + 1);
    },
    { passive: false },
  );

  strip.addEventListener('pointerleave', (event) => {
    if (pointer !== null && event.pointerType === 'mouse' && event.buttons === 1)
      strip.setPointerCapture(pointer);
  });
  for (const type of ['pointerup', 'pointercancel']) strip.addEventListener(type, finish);
  strip.addEventListener('lostpointercapture', (event) => {
    // Touch starts with implicit capture on the child image/link. Its loss
    // bubbles when capture moves to the strip; only our own loss ends a drag.
    if (event.target === strip) finish(event);
  });
  strip.addEventListener('dragstart', (event) => event.preventDefault());
  strip.addEventListener(
    'click',
    (event) => {
      if (!suppressClick || !event.isTrusted) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      suppressClick = false;
    },
    true,
  );
}
