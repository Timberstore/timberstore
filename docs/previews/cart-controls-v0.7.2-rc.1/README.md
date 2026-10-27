# Cart controls preview — 0.7.2-rc.1

Preview only. The published v0.7.1 tag and Shoptet production loader are unchanged. This preview includes the cookie button styling from rc.0, including the white acceptance label.

## Changes

- Header cart count is layered in front of the cart glyph. Wide mobile counts grow away from the price.
- Shared quantity controls reserve 118 px, including a 64 px input that displays and edits 10000 without clipping. Native stock limits, minimums and pack increments remain enforced.
- Recommendation names and codes align left. Popup stock quantities stay beside the stock label, prices align right, and quantity and the labelled add button share a row on mobile.
- Catalogue, home, search, brand, list and product-detail purchase controls retain readable fields. Exceptionally narrow two-column cards wrap their purchase controls; popup and main detail controls stay alongside each other.
- Confirmation and free-shipping panels use warm brand colours. Cart/checkout primary actions are orange with white labels; return actions use a subtle neutral treatment. Stock availability retains its semantic green.
- Native forms, Shoptet event handlers, AJAX refreshes, validation and checkout remain in use.

The underlying popup defect was a recommendation selector specificity conflict: the quantity input measured only 10 px before the fix, and the generic centred title rule overrode the popup alignment.

## Validation

48 passing scenario records are committed with this preview:

- 24 catalogue/home/detail/search/brand/list scenarios across 320–1440 px.
- 18 geometry scenarios checking field and button containment, label visibility, alignment and mobile detail purchase layout.
- 4 native purchase flows at 320, 375, 768 and 1440 px: main product add, recommendation add, exactly one request per add, editable five-digit quantity, plus/minus, return action, header count layering, mini-cart, cart and checkout shipping/payment selection.
- 2 native AJAX/pack scenarios at 375 and 1440 px: sorting, filtering, content-loaded events, no missing quantity controls, pack rounding and original min/max/step preservation.

Tests used Chromium and fresh anonymous shop sessions. No orders or personal data were submitted. Physical devices and Safari were not tested. The 10000 display check does not override actual product stock limits. No zero-layout-shift claim is made.

`checks/` contains reproducible browser scripts; install Python Playwright and set HTTPS_PROXY as needed. TIMBER_CHROMIUM can override the Chromium executable, and TIMBER_CART_WORK selects scratch storage. Screenshots show the final popup, header and five-digit input.

Build checks: ESLint, production build, bundle budgets and git diff whitespace validation. Preview budgets are 32 KiB JS / 28.5 KiB CSS; stable version budgets remain unchanged. CDN byte equality and the real commit-hash preview are verified separately before sharing the preview URL.
