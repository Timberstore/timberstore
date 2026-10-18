# Opravy nad aktívnou v0.6.12

Klient potvrdil aktiváciu v0.6.12. Tieto následné opravy používajú rovnaké číslo v package.json; nevytvárajú ani neprepisujú release/tag a nemenia produkčný loader. Rozpracovaný detail produktu zostáva vylúčený.

## Košík

Príčina voľnej mobilnej šípky: Apollo zachováva skrytú desktopovú `.cart-count` v `#header` a súčasne viditeľnú mobilnú kópiu v `.top-navigation-bar`. Obe mali náš súrodenecký absolútne umiestnený button. Skrytý odkaz nevytváral geometriu, ale button a jeho pseudo-element zostali pri pravom okraji stránky. Mobilné CSS teraz vykresľuje button iba v skutočnej `.responsive-tools`; po resize sa automaticky vracia desktopové ovládanie.

Prázdny mobilný popup má vertikálne vycentrovanú hierarchiu obsahu: oranžová ikona hore a text pod ňou, horizontálne na stred. Úprava je obmedzená na `.popup-widget-inner:not(.full)`; riadky plného košíka zostávajú grid a desktopové rozloženie sa nemení.

Chromium: 320/375/430/767/768/1024/1440 px, scroll 0→500→1500→0, práve jedna viditeľná šípka geometricky pri reálnom odkaze. Klik otvorí náhľad bez navigácie. Prázdny mobilný obsah má column/center. Plný košík: AJAX vloženie, resize 375→1440→375→430→768→320, popup bez navigácie, produktové riadky grid, samostatný natívny odkaz naviguje do /kosik/. Bez nových JS výnimiek.

## Instagram bez cookies

Natívny serverový HTML widget Shoptetu bol dodaný až po prijatí cookies; nejde iba o cache prehliadača. Súhlas sa návštevníkom automaticky neudeľuje. Galéria bez natívnych dát načíta verejný dátový JSON z tohto repozitára, bez credentials a bez referrera. Používa iba overené obrázky z CDN Shoptetu a natívne Instagram permalinky, bez embed/analytics skriptov. Dáta obsahujú 16 aktuálne dodaných príspevkov v pôvodnom poradí; žiadne vymyslené URL ani fotografie.

`scripts/refresh-instagram.py` číta verejnú homepage ako izolovaný serverový čítač s vlastnou jednorazovou preferenciou CookiesConsent (bez účtu, bez návštevníckych údajov a bez spustenia skriptov). Parsuje iba povolené CDN cesty a Instagram /p/ alebo /reel/ odkazy. Pri menej ako šiestich platných položkách zlyhá a zachová posledné dobré dáta. Živý refresh bol overený. Klient výslovne schválil automatický zápis iba `data/instagram.json` do mainu každých šesť hodín po požiadavke automatickej bezpečnostnej kontroly. Workflow `refresh-instagram.yml` aktualizuje iba tento dátový súbor, nie JS/CSS, číslo verzie, tagy ani loader. Dá sa spustiť aj ručne. Pri rovnakej galérii nevytvára zbytočné commity. Aktualizované sú iba verejné dáta, nie kód produkčného balíka; JS/CSS naďalej patria nemenným tagom.

Ak neskôr príde natívny widget, nahradí dátovú kópiu bez zdvojenia sekcie. Pri výpadku dát zostáva posledný dobrý JSON; pri výpadku jeho načítania funkčný profil a pravdivé hlásenie. Skryté prázdne pôvodné footer miesto pre Instagram. Nové načítanie sa spustí raz a obrázky sú lazy.

Desktopové karty sú po celej šírke viewportu s 24 px okrajmi, šesť naraz a šípky; mobilné 2½ fotky a swipe zostávajú. Bez bodiek. Nadpis má zachovanú obmedzenú čitateľnú šírku.

## Kontakt

Otváracie hodiny sú prvé aj na PC; nasleduje e-mail, telefón, tlačidlo a sociálne siete. Desktopové tlačidlo sa natiahne do dostupnej šírky kontaktného bloku (maximum 220 px), sociálne siete sú vycentrované pod ním. Mobilná šírka tlačidla podľa telefónu zostáva. Časy, dostupnosť a odkazy používajú existujúce konfigurácie.

## Kontroly a hranice

Lint, build, whitespace kontrola a kontrola vylúčenia produktového preview. Výstup JS 29,55 / CSS 22,96 KiB gzip, existujúce limity 30 / 23 KiB bez navýšenia. Automatické testy sú Chromium s mobilnou emuláciou; reálny Safari/iOS a PageSpeed neboli overené. Žiadna objednávka ani platba nebola odoslaná. Nové foto načítanie v testoch používa skutočné dáta a skutočné CDN obrázky; pred publikovaním dát bola JSON odpoveď presmerovaná na totožný lokálny súbor.


Nová galéria a kontakt: Chromium 375 px bez odpovede na cookies aj po odmietnutí, 1440 px po odmietnutí/prijatí a 1920 px bez odpovede. Vždy 16 reálnych položiek, bez bodiek a pretekania. Dostupná šírka galérie 1377 px pri viewport 1440 a 1857 px pri 1920; úzke okraje a natívny scrollbar gutter. Hodiny pred mailom a telefónom, desktopové tlačidlo 220 px, sociálne siete vycentrované pod ním. Vizuálne prezreté screenshoty mobilného prázdneho košíka a desktopovej galérie so skutočnými fotografiami po dokončení img.decode(). Ochrana pri prázdnom zdroji zachovala dátový JSON nezmenený.
