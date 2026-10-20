module.exports = async (p) =>
  p.evaluate(() => {
    const root = document.querySelector('[data-ts-compact]'),
      q = (s) => root.querySelector(s),
      rect = (e) => {
        if (!e) return null;
        const r = e.getBoundingClientRect();
        return {
          x: r.x,
          y: r.y,
          width: r.width,
          height: r.height,
          right: r.right,
          bottom: r.bottom,
        };
      },
      union = (rs) => {
        rs = rs.filter((r) => r && r.width && r.height);
        if (!rs.length) return null;
        const x = Math.min(...rs.map((r) => r.x)),
          y = Math.min(...rs.map((r) => r.y)),
          right = Math.max(...rs.map((r) => r.right)),
          bottom = Math.max(...rs.map((r) => r.bottom));
        return { x, y, right, bottom, width: right - x, height: bottom - y };
      };
    const text = (e) => {
      if (!e) return null;
      const w = document.createTreeWalker(e, NodeFilter.SHOW_TEXT),
        rs = [];
      let n;
      while ((n = w.nextNode())) {
        if (!n.textContent.trim() || n.parentElement.closest('.sr-only')) continue;
        const range = document.createRange();
        range.selectNodeContents(n);
        rs.push(
          ...[...range.getClientRects()].map((r) => ({
            x: r.x,
            y: r.y,
            width: r.width,
            height: r.height,
            right: r.right,
            bottom: r.bottom,
          })),
        );
      }
      return union(rs);
    };
    const style = (e) => {
      if (!e) return null;
      const c = getComputedStyle(e);
      return Object.fromEntries(
        [
          'display',
          'fontFamily',
          'fontSize',
          'fontWeight',
          'lineHeight',
          'margin',
          'padding',
          'minHeight',
          'alignItems',
          'rowGap',
          'columnGap',
          'border',
          'color',
          'backgroundColor',
        ].map((k) => [k, c[k]]),
      );
    };
    // A zero-size baseline probe measures the actual inline baseline. It is removed
    // immediately; no application nodes or text are replaced by this QA helper.
    const ink = (e) => {
      const c = getComputedStyle(e),
        probe = document.createElement('span');
      probe.style.cssText =
        'display:inline-block;width:0;height:0;padding:0;margin:0;border:0;vertical-align:baseline;';
      e.append(probe);
      const baseline = probe.getBoundingClientRect().bottom;
      probe.remove();
      const canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');
      ctx.font = c.font;
      const label =
        e === q('.price-final-holder')
          ? [...e.childNodes]
              .filter((n) => n.nodeType === Node.TEXT_NODE)
              .map((n) => n.textContent)
              .join('')
              .trim()
          : e.textContent.trim();
      const painted = c.textTransform === 'uppercase' ? label.toUpperCase() : label;
      const t = ctx.measureText(painted);
      return {
        baseline,
        ascent: t.actualBoundingBoxAscent,
        descent: t.actualBoundingBoxDescent,
        top: baseline - t.actualBoundingBoxAscent,
        bottom: baseline + t.actualBoundingBoxDescent,
        text: label,
      };
    };
    const selectors = {
      priceRow: '.detail-price-block',
      priceLabel: '.detail-price-block>.detail-grid-title',
      priceWrapper: '.p-final-price-wrapper',
      price: '.price-final',
      net: '.price-additional',
      measure: '.price-measure',
      availabilityContainer: '.detail-availability-block',
      availabilityLabel: '.detail-availability-block>.detail-grid-title',
      stock: '.availability-value',
      deliveryRow: '.delivery-time-block',
      deliveryCell: '.delivery-time-block>td',
      deliveryGroup: '.ts-product-delivery',
      deliveryLabel: '.delivery-time-label',
      date: '.delivery-time',
      options: '.shipping-options-block',
      optionsLink: '.shipping-options',
      quantity: '.quantity',
      cta: '.add-to-cart-button',
      grid: '.p-info-grid',
    };
    const elements = Object.fromEntries(
      Object.entries(selectors).map(([k, s]) => [
        k,
        { rect: rect(q(s)), text: text(q(s)), style: style(q(s)) },
      ]),
    );
    const pr = union([
      elements.price.text,
      elements.net.text,
      text(q('.price-standard')),
      text(q('.price-save')),
      text(q('.price-measure')),
      elements.priceLabel.text,
    ]);
    const st = union([elements.stock.text, elements.availabilityLabel.text]);
    const de = union([elements.deliveryLabel.text, elements.date.text]);
    const il = {
      price: ink(q('.price-final-holder')),
      net: ink(q('.price-additional')),
      priceLabel: ink(q('.detail-price-block>.detail-grid-title')),
      stockLabel: ink(q('.detail-availability-block>.detail-grid-title')),
      stock: ink(q('.availability-label') || q('.availability-value')),
      deliveryLabel: ink(q('.delivery-time-label')),
      date: ink(q('.delivery-time')),
    };
    const priceInkBottom = Math.max(il.price.bottom, il.priceLabel.bottom, il.net.bottom),
      stockInkTop = Math.min(il.stock.top, il.stockLabel.top),
      stockInkBottom = Math.max(il.stock.bottom, il.stockLabel.bottom),
      deliveryInkTop = Math.min(il.deliveryLabel.top, il.date.top);
    return {
      width: innerWidth,
      overflow: document.documentElement.scrollWidth > innerWidth,
      elements,
      textBounds: { price: pr, stock: st, delivery: de },
      textGaps: [st.y - pr.bottom, de.y - st.bottom],
      ink: il,
      inkGaps: [stockInkTop - priceInkBottom, deliveryInkTop - stockInkBottom],
      rowGaps: [
        elements.availabilityLabel.rect.y - elements.priceWrapper.rect.bottom,
        elements.deliveryGroup.rect.y - elements.stock.rect.bottom,
      ],
      values: ['.price-final', '.price-additional', '.availability-value', '.delivery-time'].map(
        (s) => q(s).textContent.replace(/\s+/g, ' ').trim(),
      ),
      gallery: [...document.querySelectorAll('.p-thumbnail')].map((e) => e.getAttribute('href')),
      formCount: document.querySelectorAll('#product-detail-form').length,
    };
  });
