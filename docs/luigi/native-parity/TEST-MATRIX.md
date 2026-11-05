# LB1 · PASS / FAIL / BLOCKED — funkčná parita

**Výsledok celej integrácie: FAIL, oprava nákupného UI BLOCKED dátovým/integračným
kontraktom.** Rc.8 ostáva neakceptované. Tabuľka odlišuje pozorovanú chybu od
prekážky jej podporovanej opravy. Žiadny nový renderer sa v tomto kole neaktivoval.

Čerstvé merania3.11.2026: rovnaké vyhľadávanie BLUM450 a553488,1440×1000 a375×812;
`native-versus-luigi*.json`, PNG a `index.html`. Natívna referencia používa skutočné
Shoptet serverové karty a natívne handlery, len s browserovým blokovaním externého
Luigi bootstrapu v oddelenom diagnostickom kontexte. Luigi kontext má reálny CDN
build1975505/rc.8. Nie je to maketa ani nový verejný preview.

## Dvanásť povinných funkcií

| # | Funkcia | Výsledok súčasného UI | Dôkaz a podmienka opravy |
|---|---|---|---|
| 1 | Gross a pod ním netto | **FAIL** | Čerstvé553488: native225,83€/183,60€, Luigi iba225,83€. Netto je chýbajúca autoritatívna položka, nie úloha na univerzálny výpočetDPH. |
| 2 | Jednotka | **FAIL ako celok**, Search vzorky PASS | Search553488 správne sada; historické jednotky ks/balenie/m sú v purchases.json rc.4. AC/Top jednotku neposkytujú všade. Dodať rovnaký unit slot pre každú šablónu. |
| 3 | Počet a rozlíšenie skladov | **FAIL** | Native553488:80sada; Luigi ibaCentrálny sklad. Verejné príznaky skladov0/1 nie sú potvrdené počty. `DATA-CONTRACT.md`, `api-preflight.json`. |
| 4 | Skladom Emerald | **PASS v overených stavoch** | Existujúce rc.8 `controls-and-rollback.json` na1440/375:491405, rgb(0,200,83), klientom schválený token. Žiadna nová farebná oprava v tomto kole. |
| 5 | Centrálny sklad oranžový | **PASS v overených stavoch** | Rc.8 kontrola237597 a čerstvé553488 screenshoty. Farba sama neznamená splnený skladový počet. |
| 6 | Mínus / množstvo / plus | **FAIL** | Čerstvé553488: native má skutočný amount formulár a qty ovládanie, Luigi nemá native form/qty (`form`, `qty`, `amounts` v JSON). |
| 7 | Min/krok/násobiteľ/balenie | **BLOCKED pre úplnú paritu** | ZnámuSKU237597 native validuje po100; defaultLuigi pridáva100. Nezávislý krok/pack/max/variant kontrakt chýba. `Balenie32` pri344255 nie je potvrdený násobiteľ. Nezávislé min≠pack fixture chýba; nenahrádzame ho min=step100. |
| 8 | Pridať požadované množstvo | **FAIL**, predvolené množstvo PASS | DefaultAC nákupy rc.8:237597→100ks/9€;255401→1sada/118,08€, desktop/mobil a jedna cart operácia. Nemožno zadať požadované200ks vLuigi ovládaní; default úspech nie je PASS tejto požiadavky. |
| 9 | Natívny KOMPLET | **FAIL** | Čerstvé553488 má nativeoranžovú `.flag-komplet`, vendor genericflag hnedú. Dáta code=komplet existujú; chýba podporovaná sémantická template. |
| 10 | Technické názvy/kódy/ceny | **FAIL ako celok**, Search553488 názov/kód/gross PASS | Zachovaný celý technický názov a kód naSearch; AC nemá všetky kódové/menové sloty a úplné cenové údaje z bodu1. Nezamieňať zachovaný názov s úplnou paritou. |
| 11 | Variant a neobjednateľnosť | **BLOCKED** | Kandidát494606 a existujúci test s blokovanýmfriends.shopcode.cz. Priamy API má nested objekty, aktuálny bootstrap ich odstraňuje. Pre explicitne neobjednateľnéSKU nemáme kvalifikovaný fixture; queryavailability:0 vrátil0 kandidátov, nie úspešný test zákazu objednania. |
| 12 | Bez duplicitných udalostí | **PASS pre doložené default scenáre**, úplná analytika BLOCKED | Rc.8 štyriUI nákupy:1POST a1ShoptetCartUpdated, resourceURL správne. Staršie Search/recommender testy majú konkrétne chýbajúce attribution/resource. Nový renderer ani variantový eventflow zatiaľ nie sú overené. |

## Filtre, stav, prepínač a rozloženie

| Kontrola | Stav | Dôkaz |
|---|---|---|
| Natívna referencia pri rovnakom vyhľadávaní | **PASS — zistený skutočný stav** | NativeSearch BLUM450 nemá filter ani radenie, má grid/table switch. `native-versus-luigi.json`. Natívny kategóriový filter je samostatná doložená referencia, nie vydávaný za rovnaké vyhľadávanie. |
| Všetky vhodné parametre | **FAIL / oprava BLOCKED** | Natívna kategória má napr.Dĺžka mm, Druh vedenia, Nosnosť kg, Pohyb, Priložené čelné kovanie, Svetlosť, Výška bočnice. BLUM450 Luigi má cenu/štítky/kategórie/výrobcu/farby. Nie sú doložené ich úplné mapy/indexovaný význam a kontext pre Search. `native-category-filters.json`, APIattributeNames; požiadavka na úplný slovník. |
| Celý label / checkbox / vzorka | **PASS v existujúcich skúškach** | Rc.4 `filters.json`: klik na celý popisSkladom, Biela, BLUM na1440/375. Vzhľad polí nie je náhradou za tento funkčný dôkaz. |
| Rozbaliť/zabaliť skupinu | **PASS** | Čerstvé `filter-state.json`: groupbrand list143→0→143desktop,135→0→135mobile, displayblock→none→block. |
| Kombinácie a reset | **PASS v existujúcich skúškach** | Rc.4:24na stránke→14Skladom→3Biela→3BLUM→reset24. Čerstvé podporované API:14→3, `api-preflight.json`. Nie nový frontend fix. |
| Produktový počet / zmiešaná hlavička | **FAIL v existujúcom UI dôkaze**, APIhranica PASS | Rc.4 dokumentuje21=14produktov+6kategórií+1značka. Nový klient explicitnetype:product a total_hits:14/3; nie je nasadený do UI. |
| Radenie zachová filter | **PASS** | Čerstvé1440/375 Skladom14, sortprice_eur_amount:asc, checkedstav zostal. |
| Reload + návrat v histórii | **PASS pre testované návraty** | Čerstvé `filter-state.json`, rovnaké vybranéSkladom a sort po reload/back. Nie dôkaz všetkých forward/variant/scroll situácií. |
| Mobilné otvorenie/zatvorenie filtra | **PASS v testovanom flow** |375px filteropen, klikSkladom, vendorclose a radenie bez straty filtra; čerstvý skript a staršie reset/combo testy. Presná natívna mobilná parita BLOCKED novou šablónou. |
| Vylúčiť creation_time | **PASS v pripravenej APIhranici**, produkčný garantiovaný whitelist **BLOCKED** | Explicitné facets+dynamic_facets_size0, internýfacet odmietnutý; odpoveď14/3 bezcreation_time. PriBLUM450 v skúšanom UI creation_time práve viditeľné nie je; bez kompletného vendor exportu netvrdíme vylúčenie všade. |
| Mriežka/tabuľka | **FAIL** | Na desktope natívny prepínač existuje, Luigi ho nemá; native table je doložená aj v rc.4 porovnaní. Natívna tabuľka platí od992px, na mobile je referenciou jeden stĺpec. Samotná prítomnosť prepínača v mobileDOM nie je mobilná tabuľková funkcia. |
| Počet kariet a kontajner | **FAIL** | Native1440:3×~459px; Luigi3×~299px. Pri1920Luigi4, native3. `grid-breakpoints.json` + externý bootstrap4od1690px. Merané body iných šírok nie sú automaticky novou breakpoint špecifikáciou. |
| Našepkávač rozloženie | **PASS pre predchádzajúci technický layout test, majiteľ NEAKCEPTOVAL preview** | Rc.8 má bounded535pxdesktop, internýscroll/X a svetlé frázy s dôkazmi. Toto kolo nemení tento komponent a nevyhlasuje nákupnú paritu. |
| Chybový populárny článok | **FAIL / odstránenie BLOCKED externým zásahom** | SearchAPIarticle`/stranka-nenajdena/`; zdrojHTTP200 +index,follow +H1chybovástránka. `error-page.json` + `error-article-index.json`. Pôvod importu ešte BLOCKED exportom; žiadne pripísanie Mergadu. |

## Produktové scenáre — prevzaté dôkazy, nie nové tvrdenie o novom UI

| Scenár | Referenčný výsledok | Stav |
|---|---|---|
| Kus306317 |1ks×4,11€, net3,34€; native/Search/AC rc.4serverové košíky | **PASS default**, požadované množstvo vLuigi **FAIL** |
| Sada553488 |1sada×225,83€, net183,60€, native80sada; nový porovnávací screenshot | **FAIL parita karty**, údaje neodhadované |
| Balenie344255 |1balenie×186,49€; názov8650ks; native/Search/AC nákup rc.4 | **PASS default**, nezávislé step/pack **BLOCKED** |
| Metráž491405 |1m×6,03€; native/Search/AC rc.4 | **PASS default**, desatinné/odlišné kroky pre novéUI **BLOCKED** |
| Minimum/násobky237597 | Native100→200 a cart200ks×0,09€=18€ už doložené; rc.8default100na oboch šírkach | **FAIL ovládanieLuigi**, kvalifikovaný min≠pack **BLOCKED** |
| Skladom / Centrálny sklad |491405 /237597 existujúce farebné/default nákupné kontroly | **PASS tieto stavy**, počty/jednotky skladov **FAIL** |
| Variant494606 | IndividuálnaSKU nestačí na overenie variantovej voľby; nested existuje | **BLOCKED** |
| Skutočne neobjednateľný | Žiadna kvalifikovanáSKU ani explicitný orderable kontrakt | **BLOCKED** |

Prevzaté nákupné dôkazy:
[rc.4 purchases](../../previews/luigi-0.7.8-rc.4/purchases.json),
[rc.4 pack/minimum rozšírenie](../../previews/luigi-0.7.8-rc.4/REPORT.md),
[rc.8 funkčné skúšky](../../previews/luigi-0.7.8-rc.8/functional.json),
[odporúčania detail/košík/popup](../../previews/luigi-0.7.8-rc.4/recommendation-purchases.json).
Dátumy a buildy starších dôkazov zostávajú zachované. V tomto kole sa nepridával
nový nákupný handler ani nový nákupný UI; neopakujeme už splnenú inventarizáciu.

## Prípravný kód a prevádzkové podmienky

- **PASS:** `node --test tests/luigi-search.test.mjs`; stav URL, filter/sort,
  odmietnutie interných facetov/mixedtype/HTTPchyby a neúplného nákupného kontraktu.
  Syntetické unit fixtures nie sú živé akceptačnéSKU.
- **PASS:** read-only `scripts/luigi-parity-preflight.mjs`; oficiálny Search API,
  explicitný produktový filter/whitelist a výstupy uložené. Žiadne analytics emit.
- **PASS:** lint/build; nové súbory nie sú importované do frontend buildu;
  `dist/`, loader aj packageverzia ostali nezmenené. Nie je to akceptácia UI.
- **BLOCKED:** licencia/entitlements pre konkrétnu integráciu, podporovaný renderer,
  úplné mapovanie/fixtures, SLA synchronizácie a vendor reporting.
- **BLOCKED (nedostupné na overenie):** Safari/fyzické telefóny, produkčný benchmark
  novej architektúry. Žiadny nový renderer preto nemá vizuálne ani výkonové PASS.
- Bez objednávky, správy podpore, indexDELETE, admin publikácie, merge či produkcie.
