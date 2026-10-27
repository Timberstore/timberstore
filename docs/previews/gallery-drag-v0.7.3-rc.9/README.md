# M1 — Continuous native gallery thumbnail drag, v0.7.3-rc.9

Preview extending rc.8. No main merge, stable release or production loader change.

## Reproduced issue and change

Inspected the provided 13.97s video (17.mp4); its native gallery thumbnail strip required arrows or selecting photos rather than following a held pointer. At original resolution the pictured product is SKU 456832, /tulip-uchytka-tende-32-146-antracit-2/. The earlier guessed slug without -2 resolves to a different black-matte product; final verification and before trace use the exact pictured SKU URL. The uploaded recording is not published in this public repository.

The old rc.8 build held the strip at offsets [0,0] during -25/-75px mouse movements and selected the next image only after release (before.json). New strip-only handler updates the original inner left/top on every horizontal pointer movement, with an 8px intent threshold and native extent bounds. It preserves the existing track, thumbnails, real hrefs, selection, lightbox and delegated arrows. Dragging scrolls the strip without selecting/opening a photo; a normal click still selects, and dragging the main image still switches via its existing native swipe path. Shared core/swipe.js, related/similar Swiper carousels and main-image hover zoom are not modified.

Pointer capture retains movement outside the viewport; child implicit-capture loss during touch transfer is ignored, while real root loss/up/cancel cleans the state. Horizontal drag suppresses its trusted click and native HTML drag; new pointerdown restores normal clicks. Pending native jQuery arrow animation completes using its own callback before handover; offset/overflow classes stay compatible with arrows. Inner/thumb nodes are read again at each gesture after native changes. Vertical touch over a horizontal strip remains page scrolling.

## Verification

- Four real Chromium gallery cases on the exact video product: mouse at 375/1024/1440px, touch at 375px. Held offset samples change before release; reverse drag, edge clamp, native arrow after drag, thumbnail click, main-photo mouse swipe, native lightbox/close and idempotent DOM reinit pass without page errors. 1024px fits all thumbnails, so there is correctly no strip movement/overflow claim at that width.
- Additional real CDP touch cases: vertical strip gesture scrolls document (149→234px) without selecting a photo; real touchCancel clears grabbing and the following tap selects normally; main image touch swipe, first/last limits and a single-photo product (no thumbnail strip) remain safe and tap opens the lightbox.
- Native variant cards were not present in the current anonymous product DOM; variant-switch scenario is explicitly NOT TESTED in touch-regression.json. No external integration/variant claim.
- Native purchase smoke at 375/1440px: add popup without blank/white frames or background movement, cart quantity, shipping/payment to personal details; no order submitted.
- ESLint/build/whitespace PASS. JS 32.99/33.25 KiB (new rc.9-only allowance under recorded authorization), CSS 29.74/29.75 KiB (no increase). All earlier budgets preserved. Safari/iPhone and PageSpeed NOT TESTED.

Initial tests route local candidate bundles on the native public shop. Actual immutable CDN CSS/JS exact byte equality passes (cdn-assets.json). Three actual CDN gallery cases pass: mouse at 375/1440px and touch at 375px, including held movement, reverse, bounds, native arrows, selection, main-photo mouse swipe and lightbox (cdn-verification.json). The independent first commit compacts whitespace outside strings in five older preview reports, preserving tokens/data/order/paths and immutable historical tags; see cdn-size.json. No historical evidence deleted.

## Preview

https://www.timberstore.sk/tulip-uchytka-tende-32-146-antracit-2/?ts_preview=a4d33f00d093ee7cbab3959c2a8520700a5b0f67

Source/build frozen at this commit; later commits only add evidence. Production loader unchanged.
