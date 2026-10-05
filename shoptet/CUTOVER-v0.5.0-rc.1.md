# Timber Store cutover snapshot

Prepared: 2026-10-05

## Immutable frontend candidate

- Version: `v0.5.0-rc.1`
- Git commit loaded by Shoptet: `724cd97f4c1b61cb424e70a7fa3c91ee24fd32a0`
- Source branch: `cutover/shoptet-github-only`

## GitHub backups

- `backup/pre-cutover-v0.4.2-2026-10-05` — original main/production repository state.
- `backup/live-shoptet-before-github-cutover-2026-10-05` — complete migration/cutover state, including live HEAD/BODY and legacy file backups.
- Exact live Shoptet snapshots:
  - `shoptet/backup/2026-10-05/live-head.html`
  - `shoptet/backup/2026-10-05/live-body.html`
  - `shoptet/backup/2026-10-05/timber-custom-v175.css`
  - `shoptet/backup/2026-10-05/timber-empty-cart.js`
  - `shoptet/backup/2026-10-05/timber-kategorie-banner.css`
  - `shoptet/backup/2026-10-05/timber-kategorie-banner.js`
  - `shoptet/backup/2026-10-05/timber-menu.js`

## Cutover files

- Paste the complete contents of `shoptet/target/head-after-migration.html` into Shoptet HEAD.
- Paste the complete contents of `shoptet/target/body-after-migration.html` into Shoptet BODY.

Do not delete `/user/documents/allstyle.css`, `/user/documents/allscript.js`, or Apollo vendor assets.
