# Final Product Information Spacing Fix

2026-10-19. Continues `preview/product-detail-compact-pro-20261019` from the
requested reference `cf3076ea636ba4532adbdcbf96afffcc9e71c71f`, after reading
[its report](../product-unification-fix/README.md). Preview only: no merge,
release/tag, production loader change or deployment.

## What caused the visible mismatch

Apollo's `.price-measure` is not empty in the DOM: it contains an accessible
`.sr-only` label and whitespace, although its rendered height is zero on these
products. Its native **10 px top margin still contributes to the flex layout**.
At 1440 px the main price line is 35 px high, but its wrapper is 45 px high.
The whole price block measures 62 px: 1 px border + 16 px top padding + 45 px
wrapper. The next flex gap is indeed 16 px; the unused 10 px comes before it.
Thus measuring only the block-to-block gap concealed the problem.

The reference's price label and main value share a baseline, with different
line boxes: price 28 px / 35 px, label 14 px / 21 px. For TULIP at 1440 px the
actual baseline positions were 422.125 / 471.125 / 508.125 px for price,
availability and delivery. After correction they are 422.125 / 454.125 /
484.125 px. No minimum height is responsible; the relevant nodes have automatic
minimum heights, zero padding/margins except the price border/top inset and the
identified unit-price margin. The full nested Apollo inventory is recorded in
[measurements.json](measurements.json).

## Common row structure and correction

- Price and availability use the same natural-height grid pattern:
  `auto minmax(0, 1fr)`, baseline alignment, 8 px horizontal separation. Native
  label/value nodes remain in place. No fixed row heights or new DOM wrappers.
- One scoped `--ts-compact-info-gap: 9px` controls the spacing both between the
  price/availability blocks and inside the availability/delivery container.
  Remove the delivery row's compensating margin. With the real font's line-box
  insets this gives **13 px between visible glyphs** at both boundaries.
- Remove the local unit-price top margin, retaining the native node and any
  actual unit-price content. The price wrapper becomes 35 px, whole block 52 px.
  Price stays 28 px / 35 px, bold; labels stay 14 px / 21 px / 500. Net price
  stays parenthetical and beside the main price wherever it fits. At 320 px on
  AGOFORM it wraps naturally; the resulting block is 71.5 px instead of 81.5 px.
- Existing variant-to-price section spacing remains 24 px when variant cards
  occupy the info grid; its offset accounts for the changed information gap.
- At widths <=767 px the existing label/date group becomes a column, with a
  measured **4 px** gap and matching left edges. Date retains availability green,
  weight 600, no border/background. Native options link aligns on the right by
  the date when it fits and wraps beneath at 320 px. Desktop/tablet >=768 px
  retain the horizontal group. Natural delivery height is 21 px on desktop,
  46 px with the mobile stack, 82 px when the native link needs another row.
- The grid's 24 px purchase separation is retained. The quantity begins 24 px
  below delivery when the CTA is on a separate line, or 30.19 px below when
  vertically centred beside the taller CTA. Neither component's CSS was changed.

## Actual before/after measurements

Each pair below is **price → availability / availability → delivery**, in px.
These are measurements of the loaded page, not declarations of CSS `gap`.

| Product | Viewport | Visible glyph gaps before | Visible glyph gaps after | Text Range gaps before | Text Range gaps after |
| ------- | -------- | ------------------------- | ------------------------ | ---------------------- | --------------------- |
| 494606  | 1440     | 30 / 20                   | 13 / 13                  | 29 / 21                | 12 / 14               |
| 494606  | 768      | 30 / 20                   | 13 / 13                  | 29 / 21                | 12 / 14               |
| 494606  | 430      | 30 / 20                   | 13 / 13                  | 29 / 21                | 12 / 14               |
| 494606  | 390      | 30 / 20                   | 13 / 13                  | 29 / 21                | 12 / 14               |
| 494606  | 375      | 30 / 20                   | 13 / 13                  | 29 / 21                | 12 / 14               |
| 494606  | 320      | 30 / 20                   | 13 / 13                  | 29 / 21                | 12 / 14               |
| 354068  | 1440     | 30 / 20                   | 13 / 13                  | 29 / 21                | 12 / 14               |
| 354068  | 768      | 30 / 20                   | 13 / 13                  | 29 / 21                | 12 / 14               |
| 354068  | 430      | 30 / 20                   | 13 / 13                  | 29 / 21                | 12 / 14               |
| 354068  | 390      | 30 / 20                   | 13 / 13                  | 29 / 21                | 12 / 14               |
| 354068  | 375      | 30 / 20                   | 13 / 13                  | 29 / 21                | 12 / 14               |
| 354068  | 320      | 30.5 / 20                 | 13.5 / 13                | 30.5 / 21              | 13.5 / 14             |

Method: `getBoundingClientRect()` captures whole blocks, label/value elements
and nested nodes; `Range.getClientRects()` captures actual text fragments,
excluding clipped accessibility labels. Font-ink bounds use the loaded browser
font's `CanvasTextMetrics.actualBoundingBoxAscent/Descent`, the measured inline
baseline and actual CSS uppercase transformation. These are font-metric bounds,
not a raster scan of anti-aliased pixels. The wrapped net-price line is included
when it determines the bottom of the price content. See the exact
[measurement helper](measure.cjs) and raw rectangles/styles/baselines in the JSON.

## Screenshots

Actual product-panel captures, before and after, at 1440 and 375 px. The header
and information notice are hidden only during screenshots to avoid obscuring the
panel; this does not change application CSS. The delivery date is native/live,
not hardcoded to the example in the request.

| Product / viewport  | Before                                           | After                                           |
| ------------------- | ------------------------------------------------ | ----------------------------------------------- |
| 494606 desktop 1440 | [Screenshot](screenshots/494606-before-1440.png) | [Screenshot](screenshots/494606-after-1440.png) |
| 494606 mobile 375   | [Screenshot](screenshots/494606-before-375.png)  | [Screenshot](screenshots/494606-after-375.png)  |
| 354068 desktop 1440 | [Screenshot](screenshots/354068-before-1440.png) | [Screenshot](screenshots/354068-after-1440.png) |
| 354068 mobile 375   | [Screenshot](screenshots/354068-before-375.png)  | [Screenshot](screenshots/354068-after-375.png)  |

## Functional checks and limits

All 12 product/viewport combinations passed: no page overflow; correct date
stacking/alignment; no link/content overlap; measured optical spacing in the
12–14 px range. Native price/net-price/stock/date text and gallery links match
the reference. Quantity and CTA rendered dimensions and computed styles match
the reference at every width (only their page position changes with the rhythm).
Exactly one native product form remains.

For each product, native +/− (1 → 2 → 1), typed amount (3 → 1), unchanged
min/max/step, opening/closing the delivery popup at 320 px, and adding the actual
product to an anonymous cart confirmed on `/kosik/`: PASS. No order was placed.
No page JavaScript errors and no new regressions detected in this scope.

Visual inspection confirmed all four after screenshots. Testing uses headless
Chromium responsive viewports, not physical Safari devices. The live external
friends.shopcode variant service is excluded by the environment's network
policy; its interaction is not re-certified here. Gallery, title, variant,
warehouse, quantity, CTA, popup and contact code remain unchanged. No JS or
native event handlers were edited; the JS bundle is byte-identical to reference.

`npm run lint`, `npm run build`, `git diff --check`: PASS.
Gzip: CSS 24.71 KiB / 25 KiB limit; JS 30.27 KiB / 31 KiB limit.

## Changed files

- `src/styles/overrides/product-compact.css` — the sole implementation change.
- `dist/timber.min.css`, `dist/timber.min.css.map` — regenerated CSS bundle/map.
- `CHANGELOG.md`.
- This report, `measurements.json`, `measure.cjs`, and the eight screenshot PNGs
  in `docs/previews/product-information-spacing/`.
