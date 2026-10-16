# Kontrola kliknutí a vykresľovania v aktuálnej rc.4

Základ `155eea9a12803ba43ba54c7cc5a5e7ae168384ba`, vetva `preview/mobile-shipping-layout-20261015`. Čistý pracovný strom pred zásahom. Číslo verzie `0.6.11-rc.4` zostáva, bez merge/release/tagu a bez zásahu do produkcie alebo adminu. Produkčný loader v0.6.9 a paleta sú nezmenené.

## 1. Rozdelenie klikacích oblastí

Na pôvodnom publikovanom preview reálny dotyk ikony, počtu aj hlavnej plochy pri 320/375/390/430 zostal na kategórii a otvoril popup. Desktop už navigoval do plného košíka.

Príčina: `cartInteraction` v našom document capture listeneri obsahoval osobitnú mobilnú vetvu s `preventDefault()` a `showPopupWindow()`. Podľa aktuálneho zadania bola odstránená iba táto vetva. Pôvodný odkaz, href, jeho vnútorná ikona, počet aj cena zostávajú. Capture handler na hlavnom odkaze zastaví delegované Apollo toggle/wrapper handlery, ale neruší predvolenú navigáciu prehliadača. Nepribudol ručný redirect ani pevne zadaná URL. Ctrl/Meta/modifikované kliky a Enter zachovávajú odkazové správanie. Samostatný sibling button na šípke naďalej vlastní otvorenie/zatvorenie cez pôvodné popup API a ruší iba svoju vlastnú predvolenú akciu.

Doplňujúca príčina pri opakovanom návrate z košíka: mobilný anchor dedil natívne `transition: all 0.3s ease-out`. Animácia zahŕňala aj zdedenú visibility a geometriu. V teste mal odkaz aj jeho počet computed `visibility:hidden`, hoci nemali žiadne statické hidden pravidlo; po dokončení CSS animácie sa visibility aj poloha obnovili. Mobilný selector preto teraz animuje iba background-color/color/box-shadow, rovnako ako desktopový vzor. Bez zmeny finálnych rozmerov a bez núteného visibility override alebo dodatočného timeru.

## 2. Skutočné kliknutie Pokračovať do košíka

Samotný natívny odkaz a jeho URL boli správne. Pred opravou reálny klik po dokončení AJAX pri 375/390/430/1440 navigoval na `https://www.timberstore.sk/kosik/` a zachoval presné priceId/množstvo/jednotkové ceny testovacieho košíka.

Pri **320 px** sa však reálny dotyk do stredu tlačidla trafil do `.ts-preview-badge`. Dlhý 40-znakový SHA štítok sa zalomil a prekryl CTA pri spodnom okraji. Výsledkom bolo `?ts_preview=off`, nie košík. Toto bola chyba preview vrstvy, ktorú kontrola samotného href ani programový `element.click()` neodhalila.

Oprava: iba pri otvorenom mobilnom mini-košíku sa spolu s už skrytým back-to-top skryje aj preview badge. Po zatvorení sa automaticky obnoví. Samotné CTA, jeho HTML, listener alebo destinácia sa nemenia. Desktopová značka a produkcia bez preview sa nemenia.

Oddelený očakávaný stav: počas natívneho `ajax-pending` prekryje popup Apollo loader, ktorý môže zachytiť klik. Test preto čaká na dokončenie skutočného požiadavku a zobrazenie správneho počtu produktov; loader sa neobchádza ani nevypína. Po kliknutí sa čaká na výslednú URL **aj na zobrazený riadok produktu v natívnom plnom košíku**, potom sa porovnajú údaje so stavom pred kliknutím.

## 3. Súvisiaci tovar a medzistav rozloženia

Predchádzajúce odstránenie fade bolo príliš široké: bezpodmienečné `opacity:1` odhalilo aj nespracovaný serverový DOM. V pôvodnom preview bol zaznamenaný tento sled:

| Režim / šírka | Skorý stav | Konečný stav |
| --- | --- | --- |
| Prvé načítanie 320 | formulár v `.p-tools`, karta 522px, `is-loaded=false` | `.product-btn`, karta 482px |
| Bez cache 390 | `.p-tools`, karta 527px, `is-loaded=false` | `.product-btn`, karta 482px |
| Bez cache 430 | `.p-tools`, karta 527px, `is-loaded=false` | `.product-btn`, karta 482px |
| Zahriate načítania | spravidla už hotová `.product-btn` pri odhalení | rovnaká finálna geometria |

Native Apollo v `partsRepositionProducts()` presúva pôvodné formuláre z `.p-tools` do `.product-btn`, `partsRepositionDetail()` prestavuje detail a na desktope vytvára Swiper. Až potom nastaví `body.is-loaded`. Pri pomalšom poradí načítania môže 1500ms fail-safe globálneho loadera skončiť pred týmto krokom. Cache mení poradie/dĺžku tejto fázy; nejde o iné uložené produktové dáta. Lazy loading obrázkov ani nový AJAX s quantity/formulármi nie sú príčinou zachyteného presunu — ovládanie už bolo v serverovom HTML. Vlastný listing qty-picker sa na tento detail nespúšťa. V záznamoch zostalo deväť produktov, deväť formulárov, deväť quantity a deväť submit tlačidiel, bez dôkazu duplicitnej inicializácie.

Oprava zachováva **natívnu podmienku pripravenosti**, nie predchádzajúce bezpodmienečné opacity:1. Pred `is-loaded` je iba obsah `.p-detail` skrytý bez zmeny jeho priestoru (`visibility/opacity`, nie display:none); po natívnej inicializácii sa ukáže konečné rozloženie. Súvisiace karty a slider obal majú naďalej odstránený 250ms fade, takže po pripravení nevzniká ďalšia čakacia animácia. Žiadny nový JS, observer, presúvanie formulárov, pack/min/max logika alebo timeout. Globálny loader a jeho fail-safe zostávajú nezmenené.

Tým sa spresňuje predchádzajúci report: odstrániť fade bolo správne, úplne obísť pripravenosť Apolla správne nebolo. Nie je možné sľúbiť okamžité interaktívne formuláre pred načítaním a inicializáciou ich natívnych skriptov.

## Metóda a výsledky

- Desktop 1440 a mobil 320/375/390/430 v Chromium/Android touch emulácii.
- Reálne súradnicové dotyky alebo pohyb/klik myši, nie programový click na testovaných header/CTA odkazoch. Programové kliknutie sa používa iba na prípravu izolovaného košíka/prijatie cookie voľby.
- Po oprave prešlo **10 klikacích scenárov** (päť šírok × oba režimy cache), každý s reálnym klikom na ikonu, počet, hlavnú plochu a CTA a s otvorením/zatvorením šípky. Pre jednotlivé primárne kliknutia sa používa samostatná kategóriová stránka v tom istom kontexte a s tým istým košíkom; test nekoliduje s nedokončeným návratom predchádzajúcej navigácie. Výsledky: [click-results.json](cart-actions/click-results.json).
- Pri každom teste navigácie sa kontroluje `/kosik/`, skutočný zobrazený produkt a nezmenené priceId, množstvo a jednotkové ceny. Náhľad sa šípkou opakovane otvorí aj zatvorí bez zmeny URL.
- Vykresľovanie pred aj po oprave: **20 navigácií v každej sérii**, päť šírok × dva režimy × prvé načítanie a reálny prechod na ďalší produkt. Pred: nespracovaná štruktúra pri časti načítaní viditeľná v render stave. Po: všetky odhalené ovládacie prvky až s `is-loaded=true` a parent `.product-btn`; bez duplicít/overflow, desktopový slider pripravený.
- Zaznamenané DOM/class/style/geometry míľniky, DOMContentLoaded/load a úvodné compositor snímky pri 390px. Snímky zahŕňajú aj natívny loader; nejde o tvrdenie, že každý DOM medzistav bol vo všetkých behových podmienkach osobitným viditeľným snímkom.
- Údaje a priebeh: [render-traces.json](cart-actions/render-traces.json). Časy dokumentujú poradie, nie porovnateľný výkonnostný benchmark medzi sieťovo odlišnými behmi.

**Cache obmedzenie prostredia:** sieť prehliadača ide cez TLS-overujúci curl transport, pretože priamy Chromium proxy profil nedôveruje proxy certifikátu. Bežný režim opakovane používa statické odpovede v cache transportu; HTML košíka/produktu sa takto necachuje. Režim bez cache ju vypína, posiela Cache-Control/Pragma no-cache a vypína/čistí cache cez CDP. Playwright request routing zároveň vypína vlastnú HTTP cache Chromium. Porovnanie preto overuje zahriate statické assets verzus nové sieťové požiadavky, nie samostatný benchmark fyzického prehliadača s jeho diskovou HTTP cache. Žiadne obchádzanie TLS alebo vypnutie overovania certifikátov.

Lint/build a kontrola formátovania prešli: JS 26 189 B (25,58 KiB) / 30 KiB, CSS 21 348 B (20,85 KiB) / 21 KiB gzip, bez zvýšenia limitov.

## Súbory a zachované úpravy

- `src/modules/header-service-bar/index.js` — odstránená mobilná toggle vetva hlavného odkazu.
- `src/modules/header-service-bar/header-service-bar.css` — mobilná animácia obmedzená na farby/tieň.
- `src/styles/overrides/header-popups.css` — preview badge skrytý iba počas otvoreného mobilného popupu.
- `src/styles/overrides/product-detail.css` — natívna readiness podmienka detailu, zachované odstránenie fade.
- `dist/timber.min.{css,js}` a obe sourcemapy — build.
- `CHANGELOG.md`, tento report a záznam vykresľovania — dokumentácia.

Predchádzajúce produktové grid riadky, scroll lock/restore, ceny, shipping stavy/bar, kontakty, login a sidebar zostávajú zachované. Číslo verzie, tokeny, oranžová/Emerald/béžové plochy, rozpočty a loader sa nemenia. Bez objednávky alebo platby.

Reálny iOS Safari/fyzický Android a meranie PageSpeed nie sú k dispozícii. Nevykonáva sa produkčné nasadenie. Bez garancie času sťahovania externých skriptov; oprava odstraňuje nesprávne odhalenie medzistavu a nadbytočný fade.
