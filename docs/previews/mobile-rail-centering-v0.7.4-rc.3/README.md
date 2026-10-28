# M2 — Mobile related/similar full-price centering, v0.7.4-rc.3

Correct the missing mobile/tablet scope from rc.2. Only <=991px detail related/similar prices change: complete amount/EUR/slash/unit and VAT lines share the centre of the existing right offer column. Intrinsic-width relative lines prevent native flex shrinking long units or aligning overflowing VAT from only one side. Row heights, card widths/insets, stock, quantity and cart controls stay unchanged. PC rules remain untouched; JS differs only by version. Preview only, no main merge, stable release or production loader update.

10 focused Chromium cases / 40 buyable cards: StrongPower similar and FRANKE related at 320/375/430/768/1440px, including actual verified units. Full-line-to-VAT centre error <1px, no errors/clipping; controls retain their previous geometry. The mobile centering assertion is now unconditional for detail cards, rather than restricted to PC. verification.json.gz.

Presentation-only unit fixtures ks/balenie/pár/sada up to 1 234,56 € at 320/375/768px check full-line centres, bounds and stock/net separation (fixtures.json). No shop data/order submitted. Previous checkout proof is retained, not described as rerun for this CSS-only fix. Decompress check.py.gz to /tmp and run from repo root to repeat locally routed checks.

Lint/build/whitespace PASS. Existing limits retained: JS 32.99/33.25 KiB, CSS 30.49/30.625 KiB. Safari/iPhone and PageSpeed NOT TESTED. CDN evidence follows immutable preview publication. Historical report change removes only whitespace outside strings; data/path and old tags retained (cdn-size.json).
