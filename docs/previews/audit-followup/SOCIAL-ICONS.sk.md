# Jednotné sociálne ikony – preview 0.7.6-rc.2

Na výslovnú požiadavku majiteľa: všetky ovládacie odkazy na Facebook a Instagram majú rovnaké lokálne SVG a farebné kruhové pozadie podľa pätičky: Facebook #1877f2, Instagram existujúci značkový gradient. Rovnaký biely symbol, 26 px, výplň/ťah a 5 px vnútorné odsadenie. Bez ikonového fontu a bez nových sieťových požiadaviek.

Spoločný helper `addContactIcon` obsluhuje pätičku, desktop service bar, mobilné menu, košík/checkout a kontakt. Modul `social-icons` idempotentne dopĺňa zvyšné odkazy na overené profily pri prvom vykreslení a natívnych lifecycle udalostiach. Instagramový nadpis uchová svoj text a používa rovnaký symbol. Odkazy na jednotlivé instagramové príspevky/obrázky sa nemenia. Existujúce komponentové observery zachovávajú ikony po natívnom prekreslení, nepridáva sa globálny observer.

Odkazy, targety, texty a natívne eventy sa nemenia; neodhaľujú sa prvky, ktoré Apollo na danom breakpointe skrýva. Kontaktné sociálne ikony už nemajú sivé obrysy vo veľkých bielych štvorcoch. Hover nemení značkové farby SVG, klávesnica má fokus. Email/telefón ostávajú pôvodné oranžové, farby tlačidiel a skoršie schválené nadpisy/layout bez úprav. Kontakty a zmeny z predchádzajúcich preview ostávajú kumulatívne.

Iba commit-preview: bez release, tagu, merge, úprav Shoptet administrácie alebo produkčného loadera. Pôvodná produkcia v0.7.5. Lint/build PASS, gzip JS 36.14/36.25 a CSS 32.13/32.5 KiB; prebrané limity rc.0/rc.1 bez zvýšenia. Safari na reálnom iPhone a PageSpeed NOT TESTED. Trello kód nebol dodaný.


## Overený commit-preview

Zmrazený zdroj/build `c3719e15d879dcbc10641dfebe0b963da7b2009a`. Presné CDN bajty JS/CSS PASS. Chromium: 10 stránka×šírka prípadov (home/kategória/detail/kontakty/košík, 375/1440 px), ďalšie zmeny šírky 320/768/1024/1440 px PASS. Rovnaká SVG cesta a všetky vykreslené štýly pre rovnakú sieť vo všetkých umiestneniach, každý viditeľný symbol presne 26×26 px. Pôvodné href a prístupné názvy zachované, bez duplikácií po 3× natívnom lifecycle evente. Mobilné menu, desktop hover/fokus a obnovenie ikony po vyprázdnení natívneho footer linku PASS. Bez nových konzolových chýb a horizontálneho presahu. Screenshoty vizuálne porovnané.

Nákupné flow na PC aj mobile PASS až po údaje zákazníka, ikony overené aj v kontaktoch dopravy/platby. Žiadna objednávka/formulár neodoslané; vlastné skúšobné košíky vyčistené. Dôkazy `social-icons-cdn-assets.json`, `social-icons-cdn-qa.json`, `social-icons-cdn-cart.json`.

- Kontakty: https://www.timberstore.sk/kontakty/?ts_preview=c3719e15d879dcbc10641dfebe0b963da7b2009a
- Úvod/hlavička/pätička/mobilné menu: https://www.timberstore.sk/?ts_preview=c3719e15d879dcbc10641dfebe0b963da7b2009a
- Vypnutie: https://www.timberstore.sk/?ts_preview=off
