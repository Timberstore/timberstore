# Site-wide loading stability · C3 / M2 / PD · 2026-10-27

Validated candidate `0.7.1-rc.0`, including the preceding detail metadata fix. The owner subsequently authorized promotion to [stable v0.7.1](../../releases/v0.7.1.md). No production deployment or admin edit took place during the candidate checks. The source loader's `PROD` literal is unchanged; the public shop was observed using v0.7.0. Tests route the candidate bundles into isolated browser sessions without changing the storefront.

## Findings and implementation

Apollo uses `transition: all` on links/buttons. Timber previously introduced quantity pickers and presentation classes after the native cards became visible. That interpolated button width, padding, font size and height for roughly 300 ms. Native cart glyphs also depended on downloadable icon fonts. The same pattern affected categories, search, homepage cards and related/similar/popup recommendations. Manufacturer listings were excluded from quantity initialization entirely.

- Apply shared card/metadata, quantity, recommendation, homepage and detail-control styling to existing native nodes before presentation classes arrive. Preserve colour/shadow feedback; exclude geometry and inherited visibility from interactive-control transitions. Native carousel, accordion and dialog states remain in charge.
- Reserve a real quantity-sized flex/grid slot before asynchronous JS arrives, including table view and fetched cart-related quantities. Do not render fake buttons or guessed amounts. Native add-to-cart stays usable if the custom bundle fails.
- Start quantity preparation while HTML streams, then enhance native AJAX/popup inserts in mutation microtasks before paint. Observe relevant insertions/pack-bound attributes, avoid repeated full-document scans, synchronize untouched pack values and rebind cloned carousel cards instead of trusting copied dataset flags. Native quantity widgets retain their original handlers.
- Include manufacturer listings in quantity, cart-count and list-view handling. Keep the original native amount as the only submitted amount field; no extra named input.
- Use SVG masks for purchase and header cart glyphs so icon appearance and dimensions do not depend on icon-font downloads. Apply mobile cart geometry to the native wrapper before its JS class arrives.
- Restore saved grid/list preference in the head loader; reserve the list quantity/header slots before JS insertion. Keep the existing bounded loader fallback.
- Hide the native category bestseller source before it is relocated, avoiding a late removal from the main product column. Apply contact/footer menu styles and reserve contact icon/hour slots before enhancement.
- Retain the stable short detail `KÓD:` label and native brand links; see [detail evidence](../product-metadata-loading/README.md).

## Verified coverage

Chromium on the real public storefront with locally routed candidate CSS/JS:

| Surface | Checks |
| --- | --- |
| Spojovací materiál, from the screenshot | Slow-bundle mobile/desktop measurements; genuine SKU 15021 ten-piece pack |
| Nábytkové kovania | 30 buyable cards; mobile/tablet/desktop controls; native AJAX sorting; first-frame quantity presence |
| Search | 24 buyable cards; mobile/tablet/desktop |
| TULIP manufacturer listing | 30 buyable cards; quantity present; saved desktop table view |
| Homepage | 32 buyable cards; shared purchase-row dimensions |
| Spring detail and recommendations | Native main quantity, stable code/brand typography, native add-to-cart and recommendation controls |
| Add-to-cart popup | Native recommendation quantities, no duplicate custom pickers |
| Header mini-cart | Fits 375/1440 px viewport, usable separate trigger, native totals |
| Full cart | Native quantity update/replacement after increase |
| Shipping/payment | Native transition to `/objednavka/krok-1/`, shipping and payment selection at 375/1440 px; no order submitted |
| Contacts/footer and cart header | Shared early styles; interactive controls retain colour/shadow-only transitions |

Core functional widths: **375, 768 and 1440 px**. Additional responsive category/home/detail checks: **320, 430 and 1024 px**. Native pack test: initial 10, plus 20, minus 10. Cloned-card test: round 21 to 30, decrease to 20, exactly one submitted native amount and one working picker. AJAX monitors observed no replacement-card frame missing a quantity UI.

The checkout test respected the shop's EUR 5 minimum using six ten-piece packs. It created only anonymous test carts and selected delivery/payment; it did not submit an order or enter customer data.

## Slow/failed loading evidence

The slow-load audit delayed the Timber bundle by 2.5 seconds, beyond the existing loader fallback. Final visible dimensions for the screenshot category were unchanged when the bundle arrived:

| View | Cart button before / after | Card before / after |
| --- | --- | --- |
| 375 px grid | 38 × 38 / 38 × 38 px | 170 × 421.5625 / 170 × 421.5625 px |
| 1440 px grid | 175.328125 × 50 / 175.328125 × 50 px | same width/height before and after |

Additional tests blocked both fonts and the custom bundle, verified that the native purchase button remained available after the bounded fallback, then injected the local bundle. Card/button dimensions, the button position within its card and footer phone font size remained equal at 375 px grid, 1440 px table and a 1440 px manufacturer table. Both cart masks remained available without fonts. The source head loader restored the saved list class before the bundle executed.

These are control/card measurements, not a claim of zero whole-page CLS or unchanged PageSpeed. Native asynchronous content and the remaining late construction of complex panels can still move surrounding content when a bundle arrives after the network fallback. Ordinary card inserts are prepared before their first paint; the network-failure path preserves geometry and native purchasing rather than hiding the page indefinitely.

- [Slow-load measurements](slow-loading-measurements.json)
- [Tablet/desktop functional checks](functional-results.json)
- [Actual ten-pack, mini-cart and checkout checks](extra-results.json)
- [Font/bundle failure and saved list checks](fallback-results.json)
- [Additional responsive checks](responsive-results.json)

No new JavaScript page errors occurred in the tested flows. Third-party tracking requests were blocked in isolated test browsers; Shoptet, Apollo, the pack add-on, shop/CDN assets and fonts were permitted except in the deliberate font-failure test.

## Reproduction and build

The [checks](checks/) require Python Playwright and an installed Chromium. Set `TIMBER_CHROMIUM` if Chromium is not at `/usr/bin/chromium`; inherited HTTPS proxy settings are retained. `TIMBER_LOADING_WORK` selects the scratch-output directory (default `/tmp/timberstore-loading-check`). These are manual storefront checks, not automatic CI jobs; `flows.py` and `extras.py` create isolated anonymous carts.

```sh
npm run lint
npm run build
python docs/fixes/loading-stability/checks/flows.py
python docs/fixes/loading-stability/checks/extras.py
python docs/fixes/loading-stability/checks/fallback.py
python docs/fixes/loading-stability/checks/responsive.py
```

Build: **31.96 KiB JS / 32 KiB limit**, **27.43 KiB CSS / 27.5 KiB limit**. The candidate-only CSS increase follows the recorded owner authorization of 2026-10-15. Stable release limits are unchanged.

Safari/WebKit, a physical iPhone, authenticated account/order pages and PageSpeed were not tested. Historical waivers for v0.7.0 are not claimed for this candidate. Production activation requires the usual release process and a loader update; the saved-view head change is included in the source loader but has not been installed on the public shop.
