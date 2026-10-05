# Starý kód na webu (mimo repo)

Inventář stavu k 26. 9. 2026 (homepage). Kód se převádí do repa, až když na něj sáhne úkol (CONTRIBUTING.md 1.3).

## Vlastní kód klienta / předchozích vývojářů
| Soubor | Kde se načítá | Poznámka | Stav |
|---|---|---|---|
| `/user/documents/upload/CSS/timber-custom.css?v=175` | záhlaví | hlavní vlastní CSS | **staged ve větvi `migration/custom-code-to-github`** jako přesná kopie `src/legacy/timber-custom-v175.css`; FTP odkaz zatím zůstává aktivní, odstraní se až po preview kontrole |
| `/user/documents/allstyle.css?v=1111` | záhlaví | další vlastní CSS | nepřevedeno |
| `765909.myshoptet.com/user/documents/upload/CSS/timber-kategorie-banner.css?v=10` | záhlaví | načítá se z původní myshoptet domény | **převedeno ve větvi `migration/custom-code-to-github`** do modulu `homepage-categories`; externí načtení se odstraní až po preview kontrole |
| `765909.myshoptet.com/user/documents/upload/CSS/timber-kategorie-banner.js?v=10` | zápatí | dtto; na konci navíc načítá `timber-menu.js` | **převedeno ve větvi `migration/custom-code-to-github`** do modulu `homepage-categories`; dynamické načítání `timber-menu.js` se do modulu nepřenáší |
| `/user/documents/upload/CSS/timber-menu.js?v=1` | načítán nepřímo z `timber-kategorie-banner.js` | **převedeno ve větvi `migration/custom-code-to-github`** do modulů `menu-card-click`, `sidebar-active-path`, `product-text-cleanup`, `category-filter-compact`; dočasný guard v preview zabrání spuštění starého souboru dvakrát |
| `/user/documents/upload/CSS/timber-empty-cart.js` | zápatí | bez verze v URL | **staged** jako přesná kopie `src/legacy/timber-empty-cart.js`; zatím se nebundluje ani nevypíná ve Shoptetu |
| `/user/documents/allscript.js?v=111` | zápatí | další vlastní JS | nepřevedeno |
| Mřížka/řádky „GRID / LIST VIEW v19–v27“ (klientova rozpracovaná verze `timber-menu.js` ř. 579–1361 a `timber-custom.css` ř. 2071–3633, jen na jeho počítači) | **na webu není** | přepínač zobrazení, tabulkový výpis, pole pro množství, odznak počtu v košíku, řazení | **přepsáno** na moduly `list-view`, `qty-picker`, `cart-count` (C3). Původní verze zůstává v `src/legacy/list-view/` jen ke srovnání (nebundluje se) – smazat po nasazení C3. **Klient ji nesmí nahrát do Shoptetu**, běžela by dvakrát. |
| inline `DOMContentLoaded` → `.custom-footer__onlinePayments p` (paymentBox) | zápatí | inline skript v HTML kódu | **převedeno ve větvi `migration/custom-code-to-github`** do modulu `footer-payments`; starý inline skript zůstává do preview kontroly |
| inline skript `timber-page-loading` + `<style>` s `html.timber-page-loading body{visibility:hidden}` | záhlaví | **skryje celou stránku až do DOMContentLoaded (max 1,5 s)** — pravděpodobně zhoršuje LCP, kandidát na výkonovou kartu | **staged** jako `src/legacy/page-loading.js`; CSS část je také v `src/legacy/inline-head.css`; ve Shoptetu zůstává beze změny |
| inline `<style>` — úpravy detailu, filtrů, welcome boxu, hlavičky a košíku (desktop breakpointy) | záhlaví | ~60 pravidel | **staged a zahrnuto do migračního bundle** jako `src/legacy/inline-head.css`; starý inline blok zatím zůstává ve Shoptetu |
| inline `<style>` — `.top-category-addon` (dlaždice kategorií v menu) | záhlaví | hodně `!important` | **staged a zahrnuto do migračního bundle** jako `src/legacy/top-category-addon.css`; starý inline blok zatím zůstává ve Shoptetu |
| `/user/documents/upload/CSS/timber-search-filter.css?v=173` | záhlaví | **zakomentováno** — nenačítá se | kandidát na smazání |

Záloha celého záhlaví k 26. 9. 2026: [`shoptet/backup/2026-09-26-zahlavi.html`](shoptet/backup/2026-09-26-zahlavi.html). `timber-menu.js` v poli Záhlaví není, načítá se odjinud (ověřit, odkud).

## Doplňky a šablona (třetí strany — neupravujeme, jen evidujeme)
| Co | Soubory | Poznámka |
|---|---|---|
| Šablona Apollo (Jakub Turský) | `apollo.jakubtursky.sk/.../main.css`, `app.min.js`, `plugins/js/swiper.min.js`, `kategorie/main.css` | Swiper v šabloně pohání produktové karusely |
| Propojení produktů (webotvurci) — „Kamarádi" / Všetky varianty | `plugin-product-interconnection/...` | viz D2, D5, P8 |
| Násobky objednávky (dominikmartini) | `addons/dominikmartini/multiply_order/...` | |
| Hlavní slider homepage | nativní Shoptet `#carousel` (Bootstrap 3 carousel) | M1 přidává swipe modulem `carousel-swipe` |
| Galerie na detailu produktu | nativní Shoptet `.p-image` + `.p-thumbnails` (cloud-zoom, colorbox) | M1 přidává swipe modulem `gallery-swipe` (kliká na náhledy) |


## Migrace 5. 10. 2026 — bezpečný režim
- Automatický workflow pro migrační větev je od nynějška nastaven pouze na ruční spuštění (`workflow_dispatch`).
- Důvod: série drobných commitů vytvářela zbytečně mnoho zrušených/starách buildů a e-mailových notifikací.
- Produkce v Shoptetu se tím nemění. Build preview se bude dělat jen ve vybraných kontrolních bodech.
