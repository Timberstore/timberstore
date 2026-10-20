# Popup + Related/Similar Products — Final Polish

Vetva: `preview/product-detail-compact-pro-20261019`.
Referencia pred úpravou: `d3c26070bc8b03f5fee98ce338b2173af0769b25`.
Iba preview; bez merge, release, tagu a produkčného nasadenia.

## Zmeny

- Natívny popup: centrovaný názov, vyvážené CTA, neutrálna plocha dopravy a tenký pôvodný progress. Úspech používa existujúcu zelenú `#00C853` / `#E8F5ED`.
- Odporúčania v popupe: prehľadná desktopová mriežka; mobilné riadky pre názov, kód, pôvodný sklad, cenu, množstvo a oranžový ikonový košík. Číslo aj € sú `#2454A6`, jednotka neutrálna, net cena v zátvorkách.
- Súvisiace a podobné produkty: centrované názvy/ceny, kompaktnejšia spodná nákupná časť, spoločný jemne červený ovládač s červeným mínusom a oranžovým plusom. Natívny input, limity, kroky, formulár a obsluha ostali; len popup bez natívneho ovládača používa existujúci `qty-picker`.
- Medzi sekciami je jemný horizontálny oddeľovač.
- NOVINKA používa samostatný token `--ts-color-novelty: #7B3F68` (teplá slivková, kontrast s bielou približne 7,6 : 1). Ostatné farebné významy ostali.

Chýbajúca jednotka sa načíta z natívneho verejného detailu presného produktu. Kontroluje sa `priceId`, prípadne presný SKU, ak ID chýba. Dokumenty sa zdieľane cachujú po URL a spracujú po načítaní stránky; ich skripty sa nespúšťajú. Existujúca jednotka sa nemení. Pri nedostupnom/nesúhlasnom zdroji sa jednotka nevymýšľa. Ceny, DPH, sklad ani doprava sa neprepočítavajú.

Použitý je existujúci MutationObserver; opakovaná inicializácia nevytvára ďalší input, jednotku ani submit handler. Colorbox sa premeria po dokončení natívnej animácie a prípadnom doplnení jednotky. Zmeny sú lokálne pre odporúčania/popup; spoločný štýl NOVINKA je zámerne použitý naprieč webom.

## Overenie

Podrobné merania a výsledky: [verification.json](verification.json).

- **14 kombinácií / 21 kariet:** FRANKE detail a AGOFORM popup pri 1440, 1024, 768, 430, 390, 375 a 320 px. Skutočné hranice kariet aj textu, nulové prekrývanie množstva/CTA, jeden množstevný input, jednotka a net cena; bez horizontálneho pretekania.
- **36 úspešných nákupných kombinácií:** popup / súvisiace / podobné × 1440 / 768 / 390 px × množstvá 1 / 2 / 3 / 10. Kontrola natívneho POST, skutočného serverového počtu, cien, súčtov a jediného nákupného requestu. Primárny beh úspešne overil 35; desktopový popup s 10 kusmi bol úspešne dokončený samostatným živým testom. Opakované pridanie a stav nového popupu overené.
- **Regresie:** klasické karty 6 šírok, tabuľka 3 šírky, hlavný detail 8 kombinácií oproti referencii — bez rozdielov sledovanej geometrie a typografie (okrem schválenej NOVINKY). Mini/hlavný košík desktop a mobil: plus/mínus, opätovné otvorenie, rýchle kliknutia, hodnoty 100/1000 a návrat na 1, ceny a doprava. Tieto hodnoty nepredstavujú dôkaz skutočného skladového maxima.
- Filtre 1440/768/390: otvorenie, zatvorenie, Escape, checkbox a slider AJAX. Popup otvorený z tabuľkového režimu: vlastný štýl ovládača, zátvorky a jediný input po opakovanej inicializácii; podkladová tabuľka zachovaná.
- Natívny desktopový slider: posun a nákup ďalšej karty. Na mobile Apollo už zobrazuje všetkých 7 podobných kariet a vlastnú navigáciu skrýva; overený nákup poslednej karty. Prvý test mylne predpokladal viditeľný mobilný navigačný ovládač a skončil timeoutom; opravený test kontroluje skutočný natívny stav.
- Galéria otvorená/zatvorená pri 390/320 px. Idempotencia, zmena cenového uzla, odmietnutie nesprávneho ID, presný SKU fallback a cache overené.
- Jednotky ks/pár/sada/m/kg: testy s natívne tvarovanými dokumentmi v prehliadači; živé odporúčania mali `/ ks`. Dlhá cena a natívna `/ sada`: zachytený natívny popup s upraveným textom v testovacej fixture, bez odoslania. Pri 320 × 568 px je ovládač dostupný vnútorným scrollom a funguje. Tieto fixture sa nenachádzajú v aplikácii.
- `npm run lint`, `npm run build`, `git diff --check`: PASS.

## Zistené obmedzenia a neúspešné pokusy

Shoptet pri časti živých pokusov po úspešnom pridaní vrátil z `/action/Cart/GetExtendedOrder/` HTTP 200, ale `payload.content:false`. Popup sa vtedy natívne neotvorí a automatické čakanie skončí timeoutom. **Rovnaká odpoveď bola doložená na referenčnom aj novom bundle**, v čerstvom košíku s SKU 354068. Produkt pritom v oboch prípadoch správne pribudol. Odpoveď neprepisujeme náhradným popupom. Neúspešné behy nie sú započítané medzi úspešné; izolovaný desktopový nákup 10 kusov následne prešiel.

Testované v Chromium s mobilnou/dotykovou emuláciou, nie fyzický iPhone/Safari. Externé API obrázkových variantov `friends.shopcode.cz` je v testovacom prostredí blokované; pri porovnávaní hlavného detailu bol na oboch verziách rovnaký browser-only dátový fixture. Živá synchronizácia tohto externého zdroja tým nie je potvrdená. Galéria ani variantový modul sa nemenili.

## Screenshoty pred / po

| Sekcia | Desktop pred | Desktop po | Mobil pred | Mobil po |
| --- | --- | --- | --- | --- |
| Popup | [1440](popup-before-1440.png) | [1440](popup-after-1440.png) | [390](popup-before-390.png) | [390](popup-after-390.png) |
| Súvisiace | [1440](related-before-1440.png) | [1440](related-after-1440.png) | [390](related-before-390.png) | [390](related-after-390.png) |
| Podobné | [1440](alternative-before-1440.png) | [1440](alternative-after-1440.png) | [390](alternative-before-390.png) | [390](alternative-after-390.png) |

[NOVINKA — mobil](novinka-390.png). Screenshoty popupu zachytávajú skutočne otvorený natívny AGOFORM popup.

## Build a súbory

Verzia ostáva `0.6.13-compact.1`; produkčný loader a stabilné limity sú nezmenené. Malé rozšírenie preview rozpočtu podľa historicky zaznamenaného súhlasu z 15. 10. 2026: JS 32 KiB, CSS 26,5 KiB. Gzip výsledok: **JS 32467 B, CSS 26932 B**.

- `CONTRIBUTING.md`
- `dist/timber.min.css`
- `dist/timber.min.css.map`
- `dist/timber.min.js`
- `dist/timber.min.js.map`
- `scripts/build.mjs`
- `src/core/events.js`
- `src/core/selectors.js`
- `src/main.css`
- `src/modules/cart-presentation/related.js`
- `src/modules/product-text-cleanup/index.js`
- `src/modules/qty-picker/index.js`
- `src/styles/overrides/cart-modal.css`
- `src/styles/overrides/product-card.css`
- `src/styles/overrides/quantity-control.css`
- `src/styles/tokens.css`
- `src/modules/product-text-cleanup/recommendations.js`
- `src/styles/overrides/recommendations.css`
- `docs/previews/popup-related-polish/README.md`
- `docs/previews/popup-related-polish/verification.json`
- `docs/previews/popup-related-polish/*.png`

## Publikované immutable preview

[AGOFORM — popup](https://www.timberstore.sk/pribornik-classico-kristall-softtouch-722x474mm-cierna/?ts_preview=326282ef13c3bfe593a3014a8ed83dc5fe23e40a)

[FRANKE — súvisiace a podobné](https://www.timberstore.sk/franke-drez-bfg-611-970x500mm-cierna-matna/?ts_preview=326282ef13c3bfe593a3014a8ed83dc5fe23e40a)

CDN JS/CSS sú bajtovo zhodné s overeným buildom. Živý smoke test skutočného CDN pri 1440/390 px: správne SHA loadera, modrá cena, natívna jednotka `/ ks`, jeden ovládač a nulový horizontálny overflow. [Výsledok](cdn-smoke.json). Pridanie rodičovského AGOFORM produktu bolo úspešné; endpoint rozšíreného popupu opäť vrátil `content:false`, zhodne s doloženým obmedzením referencie. Tento CDN pokus preto nepotvrdzuje otvorenie popupu; jeho funkčné nákupy sú doložené samostatnými predpublikačnými živými behmi s identickým bundle.
