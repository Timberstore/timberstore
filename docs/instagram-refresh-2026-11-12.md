# Instagram gallery refresh — 2026-11-12

## Final proposal: preserve automatic acquisition

PR #72 retains the existing Shoptet reader, native Instagram permalinks, image
mapping, ordering, atomic replacement and automatic publishing of changed data.
The earlier proposal to disable acquisition and require manual imports has been
withdrawn. No manual import is required for new posts.

Schedule: **once daily at 03:00 Europe/Bratislava**, using `cron: '0 3 * * *'`
and `timezone: Europe/Bratislava`. GitHub now documents IANA timezone scheduling
([workflow events](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule)).
This is 02:00 UTC in winter and 01:00 UTC in summer. At 03:00 the Slovak DST
transition does not duplicate or skip the local hour. GitHub may delay or drop
scheduled jobs under load; this is a target start time, not an exact-time SLA.
Changing the time and frequency reduces requests but is **not a proven fix for
403**. The source remains an external dependency.

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

## What PR #71 did and what this changes

[PR #71](https://github.com/Timberstore/timberstore/pull/71) and its
[diagnosis](fixes/instagram-refresh/diagnosis.md) correctly protected data with
atomic writes, validated minimum feed size, retried transient failures, refused
to retry 403, and updated Actions runtimes. Its remaining limitation was alerting:
a single source refusal still failed the entire run. Five successful runs after
merge did not prove external refusals had stopped. Conversely, 69 successes out
of 72 runs do not justify removing a useful automatic acquisition mechanism.

This revision retains that mechanism and adds measured degradation handling:

| Event | Result |
| --- | --- |
| Successful acquisition, changed posts | Validate and atomically replace JSON; publish changed data on main |
| Successful acquisition, unchanged posts | Success; retain original bytes/timestamp; source-health counter resets |
| First 403/temporary outage after a verified source run within 48 hours | No retry for 403, warning and job summary; retain gallery; next daily run remains enabled |
| Second consecutive acquisition failure | Error annotation, failed workflow and normal GitHub failure notifications |
| Last verified source run older than 48 hours | Current outage is escalated rather than silently tolerated |
| Empty/short/malformed feed, unexpected 404/401, parser/file/write failure | Fail immediately; do not classify as tolerated source unavailability |
| Missing/invalid saved gallery | Fail validation before source acquisition |
| History API unavailable or cannot establish previous source result | Monitoring fails visibly; never infer healthy status |

Repeated failures mean consecutive **actual source attempts**, not overall green
workflow runs. The source step uses continue-on-error only so the following health
step can classify its failure. Stable `Instagram source verified` and
`Instagram source unavailable` step markers persist the actual outcome in Jobs
API, including when a single outage yields an overall successful job. Monitoring
checks the latest meaningful completed scheduled/manual main run (up to 30 runs),
ignores PR tests/branch diagnostics and recognizes the old pre-PR refresh step.
No health state is inferred from `data/instagram.json.updatedAt`, because unchanged
content is still a successful verification. Source success requires no history API
call. History access uses the built-in token with `actions: read`; no new secrets.

Source diagnostics record UTC check time, HTTP status, attempt and only bounded,
character-validated `x-request-id`/`cf-ray` identifiers if the response supplies
them. Cookies, arbitrary headers, response bodies, token values and raw exception
messages are never logged. Logs also have workflow run/runner context for a support
investigation. 403 still gets exactly one request, no retry or identity changes.
Transient retries from #71 remain unchanged. The server-reader preference remains
isolated from visitors; no consent registration or browser-session imitation is
introduced.

A tolerated source failure does not publish data. Only successful acquisition
can reach the existing main data commit/push. Tests run on PRs; the acquisition
job is skipped on PR events. Manual branch diagnostics cannot publish to main and
any source failure on such a branch remains a failed diagnostic run. Test jobs
are read-only. Refresh has contents-write and actions-read permissions.

Warnings/summaries do not generate a failed-workflow email for an isolated source
outage. Persistent acquisition failure and real technical errors fail normally;
GitHub's own notification preferences control recipients and whether emails are
sent. We neither change those preferences nor send external messages. Persistent
failures can therefore continue producing notifications until resolved. A warning
is not a claim that the source was refreshed. Daily acquisition also means a new
post may take roughly a day plus scheduling/cache delay to reach the public JSON.
There is no independent dead-man alert for a workflow GitHub never starts.

## Alternatives investigated: preserve automation during any migration

### 1. Existing native Shoptet widget

The current Instagram module already reuses the native widget when present,
including links, images, slider and responsive placement. When native content is
absent it reads the public JSON fallback. A MutationObserver handles native widget
DOM insertion; no additional periodic HTML download by visitors is needed.

[Shoptet documents account connection and widget placement](https://podpora.shoptet.sk/socialne-siete/).
Its [cookie documentation](https://podpora.shoptet.sk/cookies/) also documents
consent-controlled widget activation. Our read-only evidence shows native items
missing from non-consented source HTML while the existing isolated reader sees
16 items. Therefore native-only rendering is a low-maintenance automatic solution
for the customers to whom Shoptet supplies the widget, but does **not** currently
replace automatic fallback updates for all visitors. Do not change consent
settings, silently accept cookies, or fetch consent-marked HTML in visitors'
browsers to make it appear otherwise. Shoptet has not confirmed a separate
consent-independent supported gallery feed for this shop.

No account reconnection is indicated by the observed intermittent HTTP 403:
successful HTML requests still contain valid native posts. If investigating native
connection settings, inspect only **Prepojenie → Sociálne siete → Instagram** and
**Vzhľad a obsah → Šablóny → Prvky → Instagram**. Keep the current connection,
placement, image count and cookie settings. Reconnect only if Shoptet identifies
an expired account connection, using the documented owner login flow.

### 2. Supported Shoptet export

The reviewed [public endpoint catalog](https://api.docs.shoptet.com/shoptet-api/openapi/endpoints)
and [export API](https://api.docs.shoptet.com/shoptet-api/openapi/exports) do not
document Instagram media export. The export API describes accounting documents;
its existence does not imply an Instagram export. Nor can a known image directory
supply future Instagram permalinks/order as a supported feed. Public documentation
cannot rule out an account-specific option, so Shoptet support confirmation is
still the most useful low-maintenance next step. No support message has been sent.

Owner-ready support request:

> Pre e-shop www.timberstore.sk používame natívne prepojenie Instagramu a vlastné
> zobrazenie jeho obrázkov a permalinkov. Poskytujete podporovaný serverový JSON,
> API alebo export príspevkov vrátane poradia a Shoptet CDN obrázkov, nezávislý od
> sťahovania homepage a nastavení cookies návštevníka? Ak áno, prosíme dokumentáciu,
> spôsob autorizácie, limity a interval aktualizácie. Prosíme aj preveriť HTTP 403
> z 12. 11. 2026 o 07:22:03 UTC (08:22:03 Bratislava), prípadne 7. a 8. novembra
> približne 06:09 a 06:14 UTC. Ktorá serverová vrstva/pravidlo odmietla požiadavku?
> Nežiadame obídenie ochrany ani vypnutie ochrany celého e-shopu.

A supported Shoptet feed with the existing CDN mapping would be the preferred
replacement because it reuses the already managed account connection. Do not
implement guessed private widget endpoints or extract its tokens.

### 3. Official Meta Instagram API

A technically viable independent architecture uses owner-authorized official API
acquisition on a private scheduled producer and publishes a validated static JSON
and thumbnail snapshot to a durable CDN. Browser visitors read only that public
snapshot, with no Meta tokens or Meta embed scripts. No public shop HTML request
is needed. The [official Meta collection](https://www.postman.com/meta/instagram/folder/1z5vxzu/instagram-api-with-instagram-login)
confirms the Instagram Login route for Business/Creator accounts. For reading the
owner's media, target the basic-read permission `instagram_business_basic`, without
requesting publishing, messages or comments permissions. The Instagram Login route
avoids a Facebook Page dependency; a Facebook Login integration is a different
route with different prerequisites.

Proposed producer behavior: poll every six hours (configurable independently of
the interim daily HTML reader), handle API pagination and images/reels/carousels,
use the API permalink and timestamp, and retain approved thumbnails under a narrow
shop-controlled CDN prefix. Download and validate replacement thumbnails before
publishing the manifest. Never expose temporary Meta media URLs or auth tokens as
permanent public data. Image caching, refresh/deletion and authorization revocation
must follow Meta's platform requirements; this is not indefinite media retention.
Automatically refresh long-lived credentials before expiry, with atomic private
storage and a reconnect alert if authorization is revoked. Token lifecycle and
account-specific access must be checked during setup; no integration can promise
never to need owner reconnection.

There are currently no Meta credentials or authorized API responses in this
session. Direct Meta developer-document requests returned 429; the official Meta
Postman material was available. Exact account permissions, token refresh behavior,
media results and App Review requirements are **not verified for Timberstore**.
No live API integration has been claimed or deployed.

Owner steps if this route is selected:

1. In Instagram, open **Nastavenia a aktivita → Pre profesionálov → Typ účtu a
   nástroje** (label varies by app version). Confirm `timberstore.sk` is Business
   or Creator. If it is personal, switching to a professional account is required;
   do not disconnect its existing Shoptet connection.
2. At [Meta for Developers](https://developers.facebook.com/apps/), create or use
   a Timberstore-owned app and choose the Instagram product/use case with
   **API setup with Instagram login**. The dashboard labels may change. Add the
   owner account via **Add account/Generate access token**, accepting any account
   tester invitation if the dashboard requires it. Authorize profile/media read
   for `timberstore.sk`; do not request publishing or messaging for this gallery.
3. For an owner-managed account, first verify the app-role/Standard Access path
   in that app. If Meta requires Advanced Access, complete its App Review/business
   verification and required app privacy/deletion configuration. Do not assume
   that a test token authorizes an unreviewed multi-customer app in production.
4. Store the Instagram user ID, token and required app credentials through the
   private deployment secret store or protected server environment file. Never
   paste them into chat, public GitHub files, frontend JS or screenshots. Configure
   token refresh and secure persistence so routine expiry needs no manual work.
5. Provision/approve the static image CDN prefix and producer hosting. The repository
   describes a server-based backend, but its current backend/server directories
   contain no implemented hosting setup; a working deployment is not assumed.
   This is developer setup, not a recurring owner import task.
6. Run parallel API acquisition against the existing HTML automation. Compare all
   16 existing permalink/image mappings and order, then verify a genuinely new
   post arrives automatically. Test API outages, revoked tokens, image errors and
   old-snapshot behavior. Only after approval switch the data source and retire
   HTML acquisition. There must never be a gap with no automatic source.

### 4. Minimal-maintenance recommendation

**Now:** keep the proven automatic reader, reduce it to the requested daily time,
and make isolated failures non-disruptive while escalating repeated failures.
**Next:** ask Shoptet for a supported feed using the existing connection. If they
cannot provide it, use the official Meta producer and static gallery CDN described
above. A managed provider offering the same authorized API-to-static-feed contract
could reduce credential/hosting maintenance, but would need verification of its
feed API, cost, images, consent behavior and compatibility with this exact design;
no provider has been selected or purchased.

The current frontend intentionally allows only the shop-specific Shoptet image
prefix. A Meta producer cannot invent URLs inside Shoptet's system Instagram
directory or assume a generic files API can write there. New CDN URLs require a
separately reviewed, narrow allowlist and feed mapping change **inside the gallery**.
Keep existing 16 image URLs/order during migration and add new items according to
an explicit verified ordering rule; API order or pinned posts must not be assumed
to match Shoptet. Existing CSS/slider/placement can remain. No frontend change is
included in this interim PR.

## Validation and unchanged scope

- 26 unittest methods pass: original retry/refusal/atomic preservation tests plus
  typed outage classification, safe timestamp/request-ID diagnostics, unchanged
  source success, saved-data validation, single/repeated failure classification,
  48-hour freshness guard, API monitoring failure, legacy source results, ignored
  PR/branch/test-only histories, workflow marker/publish contract and DST dates.
- Live scratch acquisition returned 16 posts matching the existing saved data.
- YAML parsed; schedule is daily 03:00 Europe/Bratislava; PR acquisition is skipped.
- Earlier live Chromium checks at 375px/1440px confirmed all 16 links/images/order,
  both arrows and no CookiesConsent cookie. All 16 image URLs returned 200 JPEG.
  Frontend/CSS/data remain byte-identical to main; no new visual implementation
  invalidates that baseline. Safari/iPhone and pixel-perfect comparisons not run.
- No production workflow dispatch, main commit, merge, tag, deployment, account
  reconnection, notification settings change or shop administration change.
- The branch/PR is the reviewable proposal. The active main schedule remains
  unchanged until owner-approved merge. Lower request frequency does not establish
  the server's 403 cause or guarantee future upstream availability.
