# UI consistency — v0.7.1-rc.0, 20. 10. 2026

Iba preview vetva `preview/ui-consistency-20261020`, nad schválenou v0.7.0 (aktuálny main pred prácou `d42ec21`, posledná zmena iba verejné Instagram dáta). Bez merge, nového release/tagu, zmeny Shoptet administrácie alebo loadera. Nemenný preview commit: **`47f7f16dcf6cc3ebb2204e569cb79088f548d288`**. [Otvoriť preview](https://www.timberstore.sk/?ts_preview=47f7f16dcf6cc3ebb2204e569cb79088f548d288) · [otvoriť košík v preview](https://www.timberstore.sk/kosik/?ts_preview=47f7f16dcf6cc3ebb2204e569cb79088f548d288). [CDN súbory, SHA-256 a bajtová zhoda](assets.json). Zdrojové zadanie: príloha body 1–11, doplnenie 12–13 a následná oprava oneskoreného súvisiaceho tovaru/kódu v košíku. Videá neboli v tejto správe dostupné; zistenia vychádzajú zo skutočného DOM, interakcií a meraní.

## Publikované overenie

Skutočné CDN CSS aj JS sú bajtovo zhodné s testovaným buildom. [CDN smoke](cdn-smoke.json) prešiel na 1440 / 390 / 320 px: homepage, kategória, natívne pridanie FRANKE, kód pod názvom, pripravený súvisiaci tovar, modré hlavné a neutrálne sekundárne ceny, fialový toggle, bez overflow a nových JS výnimiek. [Čistá produkčná relácia](production-observed.json) potvrdila **v0.7.0**, `preview=false`; táto preview ju nemení.

Pri kontrole použite uvedený odkaz; pôvodný preview cookie sa nahradí týmto commitom. Návrat na bežný web: `?ts_preview=off`. Nič nekopírovať do Shoptet administrácie.

## Výsledné zmeny

1. **Potvrdenie nákupu:** desktopový popup má maximum 960 px a 80 vw (pôvodný široký desktopový rám približne 1200 px → 960 px); mobil zachováva použiteľnú šírku s bezpečnými okrajmi. „Prejsť do košíka“ dostalo bielu SVG ikonu košíka, sekundárne tlačidlo border/hover/focus. Vysoké množstvá sa neorezávajú. Presná percentuálna zmena pri každej šírke sa môže líšiť podľa natívneho Colorbox limitu.
2. **Stabilita:** množstevné ovládače rezervujú päť číslic, používajú tabulárne číslice a nemenia šírku s hodnotami 1 / 10 / 100 / 1000 / 20000. Úzke produktové karty skladajú množstvo a košík pod seba. Kód má stabilný samostatný riadok. Repeated-init a AJAX nevytvárajú duplicitné ovládače.
3. **Doprava zadarmo:** existujúci mini košík, košík a popup používajú zjednotené pozadie, ikonu, typografiu a 4 px progress. V Možnostiach doručenia sa rovnaká správa vykresľuje z existujúceho `cartInfo` cez spoločný formatter; označenie „Aktuálny košík“ odlišuje aktuálny stav od natívneho výpočtu metód po hypotetickom pridaní produktu. Žiadny vymyslený limit ani prepis doručovacích dát. Dialóg dopravy má lokálne obmedzenie skutočnej šírky aj pri zmene desktopového viewportu so scrollbarom.
4. **Tabuľka:** názvy dostupnosti 14 → 13 px, hlavná cena 16 → 15 px, ostatné jednotky a sekundárne údaje zachované.
5. **Kontakty:** sidebar zachováva pôvodný nadpis a pomocný text; dopĺňa spoločné hodiny a originálne sociálne farby. Poradie sidebar/menu/footer: hodiny, email, telefón, CTA, sociálne siete. Kontakt v košíku zostáva bez zásahu.
6. **Ovládanie výpisu:** lokálne firemné farby pre skutočné Apollo prvky `.loadMore__button--products`, `.goToTop__button`, `.pagination__link` a aktuálnu stránku. Natívne načítanie ďalších produktov funguje.
7. **Odporúčania:** fotografia, názov a jednoriadkový kód nad skladom/cenou; dostatočne široké množstvo a CTA pod ním. Zachované fotografie, natívne formy, údaje a prechody. Layout funguje aj v úzkych kartách vedľa seba.
8. **Spoločný quantity štýl:** pôvodné neutrálne znamienka, biele číslo, schválené orámovanie a radius; kontext môže mať inú šírku, ale nemení sa s počtom číslic. Pravidlá balenia, minima, maxima a natívne udalosti sa zachovávajú.
9. **Súvisiaci tovar v košíku:** `--ts-color-novelty`, **#7B3F68**, pre celý rozbaľovací text vrátane počtu, sekundárnej ceny a šípky. Hover/focus je podčiarknutý, otvorený stav označuje natívna šípka aj podčiarknutie. Natívne rozbaľovanie zachované.
10. **Hlavné ceny:** **#2454A6**, vrátane €. Cielia sa konkrétne natívne `cartPrice`, `cartWidgetProductPrice`, `recapFullPrice`, mini súhrn a príslušné hlavné produktové ceny. `cartItemPrice` (sekundárna jednotková cena košíka), jednotky `/ ks` atď., DPH, net ceny a sekundárne informácie sa nefarbia modro. Cena v odkaze Súvisiaci tovar zostáva fialová. Žiadny globálny selektor meny.
11. **Kód košíka:** samostatne pod názvom, bez pomlčky. „Kód:“ neutrálne, iba hodnota modrá. Platí aj pre rozbalené súvisiace produkty a po AJAX obnove.

## Skutočná príčina oneskorenia súvisiaceho tovaru

Natívna kartička súvisiaceho produktu neobsahuje SKU ani použiteľné pravidlá quantity. Pôvodný selector spúšťal overený fetch detailu až pre `tr.related.visible`. Po kliknutí preto najprv vznikol riadok a až po HTTP odpovedi pribudol kód, skladové množstvo a ovládač, ktorý posunul cenu a CTA.

Teraz sa overené dáta prednačítavajú aj pre zatvorené riadky. Cache je iba na dobu stránky a používa presnú URL + overenie priceId/SKU; súbeh je obmedzený na 4 dokumenty. Fetch má 8-sekundové ukončenie, aby zlyhanie nenechalo ovládač trvalo čakať. Pri rýchlom otvorení počas nedokončeného fetchu má karta rezervovaný priestor a stav „Načítavam…“. Nezobrazuje sa vymyslený kód, minimum ani balenie. Po overení sa súvisiace údaje doplnia v jednom synchrónnom kroku. Pri chybe sa obnoví pôvodné natívne pridanie.

**Meranie s úmyselne spomaleným fetchom o 2,5 s:** pri 1440, 768, 430, 390, 375 a 320 px je maximálny rozdiel `x/y/width/height` celej karty, názvu, ceny, CTA a quantity slotu **0 px** medzi čakajúcim a pripraveným stavom. Kód hlavného produktu začína pod spodným okrajom názvu. [Dôkazy](related-stability.json). Tým sa odstraňuje postupné doskakovanie; samotné načítanie chýbajúcich overených dát pri prvom pomalom pripojení nemožno označiť za okamžité.

## Testy

| Oblasť | Výsledok a dôkaz |
| --- | --- |
| Homepage, bannery/slidery, grid, desktop tabuľka, footer/sidebar, päť množstiev | PASS 1440 / 1280 / 1024 / 768 / 430 / 390 / 375 / 320; [layout](layout-final.json), aj dve mobilné karty vedľa seba |
| Homepage: tri slidery, posun na ďalšiu kartu, natívne plus/mínus a pridanie do košíka | PASS 1440 / 390 / 320, **9 nákupov** po 2 ks so serverovým množstvom a mini súhrnom; [výsledky](home-native.json) |
| Hlavný košík: modrá položka/súhrn, neutrálna cena za kus a net, fialový text/číslo/šípka, otvorenie/zatvorenie | PASS rovnakých 8 šírok; [výsledky](cart-prices.json) |
| Natívna zmena množstva v košíku a serverová suma | PASS Jota 1 → 2, riadok **4,52 €** modro; [výsledky](cart-prices.json) |
| Mini košík, modrá cena/€ a súhrn, plus/mínus, AJAX, stabilná šírka | PASS 1440 / 390 / 320; [výsledky](mini.json) |
| Súvisiaci tovar, cold prefetch so spomalením, bez posunu, natívne min/max | PASS 6 šírok, max delta **0 px**; [výsledky](related-stability.json) |
| Zlyhanie overeného zdrojového dokumentu | PASS 390, natívny nákup odblokovaný, žiadny vymyslený SKU/min/max; [výsledky](related-failure.json) |
| BLUM 485572 + StrongFix 11109, skutočné pridanie súvisiaceho tovaru | PASS 390 px: **1000 ks**, cena servera **0,02 €/ks**, SKU a balenie overené; [výsledky](blum-related.json) |
| Jota 494606 a dlhý BLUM 499061, pred/po: titul, cena/DPH, galéria, CTA, variantové kartičky | PASS 8 porovnaní 1440 / 768 / 390 / 320; iba zámerná rezerva šírky quantity; [výsledky](detail.json) |
| Detail FRANKE: doručenie/progress, natívne súvisiace/podobné plus/mínus | PASS všetkých 8 šírok; hlavná galéria otvorená pri 1440 a 390; [výsledky](detail-flow.json) |
| Potvrdenie po nákupe: layout a množstvá | PASS 8 šírok na zachytenom natívnom HTML; nejde o čerstvú živú odpoveď popupu. [Výsledky](popup.json) |
| Natívny nákup z formulára zachyteného popupu | PASS: SKU **399235**, **1 ks**, potvrdené v serverovom košíku; [výsledky](popup-native-submit.json) |
| Mobilné menu: skutočné otvorenie, poradie kontaktu, sociálne farby | PASS 430 / 390 / 375 / 320; [výsledky](menu.json) |
| Filtre vrátane ceny, zatvárania, šípky a overflow | PASS 9 šírok; [výsledky](filter-final.json) |
| AJAX výmena produktov, balenie, jednorazový nákup | PASS 1440 / 390, SKU 237597, **200 ks**; [výsledky](ajax.json) |
| Načítať ďalších a následná inicializácia | PASS 390; bez duplicitných pickerov; checkout celková suma modrá; [výsledky](loadmore-checkout.json) |
| Lint / preview build bez produkčného nasadenia / `git diff --check` | PASS; [presné veľkosti a SHA-256](assets.json) |

Nebola odoslaná objednávka ani platba. Všetky nákupy sú iba testovací serverový košík.

## Obmedzenia a opravené regresie

- **StrongFix 11109:** aktuálny natívny detail má `min=1000`, `step=1000`, `max=9999`. Hodnoty 1/10/100 sa korektne upravia na 1000; 20000 Shoptet zníži na 9999. Päť číslic sa do UI zmestí, ale limit neobchádzame. Reálny nákup bol overený s platnými 1000 ks. Nesmie sa to deklarovať ako úspešný nákup 20000 ks.
- **Živé otvorenie potvrdenia:** predchádzajúca aj dostupná natívna odpoveď `GetExtendedOrder` v tomto prostredí môže mať `content=false`. Rozloženie a interakcie popupu sa preto overujú označeným replay zachyteného natívneho HTML; jeho formulár bol odoslaný na skutočný Shoptet endpoint. Čerstvé živé otvorenie kompletného popupu **NOT VERIFIED**.
- **friends.shopcode.cz:** živá externá synchronizácia **NOT VERIFIED**; detailové porovnanie Jota používa browser-only fixture, nie nový externý integračný PASS. Galéria a variantové rozmery/označenie sa nemenia.
- **Safari/WebKit a fyzický iPhone:** v tejto preview relácii netestované. Mobilné výsledky sú Chromium/touch emulácia. Žiadny ďalší pokus o WebKit download.
- **Výpadok zdrojového detailu:** nevymýšľa sa SKU, min/max ani sklad. Natívny nákup sa odblokuje; v takom prípade nemožno garantovať rozšírené quantity údaje. Prednačítanie vyžaduje dodatočné verejné dokumenty, najviac 4 súbežne a raz na URL/stránku.
- Úvodné testy odhalili prefarbenie mini/checkout sumy silnejším Apollo selectorom, stlačené číslo v desktopovej tabuľke a 4 px presah dialógu dopravy pri desktopovom resize. Všetky boli lokálne opravené a príslušné testy zopakované. Úvodný quantity slot súvisiaceho tovaru mal rozdiel 2,16 px; po zjednotení šírky má delta 0 px. Neúspešný predpoklad testu „20000 ostane nezmenené“ nahradila kontrola skutočného natívneho limitu, bez úpravy aplikačnej validácie.
- Nové neopravené aplikačné regresie sa pri dostupných testoch nepotvrdili. PageSpeed Insights a fyzické zariadenia neboli merané.

## Screenshoty

Z reálnej CDN preview: [desktop](images/cdn-cart-1440.png), [390 px](images/cdn-cart-390.png), [320 px](images/cdn-cart-320.png).

- Košík a súvisiaci tovar: [desktop](images/related-final-1440.png), [390 px](images/related-final-390.png), [320 px](images/related-final-320.png).
- Konkrétny BLUM a súvisiaca skrutka: [390 px po natívnom nákupe](images/blum-related-390.png).
- Potvrdenie a odporúčanie (označený replay): [desktop](images/popup-final-1440.png), [390 px](images/popup-final-390.png), [320 px](images/popup-final-320.png).
- [Dvojstĺpcové karty kategórie 320 px](images/category-320.png), [homepage karta 320 px](images/home-card-320.png).
- Mini košík: [desktop](images/mini-final-1440.png), [320 px](images/mini-final-320.png); [kontakt v mobile menu](images/menu-contact-320.png).

## Súbory a rozsah

Úplný zoznam zmenených súborov je v [changed-files.txt](changed-files.txt). Hlavné skupiny:

- `cart-presentation/{related,rows,quantity,popup-shipping}.js`: prednačítanie, kód/label, rezervované číslice, spoločná shipping správa.
- `styles/overrides/{cart-presentation,quantity-control,recommendations,cart-modal,product-shipping,ui-consistency}.css`: lokálne Apollo prepisy, hlavné ceny a stavy.
- `footer-contacts/index.js`, `header-service-bar/index.js`: poradie kontaktov a sociálne ikony mimo kontaktu košíka.
- `product-compact/index.js`: iba spoločný progress v natívnom dialógu dopravy.
- `qty-picker.css`, `list-view.css`, core selectors/texts/tokens, `main.css`, package/lock, build konfigurácia, dokumentácia a generované dist.

Nová preview má vlastné schválené limity **JS 32,5 KiB / CSS 28,25 KiB**. Zvýšenie je zdokumentované podľa výslovného pokynu majiteľa z tejto relácie; stabilné v0.7.0 a staršie limity ostali nedotknuté. `shoptet/loader.html`, galéria, warehouse-stock projekt, server/backend a cenové výpočty nemajú zmenu. Žiadny merge ani produkčné nasadenie.
