# Preview doladenia checkoutu a Emerald – 0.6.11-rc.2

15. 10. 2026. Vetva `preview/mobile-shipping-layout-20261015`, základ `c5fda5277e5b5d29359b7dd71b05650aa96ace01`. Po následnom pokyne klienta pokračujeme pôvodným postupom izolovaného preview: push iba aktuálnej pracovnej vetvy, načítanie cez presný commit hash. Bez merge, release tagu, zmeny produkčného loadera a produkčného nasadenia. Predchádzajúci audit a jeho vzorky zostávajú historickým podkladom rc.1; presné nové zadanie v tomto dokumente povoľuje Emerald #00C853.

## Upravené zdroje a rozsah

| Súbor | Zmena |
|---|---|
| `src/styles/tokens.css` | Jediná nová základná zelená #00c853; `--ts-color-success-primary`, `--ts-color-success-border`, `--ts-color-success-active`, existujúce positive/ink/CTA aliasy smerujú na túto hodnotu. Success Background #e8f5ed, oranžová a béžové tokeny nezmenené. |
| `src/modules/header-service-bar/header-service-bar.css` | Úprava existujúcich mobilných pravidiel: hodiny ľavý stĺpec, kontakty pravý stĺpec, 1px existujúci service-divider, pôvodný pseudo-element ikony za textom cez order. Doplnkový riadok len na mobile, mimo béžovej plochy. Desktopové pravidlá nemeníme. |
| `src/modules/header-service-bar/index.js` | Mobilný pôvodný emailový anchor dostane mailto:, desktop si zachová odkaz na kontaktný formulár. Nový pomocný odsek sa pridá raz a zachová pri výmene panelu. Telefón ponecháva pôvodný tel: a existujúce ošetrenie nesprávne vnorených Apollo anchorov. |
| `src/core/contacts.js`, `src/core/texts.js` | Verejný e-mail info@timberstore.sk a presný text doplnkovej pomoci na jednom mieste. |
| `src/styles/overrides/checkout.css` | Mobilný truck: existujúci accent token. Aktívny krok a radio disk zostávajú zelené cez alias; číslo/tick tmavé, čitateľné na novom jasnom podklade. |
| `src/styles/overrides/cart-presentation.css` | Success rámik používa border rolu; pokračovať/dokončiť vrátane hoveru presná Emerald, tmavý text aj právna veta. Odstránený hover brightness, zachovaný focus a disabled mechanizmus. |
| `src/styles/overrides/cart-modal.css`, `src/styles/overrides/information-message.css` | Existujúce pozitívne rámiky prepojené na spoločný border token, jemné pozadia nezmenené. |
| `package.json`, `package-lock.json`, `scripts/build.mjs` | Samostatná lokálna verzia rc.2, CSS limit 20,25 KiB len pre túto verziu. Predchádzajúce rozpočty zachované, zvýšenie už používateľ všeobecne povolil. |
| `dist/timber.min.css`, `dist/timber.min.js`, obe sourcemapy | Aktualizovaný preview build pre pracovnú vetvu; produkčný loader zostáva v0.6.9. |
| `CONTRIBUTING.md`, `CHANGELOG.md`, tento dokument | Rozpočet, výsledok a hranice zadania. |

## Kde presne sa prejaví Emerald

| Existujúci konzument | Výsledok |
|---|---|
| `product-card.css`: overený inline háčik dostupnosti #2e7d32 | SKLADOM v kategórii/detaile/košíku #00c853; pôvodný inline údaj sa nemení. Oranžový skladový stav zostáva oranžový. |
| `checkout.css`: nulové shipping/billing atribúty, `.ts-checkout-free-price`, stock/recap selektory | Existujúce success texty a zvýraznenia #00c853; hodnoty cien a natívne formuláre sa nemenia. |
| `cart-presentation.css`: `.ts-cart-delivery strong`, `.ts-cart-shipping .extra.delivery strong`, `.ts-cart-shipping-complete .price-range > div` | Benefit ZADARMO a dokončený progress #00c853; nedokončený oranžový progress zostáva oranžový. |
| `checkout.css`: checked rádio/checkbox, aktívny krok | Green success disk/rámik #00c853; mobilná vybraná plocha stále #e8f5ed. |
| Success messages a add-to-cart modal | Pozitívny rámik/ikona #00c853 cez spoločné tokeny, soft success plocha pôvodná. |
| `header-service-bar.css`: `[data-open=true] .ts-service-bar__status` | Otvorené Emerald; zatvorené stále pôvodný oranžový token. |
| `order-detail.css` v natívnom open shadow root | Úspešný štítok a explicitná nulová doprava/platba Emerald cez zdedené aliasy; success background pôvodný. Súbor netreba duplikovať alebo priamo prepisovať. |
| `.next-step-forward`, `.next-step-finish` | Pozadie, border a hover #00c853, tmavý foreground #0f0f0f, focus pôvodný. |

Nejde o hromadnú náhradu každého zeleného HEX v historických súboroch alebo v natívnych poskytovateľoch. Cookies, bankový modal, nezávislé produktové integrácie, neimportovaný legacy list-view a nesúvisiace stavy sa nemenia. Zjednotený je aktuálny vlastný success systém a jeho konzumenti. Native stock atribút #2e7d32 ostáva selektorovým/dátovým háčikom, jeho prepísaný výsledný text je Emerald.

## Autíčko

Použitý je už existujúci `--ts-color-accent: #d4884a`, doložený napríklad `.in-kosik .ts-cart-delivery::before` a skoršími checkout úpravami (`977f7e5`, `.extras-wrap .extra.delivery::before`). Žiadna nová oranžová hodnota sa nezavádza. Farba sa mení iba mobilnému pseudo-elementu pôvodného nadpisu dopravy; jeho znak, font a centrovanie zostávajú. Fotografia 5 v tejto správe nebola priložená, takže sa netvrdí porovnanie priamo s ňou.

## Overenie

- Lokálny model s natívnym Shoptet DOM a Apollo CSS, predchádzajúci vs nový Timber build: kontakty pri 320/375/390/430 px, hodiny vľavo, zvislý oddeľovač, texty nad pôvodnými ikonami, tel: a mailto:, jediný pomocný riadok, bez horizontálneho overflow. Skontrolované hodnoty pseudo-elementov a ich order; offline snímky nemajú stiahnutý ikonový webfont, preto nie sú dôkazom rasterizácie skutočných Apollo ikon.
- Pri 768/1024/1440 px rovnaká geometria a typografia kontaktov ako rc.1, bez pomocného odseku, pôvodná desktopová destinácia e-mailu zachovaná. Farebné success role sa na desktope menia zámerne.
- Náhrada panelu klonom a päť opakovaných natívnych init eventov: bez duplikovaných hodín, odsekov a vnorených anchorov. Fyzické kliky v lokálnom modeli dorazili na pôvodný tel:, mailto: aj nový pomocný mailto: anchor; externé aplikácie sa neotvárali.
- Modelové computed meranie pri 390 a 1440 px: dostupnosť, ZADARMO, benefit, dokončený progress, open indikátor, success rámik, checked radio, CTA/hover/právna veta, úspešný shadow status a nulová objednávková doprava. Emerald #00c853, jemné pozadia #e8f5ed, CTA filter none a tmavý text sa zhodujú s očakávaním.
- Živý Shoptet/Apollo s lokálne substituovanými iba Timber assets: 4 reálne dopravy, mobilný reload so 4 logami natívne vnorenými do ceny, prepnutie všetkých natívnych labelov a AJAX step2CustomerAjax HTTP 200. Overený aj výber dvoch viditeľných platobných metód a nadväzujúca AJAX aktualizácia súhrnu. Pôvodný pickup widget sa otvoril, Choose a pickupPointWidget HTTP 200, bez zachytenej JS výnimky. Po živom AJAX má kontaktný blok stále jediný pomocný riadok, správne tel:/mailto: odkazy, ikony pod textom, béžové pozadie a pôvodný akcent truck ikony, bez horizontálneho overflow. Prístup k testovaciemu košíku nemení produkčný kód. Žiadna objednávka ani platba sa neodoslala.
- ESLint a build prešli. Presný gzip výstup: CSS 20 577 B (20,09 KiB) / 20,25 KiB; JS 25 302 B (24,71 KiB) / 30 KiB. Len rozšírenie schváleného verzovaného rozpočtu, bez zmeny limitov starších verzií.

## Apollo a praktické riziká

Pôvodné kontaktné, dopravné a platobné prvky sa nevymieňajú, neklonujú ani neprestavuje logika cien. Kontakt zostáva pôvodný anchor; ikona je pôvodný pseudo-element. Existujúci MutationObserver dopĺňa pomocný riadok idempotentne, breakpoint obnoví pôvodný desktopový odkaz. Nové údaje ani interaktívne prvky sa nevkladajú do natívnych formulárov dopravy/platby. Súčasné :has() selektory vyžadujú moderný prehliadač; reálny iOS Safari a úplný výber/ potvrdenie pobočky či platobná brána neboli otestované. Tretie/marketingové hosty mimo siete testu sa neoverovali.

Emerald #00c853 má kontrast proti bielej **2,24:1**, proti pôvodnej success ploche **1,99:1**. Presne zadaný malý zelený text preto nespĺňa WCAG AA; samotný takýto rámik/indikátor na bielej nedosahuje ani netextové 3:1. Hodnota sa svojvoľne nestmavuje. Na zelených CTA a rádiovom disku sú preto tmavé pôvodné neutrálne foregroundy; #0f0f0f na Emerald má **8,57:1**. Disabled používa pôvodnú opacity .55, takže vykreslená farba závisí od podkladu; zostáva rozlíšiteľný neaktívny stav.
