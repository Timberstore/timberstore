# Final Product Card Polish

Referenčný commit: `8747361cf3edef665dea888597ca47be6685333a`.
Vetva: `preview/product-detail-compact-pro-20261019`.
Iba preview. Bez merge, release, tagu, úpravy produkčného loadera alebo nasadenia.

## Klasické produktové karty

- Názov je vycentrovaný voči karte; zachované pôvodné veľkosti, váhy, feed case,
  zalamovanie po slovách aj existujúci počet zobrazovaných riadkov.
- Cenová skupina je centrovaná. Číslo a € ostávajú **#2454A6**, jednotka neutrálna.
  Natívne sumy, DPH, formátovanie a dátové atribúty sa neprepočítavajú.
- Cena bez DPH má vizuálne zátvorky a odstup **4 px** pod hlavnou cenou.
  Zátvorky sú CSS pseudo-elementy na pôvodnom cenovom elemente. Ak už ich text
  obsahuje, marker sa odstráni; nevznikajú dvojité zátvorky ani kópia ceny.
- Dostupnosť je pod cenami. Pôvodný názov, počet a farby skladu ostali.
  Pružný minimálny priestor skladovej sekcie vyrovnáva karty s dvojriadkovým
  a trojriadkovým skladovým obsahom; pri ďalšom obsahu môže rásť.
- Ceny a nákupné tlačidlá sú v testovaných riadkoch zarovnané aj pri rozdielnych
  dĺžkach názvov a rôznych skladoch. Obrázky a počet kariet sa nemenili.

## Množstvo a natívny nákup

Existujúci `qty-picker` sa používa aj na mobile/tablete a na klasických kartách
homepage. Nevznikol nový paralelný nákupný komponent. Pôvodný skrytý Shoptet
`input[name=amount]` ostáva jediným odosielaným množstvom; editačný input nemá
`name`. Tlačidlo, formulár a natívny submit ostali.

Na mobile/tablete do 991 px je ovládač pružný so základom 88 px, košík vypĺňa
zvyšok riadka a zachováva natívnu bielu ikonu a prístupný názov. Výška oboch
prvkov je **38 px**, medzera **8 px**, bočné odsadenie **8 / 8 px**.
Číselný input má **14 px**; jeho text sa na úzkych kartách nezmenšuje.

Na desktope ostáva text Do košíka, pôvodná výška tlačidla 50 px a bočné odsadenie
14 / 14 px. Pri užšej karte sa zmenší šírka ovládača, aby formulár nevytvoril
ďalší riadok v priestore vyhradenom natívnemu absolútne umiestnenému CTA.

Použité sú výhradne existujúce farebné tokeny: jemný rám a mínusové pozadie
`--ts-color-error-bg` (**#FCEDEF**), mínus
`--ts-color-error` (**#B83B43**), plus `--ts-color-controls-active` (**#C97A2B**),
biely stred. Referenčný detail má v tomto SHA oranžový rám a neutrálne symboly;
požadovaný červený/oranžový akcent sa preto aplikuje iba na klasické karty.
Detail, mini košík a hlavný košík sa vizuálne nemenili.

Krok balenia sa ďalej číta z natívneho amount inputu. Ak obsahuje `min` / `max`,
ovládač rešpektuje aj tieto hranice a celé balenia. Bez poskytnutého maxima
sa nevymýšľa skladový limit; validácia skladových obmedzení ostáva na Shoptete.

## Merania mobilných kariet vedľa seba

`getBoundingClientRect()`, natívna kategória Príslušenstvo LEGRABOX:

| Viewport | Šírka karty | Množstvo | Košík | Medzera | Bočné odsadenie |
| --- | ---: | ---: | ---: | ---: | ---: |
| 430 px, 2 karty | 185 px | 88 × 38 px | 73 × 38 px | 8 px | 8 / 8 px |
| 390 px, 2 karty | 165 px | 88 × 38 px | 53 × 38 px | 8 px | 8 / 8 px |
| 375 px, 2 karty | 157,5 px | 88 × 38 px | 45,5 × 38 px | 8 px | 8 / 8 px |
| 320 px, 1 karta | 280 px | 88 × 38 px | 168 × 38 px | 8 px | 8 / 8 px |

Pri 320 px používa Apollo pôvodný jednostĺpcový výpis. Nebol násilne zmenený
na dva stĺpce. Dvojstĺpcový mobil je otestovaný aj pri doplnkovej šírke 360 px.
Nikde sa nepridávalo globálne `overflow-x:hidden`.

## Výsledky testov

- **48 kombinácií / 672 vykreslených kariet:** 1440, 1280, 1024, 768, 430,
  390, 375, 360 a 320 px; mriežka a desktopová tabuľka, kategória a vyhľadávanie.
  Pokryté kódy **388326, 388324, 388310, 502876, 502862, 494606**.
  Cena až 1 479,36 €, jednotky sada/pár/ks, krátke aj dlhé názvy.
  Hranice cien, skladu, množstva a tlačidiel sú v karte a stránka nepretečie.
- Na PC 1440 a mobile 390 px prešla sekvencia **1 → 2 → 3 → 2**,
  nastavenie 3 a skutočné pridanie **3** do serverového košíka. Rovnaký test
  prešiel po natívnom checkbox filtri aj po natívnej zmene radenia.
  Každé odoslanie vytvorilo presne **jednu** požiadavku `addCartItem` s amount=3;
  kontroloval sa serverový počet, riadková cena, hlavičková suma a doprava zdarma.
- **6 behov homepage/limitov:** 1440/768/430/390/375/320 px, opakovaná
  inicializácia bez duplicít. Lokálny test min=2/max=4; test balenia 100,
  max=250 a zaokrúhlenia 150 → 200. Tieto dočasné testovacie atribúty sa
  neposielali na server ani nepridali do preview kódu.
- **12 prezentačných prípadov:** jednotky ks/pár/sada/m pri sume 1 479,36 €,
  aktualizácia pôvodného cenového textu a obnova modrého čísla/€,
  natívne zátvorky bez zdvojenia; 1440/390/320 px. Jednotka m je lokálna fixture.
- **Tabuľka pred/po 1440/1280/1024 px:** zhodné rozmery, relatívne pozície,
  typografia a farby sledovaných prvkov vrátane názvu vľavo, cien a ovládača.
  Tabuľkové ceny bez DPH ostávajú bez novo pridaných zátvoriek.
- **Filtre 1440/768/390 px:** otvorenie, opakovaný klik, prechod na iný filter,
  klik vnútri/mimo, Escape, šípka, aplikovaný checkbox aj skutočný cenový slider.
  Hodnoty a označenie aplikovaného filtra ostali. Žiadna zmena zdrojov filtrov.
- **Mini a hlavný košík 1440/390 px:** plus/mínus, minimum, otvorenie/zatvorenie,
  opakované init a AJAX obnovenie, rýchle kliknutia, zmiešané ks/pár/sada,
  ceny a doprava zdarma. Natívne symboly ostali viditeľné a neduplikovali sa
  požiadavky. Backend v tomto teste prijal aj 1000 ks Jota; nejde o overenie
  skutočného horného skladového limitu.
- **8 porovnaní detailu pred/po:** 494606 a 499061 pri 1440/768/390/320 px.
  Názov, metadata, obrázky, varianty, ceny, dostupnosť, doprava, množstvo a CTA
  zachované. Žiadny zásah do modulu product-compact alebo warehouse-stock.
- `npm run lint`, `npm run build`, `git diff --check`: úspešné.

Počas práce sa zachytil a opravil presah centrovania ceny bez DPH do tabuľky
aj prekrytie skladu dvojriadkovým nákupným formulárom pri 1280 px. Finálne
merania kontrolujú aj skutočnú medzeru sklad → ovládače a zarovnanie cien/CTA
medzi susednými kartami. Nezostala zistená regresia v uvedených kontrolách.

Podrobnosti a namerané hodnoty: [verification.json](verification.json).

## Obmedzenia a build

Testované v Chromium s desktopovou a mobilnou/touch emuláciou, nie na fyzickom
iPhone alebo v Safari. Živé ceny, filtrovanie, radenie a košík používajú Shoptet.
Pri detailových porovnaniach je blokované `friends.shopcode.cz` nahradené rovnakou
browser-only fixture na oboch stranách; živé členstvo variantov tým nebolo overené.
Žiadne variantové fixture sa nenačítavajú v preview.

Budget sa pre túto istú preview verziu rozšíril iba na JS **31,25 KiB** a CSS
**25,5 KiB**, podľa súhlasu z 15. 10. zaznamenaného v CONTRIBUTING.md §3.4.
Pôvodný referenčný build mal rezervu iba 3 B JS a 7 B CSS. Nové pravidlá ostali
lokálne; neprepisovali sa fungujúce filtre/košík kvôli kompresii. Stabilné
verzie, ich limity a verzia balíka sa nemenili. Presný gzip je vo verification.json.

## Screenshoty

| Zobrazenie | Pred | Po |
| --- | --- | --- |
| Desktop 1440 px | [Pred](cards-before-1440.png) | [Po](cards-after-1440.png) |
| Užší desktop 1280 px | [Pred](cards-before-1280.png) | [Po](cards-after-1280.png) |
| Mobil 390 px, dve karty | [Pred](cards-before-390.png) | [Po](cards-after-390.png) |
| Mobil 375 px, dve karty | [Pred](cards-before-375.png) | [Po](cards-after-375.png) |
| Mobil 320 px | [Pred](cards-before-320.png) | [Po](cards-after-320.png) |

## Upravené súbory

- `src/core/selectors.js` – centrálne selektory klasických kariet a ceny bez DPH.
- `src/modules/product-text-cleanup/index.js` – idempotentný marker kariet/zátvoriek.
- `src/modules/qty-picker/index.js` – existujúci natívny amount, balenia a hranice;
  aktivácia aj na homepage.
- `src/modules/qty-picker/qty-picker.css` – vlastné segmenty a pružný mobilný základ.
- `src/styles/overrides/product-card.css` – centrovanie, poradie, spacing,
  natívne formulárové prepisy a výnimky pre nezmenenú tabuľku.
- `scripts/build.mjs`, `CONTRIBUTING.md` – evidovaný limit iba tejto preview.
- `dist/timber.min.js`, `dist/timber.min.css` a obe source mapy.
- Tento report, `verification.json` a desať screenshotov.

Finálny immutable odkaz používa SHA tohto commitu v `ts_preview`; priamy odkaz
na kategóriu je vo finálnej odpovedi.
