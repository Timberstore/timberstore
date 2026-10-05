import { SEL } from '../../core/selectors.js';

let bound = false;

export default {
  name: 'menu-card-click',
  pages: ['*'],
  init() {
    if (bound) return;
    bound = true;

    document.addEventListener('click', (event) => {
      const item = event.target.closest(SEL.navigationSubmenuItem);
      if (!item) return;

      // Keep native link clicks untouched.
      if (event.target.closest('a')) return;

      const link =
        item.querySelector(SEL.navigationSubmenuTitleLink) ||
        item.querySelector(SEL.navigationSubmenuContentLink) ||
        item.querySelector('a[href]');

      if (link) window.location.href = link.href;
    });
  },
};
