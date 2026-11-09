# Instagram refresh diagnosis — 2026-11-09

## Evidence

Run [#63](https://github.com/Timberstore/timberstore/actions/runs/42453947547) ran on **2026-11-08 06:14 UTC (07:14 Europe/Bratislava)**, rather than November 9. Complete job logs were retrieved for #63, #62 and #60. The failed step was `Run python scripts/refresh-instagram.py`:

```text
2026-11-08T06:14:58.2180084Z ... scripts/refresh-instagram.py, line 49, in main
2026-11-08T06:14:58.2180968Z     with urlopen(request, timeout=30) as response:
2026-11-08T06:14:58.2329568Z urllib.error.HTTPError: HTTP Error 403: Forbidden
2026-11-08T06:14:58.2448582Z ##[error]Process completed with exit code 1.
```

The source refused the HTTP request before parsing or writing. The logs do not establish why the upstream refused it (IP policy, protection or another server decision). They do not contain an HTTP response body. It is not evidence of a changed widget format or invalid consent cookie.

Latest ten runs inspected at investigation time:

| Run | Created UTC | Result |
| --- | --- | --- |
| 66 | Nov 9 06:48 | success |
| 65 | Nov 8 22:14 | success |
| 64 | Nov 8 13:38 | success |
| 63 | Nov 8 06:14 | HTTP 403 |
| 62 | Nov 7 21:57 | success, feed unchanged |
| 61 | Nov 7 13:14 | success, feed unchanged |
| 60 | Nov 7 06:09 | HTTP 403 |
| 59 | Nov 6 19:29 | success, updated 16 posts |
| 58 | Nov 6 06:57 | success |
| 57 | Nov 5 20:03 | success |

The full workflow history available (66 runs) contained only failures #60 and #63. #62 and #63 used the same SHA e885e95, Python 3.12.16 and Ubuntu 24.04 image 20261101.360.1. #59 and the first failure #60 had identical scraper and workflow files; #59 committed only refreshed data. Subsequent successes prove the scraper is not permanently broken.

Both successful and failed jobs warn that checkout v4/setup-python v5 target Node 20 and are forced onto Node 24. Both actions completed in #63. Its runner actually used Ubuntu 24.04.5; the Ubuntu 26 migration annotation is prospective, not the cause of the HTTP exception.

## Live source and customer checks

Read-only requests on November 9 returned HTTP 200. HTML without consent had zero native posts; with the existing server reader preference it contained 16 posts directly in HTML, identical to current main JSON. No dynamic extraction is necessary for this reader. Shoptet's current script creates a JSON cookie with `consent` (comma-separated categories) and `cookieId`; page configuration names it `CookiesConsent`, with `analytics` and `personalisation` categories. The existing request format matches this implementation. It only affects this isolated server request, executes no scripts, makes no consent registration request and never sets visitors' cookies. Cookie values were not logged.

All 16 saved CDN images returned HTTP 200 and `image/jpeg`. Existing JSON, frontend module and contacts constants were reviewed. JSON remains available independently of refresh success. The failed publish step was skipped. No evidence of a customer gallery outage was found; staleness is the risk.

Clean Chromium contexts at 1440px and 390px, without accepting cookies, each displayed 16 public-data items, two gallery arrow buttons and 12 loaded lazy images after scrolling to the gallery. All image URLs were separately checked. No CookiesConsent cookie appeared. The managed proxy certificate required ignoreHTTPSErrors in these browser-only diagnostics; normal Python source requests retained TLS verification. Browser checks establish current operation, not pixel-perfect regression coverage or Instagram destination availability.

## Change and limits

Only the refresh script, its new unittest file, this report and refresh workflow change. Existing JSON, JavaScript, CSS, links, order, slider and production settings remain untouched. Schedule stays `17 */6 * * *` UTC; GitHub scheduled runs may be delayed and are not an exact six-hour SLA.

Use three total attempts for transient HTTP 408/429/500/502/503/504, timeouts and connection failures, with backoff and Retry-After handling. Other HTTP errors, including 403, fail immediately without evasion. Log HTTP status, valid post count and safe failure category, never cookies/headers/response bodies. Validate at least six native Instagram links paired with shop-specific Shoptet CDN image paths before an atomic replacement. Unchanged results retain bytes and updatedAt. Tests run before source refresh. Workflow uses Node 24 actions and pinned Ubuntu 24.04; manual branch runs check out their actual ref and cannot publish to main.

This hardens recovery and protects data; it cannot guarantee Shoptet will accept every scheduled request. A persistent 403 requires a supported Shoptet export/API or owner-authorized feed preserving Instagram permalinks and approved shop CDN images. Do not rotate identities, fabricate browser sessions or bypass access restrictions. An official Meta API would require authorized credentials and a separately approved way of retaining approved CDN images; it is not a drop-in change here.

Validation: nine unittest methods cover successful extraction, empty/short feeds, invalid hosts, deduplication, retry recovery, HTTP refusal/exhaustion, timeout/network failures, unchanged bytes, safe logs and failed atomic replacement. A live refresh wrote only a scratch output and matched all 16 saved posts. `git diff --check` passed. No production workflow was dispatched, no production data/settings were changed and no deployment or merge was performed.
