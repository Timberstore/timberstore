# Checkout stability and mobile refinements — 14 October 2026

Preview 0.6.9, same `feature/checkout-summary-v069` branch, base `7febe7e8a4ba1e13ece99d98f8e1bb68a91d8f01`. Latest production tag remains v0.6.5; main, tags, release and loader are untouched.

## Causes and fixes

- **Summary shift:** layout depended on `.order-summary-top` / `.order-summary-bottom`, which Apollo adds at `window.load` and recreates after updates. Before those existed the sidebar used a different layout. Two idempotent `ts-checkout-summary-*` visual groups now exist during initialization. Later native wrappers remain present with `display: contents`. MutationObserver restores the visual groups synchronously after native markup replacement, before painting, rather than waiting for another animation frame. Native price nodes remain below `#summary-box`, controls/forms/consents/buttons are not cloned or reparented. Price + legal content + CTA remain above the separate product summary.
- **Contact shift:** Apollo creates and relocates the contact box at DOM ready; enrichment could wait for a later body-class/window-load update. A single checkout-scoped child-list observer enriches the native panel immediately. Desktop retains its contacts, colors, spacing and right alignment; a 920 px maximum-constrained surface and 20 px line height reserve the measured final geometry while text metrics settle. No new timeout, loader or hidden readiness state.
- The bounded list variable now lives on our product group, never the sidebar whose inline style Shoptet removes on scroll. The existing viewport-fit sticky decision and CSS fallback remain. No wheel handler/preventDefault was added.

## Requested visual changes

- One shared checkout green: `--ts-color-checkout-success: #387b20`; CTA token aliases it. This adjusts the native green's tone consistently for readable small text: white CTA text **5.22:1**, green on beige `#f5f0e9` **4.61:1**. Stock/free accents, selected radios/checkboxes, active step and CTA use the common token. Logos are untouched.
- Shipping/payment recap rows have subtle orange surfaces/edges and separate Doprava/Platba labels; product rows stay neutral. All shipping prices are green, including paid delivery. Free payment uses the same green. Native amounts and price calculation remain authoritative.
- Mobile help: centered heading (+1 px), centered shared hours/status, balanced phone/email row with divider, socials hidden only in this panel. Below 360 px, contacts stack cleanly. Native span icons stay intact and links cover their icons: `tel:+421904479842` / `https://www.timberstore.sk/kontakty/`.
- Four mobile dispatch notes are centered blocks with subtle separators and no bullets; only the existing stock/central-warehouse words are accented. Centered information icon retained.
- Mobile native shipping/payment cards keep the flexible text column and price above logo at right; consistent minimum height and centered native check. Pickup link, inputs and logos remain native.
- Personal-data heading is a symmetric full-available-width mobile stripe with centered icon/text; Apollo's negative heading margins/asymmetric padding are neutralized. Native login button is centered below it; inputs remain intact.

## Verification

- Lint/build passed: JS **22.53 KiB / 30 KiB**, CSS **19.53 KiB / approved preview-only 19.75 KiB** gzip. Version remains 0.6.9; package/lock were not bumped.
- Instrumented visible animation frames on the native step-2 page while holding an image request to delay `window.load`: contact surface, price card and actions had identical bounding rectangles in the first usable frame and after native wrapper creation. At 1366 px: contact 920×52; price 304.80×119.36; actions 304.80×147. No intermediate position/size change was recorded. Refresh/back navigation were also exercised. This is a focused Chromium check, not a claim about every network ordering or browser.
- Native add/quantity AJAX, method selection (including the native mousedown handler), paid Packeta vs free courier recap, available payment choices, steps 1→2→3 and native back navigation passed. Amounts were not rewritten; no final order was submitted.
- One real product and a separate cart of **15 real distinct products** passed native flow. The latter retained 15 rows, exactly two custom visual groups and one native recap ID on steps 2/3; quantity AJAX passed. Long-name 16-row DOM fixtures additionally checked the layout cap at 1366×768, 1920×1080 and 390×844.
- 320/360/390/430 px: no horizontal document overflow, prices/actions above product summary, mobile method text/price/logo geometry contained, contact destinations preserved, mobile socials hidden. Personal stripe/login alignment checked at these widths.
- Repeated sidebar `style` removal and programmatic page scroll 0/300/650 px did not expand the product list; native consents, final form ownership and required-field validity retained. No custom JavaScript exceptions were recorded.
- **Not verified:** physical wheel/trackpad chaining (the earlier headless wheel command timed out), real iOS Safari, completing the external pickup widget, every payment-provider variant, final server-side order validation/payment/submission. CSS scroll chaining remains `auto`; programmatic scrolling is not proof of physical wheel behavior. No screenshot comparison or PageSpeed run.

## Changed files

`src/modules/cart-presentation/{checkout,index}.js`, `src/modules/header-service-bar/{index.js,header-service-bar.css}`, `src/styles/overrides/checkout.css`, `src/styles/tokens.css`, `src/core/{selectors,texts}.js`; `dist/timber.min.{js,css}` and maps; approved preview budget in `scripts/build.mjs` / `CONTRIBUTING.md`; changelog and preview notes.

Open `/kosik/?ts_preview=<new commit SHA>` and use the existing checkout buttons. Empty carts require adding a product first. `?ts_preview=off` restores production.
