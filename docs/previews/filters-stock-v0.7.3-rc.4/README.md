# M2/C3/K3 — Stock rows and mobile filter dismissal, v0.7.3-rc.4

Extends rc.3. Preview only; no main merge, stable release or production loader change.

## Product presentation

Desktop normal stock is now a column: SKLADOM alongside the main blue amount, count underneath alongside net price in parentheses. The normal stock area stretches to the price block so a shared narrow-card unit row does not break count/net alignment. Central stock retains its existing CENTRÁLNY / SKLAD (count) inline label/count flow. Price text shares the right-hand column centre with the cart button. Names in the desktop table return to weight 700 by explicit latest owner choice. Mobile product-card styling is unchanged.

## Mobile filters

Native headings extend across the full panel width, retaining the 16px text/chevron inset. Existing native form/slider widths are not changed. Filter and sorting panels close after >16px document scroll from their open position. A single-finger gesture starting outside the root closes after >12px vertical movement; wheel outside closes immediately for meaningful deltaY. All listeners are passive and do not block scrolling. Internal option-list scroll and slider gestures do not invoke outside dismissal. Closing uses the existing native accordion cleanup, clears no filter values and steals no focus. Escape/click-away remain intact.

## Verification

- 23 Chromium cases / 700 cards at 375/992/1024/1440/1920px: normal label vs blue amount, count vs net row, centred price/cart, central stock flow, table fonts/parentheses, no overflow. Lossless alignment.json.gz and summary.json.
- 375/430px touch-enabled Chromium: every filter heading reaches both panel edges, real CDP outside touch gestures and document scrolling close both panels, real internal brand-list scrolling keeps filters open, Escape works, two native slider handles present, native price sorting works after AJAX with a single toolbar root. mobile.json.
- Additional native 375px check: checkbox AJAX, selected state persists through auto-close/reopen, native reset AJAX, real pointer price-slider drag and native AJAX range update. mobile-native-values.json.
- Reference cards with pár/balenie/ks preserve equal price row geometry at 992/1440px in the same explicitly marked native-card geometry fixture used in rc.3; reference.json.
- Native purchase at 375/1440px: add popup without white/blank frames or background movement, quantity increase, shipping/payment to personal details; no order submitted.
- ESLint/build/whitespace PASS. JS 32.48/32.5 KiB (unchanged allowance), CSS 29.59/29.75 KiB (small rc.4-only allowance under recorded authorization); prior budgets preserved.

Initial evidence routes local candidate assets on the native public shop; actual CDN checks follow push. Safari/iPhone and PageSpeed NOT TESTED.
