import { SEL } from '../../core/selectors.js';
import { addContactIcon } from '../../core/contact-icons.js';
import { TEXTS } from '../../core/texts.js';
import { addHours, updateHours } from '../header-service-bar/index.js';

const observed = new WeakSet();
const sizedPhones = new WeakSet();

function enhance(footer) {
  footer.classList.add('ts-footer-contacts');
  const email = footer.querySelector(SEL.footerEmail);
  if (email) {
    email.href = `mailto:${TEXTS.footer.email}`;
    if (!email.querySelector('.ts-footer-contacts__icon')) email.textContent = TEXTS.footer.email;
    addContactIcon(email, 'email');
  }
  const phone = footer.querySelector(SEL.footerPhone);
  if (phone) {
    phone.href = 'tel:+421904479842';
    if (!phone.querySelector('.ts-footer-contacts__icon')) phone.textContent = TEXTS.footer.phone;
    addContactIcon(phone, 'phone');
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
    addContactIcon(link, network);
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
