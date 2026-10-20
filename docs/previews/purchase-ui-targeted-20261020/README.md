# Purchase UI targeted refinement · 2026-10-20

Verzia **0.7.1-rc.2**, iba vetva `preview/ui-consistency-20261020`. Východiskový runtime: `ff681ac9c1f789e4a848cd5ac13bf7d6d49478f8` (rc.1); východiskový HEAD dokumentácie: `54ac80a0ada8a124a13d844b752cebac44cb83cd`.

[Immutable preview, CDN a kontrola produkcie](PUBLISHED.md) · [zmenené súbory](FILES.md) · [spustenie overení](verification/README.md).

## Konkrétne opravy

| Blok | Zistená príčina → výsledok |
| --- | --- |
| Popup po nákupe | Doplnkové volania `shoptet.modal.resize()` po dokončení a po načítaní jednotky spolu s natívnym resize; animované prázdne bočné Colorbox obaly určovali výšku. Odstránené nadbytočné volania, lokálne stabilné obaly a nulová výška prázdnych bočných dielov. Bez nového observera, časovača alebo skrývania načítaného obsahu. |
| Zelený header, doprava, tlačidlá | Súvislý 1 px zelený border a pôvodná ikona/text/close. `width:100%` spolu s horizontálnymi marginmi rozširovalo extras blok za okraj popupu; teraz automatická šírka, symetrické odsadenie a centrovaný text/progress. Outline späť, oranžové pokračovanie s natívnou bielou cart ikonou. |
| Desktop odporúčania v popupe | Lokálna šesťstĺpcová mriežka: fotografia / názov+kód / sklad / ceny / množstvo / iba cart ikona. Viac produktov oddeľujú jemné čiary. |
| Mobilné odporúčania | Fotografia hore, názov a kód, sklad vľavo a cena vpravo; široké množstvo vedľa icon-only tlačidla. Aj 9999 sa zmestí bez zmenšenia textu. |
| Súvisiace a podobné na detaile | Klasické vertikálne karty s fotografiou hore a plným „Do košíka“. Zachované natívne rozmery/počet kariet v carousel slidoch aj ich navigácia. Bez tabuľkového popup rozloženia v detaile. |
| Apollo a ceny | Starý `:not(#colorbox *)` pridával ID špecificitu a prebil lokálny layout. Použité lokálne selektory s primeranou špecificitou. Apollo na mobile premiestňuje hlavnú cenu mimo `.prices`: rovnaký existujúci uzol sa idempotentne vráti do pôvodného cenového obalu v tej istej karte. Žiadne kópie cien alebo formulárov. |
| Možnosti doručenia | Zrušené konfliktné inline rozmery obalov: pôvodné `clientHeight=462`, `scrollHeight=464` vytváralo nadbytočný posuvník. Pri dostatku miesta bez scrollu; pri malej výške jediný scroller `#cboxLoadedContent`. Pôvodné dopravné dáta, nadpis a spodný panel zostali. |
| Odberné miesto | Skutočný odkaz `[data-testid=deliveryPoint] > a` používa existujúci slivkový token `--ts-color-novelty`, **#7B3F68**. |

Hlavné ceny aj € sú #2454A6, jednotka na rovnakom riadku neutrálna; menšia neutrálna cena bez DPH pod nimi. Sklad sa centruje pod seba, CENTRALNY / SKLAD / množstvo. Natívne skladové texty, sumy, DPH, jednotky, min/max/step, formuláre, identifikátory a Shoptet udalosti zostávajú zdrojom údajov. Bez zásahov do warehouse-stock, galérie alebo globálneho headera.

## Skutočné merania stability

Vzorkovanie `getBoundingClientRect()` každý animation frame od prvého viditeľného načítaného obsahu po finálne načítanie jednotky. Pôvodný skrytý loading nie je viditeľný obsah.

| Šírka | Pred: rozsah Y / výšky | Po: rozsah X / Y / šírky / výšky |
| --- | --- | --- |
| 1440 | 47 / 126 px | 0 / 0 / 0 / 0 px |
| 390 | 166 / 344 px | 0 / 0 / 0 / 0 px |
| 1280, 768, 430, 375, 320 | pred nemerané | všade 0 / 0 / 0 / 0 px |

V pôvodnom zázname tri volania modal resize. Na 390 px je finálne overenie aj s oneskorením odpovede pre jednotku 2500 ms. [Pred 1440](evidence/before-1440.json), [pred 390](evidence/before-390.json), [všetky finálne snímky meraní](evidence/stability-final.json).

## Výsledky Chromium

PASS znamená úspech uvedeného scenára; fixture/replay nie je živá integrácia.

| Scenár | Rozsah | Výsledok / dôkaz |
| --- | --- | --- |
| Popup, ceny/jednotky/netto, 6 stĺpcov na desktope, mobilná karta, 1/1000/9999, symetria progressu, súvisiace/podobné, doprava | 1440, 1280, 768, 430, 390, 375, 320 | **PASS**, [targeted](evidence/targeted.json) |
| Stabilita od prvého viditeľného obsahu | rovnakých 7 šírok | **PASS**, [stability](evidence/stability-final.json) |
| Viac odporúčaní, rôzne sklady/dlhé názvy, vysoká cena a jednotka / sada | rovnakých 7 šírok | **PASS – replay/fixture** troch zachytených natívnych produktov; vysoká cena syntetická, iba geometria. [multi-layout](evidence/multi-layout.json) |
| Reálny nákup, opakované otvorenie/zatvorenie a nákup odporúčania | 1440, 390, 320 | **PASS**, skutočný anonymný Shoptet košík a kontrola jedného POST a serverového množstva. [live-popup](evidence/live-popup.json) |
| Balenie min/step 1000, +2000 / −1000, nákup 1000, plum odberné miesto | 1440, 390, 320 | **PASS**, živé BLUM 485572 → StrongFix 11109. [native-pack-pickup](evidence/native-pack-pickup.json) |
| Dlhý obsah popupu | 1440, 390, 320 | **PASS – replay** 6 kariet: jediný vnútorný scroller, dostupný spodok, body odomknuté po zavretí. [popup-scroll](evidence/popup-scroll.json) |
| Doprava v nízkom viewporte, následné otvorenie galérie a prepnutie fotografie | 1440, 390, 320; výška 480 | **PASS**, [modal-gallery](evidence/modal-gallery.json) |
| Homepage, kategória, dva produkty vedľa seba, tabuľka, sidebar/footer | 1440, 1280, 1024, 768, 430, 390, 375, 320 | **PASS**, [layout](evidence/layout.json) |
| Natívne homepage slidery a 9 nákupov, mini košík | 1440, 390, 320 | **PASS**, [home-native](evidence/home-native.json), [mini](evidence/mini.json) |
| Modré hlavné ceny/€, neutrálne sekundárne ceny, súvisiaci tovar a natívny prepočet | 8 šírok + AJAX | **PASS**, [cart-prices](evidence/cart-prices.json) |
| Filtre/AJAX, opakovaný lifecycle bez duplicít a jediný nákupný POST | 1440, 390 | **PASS**, [ajax](evidence/ajax.json) |
| Načítanie ďalších a checkout suma | natívne komponenty | **PASS**, [loadmore-checkout](evidence/loadmore-checkout.json); bez odoslania objednávky alebo platby |
| Rozbalenie variantov a navigácia | 390, 320 | **PASS – externé dáta replay**, reálna navigácia; [variant-interactions](evidence/variant-interactions.json) |
| Skutočné immutable CDN, nákup/popup, košík AJAX, detail/doprava; čistá produkčná session | 1440, 390, 320 | **PASS**, [publikovanie](PUBLISHED.md) |
| Lint, build, diff whitespace | rc.2 | **PASS**, [výstup](evidence/final-checks.txt), [bajty a hash](evidence/build.json) |

Celostránkový horizontálny overflow sa kontroluje skutočným `scrollWidth` a geometriou. Žiadny nový globálny `overflow-x:hidden` na html/body.

## Zistené obmedzenia

- **NOT VERIFIED:** Safari/WebKit a fyzický iPhone sa v tejto zmene netestovali. Staršia release výnimka nie je PASS pre túto preview.
- **NOT VERIFIED:** živá synchronizácia externých variantov z `friends.shopcode.cz` je v prostredí nedostupná; rozbalenie je označený replay zachytených dát.
- **NOT VERIFIED:** živý popup s viacerými odporúčaniami. Skutočné odpovede pre 354068, 485572 a 477822 obsahovali po jednom odporúčaní; [ďalšie živé sondy](evidence/native-multi.json). Viacriadková geometria bola overená replayom, nevydávame ju za živú odpoveď.
- Shoptet `GetExtendedOrder` občas vráti `payload.content:false`. V konečnej matici to nastalo na prvý pokus pri 768 px. Tento pokus **NOT VERIFIED** pre otvorenie popupu; ďalšie reálne pridanie v testovacom scenári vrátilo obsah a kontrola rozloženia prešla. Aplikačný kód nezavádza retry ani náhradný popup; externú prázdnu odpoveď táto UI oprava nerieši. Odpovede sú zachované v JSON dôkazoch.
- V testovaných scenároch po oprave nebola zistená nová UI regresia. Obmedzenia vyššie zostávajú otvorené.

## Screenshoty

| Požadovaný pohľad | Screenshot |
| --- | --- |
| Desktop nákupný popup | [1440 px](images/popup-final-1440.png) |
| Mobilný nákupný popup | [390 px](images/popup-final-390.png), [320 px](images/popup-final-320.png) |
| Možnosti doručenia | [desktop](images/shipping-final-1440.png), [mobil](images/shipping-final-390.png) |
| Súvisiace produkty na detaile desktop | [1440 px](images/related-final-1440.png) |
| Súvisiace produkty na detaile mobil | [390 px](images/related-final-390.png) |
| Podobné produkty | [desktop](images/similar-final-1440.png), [mobil](images/similar-final-390.png) |
| Viac odporúčaní – výslovne replay | [desktop](images/popup-multiple-fixture-1440.png), [mobil](images/popup-multiple-fixture-390.png) |

## Build a rozsah

JS gzip **32 999 B / 33 280 B**, CSS gzip **28 927 B / 28 928 B**. Existujúce limity 32,5 / 28,25 KiB zachované bez navýšenia. Ušetrený opakovaný JS resize kód a bezstratovo zlúčených deväť ekvivalentných dvojíc legacy title selektorov cez `:is()`; dva konštantné výpočty line-clamp výšky sú zjednodušené bez zmeny výsledku alebo špecificity. Rozmery pôvodných homepage/kategória kariet sa tým nemenia; zahrnuté do regresnej matice.

Bez merge do main, release, tagu, úpravy produkčného loadera alebo administrácie Shoptetu. Produkcia a jej rollback tagy zostávajú zachované. Preview cez commit je jediné publikovanie.
