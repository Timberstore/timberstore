# Product Price, Stock and Feed-Case Polish

2026-10-19. Existing preview branch `preview/product-detail-compact-pro-20261019`.
Reference: `4dbaf85118c0fe58f2fcf0b38bdfe4da808a4bb1`. No merge, release/tag,
production loader change or production deployment.

## Final changes

1. **Original product-name case restored.** Remove forced uppercase from product
   presentation. Detail and catalogue/search/related titles show their native
   Shoptet text, including the original feed's capitalisation. Centring, font size,
   weight and whole-word wrapping remain. Feed/database/import data is not edited.
   VŠETKY VARIANTY and code/brand styling remain unchanged.
2. **Desktop header separation.** The native right-hand headline's bottom margin
   increases from 12 to 24 px. This headline is visible only in Apollo's desktop
   layout (1200 px and above). The separate mobile/tablet headline is untouched;
   measured spacing at 768/430/390/320 remains unchanged. The gap is outside the
   framed purchasing body, not extra purchase-panel padding.
3. **Balanced CTA.** Keep native quantity controls and CTA height, padding, radius,
   colour and handlers. Allow the CTA to fill available row width, rather than
   cap its desktop width at 330 px. Use a 24 px desktop/tablet gap and 8 px button
   end margin; mobile uses a 16 px gap and 4 px end margin. Together with existing
   panel padding these balance the quantity gap against the right inner border.
   At 320 px native wrapping remains safe; its row-gap increase adds 2 px to the
   panel, without changing the button's height.
4. **Blue amount only.** Wrap the first native numeric amount in
   `.ts-price-number`, using the existing text-cleanup observer. No parsing,
   arithmetic, price IDs, currency strings, VAT or unit data are changed. The span
   uses `display:contents` so Apollo's flex price row keeps its original text-run
   width, spaces and unit position. Only its text is #2454A6, the existing code/
   brand blue. The guard prevents duplicate/nested amount wrappers and prevents
   a numeric unit such as `/ 1 ks` being coloured. Child replacements and
   character-data updates are observed. Catalogue, search, related cards and
   Apollo's relocated desktop homepage cards use the same presentation scope;
   ordering pages, mini-cart and Colorbox recommendations remain excluded.
5. **Mobile stock rows.** At widths below 768 px, reuse native product-card Flexbox:
   column direction, centred items, no wrapping within the warehouse name.
   SKLADOM or CENTRÁLNY SKLAD is above its quantity. Native colours, fonts,
   availability values and warehouse logic remain; desktop/tablet stock layout
   is unchanged. No warehouse DOM or data source is added.
6. **KOMPLET.** Override only the verified native `.flag-komplet` inline background
   with the existing #D4884A accent. Native white text, size, shape and image
   position remain, on both detail and cards.

## Measurements

Jota 494606; distances include the 1 px purchase-panel outer border:

| Width | Quantity → CTA, before / after | CTA → panel right, before / after | CTA width, before / after |
| --- | ---: | ---: | ---: |
| 1440 | 22 / 24 px | 75 / 25 px | 330 / 378 px |
| 768 | 22 / 24 px | 268 / 25 px | 330 / 571 px |
| 430 | 14 / 16 px | 13 / 17 px | 270 / 264 px |
| 390 | 14 / 16 px | 13 / 17 px | 230 / 224 px |
| 320 | wrapped / wrapped | 11 / 15 px | 278 / 274 px |

The useful inner-edge distances are therefore 24 / 24 px on desktop and
16 / 16 px on the tested 390/430 px mobiles. CTA height remains 48.391 px.
Metadata-to-body spacing is 12 → 24 px at 1440. No mobile/tablet header-gap change.

At 390 px, the stock block's centre is x=102.5 px for both sample cards. Rendered
label/count text centres are 102.500 / 102.492 px for SKLADOM and 102.492 / 102.500 px
for CENTRÁLNY SKLAD. The latter stays on one 18 px line; quantity is below it.

## Verification

- **10 detail comparisons**: Jota 494606 and K-BLUM LEGRABOX 499061 at
  1440, 768, 430, 390 and 320 px; desktop and real mobile Chromium emulation.
  Compare native gallery/card image geometry, active marker, title metrics,
  quantity controls, VAT-exclusive price, delivery text/styles and CTA height.
  Product-name wrapping may naturally differ when original case is restored.
- **10 card comparisons** at the same widths: 494606 SKLADOM and 499061
  CENTRÁLNY SKLAD (47 SADA), including the KOMPLET flag. Price dimensions,
  currency/unit styling, VAT-exclusive price, card widths and flag geometry remain.
  Both warehouse labels/counts centre separately, quantity sits below the label,
  and CENTRÁLNY SKLAD remains on one line. Desktop/tablet stock geometry matches
  the reference.
- All tested mobile pages meet `innerWidth === requested width` and
  `documentElement.scrollWidth <= requested width`, including the extra 320 px
  fallback check. No global overflow hiding.
- Original-case checks on desktop/mobile detail, category, search and homepage:
  visible title text matches native DOM text; no forced uppercase. The desktop
  homepage moves product groups outside `#content`; tests inspect those native
  groups too. All 32 desktop homepage price amounts use the shared blue styling.
  All 32 mobile homepage stock blocks retain native Flexbox and centre correctly.
- Price DOM update tests: 12 345,67 € / sada, zero € / pár, `od 86,72 € / m`,
  and raw `/ 1 ks`. Currency, prefix and units retain their original colour.
  Character-data updates, three repeated Shoptet content events, no duplicate or
  nested spans, and unchanged native form/input identities/values all pass.
  These are presentation tests; they do not replace or simulate tax calculations.
- Both requested products: native thumbnail selection, lightbox open/next/close,
  quantity plus/minus, delivery popup, add-to-cart and native cart confirmation.
  Stock DOM replacement retains one detail body and one purchase panel.
- Gallery regressions: mouse drags both ways, small movement/click, first/last
  boundaries, fast drag outside the photo and repeated initialization pass.
  Native touch gestures and menu geometry pass at 320/375/390/430 px.
- Cart/mini-cart/Colorbox have no amount wrappers; native cart title styles match
  the reference. No cart/checkout module changes.
- Build, lint and `git diff --check` pass. Existing limits stay unchanged:
  CSS **25,599 / 25,600 bytes** gzip, JS **31,742 / 31,744 bytes** gzip.

[Raw measurements and outcomes](verification.json).

## Regressions found and corrected

A plain inline amount span changed the anonymous flex price run and currency
spacing. `display:contents` retains the original rendered price width and unit
position. A first mobile-stock grid attempt inherited Apollo's rightward
`justify-content`; reusing native Flexbox with column direction and centred items
resolves the actual text-centre measurements. The numeric-wrapper guard keeps
numbers in raw unit text neutral. Final recorded comparisons have no unresolved
introduced regression in the tested scenarios.

## Scope, cleanup and limits

Price and metadata presentation share the existing observer; no new global
observer or native price/stock handler is added. Equivalent selectors and repeated
local CSS were consolidated under the existing preview marker to fit the existing
budgets. Gallery touch-event registration was consolidated without changing its
behaviour, then mouse/touch/lightbox regression-tested. An exact duplicate of the
loading guard was removed from the legacy stylesheet; the original identical
`html.timber-page-loading body` rule remains at the start of `inline-head.css`.

The environment still blocks `friends.shopcode.cz`. Jota variant layout uses the
same browser-only eight-card replay as the reference; no fixtures are shipped.
LEGRABOX's native product/price/flag are live; its image-variant membership is not
verified here. Variant data, card order, navigation and selected marker are not
changed. Real iOS/Safari was unavailable; tests use Chromium mobile emulation.
The previously documented Apollo cross-breakpoint header limitation is unchanged.

## Screenshots

- [Jota desktop](images/tulip-desktop.png) · [Jota mobile](images/tulip-mobile.png)
- [LEGRABOX + KOMPLET desktop](images/legrabox-komplet-desktop.png) ·
  [mobile](images/legrabox-komplet-mobile.png)
- [Mobile SKLADOM card](images/card-skladom-mobile.png)
- [Mobile CENTRÁLNY SKLAD / KOMPLET card](images/card-centralny-sklad-mobile.png)

## Changed files

- `src/core/selectors.js` — price-text scope and equivalent selector consolidation.
- `src/modules/product-text-cleanup/index.js` — native amount-only presentation,
  idempotence, character-data updates, reuse the existing traversal/observer.
- `src/styles/overrides/product-card.css` — original title case, blue numeric span,
  mobile stock flow and native KOMPLET background.
- `src/styles/overrides/product-compact.css` — desktop headline spacing, balanced
  CTA and equivalent locally scoped CSS consolidation.
- `src/modules/gallery-swipe/index.js` — equivalent touch-listener consolidation.
- `src/legacy/timber-custom-v175.css` — remove the duplicate loading guard only.
- `dist/timber.min.css`, `dist/timber.min.css.map`, `dist/timber.min.js`,
  `dist/timber.min.js.map` — rebuilt preview assets.
- `CHANGELOG.md`, this report, measurements and screenshots.

Use the full immutable commit SHA supplied in the delivery as `?ts_preview=SHA`.
All changes remain on the existing preview branch. Production is unchanged.
