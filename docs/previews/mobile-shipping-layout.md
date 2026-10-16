# Mobile shipping layout — preview history

## Follow-up 0.6.11-rc.1

The latest follow-up stays on this branch, based on unchanged `fb75c3ef6351fb56cdd11c7d0d67c795b9b53cf4`. The optional pickup/sublabel rows now precede the final logo/price row; the mobile heading and native truck form one centered flex group. Desktop, payments, native controls and all colour declarations remain unchanged. CSS gzip: 20,475 bytes / 20 KiB; JS 25,164 bytes / 30 KiB. Production still v0.6.9.

Full implementation notes, current test results, complete analytical green inventory and palette proposal: [audit and follow-up](../audits/green-20261015/README.md). The proposed colours are documentation only and need explicit future approval. The original rc.0 commit below remains independently previewable.

## Original 0.6.11-rc.0

Date: 2026-10-15. Base: `e67b3db8fdaf8028111a73e0b20a54248d1d3d8b` (previous shipping/cart/order preview). Working branch: `preview/mobile-shipping-layout-20261015`.

The remote `main` was checked before work and remains `bf464db` (stable v0.6.9 documentation). The previous preview branch/commit and existing release tags remain unchanged. No merge, production loader change or production deployment is part of this task. The next development version is `0.6.11-rc.0`, skipping the rejected 0.6.10 colour experiment. The user approved necessary budget increases on 2026-10-15; this preview uses 20.0 KiB CSS / 30 KiB JS.

## Implementation

Only the existing mobile method block in `src/styles/overrides/checkout.css` changes the presentation. The rules use Shoptet's `#order-shipping-methods` and native `.radio-wrapper`, `.payment-info`, `.shipping-billing-name`, `.payment-logo`, `.payment-shipping-price` and `.sublabel` structures. There are no carrier names, prices, shipping IDs, ordering assumptions, nth-child selectors or changes to selection logic.

- The existing shipping-name element spans both grid columns. Font size and family remain native; name weight is bold and the existing delivery note remains normal weight below it.
- `display: contents` on the non-interactive `.payment-info` span exposes its existing children to the label grid without removing/moving DOM nodes. Form inputs, label associations, tooltip and pickup listeners remain intact.
- Logo and price occupy a separate second visual block below the title/delivery note. In server HTML they are sibling grid items. When Apollo moves the original logo into the price element on mobile, reverse flex lays out the original logo left and native price text right. CSS performs no DOM move, wrapping, cloning or price replacement.
- Existing sublabels, including the pickup link, span the full grid and follow the media row in normal auto-placement order. Multiple sublabels can flow into additional rows.
- The original radio remains at the left, aligned with the start of the text; the existing question tooltip sits at the upper right with reserved text space only when present.
- Missing logos create no synthetic image or placeholder. Prices and free-shipping colours remain controlled by existing native numeric attributes/styles. A single shipping method and additional methods use the same rules.
- All new geometry is inside the existing max-width:767px media block. Payment info retains its previous mobile grid rule, now explicitly scoped to `#order-billing-methods`. Desktop geometry and colour tokens are untouched.

## Verification

Live Shoptet/Apollo with isolated local assets:

- 320, 375, 390 and 430px: full-width shipping title; delivery note above logo/price; pickup link below; native font size, bold title and price; normal note; no horizontal overflow or overlapping rows.
- Measured mobile payment geometry/typography matched the previous preview at 375/390px.
- Measured desktop shipping geometry/typography matched the previous preview at 768/1024/1440px.
- Form action, input names/values and pickup hrefs remained equal before/after responsive checks.
- Native activation of all four shipping labels changed the selected input. The test activated the original labels programmatically because the headless browser's physical click/screenshot stability waits timed out; this is not a completed physical-device interaction test.
- Native `/action/OrderingProcess/step2CustomerAjax/` responses returned HTTP 200 after selection changes. The original pickup link opened the original new-logistics-widget with dialogs and an iframe; `/action/NewGenWidget/Choose/` and `/action/pickupPointWidget/` returned HTTP 200.
- No new captured JavaScript exceptions in these checks. No order submitted.

Layout-only fixtures derived from the native markup:

- 16 combinations: four requested widths × one/eight shipping methods × server sibling/Apollo nested logo structure.
- Short and long names, long delivery notes, absent note, free shipping, long formatted prices, absent logos and optional pickup links.
- Existing direct test listeners on pickup links still fired once with the display:contents parent. Radio/label associations retained.
- Row sizes were identical over twelve consecutive animation frames in each fixture combination; no horizontal overflow or row overlap.

Limitations: real iOS Safari and physical devices were not available; complete selection and confirmation of a concrete pickup branch was not performed. Live screenshots failed in the headless test browser and are not claimed as successful visual evidence. Fixture tests are not additional real carriers or production settings. Marketing/third-party resources excluded by the test harness do not establish full provider coverage.

## Build and preview gate

- ESLint and diff whitespace check pass.
- CSS output is 20,431 bytes gzip (19.95 KiB), compared with the existing v0.6.9 allowance of 20,224 bytes (19.75 KiB).
- The user approved necessary budget increases on 2026-10-15. This new `0.6.11-rc.0` preview has a 20.0 KiB CSS limit; JS remains 30 KiB and previous release budgets are unchanged. Build passes. The standing approval is recorded in CONTRIBUTING.md.
- The original stable release and prior preview remain independently recoverable by their unchanged tags/commit hashes. A new preview must use its own commit hash and be checked on CDN before its URL is sent. Production remains v0.6.9; preview off is `?ts_preview=off`.
