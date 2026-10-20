# Kritické opravy mini košíka, filtrov a výpisov

Referenčný stav: `3e0ec7737a62682b5c68612810c150d7151764e6`.
Vetva: `preview/product-detail-compact-pro-20261019`. Iba preview; bez merge,
release, tagu, zmeny produkčného loadera alebo produkčného nasadenia.

## 1. Mini košík a hlavný košík

**Presná príčina:** Apollo má `.quantity .increase span, .quantity .decrease span
{ display: none; }` so špecificitou `(0,2,1)`. Lokálne pravidlo
`.ts-cart-quantity :is(.increase__sign,.decrease__sign)` malo iba `(0,2,0)`.
Apollo preto skrylo skutočné textové symboly. Lokálny štýl zároveň zámerne
vypínal pôvodné ikonové `::before`; výsledkom boli dva prázdne segmenty.

V repozitári sa oslabenie pôvodného selektora s `#cart-widget` objavilo pri
zjednotení v commite `977f7e5adecacda2b4bc7d2e7acaab8c4afaf689`.
`cf3076e` následne preniesol toto pravidlo do `quantity-control.css`.
Problém je reprodukovateľný s aktuálnym Apollo CSS `main.css?v=1865`.
Pred opravou mali oba symboly `display:none` a šírku 0; po oprave `display:block`,
výšku 18 px a šírky približne 9,83 / 10,02 px.

Oprava upravuje pôvodný selektor: obnovuje jednoznačný rozsah hlavného/mini košíka
s ID. Nepridáva tlačidlá, symboly ani JS handlery. Ostáva oranžový 1 px rámik,
36 px vysoký ovládač, pôvodné segmenty a vycentrovaný natívny input. Rovnaká
regresia bola potvrdená aj v hlavnom košíku a tento selektor opravuje oba.
Natívne klikateľné plochy reagovali aj v baseline; skrytý bol ich obsah.

Živé testy na PC 1440 px a mobile 390 px:

- Pridanie 1 ks, plus 1 → 2 a mínus 2 → 1; na každé jednotlivé kliknutie jedna
  požiadavka `setCartItemAmount`.
- Minimum 1, zatvorenie a opätovné otvorenie, opakovaná inicializácia cez tri
  `ShoptetDOMPageContentLoaded`, obnovenie HTML mini košíka cez natívny AJAX.
- Opakované pridanie rovnakého produktu a zmiešaný košík: Jota 494606 (`ks`),
  StrongMax 502862 (`pár`), K-BLUM 499061 (`sada`). Pridanie z mriežky a desktopovej
  tabuľky ostáva natívne.
- Štyri rýchle kliknutia, serverom potvrdené množstvo 3 → 7, bez duplicitného
  odoslania na jeden klik. Nasledovali živé množstvá 100 a 1000 a návrat na 1.
- Kontrola inputu, dát Shoptetu, riadkovej ceny, hlavičkovej sumy, počtu kusov
  a zostávajúcej sumy do dopravy zadarmo. Test čaká aj na obnovený riadok z
  `GetCartContent`, nie iba na prvú zmenu množstva v dátach.
- Hlavný košík: natívne plus/mínus vrátane riadkových súčtov 4,52 € → 2,26 €.
  Baseline hlavného košíka mal rovnaké neviditeľné symboly.

Príklad Jota: 1 ks = **2,26 €**, zostáva **197,74 €** do dopravy zdarma;
2 ks = **4,52 €**, zostáva **195,48 €**. Zmiešaný košík s jedným kusom každej
z troch položiek má **104,37 €**, zostáva **95,63 €**. Nad prahom 200 € sa zobrazuje
natívny stav dopravy zdarma. Počet nad 99 sa podľa existujúceho Shoptetu zobrazuje
ako **99+**.

**Hranice a zamietnutie – rozsah overenia:** natívne atribúty sú min=1,
max=9999, step=1. Horné ohraničenie sa overilo s dočasným testovacím max=1
v prehliadači; plus ostalo na 1 bez odoslania požiadavky. Aktuálny živý backend
prijal 1000 ks Jota. Živá hranica 9999 ks nebola skúšaná. Zamietnutie sa overilo
samostatne prehratím zaznamenanej pôvodnej natívnej odpovede HTTP 200 / code 500
zo staršej diagnostiky. Tento jediný testovací request sa neodoslal na server.
Input, cena a suma sa vrátili k skutočnému stavu 1 ks; ďalšie živé plus/mínus
opäť fungovalo. Historická správa o 178 kusoch je iba testovací záznam,
nie údaj o dnešnej zásobe Jota. Žiadna testovacia odpoveď sa nenačítava v preview.

## 2. Dostupnosť a bezpečné stĺpce

**Presná príčina prekrytia:** posledné jednoradové pravidlo z `3e0ec77`
aplikovalo `white-space:nowrap` aj v pevnom tabuľkovom stĺpci. Text široký
130,48 px sa nezmestil do 104 px. Samostatne bola cenová bunka 124 px užšia
než vykreslená suma s jednotkou (132,05 px).

Sklad ostáva pôvodným Shoptet elementom. CSS zalamuje názov na hraniciach slov:

```text
CENTRÁLNY
SKLAD
(3 SADA)
```

SKLADOM ostáva nad množstvom. Každý riadok je centrovaný; farba skladu a skutočné
množstvo sa nemenia. Nové obaly ani textové duplicity nevznikajú. Grid má bezpečné
šírky a cenový stĺpec 150 px, zhodný v hlavičke aj riadkoch. Výška riadku sa
prispôsobuje obsahu. Bez záporných marginov alebo posunov skladového textu.

Merania pre 388326 pri 1440 px, `getBoundingClientRect()` a textové rozsahy:

| Veličina | Pred | Po |
| --- | ---: | ---: |
| Skladový stĺpec | 104 px | 104 px |
| Šírka textu názvu skladu | 130,48 px / 1 riadok | 81,83 px / 2 riadky |
| Presah názvu skladu do ceny | **10,48 px** | **0 px** |
| Od konca skladového textu po začiatok ceny | −10,48 px | 27,09 px |
| Cenový stĺpec | 124 px | 150 px |
| Cena vrátane `/ sada` | 132,05 px | 132,05 px |
| Presah ceny z vlastného stĺpca | 8,05 px | 0 px |
| Stredy CENTRÁLNY / SKLAD / množstvo | nezhodné | 988,49 / 988,48 / 988,50 px |

## 3. Filtre

**Príčina zatvárania:** existujúci poslucháč mimo panelu obsluhoval iba mobilný
`state`. Na desktope je `state=null`, takže sa otvorený filter nezatváral.
Pomocná funkcia navyše odstraňovala `is-active`, hoci natívny riadkový dropdown
používa `open`. Pevná lokálna šípka nemala otvorený stav; tabletové štýly miešali
fokus, otvorenie a aplikovanú hodnotu.

- Existujúci, iba raz registrovaný click/Escape handler teraz spolupracuje
  s natívnymi stavmi Apollo. Riadkový režim zatvára `open`; akordeón aj `is-active`.
  Režim sa zisťuje podľa Apollo, nie iba podľa šírky alebo typu zariadenia.
- Opakovaný klik, klik mimo, prechod na iný filter a Escape zatvárajú správny
  panel. Vnútorné kliknutie, checkbox a slider zachovávajú natívne správanie.
- Zatvorenie nemení vstupy, vybrané hodnoty ani aplikovaný filter.
- Rovnaký pôvodný znak Apollo sa otáča cez CSS za 160 ms. Otvorený stav má
  svetlooranžový podklad, oranžový text a jemné spodné zvýraznenie.
- Aplikovaná hodnota ostáva podčiarknutá aj po zatvorení. Pri mobilnej cene sa
  rozpoznáva natívny inicializovaný rozsah slidera; hodnoty filtra sa neprepočítavajú.
- Pôvodné z-indexy a umiestnenie dropdownov ostali. Natívne položky sú klikateľné;
  24 ďalších otvorení filtrov na stránke Knopky pri 1440/1280/1024 px malo panely
  v hraniciach viewportu.
- V tej istej stránke prešiel prechod 1440 → 390 → 768 → 1280 → 320 → 1440 px.
  Natívne inputy zostali pripojené, mobilný obal bol vždy iba jeden.

Cenový slider aj checkbox Centrálny sklad boli aplikované cez skutočné Shoptet
požiadavky pri všetkých ôsmich šírkach. Overilo sa aj zachovanie režimu výpisu
po natívnom AJAX filtrovaní a obnovení stránky, bez duplikácie prepínača,
hlavičky tabuľky alebo množstevných polí.

## 4. Prepínač, nákupné odsadenie a modrá cena

Aktívne tlačidlo existujúceho prepínača je biele, neaktívne neutrálne sivé.
Obe majú zhodné rozmery 36 × 35 px a jemný border; aktívna ikona používa oranžovú.
Logika prepínania a uložená voľba sa nemenia.

V širokej karte majú množstvo a CTA bočné odsadenie **14 / 14 px** a medzi sebou
**8 px**. Pôvodné výšky ovládačov ostali. Pri karte širokej 249,33 px sa ovládače
bezpečne presunú na dva riadky; tlačidlo má šírku 221,33 px, teda opäť 14 px od
oboch okrajov. Písmo sa nezmenšuje. V tabuľke zostávajú vo vlastných stĺpcoch.

Číslo aj **€** ostávajú #2454A6; jednotka a cena bez DPH ostávajú neutrálne.
Kontrola pokryla mriežku, tabuľku aj detail. Cenové výpočty a formátovacie dáta
sa nemenili.

## 5. Regresné výsledky a obmedzenia

- **80 kombinácií výpisu, 1280 vykreslených položiek:** 1440, 1280, 1024, 768,
  430, 390, 375 a 320 px; dve uložené preferencie zobrazenia, päť natívnych výpisov.
  Zahŕňajú všetky požadované kódy 388326, 388324, 388310, 502876, 502862 a 494606.
  Kontrola hraníc skladu/ceny/množstva/CTA, centier textu, farieb a overflow.
- **8 kompletných funkčných behov filtrov**, 24 ďalších dropdownov a 5 prechodov
  rozlíšenia. Kliknutie, opakovaný klik, vnútorný klik, prepnutie, mimo, Escape,
  farby, šípky, živý checkbox a živý slider vrátane označenia po zatvorení.
- **64 cenových prípadov** s jednotkami ks/pár/sada/m na pôvodnom elemente ceny
  1 479,36 €. Zmena jednotky na `m` bola lokálna prezentačná testovacia hodnota.
- **8 porovnaní detailu** Jota 494606 a K-BLUM 499061 pri 1440/768/390/320 px:
  názov, metadata, galéria, variantové obrázky, aktívne označenie, cena, jednotka,
  bez DPH, dostupnosť, doručenie, množstvo a CTA zachované.
- Živé PC/mobilné testy košíka a samostatné testy odmietnutia/hornej hranice
  v uvedenom rozsahu. Bez chýb JavaScriptu v zaznamenaných behoch.
- `npm run lint`, `npm run build`, `git diff --check`: úspešné.
  Gzip **JS 31 741 / 31 744 B**, **CSS 25 593 / 25 600 B**.
  Verzia ani build limity sa nemenili.

Pod 992 px ostáva existujúci kartičkový fallback aj pri uloženej tabuľkovej
preferencii; prepínač je dostupný od 992 px. Testy používajú Chromium desktop
alebo mobilnú/touch emuláciu; nejde o meranie fyzického iPhonu či Safari.
Dostupnosť a ceny výpisov, košík a filtrovanie sú živé. Pri porovnaniach detailu
je blokované API `friends.shopcode.cz` nahradené rovnakou browser-only variantovou
fixture na oboch stranách. Členstvo variantov zo živého dodávateľského API tým
nie je overené. Video `13.mp4` v tejto správe nebolo priložené; chyby sa
reprodukovali priamo na natívnom frontende.

**Regresie zachytené počas práce a odstránené:** skoré zatvorenie na pointerdown
posúvalo ďalší mobilný nadpis pred dokončením kliknutia (finálne sa zatvára po
click); zdedené Apollo `justify-content:flex-end` posúvalo skladový grid
(finálne centrovaný obsah aj jednotlivé položky); úzky nákupný riadok nerešpektoval
bočný odstup (finálne flexibilný CTA základ a zalomenie). V konečných uvedených
kontrolách nezostala zistená regresia.

Pôvodný header, menu, produktové dáta, natívne košíkové JS handlery, checkout,
galéria, detailový nákupný panel, výpočty a warehouse-stock projekt sa nemenia.
Kompaktné detailové CSS iba používa priamo rovnaký modrý token namiesto identického
aliasu; zhodné computed styles sú overené. Statické tabuľkové deklarácie sa
zjednodušili a odstránili sa prepisované/duplicitné pravidlá pre zachovanie budgetu.

Podrobné merania: [verification.json](verification.json).

## Screenshoty

| Oblasť | Pred | Po |
| --- | --- | --- |
| Tabuľka 1440 px, vysoké ceny | [Pred](list-before-1440.png) | [Po](list-after-1440.png) |
| Karty 1440 px | [Pred](grid-before-1440.png) | [Po](grid-after-1440.png) |
| Karty 390 px | [Pred](grid-before-390.png) | [Po](grid-after-390.png) |
| Mini košík PC | [Pred](mini-before-1440.png) | [Po](mini-after-1440.png) |
| Mini košík mobil | [Pred](mini-before-390.png) | [Po](mini-after-390.png) |
| Filter PC | [Zatvorený](filter-closed-1440.png) | [Otvorený](filter-open-1440.png) |
| Filter mobil | [Zatvorený](filter-closed-390.png) | [Otvorený](filter-open-390.png) |

## Zmenené súbory

- `src/core/selectors.js`
- `src/legacy/timber-custom-v175.css`
- `src/modules/category-filter-compact/index.js`
- `src/modules/list-view/list-view.css`
- `src/modules/mobile-category-controls/index.js`
- `src/modules/mobile-category-controls/mobile-category-controls.css`
- `src/modules/qty-picker/qty-picker.css`
- `src/styles/overrides/filters.css`
- `src/styles/overrides/mobile-category-controls.css`
- `src/styles/overrides/product-card.css`
- `src/styles/overrides/product-compact.css` (identický modrý token)
- `src/styles/overrides/quantity-control.css`
- `src/styles/tokens.css` (odstránený identický alias)
- `dist/timber.min.css`, `dist/timber.min.js` a ich source mapy.
- Tento report, merania a 14 screenshotov.

Presný immutable preview odkaz používa SHA tohto commitu v `ts_preview`;
finálna odpoveď obsahuje priamy odkaz na kategóriu Príslušenstvo LEGRABOX.
