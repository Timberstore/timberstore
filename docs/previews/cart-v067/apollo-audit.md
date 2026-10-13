# Apollo checkout audit — preview 0.6.7

Date: 2026-10-13. Baseline: `86f516bfcaeeb5413ec747aeaf192c8ac715f8b6`.
Uncommitted changes lost during environment replacement were restored onto this
baseline and revalidated before committing. Production, loader and native Apollo
files remain unchanged.

## Confirmed causes and fixes

1. Apollo creates `.order-summary-top` and `.order-summary-bottom` at window
   load, and can recreate them after final-step cart updates. Earlier overrides
   covered shipping/payment only. Shared native selectors now cover both later
   steps; transparent `display: contents` wrappers and explicit child ordering
   keep products/delivery/payment above subtotal and totals from server render.
2. Apollo hides `.order-summary-item.helper` and adds a 65px price offset and a
   white `::before` strip before `after-load`. The subtotal is restored with a
   separator; the price offset/strip are neutralized in every loading state.
   No page delay, new timer, hidden summary or loader extension is introduced.
3. Native later-step sidebars have 60px left padding and mobile panels use
   negative horizontal margins. Removing these differences aligns all summary
   widths: 36% with a 24px gap from 1200px, consistently stacked below that.
4. The cart module inserted an extra shell and moved the return action after
   initialization. Both DOM operations were removed. CSS uses the native summary
   as its grid/sticky item; native buttons keep their hierarchy/form ownership.
5. Native table-cell widths caused product text/amount/price conflicts. Scoped
   three-column grid rows allow wrapping names while amount/unit and price stay
   together, aligned and separated by subtle rules. No product data is cloned.
6. Apollo paints all selected method prices green, including paid methods.
   Normal prices now retain the price colour; numeric native zero-price attrs
   select green/bold accents. Recap spans use selected native numeric values
   when available, with native formatted zero text as a final-step fallback.
   Positive numeric data takes precedence over a stale ZADARMO label. No amount,
   currency, fee, discount or VAT is computed or rewritten by our helper.
7. Checkout metadata queued only in animation frames can be delayed. Existing
   mutation observation now synchronizes price accents idempotently before its
   ordinary presentation frame. One observer and guarded listeners are retained.
   Selected methods use checked native inputs and closest verified radio rows,
   without introducing a new JavaScript `:has()` dependency.
8. Contact content outgrew fixed/nowrap dimensions. The scoped surface grows
   vertically and wraps whole contact blocks. Native phone links, shared hours
   and status logic, real social URLs and the existing `/kontakty` destination
   are reused. Apollo's nested tel anchors are unwrapped, preserving the original
   leaf link; text is written only when its formatting actually changes.

## Verification after environment recovery

ESLint, formatting and build completed successfully. CSS: **18.04 kB gzip / 18.25
kB** approved preview budget; JS: **21.25 kB / 30 kB**. Package version is still
0.6.7. The exception affects only this preview; production is unchanged.

One browser run against the anonymous live store, using the rebuilt local dist
through the existing preview loader, completed all checks below. No screenshot
suite, personal data entry, real order submission or payment was performed.
Native anchor/button activation was used for navigation and removal.

- cart native quantity AJAX 1 -> 2
- repeated lifecycle: one plus = one AJAX request
- native minus and restored quantity
- cart all six widths/contacts/columns
- paid shipping/free payment colours and native form ownership
- shipping all six widths/contacts/columns
- final numeric price selectors and zero/paid/zero observer lifecycle
- server/Apollo summary geometry identical
- details all six widths/contacts/columns
- identical summary widths across three steps
- required field validity and final submit text retained; final submit never activated
- long-name fixture all six widths/contacts/columns
- native back/continue round trip
- fresh mobile cart/9000 fixture fits 320px
- native removal to empty cart
- no browser JavaScript exceptions

The zero/paid/zero, long-name/1000 ks/large-price and 9000 input cases are DOM
visual/metadata fixtures; original values were restored and no fixture amount
was submitted. The wrapper comparison paused only Apollo's footer resource in
the test: heading colour/font, panel padding/width/height, subtotal and button
positions matched before and after its initialization. No resource pause is in
the application code.

### Measured summary outer widths

| Viewport |      Cart | Shipping/payment | Personal details |
| -------- | --------: | ---------------: | ---------------: |
| 1920     | 452.16 px |        452.16 px |        452.16 px |
| 1366     | 365.75 px |        365.75 px |        365.75 px |
| 768      | 665.00 px |        665.00 px |        665.00 px |
| 390      | 293.00 px |        293.00 px |        293.00 px |
| 375      | 278.00 px |        278.00 px |        278.00 px |
| 320      | 223.00 px |        223.00 px |        223.00 px |

Contacts remained inside their coloured panel, product columns did not overlap,
and document horizontal overflow was absent at every checked width. Repeated
lifecycle events followed by one plus produced exactly one native quantity
request. The native required-field validity API rejected empty personal data.
Final submit form ownership/text/consents were preserved, and that submit
button was never activated. The cart was emptied at the end; browser JS errors
and route errors were absent.

## Changed files

- `src/styles/overrides/cart-presentation.css`, `checkout.css`
- `src/modules/cart-presentation/bottom.js`, `index.js`, new `checkout.js`
- `src/modules/header-service-bar/index.js`, `header-service-bar.css`
- `src/core/selectors.js`
- `scripts/build.mjs`, `CONTRIBUTING.md`, `CHANGELOG.md`
- `dist/timber.min.css`, `timber.min.js` and both source maps
- This audit report.

## Limits and manual checks

Authenticated/customer-specific states, physical Safari/iPhone hardware,
external pickup-point widgets, actual payment, server-side final-order
validation and full Shoptet validation-message rendering remain unverified.
Existing related-product pack controls were reviewed for native form/min/max
preservation; their add-to-cart flow was not rerun in this audit. Navigation
back/forward reselected a valid courier method; pickup-point persistence was
not tested. This is a checkout compatibility audit, not a guarantee for every
third-party add-on or every page of the storefront.

Before approving this preview, manually check the above integrations and
visual quality on real devices. No merge, release/tag or deployment is included.
