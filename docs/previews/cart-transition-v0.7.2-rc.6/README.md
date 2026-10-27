# M2 — Complete click-to-popup transition, 0.7.2-rc.6

Preview only, retaining previous menu/contact/cart/cookie changes. No production loader update, tag, release or merge. Stable v0.7.1 is unchanged.

## Reproduced causes

Earlier checks began with a visible advanced-order popup. This verification starts before the native add submit and includes loading, backdrop, background and first reveal frames.

1. Native add POST shows a white full-page spinner. Shoptet hides it on POST completion, then opens a dark-backed popup after GetExtendedOrder. The white → normal page → dark popup sequence produces the flash.
2. Apollo reruns global product rearrangement on advanced-order load. It leaves empty `product-btn` spans with margins/min-height. A measured catalogue card grew from 581.14 to 605.14px when the popup opened. This moved products behind the dialog.
3. On narrow rows, a fetched price unit wraps below the amount. Its width was reserved, but the empty placeholder lacked line height; arrival added 15.59px and shifted the centred popup.

## Corrections

Only the native spinner inserted during the synchronous product/variant submit is marked. Its white wash/loader are visually suppressed outside checkout, while its native pointer shield and native removal remain. The body observer disconnects at the end of that event task, including rejected submits; per-node styling is cleared on completion or the existing bounded fallback. No native requests, prices, stock data or form submission handlers are replaced.

The completed popup and native backdrop use a 160ms opacity-only reveal. The backdrop finishes at Shoptet's own configured opacity. Reduced motion disables this fade. Original native size animation remains disabled for the cart; gallery behaviour stays native.

Empty purchase wrappers are hidden in public content, preventing their margins from growing background cards. Missing-unit placeholders reserve both height and width. Neither fix delays the popup behind a new timer or waits for a guessed product unit.

## Validation

17 passing Chromium scenario records:

- 13 complete transitions: detail at 320/375/768/1440/1920px; home/category at 375/1440px; delayed responses at 375/1440px; reduced motion at 375/1440px. Observe from before click through loading/reveal. No visible white loading frame or blank popup, no popup geometry jump, and zero measured background geometry change after submit. Opacity increases monotonically; reduced motion appears without a fade. Recommendation adds, single request per add, gallery and a later unrelated native spinner are checked.
- 2 regression flows at 375/1440px: bounded custom-state cleanup after a simulated network abort; a rejected variant-submit fixture causes no observer leak; native gallery, later white loader, native add/cart quantity and checkout shipping/payment selection. No orders or personal data submitted.
- 2 repeated-open cases at 375/1440px: three native popup opens, stable background-card height and one add request from a double click because the original invisible pointer shield remains functional.

The slow-response cases forward real unmodified native responses after adding 600ms to POST delivery and 1400ms to popup-response delivery. They do not invent response HTML. Some outbound-delay experiments returned native `payload.content:false`; those and isolated native empty responses are recorded separately and excluded from successful popup counts. The existing server behaviour was already documented in earlier previews; it is unchanged.

A hard network abort can leave Shoptet's own spinner visible. The custom presentation resets on its bounded fallback; the regression fixture explicitly invokes native hideSpinner before testing subsequent interactions. This is not a claim that native HTTP-abort handling has been repaired. The rejected variant form is a browser-only event fixture with no submitted product data, not a live external variant integration test.

The reference recording measured 9 white-spinner frames; the repaired recording measured zero. The background card remains 581.14px before/after opening with the empty-wrapper rule. Before/after videos are independent anonymous sessions, not a latency benchmark. The provided user video exceeded the 32MiB transfer limit and was not inspected; these recordings reproduce the issue directly on the public shop.

Evidence: verification.json, regression-results.json, reopen-results.json, before-after.json, screenshots and before.mp4/after.mp4. Scripts in checks/ require Python Playwright/Chromium; TIMBER_TRANSITION_WORK and TIMBER_CHROMIUM select scratch/executable. Use the inherited HTTPS_PROXY where required. Test sessions use native cookie acceptance; consent logic is unchanged. Safari/physical devices are NOT TESTED; no global zero-CLS claim.

ESLint, production build and whitespace checks pass. Gzip JS 32.20 KiB / 32.25 limit; CSS 28.71 KiB / 28.75 limit. No budget increase. CDN byte equality and actual preview verification are recorded in the draft pull request before sharing the URL.

## CDN package ceiling

Initial publication was rejected by jsDelivr with HTTP 403: package size exceeded 50MB. The tracked tree was 56,439,460 bytes. Compact only whitespace outside JSON strings in 16 historical preview reports, preserving paths, every string/number token, key order and parsed data. This saves 8,315,024 bytes without deleting evidence. Old commits/tags remain immutable. See cdn-package-size.json. This formatting-only cleanup is necessary for the new immutable asset URL to load.
