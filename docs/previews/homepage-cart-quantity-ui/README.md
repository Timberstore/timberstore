# Homepage Cart & Quantity UI Fix

Vetva `preview/product-detail-compact-pro-20261019`; referencia pred úpravou `f69480782aaeb1f0a9b34151a6e1ecbb00b14ebe`. Iba preview. Bez merge, tagu, release, admin zásahu alebo produkčného nasadenia.

## Výsledok

Tri existujúce homepage slidery (TOP Produkty, Novinky v ponuke, Výsuvy MERIVOBOX) používajú lokálny nákupný riadok. Ovládač má základ 100 px, tlačidlo maximálne 148 px, výšku 38 px a medzeru 12 px. Obsah je centrovaný s minimálnym symetrickým paddingom 20 px. Pri nedostatku miesta sa šírky pružne prispôsobujú. Text a biela natívna ikona košíka sú centrovaná skupina s medzerou 10 px; ikona je napravo.

CSS container query sleduje skutočnú šírku karty: od 280 px zostáva text „Do košíka“, na užšej karte sa skryje iba text. Ikona a prístupný názov zostávajú. Číselné pole má naďalej 14 px. Pôvodná Swiper štruktúra, formuláre, inputy, natívne submit udalosti a celý JavaScript sú nezmenené.

## Spoločné hodnoty množstevných ovládačov

Najskôr boli zmerané computed styles mini košíka: vonkajší rám **1 px #C97A2B**, radius **7 px**, výška **36 px**, segmenty **30 / 38 / 30 px**, biely stred a neutrálne tónované tlačidlá **#F5F0E9**. Samotné symboly sú v referencii neutrálne **#423E3E**, nie červené/oranžové.

Nové `--ts-qty-*` tokeny odkazujú na existujúce farby, nevytvárajú novú paletu:

- rám `--ts-color-controls-active` (#C97A2B), 1 px;
- radius 7 px, prevzatý z mini košíka;
- mínus `--ts-color-error` (#B83B43), pozadie `--ts-color-error-bg` (#FCEDEF);
- plus `--ts-color-controls-active` (#C97A2B), tónované pozadie `--ts-color-service-bg` (#F5F0E9);
- deliace čiary `--ts-color-controls-border` (#E5E0DA), biely stred.

Karty, tabuľka, popup, súvisiace/podobné a detail používajú tieto zdieľané hodnoty. Zjednotenie nemení funkčné selektory ani handlery. **Mini a hlavný košík ostali vizuálne aj geometricky identické s referenciou**, vrátane viditeľných pôvodných symbolov. Ich neutrálne symboly ponechávame podľa výslovnej požiadavky „bez zásahu“; nevydávame ich za červené/oranžové.

Z rovnakého dôvodu sa neprenášali pevné šírky a výšky mini košíka do kariet: karty majú pôvodných **38 px**, detail/košíky **36 px**. Natívne segmenty a responzívne pomery mimo homepage zostali. Jednotlivé segmenty sú v rámci každého ovládača výškovo zarovnané. Kategórie ani vyhľadávanie nedostali novú Grid/Flex štruktúru, šírky, padding, gap alebo nové breakpointy. Tabuľka si ponecháva aj pôvodnú tučnosť čísla 800; zmenili sa iba povolené farby/rámik/radius ovládača.

## Skutočné merania homepage

Prvá karta TOP produktov; všetky tri sekcie mali pri každej šírke rovnaké nákupné rozmery. Hodnoty z `getBoundingClientRect()`:

| Viewport | Karta | Množstvo pred → po | Košík pred → po | Ľavý/pravý odstup po | Text košíka po |
| --- | ---: | ---: | ---: | ---: | --- |
| 1440 px | 329.50 | 118.00 → 100.00 | 175.50 → 148.00 | 34.75 / 34.75 | viditeľný + ikona |
| 1280 px | 366.00 | 118.00 → 100.00 | 212.00 → 148.00 | 53.00 / 53.00 | viditeľný + ikona |
| 1024 px | 297.33 | 118.00 → 98.86 | 143.33 → 146.47 | 20.00 / 20.00 | viditeľný + ikona |
| 768 px | 333.50 | 88.00 → 100.00 | 221.50 → 148.00 | 36.75 / 36.75 | viditeľný + ikona |
| 430 px | 370.00 | 88.00 → 100.00 | 258.00 → 148.00 | 55.00 / 55.00 | viditeľný + ikona |
| 390 px | 330.00 | 88.00 → 100.00 | 218.00 → 148.00 | 35.00 / 35.00 | viditeľný + ikona |
| 375 px | 315.00 | 88.00 → 100.00 | 203.00 → 148.00 | 27.50 / 27.50 | viditeľný + ikona |
| 320 px | 260.00 | 88.00 → 82.81 | 148.00 → 125.19 | 20.00 / 20.00 | skrytý, ikona zostáva |

Po oprave je medzera medzi ovládačom a CTA vždy **12 px**, oba majú **38 px** výšku. Tlačidlo bolo predtým 50 px na desktope a 38 px na menších šírkach. Overené aj 2 karty vedľa seba v kategórii a vyhľadávaní (390/375/430 px): ich pôvodná geometria ostala bez zmeny. Homepage používa natívny slider; pri 320 px jeho karta má 260 px a bezpečne zmestí oba ovládače.

## Funkčné a regresné testy

[Podrobné výsledky a merania](verification.json).

- **8 šírok × 3 homepage sekcie, 256 kariet:** 1440, 1280, 1024, 768, 430, 390, 375, 320 px. Bez prekrývania ovládačov, presahu z kariet alebo horizontálneho scrollu stránky. Kontrolované aj dlhé a kratšie natívne názvy; ich typografia/clamp sa nemenili.
- **24 reálnych homepage nákupov:** všetky 3 sekcie na všetkých 8 šírkach. Plus, mínus, dolná hranica, priame zadanie, jediný amount input a jeden POST na kliknutie; skutočne odoslané a uložené množstvo. Overené celkové sumy, súčty riadkov, počet kusov v hlavičke a informácia o doprave.
- Natívny Swiper: posun existujúcim API, zmena aktívneho indexu a nákup z ďalšej karty vo všetkých 24 kombináciách.
- Mini košík na všetkých 8 šírkach: viditeľné symboly, natívne plus/mínus, serverový počet aj súčty po AJAX. Samostatné presné porovnanie všetkých segmentov a computed styles mini aj hlavného košíka pri 1440/390 px: **bez rozdielov**. Hlavný košík: natívne 1 → 2 → 1, skutočný riadkový súčet 2,26 → 4,52 → 2,26 €.
- **Kategória + vyhľadávanie, 16 porovnaní pred/po:** všetkých 8 šírok, navyše oba desktopové režimy mriežka/tabuľka. Prvé 3 karty: pozície a rozmery kariet, názvov, ceny, skladu, množstva, segmentov a CTA, padding/gap/fonty aj header — **žiadny geometrický rozdiel**. Mení sa iba povolená farebnosť a radius ovládača.
- **Skutočná natívna AJAX výmena produktov pri filtrovaní:** desktop 1440 a mobil 390 px. Po výmene a trojitej lifecycle udalosti stále iba 1 ovládač/input; funkčné plus/mínus a priame zadanie. SKU 237597 rešpektovalo existujúce balenie po 100 kusoch a pridalo presne **200 kusov**, jedným requestom.
- Hlavný detail: Jota 494606 a dlhý K-BLUM 499061 pri 1440/768/390/320 px, **8 porovnaní**. Galéria, názov, metadata, varianty, cenová logika/jednotka/DPH, dostupnosť/doručenie, nákupný panel, CTA a geometria množstva bez zmeny. Zámerná úprava farby mínus/plus na detaile je mimo geometrie.
- Konzola homepage pri všetkých 8 funkčných behoch bez nových JS chýb. Nemenil sa žiadny JS zdroj ani výsledný JS bundle.
- `npm run lint`, `npm run build`, `git diff --check`: PASS.

Pri prvom pomocnom teste hlavného košíka sa súčet čítal ešte pred dokončením natívnej asynchrónnej aktualizácie. Finálny test čaká na skutočný posledný peňažný údaj riadka (na mobile oddelený od jednotkovej ceny) a následne prechádza. Nešlo o zmenu funkcionality košíka; zdrojová oprava kvôli tomuto čítaniu nebola potrebná.

## Screenshoty

| Sekcia | Desktop pred | Desktop po | Mobil pred | Mobil po |
| --- | --- | --- | --- | --- |
| TOP Produkty | [1440](home-1-before-1440.png) | [1440](home-1-after-1440.png) | [390](home-1-before-390.png) | [390](home-1-after-390.png) |
| Novinky | [1440](home-2-before-1440.png) | [1440](home-2-after-1440.png) | [390](home-2-before-390.png) | [390](home-2-after-390.png) |
| MERIVOBOX | [1440](home-3-before-1440.png) | [1440](home-3-after-1440.png) | [390](home-3-before-390.png) | [390](home-3-after-390.png) |
| Kategória | [1440](category-before-1440.png) | [1440](category-after-1440.png) | [390](category-before-390.png) | [390](category-after-390.png) |
| Vyhľadávanie | [1440](search-before-1440.png) | [1440](search-after-1440.png) | [390](search-before-390.png) | [390](search-after-390.png) |
| Detail | [1440](detail-before-1440.png) | [1440](detail-after-1440.png) | [390](detail-before-390.png) | [390](detail-after-390.png) |
| Mini košík | [1440](mini-before-1440.png) | [1440](mini-after-1440.png) | [390](mini-before-390.png) | [390](mini-after-390.png) |

[Celá mobilná homepage po úprave](homepage-after-390.png).

## Rozsah a obmedzenia

Testované v Chromium s dotykovou/mobilnou emuláciou, nie na fyzickom iPhone/Safari. Pri hlavnom detaile bol na oboch verziách totožný browser-only fixture variantov, pretože externé `friends.shopcode.cz` je v testovacom prostredí blokované. Tento fixture nie je súčasťou aplikácie. Galéria a variantový modul sa nemenili. Živá externá synchronizácia variantov tým nie je potvrdená.

Existujúce obmedzenie Shoptetu `GetExtendedOrder content:false` z predošlého reportu sa nerieši v tomto CSS zadaní. Nákupné počty sa overovali priamo proti serverovému stavu košíka a jeho skutočnému UI, nezávisle od podmieneného zobrazenia popupu.

CSS gzip **27 211 B / limit 27 392 B (26,75 KiB)**; JS **32 467 B / limit 32 768 B**, JS je nezmenený. Malé rozšírenie iba preview CSS rozpočtu z 26,5 na 26,75 KiB je evidované podľa historického súhlasu klienta 15. 10. v CONTRIBUTING.md. Stabilné verzie/limity, package version a produkčný loader sú nezmenené.

## Zmenené súbory

- `src/styles/tokens.css` — spoločné quantity hodnoty a homepage rozmery.
- `src/modules/qty-picker/qty-picker.css` — použitie spoločných vzhľadových tokenov.
- `src/styles/overrides/homepage-purchase.css` — výhradne homepage geometria a bezpečný container query.
- `src/styles/overrides/product-card.css` — odstránenie samostatnej sivej palety tabuľkového ovládača, bez zmeny layoutu.
- `src/styles/overrides/quantity-control.css` — tokeny rámu/radiusu, lokálna farba plus/mínus na detaile; cart computed styles nezmenené.
- `src/styles/overrides/recommendations.css` — rovnaké tokeny bez zmeny geometrie.
- `src/main.css` — import lokálneho homepage štýlu.
- `scripts/build.mjs`, `CONTRIBUTING.md` — preview CSS rozpočet.
- `dist/timber.min.css`, `dist/timber.min.css.map` — build.
- `docs/previews/homepage-cart-quantity-ui/` — report, merania a screenshoty.
