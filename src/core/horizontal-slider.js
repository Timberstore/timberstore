const sliders = new WeakMap();

export function setupHorizontalSlider(
  block,
  { widgetSelector, itemSelector, prefix, pageLabel, arrows = false, desktopPager = false, previousLabel, nextLabel },
) {
  const widget = block.querySelector(widgetSelector);
  if (!widget) return;
  const paged = !arrows || (desktopPager && window.matchMedia('(min-width: 768px)').matches);
  let existing = sliders.get(widget);
  if (existing && existing.paged !== paged) {
    existing.cleanup();
    existing = null;
  }
  if (existing) {
    existing.update();
    return;
  }
  const controls = document.createElement('div');
  controls.className = `${prefix}__controls${arrows ? '' : ' ts-rail__dots'}`;
  const stage = document.createElement('div');
  stage.className = `${prefix}__slider`;
  widget.before(stage);
  stage.append(widget, controls);
  if (paged && window.Swiper) {
    const viewport = document.createElement('div');
    viewport.className = 'ts-rail__viewport';
    widget.before(viewport);
    viewport.append(widget);
    stage.classList.add('ts-rail--paged');
    controls.className = `${prefix}__controls ts-rail__dots`;
    const items = [...widget.querySelectorAll(itemSelector)];
    const originals = [widget, ...items].map((element) => [element, element.getAttribute('style')]);
    widget.classList.add('swiper-wrapper');
    items.forEach((item) => item.classList.add('swiper-slide'));
    const navigation = {};
    if (arrows) {
      for (const [key, label, text] of [
        ['prevEl', previousLabel, '‹'], ['nextEl', nextLabel, '›'],
      ]) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `${prefix}__arrow ts-rail__${key}`;
        button.setAttribute('aria-label', label);
        button.textContent = text;
        stage.append(button);
        navigation[key] = button;
      }
    }
    const count = prefix === 'ts-partners' ? 2 : arrows ? 3 : 1;
    const swiper = new window.Swiper(viewport, {
      speed: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 600,
      spaceBetween: 8,
      slidesPerView: count,
      slidesPerGroup: arrows ? 1 : count,
      freeMode: false,
      navigation,
      pagination: {
        el: controls,
        clickable: true,
        renderBullet(index, className) {
          return `<button type="button" class="${className} ts-rail__dot" aria-label="${pageLabel} ${index + 1}"></button>`;
        },
      },
      ...(arrows ? { breakpoints: { 1200: { slidesPerView: 6 } } } : {}),
    });
    sliders.set(widget, {
      paged,
      update() {
        widget.querySelectorAll(itemSelector).forEach((item) => {
          if (!items.includes(item)) {
            originals.push([item, item.getAttribute('style')]);
            items.push(item);
            item.classList.add('swiper-slide');
          }
        });
        swiper.update();
      },
      cleanup() {
        swiper.destroy(true, true);
        widget.classList.remove('swiper-wrapper');
        items.forEach((item) => item.classList.remove('swiper-slide'));
        originals.forEach(([element, style]) => {
          if (style === null) element.removeAttribute('style');
          else element.setAttribute('style', style);
        });
        stage.replaceWith(widget);
        sliders.delete(widget);
      },
    });
    return;
  }
  let step = 0;
  const update = () => {
    const items = [...widget.querySelectorAll(itemSelector)];
    step =
      (items[0]?.getBoundingClientRect().width || widget.clientWidth) +
      parseFloat(getComputedStyle(widget).columnGap || 0);
    const max = Math.max(0, widget.scrollWidth - widget.clientWidth);
    if (arrows) {
      if (!controls.children.length) {
        for (const [direction, label, text] of [
          [-1, previousLabel, '‹'],
          [1, nextLabel, '›'],
        ]) {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = `${prefix}__arrow`;
          button.setAttribute('aria-label', label);
          button.textContent = text;
          button.addEventListener('click', () =>
            widget.scrollBy({
              left: direction * step,
              behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
                ? 'auto'
                : 'smooth',
            }),
          );
          controls.append(button);
        }
      }
      controls.firstElementChild.disabled = widget.scrollLeft <= 1;
      controls.lastElementChild.disabled = widget.scrollLeft >= max - 1;
      controls.hidden = max <= 1;
      return;
    }

  };
  widget.addEventListener('scroll', update, { passive: true });
  const observer = new ResizeObserver(update);
  observer.observe(widget);
  sliders.set(widget, {
    paged,
    update,
    cleanup() {
      widget.removeEventListener('scroll', update);
      observer.disconnect();
      stage.replaceWith(widget);
      sliders.delete(widget);
    },
  });
  update();
}

export function removeHorizontalSlider(widget) {
  sliders.get(widget)?.cleanup();
}
