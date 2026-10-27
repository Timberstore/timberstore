# M2/C3 — Native image-overlay SKU on mobile, v0.7.3-rc.7

Apollo hides the native .p-code at phone widths (computed display:none at 375px, block on tablet/desktop). Scoped CSS below 768px reveals the existing real badge on category/search/brand/homepage/detail-recommendation cards. The existing label/value stay inline as KÓD: value, without the native mobile stacking. Native absolute positioning, colour, 94%-white contrast background, value and text formatting stay intact. Product detail metadata, popup rows, desktop table, mobile filters and purchase behavior are not changed. Includes the requested rc.6 24px desktop purchase gap. Preview only; no production loader change.

20 Chromium scenarios / 465 cards at 320/375/480/768/1440px: category, brand, homepage carousels and native detail recommendation. Code is present/visible, contained in its card's image band above the title, with no overlap against default flags. No page errors. Lint/build/whitespace PASS. JS 32.43/32.5 KiB, CSS 29.69/29.75 KiB, unchanged allowances. No duplicate purchase run for CSS-only visibility/inline rules; previous native purchase/gesture evidence remains historical. Safari/iPhone and PageSpeed NOT TESTED.

Initial geometry uses locally routed candidate files on the public native shop. Actual immutable CDN CSS/JS exact-byte checks and four actual mobile CDN cases (category/homepage at 375/480px) pass, explicitly checking a real SKU and same-line label/value geometry; cdn-assets.json and cdn-verification.json.

Preview: https://www.timberstore.sk/?ts_preview=f161df4c93b31650c87807e9e80b22cac14a6b27

Source/build fixed at this commit; subsequent commits only add evidence.
