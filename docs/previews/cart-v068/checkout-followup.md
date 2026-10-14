# Checkout follow-up — preview 0.6.8

Base checkpoint: `8422e560259611359527ba9c76ed257e73b7c919`. Same preview branch/version, no merge, tag, release or production-loader change.

## Requested refinements

- Summary scroll chaining uses `overscroll-behavior: auto`; long panels keep native internal scrolling and desktop sticky/header clearance.
- Desktop columns now favour the left side (70/30, 280 px cart-summary minimum); later checkout steps follow the same proportion. Mobile layout remains stacked.
- Summary headings are dark; product names use weight 600 and quantities 700. Native unit spans receive a visual slash (`4 / ks`, consistently also other units), without altering native quantities or prices.
- Stock green is still applied only to the exact `Skladom` label; availability counts retain their existing colour.
- Only `CENTRÁLNYCH SKLADOV` is uppercase/orange inside the dispatch notice; the rest of the sentence and other notice lines retain their native typography. Guarded text/span synchronization handles native AJAX replacements.
- Primary CTA uses green `#328020` and white text: 4.95:1 contrast, including the smaller legal suffix. The existing bright green remains for stock/free/selected indicators. This darker CTA shade is the contrast compromise; neither white nor Timber orange passes on the previous bright green.
- Compact contacts align right on desktop and left in a single orderly column on mobile. Existing tel links remain; checkout email uses `mailto:`. Link padding extends the native phone/email anchor over its decorative icon without duplicate anchors or handlers. Social URLs and shared hours logic remain unchanged; the main website email behaviour is untouched.
- Personal-data header places the native heading beside the original login button; the redundant account label is hidden. Desktop/tablet name, email and phone use label/input rows capped at 360 px input width; mobile stacks them. Native form inputs, names, form ownership and validation stay unchanged.
- The inline country row receives a 20 px top margin. Existing hidden/disabled country controls remain intact.

## Files

`src/styles/tokens.css`, `src/styles/overrides/cart-presentation.css`, `src/styles/overrides/checkout.css`, `src/core/texts.js`, `src/modules/cart-presentation/checkout.js`, `src/modules/header-service-bar/index.js`, `src/modules/header-service-bar/header-service-bar.css`, `dist/timber.min.{css,js}` and maps, `CHANGELOG.md`, preview notes.

No version bump or budget increase. Existing approved 18.75 KiB CSS allowance for preview 0.6.8 is retained. No new requests or event handlers were added.

## Basic verification

Lint, formatter check and build passed: CSS 18.75 KiB / 18.75 KiB, JS 21.69 KiB / 30 KiB gzip. The previous duplicated CTA width declarations were consolidated into their existing shared rule; no budget change.

Chromium smoke checks passed for all three native checkout steps at 1366/375/320 px: no horizontal overflow/contact spill, dark headings, white-on-green CTA, narrower desktop summaries and right-aligned desktop contacts. Native quantity AJAX, courier selection and forward navigation passed. Personal heading/login alignment, desktop label/input and stacked mobile fields, hidden account label, bold summary quantities/unit slash, country top spacing and native required-field/form ownership checked. Only the specified words in the dispatch notice are orange; all four original notice lines remain.

Scroll containment is removed and computed native `overscroll-behavior` is `auto`. Real wheel/trackpad input remains **unverified**: the headless browser wheel command did not complete, including with background throttling disabled. Test fixtures and browser flags are outside the repository. Manually check wheel over short panels, internal scroll of long panels and chaining at both panel boundaries.

Also verify manually: icon click hit areas on a real phone, extreme product names/quantities, pickup-point widget, all payment variants and real iOS Safari. No real order or external dial/mail client was launched. Native final submit was never activated. No custom browser JavaScript exceptions in the completed smoke run.
