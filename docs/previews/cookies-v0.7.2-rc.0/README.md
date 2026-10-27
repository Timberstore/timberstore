# Cookie button colours · 0.7.2-rc.0 · 2026-10-27

Preview branch only. Published v0.7.1, its tag, budgets and the production loader remain unchanged. No consent JavaScript or settings are changed.

The native acceptance button uses the existing Timber orange `#D4884A` with the owner-requested white `#FFFFFF` label, including hover/focus states. Its orange hover uses the existing `#B8692E` token. The reject button uses the notice background `#F8FAFB`, dark grey text and a fine `#E7EAEE` inset outline. Keyboard focus retains a visible orange outline. Native sizes, spacing, text, settings button and consent event handlers are preserved.

Browser verification on the public shop with local preview CSS/JS at 375 and 1440 px:

- Both buttons retain exactly the same width, height, padding and font size before/after styling.
- Mobile: both buttons 157 × 55 px. Desktop: reject 125.84375 × 55 px; accept 117.03125 × 55 px.
- Native accept and reject both dismiss the notice and persist across reload in separate isolated contexts; no new page errors.
- Keyboard focus is visible; settings geometry is unchanged.
- `npm run lint`, `npm run build`, `git diff --check`: PASS. JS 31.96 / 32 KiB, CSS 27.53 / 27.625 KiB gzip; stable limits unchanged.

[Detailed measurements](results.json) · [mobile](cookies-375.png) · [desktop](cookies-1440.png).

Chromium verification only; no claim of Safari testing. Third-party tracking requests were blocked in test contexts. No production deployment or stable release is part of this change.

Follow-up: the owner requested white acceptance text. [Focused white-label checks](white-text-results.json) confirm `rgb(255, 255, 255)` in normal and hover states at 375/1440 px; screenshots reflect this revision. The original `results.json` retains the earlier colour measurements and the still-valid native consent/dimension checks.
