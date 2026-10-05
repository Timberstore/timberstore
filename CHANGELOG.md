# Changelog

Formát: verze · datum · karty · co se změnilo · PageSpeed mobil před/po.

## Nevydáno

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
