# Aktuálne preview 0.7.6-rc.1 – pôvodné farby

Majiteľ odmietol kontrastné možnosti A/B a výslovne požiadal zachovať pôvodné farby tlačidiel aj ikon. Odsúhlasil kontaktný layout a veľkosti nadpisov. Kategórie rieši sám.

Odstránené: obidve kontrastné možnosti, ich JS voľba/sessionStorage handler, data atribút, CSS prefarbenie CTA/skladov/pätičky a všetky skúšobné farebné tokeny. Ani starý parameter `ts_contrast=copper`/`ink` alebo uložená voľba ich v tomto builde nedokáže aktivovať. Ikony emailu/telefónu na kontaktoch čerpajú pôvodnú oranžovú `--ts-color-accent` zo spoločnej palety. Hover odkazov používa tiež pôvodný akcent.

Zachované: kontaktný layout vrátane pôvodného formulára, potvrdeného DIČ, spoločných hodín a firemných údajov; schválené veľkosti nadpisov, ich sémantická hierarchia a úvodný H1; skoršie N/A → Timber Store v zobrazení. Žiadny import, zmena expedičných lehôt/kategórií, administrácie alebo produkčného loadera.

Iba nový commit-preview; bez merge, tagu alebo release. Produkcia na v0.7.5. Gzip JS 36.06 / 36.25 KiB; CSS 31.91 / 32.5 KiB, bez zmeny limitov starších verzií. Lint/build/whitespace PASS. Safari na iPhone a PageSpeed NOT TESTED.

Trvalá oprava zdrojových CMS nadpisov a zdroja značiek nie je vykonaná; toto zostáva ukážka v prehliadači, rovnako ako rc.0.
