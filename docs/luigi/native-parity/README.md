# LB1 · Native parity handoff

Začať [DECISION.md](DECISION.md). Aktuálna integrácia je **FAIL/BLOCKED**;
rc.8 je majiteľom odmietnuté. Žiadny nový kozmetický build sa nevydáva.

- [Implementačné rozhodnutie a konkrétny plán](DECISION.md)
- [Kontrakt polí a ich skutočný význam](DATA-CONTRACT.md)
- [Finálna požiadavka podpore — neodoslaná](SUPPORT-FINAL.md)
- [Funkčné výsledky PASS / FAIL / BLOCKED](TEST-MATRIX.md)
- [Reálne porovnanie rovnakej SKU na desktope/mobile](index.html)

Implementované sú `shared/luigi/search.js` a read-only
`scripts/luigi-parity-preflight.mjs`. Nie sú importované v zákazníckom frontend
builde. Nie sú náhradou natívneho renderera ani tvrdením o opravených kartách.

Reprodukcia:

```sh
node --test tests/luigi-search.test.mjs
npm run lint
NODE_USE_ENV_PROXY=1 node scripts/luigi-parity-preflight.mjs /tmp/luigi-preflight.json
```

Posledný príkaz potrebuje Node s podporou environment proxy a povolené oficiálne
Luigi domény. Vykonáva iba verejné GET dopyty; žiadny content write či analytics emit.
Browserové skripty sú pri dôkazoch a vyžadujú Playwright/Chromium, proxy a dôveru CA.
Neodosielajú objednávku. Súbor `remove-error-article.proposed.json` je výhradne
podklad pre schválený zásah podpory; **žiadny skript ho neodosiela**.

Externý bootstrap a HTML sú z dôvodu session/konfiguračných identifikátorov iba
v dočasnom pracovnom adresári. Verejné dôkazy ukladajú len potrebné normalizované
produktové informácie, runtime voľby, screenshoty a hash zdroja. Pôvodný admin
export a zmluvné podmienky nie sú dostupné; nenahrádzame ich domnienkami.
