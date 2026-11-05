# Owner authorization – v0.7.6

User instruction on 2026-11-01 (Europe/Bratislava):

> OK tieto zmeny mozes dat release.

This approves the current cumulative preview whose application source/build is `f6e38ba9af1b49c8063a7f1b3513a548586a6466`, followed by evidence-only commit `d765756`. The most recent review specifically requested plain orange social logos with no backgrounds/borders, including hover. Earlier accepted scope: contact page layout and shared hours, confirmed tax ID, semantic headings preserving original size/colour/text, approved homepage H1, and N/A brand display fallback. Rejected contrast/brand-colour/icon-frame experiments are not included.

Authorized: merge the approved cumulative work, promote stable 0.7.6, publish immutable tag and GitHub release, and prepare the loader version for the owner to switch manually in Shoptet (established workflow). Remove the preview-only activation condition so approved behaviour works without a preview cookie. That single guard is the only application source difference from the approved preview; CSS is byte-identical. Stable promotion is verified with preview disabled.

Not authorized or performed: change categories, dispatch promises, imports/Mergado, attachment names/URLs/content, product source data or CMS source articles, send forms/orders, or edit the live Shoptet loader. Production activation is left to the owner. Safari/iPhone and PageSpeed remain NOT TESTED, not PASS or a newly invented waiver. Trello code not supplied; no card invented.

## Owner clarification, 2 November 2026

The owner explicitly rejected the added homepage text “Nábytkové kovanie a
príslušenstvo”: heading normalization was not intended to add new homepage copy.
The historical summary above must not be used as current authorization for that
addition. Its creation branch is removed in preview 0.7.7-rc.6; production remains
unchanged pending separate approval. This note preserves the historical record.
