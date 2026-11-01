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
