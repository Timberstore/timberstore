# Sociálne ikony – variant 3, farby Timber Store (0.7.6-rc.3)

Majiteľ vybral návrh 3 „Tenký rámik“ a požiadal použiť farby webu namiesto farieb sociálnych sietí. Nový variant nahrádza odmietnuté modré/gradientové kruhy.

Spoločný vzhľad vo všetkých existujúcich umiestneniach: 32×32 px biely rámik s 1 px teplým sivým okrajom `--ts-color-controls-border`, polomer 8 px, Facebook aj Instagram v pôvodnej oranžovej `--ts-color-accent` (#d4884a), vnútorné odsadenie 6 px. Hover a klávesnicový fokus zafarbia len rámik do oranžovej a podklad do existujúcej jemnej svetlej oranžovej. Facebook má plný symbol, Instagram líniový symbol, rovnaké SVG ako predtým. Email/telefón/tlačidlá bez zmeny. Umiestnenie, odkazy, targety, eventy, viditeľnosť breakpointov a kontaktný layout zachované.

Zmena aplikačného správania oproti rc.2: žiadna; iba spoločné CSS/tokeny a číslo verzie. Predchádzajúce kontakty, DIČ, nadpisy a N/A fallback zachované. Kategórie/expedičné lehoty/import bez zmeny. Bez nových assetov/požiadaviek alebo závislostí.

Iba commit-preview, bez merge/tagu/release/úpravy produkčného loadera či administrácie. Limity rc.0–rc.2 zachované, JS 36.14/36.25 a CSS 32.12/32.5 KiB gzip. Lint/build/whitespace PASS. Safari na reálnom iPhone a PageSpeed NOT TESTED. Nákupné flow rc.2 ostáva posledný funkčný dôkaz (žiadna funkčná zmena v rc.3).
