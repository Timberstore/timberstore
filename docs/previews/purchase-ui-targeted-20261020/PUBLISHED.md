# Publikovaná immutable preview

- Verzia **0.7.1-rc.2**, commit **`25b55106a9198ebc772224ea9d4646dd60b83a99`**.
- Vetva `preview/ui-consistency-20261020`.
- **[Otvoriť immutable preview](https://www.timberstore.sk/?ts_preview=25b55106a9198ebc772224ea9d4646dd60b83a99)**.
- [Detail FRANKE so súvisiacimi/podobnými](https://www.timberstore.sk/franke-drez-bfg-611-970x500mm-cierna-matna/?ts_preview=25b55106a9198ebc772224ea9d4646dd60b83a99).
- Preview sa ukladá do cookie; návrat na bežnú produkciu cez [ts_preview=off](https://www.timberstore.sk/?ts_preview=off).

## CDN – PASS

[CSS](https://cdn.jsdelivr.net/gh/Timberstore/timberstore@25b55106a9198ebc772224ea9d4646dd60b83a99/dist/timber.min.css) · [JS](https://cdn.jsdelivr.net/gh/Timberstore/timberstore@25b55106a9198ebc772224ea9d4646dd60b83a99/dist/timber.min.js)

Oba assety HTTP 200, `cmp` bez rozdielu oproti finálnemu dist a overené SHA-256: [bajtová zhoda](evidence/cdn-byte-match.json).

Priamy Chromium smoke cez skutočné CDN bez náhrady dist: **1440, 390, 320 px PASS**. Každá prvá živá odpoveď GetExtendedOrder tu obsahovala odporúčanie. Homepage, kategória, živý popup/nákup, košík/AJAX množstvo, modré hlavné ceny, produktový detail a Možnosti doručenia. Žiadne pageError v tejto sade. [Výsledky](evidence/cdn-smoke.json), [log](evidence/cdn-smoke.log), [skript](verification/cdn-smoke.cjs).

Nezávislá nová session bez preview: loader **v0.7.0**, runtime **v0.7.0**, preview **false** — **PASS**. [Záznam](evidence/production-observed.json).

## Rozsah publikovania

Remote main stále `d42ec21a1205eb753594eca057a7c26e13c9cf8c`; pôvodný tag v0.7.0 stále commit `db193dbbab7fc778676930ebecbc4a9764be4b16` ([remote refs](evidence/remote-scope.txt)). `shoptet/loader.html` nemá oproti vstupu žiadnu zmenu. Bez merge, nového tagu, GitHub release alebo zmeny administrácie Shoptetu.

Nasledujúci dokumentačný commit iba dopĺňa dôkazy publikovania a nemení runtime/build. Na testovanie používajte vyššie uvedený immutable commit, nie pohyblivý názov vetvy.

Úplné výsledky a **NOT VERIFIED** scenáre sú v [README](README.md); CDN smoke neruší tieto obmedzenia.
