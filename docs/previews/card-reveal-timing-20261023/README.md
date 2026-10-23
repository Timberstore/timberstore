# Cena a nákup bez samostatného oneskorenia · related.3

Pokračovanie `preview/related-card-stability-20261023`, verzia **0.7.0-related.3** nad related.2. Len oprava regresie z poslednej úpravy; odmietnuté UI preview sa neprenášajú. [Publikované preview](PUBLISHED.md).

## Príčina a oprava

Related.2 skrývalo nákupný riadok kategórie až do `body.after-load`, teda do načítania celej stránky vrátane obrázkov. Pri chýbajúcich natívnych údajoch jednotky navyše skrývalo samotnú cenu do odpovede overovacieho zdroja. Predošlé testy sledovali geometriu až od odhalenia ovládačov a tento rozdiel časov nezachytili.

- Odstránená závislosť kategórií, vyhľadávania a odporúčaní od `after-load`. Synchrónna príprava existujúcich kariet zostáva; žiadny nový časovač ani skrývanie celej stránky.
- Existujúca cena sa neskrýva počas overovania chýbajúcej jednotky. Zhodné natívne predajné jednotky sa dopĺňajú synchronicky; pri skutočne chýbajúcich údajoch zostáva overený fallback a rezervované miesto, nie vymyslená `/ks`.
- Zachované statické rozmery. Na podobných produktoch test odhalil aj pôvodnú krátku animáciu tlačidla; lokálny zoznam povolených farebných prechodov teraz zahŕňa formulár, tlačidlo a množstvo v oboch sekciách odporúčaní.

Výsledný dizajn, natívne inputy, submit, ceny/DPH, sklady, galéria a varianty zostávajú nezmenené.

## Skutočné meranie prvého zobrazenia

`requestAnimationFrame` od začiatku dokumentu zaznamenáva prvú viditeľnosť názvu, ceny, ceny bez DPH, skladu, množstva a tlačidla. Viditeľnosť zahŕňa predkov a opacity; nejde iba o prítomnosť elementu v DOM. Časové rozdiely sú v rozlíšení vykreslených snímkov, nie meranie sieťovej rýchlosti.

| Kategória, prvá karta 477822 | Pred opravou | Po oprave |
| --- | ---: | ---: |
| 390 px: nákupné ovládače po cene | 2364 ms | 0 ms – rovnaký snímok |
| 1440 px: nákupné ovládače po cene | približne 93 ms | 0 ms – rovnaký snímok |

[Baseline related.2](evidence/before.json) a [prvé porovnanie po oprave](evidence/after.json) sú samostatné bežné otvorenia; ich absolútne časy závisia od siete. Pri následnom záťažovom teste boli obrázky oneskorené o **4000 ms**, aby bolo možné overiť nezávislosť ovládačov od `window.load`.

| Scenár | Výsledok |
| --- | --- |
| 1440, 768, 430, 390, 375, 320 px: kategória → produkt → Back | **PASS**, cena, množstvo a CTA v rovnakom snímku; rozmer/poloha ovládačov relatívne k formuláru **0 px zmena**. [Matica](evidence/matrix.json) |
| Dve karty kategórie 477822/384446; related 346147 a alternative 207319 | **PASS**, vrátane dvoch mobilných kariet vedľa seba; jednotka už pri prvom zobrazení testovaných cien, bez overflow dokumentu a nových JS chýb |
| +/−, natívne pridanie a hlavný košík, kategória → kategória → Back | **PASS 1440/390/320 px**, jeden POST a 1 ks 477822; bez objednávky alebo platby. [Výsledky](evidence/functional.json) |
| /pár, /m, /ks a výnimočné zdroje jednotiek | **PASS**: klonované živé natívne údaje v izolovaných fixtures; konfliktné hlásenia používajú overený zdroj, cena zostáva viditeľná. HTTP 503 nevymyslí jednotku; stará odpoveď neprepíše novú natívnu jednotku. [Výsledky](evidence/units.json) |

Pri úvodnej tvorbe harnessu bol opravený selektor podobných kariet; test potom našiel reálnu animáciu ich CTA, ktorá bola opravená. Dva prerušené browser behy boli zopakované. Vyššie uvedená matica obsahuje dokončené úspešné behy finálnej opravy; neúspešné pokusy nie sú označené PASS.

## Súbory a limity

Zdrojové zmeny: `src/styles/overrides/product-card.css`, `src/styles/overrides/recommendations.css`, `src/modules/product-text-cleanup/recommendations.js`. Ďalej verzia v `package.json`/`package-lock.json`, rovnaká preview výnimka v `scripts/build.mjs`, zostavené `dist/`, changelog a tento report s overovacími skriptmi/dôkazmi.

JS gzip **32687 B / 32768 B**, CSS **27577 B / 27648 B**; presné výsledky sú v [build.json](evidence/build.json). Limity sa nezvyšujú. Lint, build a `git diff --check`: PASS; [záznam](evidence/checks.txt).

[Desktop screenshot](images/category-1440.png) · [mobil screenshot](images/category-390.png). [Samostatné overenie skutočnej CDN, nákupu a nezmenenej produkcie](PUBLISHED.md).

## Limity a rozsah

Safari/WebKit a fyzický iPhone: **NOT VERIFIED**. Ak Shoptet nepošle spoľahlivú jednotku v HTML karty, jej overený text môže prísť neskôr, ale cena zostáva stále viditeľná a jednotka má rezervované miesto. Nesľubujeme okamžité získanie chýbajúcich dát cez pomalú alebo nedostupnú sieť. Nemení sa existujúci loader a jeho failsafe pre nedostupný JavaScript. Externý variantový feed a vytvorenie objednávky neboli predmetom tejto malej opravy.

Bez merge, tagu/release, úprav Shoptetu alebo produkčného nasadenia. Bežná produkcia zostáva v0.7.0.
