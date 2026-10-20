# Product Detail — Purchase Information Columns

2026-10-19. Same isolated branch `preview/product-detail-compact-pro-20261019`;
reference `4d89af706853d4bc4c546559916df2b6dac944ae`.
No merge, release/tag, production loader change or production deployment.

## Implementation

`product-compact` groups the two existing native blocks in one
`.ts-product-purchase-info` wrapper inside their original `.p-info-grid`.
Availability/delivery remain together; price keeps its complete native price
wrapper. No native block is cloned, rebuilt from HTML, or moved between Shoptet
components/forms. Product name, gallery, variants, contacts, cart controls and
warehouse logic are untouched.

The existing mutation observer maintains this presentation after native price
or availability updates. Grouping is idempotent: it only moves a block when its
parent differs. It also recovers when the native grid receives ungrouped blocks
again. Existing delivery grouping and native net-price suffix handling continue
on the same nodes. No new event handlers, requests, calculations or user-facing
features were introduced. Native selectors are centralized in `core/selectors`.

Local flex layout uses two equal columns with a 20 px gutter. Apollo's original
`order: 2` / `order: 3` is overridden only inside the scoped detail presentation:
stock/delivery left, price right. The presentation wrapper retains order 2 in
the native grid so preceding variants/parameters retain their placement.

- Left: availability heading/value, delivery heading/date, then the existing blue
  delivery-options link. Labels 14 px / 500 / 19 px; related gaps 3 px and a 6 px
  separation before delivery. Availability stays green; quantity neutral; date
  green/600; link uses existing royal blue. No background or vertical divider.
- Right: small `Cena` label, native dominant 28 px price / 35 px line-height,
  readable ~16 px / 600 unit; native net price 13 px in grey parentheses below.
  All right edges align. Standard/sale/unit-price nodes are retained.
- Normal two-column block measures **109 px**: compact relative to the preceding
  information grid's 112 px desktop and 137 px ordinary mobile layout. There
  are no fixed column/row heights or reduced price fonts.
- Intrinsic price width and a 150 px preferred minimum left column provide a
  safe wrap. At 320 px, the available 265 px cannot fit both columns plus gutter:
  the price moves beneath the left information, aligned right. Natural height
  is 204.5 px. Long prices can trigger the same fallback at wider viewports.
  No text is squeezed, clipped or overlaid to keep two columns.
- Native quantity/CTA remain below the whole block with their existing 24 px
  purchase separation, dimensions, colours, icons and handlers. Existing larger
  variant-to-information spacing is retained; variant cards stay outside the
  new presentation wrapper.

## Verification

[Full reference comparisons and native checks](verification.json).
[Variant replay, long-price/net-price cases and mobile popup checks](edge-cases.json).

| Product                    | 1440      | 768       | 430       | 390       | 375       | 320        |
| -------------------------- | --------- | --------- | --------- | --------- | --------- | ---------- |
| 494606 — TULIP Knopka Jota | 2 columns | 2 columns | 2 columns | 2 columns | 2 columns | Safe stack |
| 354068 — AGOFORM Classico  | 2 columns | 2 columns | 2 columns | 2 columns | 2 columns | Safe stack |

All 12 combinations passed: no horizontal overflow or column overlap; net price
below main price; correct right edges; left-aligned stacked availability/date;
link below date; unchanged main-price/unit sizes; single form/wrapper. Native
prices/net prices/stock/date text, gallery links and name/code/brand/contact
presentation match the reference. Quantity and CTA dimensions and computed
styles match at every width.

48 cases cover the two products × six widths × `ks`, `pár`, `sada`, `m`, using a
synthetic `1 234 567,89 €` gross price. Another 24 cases also use a long
`1 020 304,12 €` net price. Amount/currency/unit remain within the price column
or the safe full-width fallback. These are presentation fixtures, not changes
to price calculation, VAT or catalogue data.

For each product, simulated native price-block replacement, in-place stock/date
changes, native-event redispatch and removal/recreation of the presentation
wrapper preserved the exact price/availability node identities and one wrapper.
New values appeared immediately; net-price suffix normalization still worked.
These QA substitutions were discarded before real purchase checks.

For both real products: +/− 1 → 2 → 1, typed amount 3 → 1, native delivery-popup
opening/closing and successful add-to-cart verified on `/kosik/`: PASS. Additional
popup checks at 375 and 320 px passed without page overflow. No order was placed.

An eight-card public-data replay through the unchanged native friends addon
matched baseline card/image dimensions, order, links and active state at all six
widths; no card entered the purchase wrapper. The live friends.shopcode API is
excluded by the test environment's network policy, so this verifies the native
addon with replayed data, not its live endpoint or a live variant-selection
session. Separate real product navigations and simulated native replacements
verify that the module does not cache the first product's price/availability.

Headless Chromium responsive viewports; physical Safari was not tested.
Page-error logs: none. No new regressions detected in the tested scope.

`npm run lint`, `npm run build`, `git diff --check`: PASS.
Gzip: JS 30.38 KiB / 31 KiB limit; CSS 24.90 KiB / 25 KiB limit.

## Screenshots

Native panel captures; header/notice hidden only during capture to avoid
obscuring the panel. The delivery date is live Shoptet data.

| Product | Desktop 1440                              | Mobile 375                               | Narrow fallback 320                      |
| ------- | ----------------------------------------- | ---------------------------------------- | ---------------------------------------- |
| 494606  | [Screenshot](screenshots/494606-1440.png) | [Screenshot](screenshots/494606-375.png) | [Screenshot](screenshots/494606-320.png) |
| 354068  | [Screenshot](screenshots/354068-1440.png) | [Screenshot](screenshots/354068-375.png) | [Screenshot](screenshots/354068-320.png) |

## Changed files

- `src/core/selectors.js` — three native selectors for the existing grid/blocks.
- `src/modules/product-compact/index.js` — one idempotent presentation wrapper.
- `src/styles/overrides/product-compact.css` — local columns, hierarchy and fallback.
- `dist/timber.min.css`, `dist/timber.min.css.map`, `dist/timber.min.js`,
  `dist/timber.min.js.map` — regenerated assets.
- `CHANGELOG.md`, this report, `verification.json`, `edge-cases.json`, six PNGs.
