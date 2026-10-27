# M2/C3 — Consistent desktop card edges and units, v0.7.3-rc.3

Extends rc.2; preview only, no main merge/release/production loader change.

Desktop cards now align stock and quantity to the left and prices/cart button to the right. Both offer and controls have an identical 2px inset in addition to the existing card padding. The former centring is removed. A 118px first column leaves more room for prices. Amount and unit use an explicit nowrap flex row with a 2px gap, eliminating incidental HTML whitespace wrapping for balenie. On cards at most 300px wide, every unit moves to a second line at the same breakpoint; no product-specific wrapping.

Classic desktop title is 19px instead of 18px, keeping four reserved lines and the separator. Desktop stock labels (cards and table) are 12px instead of 13px; counts unchanged. The desktop table retains its regular-weight name, 19px blue price and two-row layout. No mobile rule changes. User explicitly reaffirmed the mobile layout: „Na mobile je to perfektne. Tam to pekne vojde.“

## Verification

- 23 Chromium cases / 700 cards at 375/992/1024/1440/1920px: stock category, central-stock category, homepage, grid and desktop table. Verify shared left/right edges, no overflow, stock font 12px, table price 19px and row alignment, names bold only in grid, parentheses. Full lossless measurements are in alignment.json.gz; summary.json lists outcomes.
- Exact reference products 11455 (pár), 344255 (balenie), 381119 (ks) have identical gross top/height and net top within a shared native grid at 992/1024/1440/1920px (all measured differences 0px). This is an explicit geometry fixture: unmodified public product cards fetched from real search pages are placed together in one native category grid. Native shopping is tested separately; no claims of buying from this fixture. See reference.json and reference-1440.png.
- Native add/popup/cart quantity/shipping/payment to personal details at 375/1440px PASS. No order submitted.
- Mobile at 375px: category and homepage title metrics, clamp, separator state and stock/price overlap compare identically against rc.2 CSS (mobile-parity.json). Actual immutable CDN verification follows push.
- ESLint/build/whitespace PASS. JS 32.31/32.5 KiB, CSS 29.44/29.5 KiB. No budget increase over rc.2. Safari/iPhone and PageSpeed NOT TESTED.

Initial checks route local candidate dist files on the native public site; this is not production activation evidence.
