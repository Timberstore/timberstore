# M2 — Complete price/unit centering, v0.7.4-rc.2

Replaces rc.1 numeric-only centering after owner clarification: amount, EUR, slash and unit are one centred line above VAT. All rc.0 product/control changes retained; preview only.

Mobile classic cards centre the entire price line over the same cart/VAT column. PC classic cards and homepage favourites retain the full amount/unit on one line. PC related/similar cards use an intrinsic-width two-row price grid, both complete lines centred, anchored at the cart's right edge. This shifts their centre 23.33px right compared with rc.1 on the pictured StrongPower rail, while retaining the 12px card inset, stock rows, native quantity handlers and four desktop cards. No numeric-only side track or narrow-unit fallback remains.

18 Chromium scenarios / 331 buyable cards: catalogue 320/375/480/600/767/992/1440px; StrongPower similar and FRANKE related 375/992/1440/1920px; homepage favourites 992/1440/1920px. Checks measure the full amount-through-unit span against VAT (or the cart centre on mobile), not the numeric amount alone. Maximum checked centre error <1px; related/similar price block right edge equals cart right edge. Photo SKU 255328 is present and checked. Full metrics: verification.json.gz.

Browser-only unit fixtures ks/balenie/pár/sada, including 1 234,56 €, check centred complete lines, clipping and stock/net separation at 320/375 mobile and 1440 PC (fixtures.json); no shop data modified. Run the compressed check from repo root by decompressing check.py.gz to /tmp and invoking Python. Script routes local candidate dist over the native public shop. Function JS differs only by version; rc.0 purchase checks remain evidence of native functionality, not represented as rerun for this CSS correction.

Lint/build/whitespace PASS. Existing rc.1 limits retained: JS 32.99/33.25 KiB, CSS 30.42/30.625 KiB. Safari/physical iPhone and PageSpeed NOT TESTED. Immutable CDN verification follows publication. No main merge, stable tag/release or production loader change.
