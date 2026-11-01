# Jednotné sociálne ikony – preview 0.7.6-rc.2

Na výslovnú požiadavku majiteľa: všetky ovládacie odkazy na Facebook a Instagram majú rovnaké lokálne SVG a farebné kruhové pozadie podľa pätičky: Facebook #1877f2, Instagram existujúci značkový gradient. Rovnaký biely symbol, 26 px, výplň/ťah a 5 px vnútorné odsadenie. Bez ikonového fontu a bez nových sieťových požiadaviek.

Spoločný helper `addContactIcon` obsluhuje pätičku, desktop service bar, mobilné menu, košík/checkout a kontakt. Modul `social-icons` idempotentne dopĺňa zvyšné odkazy na overené profily pri prvom vykreslení a natívnych lifecycle udalostiach. Instagramový nadpis uchová svoj text a používa rovnaký symbol. Odkazy na jednotlivé instagramové príspevky/obrázky sa nemenia. Existujúce komponentové observery zachovávajú ikony po natívnom prekreslení, nepridáva sa globálny observer.

Odkazy, targety, texty a natívne eventy sa nemenia; neodhaľujú sa prvky, ktoré Apollo na danom breakpointe skrýva. Kontaktné sociálne ikony už nemajú sivé obrysy vo veľkých bielych štvorcoch. Hover nemení značkové farby SVG, klávesnica má fokus. Email/telefón ostávajú pôvodné oranžové, farby tlačidiel a skoršie schválené nadpisy/layout bez úprav. Kontakty a zmeny z predchádzajúcich preview ostávajú kumulatívne.

Iba commit-preview: bez release, tagu, merge, úprav Shoptet administrácie alebo produkčného loadera. Pôvodná produkcia v0.7.5. Lint/build PASS, gzip JS 36.14/36.25 a CSS 32.13/32.5 KiB; prebrané limity rc.0/rc.1 bez zvýšenia. Safari na reálnom iPhone a PageSpeed NOT TESTED. Trello kód nebol dodaný.
