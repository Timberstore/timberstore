import { SEL } from '../../core/selectors.js';
import { TEXTS } from '../../core/texts.js';
import { setupHorizontalSlider, removeHorizontalSlider } from '../../core/horizontal-slider.js';

const observed = new WeakSet();
export default {
  name: 'partners-slider',
  pages: ['home'],
  init() {
    for (const [blockSelector, widgetSelector, itemSelector, prefix, labels] of [
      [SEL.partnersBlock, SEL.partnersGroup, SEL.partnersItem, 'ts-partners', TEXTS.partners],
      [SEL.serviceBlock, SEL.serviceGroup, SEL.serviceItem, 'ts-service', TEXTS.services],
    ])
      for (const block of document.querySelectorAll(blockSelector)) {
        if (observed.has(block)) continue;
        observed.add(block);
        const mobile = window.matchMedia('(max-width: 767px)');
        const sync = () => {
          if (mobile.matches) {
            setupHorizontalSlider(block, {
              widgetSelector,
              itemSelector,
              prefix,
              previousLabel: labels.previous,
              nextLabel: labels.next,
            });
          } else {
            const widget = block.querySelector(widgetSelector);
            if (widget) removeHorizontalSlider(widget);
          }
        };
        mobile.addEventListener('change', sync);
        sync();
      }
  },
};
