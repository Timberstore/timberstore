# Aktivácia a rollback — pripravený postup, nevykonávať pred testami

## Aktuálny stav

Živá produkcia je **v0.6.13**. WebKit gate je zablokovaný; nová verzia, tag ani merge zatiaľ nevznikli. **Nasledujúci plán nie je povolenie aktivovať neexistujúcu v0.7.0.**

Presný pozorovaný pôvodný loader: [production-loader-observed.html](production-loader-observed.html). Zachováva aj neaktívne v0.6.5 fallback podmienky. Agent loader v Shoptete nemenil.

## Kroky pred možnosťou aktivácie

1. Sprístupniť zodpovedajúci Playwright WebKit a živý externý variantový zdroj. Vykonať celú povinnú testovaciu maticu z README; fyzický iPhone doplniť, ak bude autorizovane dostupný.
2. Pri zlyhaní testu, neoverenej Safari kompatibilite alebo merge konflikte vydanie zastaviť. Nezvyšovať rozpočty automaticky ani nerobiť riskantné opravy na obídenie gate.
3. Obnoviť stav origin/main a tagov. Navrhnutá minor verzia podľa existujúceho release skriptu je **v0.7.0**, pokiaľ medzičasom nevznikne iný release.
4. Explicitne pripraviť stabilnú package/build konfiguráciu so zachovaním súčasného testovaného rozpočtu 32 KiB JS / 26,75 KiB CSS a starších limitov. Teraz je táto výnimka iba pre compact preview.
5. Lint/build/diff a kontroly konkrétneho finálneho buildu, potom merge podľa projektového postupu a nový immutable tag/release. Žiadne prepisovanie tagov.
6. Overiť obe nové CDN URL a bajtovú zhodu s konkrétnym vydaným buildom. Doplniť presný release commit SHA a finálne schválené tag číslo do dokumentácie.

**Nepublikované plánované adresy — teraz ich nepoužívať:**

- `https://cdn.jsdelivr.net/gh/Timberstore/timberstore@v0.7.0/dist/timber.min.css`
- `https://cdn.jsdelivr.net/gh/Timberstore/timberstore@v0.7.0/dist/timber.min.js`

## Manuálna aktivácia používateľom až po vyššie uvedených podmienkach

V Shoptete **Vzhľad a obsah → Editor HTML kódu → Záhlavie**, v existujúcom jedinom Timber loaderi zmeniť iba tento riadok:

```js
var PROD = 'v0.6.13';
```

na skutočne vydaný a otestovaný tag. Ak bude finálne vydaný navrhnutý v0.7.0:

```js
var PROD = 'v0.7.0';
```

Ostatný loader, fallback podmienky a obsah záhlavia zachovať. Nevkladať druhý loader. Tento riadok je zatiaľ iba plán; **tag v0.7.0 neexistuje**.

Netreba meniť CSS/JS query parametre ani pridávať `?v=`. Verzia je priamo súčasťou immutable CDN cesty a loader od nej odvodí obidva súbory.

Po uložení otvoriť `https://www.timberstore.sk/?ts_preview=off` a novú čistú reláciu. Overiť `TimberLoader.preview === false` a zhodu `TimberLoader.version` aj `Timber.version` s finálnym tagom. Stará preview cookie inak prekrýva PROD. Skontrolovať header, nákup, košík a dopravu; nevytvárať skúšobnú platbu alebo objednávku bez potreby.

## Rollback na poslednú skutočne potvrdenú produkciu

Tag **v0.6.13**, source commit **0c726ffe6986192721a3b62b3743b31c78a01b50**.

Overené pôvodné adresy:

- CSS: https://cdn.jsdelivr.net/gh/Timberstore/timberstore@v0.6.13/dist/timber.min.css
- JS: https://cdn.jsdelivr.net/gh/Timberstore/timberstore@v0.6.13/dist/timber.min.js

V rovnakom existujúcom loaderi vrátiť iba:

```js
var PROD = 'v0.6.13';
```

Otvoriť `https://www.timberstore.sk/?ts_preview=off`, obnoviť v čistej relácii a overiť obe runtime verzie `v0.6.13`, `preview=false` a načítanie pôvodných CDN súborov. Query parametre ani tagy sa nemenia/neprepisujú, netreba ďalšie programovanie. Pri potrebe obnovy celej pôvodnej vlastnej loader časti vychádzať z archivovaného pozorovaného súboru, **nenahrádzať ním nesúvisiace Shoptet záhlavie**.

Keďže v tomto audite neprebehla aktivácia, produkcia už na v0.6.13 zostáva a rollback teraz netreba vykonávať.
