import { SEL } from '../../core/selectors.js';
import { TEXTS } from '../../core/texts.js';
import { addHours, updateHours } from '../header-service-bar/index.js';

const paths = {
  email: 'M3 5h18v14H3z M3 5l9 8 9-8',
  phone: 'M5 3h4l2 5-3 2c2 3 3 4 6 6l2-3 5 2v4c0 2-3 3-5 2C9 19 5 15 3 8 2 6 3 3 5 3z',
  facebook: 'M14 22v-9h3l1-4h-4V7c0-1 0-2 2-2h2V1h-3c-4 0-5 3-5 6v2H7v4h3v9z',
  instagram:
    'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4z M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0 M17 6h.01',
};
function icon(link, kind) {
  if (link.querySelector('.ts-footer-contacts__icon')) return;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('ts-footer-contacts__icon');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS(svg.namespaceURI, 'path');
  path.setAttribute('d', paths[kind]);
  svg.append(path);
  link.prepend(svg);
}

const observed = new WeakSet();
const sizedPhones = new WeakSet();

function enhance(footer) {
  footer.classList.add('ts-footer-contacts');
  const email = footer.querySelector(SEL.footerEmail);
  if (email) {
    email.href = `mailto:${TEXTS.footer.email}`;
    if (!email.querySelector('.ts-footer-contacts__icon')) email.textContent = TEXTS.footer.email;
    icon(email, 'email');
  }
  const phone = footer.querySelector(SEL.footerPhone);
  if (phone) {
    phone.href = 'tel:+421904479842';
    if (!phone.querySelector('.ts-footer-contacts__icon')) phone.textContent = TEXTS.footer.phone;
    icon(phone, 'phone');
    if (!sizedPhones.has(phone)) {
      sizedPhones.add(phone);
      new ResizeObserver(() => {
        const text = [...phone.childNodes].find(
          (node) => node.nodeType === 3 && node.textContent.trim(),
        );
        if (!text) return;
        const range = document.createRange();
        range.selectNodeContents(text);
        const width = range.getBoundingClientRect().width;
        if (width) footer.style.setProperty('--ts-footer-phone-width', `${Math.ceil(width)}px`);
      }).observe(phone);
    }
  }
  for (const [selector, network] of [
    [SEL.footerFacebook, 'facebook'],
    [SEL.footerInstagram, 'instagram'],
  ]) {
    const link = footer.querySelector(selector);
    if (!link) continue;
    link.classList.add('ts-footer-contacts__social', `ts-footer-contacts__social--${network}`);
    link.setAttribute('aria-label', TEXTS.header[network]);
    link.rel = 'noopener noreferrer';
    icon(link, network);
  }
  const box = footer.querySelector(SEL.footerContactBox);
  if (box && !box.querySelector('.ts-footer-contacts__hours')) {
    const hours = document.createElement('li');
    hours.className = 'ts-footer-contacts__hours';
    addHours(hours);
    const row = phone?.closest('li');
    if (row) row.after(hours);
    else box.append(hours);
  }
  if (box) {
    const button = box.querySelector(SEL.footerForm);
    const socials = box.querySelector(SEL.footerSocialList);
    if (button) {
      if (button.textContent !== TEXTS.footer.writeUs) button.textContent = TEXTS.footer.writeUs;
      let actions = box.querySelector('.ts-footer-contacts__actions');
      if (!actions) {
        actions = document.createElement('div');
        actions.className = 'ts-footer-contacts__actions';
        box.append(actions);
      }
      if (button.parentElement !== actions) actions.prepend(button);
      if (socials && socials.parentElement !== actions) actions.append(socials);
    }
  }
  // Shared header timer updates both header and footer, using Bratislava time.
  updateHours();
}

export default {
  name: 'footer-contacts',
  pages: ['*'],
  init() {
    for (const footer of document.querySelectorAll(SEL.footerContacts)) {
      enhance(footer);
      if (observed.has(footer)) continue;
      observed.add(footer);
      // Apollo rebuilds/empties the social anchors after DOM ready. Restore
      // only this contact component without changing its native accordion.
      new MutationObserver(() => enhance(footer)).observe(footer, {
        childList: true,
        subtree: true,
      });
    }
  },
};
