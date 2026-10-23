# Immutable preview · related.2

**[Otvoriť kategóriu s opravenými ovládačmi](https://www.timberstore.sk/granitove-drezy/?ts_preview=1e465fdb04f581e028a6f60fc76b6dc5a11c8e13)**

**[Detail so súvisiacimi produktmi](https://www.timberstore.sk/zdvihak-postelovy-kp03-baleny--jednolozko-priecne-70-par/?ts_preview=1e465fdb04f581e028a6f60fc76b6dc5a11c8e13)**

Commit **`1e465fdb04f581e028a6f60fc76b6dc5a11c8e13`**, runtime **v0.7.0-related.2**, stále `preview/related-card-stability-20261023`. Nový odkaz prepne pôvodnú preview cookie na tento konkrétny commit. [Bežná produkcia bez preview](https://www.timberstore.sk/?ts_preview=off).

## CDN a skutočný browser smoke — PASS

[CSS](https://cdn.jsdelivr.net/gh/Timberstore/timberstore@1e465fdb04f581e028a6f60fc76b6dc5a11c8e13/dist/timber.min.css) · [JS](https://cdn.jsdelivr.net/gh/Timberstore/timberstore@1e465fdb04f581e028a6f60fc76b6dc5a11c8e13/dist/timber.min.js).

Oba HTTP 200 a bajtovo zhodné s finálnym dist cez cmp aj SHA-256. [Dôkaz](evidence/cdn-assets.json).

Chromium cez skutočnú CDN, bez lokálnej náhrady assetov: **1440 a 390 px PASS**. Cold otvorenie kategórie, klik produktu, prvé viditeľné ceny súvisiacich/podobných už s jednotkou, Back a geometria oboch nákupných riadkov. Rozsah zmien rozmerov/polohy ovládačov **0 px**. Pre jednotky žiadne fetchovanie ďalších produktových dokumentov. Žiadna nová pageError. [Merania](evidence/cdn.json), [skript](verification/cdn.cjs).

Screenshoty dvojice kariet po Back: [desktop](images/category-1440.png), [mobil](images/category-390.png).

Nová nezávislá relácia bez preview: loader **v0.7.0**, runtime **v0.7.0**, preview **false**. [Záznam](evidence/production.json).

Žiadny merge, tag/release, zmena loadera alebo administrácie Shoptetu. Nasledujúci dokumentačný commit iba dopĺňa dôkazy; na testovanie používajte vyššie uvedený immutable commit.
