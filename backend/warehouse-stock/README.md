# Warehouse stock backend — preview, not deployed

Read-only Node 22+ service for Shoptet project **765909**. No credentials or hosting are configured in this repository. This is an optional enhancement: if the service fails, the shop keeps native Shoptet availability, price and ordering. The frontend itself remains served by jsDelivr.

## Current Enterprise source decision

The shop has three real warehouses: **Dolný Hričov**, **Centrálny sklad**, and **TIMBER SKLAD**. Only the first two are displayed; third-stock quantities never get added to either target. Actual stock IDs are unknown until read from a real named stock record; explicit ID overrides must still match the name. The public frontend currently returns only `ext` with capped amounts.

The user allows a secured export as an alternative if direct frontend data cannot supply the two values. **No export or server is configured; the 2+193 admin reference is not source data.** See [current technical decision and exact setup](../../docs/previews/warehouse-stock-20261019/CURRENT-SOURCE-DECISION.md).

### Optional CSV source using the same server

`STOCK_SOURCE=export` selects `export-provider.js`; API remains the default. Put only the protected CSV URL in server secret `SHOPTET_EXPORT_URL`. Keep `SHOPTET_EXPORT_VERIFIED=0` and amount mode empty until an actual source matches named warehouses, units and available stock after reservations. Only `available` is supported for CSV, never an implicit claim deduction.

Required headers: `code`, `unit`, `productVisibility`, `variantVisibility`, `stock:Dolný Hričov`, `stock:Centrálny sklad`. The documented `(predvolené)` suffix can be configured, but a TIMBER SKLAD column cannot alias either target. Extra columns are ignored and the export is never served publicly. Unknown counts/units or non-public rows are skipped; duplicate SKU/ambiguous schema rejects the snapshot. Optional `guid` adds a GUID check; otherwise unique SKU is the source key.

Read-only probe: `node --env-file=/secure/stock.env backend/warehouse-stock/probe-export.js --remote`; or pass a private CSV path instead of `--remote`. Never put a protected URL on the command line. Optional `SHOPTET_EXPORT_REFERENCE_FILE` compares actual data against an operator-confirmed reference; it is not read by the serving provider. A match alone does not verify reservation semantics across the catalog.

One process fetches one export every 300 seconds, configurable 60–300 seconds after source-load measurement. Downloads: GET-only, no redirects, allowed shop hosts, 32 MiB/20 seconds maximum, UTF-8 or CP-1250, semicolon default. The 50,000-row parser supports quoted fields/BOM and strict decimal values. Snapshot observations do not reset on cache hits; HTTP Age is deducted. After 10 minutes without a valid observation, native availability wins. Responses expire within 30 seconds, bounded by snapshot expiry; client validation permits the longer original age only for `shoptet-export`. Shoptet-side generation/cache age remains unverified without the real export.

Health includes source status; startup can be configured while still unverified/loading. Do not scale into independent instances without shared refresh locking. Use existing Node 22+ hosting with HTTPS/secret storage if available; no second inventory database, no write-back, no scheduled GitHub catalog dump. First enabling export-security partners can invalidate older Mergado/ERP export URLs; see linked setup before changing admin settings.

### API connection checklist (alternative only)


1. In Shoptet administration locate **Prístup k API / Access to API**. Private API access requires Shoptet Premium; otherwise an installed OAuth add-on with the relevant read permissions is needed. The precise Slovak menu path and enabled modules cannot be verified without administration access; do not treat this as confirmation that the shop already has API access.
2. Enable/check the stock module. Read permissions must cover `GET /api/eshop`, `GET /api/stocks`, and `GET /api/products/{guid}?include=perStockAmounts`. No order or write permission is used by this service.
3. Store **exactly one** of `SHOPTET_PRIVATE_API_TOKEN` or `SHOPTET_ACCESS_TOKEN` in the deployment secret store, or a server-only `.env` outside the web root. Never send it in chat, commit it, or put it in a `TIMBER_*` variable. OAuth access tokens require an external add-on token renewal mechanism; the service does not implement OAuth installation/renewal.
4. Copy the variable names from `.env.example`, keep `SHOPTET_STOCK_VERIFIED=0`, and run on the private server: `node --env-file=/secure/path/stock.env backend/warehouse-stock/probe.js PRODUCT_GUID`. The probe refuses a token for an e-shop other than 765909 and prints warehouse fields and variant stock fields, never the token. Inspect its output privately; it contains stock information.
5. Confirm the actual `/api/stocks` IDs for `Dolný Hričov` and `Centrálny sklad`. Exact unique names are matched automatically. If using explicit IDs, set both confirmed values in `SHOPTET_HRICOV_STOCK_ID` and `SHOPTET_CSNK_STOCK_ID`. Never map the public `ext` warehouse based on its availability label.
6. On a known product/variant, compare `amount`, `claim`, the Shoptet administration and an existing reservation/order. Verify the **available-to-order** quantity. Set `SHOPTET_STOCK_AMOUNT_MODE=available` only if `amount` is already available stock. Set `physical-minus-claim` only if verified that `amount` is physical stock and `claim` must be deducted. No default is chosen. Do not create an order merely to test this; use a known existing reservation or an authorised test shop. Check sale units too.
7. Verify cases of zero, negative stock, backorder, absent stock tracking and hidden variants. Missing stock rows are unknown, never an implicit zero. Only then set `SHOPTET_STOCK_VERIFIED=1`.
8. Start `node --env-file=/secure/path/stock.env backend/warehouse-stock/server.js`. Default bind is loopback `127.0.0.1:8787`. Expose only through an HTTPS reverse proxy with request/body/time limits and monitoring. `GET /health` reports configuration, not data correctness. `STOCK_ALLOWED_ORIGIN` must match the storefront origin (default `https://www.timberstore.sk`). CORS is not authentication; the batch route deliberately exposes only public-product stock data. Apply edge abuse controls before internet deployment. No server deployment was performed for this preview.
9. Compile a **new preview** with `TIMBER_PREVIEW=warehouse-stock TIMBER_STOCK_ENDPOINT=https://YOUR-STOCK-SERVICE/v1/warehouse-stock/batch npm run build`. The URL is public, without credentials. The current shipped preview has **no endpoint** configured. Validate real counts and variants before considering any production release.

## Contract and freshness

`POST /v1/warehouse-stock/batch`, JSON `{ "items": [{ "productId": "347129", "guid": "6cba90bc-3db0-11f1-a956-bc241158b559", "code": "549369" }] }`. Maximum 24 items and 16 KB per body. The server discards extra identity properties. Only exact public product GUID + visible variant SKU are returned. It never returns tokens, supplier feeds or internal API payloads.

Responses have `items` with either `state: "unknown"` plus reason or a normalized `known` record with the identity, sale unit, `asOf`, `expiresAt`, and ordered `warehouses` (`hricov`, `csnk`). Browser responses are `no-store`.

Counts cache for at most **30 seconds** per GUID. Original observation time/expiry is preserved when served from cache. Product reads are coalesced; global concurrency is 4 and budget 120 API calls/minute; product cache holds at most 1,000 GUIDs. Warehouse metadata caches for 5 minutes. The browser batches 24 identities, has concurrency 2, a bounded queue and 400-entry cache. HTTP has a global limit of 200 batches/minute. These conservative settings are a starting point, **not a throughput guarantee** for actual shop traffic; quota/load monitoring is required before deployment. Under load the system returns unknown and native availability wins.

The browser removes expired enhanced quantities and retries; no stale stock is deliberately served. Hidden tabs can throttle timers, and refresh resumes on visibility change. API fetch timeout is 4 seconds; browser fetch timeout 5 seconds. Imports/Mergado delay **before** data reaches Shoptet is outside this service. This is demand-based cached reading, not real-time synchronization and not a full-catalog download. Shoptet documents `product:update`, `productVariant:update` and `stock:movement` events; webhooks/invalidation are not deployed here.

If direct frontend warehouse data becomes available, its interpretation still requires separate verification: `TIMBER_STOCK_NATIVE_VERIFIED=1` is intentionally **absent** from this preview build. The public endpoint currently exposes only `ext`, not the two required warehouses.
