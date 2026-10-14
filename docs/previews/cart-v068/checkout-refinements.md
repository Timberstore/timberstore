# Checkout refinements — initial preview 0.6.8

This records checkpoint `8422e56`. Current refinements and verification are in [checkout-followup.md](checkout-followup.md).

Base: preview 0.6.7 `89e350540f8405cfefeef8f35095bfeb62c8400f`.
Branch: `feature/checkout-refinements-v068`. No production loader, main, release or tag change.

## Changes

1. Summary headings use original Timber orange `#D4884A`. One checkout green token `#66BF3A` comes from the native Apollo selected-radio disk. It controls primary CTA, active step, stock/free-price/confirmation accents. Other-page tokens are unchanged. Dark CTA text `#0F0F0F` gives 8.29:1 contrast, with explicit hover/focus/disabled states; the native white radio check remains intact.
2. Only exact native `Skladom` availability receives the green class; other stock states and amounts remain native. Only the exact external-stock shipping notice is replaced with the requested uppercase central-stock notice; the other three lines are retained.
3. Summary product names occupy their own full row; amount/unit and price occupy the next row. Product, shipping and payment entries have consistent typography and separate borders/spacing. Native totals/data are not recalculated.
4. From 1200 px, sidebar summaries are sticky with a 200 px header clearance and a viewport-limited internal scroll. Narrow layouts use normal flow.
5. Desktop primary buttons use approximately 67% width; mobile uses available width. Native button/form ownership, labels and the final legal suffix remain intact.
6. Existing account/login and country/value groups are inline; name/email/phone are separate full-width groups. Native country values/disabled state and validation are untouched; the existing hidden country wrappers are removed from layout so they cannot consume grid cells. Small mobile account rows may wrap. Native clearfix pseudo-elements are disabled only on these two flex/grid groups so they do not consume layout cells.
7. Existing checkout contacts size to their content, with 12 px heading/contact gap and natural wrapping. Hours, phone, email/contact-form and social URLs are unchanged.
Explicit scoped `!important` overrides are limited to native inline stock colour, legacy notice colour, and Apollo’s `.cart-row .col-md-4 { top: 0 !important }`, which otherwise defeats sticky header clearance. No global legacy rewrite.

8. Existing module/lifecycle is reused with guarded class/text updates, no new handlers, requests, timer, DOM replacement or duplicate IDs. Existing server/Apollo summary styling is preserved.

## Validation and limits

- Lint and budgeted build passed. CSS allowance 18.75 KiB is client-approved **only for preview 0.6.8**; JS remains 30 KiB. Build: CSS 18.59 KiB, JS 21.52 KiB gzip.
- Browser smoke check: all three checkout steps at 1920/1366/768/390/375/320 px; no document overflow, contact spill, nested anchors or overlap between summary names/amounts/prices. Identical sidebar widths across steps. Long-name/1000-unit/large-price and 320 px/9000 quantity checks are DOM fixtures, not real inventory orders.
- Native add to cart, quantity AJAX, plus/minus, removal, back/continue navigation and HTML required-field validity exercised. Four repeated lifecycle events did not multiply quantity requests. Native paid courier/free payment and numeric zero/paid/zero price-accent lifecycle checked. Final button retains native form and legal text; it was **never activated**.
- Server-rendered versus Apollo-wrapped summary geometry/typography stayed identical. No browser JavaScript exceptions.
- Focused checks cover green/orange styles, desktop/mobile CTA widths, contact gap, stock classification and exact shipping notice, sticky/internal scrolling on steps 2/3, account/country/field geometry and final focus/disabled state. CTA geometry checks disable native button transitions in the test page only so offscreen animations do not distort measurements. The tall sticky check adds temporary long-content fixtures to both columns; normal sticky stops at the containing section boundary.
- Not verified: external pickup-point widget and completed pickup selection, every shipping/payment combination, server-side final validation/payment/order submission, company/international-country variants and real iOS Safari. These require manual preview checks. No real order was submitted.

## Changed files

- `src/styles/tokens.css`
- `src/styles/overrides/checkout.css`
- `src/styles/overrides/cart-presentation.css`
- `src/modules/header-service-bar/header-service-bar.css`
- `src/core/selectors.js`, `src/core/texts.js`
- `src/modules/cart-presentation/checkout.js`, `index.js`, `rows.js`
- `package.json`, `package-lock.json`, `scripts/build.mjs`, `CONTRIBUTING.md`, `CHANGELOG.md`
- `dist/timber.min.css`, `dist/timber.min.js` and their source maps
- This preview note

## Preview

Open `/kosik/?ts_preview=<commit SHA>` on timberstore.sk. Continue through the native shipping/payment and details steps; the preview cookie persists. Return to production using `?ts_preview=off`. The 0.6.7 checkpoint remains available via its SHA above.
