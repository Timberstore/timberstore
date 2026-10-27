# M2/C3 — Desktop purchase alignment, v0.7.3-rc.2

Extends rc.1; preview only, without main merge, stable release or production loader change.

## Change

Desktop classic product tiles and homepage cards now use the same 128px / flexible grid for offer and purchase form: stock centred over quantity, price centred over cart button. Form padding and homepage-only width caps are reset locally. The 118px five-digit quantity remains centred within its stock column. Detail recommendations, native popup and desktop list have independent layouts. Mobile (<992px) is unchanged.

In the desktop table: availability is left aligned. SKLADOM and gross price occupy line 1; amount and net price (in parentheses) line 2. CENTRÁLNY occupies line 1 and SKLAD (amount) line 2. Both columns use 22px line boxes and at least two lines. Availability column grows to 128px to contain native counts/units; the description column remains flexible. Label size changes from 14 to 13px; visible blue amount/EUR from 20 to 19px. The old strong wrapper was 16px but its inner visible number was 20px; both are now explicitly 19px. Name changes to weight 400 only in the table, retaining 700 in tiles.

Native names, stock values, prices, units, form nodes, amount limits and handlers are preserved. No application JS change.

## Verification

- 23 Chromium scenarios / 700 cards: stock category, central-stock category and homepage at 375/992/1024/1440/1920px; grid plus table on desktop. Column centres, both table rows, no stock/price overflow, exact font sizes/weights and net parentheses verified. Grid/list switching is native custom UI.
- Full raw measurements are in alignment.json.gz (gzip-compressed JSON preserves every field while avoiding the CDN 50MB package ceiling); summary.json provides case outcomes.
- Final central-label spacing rechecked separately after adding a decorative NBSP inside the count pseudo-element, so SKLAD and (amount) remain visibly separated.
- Native purchase smoke at 375/1440px: original add/popup with no white/blank frames or background movement, quantity increase in cart, shipping/payment to personal details; no order submitted.
- ESLint, build and whitespace pass. JS 32.31 / 32.5 KiB gzip, CSS 29.35 / 29.5 KiB. New preview CSS allowance follows recorded owner authorization of 15 October; earlier version allowances stay fixed.

These measurements route local candidate dist files on the public shop; they are not production activation evidence. Actual immutable CDN checks are recorded after push. Safari/iPhone and PageSpeed NOT TESTED.
