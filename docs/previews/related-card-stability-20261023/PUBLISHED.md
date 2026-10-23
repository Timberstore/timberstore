# Immutable preview · overené 23. 10. 2026

**[Otvoriť opravený produkt KP03](https://www.timberstore.sk/zdvihak-postelovy-kp03-baleny--jednolozko-priecne-70-par/?ts_preview=cca35b048c27525972b2bc49f024cca5710dfa0a)**

- Zdrojový commit **`cca35b048c27525972b2bc49f024cca5710dfa0a`**, runtime **v0.7.0-related.1**.
- Samostatná vetva `preview/related-card-stability-20261023`, priamo z `main` (`6b6a4cd`), nie z odmietnutej UI preview.
- Cookie novým odkazom prepne na tento konkrétny commit. [Bežná produkcia bez preview](https://www.timberstore.sk/?ts_preview=off).
- Neexistuje nový tag alebo release; používajte celý immutable hash.

## CDN a živé testy — PASS

[CSS](https://cdn.jsdelivr.net/gh/Timberstore/timberstore@cca35b048c27525972b2bc49f024cca5710dfa0a/dist/timber.min.css) · [JS](https://cdn.jsdelivr.net/gh/Timberstore/timberstore@cca35b048c27525972b2bc49f024cca5710dfa0a/dist/timber.min.js).

HTTP 200, presná bajtová zhoda cez cmp a SHA-256 oproti finálnemu build: [dôkaz](evidence/cdn-assets.json).

Skutočné CDN, bez nahradenia zdrojov lokálnym buildom alebo fixture dát: **1440 a 390 px PASS**, každý dve reálne navigácie názov/obrázok súvisiaceho produktu a Back. Rozsah pohybu meraného obsahu 0 px. V detailovom dokumente presne jeden navigačný opt-out štýl. Žiadne pageError. [JSON](evidence/cdn.json), [skript](verification/cdn.cjs).

**Screenshoty po skutočnom návrate späť cez nový CDN preview:** [desktop](images/cdn-history-1440.png), [mobil](images/cdn-history-390.png).

## Produkcia — nezmenená

Nová nezávislá relácia bez preview cookie: loader **v0.7.0**, runtime **v0.7.0**, `preview=false`. [Záznam](evidence/production.json).

Remote main **6b6a4cd**, tag v0.7.0 stále commit **db193dbbab7fc778676930ebecbc4a9764be4b16**. [Remote refs](evidence/remote.txt). Loader Shoptetu bez zmeny. Nebol merge, tag, release, produkčné nasadenie ani zásah do administrácie.

Nasledujúci dokumentačný commit iba pridáva tieto dôkazy; build je stále z vyššie uvedeného immutable commitu.
