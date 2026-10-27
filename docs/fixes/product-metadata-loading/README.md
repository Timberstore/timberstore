# PD metadata loading stability · 2026-10-27

Original detail-only checks for local candidate `0.7.1-rc.0`; the subsequent site-wide fix is documented in [loading stability](../loading-stability/README.md). No push, tag, release, merge, Shoptet admin edit or production deployment.

## Cause and fix

The async product-text-cleanup module adds metadata classes only after initial render. Apollo initially gives the code/brand 10 or 12 px fonts, then cleanup applies 12.5 px and changes weight. Apollo also applies `transition: all .3s` to the brand link. Separately, Apollo changes the code label to `Kód produktu:` before cleanup shortens it to `KÓD:`.

Apply the final typography directly to native metadata selectors, including codes in the original detail header before Apollo relocates/clones them. Metadata children inherit the parent font. Keep native value spans, microdata and brand links intact; apply final value weight/colour before enhancement. Disable metadata transitions and apply the existing brand divider without waiting for a JS class.

Render the existing short code label in the native label's `::before`, retaining its underlying text node for native scripts. A zero font size hides the changing native label visually; the pseudo-element uses the final font size. An inline-block isolates whitespace so Apollo's later label rewrite cannot change spacing. Codes without native label spans do not receive generated text. No new JS, observers or listeners.

## Verification

- `npm run lint`, `npm run build`, `git diff --check`: PASS.
- Chromium fixture with stored native Apollo CSS: reproduced font/weight/geometry changes at 375, 768 and 1440 px before the fix.
- Current public product HTML and scripts: tested the [reported spring](https://www.timberstore.sk/pruzina-k-zdvihaku-kp03-3-00x22-5x142x36-silnejsia/) at 375 and 1440 px, routing only Timber CSS/JS to the local build. Held back Timber JS, measured native Apollo metadata after its own setup, then loaded the complete local bundle. The public shop was not changed.
- Both mobile and desktop header copies retain 12.5 px font / 18.75 px line height / weight 500 and zero transition duration. Visible code width is **66.796875 px before and after**; brand width is **94.40625 px before and after**. Brand href remains `/znacka/n-a/`. Native code value remains `11454`.
- Measurements: [live-results.json](live-results.json). Hidden responsive copies have zero bounding boxes as expected.
- Original detail-only build output: JS **31.70 KiB** gzip / 32; CSS **26.77 KiB** / 26.875. The site-wide candidate retains the 32 KiB JS limit and uses 27.5 KiB CSS; see the current report. Candidate-only CSS allowance under the recorded owner authorization of 2026-10-15. Stable version budgets remain unchanged.

Safari/iOS, screen-reader output, PageSpeed and a full checkout regression were not tested in this task. No production acceptance or deployment is claimed.
