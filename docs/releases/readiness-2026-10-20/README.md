# Predrelease audit — 20. 10. 2026

**VYDANIE ZASTAVENÉ.** Povinnú Safari/WebKit kompatibilitu nie je možné v tomto prostredí overiť. Podľa výslovnej podmienky zadania nebol vykonaný merge, produkčný build novej verzie, nový tag/release ani zmena Shoptet administrácie. Toto je dokumentácia pripraveného preview a blokujúceho stavu, nie oznámenie vydania.

## Identifikácia

| Údaj | Overený stav |
| --- | --- |
| Živá produkcia | **v0.6.13**, z verejného loadera a čistej browser relácie bez preview cookie |
| Produkčný commit | `0c726ffe6986192721a3b62b3743b31c78a01b50` |
| Annotated tag object | `87d22e4116b370cf7aaef3f4454095ec2ab5bb14` — nie je to source commit |
| Aktualizovaný `origin/main` | `0c726ffe6986192721a3b62b3743b31c78a01b50` |
| Auditovaný HEAD preview | `9faa138df5d088af3d28446fa6c9eadeb0d38dd3` |
| Posledná implementácia | `e308459a47e3aba567d21c9fb2ed866a2ea43ab8`; nasledujúci commit obsahuje iba dokumentáciu |
| Package version | `0.6.13-compact.1`, bez zmeny |
| Rozdiel voči main/produkcii pred týmto dokumentom | 26 commitov vpredu, 0 vzadu; fast-forward cesta existuje, merge nebol vykonaný |
| Navrhnutá ďalšia minor verzia | **v0.7.0**, podľa `npm run release` → `npm version minor`; zatiaľ nevytvorená |
| Nový produkčný tag / release SHA | **Neexistuje**; preview SHA sa nesmie označiť za vydaný produkčný build |

[Strojový audit, build, hashe a gate výsledky](audit.json). [Celá história 26 commitov](commit-history.txt). [Všetkých 32 zmenených zdrojových súborov](source-files.txt). Audit prešiel celý rozdiel od v0.6.13, nie iba posledný commit.

## Blokujúci WebKit gate

- Playwright Core **1.57.0** je dostupný, ale jeho WebKit browser **nie**. Očakávaná binárka `webkit-2227/pw_run.sh` neexistuje.
- Skutočné `webkit.launch()` skončilo `Executable doesn't exist`.
- Oficiálny download cez zachovaný proxy/TLS mechanizmus na `cdn.playwright.dev` bol zamietnutý **HTTP CONNECT 403**. Proxy ani sieťová politika sa neobchádzali. Iná Python CLI uvádza odlišnú browser revíziu; samotná prítomnosť CLI nie je dôkaz dostupného enginu.
- Fyzický iPhone / autorizované zariadenie ani BrowserStack spojenie neboli dostupné.
- **Safari/WebKit výsledok: NEOVERENÉ.** Chromium touch emulácia sa za Safari nepovažuje.

[Presný WebKit preflight](webkit-preflight.json).

Treba sprístupniť zodpovedajúcu WebKit binárku v testovacom prostredí, prípadne povoliť jej oficiálny download v spravovanej sieťovej konfigurácii. Následne vykonať celú funkčnú maticu nižšie. Bez toho podľa zadania release nepokračuje.

Samostatné obmedzenie: `friends.shopcode.cz` tiež vracia CONNECT 403. Pred finálnou akceptáciou musí byť možné overiť **živé prepínanie obrázkových variantov**. Predchádzajúce browser-only variantové fixtures dokazujú geometriu a interakciu so zachytenými dátami, nie aktuálnu dostupnosť externého zdroja.

## Dostupné vykonané kontroly

- `npm run lint`: PASS.
- `npm run build`: PASS, reprodukovateľný **preview** build; nie nový stabilný build.
- `git diff --check` aj kontrola diffu od produkcie: PASS.
- **JS 32 467 B gzip / 32 768 B**, rezerva 301 B.
- **CSS 27 340 B gzip / 27 392 B**, rezerva **52 B**. Limity sa nenavýšili.
- V package scripts nie je samostatná automatická test suite; existujú lint/build. Predchádzajúce integračné browser výsledky sú uložené v preview dokumentácii.
- Nový read-only Chromium smoke na **320, 375, 390, 393, 430, 768, 1440 px**: homepage a kategória, správny immutable loader SHA, header v rámci viewportu, dostupné quantity inputy, `scrollWidth <= innerWidth`, bez nových JS výnimiek. **14 stránkových kombinácií PASS.** [Výsledky](chromium-smoke.json).
- Čistá produkčná browser relácia potvrdila `TimberLoader.version = Timber.version = v0.6.13`, `preview=false`. [Výsledok](production-runtime.json).
- Produkčné CSS aj JS z jsDelivr sú bajtovo zhodné s `v0.6.13` tagom. URL a SHA-256 sú v audite.
- Posledný overený preview CDN build a 24 natívnych nákupov, filtre na 8 šírkach, AJAX balenia, vysoké ceny a computed porovnania košíkov sú doložené v [poslednom preview reporte](../../previews/final-ui-quantity-homepage-filters-sku/README.md). **Nie sú vydávané za finálny WebKit test.**

## Čo stále musí prejsť pred vydaním

Na WebKit pri **320 / 375 / 390 / 393 / 430 / 768 / 1440 px**:

- Header, mobilné menu, podkategórie, menu scroll, mobilný košík a geometria.
- Všetky 3 homepage slidery, touch posuny, quantity, presný nákupný počet a oba stĺpce.
- Kategória: filtre, cenový drag, šípky, klik mimo, radenie, stock/ceny/karty a AJAX.
- Detail: galéria/lightbox/thumbs, živé varianty, množstvo/nákup, doručenie, detailné informácie, súvisiace/podobné.
- Mini/hlavný košík: plus/mínus, odstránenie, sumy a doprava zadarmo.
- Checkout: doprava/platba, formuláre a validácie, bez odoslania skutočnej objednávky alebo platby.
- Overflow, viditeľnosť ovládania, Grid/Flex, touch/click duplicity, Apollo a JS konzola.

Táto finálna funkčná matica vrátane checkoutu má stav **NOT RUN / blokovaná**, nie PASS. V tomto audite nebola vytvorená objednávka ani platba. Fyzický iPhone sa má doplniť, ak bude autorizovane dostupný; jeho absencia nenahrádza a neospravedlňuje chýbajúci WebKit test.

## Audit zdrojov a výkonu

Všetkých 32 zmenených src súborov bolo zahrnutých do porovnania; zmeny podľa oblastí sú v [kompletných draft release notes A–K](RELEASE-NOTES-DRAFT.md). Hlavné nové časti sú product-compact a recommendations; existujúce gallery/filter/qty/text-cleanup moduly boli lokálne rozšírené. Checkout, header controls, skladový backend, server, workflow a produkčný loader v repo nemajú oproti v0.6.13 zmenu funkčného kódu.

Quantity CSS sa už presunulo zo samostatných cart/detail výnimiek do spoločného základu; odstránili sa nadbytočné odporúčacie výnimky a staré homepage tokeny. Statická kontrola našla ďalšie kandidáty bez `var()` použitia v bundlovaných zdrojoch: `--ts-color-qty-border`, `--ts-color-qty-btn-bg`, `--ts-color-qty-text`. Neboli teraz odstraňované ani použité ako zámienka na povýšenie buildu. Žiadna riskantná oprava, rozpočet ani aplikačný zdroj sa v tomto release audite nemenil.

Verziové výnimky v build konfigurácii sú zatiaľ nastavené pre `0.6.13-compact.1`. Po splnení testov treba pri príprave stabilnej verzie explicitne zachovať rovnaké otestované limity **32 / 26,75 KiB** pre novú verziu a ponechať staršie verzie bez zmeny; nenavyšovať ich. Samotné predčasné prepísanie package na `0.7.0` by dnes použilo pôvodný fallback 30/15 KiB. Stabilný build preto zatiaľ nebol pripravený ani deklarovaný ako PASS.

## Loader, aktivácia a rollback

V živom HTML je **jeden** Timber loader. [Presná pozorovaná kópia](production-loader-observed.html) obsahuje navyše neaktívny CSS fallback/touch guard pre v0.6.5, ktorý v aktuálnom `shoptet/loader.html` nie je. Pri aktuálnej v0.6.13 sa tieto podmienky nespúšťajú. Tento rozdiel je evidovaný, nie odhadnutý či potichu prepísaný.

**Teraz nič neaktivovať.** Tag v0.7.0 neexistuje. [Presný postup budúcej manuálnej aktivácie a rollback](ACTIVATION-ROLLBACK.md) uvádza plánovaný riadok a platné pôvodné CDN adresy; budúce URL sú jasne označené za nepublikované.

[Stručné používateľské zhrnutie v slovenčine](USER-SUMMARY.sk.md).
