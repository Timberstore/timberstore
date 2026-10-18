# Změny v adminu Shoptetu

Git tyto změny nevrátí — proto se vždy zapisuje i **původní stav**.

| Datum | Karta | Kde (cesta v adminu) | Co se změnilo | Původní stav | Proč |
|---|---|---|---|---|---|
| 2026-09-26 | M1 | Vzhled a obsah → Editor HTML kódu → Záhlaví | Na konec přidán loader z `shoptet/loader.html` s `PROD = ''` (zákazníci nenačtou nic, funguje jen `?ts_preview=`). Stávající obsah beze změny. | [`shoptet/backup/2026-09-26-zahlavi.html`](shoptet/backup/2026-09-26-zahlavi.html) | Zapnout nasazování z repa; nejdřív jen preview ke schválení klientem. Vrácení: smazat blok loaderu z konce záhlaví. |
| 2026-09-29 | M1, C3, drobnosti | Vzhled a obsah → Editor HTML kódu → Záhlaví (loader) | `var PROD = '';` → `var PROD = 'v0.3.0';` – první nasazení pro zákazníky | `var PROD = '';` | Klient schválil v0.3.0-rc.1. Vrácení (rollback): zpět `PROD = ''` (vypne vše) nebo na předchozí tag. |
| 2026-09-30 | oprava | Vzhled a obsah → Editor HTML kódu → Záhlaví (loader) | `var PROD = 'v0.3.0';` → `var PROD = 'v0.3.1';` | `var PROD = 'v0.3.0';` | Oprava rozhozeného okna po vložení do košíku (PR #5) + přepnutí mřížka/tabulka bez animace (PR #4). Vrácení: zpět `'v0.3.0'`. |
| 2026-10-01 | drobnosti | Instagram (nastavení počtu příspěvků / řádků widgetu) | Víc příspěvků: na webu dřív 4, teď 9 (víc šablona Apollo nezobrazí). Přesnou cestu a hodnotu doplní Kryštof. | 4 příspěvky (1 řádek, `columns-4`) | Úzký pás Instagramu v jedné řadě (v0.4.0). Vrácení: zpět na 4 – CSS funguje s libovolným počtem. |
| 2026-10-01 | oprava | Soubory → `/user/documents/upload/CSS/timber-custom.css` (cizí CSS, ne z repa) | Sekce „PRODUKTOVÉ KARTY – ZJEDNOTENIE VÝŠKY“ a „PRODUKTOVÉ KARTY – MOBIL“: ke každému selektoru přidáno `:not(#colorbox *)`, nic jiného se neměnilo. | [`shoptet/backup/2026-10-01-timber-custom-v173.css`](shoptet/backup/2026-10-01-timber-custom-v173.css) | Pravidla s `!important` (`flex-direction: column`, `height: 100%`, `margin-top: auto`) platila i pro dlaždice v popupu po vložení do košíku („Ostatní zákazníci tiež nakúpili“) a přebíjela vodorovný layout Apolla → rozhozený popup. Mimo popup ověřeno 0 změn (homepage, kategorie, detail, vyhledávání; desktop + mobil). Vrácení: nahrát zálohu. |
| 2026-10-01 | oprava | Vzhled a obsah → Editor HTML kódu → Záhlaví | `timber-custom.css?v=173` → `?v=174` | `timber-custom.css?v=173` | Soubor má cache 1 rok (`max-age=31536000`); bez změny verze by vracející se zákazníci viděli starou verzi. Vrácení: zpět `?v=173` jen spolu s nahráním zálohy. |


## 2026-10-05 · loader snapshot
- Live Shoptet HEAD supplied by client shows `PROD = 'v0.4.2'`.
- Repository `shoptet/loader.html` was synchronized to that current production value in the migration branch.
- No change was made in Shoptet admin by this commit; this only aligns the repository snapshot with the live state.

## 2026-10-14 · v0.6.9 — nasadené klientom, živá produkcia overená
- Klient potvrdil prepnutie v **Vzhľad a obsah → Editor HTML kódu → Záhlavie**. Živý loader načítava `PROD = 'v0.6.9'`; pôvodný stav bol `PROD = 'v0.6.5'` s lokálnym CSS/JS hotfixom mobilnej galérie z 12. 10.
- Pôvodný hotfix je zachovaný vo verziovaných zdrojoch v0.6.9. Shoptet admin upravil klient, nie agent; presný čas uloženia nie je známy.
- Nezávislé overenie 14. 10. 2026: čerstvé desktopové/mobilné relácie bez preview cookie, `TimberLoader.version` aj `Timber.version` = v0.6.9, `preview = false`, CSS/JS z CDN tagu. Prešli homepage, kategória, mobilná galéria, natívne pridanie a zmena množstva cez AJAX, doprava/platba a postup do Osobných údajov. Objednávka nebola odoslaná; natívny finálny formulár zostáva `order-form`.
- Drobný nález mimo nášho buildu: Apollo CDN vracia 404 pre `/assets/img/colorbox/loading.gif`. Galéria aj nákupný priechod prešli; cudzí súbor sa nemenil. Pôvodný syntetický klik v mobilnom teste nezvolil dopravu, opakovanie skutočným tapom prešlo bez JS chýb.
- Rollback: v existujúcom loaderi vrátiť `PROD = 'v0.6.5'`, uložiť a vypnúť preview cookie. Postup: [docs/releases/v0.6.9.md](docs/releases/v0.6.9.md).

## 2026-10-16 · v0.6.11 — loader pripravený, aktivácia v adminu nevykonaná

- Klient schválil preview `653d6f5` a nové stabilné vydanie do main. Verziovaný `shoptet/loader.html` má pripravený cieľ `PROD = 'v0.6.11'`.
- Toto je príprava nasadenia, nie záznam vykonanej zmeny v Shoptete. Agent nemá prístup k administrácii; posledný potvrdený živý stav je `PROD = 'v0.6.9'`.
- Cieľ: **Vzhľad a obsah → Editor HTML kódu → Záhlavie**, synchronizovať iba hodnotu PROD existujúceho Timber loadera podľa verziovaného súboru. Zachovať všetok ostatný obsah a lokálne podmienky pre staré verzie.
- Pôvodný stav a rollback: `PROD = 'v0.6.9'`, vypnúť preview cez `?ts_preview=off`. Staré tagy ani buildy sa neprepisujú.
- Po skutočnom uložení overiť `TimberLoader.version = 'v0.6.11'`, `preview = false`, CSS/JS z tagu a nákupný priechod bez odoslania objednávky; až potom doplniť potvrdenie aktivácie. Postup: [docs/releases/v0.6.11.md](docs/releases/v0.6.11.md).

## 2026-10-18 · v0.6.12 — vydanie pripravené, aktivácia v adminu nevykonaná

- Klient schválil večerné úpravy a publikovanie do mainu bez nového produktového detailu. Nový release vychádza zo stabilnej v0.6.11.
- Živý loader overený pred vydaním: `PROD = 'v0.6.11'`. Repo loader má pripravené `PROD = 'v0.6.12'`.
- Agent nemá prístup do Shoptet administrácie; nejde o záznam vykonanej aktivácie. Po dostupnosti CDN klient v existujúcom loaderi zmení iba hodnotu PROD; [postup a rollback](docs/releases/v0.6.12.md).
