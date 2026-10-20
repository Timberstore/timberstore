# UI regression repair — v0.7.1-rc.1, 20. 10. 2026

Iba vetva `preview/ui-consistency-20261020`. Referencia **v0.7.0** (`db193dbbab7fc778676930ebecbc4a9764be4b16`), porovnanie s preview **47f7f16dcf6cc3ebb2204e569cb79088f548d288**; začiatok práce na dokumentačnom commite `4bb0fe0`. Bez merge, nového tagu/release, zmeny administrácie, produkčného loadera alebo objednávky/platby.

**[Nemenný preview odkaz, presný SHA a CDN overenie](PUBLISHED.md)** · [audit príčin](AUDIT.md) · [všetky zmenené súbory](FILES.md) · [postup opakovania testov](verification/README.md).

Dva referenčné screenshoty spomenuté v zadaní neboli súčasťou tejto prílohy. Vzhľad preto porovnávame priamo s CSS/JS z nemenného tagu v0.7.0 na rovnakom živom Apollo HTML. Obrázky nižšie jasne rozlišujú referenciu, staré preview, opravený layout a živé nákupy.

## Opravy

| Pôvodná chyba | Príčina | Oprava a výsledok |
| --- | --- | --- |
| Sivý vnútorný panel zhrnutia, nevhodné zalomenie dopravy | Spoločný selektor pridaný v `47f7f16` aplikoval background/border/padding aj na správny natívny summary; formatter vkladal pevné `br` | Regresný blok odstránený, návrat k teplému svetlému podkladu v0.7.0, pôvodný oranžový truck/progress a zelené sumy. Iba suma s € je nowrap; text sa zalamuje prirodzene. Modrý nový súčet zostáva. **PASS** |
| Vertikálne odporúčania, prázdne plochy a orezaná hlavička popupu | `47f7f16` odstránil funkčný horizontálny layout z `cart-modal.css`; generický grid zasahoval všetky kontexty. Native `.colorbox-html-content` pridával 40 px vertikálneho paddingu, záporný margin hlavičky predpokladal iný obal; inline výšky sa prekrývali | Jeden vlastník geometrie v `cart-modal.css`: max. 960 px, automatické vonkajšie výšky, normalizovaný obal a hlavička, jediný scroll `#cboxLoadedContent`. Po zatvorení sa obnoví scroll stránky. Desktop 4 stĺpce, mobil fotografia/názov, sklad/cena, plná quantity a CTA. **PASS živý popup aj replay záťaž** |
| Horný progress v Možnostiach doručenia, stratená zelená hlavička | `47f7f16` vložil nový prvý element a správu z aktuálneho `cartInfo` pred natívny nadpis | Vkladanie odstránené. Hlavička je opäť prvá; zachovaný jediný existujúci spodný panel, jeho serverová suma/percento aj vysvetlenie hypotetického nákupu. **PASS** |
| Nejednotná/chýbajúca cart ikona | Popup mal samostatnú SVG masku; niektoré kontexty skrývali natívny pseudo-element | Spoločné pravidlo pre existujúci biely Apollo glyph `\e918`, rovnaký font aj farba. Odstránený zbytočný SVG token. Checkout šípka zostáva pôvodná. **PASS** |
| Úzke mobilné karty mali veľký price–stock odstup | Zbytočne vysoký rezervovaný stock slot `4em` | `3em`, ktorý môže prirodzene rásť; net cena aj sklad centrované, CTA na spoločnej spodnej línii. Dve karty zachované na 375/390/430; na 320 má Apollo natívne jeden stĺpec. **PASS** |
| Názvy súvisiacich/podobných produktov sa orezávali a nové areas sa ignorovali | Staré dôležité flex/clamp pravidlá pre klasické tiles sa uplatnili aj na `.ts-recommendation`; `:not(#colorbox *)` zvyšovalo ich špecifickosť o ID | Presne tieto legacy title selektory vylúčia odporúčania; ich vlastný grid a prirodzená výška názvu sa uplatnia. Širšie detailové odporúčania na mobile majú vlastný plný riadok, kategórie/homepage ostávajú mimo zásahu. **PASS** |
| Kód/značka pri prvom zobrazení poskakovali | Native `p-code-label` bol širší než výsledné KÓD; fonty/váhy a delimiter sa menili až po JS, globálny `transition:all` animoval anchor. Root padding/headline metriky sa viazali na neskorý `data-ts-compact` | Metriky, farby a krátky vizuálny label platia už pre natívne uzly. Native text ostáva prístupný; CSS generated label má prázdny accessibility alternatívny text. Metadata nemajú animáciu rozmerov; žiadne nové skrývanie obsahu ani observer. **PASS: finálny pomalý aj bežný cold load 0 px x/y/šírka** |
| Šedé Načítať ďalších/aktívna stránka, čierne Hore | Class-only pravidlá z `47f7f16` prehrávali s ID a `.btn.btn-secondary` Apollo | Pôvodné pravidlá dostali primeranú lokálnu špecifickosť; vypočítaná oranžová `rgb(212,136,74)`, neutral inactive, oranžové interakcie. **PASS vrátane skutočnej strany 2 a load-more** |
| Zmiešaný sidebar font, chýbajúce ikony a status | Legacy `support__item` mal dôležité 15 px/700/block; nový hodinový riadok 13 px bez lokálneho status štýlu | Sidebar 14 px/21 px, hodiny/email/telefón centrované, pôvodné ikonové helpery a existujúci Bratislava clock. Otvorené zelené, zatvorené oranžové. Kontakty v košíku sa nemenia. **PASS** |
| Useknuté zvýraznenie mobilného filtra | Vonkajší filter row mal padding 16 px, podklad sa maľoval iba na vnútorný heading | Padding presunutý na heading/obsah, aktívny podklad vlastní celý row, opravená šírka price header. **PASS Cena/dostupnosť/značky aj reálny slider** |
| Jemnejší tabuľkový výpis | Nová požiadavka, nie dokázaná regresia | Stock 13→12 px a hlavná cena 15→14 px v existujúcich deklaráciách; stĺpce, jednotky/net/ceny sa nemenia. **PASS** |

## Testy a dôkazy

Chromium, živé verejné Shoptet stránky a natívne endpointy. Mobil je emulácia viewportu/touch, nie fyzický iPhone. Šírky **1440 / 1280 / 1024 / 768 / 430 / 390 / 375 / 320 px**.

| Oblasť | Stav | Dôkaz a rozsah |
| --- | --- | --- |
| Homepage/kategória/table, päť číslic, overflow, footer | **PASS** | [layout](evidence/layout.json), všetkých 8 šírok; 1/10/100/1000/20000 je iba kontrola zobrazenia, nie obídenie max |
| Tri homepage slidery, posun a skutočné nákupy | **PASS** | [home-native](evidence/home-native.json), 1440/390/320, 9 nákupov, správne serverové množstvá a jeden POST |
| Živý popup AGOFORM 354068 + jeho odporúčanie 399235 | **PASS** | [live-popup](evidence/live-popup.json), 1440/390/320: endpoint `hasContent=true`, otvorenie, zavretie, opätovné otvorenie, nákup odporúčania jedným POST |
| Zachytený popup, vysoké množstvá a dlhý názov | **PASS – REPLAY layout** | [popup](evidence/popup.json), 8 šírok. Navyše [natívny submit](evidence/popup-native-submit.json) zo zachyteného formulára; nie dôkaz čerstvého načítania obsahu |
| Jediný bezpečný scrollbar a dostupné posledné CTA | **PASS – REPLAY záťaž** | [popup-scroll](evidence/popup-scroll.json), 6 kópií zachytenej karty pre prebytočnú výšku, 1440/390/320, telo sa odomkne po close |
| Hlavný košík, modré hlavné a neutrálne sekundárne ceny, fialové Súvisiaci tovar | **PASS** | [cart-prices](evidence/cart-prices.json), 8 šírok, otvorenie/zatvorenie; natívne Jota 1→2 a **4,52 €** |
| Mini košík, serverové quantity/total a znamienka | **PASS** | [mini](evidence/mini.json), 1440/390/320, plus aj mínus, bez zmeny šírky ovládača |
| Doprava/modal/summary | **PASS** | [shipping](evidence/shipping.json), [živé zhrnutie](evidence/summary-native.json), 8 šírok; serverový stav/percento zachované, žiadny druhý progress |
| Presné zostatky 1,97 / 91,72 / 1 234,56 € | **PASS – layout fixtures** | [21 výslovne označených prípadov](evidence/summary-layout-fixtures.json), 7 šírok, suma+€ v jednom fragmente a v hraniciach panelu. Tieto sumy nevydávame za serverový výpočet |
| Skutočná doprava zadarmo a suma nad 1 000 € | **PASS** | [free](evidence/summary-free-native.json): Jota+FRANKE; [high total](evidence/summary-high-native.json): 20× BLUM 485572, **1 489,60 €**, 7 šírok |
| Súvisiaci tovar, pomalý zdroj, min/max/step, fallback | **PASS** | [stability](evidence/related-stability.json) 6 šírok, 2,5 s delay a **0 px** posun; [BLUM/StrongFix 11109](evidence/blum-related.json): natívne minimum/krok 1000, max 9999; [chyba fetchu](evidence/related-failure.json) obnoví pôvodný nákup bez vymysleného SKU |
| Filtre a AJAX reinicializácia | **PASS** | [filter](evidence/filter-final.json) vrátane 393 px navyše; skutočný posun cenového rozsahu. [AJAX](evidence/ajax.json): desktop/mobil, skutočný replacement, 3× lifecycle, jeden input/picker/POST |
| Stránkovanie, špecifickosť, sidebar, plná šírka filtrov | **PASS** | [computed styles + native strana 2](evidence/visual-more.json), 8 šírok; [load-more a checkout total](evidence/loadmore-checkout.json), bez odoslania objednávky |
| Rovnaký natívny cart glyph, stav hodín | **PASS** | [icons/hours](evidence/icons-hours.json), home/category/search/detail/related/similar; popup navyše v popup teste. Testované dátumy 10:00 otvorené a 16:01 zatvorené v Bratislave používajú existujúci clock |
| Galéria a vlastný layout súvisiacich/podobných produktov | **PASS** | [gallery](evidence/gallery.json), 1440/768/430/390/320: otvorenie/fotka/ďalšia/zavretie, quantity a neorezané celé názvy |
| Zachovanie detailu, galérie, variantových rozmerov, ceny, CTA, stock/doručenia | **PASS – geometria variantov s fixture** | [16 párov pred/po](evidence/detail.json): Jota 494606 + dlhý BLUM 499061, všetkých 8 šírok. Fixture iba nahrádza nedostupnú externú odpoveď; ceny/galéria/formy sú živé |
| Mobilné menu, sociálne farby/poradie | **PASS** | [menu](evidence/menu.json), 430/390/375/320 |
| lint / build / diff --check | **PASS** | [build, hash a limity](evidence/build.json); JS **33 107 B gzip (32,33 KiB)**, CSS **28 869 B gzip (28,19 KiB)**; pôvodné limity **32,5 / 28,25 KiB nezvýšené** |
| Safari/WebKit, fyzický iPhone | **NOT VERIFIED** | Nové testy v týchto prostrediach neprebehli; žiadne pokusy o sťahovanie WebKit |
| Živý feed `friends.shopcode.cz` | **NOT VERIFIED** | Prostredie službu blokuje; overený fixture layout nie je živá synchronizácia variantov |

## Prvé vykreslenie metadát

Každý nový browser context je cold load. Diagnostika cez `requestAnimationFrame` beží už od initial documentu; viditeľnosť kontroluje aj predkov (`display`, `visibility`, `opacity`). Porovnávame skutočne viditeľný native header, nie skrytý mobilný klon. V pomalom teste je **vlastný JS zámerne oneskorený o 3 000 ms**, CSS ostáva dostupné. Záznam pokrýva prvú viditeľnú snímku a pokračuje 6,5 sekundy po load; [coverage súbory](evidence/cold-coverage-after-320.json) obsahujú čas konca a poslednej vzorky.

Rozsah x/šírky medzi všetkými viditeľnými snímkami, px:

| Šírka | Kód x pred | Značka x pred | Značka šírka pred | Kód/značka x/y/šírka po |
| --- | ---: | ---: | ---: | --- |
| 1440 | 14,375 | 52,906 | 35,266 | **0 / 0 / 0** |
| 768 | 27,016 | 40,828 | 20,625 | **0 / 0 / 0** |
| 430 | 8,578 | 36,906 | 35,266 | **0 / 0 / 0** |
| 390 | 8,578 | 36,719 | 34,891 | **0 / 0 / 0** |
| 375 | 8,578 | 36,781 | 35,016 | **0 / 0 / 0** |
| 320 | 9,078 | 36,906 | 35,266 | **0 / 0 / 0** |

Pred: `cold-before-visible-*.json`; po: `cold-after-*.json`. Bežný cold load bez dodatočného delay (`cold-normal-*.json`) a dlhý BLUM 499061 s 3 s delay (`cold-long-*.json`) takisto **0 px** na 1440/390/320. Čísla sú konkrétne pozorovania, nie sľub pre každú sieť/font/browser kombináciu.

## Screenshoty

Popup pred/po používa rovnaký zachytený natívny obsah pre porovnateľný layout. Samostatný stĺpec ukazuje skutočný nový nákup; jeho suma je prirodzene iná podľa aktuálneho serverového košíka.

| Komponent | Referencia / pred | Po |
| --- | --- | --- |
| Zhrnutie desktop | [v0.7.0](images/summary-reference-1440.png), [staré preview](images/summary-before-1440.png) | [oprava](images/summary-after-1440.png) |
| Zhrnutie mobil | [v0.7.0](images/summary-reference-390.png), [staré preview](images/summary-before-390.png) | [390](images/summary-after-390.png), [320](images/summary-after-320.png) |
| Popup desktop – rovnaký replay | [pred](images/popup-before-1440.png) | [po](images/popup-final-1440.png), **[živý nákup](images/popup-live-1440.png)** |
| Popup mobil – rovnaký replay | [pred](images/popup-before-390.png) | [390](images/popup-final-390.png), [320](images/popup-final-320.png), **[živý 390](images/popup-live-390.png)**, **[živý 320](images/popup-live-320.png)** |
| Možnosti doručenia | [desktop pred](images/shipping-before-1440.png), [mobil pred](images/shipping-before-390.png) | [desktop](images/shipping-after-1440.png), [390](images/shipping-after-390.png), [320](images/shipping-after-320.png) |
| Mobilné produkty | [karta pred](images/card-before-390.png) | [karta 390](images/card-after-390.png), [dve vedľa seba](images/category-390.png), [430](images/card-after-430.png), [320 natívny jeden stĺpec](images/card-after-320.png) |
| Sidebar | [pred](images/sidebar-before.png) | [po](images/sidebar-after.png) |
| Stránkovanie | [pred](images/pagination-before.png) | [po](images/pagination-after.png) |
| Cena filter | [pred](images/filter-before-390.png) | [po](images/filter-after-390.png) |
| Skutočné vysoké sumy/free | — | [1 489,60 €](images/summary-high-native-320.png), [doprava zadarmo](images/summary-free-native.png) |

## Zostávajúce obmedzenia

- Safari/WebKit, fyzický iPhone a živý externý variant feed majú stav **NOT VERIFIED**. Netestované funkcie sa neoznačujú ako PASS.
- Konkrétne zostatky 1,97/91,72/1 234,56 € sú označené layout fixtures. Serverové výpočty sú osobitne overené na reálnych nákupoch a reálnom high-total/free stave.
- Pri Jota môže natívny detailový add neotvoriť odporúčania. Živý PASS popupu je doložený produktom **354068**, opakovane a na troch šírkach; neznamená zmenu konfigurácie Shoptetu pre celý katalóg.
- Finálne dostupné testy nemajú nevyriešený FAIL. Počas práce odhalené konflikty wrapper paddingu, clamping odporúčaní a CSS špecifickosti boli opravené a príslušné testy opakované. Chyby testovacieho harnessu (skrytý clone, chýbajúci helper, nesprávny selector textovej strany 2, porovnanie farby počas transition) nie sú zamieňané za chyby webu.
