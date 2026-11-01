# Sidebar „Sme tu pre vás“ – preview 0.7.5-rc.2

Pripravené 1. 11. 2026. Kumulatívna pracovná verzia nad overeným preview príloh `8e9d4413eb9ed0e75d5f56bc0f51613354623e37`. Iba commit-preview, bez release, tagu, merge alebo zmeny produkčného loadera. Trello kód nebol dodaný, žiadna karta sa nevymýšľa.

## Implementácia

Aktuálne HTML kategórie má vlastný `.timber-support` banner s `.support__contact`, dvoma pôvodnými odkazmi a kontaktným tlačidlom. Apollo `repositionSideContentCategory` následne priradí nadradenému banneru `.box-support`; natívne vkladanie kontaktov cez `.js-support-address-block` sa týka inej štruktúry a tento banner neobsluhuje.

Nový modul upravuje výhradne existujúci banner v `.sidebar-inner`. Zachováva koreň, nadpis, podnadpis, umiestnenie, rám a natívne podmienky zobrazenia. Zachováva pôvodné elementy e-mailu, telefónu a kontaktného tlačidla vrátane href a ich obsluhy. Nevytvára ďalší banner ani jeho statickú kópiu.

Poradie kontaktov je **PO – PIA (08:00 – 16:00)**, **info@timberstore.sk**, **+421 904 479 842**. Hodiny aj stav dostupnosti sa vytvárajú cez existujúce `addHours`/`updateHours`, aktualizované spoločným časovačom headera v časovom pásme Europe/Bratislava. Text e-mailu, telefónu a tlačidla **Napíšte nám** pochádza z rovnakého TEXTS.footer ako päta. Ikony sú zo spoločného addContactIcon. Odkazy ostávajú `mailto:info@timberstore.sk`, `tel:+421904479842` a `/kontakty`.

Idempotentná inicializácia používa existujúce udalosti Shoptetu. Jeden lokálny observer na existujúcom bannere obnoví doplnenia, keď Apollo nahradí jeho vnútorný obsah. Nepridáva sa globálne DOM pozorovanie. CSS zostáva obmedzené na `.ts-sidebar-support` a rešpektuje existujúce breakpointy sidebaru. Dôležité prepisy sú potrebné len proti už importovaným legacy !important štýlom kontaktov.

## Overenie

Chromium 151, aktuálne HTML/JS Apollo, kategória `/profily-a-listy-k-pracovnym-doskam/`:

- 375, 768, 1024 px: sidebar zostáva skrytý podľa existujúcich pravidiel; na mobile sa nevytvára nový nežiadaný blok.
- 1280, 1440 px: sidebar viditeľný, vizuálne skontrolovaný. Správne poradie, zarovnanie ikon a textov, e-mail/telefón/kontaktné CTA, klávesnicový focus.
- Všetky šírky: 1 riadok hodín, 2 SVG, správne pôvodné href, rovnaký dynamický open/closed stav ako zvyšné kontakty. Bez horizontálneho presahu.
- Tri opakované ShoptetDOMPageContentLoaded udalosti nevytvoria duplicity. Obnovenie pôvodného vnútorného markup bannera sa automaticky doplní observerom.
- Päta má naďalej iba jeden riadok hodín a pôvodný mailto. Bez chýb pageerror v testovaných reláciách.
- Kliky na mail/tel/CTA sa v teste zachytávajú pred navigáciou; neodosiela sa kontaktná správa, objednávka ani iný formulár.
- `npm run lint`, `npm run build`, `node scripts/test-downloads.mjs`, `git diff --check`: PASS.
- Gzip JS **34.34 / 34.5 KiB**, CSS **31.29 / 31.5 KiB**. Malé rozšírenie iba tejto preview podľa historicky zaznamenaného súhlasu 15. 10.; staršie limity zachované.

Dôkazy: `local-qa.json`, skript `qa.mjs`. Lokálny režim nahrádza iba Timber bundle kandidátnymi súbormi; CDN režim (`TS_SIDEBAR_SHA=<commit>`) používa presné vzdialené súbory bez náhrady. HTTPS sa načítava cez zdedené proxy a CA trust s TLS kontrolou a plní sa do prehliadača cez route.fulfill. Fyzický iPhone/Safari a PageSpeed NOT TESTED. Celý nákupný priechod sa pre tento lokálny kontaktný blok neopakoval.

Nové zdroje: `src/modules/sidebar-support/index.js`, `src/styles/overrides/sidebar-support.css`. Registrácia v main.js/main.css, selektory v core/selectors.js, interná verzia/build rozpočet a dokumentácia. Predošlé úpravy súborov na stiahnutie ostávajú zdrojovo nezmenené.

## Overený preview

https://www.timberstore.sk/profily-a-listy-k-pracovnym-doskam/?ts_preview=f423f7f84284d64fa6e88a2083c1382cd4c330ea

Zdroj/build je zmrazený na `f423f7f84284d64fa6e88a2083c1382cd4c330ea`; nasledujúce commity dopĺňajú iba dôkazy. CDN JS/CSS presná bajtová zhoda (`cdn-assets.json`). Všetkých 5 šírok prešlo aj priamo cez CDN bez lokálnej náhrady bundlov (`cdn-qa.json`), bez pageerror. Produkčný loader ani pôvodné kontaktné href sa nemenili.

## Centrovanie podľa spätnej väzby (1. 11. 2026)

Celý existujúci banner má text zarovnaný na stred, kontaktné riadky sa centrujú individuálne a kontakty majú 15 px / 700 (pôvodne 16 px / 400). Nadpisy a tlačidlo ostávajú bold; aj podnadpis má 700 podľa požiadavky na celý blok. CSS iba v .ts-sidebar-support, bez zmien JS, údajov alebo href. Všetkých päť breakpointov prešlo; desktop overuje aj text-align center a odchýlku stredu každého kontaktného riadka a tlačidla pod 1 px. Screenshot 1440 vizuálne skontrolovaný. Dôkaz center-local-qa.json a center-qa.mjs. Build/lint/whitespace PASS, CSS 31.31 / 31.5 KiB bez navýšenia limitu.

Aktuálny centrovaný preview: https://www.timberstore.sk/profily-a-listy-k-pracovnym-doskam/?ts_preview=3270a04b4abccd25dd1d8a5ce6e81f432d1d6b33

Zdroj/build zmrazený na 3270a04b4abccd25dd1d8a5ce6e81f432d1d6b33. Presné CDN bajty a všetky breakpointy vrátane merania centrovania prešli aj bez lokálnych náhrad: center-cdn-assets.json, center-cdn-qa.json. Nasledujúce commity iba dopĺňajú dôkazy. Bez release, tagu, merge alebo úpravy produkcie.
