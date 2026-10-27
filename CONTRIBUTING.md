# Timberstore.sk — best practices pro vývoj

> Závazná pravidla pro veškerý vlastní kód na e-shopu timberstore.sk (Shoptet).
> Cíl: aby se po desítkách úkolů kód nerozsypal — vždy víme, co je na webu nasazené, odkud to přišlo a jak to vrátit.
>
> Stav: **schváleno 26. 9. 2026** — změny pravidel se zapisují sem a do CHANGELOGu.

---

## 0. Tvrdá pravidla (shrnutí — přebírá je `CLAUDE.md`)
1. **Co není v repu, neexistuje.** V Shoptet adminu ani na serveru se nic neupravuje ručně.
2. **V Shoptetu je jen loader.** Produkce = git tag přes jsDelivr, nikdy `@main`.
3. **Žádné tajné údaje v repu** — je veřejné. Klíče a URL feedů s klíčem jen v `.env` na serveru.
4. **Nastavení → CSS → JS.** Kód až tehdy, když to neumí admin.
5. **Modul dodržuje kontrakt**: `name` + `pages` + idempotentní `init`, spouštěný v try/catch.
6. **Selektory, eventy, detekce stránky a texty Shoptetu jen v `core/`.**
7. **CSS: `ts-` + BEM + `--ts-*` proměnné**, přepisy Shoptetu jen v `styles/overrides/`.
8. **Rozpočet: JS ≤ 30 kB, CSS ≤ 15 kB gzip**, nic blokujícího, PageSpeed nesmí klesnout.
9. **Před nasazením preview + checklist**; viditelné změny schvaluje klient.
10. **Hromadné importy: záloha exportem + dry-run + jen měněné sloupce.**
11. **Každá změna má kód karty z Trella**; každá změna v adminu jde do `ADMIN-CHANGES.md` i s původním stavem.
12. **E-shop na serveru Hetzner za běhu nezávisí.** Server dělá jen pomocné úlohy (obrázky, feedy, importy); frontend jde vždy z jsDelivr.

---

## 1. Základy

### 1.1 Zdroj pravdy = Git repo
- Veškerý vlastní kód (JS, CSS, HTML šablonky, backend úlohy) žije v **jednom GitHub repu**.
- Shoptet admin je **cíl nasazení, ne místo úprav**. V „Editoru HTML kódu" smí být jen loader (viz 3.1) a nic, co není v repu.
- Co není v repu, neexistuje. Když se na webu najde kód mimo repo, buď se převezme (1.3), nebo smaže.

### 1.2 Nasazení přes jsDelivr z git tagů
- Frontend se sestaví do `dist/` a vydá **git tagem** (`v1.4.0`, semver).
- Soubory se načítají z pevné verze: `https://cdn.jsdelivr.net/gh/<user>/<repo>@v1.4.0/dist/timber.min.js` — přes loader v Shoptetu (3.1), kde je verze uvedená na jediném místě.
- **Nikdy `@main` ani `@latest` v produkci** — branch odkazy jsDelivr cachuje nepředvídatelně (hodiny až dny).
- Verzované URL jsou neměnné → žádné ruční `?v=173`. Rollback = vrátit číslo verze v loaderu.
- Repo je **veřejné** (jsDelivr to vyžaduje). Důsledek: **do repa nikdy nejdou tajné údaje** — hesla, API klíče, ani URL feedů s klíčem v adrese (např. `feedKey=…`). Ty patří do `.env` na serveru (viz 4.5).

### 1.3 Stávající kód — přebírá se postupně
- Nový kód se píše rovnou podle tohoto standardu.
- Starý kód (timber-menu.js, slidery, ostatní skripty) se **převede do repa ve chvíli, kdy na něj sáhne úkol** — ne velkým refaktorem naráz.
- Při převzetí: zapsat do `LEGACY.md`, odkud skript pochází, kde se načítá a co dělá; odstranit duplicitní načtení.
- Inventář starého kódu se průběžně doplňuje v `LEGACY.md`.

### 1.4 Jazyk
- Tento dokument a komunikace: **česky**.
- Kód, názvy, komentáře, commit zprávy: **anglicky**.
- Texty pro zákazníka (UI): **slovensky**, držené na jednom místě (viz sekce 2).

---

## 2. Struktura JS/CSS a build

### 2.0 Pořadí řešení: nastavení → CSS → JS
- Než se napíše kód, ověřit, jestli to neumí **nastavení Shoptetu** (např. O3 poznámka a slevový kód, D2 skrytí parametrů). Nastavení nemá údržbu.
- Když nestačí nastavení, zkusit **CSS**. Teprve pak **JS**.
- Změny provedené v adminu (ne v kódu) se zapisují do `ADMIN-CHANGES.md` — co, kde, proč, datum, karta v Trellu.

### 2.1 Struktura repa
```
src/
  core/          # init, detekce stránky, eventy, selektory, texty, logger
  modules/
    qty-picker/  # jeden modul = jedna funkce
      index.js
      qty-picker.css
  styles/
    tokens.css   # --ts-* proměnné (barvy, mezery, breakpointy)
    overrides/   # přepisy Shoptet komponent, soubor na komponentu
  legacy/        # převzatý starý kód, než se přepíše
dist/            # výstup buildu (commituje se — jsDelivr ho servíruje)
backend/         # úlohy běžící na serveru Hetzner (sekce 4)
shared/          # utility sdílené frontendem i backendem
shoptet/         # loader.html — jediný kód vložený v Shoptetu (sekce 3)
server/          # konfigurace serveru: setup, docker-compose, Caddy, crontab
LEGACY.md  ADMIN-CHANGES.md  CHANGELOG.md
```

### 2.2 JavaScript
- **Vanilla JS (ES2020)**. jQuery jen pro napojení na Shoptet pluginy, které jinak ovládat nejdou — a vždy s komentářem proč.
- **Jeden globál**: `window.Timber` (verze, seznam modulů, debug). Nic dalšího do `window`.
- **Kontrakt modulu** — každý modul exportuje:
  ```js
  export default {
    name: 'qty-picker',
    pages: ['category', 'search'],   // kde se aktivuje
    init(root) { /* ... */ },        // musí být idempotentní
  };
  ```
- `core` volá `init` každého modulu v **try/catch** — pád jednoho modulu nesmí shodit ostatní ani Shoptet.
- **Idempotence**: `init` se smí zavolat opakovaně bez zdvojení (značka `data-ts-init` na elementu). Poučení z timber-menu.js načteného 2×.
- **Shoptet překresluje obsah AJAXem** (filtry, stránkování, košík) → moduly se znovu inicializují na Shoptet eventy (`ShoptetDOMPageContentLoaded`, `ShoptetCartUpdated` apod.). Názvy eventů jsou jen v `core/events.js`.
- **Detekce typu stránky** jen v `core/page.js`. Moduly ji nikdy nedělají samy.
- **Selektory Shoptetu** jen v `core/selectors.js`. Když Shoptet změní šablonu, opravuje se jedno místo.
- Vlastní elementy: styl přes třídy `.ts-*`, JS háčky přes `data-ts-*` atributy — styl a chování se neplete.
- **Texty pro zákazníka** (slovensky) jen v `core/texts.js`, žádné řetězce natvrdo v modulech.
- **Knihovny** přes npm s pevnou verzí, bundlované do balíku. Žádné další `<script>` z cizích CDN. Nejdřív použít, co už web má (např. slider knihovna u M1).

### 2.3 CSS
- Vlastní třídy s prefixem **`ts-` + BEM**: `.ts-qty-picker`, `.ts-qty-picker__btn`, `.ts-qty-picker--compact`.
- Barvy, mezery, rádiusy, breakpointy **jen jako `--ts-*` proměnné** v `tokens.css`. Žádné hex kódy v modulech.
- Breakpointy sjednocené se šablonou Shoptetu, definované jednou.
- Přepisy Shoptet tříd **jen v `styles/overrides/<komponenta>.css`**, u každého bloku komentář: co přepisuje a proč (+ karta v Trellu).
- `!important` jen proti inline stylům Shoptetu, vždy s komentářem.
- Mobile-first (`min-width` media queries) — mobil je většina provozu.

### 2.4 Build (esbuild)
- `npm run build` → `dist/timber.min.js` + `dist/timber.min.css` + sourcemapy.
- Formát IIFE (nic neuniká do globálního scope kromě `window.Timber`).
- Sourcemapy se publikují taky — repo je veřejné tak jako tak a v produkci se s nimi dá ladit.
- Prettier + ESLint s minimální konfigurací, spouští se před commitem.

---

## 3. Testování, nasazení, rollback

### 3.1 Loader — jediný kód v Shoptetu
V záhlaví Shoptetu je jen tento loader (zdroj v repu: `shoptet/loader.html`). Produkční verze se mění **jen tady, na jednom místě**.

```html
<script>
(function () {
  /* jshint evil: true */ // document.write below is intentional (render-blocking CSS)
  var BASE = 'https://cdn.jsdelivr.net/gh/Timberstore/timberstore@';
  var PROD = 'v1.4.0'; // ← produkční verze ('' = vypnuto pro zákazníky)
  var q = location.search.match(/[?&]ts_preview=([\w.\-]+)/);
  if (q) {
    document.cookie = q[1] === 'off' ? 'ts_preview=; max-age=0; path=/' : 'ts_preview=' + q[1] + '; max-age=604800; path=/';
  }
  var c = document.cookie.match(/(?:^|; )ts_preview=([\w.\-]+)/);
  var ok = c && /^(v\d+\.\d+\.\d+(-rc\.\d+)?|[0-9a-f]{7,40})$/.test(c[1]);
  var v = ok ? c[1] : PROD;
  window.TimberLoader = { version: v, preview: !!ok };
  if (!v) return; // PROD = '' → zákazníci nenačtou nic, funguje jen preview
  // CSS přes document.write: blokuje vykreslení (bez probliknutí)
  document.write('<link rel="stylesheet" href="' + BASE + v + '/dist/timber.min.css">');
  // JS jako element: neblokuje. V tomto bloku nikdy nepsat script tag jako text (ani v komentáři) — kontrola kódu v editoru Shoptetu na tom padá.
  var s = document.createElement('script');
  s.src = BASE + v + '/dist/timber.min.js';
  document.head.appendChild(s);
})();
</script>
```

- `PROD = ''` vypne náš kód pro zákazníky, preview přes `?ts_preview=` funguje dál. Používá se při prvním vložení loaderu (vyzkoušet a schválit dřív, než to zákazníci uvidí) a jako nouzový vypínač.
- Preview verze se načítá **jen z našeho repa** a jen s platným tagem nebo commit hashem (regex) — nic jiného se přes URL podstrčit nedá.
- V preview zobrazí `core` malý štítek „PREVIEW v1.5.0-rc.1", aby si ho nikdo nespletl s produkcí.

### 3.2 Testování a akceptace klientem
- Rozpracovaná verze se vydá jako **rc tag** (`v1.5.0-rc.1`) nebo se testuje přímo commit hashem.
- Zapnutí preview: `https://www.timberstore.sk/?ts_preview=v1.5.0-rc.1` (cookie platí 7 dní). Vypnutí: `?ts_preview=off`.
- **Viditelné změny** → klient dostane preview odkaz, schválí, teprve pak nasazení.
- **Technické změny** (výkon, SEO, opravy chyb) → bez schvalování, jen záznam v CHANGELOGu.

### 3.3 Checklist před nasazením
Všechno povinné, u každého releasu:
- [ ] Dotčené stránky na **mobilu 375 px** a **desktopu** (+ iPad na šířku, když jde o layout)
- [ ] **Safari na iOS** (reálný iPhone nebo BrowserStack)
- [ ] **Nákupní flow**: vložit do košíku → košík → doprava a platba → údaje (i když změna košík neřeší)
- [ ] **Konzole bez nových chyb** na homepage, kategorii, detailu a v košíku
- [ ] **Výkonový rozpočet** splněn (3.4)
- [ ] CHANGELOG doplněný, karta v Trellu odkazuje na verzi

### 3.4 Výkonový rozpočet

- **Mobile SKU `0.7.3-rc.7` (27. 10. 2026):** preberá rc.6 limity JS 32.5 / CSS 29.75 KiB bez navýšenia; namerané 32.43 / 29.67 KiB. Jedno mobilné CSS odkrytie existujúceho kódu. Staršie limity a loader zachované.

- **Card gap `0.7.3-rc.6` (27. 10. 2026):** zachováva rc.5 limity JS 32.5 / CSS 29.75 KiB bez navýšenia. Len dva tokeny PC rozostupov; predchádzajúce limity a loader zachované.

- **Filter/page scroll preview `0.7.3-rc.5` (27. 10. 2026):** zachované rc.4 limity JS 32.5 KiB / CSS 29.75 KiB bez navýšenia; namerané 32.43 / 29.65 KiB. Iba nové rozostupy PC kariet a zdieľaný tok/scroll mobilných panelov. Staršie rozpočty/tagy a produkčný loader zachované.

- **Filters/stock preview `0.7.3-rc.4` (27. 10. 2026):** JS limit zostáva 32.5 KiB, CSS 29.75 KiB podľa súhlasu 15. 10.; namerané 32.48 / 29.59 KiB. Zatváranie mobilných panelov pri opustení, celoplošné nadpisy filtrov a PC riadky dostupnosti. Staršie rozpočty/tagy a produkčný loader zachované.

- **Card edges preview `0.7.3-rc.3` (27. 10. 2026):** zachováva rc.2 limity JS 32.5 KiB / CSS 29.5 KiB, namerané 32.31 / 29.44 KiB. Len PC karty, explicitné jednotky cien a menšie označenia skladov. Staršie limity a produkčný loader bez zmeny.

- **Purchase alignment preview `0.7.3-rc.2` (27. 10. 2026):** JS 32.5 KiB / CSS 29.5 KiB podľa historického súhlasu 15. 10.; namerané 32.31 / 29.35 KiB. Iba CSS rozloženia PC kariet a tabuľky. Staršie rozpočty/tagy a produkčný loader zachované.

- **Desktop titles preview `0.7.3-rc.1` (27. 10. 2026):** JS 32.5 KiB / CSS 29 KiB podľa zaznamenaného súhlasu 15. 10.; výstup 32.31 / 28.94 KiB. Iba desktopové štyri riadky názvu a jemný oddeľovač. Limity starších verzií a produkčný loader nezmenené.

- **Stock/price preview `0.7.3-rc.0` (27. 10. 2026):** JS limit 32.5 KiB / CSS 28.875 KiB podľa súhlasu 15. 10. 2026, výstup 32.31 / 28.83 KiB. Zdieľané rozloženie kariet a zalomenie centrálneho skladu; pôvodné limity, stabilné tagy a produkčný loader zachované. Iba preview.

- **Stabilní v0.7.2 (27. 10. 2026, výslovný souhlas majitele s merge/vydáním/nasazením):** přebírá schválené rc.6 limity JS 32.25 KiB / CSS 28.75 KiB bez navýšení. Aplikační zdroje při povýšení beze změny, pouze číslo verze buildu. Safari/iPhone NOT TESTED; starší limity/tagy zachovány. Aktivace Shoptetu vyžaduje ověřený přístup do administrace.

- **Cart transition `0.7.2-rc.6` (27. 10. 2026):** zachované limity JS 32.25 KiB / CSS 28.75 KiB bez navýšení; naměřeno 32.20 / 28.71 KiB. Pouze preview, starší tagy/limity a produkční loader beze změny.

- **Open menu glyph `0.7.2-rc.5` (27. 10. 2026):** zachované rc.3/rc.4 limity JS 32.25 KiB / CSS 28.75 KiB bez navýšení. Pouze preview; starší limity, stabilní tagy a loader beze změny.

- **Menu toggle correction `0.7.2-rc.4` (27. 10. 2026):** zachovává rc.3 limity JS 32.25 KiB / CSS 28.75 KiB bez navýšení; naměřeno 32.10 / 28.53 KiB. Pouze preview, starší limity/tagy a loader beze změny.

- **Mobile menu preview `0.7.2-rc.3` (27. 10. 2026):** JS limit 32.25 KiB / CSS 28.75 KiB, naměřeno 32.10 / 28.54 KiB. Malé rozšíření pro kontaktní CTA a společné ikony/styly dle evidovaného souhlasu 15. 10. 2026. Starší preview/stabilní limity, tagy a produkční loader zůstávají beze změny.

- **Cart stability preview `0.7.2-rc.2` (27. 10. 2026):** zachované limity JS 32 KiB / CSS 28.5 KiB; naměřeno 31.98 / 28.26 KiB. Bez dalšího navýšení. Pouze preview, stabilní tagy a produkční loader beze změny.

- **Cart controls preview `0.7.2-rc.1` (27. 10. 2026):** JS limit 32 KiB, CSS 28.5 KiB; naměřeno 31.99 / 28.08 KiB. Rozšíření pouze pro lokální rozložení, šířky množství a nákupní barevnou politiku podle evidovaného souhlasu 15. 10. 2026. Limity stabilních vydání, jejich tagy i produkční loader zůstávají beze změny.

- **Cookies preview `0.7.2-rc.0` (27. 10. 2026):** JS limit 32 KiB, CSS 27.625 KiB; naměřeno 31.96 / 27.53 KiB. Malé rozšíření pouze pro nové barevné styly podle evidovaného souhlasu 15. 10. 2026. Stabilní v0.7.1, její limity a loader beze změny.

- **Stabilní v0.7.1 (27. 10. 2026, výslovný souhlas majitele s vydáním/nasazením):** přebírá otestované limity kandidáta rc.0: JS 32 KiB / CSS 27.5 KiB, bez dalšího navýšení. Aplikační kód při povýšení beze změny; starší limity zůstávají pevné. Safari/iPhone pro toto vydání NOT TESTED, nikoli PASS nebo automaticky převzatý waiver. Aktivace Shoptetu čeká na ověřený přístup do administrace.

- **Stabilita načítání celého webu, lokální kandidát `0.7.1-rc.0` (27. 10. 2026):** JS limit 32 KiB, CSS 27.5 KiB, naměřeno 31.96 / 27.43 KiB. Rozšíření CSS podle evidovaného souhlasu klienta 15. 10. 2026 pro společné nativní styly ovládání, rezervaci množství, první vykreslení KÓD/ZNAČKA a košíkové SVG. Limity stabilních vydání a produkční verze loaderu se nemění; bez tagu, release a nasazení.

- **Stabilná v0.7.0 (20. 10. 2026, výslovné schválenie majiteľa):** zachováva existujúci otestovaný limit JS 32 KiB / CSS 26,75 KiB z compact.1 bez navýšenia. Majiteľ výslovne schválil merge, produkčný build, tag a GitHub release; Safari/WebKit aj fyzický iPhone majú stav `WAIVED BY OWNER`, nie PASS. Externé živé varianty zostávajú `NOT VERIFIED`. Aktiváciu Shoptetu vykoná majiteľ manuálne, `PROD` ostáva v0.6.13. Staršie verzie a ich limity sa nemenia.

- **Homepage Cart & Quantity UI Fix, rovnaká preview `0.6.13-compact.1` (20. 10. 2026):** CSS limit 26,75 KiB, JS zostáva 32 KiB. Lokálna homepage geometria a zdieľané quantity tokeny; malé rozšírenie podľa historicky evidovaného súhlasu klienta 15. 10. (nižšie), bez opätovného pýtania. Stabilné verzie, loader a ich limity zostávajú nezmenené. Iba preview, bez merge, tagu, release a produkcie.

- **Popup + Recommendations Polish, rovnaká preview `0.6.13-compact.1` (20. 10. 2026):** limit JS 32 KiB a CSS 26,5 KiB. Natívne odporúčané nákupy, jednotky z verejného detailu a lokálne popup/related/similar štýly. Rozšírenie podľa historicky evidovaného súhlasu 15. 10.; stabilné verzie a ich limity zostávajú bez zmeny. Iba preview, bez tagu, merge a produkcie.

- **Final Product Card Polish, rovnaká preview `0.6.13-compact.1` (20. 10. 2026):** limit JS 31,25 KiB, CSS 25,5 KiB. Malé rozšírenie pre mobilný qty-picker a lokálne kartičkové štýly podľa zaznamenaného súhlasu 15. 10.; stabilné verzie, ich limity a produkčný loader zostávajú nezmenené. Bez release, tagu alebo merge.

- **PD Final Polish preview `0.6.13-compact.1` (19. 10. 2026):** JS 30,27 KiB / limit 31, CSS 24,69 KiB / limit 25. Rozšírenie iba pre toto preview podľa zaznamenaného súhlasu 15. 10.; limity `compact.0` a stabilných vydaní sa nemenia. Bez merge, tagu alebo produkčného nasadenia.

- **Izolované PD Compact PRO preview `0.6.13-compact.0` (19. 10. 2026):** CSS limit 24 KiB, výstup 23,91 KiB; JS 29,87 KiB / 30. Navýšenie podľa zaznamenaného súhlasu 15. 10. iba pre toto preview. Stabilná v0.6.13 a staršie limity sa nemenia. Bez merge/tagu/produkčného nasadenia.

- **Stabilná v0.6.13 (schválená 19. 10. 2026):** dokončené opravy homepage/Instagramu/košíka/pätičky bez nového produktového detailu. CSS limit 23,25 KiB (výstup 23,02 KiB), JS 30 KiB (29,55 KiB). Navýšenie podľa existujúceho súhlasu 15. 10.; skoršie tagy a ich limity zostávajú bez zmeny.

- **Stabilná v0.6.12 (schválená 18. 10. 2026):** iba schválené večerné úpravy FAQ/homepage/pätičky nad main v0.6.11, bez rozpracovaného detailu produktu. CSS limit 23 KiB (výstup 22,81 KiB), JS ostáva 30 KiB (29,14 KiB). Navýšenie podľa existujúceho súhlasu 15. 10.; limity ostatných vydaní zostávajú nezmenené.

- **Súhlas klienta 15. 10. 2026:** pri potrebnom rozšírení objednaných úprav možno zvýšiť kB rozpočet bez opätovného pýtania. Vždy zmerať skutočný gzip výstup, navýšenie evidovať pri konkrétnej novej verzii a zachovať pôvodné releasy aj ich limity. Tento súhlas nemení povinnosť preview, testovania ani schválenia merge/produkčného nasadenia.
- **Stabilná v0.6.11 (schválená klientom 16. 10. 2026):** povýšenie schválenej rc.4 bez zmeny funkčného kódu; zachovaný CSS limit 21 KiB gzip a JS 30 KiB. Predchádzajúce verzie a ich limity zostávajú nezmenené.
- **Preview 0.6.11-rc.4:** mobilný náhľad košíka, scroll lock a synchronizácia dopravy po AJAX; CSS limit 21 KiB gzip, JS 30 KiB. Navýšenie podľa súhlasu 15. 10. 2026, staršie limity a vydania bez zmeny. Iba preview pracovnej vetvy.
- **Preview 0.6.11-rc.3:** oprava kontaktných riadkov a foregroundov CTA, CSS limit zostáva 20,25 kB gzip; JS 30 kB. Bez zmeny limitov starších verzií.
- **Preview 0.6.11-rc.2:** mobilné checkout kontakty a klientom objednaná Emerald, CSS limit 20,25 kB gzip; JS 30 kB. Navýšenie podľa súhlasu 15. 10. 2026, pôvodné verzie/limity zostávajú zachované. Po následnom pokyne klienta iba preview pracovnej vetvy, bez merge a produkčného nasadenia.
- **Preview 0.6.11-rc.1:** dokončenie mobilného poradia dopravy, CSS limit zostáva 20,0 kB gzip; JS 30 kB. Audit farieb je iba dokumentácia.
- **Preview 0.6.11-rc.0:** mobilné karty dopravy, CSS limit 20,0 kB gzip; JS zostáva 30 kB. Produkčná v0.6.9 a jej limit zostávajú nezmenené.

- **Testovací preview 0.6.7 (aktualizováno se souhlasem klienta 13. 10. 2026):** CSS limit 18,25 kB gzip pouze pro tuto vývojovou verzi; JS zůstává 30 kB. Produkce a předchozí výjimky beze změny.
- **Testovací preview 0.6.8 (souhlas klienta 13. 10. 2026):** CSS limit 18,75 kB gzip pouze pro tuto vývojovou verzi; JS zůstává 30 kB. Produkce a předchozí výjimky beze změny.
- **Výjimka v0.6.9 (klient schválil vydání 14. 10. 2026):** schválený build si při vydání zachovává CSS limit 19,75 kB gzip a JS 30 kB. Jde o původní preview limit bez navýšení; výjimka je vázána pouze na package version 0.6.9. Ostatní verze a předchozí výjimky beze změny.

- **Testovací preview 0.6.6 (schváleno klientem 12. 10. 2026):** CSS limit 17 kB gzip pouze pro tuto vývojovou verzi; JS zůstává 30 kB. Produkční 0.6.5 beze změny.

- **Výjimka v0.6.5:** klient 9. 10. 2026 povolil CSS limit 16 kB pro testovací build; 12. 10. 2026 schválil finální 0.6.5 k vydání. Schválený build ponechává 16 kB CSS / 30 kB JS gzip. Výjimka ve build skriptu platí pouze pro package version 0.6.5; ostatní verze mimo výše schválené preview používají standardní 15 kB CSS limit.
- `timber.min.js` **≤ 30 kB gzip**, `timber.min.css` **≤ 15 kB gzip** — build při překročení **selže**.
- Žádný nový skript blokující vykreslování. Náš balík je vždy `defer`.
- PageSpeed Insights (mobil) před a po nasazení — skóre ani LCP/CLS **nesmí klesnout**. Výsledek se zapíše do CHANGELOGu.
- Obrázky přes CDN Shoptetu s parametry velikosti, s `width`/`height` (viz V2).

### 3.5 Postup vydání
1. Práce ve větvi `feature/<karta>` → merge do `main`.
2. `npm run release` — build, kontrola rozpočtu, zvýšení verze, git tag, push.
3. Preview s novým tagem → checklist → (u viditelných změn) schválení klientem.
4. Změnit `PROD` v loaderu v Shoptetu.
5. Zapsat do CHANGELOGu a do karty v Trellu.

### 3.6 Rollback
- Vrátit `PROD` v loaderu na předchozí tag. Hotovo do dvou minut, tagované soubory na jsDelivr se nemění.
- Změny v adminu Shoptetu git nevrátí → v `ADMIN-CHANGES.md` se vždy zapisuje **i původní stav**, aby šel obnovit.

---

## 4. Backend a automatizace (Hetzner)

E-shop zůstává na Shoptetu. Na serveru běží **jen pomocné úlohy**: stahování a úprava obrázků z feedů dodavatelů, úpravy feedů, stahování dokumentace, noční index pro vyhledávání a importní soubory pro Shoptet.

### 4.1 Hlavní pravidlo: e-shop na serveru nezávisí
- Když server spadne, **zákazník nic nepozná** — jen se dočasně zastaví úlohy.
- Frontend (JS/CSS) se **nikdy** nenačítá ze serveru, jen z jsDelivr (sekce 1.2).
- Pokud by nějaký výstup potřeboval prohlížeč zákazníka (např. index vyhledávání u P3), publikuje se na jsDelivr / CDN, ne přímo ze serveru.

### 4.2 Server
- **Hetzner Cloud CX23** (2 vCPU, 4 GB RAM), lokalita Německo. Při nedostatku výkonu škálovat na CX33.
- Úlohy v **Node.js**, každá v `backend/<uloha>/`. Sdílené utility (párování kódů, parsování feedů) v `shared/`.
- Běh v **Dockeru** (docker compose), plánování přes **cron** na hostu. Crontab je v repu.
- Zpracování obrázků přes **sharp** (bez omezení CPU, žádné dávkování kvůli limitům).
- Na serveru nejsou osobní údaje zákazníků, pokud se to výslovně nerozhodne.

### 4.3 Server jako kód
- Veškerá konfigurace je v repu ve složce `server/`: `setup.sh` (první instalace), `docker-compose.yml`, `Caddyfile`, `crontab`.
- **Na serveru se nic neupravuje ručně** — stejné pravidlo jako u Shoptet adminu. Změna = commit → nasazení.
- Server musí jít z repa **postavit znovu do půl hodiny** (nový server + `setup.sh` + `.env`).
- Nasazení: `server/deploy.sh` (git pull + `docker compose up -d --build`), později případně přes GitHub Actions.

### 4.4 Zabezpečení
- Přihlášení **jen SSH klíčem**, root login a hesla vypnuté.
- **Firewall** (Hetzner Cloud Firewall): otevřené jen 22 (SSH), 80 a 443.
- **unattended-upgrades** pro automatické bezpečnostní aktualizace systému.
- Zapnuté **zálohy / snapshoty Hetzneru**.

### 4.5 Tajné údaje
- API klíče, URL feedů s klíčem (`feedKey=…`), přístupy → **jen v `.env` na serveru** (práva 600). V repu je jen `.env.example` bez hodnot.
- Do repa nepatří ani IP adresa serveru a přístupové údaje — repo je veřejné.
- Nikdy nevypisovat tajné údaje do logů.

### 4.6 Výstupy a cesta dat do Shoptetu
- Na běžném tarifu Shoptet **nemá API** → data se do Shoptetu dostávají **importem** (CSV/XML). Server vygeneruje importní soubor, import se spouští v adminu (nebo z URL, pokud to tarif umožní — ověřit).
- Veřejné výstupy (upravené obrázky, importní soubory) servíruje **Caddy s automatickým HTTPS**, výhradně ze složky `public/`.
- Veřejné výstupy **nesmí obsahovat nákupní ceny, marže ani jiná citlivá data** (poučení z Wavy Boats — výstup se vždy filtruje na povolená pole).
- Úlohy jsou **idempotentní**: opakovaný běh nevytvoří duplicity (porovnání přes hash / kód produktu).

### 4.7 Povinné pojistky u hromadných změn
- **Záloha exportem před každým importem** — export dotčených produktů uložený na serveru s datem (`backups/YYYY-MM-DD-<uloha>.csv`, **mimo `public/`**, mimo repo). Admin Shoptetu nemá undo, záloha je jediná cesta zpět.
- **Dry-run s reportem** — skript nejdřív jen vypíše, co by změnil (počet produktů, které sloupce, ukázka 10 řádků). Import až po kontrole reportu.
- Import obsahuje **jen kód produktu a měněné sloupce** — nikdy celý produkt, aby se omylem nepřepsaly ceny nebo sklad.

### 4.8 Monitoring
- **Dead man's switch** (healthchecks.io, free): každá úloha po úspěšném doběhnutí pošle ping. Když ping nepřijde včas, přijde e-mail — pozná i úlohu, která se vůbec nespustila.
- Při chybě úloha pošle ping „fail" s krátkou zprávou → okamžitý e-mail.
- **Týdenní souhrnný report** — samostatná úloha: kolik obrázků staženo, kolik produktů stále bez obrázku / dokumentace, počet chyb.
- Logy s rotací (limit velikosti logů v Dockeru), aby nezaplnily disk.

---

## 5. Dokumentace a proces

### 5.1 Trello ↔ kód
- Každá karta má **krátký kód** (M2, C3, V1…). Karty bez kódu (např. „NOVÉ · …") ho dostanou, když se přesunou do „dělám teď".
- Větev: `feature/m2-cart-modal`. Commit: `M2: lock body scroll in cart modal`.
- Po nasazení komentář v kartě: **„Nasazeno ve v1.5.0 (datum)"** + odkaz na tag. Z karty se dá dohledat kód a z kódu karta.

### 5.2 Soubory v repu
| Soubor | Obsah |
|---|---|
| `README.md` | Jak repo rozběhnout, build, release, preview |
| `CONTRIBUTING.md` | Tento dokument |
| `CLAUDE.md` | Tvrdá pravidla ze sekce 0 + odkaz na CONTRIBUTING.md — každá AI session začíná se stejnými pravidly |
| `CHANGELOG.md` | Za každou verzi: datum, kódy karet, co se změnilo, PageSpeed před/po |
| `LEGACY.md` | Inventář převzatého starého kódu (odkud, kde se načítal, co dělá, stav převodu) |
| `ADMIN-CHANGES.md` | Změny v adminu Shoptetu: co, kde, proč, **původní stav**, datum, karta |

### 5.3 Účty a vlastnictví
- **GitHub repo** v samostatné organizaci **Timberstore**, vlastněné firmou klienta (kontakt info@timberstore.sk). Klient i Kryštof jsou Owner — klient může přidat jiného vývojáře a odebrat přístupy i bez Kryštofa. Samostatná organizace (ne glos-optimalizace), aby klient neviděl repa jiných klientů.
- **Hetzner Cloud** na účtu klienta (platí provoz), Kryštof jako člen projektu. Na serveru neběží úlohy jiných klientů. Když spolupráce skončí, nic se nerozbije.
- **Shoptet admin** přes vlastní uživatelský účet, ne sdílené přihlášení klienta.

### 5.4 Komunikace s klientem
- **Měsíční souhrn slovensky** — lidsky psaný přehled z CHANGELOGu: co se změnilo, co to přináší, co má klient vyzkoušet. Slouží zároveň jako podklad k faktuře.
- Stav jednotlivých úkolů klient vidí v Trellu.
