# M2 — Price centering, v0.7.4-rc.1

Preview follow-up to rc.0; all previous changes retained. No stable tag/release, main merge or production loader change.

Mobile classic catalogue cards share the same 118px quantity column, 14px gap and flexible right column for offer/form. Main amount is centred over the cart CTA, with the secondary unit adjacent. VAT price uses the same centre. Cards <=280px centre the complete amount/unit line instead, so long units remain readable and within the card. Narrow homepage rails retain their existing stacked purchase fallback.

On PC >=992px, related/similar cards centre the main numeric amount over the VAT price. The unit occupies a separate equal-side grid track and cannot move the numeric centre when it arrives. Offer columns use 0.75fr/1.25fr to retain room for units; text stays on its original two stock/price rows. Four desktop items and quantity/icon layout unchanged. Homepage favourite cards use the same numeric/VAT centre, preserving the existing unit-below layout on <=300px desktop cards.

## Verification

15 Chromium scenarios / 238 buyable cards: catalogue at 320/375/480/600/767/1440px; StrongPower similar and FRANKE related at 375/992/1440/1920px; homepage favourites at 1440px. Centres measured to <1px, fields/buttons and unit bounds checked. A wrapped VAT paragraph is compared by its centred line box, not the asymmetric union of text fragments with parentheses. Additional homepage 992/1920 checks passed during development.

Long-unit fixtures ks/balenie/pár/sada at 375/1440, sums up to 1 234,56 €, retain stock/price row separation and placeholder-to-real-unit geometry (units.json). Separate synthetic mobile unit fixtures exercise 320/375px (mobile-units.json.gz). Fixture data is browser-only; no product data changes or order submits. CSS-only follow-up, function JS identical except version; previous rc.0 native purchase check at 375/1440 retained, not misrepresented as rerun.

Lint/build/whitespace PASS. JS 32.99/33.25 KiB; CSS 30.51/30.625 KiB under recorded 2026-10-15 authorization, old limits unchanged. Safari/physical iPhone and PageSpeed NOT TESTED. Initial checks route local candidate bundles on the native shop. Actual immutable CDN CSS/JS exact-byte checks PASS (cdn-assets.json); 3 actual-CDN scenarios / 68 cards PASS without local asset replacement: 375px catalogue, 1440px similar products and 1440px homepage favourites (cdn-verification.json.gz).

## Preview

Source/build frozen at 119afca61422f549ef5a289427bc9e348faadd00; follow-up commits contain evidence only. Draft PR #59 supersedes #58 without merging.

- Catalogue: https://www.timberstore.sk/spojovaci-material/?ts_preview=119afca61422f549ef5a289427bc9e348faadd00
- Similar products: https://www.timberstore.sk/strongpower-elektricka-zasuvka-3x-230v--schuko--strieborna/?ts_preview=119afca61422f549ef5a289427bc9e348faadd00
- Favourites: https://www.timberstore.sk/?ts_preview=119afca61422f549ef5a289427bc9e348faadd00
