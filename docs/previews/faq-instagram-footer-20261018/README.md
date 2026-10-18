# FAQ, Instagram and footer contacts — preview 2026-10-18

Base: `fb76479edd9ca75dc76206774d3936566bfd24ed`, the existing product-detail preview. No merge, tag, release, Shoptet administration or production-loader changes. Existing product/header/cart designs retained.

## Changes

- FAQ: live Apollo computed styles showed a 22px outer `.faq-content` clip with a second 35px `.tabs-content` clip and 35px title corners. Title `::before`/`::after` both had `content: none`. Removed the two inner radii in the existing legacy owner; the outer box now clips the header consistently. Added `min-width: 0`. Questions, answers and native accordion/tab scripts are unchanged. The supplied description did not include screenshots, so the exact pictured protrusion cannot be compared directly; the live double-radius seam was reproduced and removed.
- Instagram: replaced the existing 160px scrolling-strip stylesheet with a 2/3/6-column square-card grid (6 columns from 1200px), subtle borders and 1.025 image hover. Reuses the actual profile anchor as a heading; removes the separate follow wrapper. Preserves native media URLs, order and post permalinks; displays the first six supplied items, with native lazy loading and explicit aspect ratio. One mutation observer supports Apollo relocation and late feed insertion. No API credentials, additional external scripts, scraped posts or fabricated gallery.
- Footer: styles only `.ts-footer-contacts`; inline SVG icons remain inside the actual clickable anchors. Mailto/tel, formatted phone number, official existing Facebook/Instagram destinations and native `/kontakty` form link. Brand-colored social marks. Shared `addHours`/`updateHours` from the header module and its existing timer; `TEXTS.header.hours` and `isBusinessOpen()` are unchanged (Mon–Fri 08:00–16:00, `Europe/Bratislava`).

## Instagram limitation requiring follow-up

On 18 October the anonymous homepage HTML and browser DOM contained an empty `.custom-footer__instagram`, with **zero** `.instagram-widget` / posts, both before and after this change. Native Apollo `repositionInstagram()` only relocates an existing Shoptet widget; it does not fetch missing content. Thus six current posts and their live destinations cannot honestly be verified or supplied by frontend CSS/JS alone. The fallback shows the existing official profile link and an availability message, without made-up posts.

Next: inspect/reconnect the existing Instagram integration in Shoptet and verify the server supplies at least six current posts with real post permalinks. The historical admin entry records 9 posts (previously 4); preview limits display to six without changing production admin settings. If Shoptet cannot supply a reliable feed, propose a separately authorized server-side Instagram API sync with cached media/permalinks and credentials kept outside this public repo. No such backend or admin change was made here.

History reviewed: `2521db0` (1 October compact strip and admin count), `ba68afc` (earlier mobile grid), existing contact/header work and business-hours utility. No standalone incognito-fix commit found in the reviewed history.

## Verification

- ESLint and preview build passed. Build command: `TIMBER_PREVIEW=product-detail npm run build` (retains the existing branch build mode). CSS 22.82 KiB gzip / 23 KiB, JS 28.63 KiB / 30 KiB. No budget increase.
- Offline Chromium with archived Apollo HTML/CSS: widths 320, 375, 768, 1024, 1440, 1920. Six consistently square synthetic test items in 2/3/6 columns, no horizontal overflow; repeated initialization does not duplicate headings/hours/icons; empty and late-arriving data handled. Synthetic items exist only in the local test fixture and are never included in shipped gallery data.
- Eight business-hours cases: winter/summer offsets, 08:00/16:00 boundaries, Sunday and after the autumn DST switch.
- Live Chromium uses real Shoptet/Apollo HTML and scripts with only preview assets substituted locally. Widths 320, 375, 768, 1024, 1440, 1920 passed native FAQ tab/accordion interaction, footer link/icon/hour/form assertions and no page overflow. Tracking providers excluded by harness; no checkout/order submission. Apollo empties social anchors after DOM ready; a footer-scoped observer restores only contact decorations. ID-scoped CSS resolves native `#footer` specificity. See accompanying JSON for actual live test results and scope.

Pending: restore/verify actual Instagram feed and each of its six post destinations; real iPhone/Safari and performance/PageSpeed measurements; client visual review. No claim of a working six-post live feed until integration supplies the data.

## Changed source owners

`src/legacy/timber-custom-v175.css`, `src/styles/overrides/instagram.css`, `src/styles/overrides/footer-contacts.css`, `src/modules/instagram/index.js`, `src/modules/footer-contacts/index.js`, `src/modules/header-service-bar/index.js` (exports only), `src/core/selectors.js`, `src/core/texts.js`, `src/styles/tokens.css` (social brand tokens only), `src/main.js`, `src/main.css`; generated `dist` assets and this preview documentation/changelog.
