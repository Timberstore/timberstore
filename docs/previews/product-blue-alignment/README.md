# TimberStore — Blue Unification and Variant Alignment

2026-10-19. Same preview branch `preview/product-detail-compact-pro-20261019`,
reference `5ad468998b94e604dac5db405a5470ff1618b9d9` with the standalone purchase
panel. No merge, release/tag, production loader change or production deployment.

## Computed colour and scoped inventory

The actual native brand-name span on TULIP/AGOFORM computes to
**rgb(36, 84, 166) = #2454A6**. The brand-label text computes to
**rgb(74, 82, 94) = #4A525E**. Both were measured before choosing the token.

`--ts-color-blue: #2454a6` is the shared root custom accent. Existing component
names remain compatibility aliases; no native Apollo primary/link palette was
changed. Only these audited custom foreground/accent owners are unified:

| Custom owner                                                      | Before  | After / mechanism                                    |
| ----------------------------------------------------------------- | ------- | ---------------------------------------------------- |
| Detail code number, brand name, delivery link, mobile Show more   | #2454A6 | Same shade; `--ts-compact-blue` aliases shared token |
| Header/mobile cart quantity bubble                                | #29465B | #2454A6 via `--ts-color-cart-count-bg`               |
| TimberStore in-cart quantity badge on CTA                         | #29465B | #2454A6 via existing `--ts-color-in-cart` alias      |
| Custom `Novinka` product flag                                     | #29465B | #2454A6 via compatibility `--ts-color-steel`         |
| Custom information-message border                                 | #29465B | #2454A6 via same alias                               |
| My Order custom links and default information flag in shadow root | #29465B | #2454A6 via same alias                               |

The code chip keeps its #EAF1FC background. Existing `.p-code-label` is neutral
#4A525E, identical to `ZNAČKA:`; only its existing sibling value span is blue,
identical to the brand-name span. No HTML, native code value, product identifier,
data attribute or text node was changed. Before/after native code and brand
HTML strings are identical in all tested products/viewports.

### Intentional exceptions

- Facebook #1877F2 and the original Instagram gradient retain brand identity.
  Original carrier logos/images/colours are untouched.
- Native Shoptet/Apollo link/icon colours and existing orange CTAs remain.
  Neutral dark product/price text, blue-grey control/table borders and soft
  surface colours are neutrals, not custom saturated blue accents.
- Availability/free shipping stay green #00C853. Errors remain #B83B43;
  warnings keep the current orange treatment. Default information blue does
  not replace the success/warning/cancelled overrides in My Order.
- Steel medal/ranking grey #84919B remains a distinct ranking material, not an
  accent. Bronze/gold ordering distinctions remain.
- Light-blue chip #EAF1FC and information surface #EAF3F7 remain light surfaces;
  neither is replaced with a saturated foreground colour.

Audit covered `src` CSS/JS, legacy colour literals, token owners and usages,
cart/header/detail overrides, semantic notifier styles and My Order shadow CSS.
No other independent custom saturated blue owner was found. Neutral blue-greys,
legacy neutral table surfaces and social brand colours were intentionally kept.

## Variant geometry — card sizes unchanged

The native heading and first visible card already begin on the same x coordinate.
The purchase panel had its own extra 15 px inset at desktop/tablet and 10 px on
mobile. Making the panel span the native grid fixes both edges without changing
variant dimensions or the gallery. The existing orange token
`--ts-color-accent` (#D4884A) now colours the variant heading; original 600 weight,
text, transparent background and interactions are unchanged.

Preference order was respected: inspect frame first, retain already symmetric
frame geometry at desktop/mobile, fix the asymmetric tablet frame, then remove
the panel's additional horizontal inset. No card resizing was needed. No new
negative margin, transform, card width, image height/aspect-ratio or gap rule.
The original Apollo grid gutters remain; no attempt was made to counteract them
with another offset. Main info/gallery column x positions and widths stay native.

Measurements use `getBoundingClientRect()` for section, heading, individual
`.friend`, visible `.friend .p`, image, panel and gallery. Below are TULIP results;
AGOFORM has the same edge deltas. Raw measurements for all 18 combinations are
in [verification.json](verification.json).

| Width | Panel left minus first card, before → after | Panel right minus rightmost card, before → after | Heading minus first card, after | Frame inset left / right, after |
| ----- | ------------------------------------------- | ------------------------------------------------ | ------------------------------- | ------------------------------- |
| 1440  | +15 → 0 px                                  | −15 → 0 px                                       | 0 px                            | 5 / 5 px                        |
| 768   | +15 → 0 px                                  | −15 → 0 px                                       | 0 px                            | 5 / 5 px                        |
| 430   | +10 → 0 px                                  | −9.953 → +0.047 px                               | 0 px                            | 10 / 10.047 px                  |
| 390   | +10 → 0 px                                  | −9.969 → +0.031 px                               | 0 px                            | 10 / 10.031 px                  |
| 375   | +10 → 0 px                                  | −9.969 → +0.031 px                               | 0 px                            | 10 / 10.031 px                  |
| 320   | +10 → 0 px                                  | −10 → 0 px                                       | 0 px                            | 10 / 10 px                      |

At 768 px the former frame inset was 5 / 15 px; removing its extra decorative
right extension gives 5 / 5 px without moving the native columns or any card.
The <=0.047 px residual is existing percentage-column pixel rounding, below
0.1 px. Left edges and heading align exactly.

The right boundary is the rightmost card of a full row/native card grid. An
incomplete final row stays naturally left-aligned; it is not spread apart to
force its last item to the far edge. This preserves column count, native gaps,
ordering and the Show more layout. Card widths, heights, image widths/heights,
relative horizontal/vertical positions, gaps, links, active state and active
border/shadow are identical to baseline at every tested width.

Panel background/border/radius/padding and internal price/availability/delivery
styles remain. Its authorized wider horizontal extent lets existing adaptive
CTA rules respond naturally; CTA styles/height and quantity dimensions are
unchanged. No extra boxes or palette changes were added elsewhere on the page.

## Tests

| Product                                  | 1440 | 768  | 430  | 390  | 375  | 320  |
| ---------------------------------------- | ---- | ---- | ---- | ---- | ---- | ---- |
| 494606 — TULIP, 8-card reference replay  | PASS | PASS | PASS | PASS | PASS | PASS |
| 354068 — AGOFORM, 10-card layout fixture | PASS | PASS | PASS | PASS | PASS | PASS |
| 3204000193 — WIRELI, no image variants   | PASS | PASS | PASS | PASS | PASS | PASS |

WIRELI was identified by the exact requested name; its actual native code is
3204000193, rather than the request's 320400193.

All 18 combinations: no horizontal page overflow; shared blue code/brand;
neutral matching labels and unchanged chip background; unchanged native code
HTML/identifiers; unchanged title text/whole-word rules, gallery position/width,
price/stock/date values, unit/quantity/CTA styles and native form association.

At each product: native +/−, delivery popup, add-to-cart confirmed on `/kosik/`,
actual header/mini-cart/cart count blue and unchanged 36 px orange-bordered
mini-cart quantity: PASS. AGOFORM fixture's mobile `Zobraziť viac` remained blue
and showed all 10 cards when clicked. Card links and order match baseline.

Isolated rendered style probes additionally verified Novinka, information
border, CTA count badge and My Order shadow-root link/flag inheritance against
the new token. Error/success styles and social/ranking/positive/orange/light
surface tokens matched baseline. No authenticated order/customer data was
accessed; actual My Order account UI was not re-tested.

No new regressions or browser JavaScript errors detected. `npm run lint`,
`npm run build`, `git diff --check`: PASS. JavaScript bundle is byte-identical
to reference. Gzip: CSS 24.94 KiB / 25 KiB; JS 30.48 KiB / 31 KiB.

### Verification limits

Chromium responsive viewports, not physical Safari. The live friends.shopcode
API is excluded by environment policy. Geometry/function checks use the
unchanged native addon with an 8-card public TULIP reference and a 10-card public
catalogue layout fixture for AGOFORM. The latter includes mixed catalogue
products and tests geometry/expansion, not actual AGOFORM catalogue membership.
No replay data is included in application code or preview assets. The live site
continues to use its original API and native variant navigation.

Screenshots below use the TULIP reference replay and the actual WIRELI product
without variant fixtures. Captures include the whole decorative frame so native
visible overflow is not cropped; fixed header/notices are hidden only during
capture, not in the application.

## Screenshots

| Product | Desktop 1440                                  | Mobile 375                                   | Narrow mobile 320                            |
| ------- | --------------------------------------------- | -------------------------------------------- | -------------------------------------------- |
| TULIP   | [Screenshot](screenshots/494606-1440.png)     | [Screenshot](screenshots/494606-375.png)     | [Screenshot](screenshots/494606-320.png)     |
| WIRELI  | [Screenshot](screenshots/3204000193-1440.png) | [Screenshot](screenshots/3204000193-375.png) | [Screenshot](screenshots/3204000193-320.png) |

## Changed files

- `src/styles/tokens.css` — shared custom blue and compatibility aliases.
- `src/styles/overrides/product-compact.css` — neutral code label/blue value,
  orange variant heading, panel/card edges and symmetric tablet frame; remove
  superseded inert declarations without altering final purchase styles.
- `dist/timber.min.css`, `dist/timber.min.css.map` — regenerated CSS.
- `CHANGELOG.md`; this report, `verification.json`, six screenshot PNGs.
