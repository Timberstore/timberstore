# M2/C3 — Stock and price row, v0.7.3-rc.0

Preview from main after v0.7.2. No production loader update, stable tag, release or merge.

## Change

Native offer becomes a two-column grid: availability left, price right. The old stock top margin is removed; the net amount keeps its existing parentheses. Central stock has an explicit first-word line break; the original label/count spans, values, units and attributes remain native. The final warehouse word and count share inline flow with a nonbreaking separator. Detail purchase data/desktop list columns are preserved. Shared related/similar/popup cards use the same warehouse label treatment.

Narrow catalogue phones (up to 479px) show one wider tile per row to fit readable stock and price. Owner explicitly confirmed the one-card mobile layout: „Áno, na úzkom mobile jedna karta v riadku“. Native homepage Swiper slides keep their dimensions; offers within cards at most 220px wide wrap into a stock-left / price-right stack to avoid overflow. Wider homepage cards retain the shared row.

## Validation

- 28 Chromium layouts: category, central-stock search, brand and homepage at 320/375/480/768/1024/1440/1920px; 651 cards, no stock/price overlap, no overflow, central count follows SKLAD. Net parentheses checked through pseudo-elements in layout.json. Native amounts/units are not recalculated.
- Native purchase smoke at 375/1440px: cookie/menu checks, home/category/brand/detail, original add POST, completed popup without white/blank frames or background displacement, cart quantity increase, shipping/payment through personal details. No order submitted.
- Desktop list/grid restoration and five-digit quantity checked separately in list.json.
- ESLint, build, whitespace checks. JS 32.31 / 32.5 KiB gzip; CSS 28.83 / 28.875 KiB. Historical version budgets unchanged; small preview allowances follow recorded 15 October authorization.

The 28 layout and purchase checks use locally routed candidate dist files on the real native public shop. Separately, cdn.json verifies exact CSS/JS bytes and actual immutable-preview browser checks at 375/1440px; the four screenshots are from those actual CDN checks. This is not production activation evidence. The check scripts use Python Playwright with /usr/bin/chromium and the inherited HTTPS_PROXY; TIMBER_STOCK_WORK selects scratch output.

Safari/iPhone and PageSpeed are NOT TESTED. The overall visible preview still awaits review before merge/release.

## Review link

https://www.timberstore.sk/?ts_preview=2e3b7b64e860882627d7ec0458c19b8c35ac5693

Fixed source/build commit 2e3b7b64e860882627d7ec0458c19b8c35ac5693. Following commits only add verification evidence. To leave preview: ?ts_preview=off.
