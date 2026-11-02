# LB1 · Network access required for real Luigi integration

## Verified in the PR follow-up

- Runtime policy: restricted and enforced, current observations, revision 1.
- `scripts.luigisbox.tech` is absent from the allowed hosts.
- A direct HTTPS request through the configured proxy to the observed script URL returned `HTTP/1.1 403 Forbidden` on CONNECT. The denial happens before the vendor script can load. This is not a vendor HTTP response.
- The tools available in this task can inspect environment status and diagnostics, but cannot edit or publish the environment configuration.
- No network-policy file, proxy, DNS or routing settings were changed to bypass this restriction.

## Official configuration route

Official source: https://learn.chatgpt.com/docs/environments/cloud-environments

Open Settings → Codex Cloud → Environments. For the environment used by this task, select … → Edit. In Public internet access, keep the current restricted setup and append the required hosts in Additional allowed domains. Save changes and Republish; use a new task with that published environment for verification. Editing a reusable environment does not establish that this running instance received the update. Workspace Agent Security may additionally constrain access.

### Exact requested hosts

| Host | Reason | Evidence level |
|---|---|---|
| `scripts.luigisbox.tech` | Observed bootstrap script LBX-1266949.js | Confirmed required; currently blocked |
| `cdn.luigisbox.com` | Official Autocomplete.js documentation identifies this for scripts/styles | Documented dependency; runtime use on this shop still to verify |
| `live.luigisbox.com` | Official Autocomplete.js documentation identifies this for connections | Documented dependency; runtime use on this shop still to verify |

Keep existing entries. These are host names, not paths or URLs; no broad wildcard or unrestricted internet is required by this proposal. No HTTP secret or vendor administration credential is needed to fetch the public bootstrap script.

Dependency source: https://docs.luigisbox.com/quickstart/autocomplete/customizing-autocompletejs/

After the bootstrap is available, record actual requests and add any further necessary host only through the same configuration workflow. Do not treat the documented dependencies as proof of the shop's renderer or component version.

## Continuation after access is available

Resume PR #68 on `feature/lb1-search-audit-preview`; do not merge or deploy. Use the official published environment with the updated policy. Verify both status and actual successful loading; stop if only the Shoptet fallback is present.

1. Capture the real rendered Luigi DOM, loaded stylesheets, computed colours and relevant network failures. Exclude cookies, credentials and customer data from committed evidence.
2. Capture empty input, typed query and full results at desktop 1440 px and mobile 375 px, including keyboard/scroll behavior. Establish the actual stable component root and supported hooks before writing selectors.
3. Preserve the approved identity: stock text #00C853, central warehouse orange according to the verified current identity, code #2454A6, unified orange cart buttons. Do not activate the earlier alternative dark CTA or neutral stock labels as an assumed approval. Report contrast limitations separately.
4. Prepare only scoped CSS against confirmed hooks. Apply it in the isolated browser session for screenshots; leave production src/dist/loader and Luigi settings untouched until the implementation is reviewable. Do not reinitialize the vendor widget or rewrite its DOM.
5. Capture actual desktop/mobile before and after in matching states. Verify responsive layout, long titles, links, cart actions and analytics attribution without duplicating handlers. Record any unsupported checks as NOT TESTED.

## Acceptance status

Real Luigi DOM/styles: BLOCKED.
Real Luigi desktop/mobile before screenshots: BLOCKED.
Scoped CSS for confirmed Luigi components: NOT IMPLEMENTED pending DOM access.
Real Luigi desktop/mobile after screenshots: BLOCKED.
Cart and analytics preservation in the real widget: NOT TESTED.
Merge / deployment / published vendor settings: NOT PERFORMED.

The existing `before-results-*` screenshots remain Shoptet fallback evidence. The existing `proposal-*` screenshots remain a standalone model. Neither set fulfills the requested real Luigi before/after comparison.
