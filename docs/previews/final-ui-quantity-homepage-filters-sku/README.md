# Final UI Fix — Quantity, Homepage, Filters & SKU

Referencia: `2348b8de2b38fa41c6d5eecf4b02f2b8b2736076`.
Vetva: `preview/product-detail-compact-pro-20261019`. Iba PREVIEW; žiadny merge, tag, release, zásah v adminovi ani produkčné nasadenie.

## 1. Množstvo podľa referencie košíka

Existujúce `--ts-qty-*` tokeny teraz odkazujú na skutočný vzhľad mini/hlavného košíka: **1 px #C97A2B**, radius **7 px**, oba symboly **#423E3E**, tlačidlá **#F5F0E9**, biely stred a deliace čiary **#E5E0DA**. Nepribudla nová farebná paleta. Symboly kariet majú 18 px, rovnako ako natívne značky v košíku; hover používa pôvodné neutrálne zvýraznenie referencie.

Odstránené nadbytočné lokálne farebné výnimky detailu a odporúčaní; tie opäť používajú spoločný základ. Referenčné mini/hlavné košíky sú computed styles aj geometriou **identické pred/po**. Výška ostáva podľa komponentu: natívny detail/košík 36 px, karty 38 px. Šírky a segmenty mimo homepage sa nemenili, vrátane tabuľkovej kapacity pre viacmiestne množstvo. Žiadne nové funkčné selektory alebo handlery.

## 2. Mobilný filter CENA — konkrétna príčina

Cenové `h4::after` obsahovalo správny znak `\e900`, ale nemalo ikonový font ani absolútne umiestnenie. Computed styles pri 390 px: **Roboto 13 px, position:static** oproti ostatným filtrom **Apollo 8 px, position:absolute**. Nešlo o dva súčasné pseudo-elementy: `::before` už malo `content:none`.

Lokálna oprava cenového `::after` platí iba do **991 px**. Preberá Apollo font 8 px a absolute pozíciu; ponecháva existujúci glyph, pravé zarovnanie, `translateY(-50%)`, stavové otočenie 180° a transition 160 ms. Pôvodný breakpoint má rozdielny line-height: **1.4 do 767 px**, **1.1 pri 768–991 px**. Test pri 768 px túto odchýlku zachytil a oprava rešpektuje oba natívne rozmery. Desktop >=992 px bez zmeny.

Otvorenie, zatvorenie, rotácia aj skutočný drag cenového slidera a aplikovanie `priceMin` prešli na všetkých 8 šírkach.

## 3. Homepage — dva spoločné stĺpce

V pôvodnom offer elemente je CSS Grid: sklad vľavo a ceny vpravo. Pôvodný formulár pod ním používa rovnaké stĺpce: množstvo vľavo a oranžový košík vpravo. Stred skladu presne zodpovedá stredu množstva, stred cenového bloku stredu CTA.

- Medzera stĺpcov **20 px**, maximálna spoločná šírka **268 px**, pomer **100 : 148**, pružné `minmax(0, …)` stĺpce.
- Pôvodný bočný padding karty zostáva; vnútorný blok je symetricky centrovaný.
- Odstránené absolútne umiestnenie homepage nákupného riadka a nepotrebná spodná rezerva. Formulár je v prirodzenom toku, preto môže cenový/stock blok pri zalomení rásť.
- Cena vrátane € modrá, jednotka v pôvodnej neutrálnej farbe, net cena v zátvorkách. Pôvodné skladové farby a počty ostali.
- Pri úzkom nákupnom bloku pod 250 px sa skryje iba text CTA. Natívna biela ikona aj prístupný názov zostávajú.
- Ceny sa nekopírujú, údaje neprepočítavajú a formuláre/inputy sa nepresúvajú medzi komponentmi. Zmenil sa iba CSS layout existujúcich uzlov.
- Počet kariet, Swiper DOM/API/navigácia, pomer strán a vykreslené rozmery fotografií sú nezmenené.

Testované TOP Produkty, Novinky v ponuke a Výsuvy MERIVOBOX. Kategórie, vyhľadávanie a hlavný detail nemajú tento nový layout.

## 4. Čitateľný KÓD

Existujúci viditeľný `.p-code.ts-product-meta` na karte dostal biely podklad s **94 % opacity**, padding **2 × 4 px**, radius **5 px**, bez tieňa. Sivý label, modrý SKU a všetky natívne hodnoty/atribúty ostali. Na mobile natívne skryté kódy násilne nezobrazujeme.

Detail produktu a popup sa týmto pravidlom nemenia. Desktopový tabuľkový kód, ktorý neleží na fotografii, má naďalej transparentné pozadie a nulový padding; jeho riadková geometria zostáva. Modré ceny ani ďalšie modré prvky sa nemenili.

## Overenie

[Podrobné merania a výsledky](verification.json).

| Kontrola | Výsledok |
| --- | --- |
| Homepage 1440/1280/1024/768/430/390/375/320 px | PASS — 3 sekcie, 256 kariet; rovnaká os sklad/množstvo a cena/CTA, bez kolízií alebo horizontálneho scrollu |
| Fotografie pred/po | PASS — rozmery každého testovaného obrázka zachované |
| Nákup z homepage | PASS — 24 reálnych kombinácií (3 sekcie × 8 šírok), plus/mínus, minimum, priame zadanie, jediný POST a presný serverový počet |
| Celková suma, počty v hlavičke a mini košík | PASS — overené po nákupoch na všetkých 8 šírkach |
| Mini + hlavný košík 1440/390 px | PASS — zhodné computed styles všetkých segmentov pred/po, viditeľné symboly; reálne plus/mínus a riadkové súčty 2,26 → 4,52 → 2,26 € |
| Filter CENA | PASS — všetkých 8 šírok, otvorenie/zatvorenie, 160 ms rotácia, identická mobilná šípka a aplikovanie slidera |
| Kategória + vyhľadávanie | PASS — 16 porovnaní na všetkých šírkach, navyše oba desktopové režimy; rozloženie, rozmery a pozície bez zmien; zámerná zmena symbolov 16 → 18 px je povolená vzhľadová korekcia |
| Skutočná AJAX výmena pri filtrovaní | PASS — 1440/390 px, opakovaná inicializácia bez duplicít, balenie po 100 a jediný nákupný POST na presných 200 kusov |
| Hlavný detail | PASS — 494606 a dlhý 499061, 1440/768/390/320 px; galéria, varianty, cena, dostupnosť, doprava a nákupná geometria zachované |
| Natívne súvisiace/podobné | PASS — 1440/390 px; neutralita symbolov a referenčný rám/radius/biely input, plus 1 → 2 a mínus 2 → 1 |
| Vysoká cena + jednotky | PASS — všetkých 8 šírok, 1 479,36 € a ks/pár/sada/m, žiadne vytečenie textu alebo prekrytie skladu |
| Konzola homepage | PASS — bez nových JS chýb vo všetkých 8 nákupných behoch |
| lint / build / diff check | PASS |

Test vysokých cien používa **browser-only zmenu pôvodných natívnych textových uzlov** na testovacej homepage; zmenené ceny sa neodosielali a fixture nie je v aplikácii. Živé ceny/nákupné výpočty boli samostatne overené v 24 natívnych nákupoch. Existujúci observer správne obnovil modrý cenový marker po zmene cenového uzla.

Pri prvom pomocnom porovnaní sa vyžadoval nesprávny konkrétny sivý odtieň jednotky, hoci natívny neutrálny odtieň zostal nezmenený. Finálny test kontroluje jeho odlíšenie od modrej ceny. Prvý regresný test tiež zachytil schválené zväčšenie symbolov 16 → 18 px; finálny test naďalej vyžaduje úplne rovnakú vonkajšiu aj segmentovú geometriu. Jeden pôvodný beh mobilného referenčného košíka skončil timeoutom pri čakaní na otvárací prvok mini košíka; izolovaný opakovaný beh na rovnakom zdroji prešiel celým porovnaním aj natívnymi aktualizáciami bez zmeny aplikačného kódu.

## Screenshoty

| Sekcia | Desktop pred | Desktop po | Mobil pred | Mobil po |
| --- | --- | --- | --- | --- |
| TOP Produkty | [1440](home-1-before-1440.png) | [1440](home-1-after-1440.png) | [390](home-1-before-390.png) | [390](home-1-after-390.png) |
| Novinky | [1440](home-2-before-1440.png) | [1440](home-2-after-1440.png) | [390](home-2-before-390.png) | [390](home-2-after-390.png) |
| MERIVOBOX | [1440](home-3-before-1440.png) | [1440](home-3-after-1440.png) | [390](home-3-before-390.png) | [390](home-3-after-390.png) |
| Kategória | [1440](category-before-1440.png) | [1440](category-after-1440.png) | [390](category-before-390.png) | [390](category-after-390.png) |
| Vyhľadávanie | [1440](search-before-1440.png) | [1440](search-after-1440.png) | [390](search-before-390.png) | [390](search-after-390.png) |
| Mini košík | [1440](mini-before-1440.png) | [1440](mini-after-1440.png) | [390](mini-before-390.png) | [390](mini-after-390.png) |

- [Mobilný filter pred](filters-before-390.png) / [CENA po oprave, otvorený stav](filter-price-open-390.png).
- [Nový štýl KÓD na tmavých fotografiách](home-1-after-1440.png).
- [Vysoké ceny — desktop](high-price-fixture-1440.png) / [320 px mobil](high-price-fixture-320.png), výhradne testovacie texty.

## Limity a rozsah

Chromium s dotykovou/mobilnou emuláciou, nie fyzický iPhone/Safari. Externé variantové API `friends.shopcode.cz` je v testovacom prostredí blokované; pri porovnávaní hlavného detailu používali obe verzie identický browser-only fixture. Variantový modul ani jeho živá externá synchronizácia sa nemenili a táto synchronizácia nie je týmto testom potvrdená.

Žiadny JavaScript ani produkčný loader sa nezmenil. Neprebehlo rozšírenie build limitov: **CSS gzip 27 340 B / 27 392 B (26,75 KiB)**, **JS 32 467 B / 32 768 B**. Refaktor odstránil nadbytočné výnimky a nevyužité homepage hodnoty.

## Upravené súbory

- `src/styles/tokens.css` — referenčné neutrálne quantity hodnoty, homepage stĺpce, svetlý SKU podklad.
- `src/modules/qty-picker/qty-picker.css` — symboly/hover podľa referencie.
- `src/styles/overrides/quantity-control.css` — odstránenie odlišných detailových farieb.
- `src/styles/overrides/recommendations.css` — odstránenie nadbytočných odlišných vzhľadových pravidiel.
- `src/styles/overrides/filters.css` — lokálny mobilný/tabletový font a pozícia cenovej šípky.
- `src/styles/overrides/homepage-purchase.css` — dva stĺpce existujúcich údajov a formulára.
- `src/styles/overrides/product-metadata.css` — čitateľný obrazový kód; výnimka pre tabuľku/detail/popup.
- `dist/timber.min.css`, `dist/timber.min.css.map` — build.
- `docs/previews/final-ui-quantity-homepage-filters-sku/` — report, merania a screenshoty.
