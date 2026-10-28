# M2 — Mobile card controls and compact detail recommendations, v0.7.4-rc.0

Preview following owner-approved stable v0.7.3. No main merge, stable tag/release or production loader change.

## Change

Mobile classic cards show the existing Do košíka label plus native icon, 14px quantity/button gap instead of 8px, and 6px extra inward padding for stock/quantity and prices/button. Catalogue single-column threshold extends from 479px to 599px so a five-digit field and visible label fit; 600–767px retains two columns. Narrow homepage rails keep their slide widths and can stack quantity/button, with the label visible. Mobile stock/price lines share 22px line boxes.

Related/similar detail cards keep the native four-visible desktop carousel and its widths, original forms, quantity handlers and image/Swiper markup. They use 12px inner padding (remove the compounded native 16/30px plus inner padding), quantity left and a 40×38px icon-only native cart button right on the same line. Two 22px offer lines: stock first line and amount below; central first word on line one, SKLAD plus count on line two; gross plus unit right on line one, parenthesized net right on line two. Label 11px, gross 14px on narrow cards / 16px on wider cards, net/unit 10/11px. A fixed unit reservation retains height/amount position when the verified unit arrives. Popup/checkout and desktop catalogue/table styles remain outside these new scopes. All JS is byte-identical to v0.7.3 after replacing the version literal.

## Verification

- 23 Chromium layout scenarios / 317 buyable cards: category at 320/375/430/480/600/767/768/992/1440px; StrongPower similar and FRANKE related products at 320/375/600/768/1024/1440/1920px. Quantity fields >=64px, nonoverlapping text per corresponding offer line, button/quantity same center, padding, no clipping, two offer lines and four visible desktop recommendations checked. Mobile classic labels visible. Full metrics in verification.json.gz.
- Additional presentation-only unit fixtures ks/balenie/pár/sada (up to 1 234,56 €) at 375/1440 check first-row stock/gross and second-row count/net text bounds separately. They do not change shop data or submit cloned prices/units. Placeholder-to-real-unit geometry remains stable. Homepage has all 32 native mobile cart labels visible. extra.json.
- Native recommendation add amount 2, popup without blank/white frames or moving background, cart increment to 3, shipping/payment to personal details at 375/1440 PASS. No personal data filled and no order submitted. Initial test selected a parcel locker without a pickup point and correctly remained on shipping; final test selects address delivery. purchase-smoke.json.
- Lint/build/whitespace PASS; JS 32.99/33.25 KiB, CSS 30.32/30.5 KiB. Small preview CSS allowance under recorded owner authorization 2026-10-15; stable budgets unchanged. Safari/physical iPhone and PageSpeed NOT TESTED.

Initial tests replace only the native shop's Timber CSS/JS with local candidate dist. Final actual immutable CDN checks do not replace assets: exact CSS/JS bytes match (cdn-assets.json), and 4 scenarios / 44 cards PASS: 375px catalogue, StrongPower similar products at 375/1440px and FRANKE related at 375px (cdn-verification.json.gz). The previous stable release remains immutable.

## Preview

Source/build frozen at fd5e1ae0c637a021ed9329c8c6dc5d94b6d7b5dd; later commits add evidence only.

- Catalogue: https://www.timberstore.sk/spojovaci-material/?ts_preview=fd5e1ae0c637a021ed9329c8c6dc5d94b6d7b5dd
- Similar products: https://www.timberstore.sk/strongpower-elektricka-zasuvka-3x-230v--schuko--strieborna/?ts_preview=fd5e1ae0c637a021ed9329c8c6dc5d94b6d7b5dd
- Related: https://www.timberstore.sk/franke-drez-ubg-611-86-860x500mm-sedy-kamen/?ts_preview=fd5e1ae0c637a021ed9329c8c6dc5d94b6d7b5dd
