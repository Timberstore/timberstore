const sliders = new WeakMap();

export function setupHorizontalSlider(
  block,
  { widgetSelector, itemSelector, prefix, pageLabel, arrows = false, previousLabel, nextLabel },
) {
  const widget = block.querySelector(widgetSelector);
  if (!widget) return;
  const existing = sliders.get(widget);
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
  let positions = [];
  let step = 0;
  const update = () => {
    const items = [...widget.querySelectorAll(itemSelector)];
    step =
      (items[0]?.getBoundingClientRect().width || widget.clientWidth) +
      parseFloat(getComputedStyle(widget).columnGap || 0);
    const visible = Math.max(
      1,
      Math.round((widget.clientWidth + parseFloat(getComputedStyle(widget).columnGap || 0)) / step),
    );
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
    const pages = Math.max(1, Math.ceil(items.length / visible));
    positions = Array.from({ length: pages }, (_, index) => Math.min(max, index * visible * step));
    if (controls.children.length !== pages) {
      const dots = positions.map((_, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'ts-rail__dot swiper-pagination-bullet';
        dot.setAttribute('aria-label', `${pageLabel} ${index + 1}`);
        dot.addEventListener('click', () =>
          widget.scrollTo({
            left: positions[index] ?? 0,
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
              ? 'auto'
              : 'smooth',
          }),
        );
        return dot;
      });
      controls.replaceChildren(...dots);
    }
    let active = 0;
    positions.forEach((position, index) => {
      if (Math.abs(position - widget.scrollLeft) < Math.abs(positions[active] - widget.scrollLeft))
        active = index;
    });
    [...controls.children].forEach((dot, index) => {
      dot.setAttribute('aria-current', String(index === active));
      dot.classList.toggle('swiper-pagination-bullet-active', index === active);
    });
    controls.hidden = max <= 1;
  };
  widget.addEventListener('scroll', update, { passive: true });
  const observer = new ResizeObserver(update);
  observer.observe(widget);
  sliders.set(widget, {
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
