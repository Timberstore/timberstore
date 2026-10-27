# M2 — Four-line desktop product titles, v0.7.3-rc.1

Extends stock-price rc.0. Preview only, no stable release, main merge or production loader change.

At desktop widths >=992px, product tiles reserve four title lines instead of three. A 1px brand-orange separator at 28% opacity follows the title section before stock/price. No customer text or native product/form nodes are changed. Classic category/search/brand tiles, homepage and detail recommendation tiles share the rule. Native horizontal popup rows and desktop list/table are excluded. Widths below 992px receive no new rules.

## Verification

- 12 Chromium cases: category and homepage at 375/768/992/1024/1440/1920px; 372 cards. Desktop asserts four-line clamp, height = four line-heights, visible 1px orange separator and no stock/price overlap.
- At 375/768px compare measured name heights, clamp, divider, stock/price geometry with rc.0 CSS on the same native pages: identical. No mobile separator.
- All four desktop widths switch list/grid and verify the list retains its unclamped name and has no separator.
- Native purchase smoke at 375/1440px is recorded separately in purchase.json: popup, native cart quantity, shipping/payment to personal details. No order submitted.
- ESLint, build and whitespace checks pass. JS 32.31 / 32.5 KiB gzip; CSS 28.94 / 29 KiB. Only rc.1 receives its small documented CSS allowance; older budgets remain fixed.

Initial title measurements/screenshots use locally routed candidate bundles on the public shop. Actual immutable CDN evidence is added after push. Safari/iPhone and PageSpeed NOT TESTED.
