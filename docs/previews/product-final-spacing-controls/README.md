# Product Detail Compact PRO — Final Spacing & Controls

2026-10-19. Same preview branch `preview/product-detail-compact-pro-20261019`,
base `3554c382fb1239d8599d52fd62db7533ecc214a9`.
No merge, release/tag, production loader change or deployment.

## Scoped changes

Only two product CSS source files changed; JavaScript and its generated bundle
are byte-identical to the reference preview.

- Delivery/date group has no background, border or padding. Label is dark;
  the native date uses the existing availability green token and weight 600.
  Existing blue product code/brand and delivery-options link remain unchanged.
- Price → availability and availability → delivery gaps measure 16 px at all six
  tested widths. Removed Apollo's additional 10 px delivery-cell margin and the
  baseline offset of a wrapped flex cell. Native empty measure rows no longer
  introduce an extra flex row gap; actual measure/discount nodes remain intact.
  Variant-to-price separation retains the larger 24 px section rhythm (16 px
  parent gap plus 8 px price-section margin when variants occupy that grid).
- Quantity: same native 44 px +/- targets and input. Soft red outline/dividers
  mix existing cart-delete and white tokens, with the existing cart orange as
  fallback in browsers without color-mix. Buttons use the cart's soft red tint;
  minus is the existing cart red, plus the existing action orange. No new palette,
  global token, handler, duplicate control or min/max/step change.
- Quantity-to-CTA gap is 22 px on desktop/tablet and 14 px on mobile. Desktop
  CTA decreased from 368 to 330 px for both reference products. Its orange design
  stays native; full text/icon are centred with 12 px internal spacing and 20 px
  side padding. Narrow mobile can place the complete CTA on its own full row;
  nowrap prevents the icon or text from breaking onto another line.
- Popup method names increased 14 → 15 px, terms 12 → 13 px. Existing green
  header, white surface, carrier logos, prices, help icons, free-delivery message,
  two-line structure and native Colorbox behavior remain unchanged.
- Detail price units use 0.57em (15.96 px at the existing 28 px main price), weight
  600. The native unit text stays untouched and attached to the price. Flexible
  label/value placement permits a longer price group to wrap safely if needed.

## Verification

Products 494606 and 354068 on real Shoptet/Apollo pages in Chromium:
320, 375, 390, 430, 768 and 1440 px. Every width passed without page horizontal
overflow; both information gaps measured 16 px. Native price, net price, date,
stock strings and gallery targets matched the reference preview. Brand/code,
whole-word titles, single native form, orange CTA, quantity alignment and touch
size, green date and background-free delivery group passed.

Each product: native +/- 1 → 2 → 1, direct input 3 → 1, unchanged min/max/step,
shipping-popup opening and resize through all six widths, 15/13 px popup text,
logos and prices, then native add-to-cart and verification that the requested
product exists in the anonymous cart. No order or payment submitted.
No page JS exceptions in the completed functional run.

[Responsive and functional results](responsive-functional.json).
[Longer-price unit samples](unit-samples.json) cover ks, pár, m, sada, bm with a
controlled 1 234,56 € display at 320 px. Units remain on the same line as their
price, without overlap or page overflow. Samples are test-only DOM changes;
native server values were restored before functional cart checks.

Build/lint/whitespace checks passed. CSS 24.86 KiB gzip / existing preview limit
25; JS unchanged at 30.27 / 31. No budget or package-version changes.

Protected-source comparison against the reference confirmed no modifications to
modules, core, legacy, global tokens, cart, checkout, gallery logic, native variant
addon, mobile expansion-button rules or JS/source map. Warehouse-stock is untouched.
The only generated application changes are CSS and its source map.

## Limits and observations

Chromium desktop/mobile emulation, not physical iPhone SE or real iOS Safari.
Live `friends.shopcode.cz` data remains outside the environment allowlist; the
variant addon and card/expansion styles were not changed or retested with new live
data. Existing preview limitations remain in the prior Final Polish report.
No new application regression remains in the tested scope.

Initial checks exposed Apollo's extra 10 px cell margin and a 3.61 px baseline
shift when delivery wrapped; both were corrected locally. One exploratory
unit-check attempt ran during Colorbox's close/resize animation and temporarily
measured its oversized internal wrapper. A separate fresh-page unit test removed
that measurement ambiguity and passed all five unit samples. Native popup resize
and functional checks also passed after the final CSS changes.

## Files changed

- `src/styles/overrides/product-compact.css`
- `src/styles/overrides/product-shipping.css`
- `dist/timber.min.css`
- `dist/timber.min.css.map`
- `CHANGELOG.md`
- `docs/previews/product-final-spacing-controls/README.md`
- `docs/previews/product-final-spacing-controls/responsive-functional.json`
- `docs/previews/product-final-spacing-controls/unit-samples.json`

## Preview

Use this branch's final commit SHA with the existing loader:
`https://www.timberstore.sk/tulip-knopka-jota-zlata-matna/?ts_preview=<SHA>`
The same cookie applies to product 354068. Disable via `?ts_preview=off`.
