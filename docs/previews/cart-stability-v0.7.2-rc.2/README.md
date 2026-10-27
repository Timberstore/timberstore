# M2/C3 — Cart popup stability and green delivery, 0.7.2-rc.2

Preview only, based on rc.1. Published v0.7.1, production loader, earlier tags and their budgets are unchanged. Cookie styling, five-digit quantity fields and the rc.1 purchase layout are retained.

## Requested corrections

- Established Emerald `#00C853` on the confirmation cart icon/outline, delivery icon, free-delivery word and remainder, and progress fill. Checked in the advanced popup, mini-cart and full cart, including incomplete progress. Primary purchase actions remain orange; secondary actions remain neutral.
- The native product price `strong` has its final blue colour before text cleanup. Prices are never fetched or recomputed by this enhancement. The price's missing unit is still obtained from the verified public detail; its slot is reserved before the request completes, so the amount does not move when the unit arrives.
- Warehouse labels flow as inline text, with a nonbreaking separator tying the final label word to the original stock-count span. `CENTRÁLNY` can wrap above `SKLAD (count)` while the native label/count, colour and attributes remain intact. Applied to cards, recommendations, popup and detail stock.

The green-price instruction is implemented for the monetary remainder in the delivery message. Product prices retain the website's existing blue; an optional clarification was requested about expanding green to product prices.

## Popup cause and correction

The supplied 7.64-second video shows a visible popup resizing after opening. Live traces reproduced two competing post-open resizes: our recommendation callback and Shoptet's own `shoptetResize`. Apollo also rearranged the form/price wrappers only after the initial Colorbox size animation.

The custom resize calls were removed. This cart dialog alone now has a final responsive width and content-driven height from insertion, with scrollable content in a short viewport. Decorative Colorbox edge floats cannot retain old animated heights. Its existing submit-scoped speed override uses zero duration, allowing Apollo's completion work before the first visible frame. The previous Colorbox speed is restored for product galleries and unrelated dialogs; the native AJAX, modal lifecycle and close/back actions remain.

## Validation

59 passing scenario records:

| Checks | Records | Coverage |
| --- | ---: | --- |
| General layout | 24 | Home, catalogue, detail, search, brand and list views, 320–1440 px |
| Control geometry | 18 | Input/button containment, labels, alignment, detail purchase row |
| Native purchases | 4 | 320/375/768/1440 px, main/recommendation add, one POST per add, quantity edits/limits, mini-cart, cart, shipping/payment selection |
| AJAX and packs | 2 | Sorting/filtering, refreshed controls, min/max/step, pack rounding |
| Frame stability | 5 | 320×568, 375, 768, 1440 and 1920 px; 8-second unit-response delay, first-visible prices, repeated open/close, native defaults restored |
| Stock and price style | 4 | 320/375/768/1440 px; real central-stock markup constrained to 118 px; final word/count share a line; real related and similar prices have the same colour without the cleanup span |
| Delivery palette/gallery | 2 | 375/1440 px; incomplete delivery in popup/mini/cart, native percentage unchanged, gallery opens/closes with native geometry |

All five frame tests recorded zero variation in popup position/dimensions and price amount position/dimensions from first visible frame through delayed unit insertion. Every test began without that fetched unit. This is scoped to those measured Chromium sessions, not a global zero-CLS claim. Native stock validation still applies; fitting 10000 does not bypass stock limits.

ESLint, production build and whitespace checks pass. Gzip: JS 31.98 KiB / limit 32; CSS 28.26 KiB / limit 28.5. No budget increase. No orders or personal data were submitted. Physical devices and Safari were not tested; no Safari pass is implied.

## Observed limitations and corrected test failures

- Shoptet returned HTTP 200 with `payload.content:false` for GetExtendedOrder in isolated attempts at 1440 and 375 px. The item was added but there was no popup. This server behavior was already documented on both reference and earlier preview builds in `../popup-related-polish/README.md`. These failed attempts are excluded from passing scenarios; separate native runs passed at both widths. The response is not replaced with invented content.
- The first frame-test harness selected the native hidden amount input rather than the visible custom quantity input. Corrected the selector and reran.
- The palette test caught a desktop-specific orange mini-cart progress rule. Corrected that rule; desktop retest passed.
- The stock fixture harness emitted an unawaited no-op coroutine warning; the unused line was removed. Assertions and recorded results passed.

`checks/` contains browser scripts. Install Python Playwright/Chromium and use the inherited HTTPS_PROXY when needed. TIMBER_CHROMIUM and TIMBER_CART_WORK override executable/scratch directory. Tests use anonymous carts on the public shop; no order is submitted. The stock-width/cleanup-span checks are browser-only fixtures and do not ship in application code. Raw video and full native documents are not published.

Screenshots show the final desktop popup and mobile/desktop incomplete delivery. CDN byte equality and actual commit-hash preview verification are recorded in the draft pull request after publication.
