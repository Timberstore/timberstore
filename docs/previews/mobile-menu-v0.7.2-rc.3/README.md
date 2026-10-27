# M1 — Mobile menu contacts, 0.7.2-rc.3

New preview based on rc.2; no production loader, tag, release or main-branch merge. Includes earlier cookie/cart fixes. Production v0.7.1 stays unchanged.

The native mobile MENU toggle is orange in closed/open/hover states, with a visible keyboard focus indicator. Categories retain their existing white background, native accordion handlers, links and legal links.

The menu contact clone now follows the footer reference: hours, email, phone, Napíšte nám, socials. It shares the footer SVG paths, orange contact icons, blue Facebook, Instagram gradient, 16px text colour and white contact surface. The write-us action uses the same `/kontakty` native destination as the footer; mail and telephone remain mailto/tel links. Original link attributes, social destinations and accessible labels remain. The hours dot follows the same Bratislava-time business-open state as the footer and may change colour after closing time.

Shared SVG creation is extracted into core/contact-icons.js; the footer's rendered appearance is unchanged. Menu initialization/reordering is idempotent and applies to Apollo's responsive contact clones.

## Validation

18 passing Chromium scenarios, with recorded results:

- 12 mobile cases: home/category/detail at 320, 375, 430 and 767px. Correct DOM order, one CTA, one icon per appropriate link, no nested links/overflow, matching footer SVG paths/colours/dimensions, matching hours status, orange open toggle, native category accordion, repeated pointer/keyboard open/close, repeated native content events.
- 1 responsive-clone case: 375 → 430 → 1024 → 375px, preserving a complete unique contact block.
- 3 before/after comparisons at 375, 1024 and 1440px: footer/contact styles, desktop service contacts and native category links unchanged from rc.2.
- 2 purchase flows at 375/1440px: native add, exactly one add POST, cart quantity increase and checkout shipping/payment selection. No orders or personal data submitted.

The home-mobile case follows Napíšte nám to `/kontakty/` and verifies the visible native form without submitting it. Test harness corrections included comparing the actual footer colour instead of a guessed RGB, rounding insignificant subpixel measurements, and matching the contact destination's trailing slash. These were harness assumptions; no replacement navigation/form handler was introduced.

Scripts in `checks/` require Python Playwright/Chromium. TIMBER_MENU_WORK and TIMBER_CHROMIUM override scratch/executable; use the inherited HTTPS_PROXY when required. The comparison script reads reference assets from the immutable rc.2 commit. Physical devices and Safari are NOT TESTED.

ESLint, production build and whitespace checks pass. Gzip JS 32.10 KiB / limit 32.25; CSS 28.54 KiB / limit 28.75. Preview-only allowance is documented in CONTRIBUTING.md under the recorded owner authorization; earlier limits remain fixed. CDN byte equality and actual commit-hash preview verification are recorded in the draft pull request before sharing.
