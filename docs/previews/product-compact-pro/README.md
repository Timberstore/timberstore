# Product Detail Compact PRO — isolated preview, 2026-10-19

Base: stable v0.6.13 / origin main `0c726ffe6986192721a3b62b3743b31c78a01b50`.
Branch: `preview/product-detail-compact-pro-20261019`. Package identifier
`0.6.13-compact.0` distinguishes this development build; no release/tag/merge.
The production loader, gallery code, native forms, external variant addon,
warehouse-stock and every non-detail component remain unchanged.
No Trello card identifier was supplied; PD Compact names this authorized preview.

## Changes

- Local right-panel frame drawn outside Apollo's negative gutters. It consumes no
  width, preserving the original percentage-based variant card/image dimensions.
- Product code in royal blue #2454A6 on #EAF1FC; code and brand share a wrapping
  flex row, including Apollo's separate mobile headline.
- Native final price and unit opposite Cena; native net price opposite Cena bez
  DPH. A small idempotent module removes only the redundant net-price suffix,
  reapplying after native text/node replacement. No price calculation or clone.
- Smaller availability heading and right-aligned original availability; subsequent
  native availability rows fit in the same grid column without warehouse logic.
- Existing date and delivery link share a wrapping row; click behavior retained.
- Title wrapping restored to whole words in both native headline locations.
  Unbroken identifiers scroll inside the title, never the entire page.
- Native discount and unit-price nodes retained; discounts follow the main rows.
- Empty/hidden-only Apollo parameter shells do not introduce extra section gaps.

## Verification

Chromium on real Shoptet/Apollo HTML and scripts; only Timber assets substituted
with this build during local QA. 320/375/390/430/768/1024/1280/1440 px: no page
horizontal overflow; native variant card/image dimensions, order, links and active
state equal the stable baseline. Both resizing and fresh mobile loads tested.
Short/long titles and a 160-character unbroken identifier tested dynamically.
Native price/currency node replacement, availability/date replacement, a second
stock row, discount row placement and repeated native content initialization
remain compatible. No new page JS exceptions in completed functional scenarios.

Native quantity 1 → 2 → 1, second gallery thumbnail, shipping options popup,
add to an anonymous cart (2,26 €), then navigation to the white Jota variant passed.
No order or payment submitted. [Detailed results](responsive-functional.json)
and [final CSS checks](final-css.json).

Build: JS 29.87 KiB gzip / 30; CSS 23.91 KiB / 24. CSS allowance applies only to
`0.6.13-compact.0`, under the recorded 2026-10-15 authorization. Stable v0.6.13
retains its 23.25 KiB limit. Build, full npm lint and whitespace check pass.

## Verification limits

- The existing variant addon calls `friends.shopcode.cz`, absent from the managed
  environment allowlist. Its live response was not fetched. The 0/1/8-card tests
  substitute an explicitly synthetic API response using actual catalog links and
  images, then execute the unchanged native addon. Live variant data/service
  availability still requires a normal-browser check; no fixture ships in dist.
- Short/long name and stock/price/discount edge cases are controlled DOM scenarios,
  not an exhaustive audit of catalog products, discounts or warehouse data.
- Chromium emulation only; physical iPhone SE, real iOS Safari and PageSpeed
  before/after were not available. Existing :has selectors require modern Safari.
- External analytics/search providers outside the allowlist were excluded.

## Files

- `src/modules/product-compact/index.js`
- `src/styles/overrides/product-compact.css`
- `src/styles/tokens.css`
- `src/core/selectors.js`, `src/core/texts.js`
- `src/main.js`, `src/main.css`
- `package.json`, `package-lock.json`, `scripts/build.mjs`
- `dist/timber.min.js`, `dist/timber.min.css` and both source maps
- `CHANGELOG.md`, `CONTRIBUTING.md`
- This README and the two JSON reports in this directory.

## Preview

Use the preview commit SHA in
`https://www.timberstore.sk/tulip-knopka-jota-zlata-matna/?ts_preview=<SHA>`.
The existing cookie enables preview only in that browser. Disable it with
`https://www.timberstore.sk/?ts_preview=off`. No production-loader change.
