import { SEL } from '../../core/selectors.js';
import { TEXTS } from '../../core/texts.js';

let locked;
let observed;
let observer;

export function releaseMobileCart() {
  if (!locked) return;
  const state = locked;
  locked = null;
  const html = document.documentElement;
  const behavior = html.style.getPropertyValue('scroll-behavior');
  const priority = html.style.getPropertyPriority('scroll-behavior');
  html.style.setProperty('scroll-behavior', 'auto');
  html.classList.remove('ts-mobile-cart-open');
  if (state.offset) html.style.setProperty('--ts-cart-scroll-offset', state.offset, state.priority);
  else html.style.removeProperty('--ts-cart-scroll-offset');
  window.scrollTo(state.x, state.y);
  if (behavior) html.style.setProperty('scroll-behavior', behavior, priority);
  else html.style.removeProperty('scroll-behavior');
}

export function syncMobileCart() {
  const popup = document.querySelector(SEL.headerCartPopup);
  if (popup !== observed) {
    observer?.disconnect();
    observed = popup;
    if (popup) {
      if (!observer) observer = new MutationObserver(syncMobileCart);
      observer.observe(popup, { childList: true, subtree: true });
    }
  }
  const mobile = window.matchMedia('(max-width: 767px)').matches;
  if (!mobile || !popup || !document.body.matches(SEL.cartOpenBody)) {
    releaseMobileCart();
    return;
  }
  const html = document.documentElement;
  if (!locked) {
    locked = {
      x: window.scrollX,
      y: window.scrollY,
      offset: html.style.getPropertyValue('--ts-cart-scroll-offset'),
      priority: html.style.getPropertyPriority('--ts-cart-scroll-offset'),
    };
    html.style.setProperty('--ts-cart-scroll-offset', `${-locked.y}px`);
    html.classList.add('ts-mobile-cart-open');
  }
  // Native ancestors have no transform/containing block. Keep the original
  // popup in place and anchor it directly below the visible mobile header.
  const bar = document.querySelector(SEL.headerServiceBar);
  const top = Math.max(0, bar?.getBoundingClientRect().bottom || 0);
  const value = `${top}px`;
  if (popup.style.getPropertyValue('--ts-mobile-cart-top') !== value)
    popup.style.setProperty('--ts-mobile-cart-top', value);
  let title = popup.querySelector(SEL.cartPopupTitle);
  if (!title) {
    title = document.createElement('div');
    title.className = `${SEL.cartPopupTitleClass} ts-mobile-cart-title`;
    title.textContent = TEXTS.header.cartTitle;
    popup.prepend(title);
  }
  // Apollo does not provide a close control inside this mobile panel.
  if (!popup.querySelector('.ts-mobile-cart-close')) {
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'ts-mobile-cart-close';
    close.setAttribute('aria-label', TEXTS.header.cartClose);
    close.textContent = '×';
    close.addEventListener('click', () => window.shoptet?.popups?.hideContentWindows?.());
    popup.append(close);
  }
}
