# Prebliknutie košíka pri zmene množstva

Pokračovanie v `0.6.11-rc.4`, vetva `preview/mobile-shipping-layout-20261015`, základ `7c72b83c5e29279ef998df735053547e24370b25`. Pracovný strom bol pred zásahom čistý. Žiadna nová verzia, merge, release/tag ani produkčné nasadenie. Produkčný loader v0.6.9 bez zmeny.

## Potvrdená príčina

Video `12.mp4` bolo skontrolované po snímkach v oblasti 12–18 s. Pri zmene skrutky 4×12 sa po AJAX zobrazí pôvodné „Môj košík“, iné rozloženie súhrnu a veľká ikona dopravy; až potom sa obnoví Timber úprava. Nejde iba o zmenu čísla alebo prechod farby.

Reprodukcia používa rovnaký verejný produkt, kód 50151, s pôvodným balením/minimom/krokom 2000. Server preň v čase testu povoľoval najviac 4000 kusov. Pokus 4000 → 6000 preto **správne odmietne**: HTTP odpoveď 200 nesie aplikačný kód 500 a validačnú správu „Dostupných je iba 4000 položiek. Množstvo nebolo zmenené.“ Návrat hodnoty na 4000 nie je prezentačná chyba a zostáva zachovaný.

Pri odmietnutí sa prejavia tri súvisiace okolnosti:

1. Shoptet cez `getCartContent()` nahradí celý `.cart-wrapper`. Náš observer môže zostať na odstránenom prvku. Pôvodný listener sa spoliehal na `ShoptetCartUpdated`; vo failed vetve natívny callback signalizuje túto udalosť na pôvodnom, už odpojenom formulári. Udalosť sa preto nedostane na document. Natívny `ShoptetDOMCartContentLoaded` sa na document odošle aj v tejto vetve.
2. Apollo na `ShoptetDOMCartContentLoaded` plánuje cez svoj 10ms timer `reorderBasketElements()` a `changeBasketFreeDelivery()`. Presunie natívny cenový súhrn do `.cart-summary`, zmení prvý krok na „Môj košík“ a obalí dopravu. Naše doterajšie rAF spracovanie nastalo neskôr alebo novú vetvu vôbec nesledovalo, kým neprišla iná sledovaná mutácia. V jednej sérii zostal nesprávny stav viditeľný v DOM aj vyše sekundy.
3. Samotné okamžité opätovné spracovanie odstráni tento dlhý stav, ale nestačí na krátku medzeru pred natívnym 10ms layout krokom. Compositor zaznamenal aj jednotlivú snímku pôvodnej serverovej štruktúry. V odmietnutej vetve môže byť pôvodný spinner odstránený už pred návratom GET požiadavky.

Nešlo o chýbajúce CSS z CDN, nesprávne výpočty ceny alebo novú AJAX požiadavku s množstvom navyše.

## Lokálna oprava

- `src/core/events.js`: pomenovaný `cartContentLoaded` pre skutočný natívny DOM event. Nepridaný do všeobecného zoznamu udalostí spúšťajúcich všetky moduly.
- `src/core/selectors.js`: dva selektory pre existujúci cenový súhrn a spinner.
- `src/modules/cart-presentation/index.js`: nový obsah sa spracuje priamo pri cart content evente a observer sa pripojí k aktuálnym prvkom. Sledovaný je aj prvý krok checkoutu mimo cart wrappera. Následné Apollo mutácie sa upravia v mutation microtasku pred paintom, namiesto čakania na ďalší rAF. Táto okamžitá cesta je obmedzená na plnú stránku košíka; popup a checkout si ponechávajú pôvodné plánovanie. Počas vlastného synchronného zápisu je odpojený iba náš observer a v `finally` sa opäť pripojí; tým nevzniká slučka vlastných mutácií. Neaktuálny naplánovaný frame sa zruší.
- Krátka príprava natívneho súhrnu sa označí vlastnou triedou iba po AJAX cart content evente. Ak existuje natívny spinner, použije sa ten istý. Ak ho Shoptet pri odmietnutí už odstránil, využije sa pôvodné `window.showSpinner()` a neskôr `window.hideSpinner()`. Nevytvára sa druhý spinner popri existujúcom. Uvoľnenie závisí od skutočného premiestnenia natívneho `.summary-wrapper` do `.cart-summary`, nie od nového timeoutu. Prázdny košík túto podmienku neblokuje.
- `src/styles/overrides/cart-presentation.css`: iba počas tejto krátkej prípravy ostane pôvodná načítavacia maska viditeľná a nepriesvitná, aby neodhalila nespracovaný DOM. Hotové rozloženie má rovnaké rozmery, farby a štýly.

Žiadny override natívnych funkcií, AJAX transportu ani listenerov Shoptetu/Apollo; žiadne klonovanie košíka, formulárov či interaktívnych ovládačov. Ceny, skladové limity, min/max/step, balenia, serverové správy a debounce požiadaviek zostávajú natívne. Pôvodný načítavací indikátor pri komunikácii so serverom zostáva; opravuje sa odhalenie iného rozloženia.

## Overenie

Testy a výsledky sú uložené v [zázname](cart-flicker/results.json). Snímky dodaného videa ani jeho obsah sa do verejného repozitára nepridávajú.

- Desktop 1440 a mobil 320/375/390/430 v Chromium; mobilné ovládače testované reálnymi súradnicovými dotykmi, desktop myšou. Programové kliknutia iba pri príprave testovacieho košíka.
- **35 natívnych AJAX zmien** v siedmich kontextoch: päť bežných šírok a cold/pomalšie 390/1440. Tri produkty v košíku, vrátane tej istej skrutky. Odmietnuté zvýšenie nad skladový limit, úspešné mínus/plus, ručné zadanie 2000 aj 4000. Po každom novom AJAX obsahu overené serverové množstvo, riadková cena, nezmenené ďalšie dva produkty, jeden nadpis stĺpcov, jeden krokový panel a jeden informačný blok na každý produkt.
- rAF vzorky overujú, že nespracovaný súhrn je zakrytý načítavacou maskou; odhalený obsah má dokončený layout, správny prvý krok, quantity shell aj dopravu. Po skončení všetkých požiadaviek nezostáva spinner. Rozmery dokončeného súhrnu v sérii zostávajú stabilné, bez horizontálneho posúvania.
- Režim bez cache a zámerne pomalšie odpovede cart content testujú, že riešenie nezávisí od rýchlosti GET požiadavky.

Regresne prešiel mobilný náhľad 320 (ikona/počet/hlavná plocha do košíka, samostatná šípka, skutočné CTA a zachované dva produkty). Doprava zadarmo prešla oboma smermi vrátane zeleného/oranžového baru, textu, serverovej zostávajúcej sumy a 6px geometrie. Kontrola čaká na nový DOM a dokončený natívny request; starší 550ms odhad po dataLayer zmene mohol pri pomalej sieti merať ešte starý košík, preto sa nepoužíva ako dôkaz dokončeného výsledku.

Sieť prehliadača využíva existujúci TLS-overujúci curl transport. Routing vypína vlastnú HTTP cache Chromium: bežný režim opakovane používa statické odpovede transportu, cold režim ich nepoužíva a posiela no-cache hlavičky. Nie je to benchmark fyzickej diskovej cache prehliadača. Časy dokumentujú poradie udalostí, nie porovnateľné výkonnostné skóre.

Lint, Prettier a build prešli: JS 26 460 B (25,84 KiB) / 30 KiB a CSS 21 473 B (20,97 KiB) / 21 KiB gzip. Limity sa nezvyšovali.

Reálny Safari/iPhone a PageSpeed neboli k dispozícii. Žiadna objednávka alebo platba nebola vytvorená. Produkčné nastavenia sa nemenia.
