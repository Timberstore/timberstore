# Product Detail UI & Gallery Final Refinement

2026-10-19. Existing branch `preview/product-detail-compact-pro-20261019`.
Reference: `a708ba78d9fbca748f67151d8fc69aa83b445e59`. Preview only: no merge,
tag, release, production loader change or production deployment.

## Changes

- Centre the existing desktop H1 and Apollo's separate mobile/tablet headline.
  CSS uppercase changes presentation, retaining native product text/data, font
  size and weight. Whole-word wrapping is shared with catalogue, search,
  homepage and related-product titles. Cart, checkout, mini-cart and modal
  product suggestions are excluded by the presentation scope.
- Centre native code/brand as one wrapping flex group. Neutral labels and blue
  values (#2454A6) retain their 12.5 px typography. The brand's subtle left border
  creates a divider, with 16 px on either side. It remains attached to the brand
  when metadata wraps, never a separate orphan flex item. No duplicate metadata.
- Keep VŠETKY VARIANTY centred/orange; remove both pseudo-element rules, including
  native ones. Keep its existing 10 px bottom margin and native padding.
- Colour only the native chat/watchdog icon pseudo-elements #D4884A. Labels,
  link positions and native popup handlers remain intact.
- Centre native variant flex rows at every breakpoint. Card/image dimensions,
  gaps, columns, ordering and active styling remain unchanged. On mobile the
  existing blue expansion button takes a separate flex row: otherwise it occupies
  a card slot and prevents the last incomplete row from centring. Its handler
  and text are unchanged; no placeholder cards or manual positioning.
- Mobile submenu lists use the existing soft orange token
  `--ts-color-controls-active-bg` (#FFF8F1). Main navigation, contacts, social
  links, native arrow toggles and the scrollable `.navigation-in` are retained.

The title, grouped metadata and variant heading share the same horizontal axis.
No gallery/purchase-box position changes were made to obtain centring. Native
purchase rules were consolidated to stay inside the existing build budgets.

## Gallery identification and mouse support

This main gallery is **Shoptet's native main-photo/thumbnail gallery**, with
**jQuery CloudZoom** (`jQuery.fn.CloudZoom` present) and **Colorbox** for enlargement.
Its thumbnail track is `.p-thumbnails-inner`, moved by native `style.left/top`
and the existing arrow handlers. Apollo also loads Swiper for other carousels;
this main gallery has no Swiper drag option to activate.

The existing `gallery-swipe` and shared `bindSwipe` modules now opt into mouse
input for both the photo wrapper and thumbnail strip. Release after a horizontal
movement of at least 40 px selects the adjacent native thumbnail, then uses the
existing arrow/reveal/preload logic. It stops at either end. It does not replace
CloudZoom, Colorbox, images, controls or the gallery DOM.

Pointer capture starts after 10 px (or on leaving the wrapper during a fast drag); a real drag suppresses its trusted follow-up
click. Programmatic thumbnail clicks still reach Shoptet, including those made by
the gesture itself. Native image dragging is prevented. Mouse movement is kept
away from the zoom layer during a drag; ordinary hover/click zoom remains native.
The original touch/pen path is retained, mouse support is opt-in, and the existing
per-element initialization guard prevents duplicate listeners after AJAX events.

## Verification

Chromium desktop and real mobile emulation (`isMobile`, touch and mobile user
agent), freshly loaded at each viewport:

- **35/35 before/after comparisons**: 494606, 544828, 481617, 477822 (FRANKE),
  354068 × 1440, 1280, 768, 430, 390, 375 and 320 px.
- Native title text/font-size/font-weight/line-height retained. Centred title,
  grouped metadata and heading; no heading side rules. Gallery/card image sizes,
  card sizes and purchase dimensions/styles/text compared against the reference.
- Every visible card row centred, including FRANKE's two cards and AGOFORM's
  incomplete last row. Native expansion reveals all ten fixture cards.
- At every mobile width: `innerWidth === requested width`, `clientWidth ===
  requested width`, `scrollWidth <= requested width`. No global overflow hiding.
- Four live products: native thumbnails, lightbox opening/next/close, quantity
  plus/minus, delivery popup, add-to-cart and confirmation on native cart page;
  availability DOM replacement retains one purchase panel and one detail body.
- Mouse drag both directions on photo/strip, fast movement, boundaries, 20 px
  movement (no navigation or lightbox), 5 px movement and ordinary click
  (lightbox preserved). Three repeated Shoptet content events still produce
  exactly one photo step per gesture. No page errors in these tests.
- Real touch gestures both directions and menu open/close at 320/375/390/430 px.
  Native menu scroll containers remain `overflow-y:auto` with scrollable content.
  Repeated category toggles and nested submenu colours verified.
- Uppercase/whole-word styles checked on 30 category, 24 search, 32 homepage and
  7 related product titles. Cart product-title styles match the reference exactly.
- `npm run build`, `npm run lint`, `git diff --check`: pass. Gzip CSS **25,600 /
  25,600 bytes**, JS **31,687 / 31,744 bytes**; no budget/version changes.

Measured common centre axes for Jota (CSS pixels):

| Viewport | Title box centre | Metadata content centre | Variant heading centre |
| --- | ---: | ---: | ---: |
| 1440 | 1148.5 | 1148.492 | 1148.5 |
| 1280 | 1008.5 | 1008.492 | 1008.5 |
| 768 | 384 | 383.992 | 384 |
| 430 | 215 | 215 | 215 |
| 390 | 195 | 195 | 195 |
| 375 | 187.5 | 187.492 | 187.5 |
| 320 | 160 | 159.992 | 160 |

Title typography remains 32 px/700 on desktop and the tested 768 px tablet,
24 px/700 on the tested small mobiles. Raw measurements and interaction outcomes
are in [verification.json](verification.json).

## Regressions found and corrected

The comparison detected a specificity conflict while consolidating CSS; native
card/purchase widths, CTA height and title size changed. Original high-specificity
purchase/title selectors were restored. It also detected an extra 10 px in the
FRANKE purchase panel at 320 px; restoring the existing main-price margin reset
resolved it. The final complete matrix passes all 35 scenarios.

The thumbnail gesture initially suppressed its own synthetic selection click;
trusted-click discrimination fixes it. Incomplete mobile rows initially remained
left-aligned because the expansion button occupied their final slot; the button
now has its own row. No outstanding introduced regression was found in the tested
scenarios.

## Evidence and limitations

The environment blocks `friends.shopcode.cz`. Variant layout/navigation tests use
browser-only response replay: Jota's eight reference cards and FRANKE's two public
alternatives. AGOFORM's ten-card fixture includes mixed catalogue examples and
is **a layout stress test, not verified production variant membership**. It is not
shipped or used to replace store data. Live membership remains unverified here.
Boise/BLUM also exercise the empty-variant state; this does not establish that the
production addon assigns no variants to those products.

Screenshots show native storefront pages with the preview bundle and the above
qualified replay. They do not prove unrestricted live addon access. Real iOS/Safari
was not available. The existing Apollo header-cart limitation when resizing an
already loaded page across 768 px without reloading is unchanged; it also occurs
on category pages. Fresh-page mobile geometry passes.

- [Jota desktop](images/tulip-desktop.png) · [Jota mobile 390](images/tulip-mobile.png)
- [BLUM long title / empty-variant state desktop](images/blum-desktop.png) ·
  [mobile 390](images/blum-mobile.png)
- [FRANKE desktop](images/franke-desktop.png) · [mobile 390](images/franke-mobile.png)
- [Expanded mobile menu](images/menu-mobile.png)

## Changed files

- `src/core/swipe.js` — opt-in mouse gestures and trusted-click suppression.
- `src/modules/gallery-swipe/index.js` — native photo selection shared with strip.
- `src/styles/overrides/product-compact.css` — title/metadata centring, divider,
  icons, variant centring/expansion row; consolidate existing purchase rules.
- `src/styles/overrides/product-card.css` — scoped uppercase/whole-word presentation.
- `src/styles/overrides/subcategories.css` — remove detail-only side-rule sharing;
  category heading design remains intact.
- `src/styles/overrides/navigation.css` — subtle mobile submenu background.
- `dist/timber.min.css`, `dist/timber.min.css.map`, `dist/timber.min.js`,
  `dist/timber.min.js.map` — rebuilt preview assets.
- `CHANGELOG.md` and this report, measurements and screenshots.

Use the immutable commit SHA supplied with the delivery in `?ts_preview=SHA`.
Everything stays on the existing preview branch. Production is unchanged.
