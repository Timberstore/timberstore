# Súvisiace produkty: NOVINKA a stabilita po návrate späť

**Malá samostatná preview `0.7.0-related.1`, vetva `preview/related-card-stability-20261023`.** Základ je `main` commit `6b6a4cd`, ktorého aplikačné zdroje a build zodpovedajú vydaniu **v0.7.0** (`db193db`). Žiadne zdroje z odmietnutej `preview/ui-consistency-20261020` nie sú prenesené.

[Publikovaný immutable odkaz](PUBLISHED.md). Produkcia ani loader Shoptetu sa nemenia. Návrat na bežnú produkciu a vymazanie starého preview cookie: https://www.timberstore.sk/?ts_preview=off.

## Rozsah opravy

- `src/styles/overrides/recommendations.css`: pôvodné štítky sú vo vnútri obrázka, mimo orezávacieho zaobleného rohu karty. Pôvodné fotky, pomery strán, slider, počty kariet, farby a text štítku sa nemenia. Karty sa odhalia po existujúcom natívnom `after-load` a svojej príprave; bez nového časovača či čakania na doplnkovú jednotku. Prechod sa obmedzí na farby, neanimuje geometriu/visibility. Prázdny CSS slot rezervuje miesto pre overenú jednotku ešte pred jej doplnením; žiadna vymyslená jednotka alebo zmena ceny.
- `src/styles/overrides/product-metadata.css`: rovnakých 12,5 px / 18,75 px pre kód od prvého CSS vykreslenia, aj pred doplnením metadata tried. Mení sa prezentácia, nie hodnota SKU. Natívne skrytie SKU na niektorých mobilných kartách zostáva.
- `src/modules/product-compact/index.js`: jediný nový jednorazový štýl `@view-transition{navigation:none}` **len na detailových dokumentoch**. Vypne zachytenie celostránkovej snímky počas produktových navigácií/histórie. Pôvodná legacy opt-in snímka vedela po Back ponechať starú geometriu a rozpracované CSS prechody. Opt-out cez samotné `view-transition-name:none` nestačil; konečný test používa riadne vypnutie navigačnej snímky na detaile. Kategória a homepage si zachovávajú existujúce prechody. Bez nových observerov/časovačov/handlerov histórie, duplikovaných produktových elementov alebo zmeny cien, skladov, formulárov či košíka.

Zvyšné zmenené súbory sú package/lock, explicitný preview limit v `scripts/build.mjs`, generovaný `dist/*`, tento audit a changelog. Galéria, variantové karty, hlavný nákupný panel a warehouse-stock bez zásahu.

## Reprodukcia a merania

Živý produkt zo screenshotu: [Zdvihák posteľový KP03](https://www.timberstore.sk/zdvihak-postelovy-kp03-baleny--jednolozko-priecne-70-par/), kód **11431**. Súvisiace: pružina **11454**, kryt **500212**. Klik na súvisiaci názov/obrázok, natívna navigácia na jeho detail a browser Back, opakovane.

| Pri zámernom oneskorení Timber JS 4500 ms | v0.7.0 pred opravou | Nová preview |
| --- | --- | --- |
| Kód na 1440 px | 10 → 12,5 px, x v karte 142,859 → 137 px | iba 12,5 px, x 137 px |
| Výška karty na 1440 px | 460,766 → 453,563 px | 453,563 px od prvého zobrazenia |
| Výška karty na 390 px | 451,625 → 437,609 px | 437,609 px od prvého zobrazenia |
| Hodnota SKU | 11454 zostáva; mení sa label/typografia | hodnota zostáva 11454 |

[Spomalený mobil](evidence/slow-390.json), [spomalený desktop](evidence/slow-1440.json). Časovanie je testovacie oneskorenie, nie pridané čakanie v aplikácii.

## Finálne testy

Chromium, normálne nastavenia navigačných prechodov prehliadača; bez testovacieho vypnutia feature a bez fixture produktových dát. Každá šírka: dva cykly (klik na názov → Back, klik na obrázok → Back). Merajú sa rozmery a súradnice obsahu relatívne ku karte od prvého viditeľného pripraveného stavu. Prirodzené obnovenie scrollu stránky sa nevydáva za pohyb obsahu v karte. Natívne nezobrazované elementy s prázdnym `getClientRects()` sa nepočítajú ako viditeľné.

| Kontrola | Výsledok |
| --- | --- |
| 1440, 768, 430, 390, 375, 320, 2074 px | **PASS**, výsledky v [matici](evidence/matrix.json) |
| Kód, názov, fotka a hlavná číselná cena po návrate | nulový nameraný rozsah pohybu viditeľných elementov; šírka/výška kariet stabilná |
| NOVINKA | celý text a celý štítok v bezpečnom obdĺžniku obrázka; bez zásahu do overflow slidera |
| Horizontálny overflow dokumentu | `scrollWidth <= innerWidth` na všetkých uvedených šírkach |
| Homepage, kategória, hlavička, galéria a hlavný nákupný panel oproti v0.7.0 | **PASS** na 1440/390/320 px; rozmery v tolerancii 0,5 px, typografia/farby zhodné. [Dôkaz](evidence/functional.json) |
| Množstvo súvisiaceho produktu + / − a nákup | **PASS** na 1440/390/320 px; jediný natívny POST, server a hlavný košík obsahujú presne 2 ks 11454. Bez objednávky/platby. |
| Lint, build a diff whitespace | [Finálne kontroly](evidence/checks.txt) |
| Skutočné immutable CDN | [Publikovanie a zhoda](PUBLISHED.md) |

Prvé automatizované pokusy odhalili ďalšie zachytenie starej snímky po Back: prvý návrat mal stabilnú geometriu, druhý klik sa v Chromium bez lokálneho opt-out nezrealizoval. Diagnostické vypnutie `ViewTransitionOnNavigation` v testovacom prehliadači potvrdilo súvislosť; **toto nastavenie nie je použité vo finálnej matici**. Finálna oprava rieši opt-in na produkte. Samostatný `view-transition-name:none` bol neúčinný a bol odstránený. Prvý geometrický test tiež chybne považoval natívne `display:none` SKU za viditeľné a očakával desktopové odsadenie štítku aj na mobile; opravené meranie rešpektuje skutočné zobrazenie a geometriu. Porovnanie mimo detailu povoľuje len subpixel rozdiel do 0,5 px (pozorovaný 0,047 px), nie zmenené rozmery.

## Screenshoty

- [Desktop 1440 px](images/after-1440.png)
- [Mobil 390 px](images/after-390.png), [320 px](images/after-320.png)
- [Pôvodná v0.7.0 v testovacom prostredí](images/before-1440.png)

Screenshoty zobrazujú čerstvo načítaný konečný stav; históriu dokladujú namerané cykly, nie statický screenshot. Orezaný susedný slide v mobilnom carouseli je pôvodný natívny slider, nie horizontálny overflow celej stránky.

## Build a obmedzenia

JS **32 507 B gzip / 32 768 B**, CSS **27 497 B / 27 648 B**. Pre jedinú novú preview je CSS limit 27 KiB namiesto 26,75 KiB; rozdiel oproti stabilnému CSS je 157 B gzip. Stabilné tagy a ich limity bez zmeny. JS limit zostáva 32 KiB. Rozšírenie podľa existujúceho súhlasu majiteľa na potrebný priestor pre úpravy.

Safari/WebKit a fyzický iPhone: **NOT VERIFIED**. Variantový externý feed nebol súčasťou tejto opravy ani testu. Testy súvisiaceho tovaru používajú skutočné verejné Shoptet dáta; nemenia skladovú alebo cenovú logiku. Skutočná objednávka/platba neodoslaná.

Bez merge, nového tagu/release, produkčného nasadenia alebo zmeny administrácie Shoptetu.
