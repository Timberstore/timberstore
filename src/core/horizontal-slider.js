const sliders = new WeakMap();

export function setupHorizontalSlider(
  block,
  { widgetSelector, itemSelector, prefix, previousLabel, nextLabel },
) {
  const widget = block.querySelector(widgetSelector);
  if (!widget) return;
  const existing = sliders.get(widget);
  if (existing) {
    existing.update();
    return;
  }
  const controls = document.createElement('div');
  controls.className = `${prefix}__controls`;
  const previous = document.createElement('button');
  const next = document.createElement('button');
  for (const [button, label, symbol, direction] of [
    [previous, previousLabel, '‹', -1],
    [next, nextLabel, '›', 1],
  ]) {
    button.type = 'button';
    button.className = `${prefix}__arrow`;
    button.setAttribute('aria-label', label);
    button.textContent = symbol;
    button.addEventListener('click', () => {
      const item = widget.querySelector(itemSelector);
      const step =
        (item?.getBoundingClientRect().width || widget.clientWidth) +
        parseFloat(getComputedStyle(widget).columnGap || 0);
      widget.scrollBy({
        left: direction * step,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      });
    });
    controls.append(button);
  }
  const stage = document.createElement('div');
  stage.className = `${prefix}__slider`;
  widget.before(stage);
  stage.append(widget, controls);
  const update = () => {
    const max = Math.max(0, widget.scrollWidth - widget.clientWidth);
    previous.disabled = widget.scrollLeft <= 1;
    next.disabled = widget.scrollLeft >= max - 1;
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
