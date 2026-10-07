import { SEL } from '../../core/selectors.js';
import { TEXTS } from '../../core/texts.js';
import { isBusinessOpen } from './business-hours.js';

let observer;
let listenersBound = false;
let frame = 0;
let hoursTimer;
const desktop = window.matchMedia('(min-width: 768px)');
const emailOriginal = new WeakMap();

function updateHours() {
  const open = String(isBusinessOpen());
  const status = open === 'true' ? TEXTS.header.open : TEXTS.header.closed;
  for (const hours of document.querySelectorAll('.ts-service-bar__hours')) {
    if (hours.dataset.open === open) continue;
    hours.dataset.open = open;
    hours.title = status;
    hours.setAttribute('aria-label', `${TEXTS.header.hours} — ${status}`);
  }
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
  if (!source || wrapper) return;
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
  email.href = source.href;
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
    const left = Math.max(0, edge.right - width);
    const top = edge.bottom + (style.position === 'fixed' ? 0 : window.scrollY);
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
  // No invented URLs: if Apollo stops supplying the footer social link,
  // leave that network out until its destination is configured in Shoptet.
  if (!source) return;
  const link = document.createElement('a');
  link.className = `ts-service-bar__social${network === 'instagram' ? ' icon-instagram' : ''}`;
  link.dataset.tsSocial = network;
  link.href = source.href;
  link.target = source.target;
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
      if (!contacts.querySelector('.ts-service-bar__hours')) {
        const hours = document.createElement('span');
        hours.className = 'ts-service-bar__hours';
        const dot = document.createElement('span');
        dot.className = 'ts-service-bar__status';
        dot.setAttribute('aria-hidden', 'true');
        hours.append(dot, document.createTextNode(TEXTS.header.hours));
        contacts.prepend(hours);
      }
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
    // Apollo's old breakpoint offsets cannot follow the compact icon/cart row.
    // Observe only header geometry; keep native popup markup and handlers.
    if (!observer) observer = new ResizeObserver(schedulePosition);
    observer.disconnect();
    for (const selector of [SEL.headerRow, SEL.headerAccount, SEL.headerCart]) {
      const element = document.querySelector(selector);
      if (element) observer.observe(element);
    }
    if (!listenersBound) {
      window.addEventListener('scroll', schedulePosition, { passive: true });
      // A max-width container can move without resizing its children.
      window.addEventListener('resize', schedulePosition, { passive: true });
      desktop.addEventListener('change', syncEmail);
      // Update immediately after a background tab becomes visible again.
      document.addEventListener('visibilitychange', updateHours);
      listenersBound = true;
    }
    schedulePosition();
  },
};
