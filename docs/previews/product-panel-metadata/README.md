# TimberStore — Panel Insets, Product Metadata and Variant Heading

2026-10-19. Existing branch `preview/product-detail-compact-pro-20261019`, based
on `0c24cffe315bd70a284834a2370f313f820425eb`. No merge, release/tag, production
loader change or production deployment. This includes the follow-up request
for the centred **VŠETKY VARIANTY** heading on every device.

## Changes

### Frame geometry

Keep the native info/gallery columns, actual variant cards, images, column
counts, card gaps and purchase-panel dimensions. Normal-flow padding balances
the content against Apollo's existing gutters; the existing decorative frame
extends into available surrounding space. Title, metadata, variant heading box,
card grid, purchase panel and bottom links still share their content edges.
No new negative margin, transform, card-width or gallery-width rule. The native
Apollo grid's existing negative gutters remain unchanged.

Actual left/right distances from content edge to the frame's outer border box:

| Width | Before left / right | After left / right |
| --- | --- | --- |
| 1440 | 5 / 5 px | **18 / 18 px** |
| 768 | 5 / 5 px | **15 / 15 px** |
| 430 | 10 / 10 px | **16 / 16 px** |
| 390 | 10 / 10 px | **16 / 16 px** |
| 375 | 10 / 10 px | **16 / 16 px** |
| 320 | 10 / 10 px | **16 / 16 px** |

Subtract the existing 1 px border for the clear inner distance. Top/bottom
padding uses the same frame-spacing token. Tablet uses 15 px rather than the
suggested 16: 737 px of unchanged cards plus 32 px would need 769 px at a
768 px viewport. At intermediate 480–767 widths the native gutter changes;
a local 12 px fallback keeps that range inside the viewport as well.

The underlying Apollo column's CSS padding compensates its gutters; it is
not itself the visible frame inset. Measurements above use rendered content
and pseudo-frame coordinates, not just the declared padding. At desktop the
frame also clears the unchanged visible gallery by 1 px. Both native gallery
column x/width and variant card/image sizes/relative positions are unchanged.

### Product codes and brand values

Computed native TULIP/AGOFORM brand blue at the reference revision is
**rgb(36, 84, 166), HEX #2454A6**. Reuse the existing shared `--ts-color-blue`;
no new palette or competing blue is introduced.

`KÓD:` and `ZNAČKA:` use neutral **#4A525E**, 12.5 px, weight 500, line-height
18.75 px. Native code/brand values use #2454A6, weight 600. No metadata badge,
border, coloured surface or code padding. Both detail metadata pairs keep
space-between and natural wrapping.

Extend the existing product-text-cleanup module and its existing observer;
no additional global observer or native event handler. Reuse native SKU and
brand-value spans, including microdata, attributes, link nodes and original
values. Existing code-label spans are reused; bare labels get one labelled
span. Updates re-query the structure rather than nesting wrappers or cloning
SKU nodes. Texts/selectors remain in core. Shared CSS is limited to explicitly
marked native product metadata, not arbitrary numbers or links.

Audited/applied coverage:

- Product detail, including Apollo's separate mobile header.
- Native product cards on category grids and desktop list view.
- Search results and brand product listings.
- Related/recommended product cards and homepage product sections.
- Existing clickable brand-name metadata; brand hrefs/value text preserved.

No new brand rows are added where cards do not expose one. Native image/logo
manufacturer links (including the homepage brand carousel), product-title
brand words, filter labels and social/carrier logos are not recoloured.
Cart/checkout presentation, order identifiers/data, invoices, exports, admin
texts, price/stock values and warehouse-stock remain outside this change.

### Variant heading

Native heading text becomes **VŠETKY VARIANTY**, without a colon. Reuse the
existing category-heading flex/pseudo-element rule: centred anonymous text,
equal flex side rules, 1 px #E5E0DA lines, **14 px gap** on both sides. The
same layout applies at desktop, tablet and mobile, with no device-specific
alternate design. Orange `--ts-color-accent` (#D4884A) and native bold weight
remain. Heading box spans the full unchanged card-grid width. Heading-to-card
visible box spacing is 15 px (native 5 px tile inset plus 10 px heading margin).
Cards, active state, hrefs and Show more are unchanged.

At 320 px both line segments measure ~49.30 px; at 1440 px ~178.80 px.
Left/right differences are at most 0.016 px from pixel rounding.

## Tests

[Raw before/after rectangles, computed styles and test results](verification.json).

| Product | 1440 | 768 | 430 | 390 | 375 | 320 | Native function checks |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 494606 TULIP Jota | PASS | PASS | PASS | PASS | PASS | PASS | +/−, delivery popup, add-to-cart/cart confirmation |
| 354068 AGOFORM Classico | PASS | PASS | PASS | PASS | PASS | PASS | +/−, popup, cart, Show more (layout fixture) |
| 544828 TULIP Boise O | PASS | PASS | PASS | PASS | PASS | PASS | +/−, popup, cart |
| 3204000193 WIRELI — stored native HTML | PASS | PASS | PASS | PASS | PASS | PASS | +/− only; live popup/cart unavailable |

WIRELI originally showed `3204000193` in its native value; the request's
`320400193` omits a zero. During final verification the old live product URL
started returning the native `id-404` not-found page. Searches for both codes,
WIRELI60V12 and the title did not identify a replacement. The WIRELI row and
screenshots explicitly use the earlier stored unenhanced native HTML with
current preview assets. They verify layout, not current live catalogue/stock.
No WIRELI data or replay is shipped, and the preview cannot restore a removed
catalogue product.

Additional checks:

- Category `/knopky/`: 40 code elements; all six widths without overflow,
  desktop list/grid switch with consistent 12.5 px / 600 blue code values.
- Search `544828`: unique result identified as TULIP Knopka Boise O tmavá zlatá
  brúsená, URL `/tulip-knopka-boise-o-tmava-zlata-matna/` (native URL spelling).
- Brand `/znacka/tulip/`: 30 code elements; homepage: 32; detail/related codes
  audited as well. Native SKU attributes and code values unchanged.
- Repeated native content events, changed alphanumeric SKU and native child
  replacement: same value span/microdata retained, one label, no nested spans.
- Frame/breakpoint probes at 360, 480, 600, 767, 992, 1199, 1200, 1366 and
  1920 px: no overflow; desktop frame does not overlap the visible gallery.
- Purchase panel width/height/computed surface styles, quantity/CTA dimensions
  and styles, price/unit styles, actual prices/net prices/stock/date text,
  title whole-word rules, form association and gallery geometry compared with
  baseline. Variant card/image dimensions, relative positions/gaps, active
  state and hrefs compared exactly. All pass.
- Lint, build, diff check pass. Gzip: JS **31,530 / 31,744 bytes**, CSS
  **25,599 / 25,600 bytes**. Existing budget limits were not raised. Removed
  superseded row-layout declarations while retaining rendered purchase geometry.

### Limits and regressions

No new implementation regressions detected. The live WIRELI not-found result
is a catalogue availability limitation independent of preview CSS/JS.
Chromium responsive viewports were used; physical Safari/iPhone not tested.
The friends.shopcode API is blocked by this environment's policy. TULIP card
checks use the eight-card reference replay; AGOFORM uses a ten-card mixed public
catalogue fixture to exercise geometry/expansion, not its actual variant
membership. For 544828 no addon variant data was available in this environment;
its native metadata/purchase layout and functions were tested. Live variant
stock/price response combinations cannot be fully exercised through the blocked
API. Original live API/navigation/native updates remain in preview, unchanged.

The three screenshots mentioned in the uploaded text were not present in the
message; implementation followed its written specification and the existing
preview/reference measurements.

## Screenshots

Fixed header/notices hidden only for frame captures; mobile header is separate
because native Apollo places the gallery between header and purchase content.
TULIP screenshots use reference variant replay. WIRELI screenshots use stored
native HTML, as explained above.

| Product | Desktop | Tablet | Mobile 430 | Mobile 375 | Mobile 320 |
| --- | --- | --- | --- | --- | --- |
| TULIP Jota | [Frame](screenshots/494606-1440.png) | [Frame](screenshots/494606-768.png) | [Frame](screenshots/494606-430.png) | [Frame](screenshots/494606-375.png), [header](screenshots/header-494606-375.png) | [Frame](screenshots/494606-320.png), [header](screenshots/header-494606-320.png) |
| WIRELI (stored HTML) | [Frame](screenshots/3204000193-1440.png) | [Frame](screenshots/3204000193-768.png) | [Frame](screenshots/3204000193-430.png) | [Frame](screenshots/3204000193-375.png), [header](screenshots/header-3204000193-375.png) | [Frame](screenshots/3204000193-320.png), [header](screenshots/header-3204000193-320.png) |

## Changed files

- `src/styles/overrides/product-compact.css` — frame spacing, mobile header
  alignment and variant-heading gap; remove superseded declarations.
- `src/styles/overrides/product-metadata.css` — shared scoped code/brand style.
- `src/styles/overrides/product-detail.css` — replace old detail-only metadata
  override with the shared presentation.
- `src/styles/overrides/subcategories.css` — share existing centred-heading rules.
- `src/modules/list-view/list-view.css` — keep code placement; use shared typography.
- `src/modules/product-text-cleanup/index.js` — idempotent label/class normalization
  through its existing AJAX observer, plus native variant-heading text.
- `src/core/selectors.js`, `src/core/texts.js` — centralized hooks/text.
- `src/styles/tokens.css`, `src/main.css` — frame tokens/shared CSS import.
- `dist/timber.min.{css,js}` and maps — generated assets.
- `CHANGELOG.md`, this README, `verification.json`, `screenshots/*.png` — evidence.

Preview uses this report's commit SHA as `ts_preview`; production loader/tag
remains unchanged.
