# Kompletné zmeny v0.7.0 od v0.6.13

Výsledný implementovaný stav schváleného preview bol povýšený na stabilnú v0.7.0. Safari/WebKit a fyzický iPhone: **WAIVED BY OWNER** (20. 10. 2026). Živé externé varianty: **NOT VERIFIED**. Zdrojová referencia: v0.6.13 (`0c726ffe6986192721a3b62b3743b31c78a01b50`). Aktiváciu na Shoptete vykoná majiteľ manuálne.

## A. Header a navigácia

**Predtým:** funkčná hlavička, vyhľadávanie, prihlásenie, mobilný košík a menu z v0.6.13.

**Zmena:** rozbalené mobilné podkategórie dostali jemný tónovaný podklad. Custom cart count a ďalšie vlastné modré akcenty používajú zjednotený modrý token. Oprava skutočného mobile overflow na detaile sa riešila produktovým layoutom, nie zmenou rozmerov headera.

**Výsledok:** logo, rozmery ikon, vyhľadávanie, prihlásenie a menu funkcie zostávajú. Nejde o nový header. Moduly header-popups/header-service-bar ani ich hlavné CSS sa oproti produkcii funkčne nemenili.

## B. Kategórie

**Predtým:** natívny výpis, existujúci desktopový prepínač mriežka/tabuľka a existujúce podkategórie/sidebar.

**Zmena:** tabuľkový cenový stĺpec sa rozšíril na 150 px pre čitateľnú cenu a jednotku. Zjednotila sa typografia kódu/značky, názov nad kódom, stock zarovnanie a pokojnejší vzhľad prepínača. Produktové karty dostali prezentačné úpravy uvedené v G.

**Výsledok:** existujúce radenie, položky, sidebar a počet stĺpcov sa zachovávajú. Posledná dvojstĺpcová úprava nákupného riadka platí výhradne pre homepage; nemá sa pripisovať kategóriám ani vyhľadávaniu. Nepribudol nový kategóriový systém.

## C. Filtre a radenie

**Predtým:** existujúce kompaktné desktopové dropdowny a mobilný panel filtrov/radenia, s nekonzistentným zatváraním a šípkami.

**Zmena:** spoločné zatvorenie natívnych `open`/`is-active` stavov, ponechanie najviac jedného otvoreného filtra, klik mimo a Escape, zatvorenie pri resize. Klik sa spracuje po natívnej udalosti, aby sa ďalší heading nepohol pod prstom ešte pred mouseup. Otvorenie má jednotnú jemnú aktívnu plochu; aplikovaný filter si ponechá označenie. Šípky používajú jediný glyph a 160 ms rotáciu.

**Výsledok:** cenový mobilný/tabletový pseudo-element používa Apollo 8 px namiesto Roboto a absolútnu pozíciu namiesto účasti v toku textu. Rešpektuje 1.4 line-height do 767 px a 1.1 pri 768–991 px. Desktopový cenový filter zostáva. Dátové filtre, slider, radenie a natívne AJAX aktualizácie sa neprepisovali vlastným vyhľadávaním alebo výpočtami.

## D. Detail produktu

**Predtým:** stabilný Apollo produktový detail bez nového Compact panelu.

**Zmena:** nový prezentačný modul `product-compact` zoskupuje existujúce natívne elementy v pôvodnom formulári. Centrovaný názov a metadata sú mimo rámu, hlavný rám začína variantovou/nákupnou časťou. KÓD a ZNAČKA majú sivé labely, modré hodnoty a jemný oddeľovač. Názov zostáva z feedu, bez vynúteného uppercase a bez delenia bežných slov.

**Výsledok:** centrovaný oranžový nadpis **VŠETKY VARIANTY**, bez bočných čiar v konečnom stave. Obrázkové karty, rozmery, obsah, poradie a natívne prepínanie zostávajú. Aktívny oranžový border dopĺňa zelené potvrdenie; mobilné Zobraziť viac má modrý akcent. Galéria má lepšie oddelenie od pravého panelu, značkové kruhové šípky a opt-in desktopové ťahanie cez existujúce natívne thumbnails. Touch/lightbox/CloudZoom integrácia zostáva.

Samostatný jemný nákupný panel obsahuje vľavo dostupnosť, zelený dátum a funkčný odkaz **Možnosti doručenia**, vpravo centrovanú dominantnú cenu a menšiu parentetickú cenu bez DPH. Label Cena je vizuálne skrytý, zachovaný pre prístupnosť. Pod ním ostáva natívne množstvo a CTA. Informácie/Opýtať sa/Strážiť sú kompaktnejšie usporiadané; kontaktné ikony sú oranžové.

Doručovací popup používa rovnaký formatter názvu/termínu ako existujúci checkout: hierarchia dvoch riadkov, zarovnané logo/cena, prirodzené mobilné zalomenie. Pôvodné cenové a doručovacie výpočty ani prístupnosť pôvodných formulárov neboli nahradené.

## E. Skladová dostupnosť

**Predtým:** natívne dostupnostné texty a množstvá, s rozdielnym vizuálnym rozložením vo výpisoch.

**Zmena:** centrovanie názvu skladu a množstva na klasických kartách; prehľadnejší stock blok na homepage a menší neutrálny počet oproti názvu skladu v tabuľke. Natívny názov CENTRÁLNY SKLAD môže bezpečne zalomiť na dve slová pri úzkom priestore; počet zostáva vlastný riadok. Tabuľka používa 14 px názov a 11,5 px množstvo.

**Výsledok:** zelená/oranžová významová logika a skutočné počty/limity sú zo Shoptetu. Samostatný projekt warehouse-stock, skladový backend, feed ani jeho výpočty sa v tomto rozdiele nemenili. Nevznikla nová skladová synchronizácia.

## F. Homepage

**Predtým:** spoločné karty s cenou a skladom nad nákupným riadkom; desktopové tlačidlo bolo široké, mobile quantity nebolo pôvodne všade dostupné.

**Zmena:** existujúce TOP Produkty, Novinky v ponuke a Výsuvy MERIVOBOX majú natívne údaje v dvoch stĺpcoch: sklad nad množstvom vľavo, cena nad košíkom vpravo. Oba riadky používajú rovnaké osi, 20 px medzeru, maximálnu šírku 268 px a pružný pomer 100 : 148.

**Výsledok:** kompaktnejší nákupný blok so symetrickým odsadením, bielou ikonou napravo od textu, prirodzenou výškou po zalomení a skrytím iba textu CTA na veľmi úzkom bloku. Swiper navigácia, fotografie a počet kariet zostali. Instagram, FAQ, kontakt a ostatné homepage bloky dokončené už vo v0.6.13 nie sú nové zmeny tohto vydania.

## G. Produktové karty

**Predtým:** pôvodné natívne názvy/ceny/jednotky a rozdielne usporiadanie nákupných prvkov.

**Zmena:** názvy v klasickej mriežke sú centrované a zachovávajú feed case aj zalamovanie medzi slovami. Celý hlavný číselný údaj **vrátane €** je kráľovsky modrý, skutočná jednotka neutrálna, bez DPH menšia/sivá a na kartách v zátvorkách. Tabuľka si ponecháva kompaktný net zápis bez kartičkových zátvoriek.

**Výsledok:** stock, ceny a nákupné ovládanie sú prehľadné aj pri dlhých názvoch, vysokých cenách a dvoch mobilných kartách vedľa seba. Qty-picker funguje na homepage, kategórii a vyhľadávaní aj na mobile; zachováva jediný natívny `amount`, krok balenia, min/max a pôvodný submit. Farebnosť množstva je podľa referenčného košíka: 1 px oranžový rám, 7 px radius, neutrálne symboly/tónované tlačidlá a biely stred; výška zostáva podľa komponentu.

Viditeľný kód ležiaci na fotografii má 94 % biely podklad, 2 × 4 px padding a 5 px radius. Label je sivý, číslo modré. Detail a tabuľkový kód bez obrazového pozadia zostávajú čisté. NOVINKA používa slivkovú farbu, KOMPLET existujúcu oranžovú. Obrázky a ich pomer strán sa nemenili.

## H. Košík a objednávkový proces

**Predtým:** funkčný mini/hlavný košík, native quantity handlers a existujúci checkout/doprava.

**Zmena:** množstevný prezentačný základ sa vyčlenil do zdieľaného súboru pri zachovaní funkčnosti košíkov a viditeľných pôvodných symbolov. Custom modré akcenty sú zjednotené. Popup po pridaní získal centrovaný názov, vyvážené CTA, neutrálnu dopravnú plochu, tenký pôvodný progress a zarovnané odporúčania.

**Výsledok:** main/mini quantities a ich natívne AJAX/limity/počty zostávajú. Existujúci zelený success bar používa doterajšiu zelenú. Logika objednávky, platobné metódy, validácia checkoutu a prepočet dopravy sa nemenili; nemožno ich uviesť ako novo implementovaný checkout. Úprava názvov dopravy sa týka detailového popupu, nie novej dopravy/platby.

Známe existujúce správanie: Shoptet niekedy po úspešnom pridaní vráti `GetExtendedOrder payload.content:false`; popup sa vtedy natívne neotvorí. Reprodukované aj pred poslednými popup úpravami. Odpoveď sa nenahrádza falošným obsahom a toto správanie sa neprezentuje ako opravené.

## I. Súvisiace a podobné produkty

**Predtým:** natívne karty s odlišnými cenami/ovládačmi; niektoré šablóny neposkytovali jednotku a popup mal iba skrytý amount.

**Zmena:** spoločné ceny/jednotky/net zátvorky, neutral quantity štýl, kompaktnejší nákupný riadok a oranžový ikonový košík. Medzi sekciami je jemný oddeľovač. Desktopový popup používa prehľadnú mriežku; mobilné bloky prirodzene menia riadky.

**Výsledok:** pôvodné natívne quantity handlery sú zachované; existujúci qty-picker sa použije iba tam, kde natívny ovládač chýba. Chýbajúca jednotka pochádza z presného verejného produktového dokumentu s overením `priceId` alebo presného SKU, s cache na URL. Nevymýšľa sa `/ks` zo skladu ani nevykonávajú načítané skripty. Pri nesúhlase/nedostupnom zdroji sa jednotka negeneruje. Pôvodné ceny, stock a natívny nákupný formulár zostávajú.

## J. Farebný systém

**Predtým:** základná firemná oranžová a zelená už existovali, vlastné modré akcenty sa líšili a NOVINKA bola modrá.

**Zmena a výsledok:**

- Oranžová **#D4884A**: hlavné CTA, variantové orámovanie/nadpis a značkové ikony; hover zachováva existujúci systém.
- Vlastná kráľovská modrá **#2454A6**: cena vrátane €, SKU, značka a technické odkazy/custom count akcenty.
- Zelená **#00C853**: existujúci pozitívny/success systém, dostupnosť, zelený dátum a potvrdenie variantu.
- NOVINKA **#7B3F68**: samostatná teplá slivková, odlíšená od ceny, CTA a skladu.
- Qty frame **#C97A2B**, oba symboly **#423E3E**, pozadie tlačidiel **#F5F0E9**, stred biely — konečný stav podľa mini/hlavného košíka, nie skorší experiment s červeným mínusom.

Farby dopravcov, sociálnych sietí, chýb a natívne významové rozlíšenia sa nehromadne prefarbovali. Predtým zavedená zelená ani základná oranžová sa nevydávajú za novo vytvorenú paletu.

## K. Technické zmeny

**Predtým:** stabilný frontend v0.6.13 s existujúcimi natívnymi integráciami.

**Zmena:** registrácia `product-compact`; idempotentné prezentačné wrappery s kontrolou pôvodného formulára; rozšírenie existujúceho text-cleanup observera pre metadata, číselnú cenu/€ a net zátvorky. Core drží Shoptet selektory/texty/eventy. Colorbox sa premeriava po natívnej complete udalosti; ochrany bránia stale popupu alebo duplicitnej inicializácii. Verejné zdroje jednotiek sa cachujú a spracúvajú odložene po načítaní.

Native gallery integrácia pridala opt-in mouse drag; ostatné swipe moduly si ponechávajú touch/pen správanie. Price/filter riešenia rešpektujú AJAX výmenu DOM. CSS odstránilo konfliktný uppercase/emergency word breaking a zdieľa quantity základ bez maskovania product overflow pomocou `body overflow-x:hidden`.

**Výsledok:** nové rozloženie je obmedzené na príslušné komponenty, bez skladového backendu, serverových zásahov a nových runtime knižníc. Stabilná v0.7.0 zachováva limity **32 / 26,75 KiB** bez navýšenia; presné výsledky buildu sú v hlavnom release reporte. `target: safari14` v esbuild nie je test kompatibility. Safari/WebKit aj fyzický iPhone: **WAIVED BY OWNER**.
