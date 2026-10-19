# Product Detail — Final Unification Fix

2026-10-19. Continuing `preview/product-detail-compact-pro-20261019` from
`f9b0a870115ca913aee5a5b3165c1e56374c51b5`. No merge, release/tag, production
loader change or production deployment.

## Result

The detail uses the existing mini-cart quantity presentation, extracted into
`quantity-control.css`. Original cart selectors and their specificity are
preserved; the new selector targets only the enhanced native product-detail
quantity. Removed the competing detail rules. There are no JavaScript changes,
new controls, handlers or alterations to native input attributes.

| Measured presentation, amount 1 | Detail | Mini-cart |
| --- | --- | --- |
| Shell width / height | 100 / 36 px | 100 / 36 px |
| Minus / input / plus columns | 30 / 38 / 30 px | 30 / 38 / 30 px |
| Outer border / radius | 1 px #C97A2B / 7 px | 1 px #C97A2B / 7 px |
| Inner dividers | 1 px #E5E0DA | 1 px #E5E0DA |
| Button background / sign colour | #F5F0E9 / #423E3E | #F5F0E9 / #423E3E |
| Input text | 14 px / 600 | 14 px / 600 |
| Signs / line-height | 18 / 18 px | 18 / 18 px |
| Button and input height / padding | 34 px / 0 | 34 px / 0 |

The input radius is explicitly 4 px, matching the previously inherited mini-cart
radius. The shell keeps its existing 7 px radius. Hover/focus rules also share
the original mini-cart foundation. Native mini-cart digit-dependent sizing is
retained; measured equality covers the tested ordinary quantities.

`Cena`, `Dostupnosť` and `MÔŽEME DORUČIŤ DO:` now use 14 px, weight 500,
21 px line-height and zero label padding/margins. Both section gaps measure
16 px. The delivery inset derives from the same section spacing token while
accounting for Apollo's nested availability grid gap. Main price hierarchy,
parenthetical net price and green date/stock remain. Longer delivery content
wraps naturally on mobile. CTA styling is unchanged: 22 px desktop / 14 px mobile
purchase gap, minimum 48 px button height; the shorter quantity is vertically
centred beside the button where the row fits.

## Verification

[Measured comparisons and native checks](verification.json).

| Product | 1440 px | 375 px | 430 px |
| --- | --- | --- | --- |
| 494606 — TULIP Knopka Jota | PASS | PASS | PASS |
| 354068 — AGOFORM Classico | PASS | PASS | PASS |

At every viewport, compared the actually opened mini-cart against the prior
preview and against the detail: mini-cart computed presentation unchanged;
detail rendered dimensions, borders, colours, inner padding, radii, input/sign
styles and alignment match. Flex blockification of `inline-grid` on the detail
and an unused inherited shell text colour are excluded from the equality check;
all visible input/sign colours are explicitly compared. Reopened the native
mini-cart after breakpoint changes before measuring it.

For both products: native + / − (1 → 2 → 1), typed amount (3 → 1), unchanged
min/max/step, one native product form, add-to-cart confirmed on `/kosik/`, and
working native delivery popup. Native prices, net price, stock/date text and
gallery links matched the previous preview. No horizontal page overflow.
Visual inspection of detail screenshots at 1440 / 375 / 430 px confirmed the
compact quantity and CTA placement. No new regressions detected in these checks.

`npm run lint`, `npm run build`, `git diff --check`: PASS. JS remains byte-identical
to the reference preview. Build: JS 30.27 KiB / 31 KiB; CSS 24.66 KiB / 25 KiB gzip.

Checks use Chromium responsive viewports, not physical iOS Safari. Unrelated
third-party requests, including the live friends.shopcode variant service, are
excluded by the test environment. Variant/gallery/warehouse source and handlers
were not edited; no new claim about that external service's live interaction is
made by this CSS-only fix. The captured page-error log records only any existing
native `Transition was skipped` warnings, with no unexpected JavaScript errors.

## Changed files

- `src/styles/overrides/quantity-control.css` — shared existing cart presentation.
- `src/styles/overrides/cart-presentation.css` — quantity block extracted unchanged.
- `src/styles/overrides/product-compact.css` — remove conflicting detail quantity
  rules; unify labels and section spacing.
- `src/main.css` — import shared quantity CSS.
- `dist/timber.min.css`, `dist/timber.min.css.map` — regenerated CSS bundle/map.
- `CHANGELOG.md`, this report and `verification.json` — review evidence.
