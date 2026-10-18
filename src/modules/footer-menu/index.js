import { SEL } from '../../core/selectors.js';

export default {
  name: 'footer-menu',
  pages: ['*'],
  init() {
    for (const section of document.querySelectorAll(SEL.footerMenus)) {
      section.classList.add('ts-footer-menu');
    }
    for (const section of document.querySelectorAll(SEL.footerPopular)) {
      const heading = section.querySelector('h4');
      if (!heading) continue;
      // Apollo recognizes only direct h4 children. This custom banner kept
      // its title inside banner-wrapper/span, so the native accordion skipped it.
      if (heading.parentElement !== section) section.prepend(heading);
      if (!section.classList.contains('footer-item')) continue;
      // If Apollo already initialized, supply its same markup/classes and
      // reuse its delegated click handler. No second accordion implementation.
      heading.classList.add('accordion__trigger', 'js-accordion-trigger');
      if (!section.querySelector(':scope > .accordion__content')) {
        const content = document.createElement('div');
        content.className = 'accordion__content js-accordion-content';
        for (const child of [...section.childNodes]) {
          if (child !== heading) content.append(child);
        }
        section.append(content);
      }
    }
  },
};
