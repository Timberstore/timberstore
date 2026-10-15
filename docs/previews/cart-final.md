# Dokončenie aktuálneho preview 0.6.11-rc.4

15. 10. 2026. Pokračovanie vo vetve `preview/mobile-shipping-layout-20261015` nad čistým commitom `b075e8cb11d88e16b9a1ec0dea3b957d6fa76623`. Číslo verzie, package/lock, produkčný loader a paleta sa nemenia. Nový commit dopĺňa existujúce rc.4; nejde o nový release/tag. Bez resetu, merge, admin úprav alebo produkčného nasadenia. Pôvodné preview zostáva dostupné cez svoje nemenné SHA. Trello kód nebol poskytnutý.

## Vykonané opravy

1. **Mobilný náhľad košíka:** zachovaný opravený scroll lock, ukotvenie pod skutočnou hlavičkou, jediná produktová scrollovacia oblasť, stabilný titulok/footer a obnova pozície. Zachované vh/dvh a safe-area. Back-to-top je naďalej skrytý iba počas otvorenia.
2. **Mobilná šípka:** biela na oranžovej, pôvodné otáčanie podľa natívneho otvoreného stavu. Existujúci sibling button zostáva jediným samostatným ovládaním. Grid v pôvodnom cart linku rezervuje miesto pre nezmenený 24px glyph, badge, cenu a šípku; odstraňuje vzájomné prekrytie. Native Bootstrap `visible-lg` nesmie skryť mobilnú cenu. Pravý padding natívneho wrappera už neposúva šípku mimo farebnej plochy. Desktop bez zmeny.
3. **Mobilné produktové riadky:** CSS grid nad pôvodnými uzlami/formulármi, horný riadok obrázok/názov, spodný množstvo vľavo, cena a odstránenie vpravo. Pôvodné ceny a ovládanie, klikateľná plocha odstránenia 36×36 px, desktopový red token `#b83b43`. Žiadne duplikované alebo premiestnené interaktívne DOM uzly. Dlhé názvy sa zalomia, cena zostáva celá.
4. **SPOLU:** zachované spoločné 16px insets, tučný natívny súčet a jemná horná linka na mobile/desktope. Nepribudol finančný výpočet.
5. **Doprava:** zachované serverové riadenie oranžového/zeleneho baru a Emerald strong v náhľade. Hlavný košík overený oboma smermi cez hranicu. Navyše opravená natívna zelená truck ikona po splnení — zostáva firemná oranžová aj v tomto stave. Pôvodné 6px rozmery progress baru sa zachovávajú aj pri vložení nového AJAX obsahu.
6. **Dátum a doprava v zhrnutí:** spoločný 12px font, ikony na rovnakej osi vľavo, texty doprava, pôvodné veľkosti ikon, zelený pôvodný dátum aj suma. Oba riadky majú min-height 64px a môžu prirodzene narásť pri dlhom texte. Zjednotenie platí na mobile aj desktope podľa finálneho zadania. Zlúčené existujúce mobilné pravidlá do spoločného pravidla bez ďalších duplicít.
7. **Prihlásenie v checkoute:** tlačidlo aj jeho skutočný natívny obal majú plnú šírku zhodnú s nadpisom Osobné údaje, 8px radius, pôvodnú oranžovú a biely text. Od nasledujúceho formulárového riadka odstup aspoň 20px (desktop 24px). Rozloženie menových, adresných a kontaktných polí sa nemení. Pôvodný href a native login zostávajú.
8. **Kontakty:** úplne odstránená tvorba doplnkového odseku „V prípade otázok…“, jeho CSS aj nepoužitý text. Zachovaná štvorriadková štruktúra nadpis/hodiny/email+telefón/ikony, divider, tel: a mailto:. Žiadne skrytie duplicitného odseku cez CSS.
9. **Mobilné menu:** zachované overené spoločné 10px medzery telefón/email/hodiny a mierne väčší odstup sociálnych sietí; funkčné odkazy a centrovanie.
10. **Sidebar:** scoped override výhradne `.sidebar-left .box-categories` a `.sidebar-left #categories` od 768px. Biely nadpis aj ikona; biele iba priame odkazy a šípky plných oranžových stavov `.categories.active > .topic.active`, `li.active` a `a.timber-current-link`, vrátane hover. Svetlé otvorené rodičovské stavy `.child-active`/`.timber-parent-link` a neaktívni potomkovia zostávajú tmaví. Žiadne názvy/poradie kategórií, nové pozadia, rozmery alebo JS zásah do rozbaľovania.
11. **Súvisiaci tovar na detaile:** lokálne odstránená native opacity čakacia podmienka/prechod na produktových kartách a slider obale v `.type-detail .products-related`. Ostatné detaily, layout, lazy obrázky, native hidden/variant stavy, Swiper, formuláre a pack/min/max/step mechanizmy bez zmeny. Žiadny nový JS, observer, fetch alebo timeout.

## Identifikované príčiny

- Produktový grid platil iba pre desktop. Mobile preberal nesúrodé natívne pozície ceny/delete. Oprava sa viaže na pôvodné mobilné full-cart uzly, nie na text či ID produktu.
- Mobilný sibling chevron dedil oranžovú foreground farbu na oranžovej ploche. Native absolútny badge a pravý padding wrappera súperili o miesto s cenou/šípkou.
- Login mal `width:auto` a desktopový grid ho tlačil na koniec spoločného nadpisového riadka. Pôvodné mobilné wrapper pravidlo navyše predpokladalo `.form-control-wrapper`, ale overené HTML má pri tomto odkaze obyčajný `div`. Spoločné pravidlo teraz pokrýva skutočný obal, nadpis a login zaberajú vlastné plné riadky; ostatné formulárové skupiny ostávajú.
- Sidebar: migrované legacy `!important` pravidlá explicitne dávali tmavý token aj plnej oranžovej položke a jej šípke. Override má potrebnú špecifickosť, ale nemení legacy pozadia ani funkčnosť. Samotné `expanded` neznamená plnú oranžovú; preto sa nesmie plošne vybieliť celý otvorený strom.
- Hlavný košík: native `.is-free-shipping` pravidlo malo vyššiu špecifickosť a farbilo truck na pôvodnú zelenú. Lokálny existujúci selector dostal scope košíka a explicitný accent, bez zásahu do výpočtu.
- Súvisiaci tovar: v overenom produkte bolo všetkých deväť natívnych formulárov/quantity/submit prvkov už v serverovom HTML. Čakanie nesúviselo s vlastným `qty-picker` ani košíkovým fetchom produktového detailu: oba sú pre túto sekciu mimo scope. Apollo má `.products-block .product, .slider-group-products {opacity:0; transition:opacity 250ms ease-out}` a odhaľuje ich cez globálne `body.is-loaded`. Pred opravou na DOMContentLoaded: form prítomný, amount=1, opacity karty=0, is-loaded=false; po oprave rovnaké natívne údaje a opacity=1 aj bez tejto triedy. Globálny body loader zostal v oboch meraniach skrytý — neobchádza sa. Časy jednotlivých navigácií sa nedajú porovnávať ako zrýchlenie, keďže cache/sieť sa líšili. Potvrdená oprava odstraňuje CSS gate a 250ms fade, nie čas prenosu externých skriptov.
- Predchádzajúca oprava mobilného scrollu, chyby slovenskej textovej detekcie Apolla a neaktuálneho shipping footeru je podrobne v [pôvodnom rc.4 reporte](cart-rc4.md). Je zachovaná a regresne overená.

## Testovanie

Chromium, izolované košíkové relácie, skutočný Shoptet/Apollo so substitúciou iba lokálnych Timber JS/CSS:

- 320/375/390/430: hore/uprostred/dole dlhej stránky, opakované otvorenie, zamknuté pozadie, vnútorný scroll, stabilný footer/titulok, bez prekrývania back-to-top, presná obnova pôvodného scrollu.
- Skutočný emulovaný dotyk, výšky 600/900/800 px, posledný produkt odstránený a prázdny košík zatvorený/opäť otvorený. Presne jeden titulok a close.
- Natívne pridávanie/quantity/remove a dve opakované zmeny nad/pod hranicu dopravy v oboch smeroch. Jedna shipping správa, aktuálny naformátovaný súčet zhodný s headerom, správne farby, zámok zachovaný. Sledované cart AJAX odpovede HTTP 200.
- Hlavný košík na mobile 390 aj desktope 1440: natívne množstvá nad/pod limit, aktuálny text a farba baru/strong, oranžový truck v oboch stavoch. MutationObserver v teste kontroloval každý vložený price-range; žiadny vyšší než 7px, finálny 6px.
- Hlavné informačné riadky: 320/375/390/430/1440 — 12px text oboch riadkov, spoločná os ikon, dátum Emerald, bez horizontálneho overflow.
- Checkout doprava/platba a osobné údaje: 320/375/390/430/1024/1440 — kontaktné poradie, pôvodné ikony, tel:/mailto:, nulový počet doplnkových odsekov, biele CTA/šípky v base/hover/active, bez overflow. Login má šírku a ľavý okraj nadpisu s toleranciou 1px, min. 48px výšku, 8px radius, min. 20px odstup; natívne prihlásenie aktivované bez zadania prihlasovacích údajov. Bez odoslania finálnej objednávky/platby.
- Desktop 1440: native mouse hover otvorí prázdny aj plný 420px košík; mobilný lock sa neaktivuje.
- Sidebar 1440 na troch rôznych stránkach/kategóriách: aktívna vnorená aj nadradená položka, biely text/šípka na oranžovej aj hover; ostatné položky na svetlých plochách tmavé, native collapse/reopen. Nadpis má rovnaké rozmery/padding/radius ako predchádzajúce preview.
- Súvisiaci tovar: 320/375/390/430/1440, pôvodné quantity/submit viditeľné bez opacity fade, bez horizontálneho overflow. Plus/mínus mení originálny amount; trojitý natívny content event nepridá duplicity. Skutočný AJAX submit pridal správny produkt a zvolené množstvo do izolovaného košíka.

Modely nad native markup/CSS, nejde o finančný prepočet: 72 kombinácií počtov 0/1/8/40, šírok 320/375/390/430/1024/1440 a dvoj-/troj-/štvorciferných cien. Dlhé aj neprerušiteľné názvy, množstvo 9999, zarovnaná cena/delete/množstvo bez overlap. Navyše header `99+` a ceny do `12 345,67 €` pri všetkých štyroch mobilných šírkach: badge/cena/šípka sa neprekrývajú, glyph ostáva 24px a šípka je biela v hraniciach oranžového odkazu, po otvorení otočená o 180°.

Lint/build a diff check prešli. Existujúci rozpočet rc.4 stačí: JS 26 250 B (25,63 KiB) / 30 KiB, CSS 21 315 B (20,82 KiB) / 21 KiB gzip; žiadne navýšenie.

## Upravené súbory

- `src/modules/header-service-bar/header-service-bar.css` — mobilný cart trigger/šípka/badge/cena, odstránenie štýlu doplnkovej vety.
- `src/modules/header-service-bar/index.js` — odstránenie tvorby doplnkového odseku.
- `src/core/texts.js` — odstránený nepoužívaný prefix tohto odseku.
- `src/styles/overrides/header-popups.css` — mobile product grid a delete.
- `src/styles/overrides/cart-presentation.css` — zjednotené informačné riadky, explicitný oranžový truck pri splnenej doprave.
- `src/styles/overrides/checkout.css` — plná šírka a spacing loginu, spoločné stavy, zrušené redundantné wrapper pravidlá.
- `src/styles/overrides/sidebar.css` — iba foreground príslušných sidebar stavov.
- `src/styles/overrides/product-detail.css` — iba odstránenie opacity gate/fade súvisiaceho tovaru.
- `dist/timber.min.css`, `dist/timber.min.js`, obe sourcemapy — build.
- `CHANGELOG.md`, tento report — evidencia v rámci rovnakej rc.4.

## Nevyriešené / limity

- Skutočný iOS Safari ani fyzický Android nebol dostupný; mobilné testy sú Chromium s Android/touch emuláciou. Dvh fallback a safe-area sú implementované, nie potvrdené na fyzickom iPhone.
- Chromium počas prechodu checkoutu zaznamenal `Transition was skipped` bez stacku, pozorované aj pri starších testoch. Samotná navigácia, rozloženie a funkčné testy prešli. Táto hláška prechodov sa týmto zásahom neopravovala.
- Neboli zmenené/nahradené externé Apollo/add-on skripty ani globálny loader. Potvrdená príčina pri súvisiacom tovare je uvedená vyššie; nepreberáme ani nevypíname pack add-on, lazy obrázky alebo globálne čakanie na sťahovanie skriptov. Ďalšie nepozorované sieťové príčiny na iných produktoch nie sú týmto testom vylúčené.
- Bez PageSpeed merania, vytvorenia objednávky, prihlásenia do zákazníckeho účtu a produkčného nasadenia. Referenčné fotografie/video 11.mp4 v texte neboli fyzicky priložené; overenie sa opiera o aktuálny živý DOM.
