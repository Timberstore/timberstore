import { SEL } from '../../core/selectors.js';
import { TEXTS } from '../../core/texts.js';
import { SHOPTET_EVENTS } from '../../core/events.js';
import { SOCIALS, CONTACT_FORM, CHECKOUT_SUPPORT_EMAIL } from '../../core/contacts.js';
import { syncMobileCart, releaseMobileCart } from './mobile-cart.js';
import { isBusinessOpen } from './business-hours.js';

let observer;
let popupStateObserver;
let contactObserver;
let listenersBound = false;
let frame = 0;
let hoursTimer;
let keyboardCartArrow;
const desktop = window.matchMedia('(min-width: 768px)');
const emailOriginal = new WeakMap();

function syncCartTrigger() {
  const popup = document.querySelector(SEL.headerCartPopup);
  for (const cart of document.querySelectorAll(SEL.headerCartControls)) {
    // Restore a real native link. The old desktop-only toggle removed this
    // attribute, so mobile Apollo clones could inherit the wrong semantics.
    cart.setAttribute('data-redirect', 'true');
    cart.removeAttribute('role');
    cart.classList.remove('ts-header-cart-toggle');
    if (!popup) continue; // Checkout deliberately has no mini-cart.
    let wrapper = cart.parentElement;
    if (!wrapper.matches('.click-cart, .ts-cart-control')) {
      wrapper = document.createElement('span');
      cart.before(wrapper);
      wrapper.append(cart);
    }
    wrapper.classList.add('ts-cart-control');
    if (wrapper.querySelector(SEL.headerCartArrow)) continue;
    const arrow = document.createElement('button');
    arrow.type = 'button';
    arrow.className = 'ts-cart-preview-toggle';
    arrow.setAttribute('aria-label', TEXTS.header.cartPreview);
    arrow.setAttribute('aria-controls', popup.id);
    arrow.setAttribute('aria-haspopup', 'dialog');
    arrow.setAttribute('aria-expanded', 'false');
    wrapper.append(arrow);
  }
  syncPopupState();
}

function closeHeaderPopups(force = false) {
  if (!force && !desktop.matches) return;
  if (!document.body.matches('.cart-window-visible, .login-window-visible')) return;
  const popups = window.shoptet?.popups;
  if (!popups?.hideContentWindows) return;
  popups.hideContentWindows();
  for (const control of document.querySelectorAll(
    '[aria-controls="cart-widget"], [aria-controls="login"]',
  )) {
    control.setAttribute('aria-expanded', 'false');
    control.classList.remove('hovered');
  }
}

function cartInteraction(event) {
  if (!(event.target instanceof Element)) return;
  if (event.target.closest(SEL.headerAccount)) {
    positionPopups();
    return;
  }
  const arrow = event.target.closest(SEL.headerCartArrow);
  const cart = event.target.closest(SEL.headerCartControls);
  if (!arrow && !cart) {
    if (
      event.type === 'click' &&
      document.body.classList.contains('cart-window-visible') &&
      !event.target.closest(SEL.headerCartPopup)
    )
      closeHeaderPopups(true);
    return;
  }
  if (event.type === 'keydown') {
    // Enter on the native link navigates. The real button produces one click
    // for Enter/Space; do not also toggle on keydown or touchend.
    if (!cart || event.key !== 'Enter') return;
  }
  if (arrow) {
    if (event.type !== 'click') return;
    const popups = window.shoptet?.popups;
    if (!popups?.showPopupWindow) return;
    event.preventDefault();
    event.stopImmediatePropagation(); // Apollo .click-cart would redirect.
    keyboardCartArrow = event.detail === 0 ? arrow : null;
    positionPopups();
    popups.showPopupWindow('cart', true, 'cart-widget', event.detail === 0);
    return;
  }
  // Prevent Apollo's delegated toggle and wrapper redirect from running,
  // but keep default link navigation, modified clicks and native href intact.
  event.stopImmediatePropagation();
}

function cartEscape(event) {
  if (event.key !== 'Escape' || !keyboardCartArrow?.isConnected) return;
  if (!document.body.classList.contains('cart-window-visible')) return;
  const arrow = keyboardCartArrow;
  window.requestAnimationFrame(() => {
    if (!document.body.classList.contains('cart-window-visible')) arrow.focus();
  });
}

function cartHover(event) {
  // Native hover opens full carts only. Use the same API for an empty cart;
  // its existing mouseleave timer continues to own closing the preview.
  const cart = event.target;
  if (!(cart instanceof Element) || !cart.matches(SEL.headerCartControls)) return;
  if (
    !desktop.matches ||
    window.shoptet?.helpers?.isTouchDevice() ||
    cart.classList.contains('full')
  )
    return;
  if (
    !document.querySelector(SEL.headerCartPopup) ||
    document.body.classList.contains('cart-window-visible')
  )
    return;
  positionPopups();
  window.shoptet?.popups?.showPopupWindow?.('cart', true, 'cart-widget', false);
}

function onResize() {
  // Apollo replaces its mobile clone on resize, including within one breakpoint.
  syncCartTrigger();
  schedulePosition();
}

function syncPopupState() {
  syncMobileCart();
  syncCartContacts();
  syncMenu();
  for (const [selector, state] of [
    [`${SEL.headerCartControls}, ${SEL.headerCartArrow}`, 'cart'],
    [SEL.headerAccount, 'login'],
  ]) {
    const open = String(document.body.classList.contains(`${state}-window-visible`));
    for (const control of document.querySelectorAll(selector)) {
      if (control.getAttribute('aria-expanded') !== open)
        control.setAttribute('aria-expanded', open);
    }
  }
  if (document.body.matches('.cart-window-visible, .login-window-visible')) positionPopups();
}

function onScroll() {
  // Sticky-header translations are not observed by ResizeObserver. Close via
  // Apollo at the first document scroll instead of leaving a detached panel.
  closeHeaderPopups();
  schedulePosition();
}

function onBreakpoint() {
  closeHeaderPopups(true);
  syncEmail();
  syncCartTrigger();
  schedulePosition();
}

export function updateHours() {
  const open = String(isBusinessOpen());
  const status = open === 'true' ? TEXTS.header.open : TEXTS.header.closed;
  for (const hours of document.querySelectorAll('.ts-service-bar__hours')) {
    if (hours.dataset.open === open) continue;
    hours.dataset.open = open;
    hours.title = status;
    hours.setAttribute('aria-label', `${TEXTS.header.hours} — ${status}`);
  }
}

export function addHours(contacts) {
  if (contacts.querySelector('.ts-service-bar__hours')) return;
  const hours = document.createElement('span');
  hours.className = 'ts-service-bar__hours';
  const dot = document.createElement('span');
  dot.className = 'ts-service-bar__status';
  dot.setAttribute('aria-hidden', 'true');
  hours.append(dot, document.createTextNode(TEXTS.header.hours));
  contacts.prepend(hours);
}

function syncCartContacts() {
  for (const panel of document.querySelectorAll(SEL.cartHelp)) {
    panel.classList.add('ts-cart-contacts');
    const title = panel.querySelector(SEL.cartHelpTitle);
    if (title && title.textContent !== TEXTS.cart.help) title.textContent = TEXTS.cart.help;
    const list = panel.querySelector(SEL.cartHelpList);
    if (!list) continue;
    list.classList.add('ts-service-bar');
    let hours = list.querySelector('.ts-cart-contact-hours');
    if (!hours) {
      hours = document.createElement('li');
      hours.className = 'ts-cart-contact-hours';
      list.prepend(hours);
    }
    addHours(hours);
    let socials = list.querySelector('.ts-cart-contact-socials');
    if (!socials) {
      socials = document.createElement('li');
      socials.className = 'ts-cart-contact-socials';
      list.append(socials);
    }
    addSocial(socials, SEL.socialFacebook, 'facebook');
    addSocial(socials, SEL.socialInstagram, 'instagram');
    const email = list.querySelector(SEL.cartHelpEmail);
    if (email) {
      // Checkout contact email always opens email, including after resize/AJAX.
      const destination = `mailto:${CHECKOUT_SUPPORT_EMAIL}`;
      if (email.getAttribute('href') !== destination) email.setAttribute('href', destination);
      if (!email.classList.contains('ts-cart-contact-link'))
        email.classList.add('ts-cart-contact-link');
    }
    const phone = list.querySelector(SEL.cartHelpPhone);
    if (phone) {
      // Apollo wrapInner creates an outer tel link around the existing one.
      // Keep the original leaf anchor, rather than nested interactive elements.
      const outer = phone.parentElement;
      if (outer?.tagName === 'A' && outer.getAttribute('href') === phone.getAttribute('href'))
        outer.replaceWith(...outer.childNodes);
      const formatted = phone.textContent
        .trim()
        .replace(/^(\+\d{3})(\d{3})(\d{3})(\d{3})$/, '$1 $2 $3 $4');
      if (phone.textContent !== formatted) phone.textContent = formatted;
      if (!phone.classList.contains('ts-cart-contact-link'))
        phone.classList.add('ts-cart-contact-link');
    }
  }
}

function syncMenu() {
  for (const contacts of document.querySelectorAll(SEL.mobileMenuContacts)) {
    // Apollo clones contacts separately; enrich that clone, never the categories.
    contacts.querySelector('.ts-menu-support')?.remove();
    addHours(contacts);
    let title = contacts.querySelector('.ts-menu-contact-title');
    if (!title) {
      title = contacts.querySelector(SEL.mobileContactTitle) || document.createElement('strong');
      title.classList.add('ts-menu-contact-title');
      title.textContent = TEXTS.header.contactTitle;
      contacts.prepend(title);
    }
    const email = contacts.querySelector(SEL.headerEmail);
    const wrapper = email?.closest('.ts-service-bar__email');
    if (wrapper) {
      const source = document.querySelector(SEL.headerContacts)?.querySelector(SEL.headerEmail);
      const href = emailOriginal.get(source)?.href || source?.getAttribute('href');
      if (href?.startsWith('mailto:')) email.setAttribute('href', href);
      const label = wrapper.querySelector('.ts-service-bar__email-label');
      if (label) email.append(label);
      wrapper.replaceWith(email);
    }
    const support = contacts.querySelector('.ts-service-bar__hours');
    addSocial(contacts, SEL.socialFacebook, 'facebook');
    addSocial(contacts, SEL.socialInstagram, 'instagram');
    let socials = contacts.querySelector('.ts-menu-socials');
    if (!socials) {
      socials = document.createElement('span');
      socials.className = 'ts-menu-socials';
      contacts.append(socials);
    }
    for (const link of contacts.querySelectorAll(':scope > [data-ts-social]')) socials.append(link);
    const phone = contacts.querySelector(SEL.headerPhoneLabel);
    if (phone) {
      // Apollo wrapInner creates an outer tel link around the existing one.
      // Keep the original leaf anchor, rather than nested interactive elements.
      const outer = phone.parentElement;
      if (outer?.tagName === 'A' && outer.getAttribute('href') === phone.getAttribute('href'))
        outer.replaceWith(...outer.childNodes);
      const formatted = phone.textContent
        .trim()
        .replace(/^(\+\d{3})(\d{3})(\d{3})(\d{3})$/, '$1 $2 $3 $4');
      if (phone.textContent !== formatted) phone.textContent = formatted;
    }
    let previous = title;
    for (const node of [contacts.querySelector(SEL.contactPhone), email, support, socials]) {
      if (!node) continue;
      if (node.previousElementSibling !== previous) previous.after(node);
      previous = node;
    }
  }
  updateHours();
}

function syncEmail() {
  const contacts = document.querySelector(SEL.headerContacts);
  const email = contacts?.querySelector(SEL.headerEmail);
  if (!email) return;
  const wrapper = email.closest('.ts-service-bar__email');
  if (!desktop.matches) {
    if (!wrapper) return;
    const label = wrapper.querySelector('.ts-service-bar__email-label');
    email.append(label);
    const original = emailOriginal.get(email);
    email.setAttribute('href', original.href);
    if (original.label === null) email.removeAttribute('aria-label');
    else email.setAttribute('aria-label', original.label);
    if (original.labelClass === null) label.removeAttribute('class');
    else label.setAttribute('class', original.labelClass);
    wrapper.replaceWith(email);
    return;
  }
  const source = document.querySelector(SEL.headerContactForm);
  if (wrapper) return;
  const label = email.querySelector('span');
  if (!label) return;
  emailOriginal.set(email, {
    href: email.getAttribute('href'),
    label: email.getAttribute('aria-label'),
    labelClass: label.getAttribute('class'),
  });
  const group = document.createElement('span');
  group.className = 'ts-service-bar__email';
  email.before(group);
  group.append(email, label);
  label.classList.add('ts-service-bar__email-label');
  email.href = source?.href || CONTACT_FORM;
  email.setAttribute('aria-label', TEXTS.header.contactForm);
}

function positionPopups() {
  frame = 0;
  if (!window.matchMedia('(min-width: 768px)').matches) return;
  for (const [controlSelector, popupSelector] of [
    [SEL.headerAccount, SEL.headerLoginPopup],
    [SEL.headerCart, SEL.headerCartPopup],
  ]) {
    const control = document.querySelector(controlSelector);
    const popup = document.querySelector(popupSelector);
    if (!control || !popup) continue;
    const edge = control.getBoundingClientRect();
    const style = getComputedStyle(popup);
    const width = parseFloat(style.width);
    const left = Math.max(
      12,
      Math.min(edge.right - width, document.documentElement.clientWidth - width - 12),
    );
    const top = edge.bottom;
    popup.classList.add('ts-header-popup');
    popup.style.setProperty('--ts-header-popup-left', `${left}px`);
    popup.style.setProperty('--ts-header-popup-top', `${top}px`);
  }
}

function schedulePosition() {
  if (!frame) frame = window.requestAnimationFrame(positionPopups);
}

function addSocial(contacts, selector, network) {
  if (contacts.querySelector(`[data-ts-social="${network}"]`)) return;
  const source = document.querySelector(selector);
  // Prefer native configured destinations; use the verified shared fallback
  // when checkout removes the footer before module initialization.
  const href = source?.href || SOCIALS[network];
  if (!href) return;
  const link = document.createElement('a');
  link.className = `ts-service-bar__social${network === 'instagram' ? ' icon-instagram' : ''}`;
  link.dataset.tsSocial = network;
  link.href = href;
  link.target = source?.target || '_blank';
  link.rel = 'noopener noreferrer';
  link.setAttribute('aria-label', TEXTS.header[network]);
  link.title = TEXTS.header[network];
  if (network === 'facebook') {
    // Apollo's Facebook glyph includes a filled circle; use a tiny local
    // plain brand mark to meet the service bar's no-circle design.
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    svg.classList.add('ts-service-bar__social-icon');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute(
      'd',
      'M15.12 5H18V1h-3.78C9.93 1 9 4.16 9 6.18V9H6v4h3v10h4V13h3.64L17 9h-4V6.71C13 5.61 13.43 5 15.12 5z',
    );
    svg.append(path);
    link.append(svg);
  }
  contacts.append(link);
}

export default {
  name: 'header-service-bar',
  pages: ['*'],
  init(root) {
    const bar = root.querySelector(SEL.headerServiceBar);
    const contacts = root.querySelector(SEL.headerContacts);
    if (bar && contacts) {
      bar.classList.add('ts-service-bar');
      const tools = root.querySelector(SEL.headerMobileTools);
      if (tools?.children.length === 1 && tools.querySelector(SEL.headerResponsiveTools)) {
        // The empty desktop wrapper otherwise reserves a leading flex gap.
        // Keep the native mobile controls and any configured language tools.
        tools.classList.add('ts-service-bar__mobile-only');
      }
      addHours(contacts);
      const phone = contacts.querySelector(SEL.headerPhoneLabel);
      if (phone) {
        phone.textContent = phone.textContent.replace(
          /^(\+\d{3})(\d{3})(\d{3})(\d{3})$/,
          '$1 $2 $3 $4',
        );
      }
      addSocial(contacts, SEL.socialFacebook, 'facebook');
      addSocial(contacts, SEL.socialInstagram, 'instagram');
      syncEmail();
      updateHours();
      if (!hoursTimer) hoursTimer = window.setInterval(updateHours, 30000);
    }
    for (const account of root.querySelectorAll(SEL.headerAccount)) {
      if (!account.hasAttribute('aria-label')) {
        account.setAttribute('aria-label', account.textContent.trim() || TEXTS.header.account);
      }
    }
    syncCartTrigger();
    // Apollo creates/moves this bar at DOM ready, before its after-load body
    // class. Enrich in the same rendering turn, not on a later window.load.
    const checkout = root.querySelector(SEL.checkoutContactRoot);
    if (checkout && !contactObserver) {
      contactObserver = new MutationObserver(() => {
        syncCartContacts();
        updateHours();
      });
      contactObserver.observe(checkout, { childList: true, subtree: true });
    }
    // Apollo's old breakpoint offsets cannot follow the compact icon/cart row.
    // Observe only header geometry; keep native popup markup and handlers.
    if (!observer) observer = new ResizeObserver(schedulePosition);
    if (!popupStateObserver) {
      popupStateObserver = new MutationObserver(syncPopupState);
      popupStateObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    }
    observer.disconnect();
    for (const selector of [SEL.headerRow, SEL.headerAccount, SEL.headerCart]) {
      const element = document.querySelector(selector);
      if (element) observer.observe(element);
    }
    if (!listenersBound) {
      window.addEventListener('scroll', onScroll, { passive: true });
      // A max-width container can move without resizing its children.
      window.addEventListener('resize', onResize, { passive: true });
      window.visualViewport?.addEventListener('resize', onResize);
      window.addEventListener('pagehide', releaseMobileCart);
      window.addEventListener('pageshow', syncMobileCart);
      desktop.addEventListener('change', onBreakpoint);
      document.addEventListener('mouseenter', cartHover, true);
      document.addEventListener('click', cartInteraction, true);
      document.addEventListener('touchend', cartInteraction, { capture: true, passive: false });
      document.addEventListener('keydown', cartInteraction, true);
      document.addEventListener('keydown', cartEscape, true);
      document.addEventListener(SHOPTET_EVENTS.cartUpdated, () => {
        syncCartTrigger();
        schedulePosition();
      });
      // Update immediately after a background tab becomes visible again.
      document.addEventListener('visibilitychange', updateHours);
      listenersBound = true;
    }
    schedulePosition();
  },
};
