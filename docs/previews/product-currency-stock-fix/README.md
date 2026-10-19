# Blue euro symbol and single-line warehouse labels

2026-10-19. Preview branch `preview/product-detail-compact-pro-20261019`.
Baseline `d5e8131cc76e9a3a8f5796be8016a5a373c11a21`.
No merge, release/tag, production loader change or deployment.

## Changes

- Include the existing euro symbol in the blue native price text span, using the
  existing #2454A6 token. Keep `display: contents`, the original text, amount,
  spaces, price attributes and native price updates. Units and VAT-exclusive
  prices retain their existing colours. Cart/modal/checkout prices stay excluded.
- Product cards use an intrinsic inline grid for warehouse label and quantity.
  The full CENTRÁLNY SKLAD label stays together; quantity is centred below it.
  Replace Apollo's fixed 65%/35% price/stock flex bases with automatic bases.
  This reserves the label's real width, keeps price/stock separate, and preserves
  the native offer row's wrapping fallback in very narrow cards. The existing
  mobile-only correction now also covers tablet, desktop and relocated homepage
  carousels. No warehouse data, colours, font sizes or logic change.
- Retain native feed capitalisation of product names from the preceding fix.
  Detail layout, variants, gallery, quantity controls and CTA remain unchanged.
- Keep existing gzip limits: inline the unchanged single-observer setup, share the
  identical secondary-price colour declaration (including its original tile
  specificity), and remove two unused tokens, `--ts-color-delivery-date` and
  `--ts-service-gap`. No remaining source references exist for either token.

## Verification

All checks passed:

- 18 before/after page comparisons at 1440, 768, 430, 390, 375 and 320 px:
  native search cards for CIRAT 356618 (the exact screenshot product), K-BLUM
  499061, and 32 native homepage carousel cards. 204 card instances checked for
  one-line label, centred quantity below it, no price overlap, blue amount + €,
  unchanged unit and net-price colours/text/fonts, original title text and no
  page overflow. Narrow catalogue cards may put stock below the price safely.
- 12 detail comparisons: 494606 and 499061 at all six widths. Native title,
  gallery/variant-card dimensions, price dimensions, units, net price,
  availability/delivery, quantity control and CTA metrics preserved.
- Dynamic native price replacement: thousands, zero, `od` prefix, `/ sada`,
  `/ pár`, `/ m`, raw `/ 1 ks`, and character-data updates. Euro stays blue;
  units stay neutral; no nested/duplicate wrappers after repeated native events.
  Native form/input identities and values retained; no JavaScript page errors.
- Add to cart and open native cart: no blue-price wrappers in mini-cart,
  confirmation modal or cart; cart-title presentation unchanged from baseline.
- `npm run build`, `npm run lint`, `git diff --check` passed. Gzip: JS 31,738 /
  31,744 bytes; CSS 25,595 / 25,600 bytes. Version and budgets unchanged.

Native 1440 px homepage card (354554, 269.5 px content width): warehouse text
bounds change from 76.14 × 32.98 px (two lines) to 121.42 × 15 px (one line).
The price text keeps its 111.81 px width. Price-right → label-left clearance is
36.27 px; label/count centres both x=262.29 px. The full stock block stays inside
its original card boundaries. These are rendered text-range/element bounds,
not just CSS declarations. See [verification.json](verification.json).

No known regression found in the final checks. Third-party variant API
`friends.shopcode.cz` is blocked by the test environment. Detail comparisons use
identical browser-only variant-response fixtures on both sides (Jota's eight
reference cards, no 499061 fixture membership); this does not verify live
supplier variant membership. Native card/stock data and cart responses are live.
No API fixture is shipped. No feed, admin or warehouse project changes.

## Screenshots

| Native view | Desktop | Mobile 390 px |
| --- | --- | --- |
| CIRAT 356618 search card | [Desktop](cirat-1440.png) | [Mobile](cirat-390.png) |
| Narrow homepage carousel card | [Desktop](carousel-1440.png) | [Mobile](carousel-390.png) |
| K-BLUM 499061 detail price | [Desktop](detail-499061-1440.png) | [Mobile](detail-499061-390.png) |

## Files

- `src/modules/product-text-cleanup/index.js`
- `src/styles/overrides/product-card.css`
- `src/styles/tokens.css` (unused-token cleanup only)
- Rebuilt `dist/timber.min.{js,css}` and their source maps.
- This report, `verification.json` and six screenshots.

For the immutable preview use this commit's full SHA in `?ts_preview=<SHA>`.
Example target: `/vyhladavanie/?string=356618&ts_preview=<SHA>`.
