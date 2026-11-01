import { SEL } from '../../core/selectors.js';
import { TEXTS } from '../../core/texts.js';
import { addContactIcon } from '../../core/contact-icons.js';
import { addHours, updateHours } from '../header-service-bar/index.js';

const observed = new WeakSet();

function enhance(support) {
  const contacts = support.querySelector(SEL.sidebarSupportContacts);
  if (!contacts) return;
  support.classList.add('ts-sidebar-support');
  support.dataset.tsInit = 'sidebar-support';
  addHours(contacts);
  const hours = contacts.querySelector('.ts-service-bar__hours');
  const email = contacts.querySelector(SEL.sidebarSupportEmail);
  const phone = contacts.querySelector(SEL.sidebarSupportPhone);
  for (const [link, kind, label] of [
    [email, 'email', TEXTS.footer.email],
    [phone, 'phone', TEXTS.footer.phone],
  ]) {
    if (!link) continue;
    // Keep the original Apollo/banner anchor, href, attributes and handlers.
    let text = [...link.childNodes].find((node) => node.nodeType === 3 && node.textContent.trim());
    if (!text) {
      text = document.createTextNode(label);
      link.append(text);
    } else if (text.nodeValue !== label) text.nodeValue = label;
    addContactIcon(link, kind);
  }
  // Move existing rows only when needed, so our scoped observer settles.
  if (hours !== contacts.firstElementChild) contacts.prepend(hours);
  if (email && hours.nextElementSibling !== email) hours.after(email);
  if (phone && (email || hours).nextElementSibling !== phone) (email || hours).after(phone);
  const button = support.querySelector(SEL.sidebarSupportForm);
  if (button && button.textContent !== TEXTS.footer.writeUs)
    button.textContent = TEXTS.footer.writeUs;
  updateHours();
}

export default {
  name: 'sidebar-support',
  pages: ['*'],
  init(root) {
    for (const support of root.querySelectorAll(SEL.sidebarSupport)) {
      enhance(support);
      if (observed.has(support)) continue;
      observed.add(support);
      // Apollo may clone/move banner contents after boot. Observe only this
      // component; preserve its native box-support placement and visibility.
      new MutationObserver(() => enhance(support)).observe(support, {
        childList: true,
        subtree: true,
      });
    }
  },
};
