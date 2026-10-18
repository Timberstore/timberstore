# TimberStore — skladové množstvá, samostatný preview

Stav: implementácia pripravená na pripojenie; **skutočné množstvá po skladoch zatiaľ nemožno overiť**. Základ v0.6.13, commit `0c726ffe6986192721a3b62b3743b31c78a01b50`. Vetva `preview/stock-by-warehouse-20261019`. Žiadny merge, release, zmena produkčného loadera ani administrácie. Číslo balíka zostáva 0.6.13; build sa identifikuje ako `v0.6.13-preview.warehouse-stock`. Odmietnutý redizajn detailu sa neprenáša.

## 1. Preskúmané existujúce súbory

`CONTRIBUTING.md`, `CLAUDE.md`, `shoptet/loader.html`, `scripts/build.mjs`, `src/main.js`, `src/main.css`, `src/core/{index,selectors,events,texts}.js`, moduly `list-view`, `product-text-cleanup`, `qty-picker`, `cart-count`, `gallery-swipe`, a štýly `src/styles/overrides/{product-detail,product-card}.css`. Preverená história posledného release a predchádzajúcich zmien detailu. Existujúce frontendové zdroje neposkytujú dôveryhodné rozdelenie `ext` na požadované sklady; názvy dostupností sa nesmú použiť ako mapovanie.

## 2. Zmenené a nové súbory

- `shared/warehouse-stock/model.js`: spoločná normalizácia a validácia identít, skladov, čísel, rezervácií a expirácie.
- `src/core/warehouse-stock.js`: jedna fronta, batching, cache a zdroj pre celý frontend; `warehouse-identity.js`: oddelenie produktového ID, GUID, SKU a priceId.
- `src/modules/warehouse-stock/{index.js,warehouse-stock.css}` a `src/styles/overrides/warehouse-stock.css`: detail, varianty a existujúce dostupnosti kariet.
- `src/core/{selectors,events,texts}.js`, `src/main.{js,css}`, `src/modules/list-view/list-view.css`: registrácia, selektory, udalosti, slovenské texty, zachovanie tučných počtov v LIST.
- `backend/warehouse-stock/{provider,server,probe}.js`, `.env.example`, `README.md`: bezpečný GET-only Shoptet adaptér, dávkový frontendový endpoint a návod. **Nie je nasadený.**
- `tests/warehouse-stock/*.test.js`, `browser.mjs`, `package.json`, `eslint.config.js`: kontraktové testy. `.gitignore`: ochrana vnorených `.env`. `scripts/build.mjs`, `dist/*`: izolovaný preview build. `CONTRIBUTING.md` a `CHANGELOG.md`: evidencia preview. Tento dokument a výsledky testov.

Rozpočet iba pre `TIMBER_PREVIEW=warehouse-stock`: JS 33 KiB gzip, CSS 23,5 KiB. Stabilné limity sa nemenia. Navýšenie je izolované podľa skoršieho oprávnenia pre preview rozpočty, nie schválenie produkčného nasadenia. Trello karta k tomuto novému zadaniu nebola dodaná; nevymýšľam jej identifikátor.

## 3. Odkiaľ presne môžu prichádzať množstvá

**Skutočne pozorované verejné dáta (18. 10. 2026 UTC):**

Produkt `/k-strongsinks-s3-set-drez-zala-1000x500mm-granit-bezova-bateria-ipoly-cierna/`: ID `347129`, GUID `6cba90bc-3db0-11f1-a956-bc241158b559`, SKU `549369`, priceId `347405`. `getShoptetDataLayer('product').codes` obsahuje `quantity:"23"`, ale `stocks:[{id:"ext",quantity:"23"}]`. Samostatný zoznam skladov obsahuje len `ext`, názov `Sklad`. Jednotka produktu je `sada` — nemožno naslepo doplniť `ks`.

`getShoptetProductsList()` je mapovaný cez **priceId**, obsahuje `base_id`, `guid`, `content_ids` a variantové údaje; nie je to autoritatívny zoznam množstiev podľa dvoch skladov. HTML obsahuje produktové ID, GUID a SKU. Text „Centrálny sklad (23 sada)“ **nedokazuje**, že `ext` je `SKLAD-CSNK`.

Natívny frontend používa `shoptet.config.stockAmountUrl`, aktuálne `/action/ProductStockAmount/`. Overený read-only dávkový GET s `ids[]=347129` a hlavičkou `X-Shoptet-XHR: Shoptet_Coo7ai` vrátil:

```json
{"payload":{"products":{"347129":{"codes":{"549369":{"amount":"23","stocks":{"ext":"23"}}}}},"stocks":{"ext":{"title":"Sklad","isDeliveryPoint":0}}}}
```

Aj 87 vzoriek z kategórií Úchytky, SPAX a Kinetické vypínače vrátilo len `ext`. To nie je dôkaz o celom katalógu, ale neposkytuje mapovanie požadovaných skladov. Identifikátory Hričov/CSNK **neboli získané**. Natívna cesta je preto iba detekcia; overenie jej predajnej sémantiky je navyše predvolene vypnuté buildovým príznakom.

**Pripravený serverový zdroj:** `https://api.myshoptet.com/api/products/{guid}?include=perStockAmounts`, `data.variants[].perStockAmounts[]` s `stockId`, `amount`, `claim`; jednotka z `data.variants[].unit`. `GET /api/stocks` poskytne ID a názvy; `GET /api/eshop` potvrdzuje projekt 765909. Používajú sa iba verejne viditeľné produkty (`visibility=normal`) a viditeľné varianty. Interné fyzické množstvá sa nesmú vydávať za objednateľné.

Schéma overená v [oficiálnom OpenAPI Shoptet](https://github.com/Shoptet/developers/blob/497d871fdf12a6d1e5182e097ad681c8c16928f1/openapi/openapi.yaml), commit z 15. 10. 2026. `perStockAmounts` vyžaduje skladový modul. Priame dokumentačné weby boli v tomto prostredí blokované sieťovým proxy; použitý bol oficiálny zdroj schémy z GitHubu. **Schéma nenahrádza overenie odpovede skutočného účtu a významu amount/claim na známej rezervácii.**

## 4. Identifikácia skladov a pravidlá

Jedinečný presný názov `SKLAD-HRICOV` → `hricov` → `SKLADOM`; `SKLAD-CSNK` → `csnk` → `CENTRÁLNY SKLAD`. Alternatívne výslovne overené ID v serverovej konfigurácii. Nejednoznačné/rovnaké ID, chýbajúci sklad alebo neznáme množstvo znamená pôvodnú dostupnosť. Nikdy sa nepoužíva spoločný `amount` ako množstvo jedného skladu. Obe jednotlivé množstvá musia byť známe; chýbajúci záznam nie je nula.

Hričov je prvý, centrálny druhý; nulové a záporné výsledné zásoby nemajú riadok. Obe nuly zachovajú Shoptet stav vrátane možnosti objednávky. Záporné dostupné množstvo sa pre zobrazenie oreže na nulu. Čísla s rezerváciami sa spracujú iba po výslovnej konfigurácii overeného režimu; chýbajúca rezervácia pri odčítavaní nie je nula. Jednotka sa číta z overených dát, neodhaduje sa.

## 5. Varianty a karty

Detail spája aktuálny `priceId` z formulára s trackingovým `base_id` a presným SKU v `content_ids`, overeným proti kódom produktu. Neznámy priceId sa neodhaduje z viditeľného textu, ktorý ešte môže patriť predchádzajúcej voľbe. Nevybraný/neznámy variant obnoví natívnu dostupnosť. Generácia požiadavky a znovu overená identita zabránia zobrazeniu oneskorenej odpovede starého variantu.

Karty berú identitu z existujúcich `data-micro-product-id`, `data-micro-identifier` a jednoznačného `[data-micro=sku]`. Viac SKU na jednej karte sa nesčíta. Rovnaký modul zachytí existujúce karty kategórií, vyhľadávania a súvisiacich/odporúčaných produktov aj po AJAX vložení, ak používajú túto Shoptet štruktúru. Neštandardný markup sa bezpečne preskočí. Natívne uzly/variantové háčiky ostávajú na mieste; nemenia sa ceny, množstevné vstupy, formuláre, skladové limity, košík ani doručovacie pravidlá. Bloky s nerozlíšiteľným priamym textom sa neprepisujú.

## 6. Aktualizácie a výkon

[Podrobný kontrakt, konfigurácia a limity backendu](../../../backend/warehouse-stock/README.md).

Číta sa pri otvorení detailu a pri priblížení kariet do viditeľnej oblasti, po zmene variantu a po AJAX načítaní. Batching 24 položiek, 2 súbežné browser požiadavky, cache 400 identít; server 4 súbežné API GET a 1 000 GUID v cache. Žiadny katalógový download ani statické množstvá. Fronta a globálne rozpočty sú obmedzené. Počiatočné opakované overenie po načítaní Apollo je obmedzené, bez nekonečnej MutationObserver slučky.

Platnosť množstva je 30 sekúnd od serverového pozorovania; cache jeho vek nepredlžuje. Pri expirácii sa čísla skryjú a obnoví sa zdroj, pri chybe zostáva Shoptet. Nie je to real-time synchronizácia. Dočasne skrytá karta sa znovu načíta pri návrate; skrytá karta prehliadača obnoví stav pri zviditeľnení. Spracovanie importu/feedu/Mergada pred zápisom do Shoptetu má vlastné oneskorenie. Metadata skladov sa overujú každých 5 minút; verejný neidentifikovateľný sklad má tiež 5-minútové obmedzenie opakovanej detekcie. API webhooky sú dokumentované, ale prijímač/webhooková synchronizácia sa v tomto preview nenasadzujú.

## 7. Obmedzenia

Chýba bezpečný API prístup, skutočné ID oboch skladov, overenie fyzické vs. dostupné množstvo a serverový hosting s HTTPS. V dostupnom prostredí nie sú nakonfigurované prihlasovacie údaje ani oprávnenie servera. Tieto prekážky znemožňujú reálne end-to-end overenie počtov. Priamy frontend ich aktuálne neobsahuje. Verejný preview preto správne zobrazuje **pôvodnú dostupnosť**, nie vymyslené riadky 12/45. Modelové testy nie sú dôkazom reálnych zásob.

Pred produkciou treba reálny variantový produkt a vzorky všetkých výnimiek (backorder, bez skladovej evidencie, rezervácia, jeden aktívny sklad, nuly), overenie doručovacích termínov a testy výkonu pri skutočnej návštevnosti/API kvóte. Dodacie texty sa automaticky nemenia na 1–2/5 dní, keďže neboli overené príslušné produktové pravidlá.

## 8. Testy

Výsledky a rozlíšenie skutočných a modelových dát sú v `test-results.json`. Node kontrakty pokrývajú null/false/prázdne/nečíselné/limitované hodnoty, neznámy sklad, explicitné rezervácie, zlomky, nuly, skryté produkty, chybné identity, expiráciu, batching, deduplikáciu, limity súbehu/API, HTTP validáciu, CORS, chýbajúci zdroj a odmietnutie iného e-shopu. **19/19 Node testov prešlo**, lint zahŕňa aj backend. Oba build režimy prešli; stabilný build vylučuje nový skladový JS, finálny `dist/` je preview (32,78 KiB JS / 23,17 KiB CSS gzip).

Na skutočnom verejnom detaile bol zachovaný natívny stav (23 sada), cena a formulár pri 320/375/768 a približne 1440 px (mobilná emulácia pri desktopovej šírke hlásila viewport 1444). V kategórii bolo 40 existujúcich kariet a pôvodná dostupnosť v GRID aj LIST. Nedostupnosť Hričov/CSNK bola správne diagnostikovaná. Na reálnej šablóne s **výslovne podvrhnutými modelovými** odpoveďami a variantmi prešli A → B, oneskorená A, poradie skladov, nulový/nevybraný variant a zachovanie natívnych uzlov. Tieto počty sa do verejného preview nedostali.

Izolovaný Chromium test skutočného modulu s modelovým backendom navyše overil karty, GRID/LIST, AJAX doplnenie, nulový a nevybraný variant, zachované doručovacie texty/formulár a skrytie expirovaných počtov pri 503. Bez horizontálneho overflow pri 320/375/768/1440 px. Opakovanie: `PLAYWRIGHT_MODULE=/cesta/k/playwright-core CHROMIUM_PATH=/usr/bin/chromium node tests/warehouse-stock/browser.mjs` (vyžaduje externú inštaláciu Playwright/Chromium; nová závislosť sa do storefrontu nepridáva). Voliteľne `STOCK_TEST_ARTIFACT_DIR=work/stock-tests` uloží iba modelové dôkazy.

Lighthouse ani skúška pri reálnej návštevnosti neprebehli. Sieťový browser harness blokoval nesúvisiace analytické služby; nejde o úplný audit tretích strán. Neodosielala sa objednávka ani položka do košíka.

## 9. Potrebné nastavenia

Postup a všetky názvy premenných sú v backend README a `.env.example`. Tajný token patrí len do serverového úložiska tajomstiev. Neposielajte ho do chatu ani repozitára. Bez admin prístupu nemožno spoľahlivo uviesť ani overiť celý slovenský klikací chodník nastavení; sekcia API a oprávnenia sú uvedené podľa oficiálnej dokumentácie. Žiadna zmena nastavení sa v tomto zadaní nevykonala.

## 10. Preview

Na tomto commite použite `https://www.timberstore.sk/?ts_preview=CELÝ_COMMIT_SHA`; presný odkaz je v záverečnej správe. Loader uloží preview cookie pre tento prehliadač. Návrat na produkciu: `https://www.timberstore.sk/?ts_preview=off`. Build: `TIMBER_PREVIEW=warehouse-stock npm run build`. Bez tohto prepínača sa nový modul odstráni z JS; navyše vyžaduje preview stav loadera. Produkčná verzia ani tag sa nemení.
