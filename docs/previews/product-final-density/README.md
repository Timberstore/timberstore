# TimberStore — Final Density and Code Typography

2026-10-19. Same branch `preview/product-detail-compact-pro-20261019`.
Reference: `8020ed891254d33d2f02fe7e946bddd90448d205` (working purchase panel and
blue/variant alignment). Preview only: no merge, release/tag, production loader
change or production deployment.

## Result

Code has no border, background, shadow or padding. The native code-label span
remains #4A525E, matching the brand label; only native code/brand values use
#2454A6. Both labels use 12.5 px / 500 / 18.75 px line-height, values weight 600.
Native HTML, code values, links, identifiers and data attributes remain intact.

Right-panel children use normal flex alignment against the unchanged native
card grid. Apollo's separate mobile/tablet header uses grid centring, with the
same existing gutter token. Title, metadata, short description and bottom links
follow card/purchase-panel edges without resizing cards, adding negative
margins/transforms or changing main gallery/info column widths. Existing Apollo
grid gutters are retained. Outer frame width and symmetric horizontal padding
are retained; only its top/bottom padding changes from 16 to 12 px.

Removed accumulated margins around the variant section and below the short
description, rather than changing the purchase panel or card internals. Prices,
availability, dates, delivery popup, quantity and CTA styles/functions stay native.
No JS, DOM wrapping, new handlers or warehouse-stock changes.

## Measured results

`getBoundingClientRect()` comparisons against the reference, after fonts and
images load. Distances are between rendered element boxes, including native
card tile insets; they are not merely declared CSS gaps.

| Adjacent content | Before | After |
| --- | --- | --- |
| Desktop title → metadata | 16 px | 8 px |
| Mobile title → metadata | 15 px | 8 px |
| Tablet 768 title → metadata | 25 px | 8 px |
| Desktop metadata → variant heading | 24 px | 12 px |
| Variant heading → first visible card | 15 px | 11 px |
| TULIP last visible card → purchase panel | 49 px | 14 px |
| Variant section outer box → purchase panel | 44 px | 9 px |
| Purchase panel → bottom links wrapper | 24 px | 12 px |
| Short-description block → purchase grid (WIRELI) | 20 px plus paragraph margin | 12 px, paragraph bottom margin 0 |

On mobile, the gallery remains between header metadata and variant/purchase
content. That intervening gallery height is not reported as removable whitespace.
AGOFORM at narrow widths retains its existing Show more button and its own
margins: last visible card → panel includes that button (113 → 78 px at 320).
No button/card gaps or card/image dimensions were changed.

After alignment, visible title/metadata left edges equal the panel/card left
edge at all six widths. Metadata/links right edges also match the panel; the
existing percentage-card rounding leaves <0.1 px at the rightmost card edge.
Desktop headline was formerly inset 15 px per side, mobile header 10 px and
tablet header 15 px. All now follow the established card/panel edges.

[Full before/after measurements and assertions](verification.json).

## Tests

| Product | 1440 | 768 | 430 | 390 | 375 | 320 |
| --- | --- | --- | --- | --- | --- | --- |
| 494606 TULIP, 8 reference cards | PASS | PASS | PASS | PASS | PASS | PASS |
| 354068 AGOFORM, 10-card layout fixture | PASS | PASS | PASS | PASS | PASS | PASS |
| 3204000193 WIRELI, no image cards | PASS | PASS | PASS | PASS | PASS | PASS |

Actual WIRELI SKU is `3204000193`; the earlier supplied `320400193` omits a zero.

Compared exact card/image sizes, relative card positions/gaps, active state,
variant hrefs, gallery x/width/links, native form association, purchase-panel
width/height/computed styles, price/unit styles and current native values,
quantity/CTA dimensions/styles, code/brand HTML, whole-word title settings.
No page overflow at any tested width. Native quantity +/−, delivery popup,
AGOFORM Show more, and actual add-to-cart followed by cart-page confirmation
were checked. No order was placed. No new regressions detected.

Lint, build and diff check pass. JS bundle is byte-identical to reference.
Build stays within 25 KiB CSS / 31 KiB JS gzip limits.

### Limits

Chromium responsive viewports; physical iPhone/Safari not tested. The live
friends.shopcode API is blocked by environment network policy. Variant checks
use the unchanged addon with an 8-card public TULIP reference and a 10-card
public catalogue layout fixture for AGOFORM. The latter contains mixed catalogue
products: it verifies geometry/expansion, not actual AGOFORM variant membership.
Replay data is browser-test-only and is not shipped. Live preview retains the
original API, navigation and native dynamic updates. Current native prices and
availability were compared; all possible live variant-price/stock responses
could not be exercised through the blocked API.

Screenshots show TULIP reference replay and actual WIRELI without cards. Fixed
header/notices are hidden for frame captures only. Mobile native header is
captured separately because the gallery is between header and purchase content.

## Screenshots

| Product | Desktop | Mobile 375 | Mobile 320 |
| --- | --- | --- | --- |
| TULIP | [Frame](screenshots/494606-1440.png) | [Frame](screenshots/494606-375.png), [header](screenshots/header-494606-375.png) | [Frame](screenshots/494606-320.png), [header](screenshots/header-494606-320.png) |
| WIRELI | [Frame](screenshots/3204000193-1440.png) | [Frame](screenshots/3204000193-375.png), [header](screenshots/header-3204000193-375.png) | [Frame](screenshots/3204000193-320.png), [header](screenshots/header-3204000193-320.png) |

## Changed files

- `src/styles/overrides/product-compact.css` — scoped presentation only.
- `dist/timber.min.css`, `dist/timber.min.css.map` — generated CSS assets.
- `CHANGELOG.md` — preview entry.
- This README, `verification.json` and `screenshots/*.png` — review evidence.

Preview URL uses the revision containing this report as `ts_preview`; production
loader and release tags remain unchanged.
