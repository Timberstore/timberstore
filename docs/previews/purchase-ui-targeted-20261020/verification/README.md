# Reprodukcia

Node + Chromium + `playwright-core`; nastaviteľné `PLAYWRIGHT_CORE` a `CHROMIUM_PATH`. Najskôr v koreňovom repo `npm ci`, `npm run lint`, `npm run build`. Proxy/curl bridge rešpektuje sieťové pravidlá prostredia. Predvolene používa živé verejné Shoptet HTML/API a lokálny finálny dist; `cdn:true` načíta skutočné CDN assety. Každé otvorenie vytvára samostatný anonymný košík; nemení admin a neposiela objednávku/platbu.

Spustenie zo zložky tohto súboru: `node check.cjs`, `node stability-final.cjs`, `node live-popup.cjs`, `node native-pack-pickup.cjs`, `node modal-gallery.cjs`, `node layout.cjs`, `node home-native.cjs`, `node cart-prices.cjs`, `node mini.cjs`, `node ajax.cjs`, `node loadmore-checkout.cjs`, `node variant-interactions.cjs`, `node multi-layout.cjs`, `node popup-scroll.cjs`.

`check.cjs` vytvára targeted.json. Výstupy JSON vznikajú pri skriptoch, screenshoty v ../images; auditované výsledky sú uložené samostatne v ../evidence. Pôvodný build používa `git show ff681ac9c1f789e4a848cd5ac13bf7d6d49478f8:dist/...`.

Replay: multi-layout používa tri zachytené natívne karty, synteticky zvýšenú cenu len na kontrolu geometrie; popup-scroll násobí karty kvôli výške. Zachytené HTML má staré vlastné quantity obaly odstránené pred inicializáciou, natívne min/max/step sa zachovávajú. Variant-interactions používa fixture.json pre nedostupný externý feed; nie je živá validácia jeho synchronizácie.

Niektoré testy po prázdnej natívnej odpovedi GetExtendedOrder zaznamenajú neoverené otvorenie a vykonajú ďalšie reálne pridanie. Produkčný JS také opakovanie neobsahuje. Aktuálna dostupnosť backendu môže ovplyvniť reprodukciu.
