# Sociálne ikony – variant 3, farby Timber Store (0.7.6-rc.3)

Majiteľ vybral návrh 3 „Tenký rámik“ a požiadal použiť farby webu namiesto farieb sociálnych sietí. Nový variant nahrádza odmietnuté modré/gradientové kruhy.

Spoločný vzhľad vo všetkých existujúcich umiestneniach: 32×32 px biely rámik s 1 px teplým sivým okrajom `--ts-color-controls-border`, polomer 8 px, Facebook aj Instagram v pôvodnej oranžovej `--ts-color-accent` (#d4884a), vnútorné odsadenie 6 px. Hover a klávesnicový fokus zafarbia len rámik do oranžovej a podklad do existujúcej jemnej svetlej oranžovej. Facebook má plný symbol, Instagram líniový symbol, rovnaké SVG ako predtým. Email/telefón/tlačidlá bez zmeny. Umiestnenie, odkazy, targety, eventy, viditeľnosť breakpointov a kontaktný layout zachované.

Zmena aplikačného správania oproti rc.2: žiadna; iba spoločné CSS/tokeny a číslo verzie. Predchádzajúce kontakty, DIČ, nadpisy a N/A fallback zachované. Kategórie/expedičné lehoty/import bez zmeny. Bez nových assetov/požiadaviek alebo závislostí.

Iba commit-preview, bez merge/tagu/release/úpravy produkčného loadera či administrácie. Limity rc.0–rc.2 zachované, JS 36.14/36.25 a CSS 32.12/32.5 KiB gzip. Lint/build/whitespace PASS. Safari na reálnom iPhone a PageSpeed NOT TESTED. Nákupné flow rc.2 ostáva posledný funkčný dôkaz (žiadna funkčná zmena v rc.3).


## Overené preview

Zdroj/build `3bfcd5b8f5ce3fc2ac83c7377e070028158de743`, CDN presné bajty PASS. Chromium 375/1440 px: home, kategória, detail, kontakty, košík; navyše resize 320/768/1024/1440 px PASS. Každý viditeľný symbol má 32×32 px, 1 px sivý rámik, biele pozadie a oranžový symbol, rovnaké computed štýly v každom umiestnení. Mobilné menu, opakovaný lifecycle event, obnova natívneho footer linku, oranžový hover/svetlé pozadie a klávesnicový fokus PASS. Pôvodné tlačidlo produktu zostalo #d4884a; natívny kontaktný formulár a jeho validácia zachované. Bez nových konzolových chýb alebo horizontálneho presahu. Screenshoty hlavičky/kontaktov vizuálne overené. Nákupné flow sa neopakovalo: rc.3 nemení žiadny funkčný zdroj a rc.2 už prešlo PC aj mobil.

- Kontakty: https://www.timberstore.sk/kontakty/?ts_preview=3bfcd5b8f5ce3fc2ac83c7377e070028158de743
- Celý web: https://www.timberstore.sk/?ts_preview=3bfcd5b8f5ce3fc2ac83c7377e070028158de743
- Vypnutie: https://www.timberstore.sk/?ts_preview=off
