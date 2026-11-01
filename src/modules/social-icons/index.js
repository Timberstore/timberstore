import { SEL } from '../../core/selectors.js';
import { TEXTS } from '../../core/texts.js';
import { getSocialNetwork } from '../../core/contacts.js';
import { addContactIcon } from '../../core/contact-icons.js';

export default {
  name: 'social-icons',
  pages: ['*'],
  init(root) {
    for (const link of root.querySelectorAll(SEL.socialProfiles)) {
      const network = getSocialNetwork(link.href);
      if (!network) continue;
      addContactIcon(link, network);
      if (!link.textContent.trim() && !link.getAttribute('aria-label'))
        link.setAttribute('aria-label', TEXTS.header[network]);
    }
  },
};
