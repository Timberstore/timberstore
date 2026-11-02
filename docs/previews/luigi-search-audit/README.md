Aktuálny samostatný build a rollback: [PREVIEW-0.7.7-rc.0.md](PREVIEW-0.7.7-rc.0.md).

## Aktuálny stav po obnovení prostredia

Reálny Luigi runtime aj dátové odpovede sú dostupné. Pokračovanie a aktuálne
obmedzenia: [LIVE-REVIEW.md](LIVE-REVIEW.md). Izolovaný kandidát:
[luigi-scoped.css](luigi-scoped.css). Reálne desktop/mobile páry sú v [live/](live/).
Staršie sieťové záznamy nižšie sú historické. Produkcia sa nemení.

# LB1 · Luigi’s Box audit and isolated preview

Local branch: `feature/lb1-search-audit-preview`. Base: `dd709bb` (v0.7.6 repository state). LB1 is a local task identifier, not a verified Trello card.

Open `preview.html` beside `preview.css`. This is a standalone design model with real captured Shoptet names/prices and illustrative availability, not a Luigi integration or connected cart. It imports no production files. The contrast toggle compares current brand colours with a proposed AA treatment. The Top product toggle compares compact and absent variants.

`AUDIT.md` is the audit; `RELEVANCE.md` contains the Shoptet baseline and blocked Luigi tests. Screenshots named `before-*` show Shoptet fallback because the environment blocks scripts.luigisbox.tech. `proposal-*` screenshots show the model. They are not evidence of Luigi before/after.

No production source, dist, loader, package version, admin setting or search configuration was changed. No merge, deployment or release.

Next: allow the Luigi script and observed dependencies through the environment configuration, inspect the live widget and official supported customization hooks, then map this design to confirmed hooks only.

## Real integration follow-up

See `NETWORK-ACCESS.md` for the verified proxy denial, official configuration route, exact hosts and continuation checklist. Real Luigi before/after screenshots and scoped vendor CSS remain blocked until the published environment permits the runtime script. The approved coloured stock text must be preserved; the model’s alternative contrast treatment is not an approved implementation.

The 2 November 2026 republish unblocked the bootstrap, which exposed the shop's
actual runtime host `cdn.luigisbox.tech`. That host is still absent from the
enforced policy, so the widget CSS/JS remains blocked. See
`NETWORK-RECHECK.json`; `cdn.luigisbox.com` does not cover the observed `.tech`
host.

## Recheck with cdn.luigisbox.tech allowed

The subsequent 2 November republish allows the bootstrap and runtime CSS/JS
(HTTP 200, including Autocomplete, Search, Recco and the Boo theme). Chromium
creates `#lbx-ac-element`, but its content is empty: the next observed
connections to `live.luigisbox.tech` (queries/recommendations) and
`api.luigisbox.com` (analytics) fail with `net::ERR_TUNNEL_CONNECTION_FAILED`.
The enforced policy allows `live.luigisbox.com`, which is a different host.
See `NETWORK-CDN-RECHECK.json` for the new desktop/mobile evidence; the earlier
`NETWORK-RECHECK.json` records the previous runtime-asset blockage.

**Still blocked:** real populated before/after captures, CSS against populated
product components, cart and analytics verification. No model/fallback image is
relabeled as a real Luigi screenshot. No production or vendor configuration was
changed. Add the two observed hosts through the environment configuration and
republish before continuing the acceptance checklist in `NETWORK-ACCESS.md`.
