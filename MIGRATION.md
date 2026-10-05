# Custom code migration status — 2026-10-05

This branch prepares the Timber Store frontend so custom Timber code can be versioned in GitHub and served through the existing jsDelivr loader.

## Safety rules

- Production Shoptet remains untouched during preparation.
- No FTP/custom HTML include is removed before a matching GitHub replacement is preview-tested.
- Apollo/vendor assets and unknown Shoptet-managed assets stay in place.
- Current live HEAD/BODY are backed up in `shoptet/backup/2026-10-05/`.

## Already under GitHub control

- `timber-custom.css?v=175` — exact legacy copy in `src/legacy/timber-custom-v175.css`, included in migration CSS bundle.
- Homepage category banner CSS/JS — migrated to `src/modules/homepage-categories/`.
- `timber-menu.js` — split into:
  - `menu-card-click`
  - `sidebar-active-path`
  - `product-text-cleanup`
  - `category-filter-compact`
- Footer payment logos inline script — migrated to `footer-payments`.
- Inline Timber HEAD styles — staged in `src/legacy/inline-head.css`, included in migration CSS bundle.
- `.top-category-addon` inline styles — staged in `src/legacy/top-category-addon.css`, included in migration CSS bundle.
- `timber-page-loading` — staged in `src/legacy/page-loading.js`; intentionally not bundled yet because it must execute before body render.
- `timber-empty-cart.js` and its companion CSS — exact legacy copies staged in `src/legacy/`; intentionally not bundled yet while the live Shoptet include remains active.
- Current Apollo BODY settings — source-control snapshot in `shoptet/apollo-config-current.js`.

## Intentionally still external

These are not removed or replaced because their ownership/content is not yet verified:

- `/user/documents/allstyle.css?v=1111#DEBUG_TIMESTAMP#`
- `/user/documents/allscript.js?v=111#DEBUG_TIMESTAMP#`
- Apollo vendor assets, including `apollo.jakubtursky.sk/.../kategorie/main.css`
- Apollo configuration globals in BODY.

## Final cutover order

When the migration bundle is accepted in preview:

1. Remove only the old `timber-kategorie-banner.css/js` includes.
2. Remove the old indirect `timber-menu.js` loading together with the banner JS include.
3. Remove `timber-custom.css?v=175` only after confirming the bundled exact copy is active.
4. Remove the footer payment inline script after confirming `footer-payments`.
5. Remove the inline Timber HEAD CSS blocks after confirming the bundled copies.
6. Migrate/enable empty-cart from GitHub, then remove its old Shoptet include.
7. Decide separately whether to keep or retire `timber-page-loading` after a performance comparison.
8. Keep `allstyle.css`, `allscript.js`, Apollo assets and Apollo config until their ownership is proven.

Rollback at any cutover step: restore the corresponding backed-up include from `shoptet/backup/2026-10-05/live-head.html` or `live-body.html`.
