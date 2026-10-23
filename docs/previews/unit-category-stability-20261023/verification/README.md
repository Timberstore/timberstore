# Reprodukcia

Node, Chromium, playwright-core (voliteľné PLAYWRIGHT_CORE / CHROMIUM_PATH). V repo `npm ci`, `npm run lint`, `npm run build`. Curl bridge rešpektuje proxy/sieťové pravidlá. Bez diagnostického vypínania browser features. Predvolene lokálny dist, `cdn:true` skutočné CDN, baseline je related.1 commit cca35b0.

Z tejto zložky:

- `node check.cjs`: šesť šírok, cold load s oneskorením bundle 2500 ms (iba test), prvé viditeľné množstvo a CTA, jednotky v detaile, Back. Merania po 30 ms, matrix.json a result-WIDTH.json. Screenshoty sú pomocné a môžu zahŕňať celý výpis.
- `node units.cjs`: reálne `/pár`, `/m`, `/ks` z natívnych formulárov klonované do izolovaných fixture kariet; validácia proti cenovej jednotke. Ďalej kontrolované konfliktné údaje, HTTP 503 a výmena jednotky počas požiadavky. Nič zo stock textu. Žiadne nákupy fixture produktov.
- `node functional.cjs`: natívne množstvo +/−, reálny anonymný nákup 1 ks 477822, kontrola serverového/hlavného košíka, preklik kategórií a Back na 1440/390/320. Bez objednávky alebo platby.

JSON pri skriptoch sú nové výstupy; auditované výsledky sú v ../evidence. Verejné dáta a dostupnosť servera môžu ovplyvniť ďalšie behy. Skripty nemenia administráciu.
