# Product Detail Final Polish — preview only, 2026-10-19

Continuation of `a5d132ee5afb4fd3782ac60cb7330b2311f8ed16` on the same branch
`preview/product-detail-compact-pro-20261019`. No merge, production loader edit,
release tag or production deployment. Warehouse-stock, gallery implementation,
variant addon/card CSS and the existing checkout implementation stay unchanged.

Tested products:
- 494606: `/tulip-knopka-jota-zlata-matna/`
- 354068: `/pribornik-classico-kristall-softtouch-722x474mm-cierna/`

## Four implementation phases

1. **Information rows** (`e52d447`): blue brand value with neutral label; one blue
   delivery/date badge containing the original native nodes; net price in smaller
   parentheses beside the main price, with natural wrapping; original details,
   question and watchdog links grouped in one wrapping flex row. No price math,
   currency substitution, new contact link or duplicate native nodes.
   [Phase 1 evidence](phase-1.json).
2. **Purchase area** (`f71b488`): cart-style quantity shell with 44 px +/- targets,
   readable input and a wider orange native CTA. Native min/max/step, input,
   tooltips and handlers remain. CTA wraps as a whole when its label/icon cannot
   fit safely beside quantity. Final minimum basis is 210 px.
   [Phase 2 evidence](phase-2.json).
3. **Delivery popup** (`78a1602`): same `splitShippingName` helper as checkout;
   stronger method name followed by a separate lighter delivery term. Original
   prices, carrier logos, tooltips and native popup remain. Mobile uses the
   checkout pattern: full-width name/info, then logo left and price right.
   A scoped resize bridge invokes existing Colorbox sizing only for this popup.
   No delivery radio/form or new selection behavior is introduced: the native
   product popup is informational. [Phase 3 evidence](phase-3.json).
4. **Variants/responsiveness**: only the existing `friendsShowMore` below 768 px
   gets soft royal-blue styling and a minimum 44 px target. Desktop styling is
   retained. Final checks repeat phases 1–3 after the last changes, including
   whitespace cleanup in the native net-price node and the CTA wrapping fix.
   [Final responsive evidence](phase-4.json), [native function evidence](native.json),
   [variant comparison and expansion evidence](phase-4-variants.json).

## Verified scope

Both actual product pages: desktop 1440 and 768/430/390/375/320 px, with no page
horizontal overflow. Prices/currency remain native and dynamic; a controlled
net-price replacement was correctly formatted without recalculation. Both native
headline locations keep whole-word wrapping. Metadata, delivery/date, action-link
alignment, CTA/quantity target size, repeated module initialization and a single
native form passed. Shipping popup rows passed all widths, including resizing
an already-open popup from desktop to mobile.

Native function checks: minimum quantity clamp, +/- controls, typed quantity,
product detail tab, question and watchdog dialogs (opened only), and the requested
product actually present in an anonymous native cart. No message, watchdog
subscription, order or payment was submitted. No page JS exceptions in the
completed native-function and phase 1–4 responsive reports. Full lint, budgeted build and whitespace checks passed.

## Regressions found and addressed

- **Apollo full-width social wrapper:** prevented the details/contact links from
  sharing a desktop row. Width is now auto only inside the local action row.
- **Open Colorbox after viewport narrowing:** retained desktop pixel dimensions
  and caused horizontal overflow. The existing Colorbox resize API now recomputes
  the product shipping popup width. Both products passed the resize sequence.
- **CTA icon wrapping below its text on narrow mobile:** the initial flexible
  basis was too small. The CTA now moves as a whole below quantity when needed.
  Final tests also require its normal label/icon row to remain below 60 px tall.
- **Net-price whitespace:** server indentation created a space just after `(`.
  Only leading/trailing native text-node whitespace is normalized; the value and
  currency stay intact.

One additional automated contact-popup attempt on product 354068 exceeded its
15-second wait. Repeating the same source build passed both contact dialogs and
cart checks for both products. This was not reproduced as a product regression;
the cause was not established, so real-browser contact dialogs remain worth a
manual check.

## Additional test observations

The immediate synthetic variant response exposed a native timing sensitivity:
depending on whether it arrived before or after Apollo assembled its grid, the
unchanged addon could place its section in different containers. This happened
with the original preview as well as the new build. Final visual comparisons
hold the synthetic response until Apollo's native `.p-info-grid` exists;
they compare the same native state and disable button transitions while sampling
final colours. Live API timing remains unverified and the addon is not rewritten.

Rapid model navigation also produced Chromium's `Transition was skipped` without
an actionable stack. This is already documented in
[older cart checks](../cart-final.md) and is retained separately in the final
variant report. It is not classified as a confirmed new Timber exception; no
gallery or native transition implementation was changed. Assertions sample final
DOM state with timed polling rather than relying on animation-frame readiness.

## Limits

- Existing `friends.shopcode.cz` variant API is outside the environment allowlist.
  Its live data/service was not fetched. Many-variant expansion tests use an
  explicitly synthetic 10-card API response assembled from actual catalog
  images/links, rendered by the unchanged original addon. This does not establish
  the actual variant relationship or live service availability. No fixture ships.
- Chromium and mobile/touch emulation; no physical iPhone SE, actual iOS Safari,
  Safari-specific rendering audit or PageSpeed measurement.
- Native quantity/cart interactions use native DOM handlers programmatically;
  they do not establish physical touch ergonomics on a real phone. Third-party
  services outside the allowlist were excluded. No form was submitted externally
  except the explicitly tested anonymous native add-to-cart operation.

## Build and preview

Development package `0.6.13-compact.1`: JS 30.27 KiB gzip / 31; CSS 24.69 / 25.
Allowance applies only to this preview under the recorded 2026-10-15 authorization;
all older version limits and production settings remain unchanged.

Enable with this branch's final commit SHA:
`https://www.timberstore.sk/tulip-knopka-jota-zlata-matna/?ts_preview=<SHA>`
Then product 354068 uses the same preview cookie. Disable via `?ts_preview=off`.

## Final variant comparison result

Both products passed all six widths: original card/image dimensions, order,
active marker, links and gallery targets matched the preceding preview. The
existing expansion button showed 8 then 10 model cards; native thumbnail switching
and product navigation passed. Desktop expansion-button colours matched the old
preview; below 768 px they were #2454A6 on #EAF1FC.

The final comparison retained one known Chromium `Transition was skipped` message
and zero unexpected exceptions. It is included verbatim in the JSON report.

## Changed files since the preceding preview

- `CHANGELOG.md`
- `CONTRIBUTING.md`
- `dist/timber.min.css`
- `dist/timber.min.css.map`
- `dist/timber.min.js`
- `dist/timber.min.js.map`
- `docs/previews/product-final-polish/README.md`
- `docs/previews/product-final-polish/native.json`
- `docs/previews/product-final-polish/phase-1.json`
- `docs/previews/product-final-polish/phase-2.json`
- `docs/previews/product-final-polish/phase-3.json`
- `docs/previews/product-final-polish/phase-4-variants.json`
- `docs/previews/product-final-polish/phase-4.json`
- `package-lock.json`
- `package.json`
- `scripts/build.mjs`
- `src/core/selectors.js`
- `src/core/texts.js`
- `src/main.css`
- `src/modules/product-compact/index.js`
- `src/styles/overrides/product-compact.css`
- `src/styles/overrides/product-shipping.css`
