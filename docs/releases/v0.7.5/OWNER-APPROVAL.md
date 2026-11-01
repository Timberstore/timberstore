# Owner authorization – stable v0.7.5

Date: 2026-11-01 (Europe/Bratislava).

After approving the product attachments and centred support contacts, the owner clarified the established release workflow:

> Ty si to mal ale vydat ako novu verziu, ako sme to robili predtym a ja to len zmenim v shoptete potom!

This explicitly authorizes stable version promotion, merge to main, immutable tag and GitHub release. The owner will activate the version manually in Shoptet. No Shoptet administration change is performed by the assistant.

Approved application source/build: 3270a04b4abccd25dd1d8a5ce6e81f432d1d6b33; already merged through PR #63 into main a295bcb2793f3dfdb4ad4b0d1b7ec912ea06cfc1. Promotion changes version/build metadata and prepares the loader only; application sources and CSS remain unchanged. JS differs solely by version.

Chromium and immutable CDN evidence is retained in docs/previews/product-downloads and docs/previews/sidebar-support. Physical iPhone/Safari and PageSpeed are NOT TESTED; they are not represented as PASS or an automatic waiver.
