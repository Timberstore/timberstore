# Aktuálne preview 0.7.6-rc.1 – pôvodné farby

Majiteľ odmietol kontrastné možnosti A/B a výslovne požiadal zachovať pôvodné farby tlačidiel aj ikon. Odsúhlasil kontaktný layout a veľkosti nadpisov. Kategórie rieši sám.

Odstránené: obidve kontrastné možnosti, ich JS voľba/sessionStorage handler, data atribút, CSS prefarbenie CTA/skladov/pätičky a všetky skúšobné farebné tokeny. Ani starý parameter `ts_contrast=copper`/`ink` alebo uložená voľba ich v tomto builde nedokáže aktivovať. Ikony emailu/telefónu na kontaktoch čerpajú pôvodnú oranžovú `--ts-color-accent` zo spoločnej palety. Hover odkazov používa tiež pôvodný akcent.

Zachované: kontaktný layout vrátane pôvodného formulára, potvrdeného DIČ, spoločných hodín a firemných údajov; schválené veľkosti nadpisov, ich sémantická hierarchia a úvodný H1; skoršie N/A → Timber Store v zobrazení. Žiadny import, zmena expedičných lehôt/kategórií, administrácie alebo produkčného loadera.

Iba nový commit-preview; bez merge, tagu alebo release. Produkcia na v0.7.5. Gzip JS 36.06 / 36.25 KiB; CSS 31.91 / 32.5 KiB, bez zmeny limitov starších verzií. Lint/build/whitespace PASS. Safari na iPhone a PageSpeed NOT TESTED.

Trvalá oprava zdrojových CMS nadpisov a zdroja značiek nie je vykonaná; toto zostáva ukážka v prehliadači, rovnako ako rc.0.

## Overený commit-preview

Zdroj/build: `2e3f454619984b7326e89373697e1ee706c0031b`. Presné CDN bajty PASS. Chromium 375/1440 px: normálne aj desktop hover farby tlačidla formulára, pätičky a produktového detailu zhodné s produkčnou v0.7.5; skladový text a pätičkové odkazy rovnako. Ikony kontaktov zodpovedajú pôvodnej oranžovej pätičky. Staré varianty v sessionStorage/URL ignorované. Natívny formulár, jeho cieľ a validácia zachované; opakované init bez duplikácie. Konzola bez nových chýb. Doprava/VOP/reklamácie: všetok text a vizuálne farby/veľkosti/rozostupy pôvodných nadpisov identické, iba sémantická hierarchia upravená na jeden H1. Homepage H1 zachovaný. Súbory `original-colours-cdn-qa.json` a `original-colours-cdn-assets.json`.

- Kontakty: https://www.timberstore.sk/kontakty/?ts_preview=2e3f454619984b7326e89373697e1ee706c0031b
- Nadpisy článku: https://www.timberstore.sk/doprava-a-platba/?ts_preview=2e3f454619984b7326e89373697e1ee706c0031b
- Úvod: https://www.timberstore.sk/?ts_preview=2e3f454619984b7326e89373697e1ee706c0031b
- Vypnutie: https://www.timberstore.sk/?ts_preview=off
