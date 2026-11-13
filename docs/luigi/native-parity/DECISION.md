# LB1 · Funkčná parita s natívnym TIMBER STORE — rozhodnutie

**Aktuálna Shoptet integrácia Luigi požadovanú funkčnú paritu nespĺňa. Rc.8 zostáva
odmietnuté; nevydávame ďalší kozmetický preview.** Funkčnú paritu teraz nemožno
bezpečne dokončiť iba úpravou CSS/JS v tomto repozitári. Platforma Luigi však
vlastné vykresľovanie podporuje. Chýba podporované napojenie konkrétneho doplnku,
úplný nákupný kontrakt a podľa zvolenej cesty natívny renderer.

Tento balík spracúva existujúce dôkazy rc.4/rc.8 a dopĺňa iba chýbajúce technické
rozhodnutia, rovnaké vyhľadávanie, hranice rozloženia, históriu filtrov a pôvod
chybového článku. [Výsledky každej funkcie](TEST-MATRIX.md),
[dátový kontrakt](DATA-CONTRACT.md), [finálna požiadavka podpore](SUPPORT-FINAL.md).

## Podporované možnosti a rozhodnutie

| Možnosť | Technická možnosť | Stav pre tento obchod / rozhodnutie |
|---|---|---|
| Search.js + vlastné šablóny | Oficiálne podporované šablóny vrátane produktových výsledkov | **Preferovaná prvá implementačná cesta**, ak dodávateľ dodá úplné dáta a presný natívny HTML/cart kontrakt. Nepreberá sa predvolená Luigi karta; šablóna používa natívnu štruktúru, komponenty/štýly a nákupný binding. |
| Search.js + ResultsRenderer | Dokumentovaná funkcia `(results, element, append) → Promise`, prípadne HTML endpoint | Najpresnejšie opätovné použitie serverových kariet: vyžaduje schválený dávkový renderer na strane Shoptetu/dodávateľa. Ten v repozitári ani overenom integračnom rozhraní nemáme. URL režim navyše vyžaduje `item_id`, ktoré v skúšaných hitoch chýba. Funkčný režim môže používať identity hitov, ale nenahradí chýbajúci renderer. |
| Priamy Search API + naše rozhranie | Oficiálna cesta pre vlastný frontend | Záložná cesta, ak doplnok nepovolí šablóny/ResultsRenderer. Zachová index/relevanciu/synonymá; filtre/radenie poskytne API. Vyžaduje rovnaké nákupné údaje/renderer, vlastné stavové a analytické napojenie. API samotné nevyrieši chýbajúce ceny ani množstvá. |
| Ďalšie DOM/CSS opravy predvolenej karty | Nedoručia nákupný kontrakt | Zamietnuté. Nepridávať nefunkčné +/−, nedosadzovať netto, neodvodzovať násobiteľ ani dostupnosť. |

Overené primárne zdroje (3. 11. 2026):
[Search.js a ResultsRenderer](https://docs.luigisbox.com/search/search-js/#frontend-results-rendering),
[vlastné šablóny](https://docs.luigisbox.com/quickstart/search/customizing-searchjs/),
[Search API](https://docs.luigisbox.com/search/api/v1/search/),
[vlastné rozhranie a analytika](https://docs.luigisbox.com/quickstart/search/building-custom-ui/),
[rozhranie košíka pre vendor integráciu](https://docs.luigisbox.com/lbx-integration/requirements/add-to-cart/).
Dokumentácia platformy nie je potvrdením podpory funkcie v našej zmluve/doplnku.
ResultsRenderer je tu overené rozhranie pre **Search**; nepovažujeme ho automaticky
za hook pre AC/Top alebo odporúčania. Pre ne musí dodávateľ dodať samostatný
podporovaný template/render/buy lifecycle a rovnaký dátový kontrakt.

## Prečo sa natívna karta nedá jednoducho importovať

Repozitár nevlastní serverovú šablónu Shoptetu ani exportovaný JS `ProductCard`.
Natívna karta je skutočné serverové HTML `#products > .product`, ktoré následne
obsluhujú Apollo, Shoptet a moduly `qty-picker`, `list-view`, `cart-count` a
`product-text-cleanup`. `qty-picker` zapisuje do existujúceho amount poľa formulára;
neimplementuje druhý cart submit. Detail má vlastné natívne množstevné pravidlá.

Príklad237597: verejný serverový formulár má productId353027, priceId353411,
SKU237597 a amount100. SKU nie je productId ani priceId. Po ustálení doplnku
má natívna nákupná logika krok100; samotné HTML pred inicializáciou obsahuje step1.
Preto nestačí prečítať neustálené HTML alebo `minimum_amount` a vyhlásiť nový krok.

Aktuálny externý bootstrap `LBX-1266949.js` je nezmenený voči existujúcemu dôkazu:
SHA256 `3b99802aa84ed0a7b7adf0d895b9ad65ff44ca83b13bd6502f7a928fe901c221`.
Vkladá vlastné templates a inicializuje Search; `ResultsRenderer` v ňom nie je
nastavený. Predpísané poradie vlastných šablón pred inicializáciou a jedného
inicializačného cyklu nemožno nahradiť súťažou async skriptov nášho loadera s týmto
bootstrapom. Potrebujeme podporovaný vendor preview/export konfigurácie.

Existujúce vylúčenie `.lb-product` z natívnych enhancerov sa neruší: chráni pred
aplikovaním nesprávnych fallback pravidiel. Skutočný natívny renderer bude mať
jednoznačnú vlastnú štruktúru a jedného vlastníka inicializácie, až po overení
formulárov, ceny, variantu, množstva a analytiky.

## Rozloženie a filtre — konkrétne zistenia

- Natívny Search pri rovnakom `BLUM 450` má na1440px **tri karty približne459px**,
  na375px jednu. Luigi má na1440px tri približne299px; od1690px má štyri, zatiaľ čo
  natívny Search aj pri1920px zostáva na troch. Hlásenie štyroch úzkych kariet je
  doložené aj konkrétnym pravidlom externého bootstrapu od1690px, nie predpoklad.
- `grid-breakpoints.json` obsahuje merania ďalších šírok. Sú to merania konkrétneho
  Search kontextu, nie nové univerzálne breakpointy pre celý obchod. Budúci renderer
  preberie natívny kontajner/body kontext a existujúce pravidlá, nie novú odvodenú mriežku.
- Natívny Search bez Luigi **nemá filter ani radenie**; má desktopový prepínač mriežka/tabuľka (tabuľka od992px).
  Pre túto referenciu bol v izolovanom testovacom prehliadači zablokovaný výhradne
  externý Luigi bootstrap. HTML kariet aj ostatné natívne handlery ostali skutočné.
  Žiadna produkčná konfigurácia sa nemenila. Toto nie je verejný „native preview“.
- Natívny filter je doložený osobitne na `/zasuvkove-vysuvy/`: dostupnosť, značky,
  Dĺžka mm, Druh vedenia výsuvu, Farba, Nosnosť kg, Pohyb výsuvu, Priložené čelné
  kovanie, Svetlosť výsuvu mm, Výška bočnice mm a cena. Jeho Shoptet checkbox
  identifikátory a hodnoty sú v `native-category-filters.json`. Nie je označený za
  rovnaké vyhľadávanie. Potrebujeme ich presné mapovanie na facet atribúty a úplný
  slovník ďalších kategórií, nie odhad podľa názvu.
- Doplnili sme chýbajúce testy zbalenia/rozbalenia a zachovania Skladom pri radení,
  reload a návrate v histórii: fungovali na1440 aj375px (`filter-state.json`).
  Existujúce testy rc.4 už dokladajú celý popis checkboxu, kombinácie a reset.
  Tieto čiastkové PASS neznamenajú úplnú paritu natívneho filtrovania.

## Čo je implementované v tomto kole — bez aktivácie na webe

`shared/luigi/search.js` je pripravená hranica **dokumentovaného verejného Search
API**, nie nový renderer ani cart handler. Nie je importovaná v `src/main.js`:

- produktový typ je explicitne `product` podľa tohto indexu; nepoužíva sa zmiešaný
  počet produktov, kategórií a návrhov ako počet produktov;
- query/filter/sort/page stav je serializovateľný do URL; zmena radenia zachováva
  výber filtrov a vracia stránkovanie na1;
- facets a sort používajú výslovný whitelist. `creation_time` je odmietnuté,
  automatické facety sú vypnuté podporovaným API parametrom;
- chybná odpoveď, cudzí typ výsledku alebo neočakávaný facet sa nepovažuje za úspech;
- preflight nákupného kontraktu nikdy nedopĺňa chýbajúce netto, step, pack, sklady,
  orderable ani variant. Chýbajúce údaje hlási samostatne.

`api-preflight.json` dokladá živé API skúšky:14 produktov Skladom; kombinácia
Skladom+Biela+BLUM má3 produkty, radenie zostalo zachované a odpoveď neobsahuje
creation_time. Táto prípravná vrstva **nie je zapojená do aktuálneho Luigi UI**,
preto zákaznícke nedostatky filtrov a kariet neoznačujeme ako opravené.
Štyri povolené facety v diagnostike nie sú konečný slovník všetkých parametrov.

## Konkrétny implementačný plán

1. **HOTOVÉ v repozitári:** podporovaná API hranica, stav URL, kontrola whitelistu,
   dátový preflight, testy a tento dodávateľský balík. Bez nového preview buildu.
2. **BLOCKED — Luigi/Shoptet dodávateľ:** potvrdiť zvolenú podporovanú cestu, licenciu,
   lifecycle a dodať izolovaný vendor preview + export pôvodného nastavenia.
   Vyplniť `DATA-CONTRACT.md`, vrátane netto, skladov, množstevných pravidiel,
   priceId/variant bindingu. Pre ResultsRenderer dodať podporovaný dávkový HTML endpoint.
3. **Po splnení2 — repozitár + vendor preview:** pripojiť jednu natívnu šablónu/renderer
   cez dokumentované rozhranie; zachovať natívnu mriežku/tabuľku, ikony, zaoblenia,
   ceny a qty. Facet šablóny preberú natívny vzhľad a mobilné ovládanie, ale budú
   používať Luigi filtre/počty; Shoptet AJAX filtráciu nemožno slepo ponechať ako
   druhý vyhľadávač. Jedno úložisko URL stavu, jeden listener na každý typ udalosti.
4. **Pred odovzdaním nového preview:** všetkých12 funkcií a všetky placementy,
   kus/sada/balenie/metráž/minimum/nezávislý násobiteľ/variant/neobjednateľný produkt;
   native vs nový renderer pri rovnakomSKU a zadanom množstve, serverový košík,
   gross/net/jednotka/sklad, jediný submit a správna analytická väzba. Desktop1440,
   mobil375, hranice natívnych breakpointov, mriežka/tabuľka, história filtrov.
5. **Až po schválení majiteľom:** samostatné rozhodnutie o merge/produkcii/externom
   publikovaní. Každý preview bude nový nemenný build. Tento krok nie je autorizovaný.

## Udržateľnosť, výkon, synchronizácia, licencia, analytika

- Plná šablóna s kompletnými dátami znamená jeden search request a menej sieťových
  závislostí. Zostáva synchronizácia cien/skladov a zhodné pravidlá verziovaných
  natívnych modulov; nevytvárať druhý výpočet množstva alebo univerzálnej DPH.
- Dávkový renderer má dodatočnú latenciu. Požadujeme jednu dávku pre stránku,
  žiadne sťahovanie detailu pre každú kartu, zachovanie relevančného poradia,
  explicitnú append/reset sémantiku, ošetrenie zrušeného/starého requestu a cache
  oddelenú podľa cenovej skupiny/DPH/jazyka/variantov. Bez benchmarku/SLA nie je
  výkon PASS. Hetzner sa nestane runtime závislosťou e-shopu.
- Autoritatívny košík ostáva Shoptet. API skladové príznaky nie sú potvrdené počty
  jednotlivých skladov. Vyžadujeme zdroj, timestamp, interval/delta aktualizácie,
  výpadkový postup a konzistentný snapshot hrubej/netto ceny. Stará alebo neúplná
  cenová odpoveď nesmie odomknúť nákup.
- API dostupnosť dokazuje technickú cestu, nie zmluvný nárok. Rozsah API/custom
  templates/ResultsRenderer, náklady, limity, podporovaný Search.js build, servis
  a vlastníctvo budúcich úprav musí potvrdiť Luigi. **Licencia/SLA BLOCKED.**
- Pri Search.js zachovať jeho reportovanie a identitu výsledku (`data-lb-id` môže
  byť iná ako navigačná URL). Pri vlastnom API rozhraní má jeden adaptér vlastniť
  impression/click kontext a súhlas; natívny handler vlastní submit/cart popup.
  Automatický zber a vlastné odosielanie sa nesmú zdvojiť. Potrebné sú väzby na
  rovnakú identity/list/impression a overenie vo vendor reporte, nielen transport.
- Súčasný kompaktný našepkávač sa v tomto kole nemenil. Jeho layoutové dôkazy rc.8
  zostávajú len dôkazmi rozloženia, nie prijatím jeho neúplných nákupných funkcií.

Produkcia: **v0.7.7**, loader nezmenený. Žiadne admin zmeny, index DELETE,
objednávka, merge alebo nasadenie. Výstup tohto kola je funkčný technický základ
bez aktivácie + presný zoznam podmienok, ktoré bránia dokončeniu zákazníckeho UI.
