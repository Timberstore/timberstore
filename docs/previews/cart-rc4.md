# Preview 0.6.11-rc.4 — mobilný košík a doprava

15. 10. 2026. Vetva `preview/mobile-shipping-layout-20261015`, základ `8503ada9c320befb1a8377a49aa18eda77b5de2d` (rc.3). Samostatný commit na preview vetve, bez merge, release tagu, zmeny produkčného loadera alebo zásahu do adminu. Produkcia ostáva v0.6.9. Staršie preview sú vratné cez svoje nemenné SHA.

## Príčina a oprava mobilného náhľadu

Na živom Apollo DOM bol popup už fixed, ale pozadie zostávalo scrollovateľné. Vlastné flex rozdelenie na titulok, scrollovateľné produkty a footer platilo iba pre desktop. Nevhodná kombinácia vnoreného overflow a nezamknutého dokumentu umožňovala posúvať stránku za otvoreným panelom. Back-to-top zostával viditeľný nad jeho spodnou časťou.

Rodičia natívneho popupu nemajú transform/containing block vyžadujúci portal. Popup zostáva na svojom mieste v DOM. Na mobile sa ukotví pod skutočný spodný okraj viditeľnej hlavičky, vypočítaný pri otvorení/resize. `100dvh` má `100vh` fallback, footer zohľadňuje `safe-area-inset-bottom`.

Pri otvorení sa uloží pôvodná x/y pozícia. Pomocná trieda na html zamkne dokument a body dostane fixed polohu s pôvodným záporným scroll offsetom cez CSS premennú. Zatvorenie odstráni triedu, obnoví pôvodnú premennú a pozíciu bez smooth animácie/timera. Rovnaké uvoľnenie platí pri prechode na desktop a pagehide. Nie sú prepisované pôvodné inline body štýly.

Titulok a footer sú stabilné flex časti; scrolluje iba pôvodná `.popup-widget-inner` s produktmi, s `min-height:0` a overscroll containment. Vnorené zoznamy nevytvárajú druhú scrollovaciu oblasť. Native popup API naďalej vlastní otvorenie/zatvorenie a jeho stav. Pridané je jediné prístupne pomenované tlačidlo zavretia, pretože v overenom natívnom mobilnom paneli chýbalo. Pri prázdnom košíku sa idempotentne doplní iba chýbajúci titulok. Pôvodné produkty, formuláre, quantity/remove event listenery a AJAX nie sú klonované ani nahradené. MutationObserver reaguje aj na výmenu obsahu; žiadne produkčné časové oneskorenie.

Mobilný hlavný odkaz košíka otvára preview cez existujúce Apollo API. Touchend a následný click sa nesmú prepnúť dvakrát. Desktopová navigácia/hover a modifikované kliky zostávajú zachované. Back-to-top je skrytý výlučne pri otvorenom mobilnom náhľade.

## SPOLU, doprava a progress

SPOLU má padding 8px 16px a jemnú hornú deliacu linku. Doprava a CTA majú rovnaký 16px horizontálny inset, desktopová šírka 420px a pôvodná výška/max-height ostávajú. Tučná naformátovaná celková cena je stále prebraná z pôvodného Shoptet header súčtu; nepribudol nový cenový výpočet.

Zistili sa dve prezentačné chyby natívneho Apollo spracovania dopravy:

- Textová detekcia `changeHeaderBasketFreeDelivery()` pozná slovenský prefix „Objednajte“, ale nie serverový „Nakúpte“. Môže označiť ešte nesplnenú dopravu ako splnenú.
- Po AJAX môže nový shipping text zostať v novom zozname a starý text vo footer časti. Uprednostní sa pôvodný nový serverový shipping uzol, presunie sa celý do existujúceho footeru a odstránia sa len zastarané neinteraktívne shipping textové bloky.

Prezentácia preto číta `cartInfo.leftToFreeShipping.priceLeft`, serverový `formattedPrice` a `freeShippingFrom`. Bez pevnej sumy a bez parsovania názvov/textov na určenie nároku. Zo serverového zostatku a limitu sa odvodí iba percento progressu (0–100); ceny, dane, zľavy, doprava ani nárok sa neprepočítavajú. Pri neplatných/chýbajúcich údajoch sa vlastná synchronizácia nepoužije.

Pôvodný textový div s truck pseudoikonou zostáva zachovaný, upravia sa iba jeho text/strong/br uzly. Splnený text je „Dopravu máte **zadarmo!**“. Prefix tmavý, zadarmo! Emerald bold; pred splnením aj serverová zostávajúca suma Emerald bold. Bar je oranžový pred splnením, Emerald po splnení, truck zostáva oranžový v oboch stavoch. Synchronizácia je idempotentná a prebehne pri ShoptetCartUpdated aj mutácii obsahu, bez čakania na animation frame.

## Ďalšie lokálne úpravy

- Mobilný dátum doručenia: pôvodný dynamický dátumový uzol bez zmeny, Emerald. Text doprava, pôvodná ikona vľavo na rovnakej osi ako shipping truck. Oba mobilné riadky majú rovnakú plnú vnútornú šírku, aby sa os nemenila podľa dĺžky shipping textu. Desktopová geometria dátumu bez zmeny.
- Mobilný header cart: rovnaké existujúce desktopové tokeny — biely glyph na accent `#d4884a`, hover/active/otvorenie controls-active `#c97a2b`. Veľkosť, geometria, počet produktov a natívna cena zachované; ostatné ikony bez zásahu.
- Mobilné menu: spoločné nulové vertikálne margin/padding troch kontaktných položiek, zachovaný flex gap 10px a centrovanie; sociálne siete navyše 4px. Pôvodné kontakty, odkazy, ikony a indikátor hodín zachované.
- Oranžová/bežové pozadia/success background a súbor `tokens.css` sú bez zmeny oproti rc.3. Checkout kontakty, biele CTA a tvar prihlásenia z rc.3 sa nemenia.

## Súbory

- `src/modules/header-service-bar/mobile-cart.js` — zámok/obnova scrollu, ukotvenie, jediný close a chýbajúci titulok.
- `src/modules/header-service-bar/index.js` — mobilné otvorenie cez native API, sync pri zmene popupu/viewportu a životnom cykle stránky.
- `src/modules/header-service-bar/header-service-bar.css` — mobilné farby košíka a medzery menu.
- `src/modules/cart-presentation/popup-shipping.js` — idempotentná synchronizácia natívnej shipping prezentácie po AJAX.
- `src/modules/cart-presentation/index.js` — zapojenie synchronizácie do existujúceho observera a eventu.
- `src/core/cart.js`, `selectors.js`, `texts.js` — serverové shipping údaje, natívne selektory a UI texty na jednom mieste.
- `src/styles/overrides/header-popups.css` — mobilná scroll/flex geometria, back-to-top, footer inset/linka a shipping stavy.
- `src/styles/overrides/cart-presentation.css` — iba mobilné zarovnanie dátumu a shipping ikony/textu.
- `package.json`, `package-lock.json`, `scripts/build.mjs` — samostatná rc.4, len jej CSS budget 21 KiB podľa trvalého súhlasu klienta.
- `dist/timber.min.{js,css}` a sourcemapy — zostavené artefakty; `CHANGELOG.md`, `CONTRIBUTING.md`, tento report — dokumentácia.

## Overenie a limity

Živý Shoptet/Apollo s lokálnym nahradením iba Timber JS/CSS v izolovanom Chromium kontexte:

- 320/375/390/430 px: otvorenie hore/uprostred/dole dlhej kategórie, stabilná hlavička/footer, vnútorný scroll bez scrollu pozadia, návrat na pôvodnú pozíciu, opakované otvorenie/zatvorenie, bez horizontálneho overflow a bez prekrývajúceho back-to-top.
- Štyri reálne pridania produktu, natívne množstvá opakovane nad/pod serverový limit (oba smery dvakrát), natívne odstránenie produktu. V každom stave jedna shipping správa, správna farba baru/strong/truck, súčet zhodný s natívnym header súčtom a zachovaný zámok pozadia. HTTP 200 pre sledované košíkové AJAX požiadavky. Žiadna objednávka ani platba sa neodoslala.
- Doplňujúca živá kontrola: skutočný emulovaný dotyk otvorí panel raz bez navigácie; otvorený panel sa prispôsobí výškam 600/900/800 px. Pri 320/375/390/430 je rovnaká os oboch ikon a bez overflow, pôvodný dátum ostáva Emerald. Menu má zmerané medzery 10px a pôvodné tel:/mailto:. Natívne odstránenie posledného produktu a opätovné otvorenie prázdneho košíka majú jeden titulok a jedno tlačidlo zavretia.
- Doplňujúci AJAX test odstránil produkt s množstvom nad limitom: zostávajúce produkty sa vrátili pod hranicu, správu nahradila aktuálna zostávajúca suma a bar bol opäť oranžový.
- Desktop 1440 px: natívny panel 420px, bez mobilného zámku, 16px inset SPOLU. Samostatné načítanie na desktope a skutočný emulovaný pohyb myši otvorili prázdny aj plný native hover košík.
- Modelový test v skutočnom Apollo markupe/CSS: **72 kombinácií** šírok 320/375/390/430/1024/1440, počtov 0/1/8/40 a súm 99,90/202,90/1234,56 €. Pôvodná suma zachovaná, fixný footer a scroll pri dlhom zozname, bez presahu. Väčšie počty a štvorciferné sumy sú modelové, nie skutočný finančný výpočet.

Lint a build prešli. JS približne 25,73 / 30 KiB, CSS 20,60 / 21 KiB gzip; staršie rozpočty nezmenené.

Skutočný iOS Safari ani fyzický Android nebol dostupný; mobil je Chromium s Android/touch emuláciou. Bez merania PageSpeed, bez odoslania objednávky/platby a bez produkčného nasadenia. Fotografie a video 11.mp4 uvedené v texte neboli k tejto správe fyzicky priložené; geometria bola overená na aktuálnom živom DOM, nie porovnaním s chýbajúcimi prílohami. Finálna akceptácia na reálnom iPhone zostáva pred produkčným nasadením potrebná.
