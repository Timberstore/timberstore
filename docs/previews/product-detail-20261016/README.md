# Product detail — isolated preview, 16 October 2026

Base: `217bde001fa32d68595048111f1d0499aa8cccb4` (main, stable v0.6.11).
Branch: `preview/product-detail-20261016`.
The client approved implementing the proposed detail layout in preview only.
No merge, numbered release, GitHub Actions release/build, tag, loader/admin change or production deployment is authorized here. A Trello card code was not supplied.

## Preview implementation

- Product area: 52/48 desktop grid from 1200px, one column below; native sidebar retained. Tablet gallery capped at 640px; photos keep a 4:3 contain frame without cropping. Mobile title remains above the native gallery.
- A purchase section wraps the original Apollo grid through the original add-to-cart block, including any intervening content. No cloned fields, new cart form, quantity arithmetic, prices, warehouse counts, schema data or cart AJAX implementation.
- VAT-inclusive native price is primary, VAT-exclusive and unit/measurement prices remain. A Slovak VAT label and shorter visible cart button text are presentation only. Native accessible product name and button children are retained.
- Exact native availability labels `Skladom` and `Centrálny sklad` receive the client-supplied dispatch guidance (1–2 and 5 working days). Current visible parameter-dependent availability only; unknown, unselected, unavailable, invalid/insufficient amounts or disabled purchase produce no new promise. A count such as >100 is treated conservatively as a lower bound.
- Native delivery date and shipping-options link remain separate from dispatch guidance. No calendar/date calculation or fixed free-shipping claim.
- Existing description, parameter rows/category links, documents, discussion, related/alternative blocks and controls remain. Only a genuinely empty leftover Apollo parameter table is excluded from layout; it is retained in the DOM and becomes visible if populated.
- Initialization waits for Apollo's `is-loaded`, is idempotent and uses a local info observer for native variant updates. Gallery swipe remains the existing module. A ResizeObserver refreshes the existing Shoptet CloudZoom instance through its jQuery API when the gallery size changes, keeping its native interaction layer aligned.
- All new visual rules are restricted to the product detail. Existing header, navigation, sidebar, cart, checkout, related cards and global palette are retained.

## Local build and release boundary

```sh
npm run lint
TIMBER_PREVIEW=product-detail npm run build
```

Package/package-lock stay at 0.6.11; the preview bundle identifies itself as `v0.6.11-preview.product-detail`. The existing loader will display its actual selected commit SHA. Use immutable SHA with `?ts_preview=<sha>`; do not point production to this branch.

The CSS allowance is **23 KiB only when `TIMBER_PREVIEW=product-detail`** (client's standing allowance authorization of 15 October). Default stable-version allowances remain unchanged. Default `npm run build` on this work-in-progress correctly fails the unchanged stable CSS allowance; use the explicit preview command. This is not a release-version bump.

Measured gzip using Node zlib, matching the build:

| Bundle | Stable base | Product preview | Preview limit |
| --- | ---: | ---: | ---: |
| JS | 26,456 B | 27,880 B | 30 KiB |
| CSS | 21,473 B | 22,682 B | 23 KiB |

## Verification

TLS-verifying curl transport with the environment's configured proxy feeds real live storefront responses into Chromium; unrelated analytics domains are excluded. During local development only the two Timber dist URLs are intercepted with this branch's files. Native Shoptet/Apollo and product/cart responses come from the live store. Tests use isolated browser sessions and do not submit orders or payment.

`layout.json`: 15 product/viewport combinations, widths 320/375/390/430/768/1024/1200/1440/1920. Stock piece, central-warehouse set, central-warehouse metre products; no page overflow and one panel per detail; native unit prices/warehouses/dates retained.

`zoom.json`: one native zoom trap, matching photo dimensions after 1440 → 390 → 320 → 1024 → 1440 changes; original desktop hover zoom opens.

`regression.json`: homepage and category header/navigation/sidebar/first-card geometry and colors match stable CSS, no detail module instantiated, no captured runtime/request errors.

`functional.json`: original description/parameter text, repeated lifecycle and retained node identity, native +/- and conservative dispatch-state fixtures, desktop thumbnails/lightbox, files/discussion tabs, actual server cart updates and the original related-product form. A fresh touch context verified swipe followed by native lightbox open/close.

**Checkout limitation:** normal-animation headless Chromium attempts did not complete the entire shipping/payment → customer-details flow reliably. The actual stable production v0.6.11 bundle was tested as a control and also produced `Transition was skipped` and a stalled click at checkout. This does not establish that the public store is broken. Product and related-product server cart submissions were verified. A supplementary Chromium touch run used the native `transition.skipTransition()` API in the test harness only, then successfully selected courier shipping and bank transfer and navigated to the visible customer email field at step 2. No application workaround was added and no order was submitted. Normal-browser checkout with its usual transitions remains a release gate; do not treat this preview as release-ready.

## Limits and review

No physical iOS Safari/Android device, WebKit run or PageSpeed/LCP/CLS benchmark was performed. Gallery touch testing uses Chromium's touch emulation. The 24 inspected homepage product examples did not expose native parameterValueId variants; selected/hidden parameter-dependent availability, unknown states and zero/insufficient stock were therefore tested as controlled native-markup fixtures, not represented as a live catalog variant test. A real variant product still needs specific catalog coverage before release.

Preview is for client visual review; production remains v0.6.11. `?ts_preview=off` exits the existing preview cookie.

## Published preview verification

Code preview commit: `b9c49e8b9ac2c6716df12bf3abcb34507a1936af`. Both jsDelivr assets returned 200 and match the locally verified build byte for byte. The initial CDN fetch timed out during propagation; verification was retried successfully before sharing links.

A Chromium session using actual CDN assets (no local interception) confirmed the original loader selected `b9c49e8`, `preview: true`, the preview badge, one purchase panel and the correct stock/central dispatch text. Resizing to mobile had no page overflow. `?ts_preview=off` restored actual production v0.6.11 and removed the new panel. No runtime/request errors were captured in this published smoke check. Details: `published.json`.

Only this preview branch was pushed. Main, tags, package version, the loader and production were left untouched. This documentation-only follow-up does not rebuild or release assets; the verified user preview stays pinned to the code commit above.
