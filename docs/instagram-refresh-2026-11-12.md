# Instagram gallery refresh — 2026-11-12

## Decision and operating mode

Use the existing reviewed `data/instagram.json` snapshot until an authorized,
supported upstream feed is available. **This change disables automatic acquisition
of new posts.** It does not claim to repair Shoptet's HTTP policy. The renamed
workflow validates the snapshot on relevant PRs/pushes, manually, and weekly.
The existing gallery continues to render the same data. No frontend, CSS, loader,
production tag, shop settings or visitor consent code changes.

This is a deliberate operational fallback, not `continue-on-error` around a
broken scraper. A successful validation means the saved data contract is valid,
not that Instagram/Shoptet was contacted or that the content is current.

## Evidence and cause

All 72 Instagram runs were present in the repository-wide Actions history
(first 100 results, 122 total across workflows). There were 69 successes and
three failures. Recent evidence:

| Run | Created UTC | Outcome | Commit |
| --- | --- | --- | --- |
| [60](https://github.com/Timberstore/timberstore/actions/runs/42345753595) | Nov 7 06:09 | HTTP 403 | e885e95 |
| [63](https://github.com/Timberstore/timberstore/actions/runs/42453947547) | Nov 8 06:14 | HTTP 403 | e885e95 |
| 64–66 | Nov 8–9 | success | e885e95 |
| 67–70 | Nov 9–11 | success | dd4175d |
| [71](https://github.com/Timberstore/timberstore/actions/runs/43089504602) | Nov 11 19:41 | HTTP 200, 16 posts, unchanged | dd4175d |
| [72](https://github.com/Timberstore/timberstore/actions/runs/43174706533) | Nov 12 07:21 | HTTP 403, no publish | dd4175d |

Run 72 failed at 07:22:03 UTC / **08:22:03 Europe/Bratislava**. Its nine unit
tests passed; checkout and Python setup succeeded. The real source request
returned 403 before parsing/writing. Do not mistake simulated 429/503 messages
inside the test step for real upstream responses.

Full logs were retrieved for failures 60/63/72 and adjacent success 71.
Runs 71 and 72 used the same commit, Python 3.12.16, Ubuntu image
20261101.360.1 and action versions. Their runner regions were centralus and
westus2. Earlier failures occurred in westus (60) and centralus (63), so region
alone does not explain it. All three observed failures occurred on morning UTC
runs; three samples do not establish a time-based rule or justify rescheduling
as a fix. Logs do not include response bodies, WAF rule IDs or outbound IPs.

**Confirmed immediate cause:** the remote HTTP path intermittently refuses the
HTML request; the script converts that refusal into exit 1. **Unresolved cause of
the refusal:** server/CDN protection, IP/reputation/rate policy or another upstream
access rule. No evidence proves a particular WAF, invalid cookie, changed markup,
Node migration or a permanent Instagram authorization failure. Definitive server
attribution requires Shoptet's request/security logs at the timestamps above.
No protections were bypassed and no identity rotation was attempted.

Read-only live checks on Nov 12 from this cloud environment returned HTTP 200:
the same request without the existing reader preference had zero native posts;
the existing reader returned 16 posts, identical in order, URLs, images and alt
text to main. This environment is a different network origin from Actions and
its success does not establish Actions reliability. All 16 saved image URLs
returned HTTP 200 and image/jpeg. The committed snapshot last changed Nov 6;
that date is not the last successful upstream verification.

## What PR #71 did and did not fix

[PR #71](https://github.com/Timberstore/timberstore/pull/71) and its
[diagnosis](fixes/instagram-refresh/diagnosis.md) correctly protected data with atomic
writes, validated minimum feed size, retried transient failures, refused to retry
403, and updated Actions runtimes. Its code, tests and documentation were reviewed.
Its documented limitation was real: every scheduled run still depended on an
unsupported public HTML request, and any refusal still failed the job and could
trigger failure emails. Retry/backoff cannot make 403 access permitted. It was
resilience work, not a permanent replacement for that dependency. Five successful
runs after merge did not prove the external refusal was fixed.

## Supported source investigation and long-term recommendation

Shoptet's [official support guide](https://podpora.shoptet.sk/socialne-siete/)
documents its native Instagram widget and account connection. It does not document
a public gallery export for a separate refresh job. The reviewed
[public API catalog](https://api.docs.shoptet.com/shoptet-api/openapi/endpoints)
does not list an Instagram media endpoint. This is a finding about the public
documentation, not proof that Shoptet cannot offer a supported private integration.
No shop API token or Meta credentials were available to verify account-specific
capabilities. Do not guess private widget endpoints or extract Shoptet's tokens.

Preferred long-term architecture: an owner-authorized media producer using Meta's
[Instagram API](https://developers.facebook.com/docs/instagram-platform/), or a
Shoptet-supported export confirmed by their support. Meta's
[official collection](https://www.postman.com/meta/instagram/documentation/6yqw8pt/instagram-api?entity=request-23987686-3a63181c-e5c6-4890-96dd-e4d425bef5e0)
describes professional-account access and authorization requirements. The direct
Meta documentation fetch was rate-limited during this investigation. Account
eligibility, permissions, token lifecycle and media retention must be verified
before implementation; authorization is not implied by having a public profile.

The producer should create the same ordered public manifest and retain approved
images durably. Direct Meta media URLs are not a drop-in replacement: this frontend
accepts only the existing shop-specific Shoptet CDN path. A supported way to retain
those images, or a separately reviewed gallery change, is required. Keep secrets
server-side, validate before atomic replacement, preserve last good output, and
monitor last successful acquisition independently of content change time. Merely
moving this HTML scraper to another host does not create a supported source.

Until then, maintain the snapshot through reviewed PRs. Its JSON hosting still
depends on raw.githubusercontent.com and images on Shoptet CDN; existing native
widget behavior also remains Shoptet's responsibility. This change cannot promise
image lifetime or Instagram destination availability.

## Safe update procedure

1. Create a branch from current main. Obtain owner-approved posts/images, or save
   legitimately accessible Shoptet HTML locally. Do not include account credentials
   or private HTML in the public repository.
2. Keep the JSON shape `{"updatedAt":"timezone-aware ISO timestamp","posts":[...]}`;
   each post has exactly `url`, `image`, `alt`. Keep 6–40 unique posts in the desired
   display order. Use native HTTPS `/p/<id>/` or `/reel/<id>/` Instagram permalinks
   and existing approved shop Instagram CDN image URLs. No query strings/tokens.
3. Import with `python scripts/refresh-instagram.py --input-json /path/to/reviewed.json`
   or `--input /path/to/reviewed.html`. Changed content receives a new timestamp;
   unchanged posts retain the existing file bytes and timestamp. A failed import
   leaves the previous data untouched. Review the complete data diff, especially
   image mappings and order; validation cannot prove editorial correctness.
4. Run `python scripts/refresh-instagram.py --check` and
   `python -m unittest discover -s tests -p 'test_refresh_instagram.py'`.
   Open a PR and merge only after owner approval. Manual workflow dispatch only
   validates the selected ref; it never fetches or publishes new posts.

The old reader remains explicitly available as `--fetch --output /scratch/file.json`
for local diagnosis only. It fails immediately on 403, preserves the scratch file,
and refuses the default production data path. It is not used in any workflow.
No invocation without an explicit mode can silently start a network request.

## Monitoring and notification semantics

Weekly Monday 08:17 UTC validation (09:17 Bratislava in winter, 10:17 in summer;
Actions scheduling can be delayed) replaces the six-hour scrape. Permissions are
read-only; credentials are not persisted and there is no commit/push step.
Invalid/missing data, broken tests and filesystem errors still fail normally.
A content-change age of 30 days produces a warning plus the job summary, without
failing the run or causing scraper failure email notifications. It is a review
reminder, **not** an upstream health or freshness guarantee. An unchanged gallery
can be correct; a recently changed snapshot can still miss a new Instagram post.
This fallback requires someone to review the weekly summary. It does not send
external messages or change users' GitHub email notification settings.

## Validation

- 16 unit-test methods: original retries/refusals (403/404, 429/503, exhausted 500,
  timeout/network errors), empty/short feeds, atomic replace failure, safe logs,
  plus offline check/import while mocked upstream returns 403/503/timeouts,
  explicit-mode guard, malformed schema/timestamps/URLs/duplicates, ordered JSON
  import, unchanged bytes, stale warning/summary and failed write cleanup.
- Current 16-post JSON passes strict validation. Offline import of today's HTML
  matches every saved post. Production JSON remains byte-identical to main.
- Workflow YAML parsed; read-only permissions, no fetch/publish command verified.
- Live Chromium at 375px and 1440px used the unchanged production page with the
  candidate JSON response supplied locally. All 16 item links/images/alt text and
  order matched the snapshot; both arrow buttons were present and the next button
  accepted a click at both sizes; no CookiesConsent cookie appeared. Lazy loading
  loaded only visible/nearby images; all 16 image URLs were checked separately.
  Browser diagnostics allowed the managed proxy certificate via ignoreHTTPS errors;
  normal Python HTTP probes retained TLS verification.
- Safari/iPhone and pixel-perfect screenshot comparisons were not performed.
  Frontend/CSS/build/data files are unchanged, so no new bundle or release is needed.
- `git diff --check` passes. No production dispatch, merge, tag, deployment or
  shop administration change was performed.
