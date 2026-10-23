# Immutable preview · related.3

**[Otvoriť kategóriu – cena a nákup bez oddeleného odhaľovania](https://www.timberstore.sk/granitove-drezy/?ts_preview=39e57b6aada2f2b60ff1d7478afd671a2821efe3)**

[FRANKE – súvisiace a podobné](https://www.timberstore.sk/franke-drez-bfg-611-970x500mm-cierna-matna/?ts_preview=39e57b6aada2f2b60ff1d7478afd671a2821efe3) · [KP03 – súvisiace](https://www.timberstore.sk/zdvihak-postelovy-kp03-baleny--jednolozko-priecne-70-par/?ts_preview=39e57b6aada2f2b60ff1d7478afd671a2821efe3).

Implementation commit **`39e57b6aada2f2b60ff1d7478afd671a2821efe3`**, runtime **v0.7.0-related.3**, vetva `preview/related-card-stability-20261023`. Odkaz prepne staršiu preview cookie na tento konkrétny commit. [Vypnúť preview](https://www.timberstore.sk/?ts_preview=off).

## Overenie publikovaných súborov

[CSS](https://cdn.jsdelivr.net/gh/Timberstore/timberstore@39e57b6aada2f2b60ff1d7478afd671a2821efe3/dist/timber.min.css) · [JS](https://cdn.jsdelivr.net/gh/Timberstore/timberstore@39e57b6aada2f2b60ff1d7478afd671a2821efe3/dist/timber.min.js).

Oba HTTP 200, bajtovo zhodné s finálnym buildom vrátane SHA-256: [dôkaz](evidence/cdn-assets.json).

Chromium **1440/390 px cez skutočnú CDN**, bez náhrady aplikačných assetov: kategória → produkt → Back, obrázky zámerne oneskorené o 4000 ms. Cena, množstvo a CTA v rovnakom snímku vo všetkých testovaných kartách; rozsah zmien rozmerov/polohy ovládačov relatívne k formuláru **0 px**. Jednotky už pri prvom zobrazení cien súvisiacich/podobných FRANKE. [Výsledky](evidence/cdn.json), [desktop timing](evidence/cdn-timing-1440.json), [mobile timing](evidence/cdn-timing-390.json).

Natívne množstvo +/−, jeden nákupný POST, 1 ks v dátach serverového košíka a v hlavnom košíku, kategória → kategória → Back: **PASS 390 px na skutočnej CDN**. [Výsledok](evidence/cdn-functional.json). Nebola vytvorená objednávka ani platba.

[Screenshot desktop](images/category-1440.png) · [screenshot mobil – dve karty vedľa seba](images/category-390.png). Cookie banner odmietnutý natívnym tlačidlom; screenshoty dokladajú výsledný vzhľad, časové rozdiely dokladá RAF meranie.

Samostatná čistá relácia bez preview: loader **v0.7.0**, runtime **v0.7.0**, preview **false**. [Dôkaz](evidence/production.json).

Bez merge, tagu, GitHub release, zmeny loadera alebo administrácie Shoptetu. Nasledujúci dokumentačný commit nemení build. Na testovanie použite vyššie uvedený immutable hash.
