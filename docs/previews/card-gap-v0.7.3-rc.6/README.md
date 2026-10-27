# M2 — Slightly wider desktop card gap, v0.7.3-rc.6

Two application token changes from rc.5: desktop purchase gap 16→24px and symmetric outset 4→8px. Offer/form widths increase by exactly the additional gap, retaining price/button/quantity widths and remaining within native card padding. Mobile card and filter code and desktop table are unchanged. Preview only; no main merge/release or production loader update.

13 layout scenarios / 396 cards at 375/992/1440px (stock category, central-stock category, homepage, grid and desktop table): 24px gap, minimum 12px native edge space, no overflow, existing stock/price rows and table formatting PASS. verification.json records derived measures; raw scratch records were measured with the existing rc.5 alignment script selecting rc.6 version and a 24px gap. Lint/build/whitespace PASS. JS 32.43/32.5 KiB, CSS 29.65/29.75 KiB, allowances unchanged. Native purchase and touch-filter behavior unchanged from the verified rc.5; no duplicate purchase run for this two-token CSS change. Safari/iPhone and PageSpeed NOT TESTED.

Actual immutable CDN byte equality and preview check recorded after push.
