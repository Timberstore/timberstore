# M2/C3/K3 — Card spacing and shared mobile page scroll, v0.7.3-rc.5

Extends rc.4; preview only, no main merge, stable release or production loader change.

## Change

Desktop purchase gap increases from 8 to 16px. The offer/form extend 4px into the existing card padding on both sides, leaving comfortable padding while moving stock/quantity left and prices/cart right. Both use the same geometry; field and price/button column widths are preserved (the gained 8px goes entirely to the wider gap). Mobile card styles and desktop table remain unchanged.

Open mobile filter and sort panels are now in normal document flow. Their height is intrinsic, without a maximum or inner scrolling trap; products follow below. Inside gestures scroll the whole page and panel together. A boolean records inside gesture ownership through touch-end/momentum. The next outside touch/pointer/wheel releases that ownership and dismisses the panel; unowned document scrolling still dismisses after 16px. Passive listeners never prevent scrolling. Scroll keys respect focus origin. Removed the obsolete viewport-height sizing code and listeners. Original native forms, sliders, inputs, values and AJAX handlers remain.

## Verification

- 23 Chromium layouts / 700 cards at 375/992/1024/1440/1920px: 16px control gap, at least 12px card-edge space, stock/price rows, price/cart centre, no overflow and existing table typography. summary.json + lossless alignment.json.gz.
- Touch-enabled 375px /spony--klince/ (the owner's pictured parameter-filter category) and 430px /nabytkove-kovania/: actual CDP swipes up and down inside both filter and sorting panels move document AND panel by >35px while staying open, including momentum after touch-end. Real outside swipes close both. Recorded before/after page and panel positions in mobile.json.
- Expanded long brand group has max-height:none, static open slot, visible body overflow and no inner scroll extent. Inside wheel moves document without closing; outside wheel closes. Checkbox AJAX, persistence across outside-close/reopen, native reset, native price sorting, Escape and single toolbar root after AJAX pass. Full-width heading backgrounds retained.
- Native purchase at 375/1440px: add/popup without white/blank frames or background movement, cart quantity increase, shipping/payment through personal details; no order submitted.
- ESLint/build/whitespace PASS. JS 32.43/32.5 KiB, CSS 29.65/29.75 KiB, no allowance increase. Safari/iPhone and PageSpeed NOT TESTED.

Initial verification routes local candidate assets on the public shop. Immutable CDN verification follows push. cdn-size.json records whitespace-only compaction of three previous JSON reports, preserving all data/tokens/paths and existing tags, to keep the new snapshot below the CDN 50MB ceiling.
