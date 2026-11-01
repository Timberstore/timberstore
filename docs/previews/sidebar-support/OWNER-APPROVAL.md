# Owner approval to merge downloads and support contacts into main

Date: 2026-11-01 (Europe/Bratislava).

Owner's explicit instruction in this conversation:

> OK tieto zmeny s kontaktnym udajom aj tie predtym s prilohami mozes publikovat von do mainu.

Scope: merge the approved product-downloads redesign and the approved sidebar support contacts into `main`, including centred layout and 15px bold contact rows. The reviewed application source/build is commit `3270a04b4abccd25dd1d8a5ce6e81f432d1d6b33`; subsequent commit `db7b3905dd8b695339bbec08b1efa2772dcc0e90` adds evidence only.

Attachments retain original names and hrefs, with no content analysis or Mergado/source-data changes. Sidebar contacts retain native destinations and Apollo visibility/placement, using shared hours/status, icons and contact texts.

Validation: current lint/build, metadata tests and whitespace checks pass. Reviewed immutable CDN assets matched the builds byte-for-byte. Browser reports in the adjacent folders cover desktop and mobile/touch emulation, responsive layout, native tab/banner handling and idempotence. Physical iPhone/Safari and PageSpeed remain NOT TESTED; this instruction is not recorded as a waiver of those tests.

This records approval for the requested `main` merge. Stable release/tag creation and switching the live Shoptet loader are separate from this merge and are not performed in this change.
