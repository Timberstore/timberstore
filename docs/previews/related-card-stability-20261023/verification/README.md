# Reprodukcia

Node, Chromium a playwright-core. Nastaviteľné PLAYWRIGHT_CORE / CHROMIUM_PATH; používa sa predvolený Chromium bez diagnostického vypnutia navigačných prechodov. Curl bridge rešpektuje session proxy a sieťovú politiku. Živé verejné HTML/API; lokálny dist sa použije namiesto Timber CDN iba pri štandardných lokálnych kontrolách. `cdn:true` načíta skutočné CDN. Baseline je `git show v0.7.0:dist/...`.

V koreňovom repo: `npm ci`, `npm run lint`, `npm run build`. Potom v tejto zložke:

- `node check.cjs`: sedem šírok, klik názov/Back a klik obrázok/Back, merania po 35 ms a screenshoty čerstvého stavu. Výsledky matrix.json a result-WIDTH.json vznikajú pri skripte; screenshoty v ../images.
- `node slow.cjs`, `WIDTH=1440 node slow.cjs`: porovnanie baseline/fix pri oneskorení bundle o 4500 ms. Výstup slow-WIDTH.json. Bez oneskorenia v aplikácii.
- `node functional.cjs`: baseline geometria homepage/kategória/detail, reálne natívne množstvo a nákup presne 2 ks súvisiacej pružiny 11454. Každý beh má vlastný anonymný košík. Žiadne odoslanie objednávky alebo platba.

Pripravené merania sú v ../evidence, nezamieňajte ich s novým behom. Test rešpektuje natívne skryté mobilné SKU (`getClientRects` prázdne) a obnovu scrollu, meria vnútornú geometriu karty. Serverová dostupnosť alebo aktuálne zmenený sortiment môže ovplyvniť reprodukciu.

`node cdn.cjs` overí publikovaný immutable build cez skutočné CDN, dva cykly Back na 1440/390 px a samostatnú produkčnú reláciu.
