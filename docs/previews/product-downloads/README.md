# Súbory na stiahnutie – lokálny kandidát 0.7.5-rc.0

Pripravené 30. 10. 2026. **Nevydané. Pracovný commit bude sprístupnený pre výslovne vyžiadaný preview (30. 10. 2026). Bez merge, tagu, GitHub release, Sites registrácie a produkčného nasadenia.** Produkčný loader ostáva nezmenený. Číslo v package.json označuje iba lokálny kandidát.

## Úprava

- Detailový modul premenuje iba záložku príloh vrátane Apollo mobilného prepínača. Počet ostáva súčasťou natívneho textu.
- Pôvodný produktový nadpis nahradí stály nadpis a podnadpis. Zachová rám záložky, jej ID, ovládanie a stav.
- Plnošírkové kompaktné riadky, dokumentová ikona, pravá šípka, jemný oddeľovač, hover, klávesnicový focus a zalamovanie dlhých názvov. Oranžová #C97A2B; Raleway/Open Sans z existujúceho webu.
- Zachová pôvodné textové uzly názvu a pôvodný element odkazu/href. Formát len z explicitného MIME alebo prípony cesty URL, nikdy z obsahu, query názvu alebo predpokladu. Žiadne požiadavky na dokumenty, AI analýza či mapovanie produktov.
- Externé HTTP(S) odkazy dostanú novú kartu s noopener/noreferrer. Nevytvára vnorené tlačidlá ani nevynucuje download. Chybná/nepodporovaná URL ostáva v pôvodnom zobrazení.
- Opakované init preskočí označené odkazy, využíva existujúce core udalosti. Jeden lokálny observer iba v sekcii príloh zachytí oneskorené Apollo prvky; nepridáva globálny observer.

## Zmenené súbory

Nové: `src/core/downloads.js`, `src/modules/product-downloads/index.js`, `src/styles/overrides/product-downloads.css`, `scripts/test-downloads.mjs`, dokumenty v tomto adresári.

Upravené: `src/core/selectors.js`, `src/core/texts.js`, `src/main.js`, `src/main.css`, `src/styles/tokens.css`, `package.json`, `package-lock.json`, `scripts/build.mjs`, `CONTRIBUTING.md`, `CHANGELOG.md` a štyri generované JS/CSS súbory v `dist/` vrátane sourcemáp.

Kód Trello karty nie je v zadaní: nepriraďuje sa vymyslená karta ani sa nepíše do externej aplikácie.

## Overenie

| Kontrola | Stav |
| --- | --- |
| ESLint | PASS |
| Build | PASS |
| Gzip | JS 34.01 KiB / lokálny limit 34.25; CSS 30.89 KiB / lokálny limit 31 |
| 18 URL/MIME prípadov, neznámy formát, neplatná URL a nepovolený protokol | PASS – Node |
| Textové premenovanie bez/z počtom 1, 2, 27, opakované premenovanie | PASS – Node |
| Súvisiace/podobné produkty a Diskusia – textové premenovanie | PASS – Node |
| Registrácia iba pre detail | PASS – Node |
| 0/1/2/viac príloh – reálne DOM | NOT TESTED |
| Opakované init, oneskorené Apollo hlavičky, AJAX a prepínanie záložiek v reálnom DOM | NOT TESTED |
| Desktop, 375/320 px, iPad, dlhé názvy a klávesnica – vizuálne | NOT TESTED |
| Fyzický iPhone/Safari | NOT TESTED |
| Galéria, ceny, dostupnosť, košík, popis, diskusia, homepage/kategória – funkčný regresný test | NOT TESTED |
| PageSpeed pred/po | NOT TESTED |

Príkazy: `npm run lint`, `npm run build`, `node scripts/test-downloads.mjs`, `git diff --check`.

Shell nemá funkčné spojenie s proxy (`curl: Failed to connect to proxy port 8080`). Nástroj webového vyhľadávania prečítal verejný produkt, ale neposkytol raw DOM/úplné href. K dispozícii sú historické Apollo JS/CSS v pracovnom priestore, ktoré potvrdzujú #relatedFiles, li a, h3 a mobilný .js-detail-tab-item. To nie je plná verifikácia aktuálneho živého HTML. Podporované prehliadačové QA nie je dostupné. Žiadne chýbajúce kontroly sa neoznačujú PASS.

Pred schválením vydania dokončiť označené kontroly na aktuálnom DOM a overiť všetky pôvodné href. Zdrojové oblasti mimo príloh nemajú cielené zásahy, ale regresné testy ešte neprebehli.

Samostatná diagnostika a presný plán bezpečného testu: `DIAGNOSTIKA.sk.md`. Správanie ručného názvu po importe je zatiaľ **neoverené**.

## Lokálny fixture

`work/downloads/preview.html` je samostatný interaktívny fixture generovaný z nového modulu a CSS. Obsahuje 0/1/2/5 príloh, dlhý názov, známy/neznámy formát, opakované init a DOM kontrolu spúšťanú až pri otvorení v prehliadači. Generátor: `node work/downloads/make-preview.mjs`. Fixture sa tu v prehliadači nespustil, preto nie je dôkazom PASS. Samostatný fixture nie je publikovaný; požadovaný preview používa natívny loader s commit hashom. Predpísaný adresár výstupov `/codex/browser/.../output` nie je v tomto cloudovom prostredí zapisovateľný (read-only koreň); nevytvára sa nefunkčný odkaz na prílohu.

## Sprístupnený preview pracovnej vetvy

Majiteľ 30. 10. 2026 potvrdil pokračovanie zaužívaného commit-preview postupu z predchádzajúcich TIMBERSTORE chatov. Commit `a221c7affdf0c207953fe8d3cbe37cb13cd1bb42` je na vetve `feature/product-downloads-preview`, bez tagu, release, merge a produkčného nasadenia.

Preview: https://www.timberstore.sk/spojovacia-lista-rohova-na-pracovnu-dosku-38-l-p-hlinik/?ts_preview=a221c7affdf0c207953fe8d3cbe37cb13cd1bb42

CDN JS/CSS majú overenú presnú zhodu s lokálnym buildom (`cdn-assets.json`). Po použití podporovaného sieťového oprávnenia shellu sa načítalo aj aktuálne HTML produktu 313668: selektory a obe pôvodné URL sú potvrdené. Predchádzajúca poznámka o nefunkčnom proxy opisuje stav pred týmto overením. Obsah dokumentov sa neotváral. Vizuálny browser/Safari test ostáva NOT TESTED.

## Doladenie 0.7.5-rc.1

Novšie výsledky a rozsah vizuálneho doladenia sú v `POLISH.sk.md` a `polish-local-qa.json`. Predchádzajúce tabuľky opisujú prvý kandidát; doladenie má overené reálne Chromium DOM na 320/375/390/768/1024/1440 px vrátane dotykovej emulácie, klávesnice a pôvodných URL. Safari/physical iPhone ostáva NOT TESTED.
