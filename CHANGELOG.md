# Changelog

Formát: verze · datum · karty · co se změnilo · PageSpeed mobil před/po.

## v0.6.1 · 2026-10-08 · Popup / cart visual consistency preview

- Mobilný „Súvisiaci tovar: počet (od cena)“ je v samostatnom riadku cez celý cart grid, bez nesprávneho zalamovania do úzkej automatickej bunky. Podporené oba natívne Apollo DOM varianty; related toggle a native add-to-cart zostávajú funkčné.
- Account ikona má jemný oranžový hover a jasnejší oranžový otvorený stav s napojením na popup. Login vstupy, fokus, sekundárna registrácia a zabudnuté heslo používajú bielu/teplú neutrálnu/Timber paletu; primárne oranžové prihlásenie a originál formulár/odkazy zachované.
- Mini-cart footer má stabilné poradie doprava → SPOLU → CTA. Súčet je kompaktný riadok s jemnými deliacimi čiarami, shipping text má 13 px a väčší odstup truck ikony. Hodnota SPOLU stále používa presnú natívnu header cenu, bez vlastného prepočtu/requestu.
- Cart trigger používa grid pre ikonu/badge, cenu a šípku; počet číslic rozširuje prvý cell a drží cenu oddelene. Orange otvorený/zatvorený trigger, 50 px výška a jedna Apollo šípka zachované. Odstránené redundantné legacy desktop cart pravidlá.
- Plus/minus v košíku sú pokojnejšie: tmavé symboly a teplý neutrálny povrch, pôvodná geometria, click target, jemný obvod a native AJAX zostávajú. Quantity success toast má teplý povrch, tmavý text a oranžový akcent; označuje sa iba pôvodná správa o zmene množstva. Role alert, text a auto-dismiss sa nemenia; ostatné notices/error ostávajú native.
- Natívne popup/cart CSS presunuté do `styles/overrides/` namiesto ďalšej vrstvy. Bez zásahu do produktových gridov/detailových related kariet, filtrov, footeru, neskorších checkout krokov alebo menu logiky.
- Chromium: desktop 1440/1280/1024/768 px; mobil 430/390/375 px, related toggle/add, quantity AJAX a súčet, account/login, success notice, skutočná doprava zadarmo, dlhý mini-cart a badge fixtures s 1–4 číslicami. Natívna minimálna objednávka 5 € je zachovaná. Lint/build prešli pri pôvodnom 30/15 kB gzip rozpočte. Podrobný report a limity: `docs/previews/v0.6.1.md`.
- Iba izolované preview nad 0.6.0. Main/produkčný loader, merge, tag a release bez zmeny.

## v0.6.0 · 2026-10-07 · Header / cart refinement preview

- Servisný pás má stabilnú výšku 36 px už na natívnom markupe pred JS inicializáciou, bez stránkových offsetov. Rozostupy informačných odkazov zväčšené na 20 px; pôvodné texty, href, bodky a overflow menu zostávajú.
- Header košík ostáva oranžový aj otvorený; jedna natívna šípka označuje stav. Zelený count badge s tmavým textom a jemným bielym okrajom, výraznejšia 17 px cena, väčší odstup od ikony. Zachovaný oranžový keyboard focus a native desktop toggle z 0.5.9 namiesto presmerovania.
- Mini-cart má 420 px šírku a max. 600 px / dostupný viewport. Samostatný vnútorný scroll zoznamu, dostupný footer a CTA. CSS grid nad pôvodným Apollo markupom: obrázok/názov, potom kompaktnejšie quantity + výrazná cena + červená delete akcia. Natívne formy, množstevné limity, AJAX a ceny sa nemenia.
- Nový izolovaný idempotentný modul `cart-presentation` synchronizuje „Celkom za tovar“ z natívnej header ceny do footeru, aj po AJAX; žiadne nové requesty alebo vlastné prepočty. Prázdny košík súčet skryje. Doprava zadarmo je kompaktnejšia s väčším odstupom truck ikony; pôvodná CTA zachovaná.
- Mobilná skutočná cart stránka `.in-kosik #cart-wrapper` pod 768 px má jednotnú štruktúru obrázok/názov/dostupnosť a quantity/cena/remove, 44 px dotykové plochy, zachované jednotky a čitateľný natívny súčet s neutrálnym shellom. Podporené oba natívne DOM varianty aj po zúžení už načítanej desktop stránky košíka. Ďalšie checkout kroky ani desktop cart stránka sa nemenia.
- Cart/account ukotvenie a povolený native scroll-close fallback z 0.5.9 zachované. Menu/submenu kontinuita, search, mobilný header a návrat medzi breakpointmi overené bez zmeny logiky.
- Chromium: všetkých sedem desktop šírok 768–1920 px, mobil 375/390/430 px, osem produktov a vnútorný scroll, AJAX quantity/delete/súčet, CTA, account a stabilita pásu na siedmich typoch stránok. Lint/build prešli v gzip rozpočtoch. Podrobnosti a limity: `docs/previews/v0.6.0.md`.
- Iba preview, bez merge/tag/release. Main a produkčný loader sa nemenia; produkty, filtre, sidebar, footer a ďalší checkout bez zásahu.

## v0.5.9 · 2026-10-07 · Desktop header popup fixes preview

- Izolovaná oprava/refinement preview 0.5.8. Informačné odkazy servisnej lišty majú horizontálny padding 16 px namiesto 8 px, väčšie rozostupy okolo pôvodných bodiek, bez zmeny textov/href, výšky 36 px alebo zarovnania kontajnerov. Apollo overflow helper zostáva natívny.
- Počet položiek v header košíku používa existujúci Apollo zelený odtieň #66BF3A a tmavý text #20242A (kontrast 6,74 : 1). Kompaktný badge zachováva rovnaký vzhľad v otvorenom aj zatvorenom stave.
- Odstránený default modrý cart outline; klávesnicový fokus má jemný Timber oranžový tieň. Otvorený cart/account trigger má biely povrch, zladený jemný border a rovné spodné rohy napojené na pôvodný popup.
- Desktopový cart trigger, jeho suma, badge a pôvodná šípka prepínajú mini-cart cez overené `shoptet.popups.showPopupWindow`, namiesto navigácie alebo Apollo hovered prvého kliku. Presmerovanie ostáva iba na natívnom CTA „Pokračovať do košíka“. Enter/Space/ArrowDown a tabletový touch toggle podporované; mobilné redirect/role atribúty sa obnovujú pri návrate pod 768 px.
- Popupy majú jedného scoped vlastníka štýlov, fixed súradnice podľa skutočného triggera a obmedzenie podľa viewportu. Pri začiatku scrollovania dokumentu sa cart/login zatvoria cez natívne API (povolený fallback pre animovanú Apollo sticky hlavičku); po opätovnom otvorení sa znovu ukotvia. Žiadne samostatné plávajúce panely.
- Mini-cart používa pôvodné názvy, obrázky, ceny, množstvá a mazacie formuláre. Jednotnejšia typografia, jemné riadky a kompaktné ovládanie; spodná shipping časť má menej whitespace, 3 px jemný progress pás, menší text a zreteľné oranžové CTA. Login form, registrácia a zabudnuté heslo zostávajú pôvodné.
- Custom listenery a observéry sa pri AJAX nenásobia. Žiadna zmena cart business logiky, produktov, filtrov, sidebaru, homepage, footeru, search alebo menu logiky. Objednávkové stránky bez natívneho mini-cartu ostávajú bez nového ovládania.
- Chromium: 1920 / 1600 / 1440 / 1366 / 1280 / 1024 / 768 px; hover, opakovaný click, chevron/badge/amount, keyboard, scroll-close/reopen, account fields/buttons, AJAX quantity a delete, vnútorné CTA. Tablet touch 768 px, mobile 375/430 px a desktop ↔ mobil restoration prešli. Menu/submenu kontinuita overená na 1024/1280/1440/1920 px, search suggestions rovnaké ako 0.5.8. Lint/build prešli. Reálny Safari a prihlásený zákazník neboli testovaní; PageSpeed sa nemeral.
- Preview vyžaduje schválenie. Main a produkčný loader sa nemenia; bez merge, tagu a release.

## v0.5.8 · 2026-10-07 · Header refinement preview

- Refinement preview 0.5.7 iba v hlavičke: zachovaná trojpásová štruktúra, pôvodné informačné odkazy, oranžová navigácia a natívna Apollo logika.
- Servisná lišta zostáva vysoká 36 px; písmo 13 px a ikony 18 px zlepšujú čitateľnosť. Hodiny, telefón a e-mail používajú váhu 600, ľavé odkazy zostávajú ľahšie.
- Hodinovú ikonu nahrádza bodka: zelená PO–PIA od 08:00 vrátane do 16:00 výhradne, inak Timber oranžová. Výpočet používa Europe/Bratislava vrátane letného/zimného času; jeden časovač aktualizuje stav každých 30 sekúnd a po návrate do tabu. Text hodín zostáva bez zmeny; stav má aj textový prístupný popis. Sviatky nemajú samostatný kalendár.
- E-mailový text je na desktope mimo odkazu; klikateľná je iba natívna ikona, smerujúca na existujúci kontaktný formulár `/kontakty`. URL bola overená v natívnom contact-boxe aj na cieľovej stránke. Pod 768 px sa obnoví pôvodná Apollo mailto štruktúra.
- Desktop search je vycentrovaný v pôvodnom strednom priestore, s maximom 500 px a šírkou 70 % od 1200 px: približne −33,5 % na 1280 px a −34,2 % na 1440 px oproti 0.5.7. Tablet si ponecháva dostupnú šírku; natívny formulár a AJAX návrhy sú zachované.
- Account trigger má čistý 50 × 50 px neutrálny povrch, radius 8 px, výšku a vertikálne zarovnanie s košíkom, jemný otvorený stav a viditeľný klávesnicový fokus. Pôvodný login popup a jeho merané ukotvenie sa nemenia.
- Natívny count badge v hlavičke má biele pozadie a tmavý text. Odstránené staré skrývanie cart šípky; jedna pôvodná Apollo pseudo-šípka reaguje na `cart-window-visible` / `aria-expanded`, s rešpektovaním reduced-motion. Bez nového cart handlera alebo zmeny cart logiky.
- Overenie v Chromium na 375 / 430 / 768 / 1024 / 1280 / 1440 / 1920 px: mobile porovnanie s 0.5.7, email DOM pri prechode desktop ↔ mobil, login / Escape / ukotvenie, AJAX idempotencia, rovnaké reálne search suggestions, natívne menu, anonymné pridanie produktu a trvalý stav košíka po načítaní stránky, count badge, otvorená/zatvorená šípka a sticky popup. Štrnásť časových prípadov overilo hranice otváracích hodín, víkendy a DST aj pri systémovom časovom pásme America/New_York. Lint/build prešli a gzip rozpočty sú splnené.
- Preview je izolované na samostatnej vetve. Main, produkčný loader, produkty, filtre, sidebar a obsah homepage sa nemenia. Bez merge, tagu a release; PageSpeed ani reálny iOS Safari sa nemerali.

## v0.5.7 · 2026-10-07 · Header / service bar preview

- Izolované preview zo schváleného buildu 0.5.6: tri pásy hlavičky — teplá neutrálna servisná lišta #F4F1ED s výškou 36 px, biely hlavný riadok a existujúca oranžová kategóriová navigácia. Natívne kontajnery majú spoločné horizontálne zarovnanie.
- Pôvodné informačné odkazy a ich href zostávajú zachované, vrátane natívneho Apollo overflow menu. Telefón a e-mail už nemajú samostatný sivý box. Pridané otváracie hodiny PO – PIA: 08:00 – 16:00 a drobné oranžové ikony; sociálne odkazy sa preberajú z existujúcej pätičky, bez odhadovaných URL alebo externej knižnice.
- Hlavný riadok má kompaktnú výšku 90 px, pôvodné logo, dominantné natívne vyhľadávanie a účet iba s ikonou. Prihlasovacie tlačidlo si zachováva prístupný názov aj Apollo ovládanie. Košík, suma, počet položiek, formuláre a menu handlery sa nemenia.
- Nahradené konfliktné legacy rozmery loga, padding hlavičky a pevné popup offsety. Pôvodné prihlasovacie a košíkové popupy sa zarovnávajú podľa skutočných ovládacích prvkov aj pri resize, sticky hlavičke a opakovanej AJAX inicializácii; listenery sa nenásobia.
- Od 768 px platí desktopová/tabletová úprava. Pod 1200 px sú otváracie hodiny skryté pre dostatok miesta; pod 768 px zostáva natívna mobilná hlavička a nové sociálne odkazy/hodiny sú skryté. Bez zásahu do produktov, filtrov, sidebaru, detailu alebo obsahu homepage.
- Overenie v Chromium: 375 / 430 px mobil, 768 / 1024 / 1280 / 1366 / 1440 / 1600 / 1920 px desktop/tablet, resize, native search suggestions, anonymné pridanie do košíka, prihlasovací popup / Escape / fokus, sticky hlavička a opakovaná inicializácia. Porovnanie natívneho mobilného layoutu a kategóriového menu s 0.5.6. Reálny Safari, prihlásený účet a Shoptet administrácia neboli testované; PageSpeed nebol meraný.
- Preview vyžaduje schválenie pred merge/tagom/release. Produkčný main a loader zostávajú bez zmeny.

## v0.5.6 · 2026-10-07 · Production frontend audit fixes

- Položka VIAC v desktopovej navigácii má rovnakú veľkosť textu, vertikálne zarovnanie a jednu spoločnú šípku ako kategórie. Natívne Apollo presúvanie položiek pri zmene šírky zostáva zachované.
- Oranžový pás hlavičky je zarovnaný so sliderom: odstránený legacy posun −10 px a viewportová šírka; používa skutočnú šírku hlavičky bez scrollbar gutteru.
- Informačný oznam má nižšiu prioritu než natívne cookies a dialógy; neblokuje nastavenia cookies.
- Pôvodný Apollo krížik oznamu má prístupný názov, fokus a ovládanie Enter / Space cez existujúcu zatváraciu logiku. Inicializácia je idempotentná aj po AJAX.
- Odstránený horizontálny presah desktopovej homepage neutralizovaním páru záporných marginov a kompenzačného paddingu sekcie welcome.
- Cena bez DPH v produktových kartách má tmavší sekundárny text pre dostatočný kontrast na bielom pozadí, bez zmeny rozloženia.
- Nadpisy H1 a zahodené preview úpravy produktových kariet nie sú súčasťou zmeny. PageSpeed nebol meraný.
- Overenie v Chromium: cookies na 320 / 375 / 390 / 414 / 768 / 1024 / 1440 / 1920 px, odmietnutie aj súhlas, zatvorenie oznamu myšou a klávesnicou, opakovaná AJAX inicializácia; geometria homepage a kariet oproti mainu bez zmeny. Kontrast ceny bez DPH na bielom pozadí 4,82 : 1. Mobilný filter/reset, desktopové GRID/LIST, natívne radenie s AJAX a mobilná galéria prešli.
- Navigácia VIAC, geometria šípky, zarovnanie oranžového pásu a natívne otváranie/zatváranie overené na 768 / 992 / 1024 / 1200 / 1280 / 1366 / 1440 / 1600 / 1920 px vrátane opakovaného resize a sticky hlavičky. Mobilná navigácia na 320 / 375 / 414 px zostala bez zmeny.
- Schválené preview `b6d0b1f98c2b54821bfbdc896f47a1142e8f5379` pripravené ako build 0.5.6 na samostatnej vetve. Produkčný merge, tag a nasadenie sa vykonajú v samostatnom kroku.

## v0.5.5 · 2026-10-06 · Mobile category controls

- **Mobilné ovládanie** · Samostatný modul `mobile-category-controls` iba pod Apollo breakpointom 768 px. Dva rovnocenné horné buttony FILTROVAŤ / aktuálne RADENIE; dropdown piatich možností nahrádza pôvodné sorting chipy. Pôvodné Shoptet/Apollo sorting tlačidlá a ich natívna AJAX logika zostávajú zdrojom pravdy.
- **Filter popup / overlay** · Celý existujúci `#filters` sa presúva bez klonovania checkboxov, formulárov alebo slidera do spoločnej oblasti pod toolbarom. Naraz je otvorený iba filter alebo radenie. Absolute overlay neposúva produkty ani nemení výšku dokumentu; pôvodný wrapper nezaberá miesto. Dlhý obsah scrolluje vo vnútri panela a zatvorené accordiony nevytvárajú prázdny scrollovací priestor.
- **Timber Store vzhľad** · Zjednotené fonty, rozmery buttonov, biele panely, jemné Timber bordery, radius 12 px a tieň. Odstránené čierne active/focus/hover stavy radenia a konfliktné telefónne legacy štýly. Tmavý text, Timber oranžová a jemné aktívne pozadia; Cena, Dostupnosť, Značky a parametre majú rovnakú geometriu. Zachovaná jedna natívna Apollo šípka `h4::after` a natívny stav `is-active`; otvorenie sa neodvodzuje od focusu.
- **Dlhé zoznamy** · Prvých 10 hodnôt a ovládanie Zobraziť viac / Zobraziť menej. Vybrané hodnoty zostávajú viditeľné aj mimo prvých desiatich; rozbalenie sa zachováva po AJAX prekreslení.
- **Počty produktov** · Celkový počet pod toolbarom je centrovaná sekundárna informácia. Počty pri jednotlivých hodnotách sú vpravo v jednom stĺpci, bez zátvoriek a bez „ks“. Jemný neutrálny count badge má min. 32 × 23 px, radius 5 px, centrovaný sivý text a pozadie #FAF8F5; väčšie čísla ho prirodzene rozšíria.
- **Reset filtrov** · ZRUŠIŤ VŠETKY FILTRE používa pôvodný Shoptet reset odkaz a jeho natívnu AJAX akciu. Zruší cenu, dostupnosť, značky a parametre naraz, obnoví výpis a zachová aktuálne radenie. Sekundárna spodná lišta zostáva dostupná mimo scrollujúceho obsahu a zobrazuje sa iba pri aktívnych filtroch; reset synchronizuje UI a zatvorí popup.
- **Responzivita / iPhone SE** · Overené šírky 320 / 375 / 390 / 414 px v Chromium mobilnej emulácii, vrátane viewportu 320 × 568. Dlhé „Najpredávanejšie“ používa ellipsis a neprekrýva šípku; popup nepretečie vodorovne. Badge overené pre 1–4 číslice. Reálny iOS Safari nebol v cloud prostredí testovaný.
- **AJAX / accessibility** · Idempotentná inicializácia po filtrovaní, radení a načítaní ďalších produktov, bez násobenia listenerov. Zachované natívne Apollo accordiony, doplnené ARIA stavy, klávesnicové ovládanie, Escape a zatvorenie klikom mimo popupu.
- **Desktop bez regresie** · Mobilné štýly sú obmedzené pod 768 px; desktopové a tabletové pravidlá zostávajú zachované. Pri návrate na desktop sa obnoví pôvodné umiestnenie natívnych DOM uzlov, reset odkaz aj Apollo handlery. Porovnania na 768 / 992 / 1200 / 1440 px a opakované prechody desktop ↔ mobil prešli.
- **Overenie / schválenie** · Natívne radenie, Cena, Dostupnosť, Značky, Farba, Rozteč úchytiek, dlhé zoznamy, vybrané hodnoty, AJAX reset aj nemenný scrollHeight overené na živom Apollo DOM. Finálne preview `eb92414179bdf447120e44e596ed0bc786fa48a8` schválené používateľom. Lint a build prešli; gzip rozpočty JS ≤ 30 kB / CSS ≤ 15 kB splnené. Nové PageSpeed meranie sa nevykonávalo.

## v0.5.4 · 2026-10-06 · Mobile category bestsellers
- **Mobil / tablet** · Natívny blok „Najpredávanejšie“ je pod 1200 px úplne skrytý, takže sa už nezobrazuje v hlavnom obsahu kategórie.
- **Desktop** · Bez zmeny; kategóriové bestsellery zostávajú v ľavom sidebare od 1200 px vyššie.
- **Apollo** · Oprava je čisto CSS a rešpektuje breakpoint šablóny bez zásahu do DOM alebo produktového výpisu.

## v0.5.3 · 2026-10-06 · Category heading
- **Nadpis kategórie** · Bočné deliace čiary sa rozťahujú na celú dostupnú šírku hlavného obsahu; názov zostáva presne vycentrovaný.
- **Apollo** · Bez zmeny DOM a bez zásahu do šírky obsahového stĺpca.

## v0.5.2 · 2026-10-06 · Category UI
- **Podkategórie / Apollo** · Doplnený rovnomerný horizontálny aj vertikálny odstup medzi kartami bez zmeny natívnych stĺpcov Apolla; karty sa už rámikmi nedotýkajú.
- **Karty podkategórií** · Jemný stále viditeľný rámik, zachovaný hover, radius a tieň.
- **Mobil** · Menší horizontálny gutter, aby sa nezúžili karty viac než je nutné.

## v0.5.1 · rozpracované
- **Category UI** · H1 kategórie centrovaný s jemnými čiarami po stranách.
- **Podkategórie** · väčší rozostup medzi riadkami, biele karty s radiusom a jemným tieňom; hover zvýraznenie na desktope bez zásahu do Apollo rozloženia.
- **Mobil/tablet** · zachované Apollo rozloženie; kategóriové bestsellery ostávajú skryté pod 1200 px.
- **HEAD loader** · čistejší zápis bez ternárneho `document.cookie` warningu v Shoptet editore; `PROD` je opäť čitateľná verzia `v0.5.0`.

## v0.5.0 · 2026-10-05 · GitHub migration
- Dokončená migrace Timber custom kódu do GitHubu.
- Produkční Shoptet používá GitHub bundle; staré FTP soubory zůstávají pouze jako záloha a nejsou načítané.
- Záloha původního produkčního stavu je zachována ve větvi `backup/pre-cutover-v0.4.2-2026-10-05` a v `shoptet/backup/2026-10-05/`.
- **CI / migrace** · Automatické build notifikace pro každé dílčí uložení byly vypnuty; migrační workflow je nově pouze ruční. Tím se omezí zbytečné GitHub e-maily a build se spustí až při kontrolním bodu.
- **Footer platby** · Inline skript pro Visa / Mastercard / Google Pay / Apple Pay převeden do idempotentního modulu `footer-payments`. Starý inline skript zatím zůstává aktivní; oba výstupy jsou vizuálně stejné, takže produkce se nemění.
- **Migrace `timber-custom.css`** · Aktuální v175 je nyní jako přesná legacy kopie uvnitř GitHub bundle (`src/legacy/timber-custom-v175.css`). V preview se zatím načte společně se starým FTP souborem, takže lze ověřit beze změny produkce; odstranění FTP include přijde až po kontrole.
- **Migrace `timber-menu.js`** · Původní monolitický skript rozdělen do čtyř idempotentních modulů: klikací karty horního menu, aktivní cesta sidebaru, čištění produktových textů a kompaktní desktopový filtr. Preview dočasně blokuje starý `timber-menu.js`, aby neběžela stará i nová logika současně.
- **Migrace custom kódu do GitHubu** · Záloha aktuálních souborů `timber-custom.css`, `timber-menu.js`, `timber-kategorie-banner.css/js` a `timber-empty-cart.js/css` uložena do `shoptet/backup/2026-10-05/`.
- **Homepage kategorie** · `timber-kategorie-banner.css/js` převeden do standardního modulu `homepage-categories` (`src/modules/`), bez starého dynamického načítání `timber-menu.js`. Produkce zatím beze změny; externí soubory se odstraní až po preview kontrole.

## v0.4.2 · 2026-10-05 · kategorie / sidebar
- **Najpredávanejšie v kategórii** · Pôvodný veľký blok nad výpisom produktov je na desktopoch presunutý do ľavého sidebaru a z hlavného obsahu odstránený.
- **Apollo sidebar** · Nový blok používa natívny vzhľad widgetu TOP 10 produktov, takže má rovnaké orámovanie, radius, vnútorné rozloženie a štýl položiek.
- **Poradie sidebaru** · Kategórie → Najpredávanejšie v kategórii → Sme tu pre vás → TOP 10 produktov.
- **Mobil / tablet** · Nový blok Najpredávanejšie v kategórii sa nezobrazuje pod 1200 px.
- **Apollo kompatibilita** · Úprava pracuje vo `.sidebar-inner`, presúva celé widget kontajnery a odstraňuje prázdny wrapper po presune TOP 10.


## v0.4.1 · 2026-10-05 · M2, C3
- **C3** · Názov produktu v tabuľkovom zobrazení je tučný (`font-weight: 700`) namiesto bežného rezu 400.
- **M2 / animace** · Mobilní animace košíkového popupu zůstává zachovaná, ale její rychlost je zkrácená na 120 ms pouze při otevření po přidání do košíku; ostatní Colorboxy zůstávají beze změny.
- **M2** · Mobilní okno po vložení do košíku: pevná šířka od prvního snímku odstraní roztažení popupu z pravé strany; výška je omezená na viewport a delší obsah se posouvá uvnitř okna.

## v0.4.0 · 2026-10-02 · C3, drobnosti
- **Drobnosti** · Instagram na homepage jako úzký pás: všech 9 příspěvků v jedné řadě, široké jako obsah stránky (lícuje s patičkou), dlaždice max. 160 px – na 1920 px ~146 px (dřív přes celou šířku okna, ~360 px na 1440 px monitoru). Na mobilu a tabletu jedna řada posuvná prstem (~2,4 fotky vidět po ~135 px, aby šel přečíst text příspěvků; max. 180 px) místo mřížky 2 × 2. Tlačítko „Sledovať na Instagrame“ pod pásem, už nepřekrývá další blok; menší mezery kolem. Počet příspěvků nastaven v adminu (viz ADMIN-CHANGES).
- **C3** · Odznak s počtem kusů v košíku byl na tlačítku „Do košíka“ vpravo uříznutý: vedle pole pro množství sahá tlačítko až k okraji dlaždice a dlaždice ořezává, co přečnívá. Odznak je teď v rohu tlačítka, nepřesahuje ho.
- **C3** · Tabulka (Riadky) čitelnější, varianta B2 schválená v návrzích (jen tabulka, mřížka beze změny): název produktu se už neořezává na 2 řádky – zalomí se, kolik potřebuje, a je normálním (ne tučným) písmem 14,5 px. „Do košíka“ je kulaté tlačítko jen s ikonou košíku, „Detail“ kulaté se šipkou ›, takže název má víc místa (1280 px: 182 → 274 px, 1440 px: 254 → 462 px; nejdelší názvy 3 řádky místo oříznutí). Pod názvem „Kód: 496544“ šedě a tence na všech šířkách – samostatný sloupec Kód (od 1440 px) zrušen, jeho místo dostal název. Písmo o 1–2 px větší: kód a dostupnost 13 px (z 10,5/11), cena 16 px (z 14,5), „bez DPH“ a jednotková cena 11,5 px, záhlaví 12 px, množství 14 px. Méně tučné: dostupnost a záhlaví 500, cena 700.
- **C3** · Detail produktu: kód a značka pod názvem 12,5 px a tmavší (šablona 10 px šedě).

## v0.3.1 · 2026-09-30 · oprava
- **Oprava (v0.3.0)** · Okno „Produkt bol pridaný do košíka“ – blok „Ostatní zákazníci tiež nakúpili“: na mobilu ceny a tlačítka odjely mimo obrazovku (o 452 px). Blok má stejné `#products.products-block` jako výpis, takže na něj působila úprava výšky dlaždic (K5). Všechny úpravy výpisu (dlaždice, tabulka, TB1, pole pro množství, odznak košíku) jsou teď jen pro skutečný výpis (`#products:not(.products-related)`). Okno je zase jako bez našeho kódu – původní rozpad dlaždic v něm řeší karta M3.
- **C3** · Přepnutí Mriežka ↔ Riadky bez animace: po návratu na mřížku se názvy produktů „zvětšovaly“ z 13,5 na 18 px (přechody šablony 0,3 s). Přechody jsou vypnuté jen na okamžik přepnutí, hover efekty dlaždic v mřížce zůstávají.

## v0.3.0 · 2026-09-29 · první nasazení
Obsahuje i v0.1.0 a v0.2.0 (nikdy nenasazené, jen tagy / rc).

- **M1** · Hlavní slider na homepage jde na mobilu posunout prstem (swipe nad stávajícím Bootstrap carouselem). Obrázky ostatních slidů se přednačtou, jakmile je stránka načtená a prohlížeč volný; na dotykových zařízeních slide za 350 ms místo 600 ms (desktop beze změny).
- **M1** · Fotky na detailu produktu jdou na mobilu přepínat prstem (přepíná náhledy galerie Shoptetu, na první/poslední fotce se zastaví, lightbox se tahem neotevře). Pás náhledů se posune, aby byl aktivní náhled vždy vidět; velké fotky sousedních náhledů se přednačítají. Na dotyku vypnutý zoom Shoptetu nad fotkou (při rychlém swipování zůstával viset se starou fotkou); klepnutí dál otevírá lightbox.
- **M1** · Swipe reaguje jen na dotyk (mobil/tablet). Myš na desktopu se chová jako bez našeho kódu.
- **Drobnosti** (PR #1) · submenu bez tmavé čáry; bez tečky na konci horního pruhu; logo 200 × 44 px v hlavičce i ve sticky hlavičce; stín pod bílým textem banneru (M4); Instagram 2 × 2 na mobilu; celé názvy podkategorií na mobilu (M5); filtr značek bez zalamování (K3); stejně vysoké dlaždice produktů a zarovnaná tlačítka; nenápadné „Späť“ v košíku (i při najetí myší); iPad na šířku bez postranního panelu, produkty po 3 (TB1).
- **C3** (PR #2) · Přepínač Mriežka / Riadky nad výpisem (kategorie, vyhledávání; desktop od 992 px, volba se pamatuje). Riadky = tabulka: obrázek, název, kód, dostupnost, cena, množství, košík; řazení podle ceny v záhlaví přes řazení Shoptetu (oba směry). Pole pro množství (− / + i psaní) v mřížce i v tabulce, zaokrouhluje na celá balení z doplňku Násobky objednávky. Odznak s počtem kusů v košíku. Přepis klientovy rozpracované verze (nikdy nenasazené).
- Loader: `PROD = ''` vypne náš kód pro zákazníky, preview funguje dál. Štítek preview ukazuje načtený tag/commit. Kód se spouští až po DOMContentLoaded (dynamicky vložený skript mohl z cache naběhnout dřív než `<body>`).
- **C4** · řazení podle dostupnosti se neprogramuje: výchozí řazení „Odporúčame“ už řadí skladem napřed (klientův doplněk Brani). Otevřené: produkty „Objednané“ mezi „Skladom“ – nastavení Brani.
- PageSpeed mobil (Lighthouse 12, medián 3 měření): před — homepage 46 (LCP 9,4 s, CLS 0), kategorie 42 (LCP 6,0 s, CLS 0) / po —

## v0.1.0 · nenasazeno (jen tag)
- Základ repa: core (detekce stránky, registr modulů, preview štítek), loader, build s kontrolou rozpočtu.
