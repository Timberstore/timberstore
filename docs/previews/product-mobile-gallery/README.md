# TimberStore — Mobile Overflow, Gallery Controls and Product Frame

2026-10-19. Existing branch `preview/product-detail-compact-pro-20261019`;
reference `3f75af6160504478509f3bb6a2b40169c9a789ce`. Preview only. No merge,
release/tag, production loader change or production deployment.

## Critical mobile fix — measured cause

The previous frame extended farther than the real mobile viewport. Its generous
insets were fitted using desktop viewport resizing, which missed the behaviour
of a mobile layout viewport. In actual mobile emulation Chrome expanded
`innerWidth` to fit the overflowing content, also widening fixed header bars.
Consequently, `scrollWidth <= innerWidth` alone passed even with a shifted header.
The new tests additionally require `innerWidth === requested device width`,
`clientWidth === requested width`, header/frame bounds within that width, and
matching header rectangles on detail/category/homepage.

Representative TULIP/Boise results (all four products reproduce the same issue):

| Requested mobile width | Before innerWidth / scrollWidth / header width | After all three |
| --- | --- | --- |
| 320 | 332 / 332 / 332 px | **320 px** |
| 360 | 373 / 373 / 373 px | **360 px** |
| 375 | 388 / 388 / 388 px | **375 px** |
| 390 | 402 / 402 / 402 px | **390 px** |
| 430 | 443 / 443 / 443 px | **430 px** |

At requested 390 px, `html` and `body` boxes themselves were 390 px wide,
but the old info-frame pseudo-element reached **x=402**. The fixed header then
measured 402 px too. The old variant `.inner` reached x=391 and some `.friend`
columns x≈390.97. After removing the content shift, those native gutters remain
inside the viewport and the new frame spans **x=0…390**.

### Outliers: real page overflow versus clipped slider contents

| Element at requested 390 px | Before | After / classification |
| --- | --- | --- |
| Old `.p-info-wrapper::before` frame | x=0…402 | Removed from header/root; bounded body frame x=0…390 |
| `#header`, `.top-navigation-bar` | x=0…402 | x=0…390, same as category/homepage |
| `.friendsSection .inner` | x=11…391 | Native gutters remain; shifted content reset, no page overflow |
| `.friend` end columns | right≈390.97 | Inside viewport without resizing cards |
| `.p-thumbnails-inner` | right≈140006 | Intentionally large native track inside `overflow:hidden` thumbnail window; retained |
| Offscreen thumbnail anchors | right≈462 | Clipped by native thumbnail window; retained |
| Related-product carousel cards | right≈470 | Clipped by native `.p-switchable`; retained |
| Native off-canvas navigation | positioned beyond visible header | Intentional fixed menu; not the detail overflow source |

[Raw rectangles, outlier lists, computed styles and test evidence](verification.json).
No new `overflow-x:hidden`/`clip` on HTML/body, global header change, transform,
negative-margin workaround or thumbnail-track width reset. Only the panel frame
spacing/content alignment is corrected. Existing gallery/related slider clipping
and native grid gutters remain untouched.

The safe frame-to-content inset is now 10 px at 320–430, 5 px at 480–767 and
8 px at tablet widths. This deliberately gives priority to the real viewport
and unchanged card dimensions over the former larger mobile frame padding.
Desktop retains the previous 18 px frame inset and native column/photo widths.

## Frame starts below title, code and brand

One idempotent `.ts-product-detail-panel` presentation body groups the existing
native grid and bottom links inside the original product form. The existing
headline/metadata (and short description where present) remain outside that
body. Apollo's separate mobile header stays in its native location above the
gallery. No native price, availability, quantity, button or variant node is
cloned. Existing event listeners, form association, values and attributes remain.
The existing observer reuses the wrapper after native child replacement.

The visible frame now starts at `VŠETKY VARIANTY` when variants are available,
otherwise at the purchase body. It includes the cards, existing purchase panel,
Detailné informácie / Opýtať sa / Strážiť. Title/code/brand are outside both its
DOM subtree and painted border. Code/brand typography and #2454A6 blue are
unchanged. Whole-word title wrapping remains; visible title size is unchanged.

## Gallery and variant refinements

- Main photograph and native gallery column retain exact width/height. The
  desktop thumbnail window reserves **36 px** of space at the right; native
  thumbnail sizes, slider track, arrow handlers and lightbox remain intact.
  This moves the right control away from the frame without narrowing the photo.
  At 1440 px the control/frame clearance changes **−14 → +22 px**. The unchanged
  main photo bounding edge remains 1 px from the frame; spacing is added around
  the thumbnail controls where the visible collision occurred.
- Arrow circles retain their native 30 px size/100% radius. Default: white circle,
  #D4884A orange glyph. Hover: #D4884A circle, white glyph, no size change.
- Desktop variant rows use the native wrapping flex grid with `justify-content:
  center`. Full rows keep their geometry; partial rows (including the two-card
  FRANKE example) centre without changing card widths, images or gaps.
- At desktop only, variant-section bottom spacing grows by **12 px**. For TULIP
  and FRANKE, last card → purchase panel changes **14 → 26 px**. Mobile/tablet
  section spacing stays unchanged. AGOFORM's native Show more region is retained.
- Active variant confirmation circle is availability green **#00C853**, with the
  original white check glyph. Native orange card border, circle size, card order,
  images and navigation are unchanged.
- Reuse the centred orange VŠETKY VARIANTY heading and equal side rules from the
  previous preview; no heading/card sizing change.

## Tests

The mobile profile uses touch/mobile layout emulation, not just a narrowed
desktop window. Each reference/detail was opened at the same requested width.
Header assertions compare visible logo area, responsive controls/cart group,
search field, whole header and left/right bounds with both category and home.

| Product | 320 | 360 | 375 | 390 | 430 | Tablet 768 | Desktop 1440 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 544828 TULIP Boise O tmavá zlatá brúsená | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| 494606 TULIP Jota zlatá matná | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| 477822 FRANKE BFG 611 970×500 čierna matná | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| 354068 AGOFORM Classico | PASS | PASS | PASS | PASS | PASS | PASS | PASS |

Also checked 480 px mobile and 768 px in both mobile and desktop profiles:
**36 product/viewport comparisons**. Exact comparisons preserve native main
photo/gallery and card/image width/height, card hrefs/active state, purchase-panel
size/surface style, quantity/CTA size/style, price/net/unit styles and values,
availability/date text, code/brand styles and original form association. Last
partial-row centres and 10 px inter-card gaps are measured at desktop.

Native interaction checks on all four products at 390 px:

- Tap main image to open lightbox, switch lightbox image and close.
- Switch thumbnail/main image.
- Quantity +/−, delivery popup open/close, actual add-to-cart and product
  confirmation on native cart page. No checkout order was placed.
- AGOFORM mobile Show more expands to 10 cards.
- Replace availability DOM as a native-update simulation: one body wrapper,
  one purchase panel, native availability re-grouped once.

Desktop additionally checks actual arrow hover colours/circle dimensions,
thumbnail next/previous track movement/restoration, and real navigation through
a non-active variant link. No new JavaScript errors in these checks.
Lint, build and diff check pass; existing 31 KiB JS / 25 KiB CSS gzip limits
are retained. No pricing, delivery, stock, cart/checkout or warehouse-stock code
was changed. Removed superseded/inert presentation declarations to retain the
CSS budget; purchase appearance was compared exactly.

### Known limitations / existing behaviour

No new implementation regressions detected. Physical iPhone/Safari was not
available; measurements use Chromium mobile/touch emulation.

The environment blocks the live friends.shopcode API. Tests use the native addon
with browser-only reference data: TULIP eight-card reference; FRANKE two public
product references (black matte and onyx); AGOFORM ten-card mixed catalogue
layout fixture. These verify geometry, states, expansion and links, not live
catalogue variant membership. Boise native purchase/gallery were tested without
addon variant data. No fixture is shipped, and preview retains the original live
API and handlers. All possible live variant-price/stock responses remain outside
this test environment's coverage.

A **separate pre-existing Apollo breakpoint behaviour** was reproduced on both
detail and the reference category: loading at ≥768 px then resizing below it
without reloading may omit the native mobile cart clone. Apollo's
`repositionCartCountMobile()` uses its initially captured width; this is not
caused by the product frame and does not create page overflow. Per the request,
the functioning global header was not rewritten. Fresh opening at each tested
mobile width has the complete, geometrically identical header. This limitation
is recorded separately from the fixed detail-specific horizontal overflow.

## Screenshots

Whole product area including the visible header is captured. Cookies/native
information toast are dismissed through their existing controls for capture.
No header elements are hidden or resized for screenshots.

| Product | Desktop | Mobile 390 | Mobile 430 / 320 |
| --- | --- | --- | --- |
| TULIP Jota — 8 reference variants | [1440](screenshots/494606-1440.png) | [390](screenshots/494606-390.png) | [430](screenshots/494606-430.png) |
| FRANKE — 2 reference variants | [1440](screenshots/477822-1440.png) | [390](screenshots/477822-390.png) | [430](screenshots/477822-430.png) |
| TULIP Boise — critical mobile example | [1440](screenshots/544828-1440.png) | [390](screenshots/544828-390.png) | [320](screenshots/544828-320.png) |

## Changed files

- `src/modules/product-compact/index.js` — one idempotent body wrapper around
  existing grid/links inside the native form; shipping changes are formatting only.
- `src/styles/overrides/product-compact.css` — bounded frame/header separation,
  desktop thumbnail-control clearance, arrow colours, variant centring/gap/marker.
- `src/styles/tokens.css` — safe default frame spacing; remove obsolete shift token.
- `dist/timber.min.{js,css}` and maps — generated assets.
- `CHANGELOG.md`, this README, `verification.json`, `screenshots/*.png` — evidence.

Preview uses the commit containing this report as `ts_preview`; release tags and
production loader remain unchanged.
