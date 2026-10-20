# Product Detail — Final Price / Purchase Panel

2026-10-19. Same branch `preview/product-detail-compact-pro-20261019`, base
`035dc7d685488b56b7e4cf3e3334045a4fb42ccd`. Preview only; no merge, release/tag,
production loader change or production deployment.

## Changes

- Native delivery label/link use `text-transform: none`, 14 px / 500 / 19 px,
  matching availability typography. Original title-case Shoptet text and link
  node/href remain; green delivery date remains dynamic.
- The native `Cena` label receives the existing `.sr-only` helper. It is absent
  from visible layout while retained for screen readers: absolute, clipped,
  1×1 px, not `display:none` and not `aria-hidden`.
- Price and net price share the centre of the right column. The group also
  centres vertically against the left information. Native main price remains
  28 px / 35 px; units ~16 px / 600, net price 13 px with existing parentheses.
- One `.ts-product-purchase-panel` groups the existing information presentation
  and existing `.add-to-cart`. Surface #F8FAFC, 1 px #DDE4ED border, radius 14 px,
  no shadow/internal divider. Padding 16 px desktop/tablet, 12 px mobile, 10 px
  below 375 px. Colours are tokens scoped to product detail, not a global palette
  change. Redundant earlier detail declarations were consolidated to stay within
  the existing CSS budget.
- Equal flexible columns grow from intrinsic minimum widths instead of forcing
  each to occupy 50% before wrapping. They stay beside each other through 375 px
  on all three products; 320 px safely stacks a centred price below the left
  information. Long prices can also cause this natural fallback.

## Form / native integrity

Apollo publishes the price/availability grid and quantity/CTA as descendants of
`#product-detail-form`. The new surface is a div inside that same grid/form; it
never wraps a form, creates another form, or moves nodes into a different form.
Grouping is guarded by equality of the original native form ancestors. Native
nodes and their existing event handlers are moved, never cloned.

The existing observer groups native replacements idempotently and re-applies
`.sr-only` to a replaced price label. Exactly one panel, information wrapper,
quantity control and native form remain. Price/stock/date calculations, hidden
form inputs, event names, popup markup and warehouse project are unchanged.
The variant section stays outside the panel; original variant/image geometry,
links, ordering and active marker are retained. Description/contact links stay
outside the panel.

Quantity remains 100×36 px with its existing mini-cart styling. CTA retains
native behaviour and its existing height, font, padding, colours, radius and
icon. Its responsive width follows the panel's narrower content area, and the
existing flex rule moves it below quantity when needed. No button or input font
is shrunk to force it into one row. A 24 px information-to-purchase gap remains.

## Verification

[All before/after rectangles, computed styles and native checks](verification.json).
[Variant replays, native-node recovery and long-price cases](edge-cases.json).

| Product           | 1440      | 768       | 430       | 390       | 375       | 320        |
| ----------------- | --------- | --------- | --------- | --------- | --------- | ---------- |
| TULIP 494606      | 2 columns | 2 columns | 2 columns | 2 columns | 2 columns | Safe stack |
| WIRELI 3204000193 | 2 columns | 2 columns | 2 columns | 2 columns | 2 columns | Safe stack |
| AGOFORM 354068    | 2 columns | 2 columns | 2 columns | 2 columns | 2 columns | Safe stack |

**WIRELI identifier:** request says `320400193`; the exact requested product name
resolves to `/zdroj-napatia-12v-60w-5a-ip20-wireli-typ-wireli60v12/`, whose native
SKU metadata is **3204000193**. This product was tested. It has no image variant
cards and retains its actual `Centrálny sklad` status and its own delivery date;
neither was replaced by the TULIP example's stock/date.

All 18 product/viewport combinations passed: no page overflow; centred main/net
price; no visible price heading; correct title case/typography; date green;
one form/panel; same original form association for price and cart. Native values,
input min/max/step/name, gallery links and title/code/brand/contact presentation
matched baseline. Quantity dimensions and CTA height/styles matched; CTA width
adapts to the authorized panel padding.

For all three actual products at 320 px: native +/− 1 → 2 → 1, typed amount
3 → 1, delivery-popup opening/closing without overflow, and add-to-cart confirmed
on `/kosik/`: PASS. No order placed.

Additional checks:

- Native addon replay with 8 TULIP cards and 10 AGOFORM cards at six widths:
  baseline card/image dimensions, order, links and active state identical; no
  card entered the panel. Context screenshots show variants above the panel.
- Replaced price block and rebuilt panel: original cart/input/form identities
  and a bound QA listener survived; one wrapper/panel; replaced price label
  hidden again. Native +/− still worked after regrouping. Updated net-price
  suffix normalization passed. Repeated native initialization caused no duplicates.
- 24 long gross/net price cases: `1 234 567,89 €`, `1 020 304,12 €`, units
  `ks`, `pár`, `m`, `sada` at six widths. No overlap/overflow; price/net centres
  remained aligned and fallback handled insufficient width.

No page JavaScript errors or new regressions detected in these checks.
`npm run lint`, `npm run build`, `git diff --check`: PASS.
Gzip: JS 30.48 KiB / 31 KiB; CSS 24.94 KiB / 25 KiB.

Tests use Chromium responsive viewports; physical Safari was not tested. Live
friends.shopcode requests are excluded by environment network policy. Variant
checks/context screenshots use the unchanged addon with public catalogue data
replayed locally (8-card reference for TULIP; 10-card layout fixture for AGOFORM),
not a revalidation of the live external API. Normal panel captures and WIRELI
are taken from the actual product pages without synthetic price/stock values.

## Screenshots

Panel-only captures show final live values; header/notice hidden only during
capture. Additional context captures include the variant replay above the panel.

| Product                 | Desktop 1440                                                                           | Mobile 375                                                                           | Narrow mobile 320                       |
| ----------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | --------------------------------------- |
| TULIP with variants     | [Panel](screenshots/494606-1440.png) · [Context](screenshots/494606-variants-1440.png) | [Panel](screenshots/494606-375.png) · [Context](screenshots/494606-variants-375.png) | [Panel](screenshots/494606-320.png)     |
| WIRELI without variants | [Panel](screenshots/3204000193-1440.png)                                               | [Panel](screenshots/3204000193-375.png)                                              | [Panel](screenshots/3204000193-320.png) |
| AGOFORM with variants   | [Panel](screenshots/354068-1440.png) · [Context](screenshots/354068-variants-1440.png) | [Panel](screenshots/354068-375.png) · [Context](screenshots/354068-variants-375.png) | [Panel](screenshots/354068-320.png)     |

## Changed files

- `src/modules/product-compact/index.js` — accessible price label and same-form
  purchase panel grouping/recovery.
- `src/core/selectors.js` — two native presentation selectors.
- `src/styles/overrides/product-compact.css` — scoped panel, centring, title case,
  responsive intrinsic columns; consolidate existing duplicate declarations.
- `src/styles/tokens.css` — two detail-scoped panel colours.
- `dist/timber.min.css`, `dist/timber.min.css.map`, `dist/timber.min.js`,
  `dist/timber.min.js.map` — generated assets.
- `CHANGELOG.md`; this report, two verification JSON files and 13 screenshots.
