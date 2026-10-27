# M2/C3 — Native image-overlay SKU on mobile, v0.7.3-rc.7

Apollo hides the native .p-code at phone widths (computed display:none at 375px, block on tablet/desktop). One scoped CSS display:block!important override below 768px reveals the existing real badge on category/search/brand/homepage/detail-recommendation cards. Native absolute positioning, colour, 94%-white contrast background, value and text formatting stay intact. Product detail metadata, popup rows, desktop table, mobile filters and purchase behavior are not changed. Includes the requested rc.6 24px desktop purchase gap. Preview only; no production loader change.

20 Chromium scenarios / 465 cards at 320/375/480/768/1440px: category, brand, homepage carousels and native detail recommendation. Code is present/visible, contained in its card's image band above the title, with no overlap against default flags. No page errors. Lint/build/whitespace PASS. JS 32.43/32.5 KiB, CSS 29.67/29.75 KiB, unchanged allowances. No duplicate purchase run for a display-only CSS rule; previous native purchase/gesture evidence remains historical. Safari/iPhone and PageSpeed NOT TESTED.

Initial geometry uses locally routed candidate files on the public native shop. Actual immutable CDN evidence follows push.
