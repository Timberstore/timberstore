# Responsive regression fixes — preview 0.6.9

## Causes and changes

- Apollo's `repositionFilterToRow()` wraps `#filters` and moves all `#content .filters-wrapper` elements before the category header. Our mobile popover reused that native class, so Apollo moved the whole popover outside the module root. Reinitialization left its empty shell and duplicate panel ID behind.
- The mobile popover now uses only its own `ts-*` classes. Disposal explicitly removes both owned panels after restoring the original native filter/sorting nodes, even if Apollo moved a panel outside the module root. No filters, forms, inputs or slider are cloned.
- During a desktop-to-mobile resize, Apollo animates `#navigation` with a 0.4-second transform while its closed menu remains visible and hit-testable. It can cross the email/phone icon in checkout. Below 768 px, a closed checkout menu is now hidden and cannot receive pointer events. The native `navigation-window-visible` state restores normal open-menu behavior. Desktop navigation and contact styling are unchanged.

## Validation

- Repeated desktop/mobile resizing, including 320/375/390/414 px, retains one native `#filters` node and one of each mobile popover. Returning to desktop removes both mobile popovers. The original filter node retains its identity.
- Native Cena/Dostupnosť/Značky/Farba accordions, mutually exclusive filter/sorting panels, AJAX filter/reset and the native checkout flow are checked by the focused browser script outside the repository.
- Lint/build passed within the existing preview budgets: CSS 19.72 / 19.75 KiB gzip; JS 22.18 / 30 KiB. No budget increase.
- The reset link duplicated in Apollo's `.vybrane-filtry` is created by Apollo itself (`#clear-filters.clone()`), rather than by our module; this unrelated native presentation was not changed. The test targets the original reset in the filter popup.
- The test with 15 real products reached the final checkout form after native quantity AJAX. No order was submitted. The cloud driver did not acknowledge `mouse.wheel`, but an independent Chromium `Input.synthesizeScrollGesture` check with 15 read-only recap entries passed: internal scroll 431→681 px with document scroll fixed at 529 px. Keyboard PageDown also scrolled the list. This was a test-driver limitation; no additional application scroll changes were needed.

Same feature branch and version; no merge, tag, production loader change or deployment.
