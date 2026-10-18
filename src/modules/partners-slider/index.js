import { SEL } from '../../core/selectors.js';
import { TEXTS } from '../../core/texts.js';
import { setupHorizontalSlider, removeHorizontalSlider } from '../../core/horizontal-slider.js';

const observed = new WeakSet();
export default {
  name: 'partners-slider',
  pages: ['home'],
  init() {
    for (const block of document.querySelectorAll(SEL.partnersBlock)) {
      if (observed.has(block)) continue;
      observed.add(block);
      const mobile = window.matchMedia('(max-width: 767px)');
      const sync = () => {
        if (mobile.matches) {
          setupHorizontalSlider(block, {
            widgetSelector: SEL.partnersGroup,
            itemSelector: SEL.partnersItem,
            prefix: 'ts-partners',
            previousLabel: TEXTS.partners.previous,
            nextLabel: TEXTS.partners.next,
          });
        } else {
          const widget = block.querySelector(SEL.partnersGroup);
          if (widget) removeHorizontalSlider(widget);
        }
      };
      mobile.addEventListener('change', sync);
      sync();
    }
  },
};
