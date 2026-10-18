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

## Client correction — compact footer

18 October follow-up: contact rows reduced from 44px plus margins to 32px without extra row margins; contact icons 20px, social marks 26px (previously 36px), social links 32px, button top gap 8px. Hours text aligns with the email/phone text, with the availability dot after the hours. Contact button foreground is white in normal, hover and focus states. All four existing column headings use weight 700 and matching lower spacing. FAQ, Instagram, header/cart/product behavior remain unchanged. Changes edit the existing footer CSS owner rather than adding another override layer.

Lint/build and whitespace checks pass; CSS 22.87 KiB / 23 KiB, JS 28.63 KiB / 30 KiB. Live Chromium responsive verification also checks computed white button text, 26px social marks, 32px rows and all four 700-weight headings. Full measurements: `footer-compact-responsive.json`.

## Client follow-up — slider, blank images and contact actions

The new requirement supersedes the earlier six-item cap: retain every post delivered by the native feed; show 6 at a time from 1200px, 3 at tablet widths, 2 on mobile. Native horizontal overflow/scroll snap supports touch, and previous/next buttons scroll one card with disabled states at the ends. Respect reduced motion. No feed URLs or ordering are fabricated.

Root cause of blank cards identified in our previous code: assigning `loading=lazy` before the Shoptet unveil routine (`img:not([loading])`) could prevent its data-src/data-src-retina source promotion. Fix resolves only the native source supplied on each feed image before assigning lazy loading. Delayed source attributes are observed as well. This is a code-ordering defect, not something reliably solved by clearing cache. Native feed absence and image hydration are separate: during the live browser check the server still supplied zero native posts, so real post-media delivery cannot be claimed from that session; the lazy-source regression and slider are tested with explicit local fixtures.

Footer: native Apollo 25px button radius, existing /kontakty destination, Slovak Napíšte nám label, white foreground, button before social links in a compact flex row. Hours now use the same 16px/600/1.4 typography as mail/phone. No new availability rules.

Build/lint passed: CSS 23.05 KiB / 23.25 KiB, JS 29.17 KiB / 30 KiB. Added CSS allowance applies only to the existing preview build mode, per previously recorded client authorization; production budgets remain unchanged. Live six-width footer checks and local data-src/slider results accompany this report.

## Client follow-up — side arrows and regular contact text

Large arrows now sit outside the image rail on its left/right edges, centered vertically on the photographs. Grid shell keeps arrows within page bounds, including 320px phones. Desktop/tablet arrow diameter 52px, mobile 44px. Six/three/two visible posts and all supplied additional items remain accessible. Contact heading stays 700; contact email, phone, hours and button text are 400. The other footer column headings retain their existing bold style.

Lint/build: CSS 23.13 KiB / 23.25; JS 29.19 KiB / 30. Six-width local slider checks assert side placement, vertical centers, arrow size, source loading, both directions and no document overflow. Live Apollo footer checks assert regular contact text, bold headings, preserved destinations and no horizontal overflow. Results: `side-arrows-verification.json`, `footer-normal-weight.json`.

## Client follow-up — mobile popular-links accordion

The popular-links h4 was nested inside banner-wrapper/span. Apollo only prepares direct h4 children of footer accordion sections, so it skipped this heading. The new small footer-menu adapter promotes the existing heading, reuses Apollo's trigger/content classes and delegated group handler, and handles initialization before or after Apollo. No independent toggle implementation or duplicated links.

All three menu rows (information, online payments, popular links) have matching mobile padding/minimum height and no additional container margins. Styles are restricted below 768px. Contact and desktop styles are preserved; all desktop menu content stays visible. Five popular destinations remain unchanged.

Lint/build/whitespace pass: CSS 23.22 KiB / 23.25 KiB, JS 29.34 KiB / 30 KiB. Live six-width Chromium assertions check equal closed spacing and arrows, native open/close and one-open group behavior, all five links, desktop visibility at/above 768px and no page overflow. Measurements: `footer-menu-responsive.json`.

## Client follow-up — centered mobile contact

Existing footer CSS now centers all contact contents below the native 768px stacked/mobile breakpoint: heading, email/phone links, hours and combined button/social row. Menu headings remain left-aligned with their native right-hand chevrons; desktop contact columns retain their prior alignment. No JS or link/availability changes.

Lint/build/whitespace pass: CSS 23.25 KiB / 23.25 KiB, JS 29.34 KiB / 30 KiB. Live Chromium assertions measure centers of email, phone, hours and the action group within 1px of the contact box center on mobile, and check desktop alignment remains unchanged. Results: `footer-centered-responsive.json`.

## Client follow-up — mobile contact order/dividers and brands

Below 768px the centered contact uses hours, email, phone, then the existing button/social row. Thin heading dividers reuse the Instagram heading border color. Desktop order and presentation are unchanged.

The existing twelve native brand items/links become a single mobile rail with two visible logos and side arrows plus native touch scrolling. No logos or destinations are replaced. The existing Instagram arrow/navigation routine is extracted into a small shared helper, used by both rails; Instagram retains its classes and behavior. The brand rail initializes only below 768px. On returning to desktop, its helper disconnects its observer/listener and restores the original native group directly under its container, so no desktop wrapper/style change remains.

Lint/build/whitespace pass: CSS 23.58 KiB / 23.75, JS 29.64 KiB / 30. Existing preview budget authorization documented in CONTRIBUTING; stable releases unaffected. Live browser checks measure two visible logos, 12 preserved links, arrows on both sides and both directions, mobile contact order and two visible divider lines, no page overflow, and identical desktop group geometry/links before/after repeated mobile transitions. Instagram regression checks cover the shared helper. Results: `partners-contact-mobile.json`, `shared-slider-regression.json`.

## Client follow-up — mobile service cards and Instagram separation

The SPAX/LED/switch section now uses the same existing mobile rail adapter/helper as the brand section, with one full content-width card rather than clipped adjacent cards. Native horizontal touch scrolling, snap alignment and arrows preserve all original images, copy and CTA destinations. Its wrapper is removed above the native mobile breakpoint, keeping desktop geometry intact.

Instagram is separated from brands/footer by the existing warm `--ts-color-service-bg` and `--ts-color-service-divider` tokens, internal section padding and thin horizontal boundaries. Heading uses the same family/weight/color/sizes as the brand heading; Slovak sentence case matches that treatment. All image-source fixes, per-post destinations and slider functionality remain.

Lint/build/whitespace pass: CSS 23.74 KiB / 23.75 KiB; JS 29.71 KiB / 30 KiB. No budget increase. Live Chromium checks cover whole-card mobile geometry, preserved service links, both navigation directions, matching computed title typography, distinct Instagram background, desktop round trips and no page overflow. Local Instagram rail/source regression also passes. Results: `service-instagram-separation.json`, `service-instagram-regression.json`.

## Client follow-up — dot pagination, three Instagram photos, visible buttons

This supersedes the arrow requirement: the single shared rail helper now builds round dot buttons per visible page/group for all three rails, tracks the active dot after native scroll and recalculates page counts/positions on resize or feed updates. Buttons have accessible Slovak page labels and visible focus; smooth scrolling respects reduced motion. Arrows and their layout gutters are removed, not hidden alongside another implementation.

Mobile Instagram: 3 visible photos with 8px gaps; tablet 3, wide desktop 6. Mobile brands: 2 visible logos. Mobile services: 1 full card. Desktop services/brands keep native layouts with no pagination. Existing warm Instagram surface remains.

The clipping came from native service text height `calc(100% - 115px)` while the custom image uses responsive 16:9 sizing. Mobile rails now use auto-height flex content, a nonshrinking image/button, 44px CTA height, 14px labels and explicit bottom padding. Original card copy/media/links remain. A thin token-colored border separates centered mobile contact from the information menus.

Live Apollo Chromium checks across 320/375/767/768/1024/1440px plus repeated mobile/desktop transitions: click last/first dot, correct active state after scroll, 1 service/2 brand items visible, all CTAs >=44px high with >=20px bottom space inside the card, 1px footer divider, no arrows or page overflow and restored desktop markup. Local native-image fixture: 9 real-structure test feed nodes, 3 visible below 1200px/6 above, correct page counts, dot navigation/active states, late and retina source hydration. This is a fixture, not a claim that the live anonymous session supplied a native Instagram feed. Results: `dots-live.json`, `instagram-dots-regression.json`.

Lint/build/whitespace pass: CSS 23.54 KiB / 23.75 KiB; JS 29.77 KiB / 30 KiB. No budget increase, merge/release or production-loader change.

## Client follow-up — exact native dots, brand insets, mobile order and status dot

Dot buttons now carry the actual Apollo `swiper-pagination-bullet` class and toggle its native active class. The former custom circle pseudo-element is removed; Apollo itself draws the 16px white/shadowed inactive and dark active circles. The shared helper still manages pages, click targets, accessible labels and swipe synchronization. Live computed-style equality is checked against real native template dots for size, background, shadow and radius.

Mobile brands gain 16px inner horizontal space and vertical room for card shadows. Two logos remain visible. Contact and Instagram swap in the stacked layout: contact first, Instagram second, then native information/payment/popular menus. The Instagram element is moved intact only after Apollo readiness, keeping the contact within its native footer styles and avoiding interference with native home-section relocation. A marker restores Instagram to its exact original desktop position on resize; no cloned contact/feed or duplicate IDs.

The hours clock pseudo-element is removed. The existing header-backed availability dot precedes the text instead of following it, with the same orange closed/green open behavior and shared timezone/timer. This applies to footer contacts at all widths.

Live Chromium assertions cover native dot style equality and navigation, brand insets >=30px from section edges, mobile visual section order, desktop restoration, no duplicates/overflow, no clock pseudo-element, left-side status dot and orange/green states. Instagram fixture regression preserves image source hydration, three mobile photos and page navigation. Results: `native-dots-order-status.json`, `native-dots-instagram-regression.json`. Lint/build/whitespace pass: CSS 23.63 KiB / 23.75; JS 29.98 KiB / 30. No budget increase or production changes.

## Client follow-up — Instagram swipe hint, no dots

Instagram no longer creates dot buttons at any viewport. Below 768px its rail shows three complete photographs plus exactly half of the fourth (8px gaps). This signals horizontal swipe. Small 32px white shadowed side arrows sit vertically centered on the photos with no reserved gutters. Tablet remains three full photographs; wide desktop six. All original feed data and destinations remain intact.

The existing shared rail controller receives an optional arrow mode rather than adding another independent scrolling implementation. Brands and service cards continue using the existing native-style dots. Mobile contact/Instagram/menu placement and the left-hand orange/green availability dot are unchanged.

Local native-feed fixture checks assert zero Instagram dot buttons, two small controls, three complete mobile photos and half the fourth, arrow movement in both directions, disabled end states, original post URLs and late/retina image-source hydration at six widths. Live Apollo regression checks native brand dots, spacing, footer section order, availability states, desktop restoration and no document overflow. The live anonymous response can omit the native Instagram feed; fixture checks do not claim live Instagram API availability. Results: `instagram-peek-regression.json`, `instagram-peek-live-regression.json`.

Lint/build/whitespace pass: CSS 23.75 KiB / 23.75 KiB; JS 30.18 KiB / preview-only 30.5 KiB. The small JS increase follows the already recorded 15 October client authorization, applies only to the existing preview mode and leaves stable JS budgets at 30 KiB. No merge, release or production-loader change.

## Client follow-up — hours color, separate button/social rows and 2½ Instagram photos

Hours now explicitly use the same `--ts-color-controls-text` as the email/phone anchors. The shared orange/green availability dot is unaffected. Contact actions stack vertically: centered uppercase NAPÍŠTE NÁM button, then centered social icons. A footer-only ResizeObserver measures the actual rendered phone-number text (excluding its icon) and supplies that width to the button; existing minimum/maximum sizing and typography remain responsive as fonts/layout change.

The Instagram mobile rail below 768px now fits two full images and half of the third with the existing 8px gaps. Tablet/desktop layouts, native source hydration, swipe and small side controls remain unchanged. Removed an obsolete service-arrow positioning rule; other rail behavior is retained.

Live Chromium assertions across mobile/tablet/desktop widths check equal text colors, button width within 1px of number width, horizontal centering, social icons below the button, uppercase display and no clipped text. The existing native dot/footer order/status suite also passes. Local native-feed regression measures a half-visible third image and checks navigation, end states and source hydration. Results: `contact-stacked-actions.json`, `instagram-two-half.json`. The latter uses fixture feed media because anonymous live responses may omit the native feed.

Lint/build/whitespace pass: CSS 23.76 KiB / preview-only 24 KiB; JS 30.26 KiB / 30.5 KiB. CSS allowance update follows the recorded 15 October client authorization and is isolated to the existing preview build mode; stable release limits and production loader remain unchanged.
