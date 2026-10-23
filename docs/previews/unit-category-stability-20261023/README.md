# Jednotky ceny a stabilné nákupné riadky kategórií · 23. 10. 2026

Iba pokračovanie aktuálnej preview vetvy **preview/related-card-stability-20261023**, verzia **0.7.0-related.2**. Vstupná verzia je schválená malá preview related.1 (`cca35b0`, dokumentácia `22adda6`), priamo nad main/v0.7.0. Odmietnuté UI consistency preview sa neprenášajú.

[Immutable preview a CDN](PUBLISHED.md) · [zmenené súbory](FILES.md).

## Dve konkrétne opravy

1. **Jednotky spolu s prvým zobrazením ceny.** Odstránené čakanie na load/idle a zbytočné sťahovanie detailov, ak Shoptet už dodal predajnú jednotku v HTML karty. Použije sa zhodná jednotka z oboch natívnych množstevných hlásení (minimum/maximum), nie dostupnosť alebo odhad `/ks`. Pri nezhode/chýbajúcich údajoch sa zachová presné overenie produktu cez existujúci sourceQuantity, začne ihneď a hlavná cena s jednotkou sa odhalia spoločne. Zlyhanie zdroja obnoví pôvodnú cenu bez vymyslenej jednotky. Natívna `.pr-list-unit` má prednosť. Nová natívna jednotka pri výmene produktu uvoľní starý pending stav; stará odpoveď ju neprepíše.
2. **Statické množstvo a košík v kategóriách/vyhľadávaní.** Nákupný riadok sa ukáže po existujúcom natívnom `after-load` a príprave jeho množstevného UI; počas prípravy drží miesto. Rozmery, padding a flex sa neanimujú. Žiadne nové pevné rozmery, časovače alebo ďalší redesign. Rovnaký opt-out starej navigačnej snímky je teraz zdieľaný pre detail, kategóriu a vyhľadávanie; homepage a košík si ponechávajú svoje správanie.

Natívne inputy, min/max/step, produkty, obrázky, ceny, mena, DPH, skladové údaje a Shoptet submit sa nemenia. Existujúce opravy NOVINKA/kódu z related.1 zostávajú. Nemení sa loader ani administrácia.

## Overenie

| Scenár | Výsledok |
| --- | --- |
| Granitové drezy (477822 a 384446), cold load aj s oneskorením bundle 2500 ms, otvorenie produktu a Back | **PASS: 1440, 768, 430, 390, 375, 320 px**. [Matica](evidence/matrix.json) |
| Dve prvé karty: množstvo, číslo a CTA od prvého viditeľného stavu | Rozsah zmien X/Y/šírky/výšky **0 px** pri prvom otvorení aj Back; vrátane dvoch kariet vedľa seba na mobile. Žiadny horizontálny overflow dokumentu. |
| Súvisiace/podobné FRANKE 346147 a 207319 | V každom viditeľnom cenovom zázname už prítomná `/ ks`. Žiadny dodatočný fetch detailu pre jednotku. [1440 timing](evidence/timing-1440.json), [390 timing](evidence/timing-390.json) |
| `/ pár`, `/ m`, `/ ks` | **PASS**: predajné údaje zo živých hlavných formulárov produktov 11431, 179304 a 11454 vložené do izolovaných testovacích kariet. Výstup presne zodpovedá ich natívnej cenovej jednotke, bez fetchu. Je to **test klonovaných reálnych metadát**, nie tvrdenie o pôvodnom živom súvisiacom tovare `/m` alebo `/pár`. [Dôkaz](evidence/units.json) |
| Protichodné jednotky v min/max hlásení | **PASS – kontrolovaná fixture**: nepoužitý odhad, existujúci fallback overil skutočný produkt a `/ ks`; cena dočasne nezobrazená bez jednotky. |
| Zdroj HTTP 503 a skladový text `100 ks` | **PASS – fixture**: žiadna odvodená jednotka zo skladu, pôvodná cena obnovená. |
| Výmena natívnej jednotky počas starej požiadavky | **PASS – fixture**: native `/ m` zostáva, stará odpoveď ju neprepíše ani nezanechá skrytú cenu. |
| +/−, nákup, serverový a hlavný košík | **PASS 1440/390/320 px**, presne jeden natívny POST a 1 ks 477822; bez objednávky/platby. [Funkčné výsledky](evidence/functional.json) |
| Kategória → iná kategória → Back | **PASS 1440/390/320 px**, statické riadky a presne jeden navigačný štýl na dokument. |
| Lint, build, whitespace | [Finálne kontroly](evidence/checks.txt) |

Timing záznamy uchovávajú zmeny a prvý/posledný stav namiesto opakovaných identických vzoriek. Testy čítajú iba skutočne zobrazené ovládače, nie skrytý natívny amount input. V prvom rozpracovanom harnesse bol selektor opravený z hidden inputu na viditeľné množstevné pole; nejde o zmenu aplikácie. Konečná matica je celá PASS.

## Screenshoty z publikovanej CDN

[Desktop – dve karty](images/category-1440.png) · [Mobil – dve karty vedľa seba](images/category-390.png). Obrázky sú po skutočnom Back; načítanie dokladujú timing záznamy.

## Rozsah a limity

Zdrojové zásahy oproti related.1: jeden selector jednotkových hlásení; okamžité doplnenie jednotky v recommendations; presun už existujúceho produktového navigačného štýlu do cleanup modulu pre tri typy stránok; dve lokálne CSS pravidlá pre kategórie a pending cenu. Žiadny nový observer, knižnica alebo skladová/cenová logika.

JS gzip **32714 B / 32 768 B**, CSS **27607 B / 27 648 B**. Existujúce limity related.1 sú nezvýšené; stabilné tagy sa nemenia. [Presné bajty/hash](evidence/build.json).

Safari/WebKit a fyzický iPhone: **NOT VERIFIED**. Úplný katalóg a všetky vlastné názvy jednotiek neboli individuálne prejdené; chýbajúce/nejednoznačné natívne údaje vždy používajú overovaný fallback, nie skladový text. Pri nedostupnom zdroji nie je jednotka vymýšľaná. Variantový externý feed a odoslanie objednávky neboli súčasťou úpravy.

Bez merge, tagu/release alebo produkčného nasadenia. Predchádzajúci [related.1 report](../related-card-stability-20261023/README.md) zostáva historickým dôkazom, nie novým výsledkom tejto verzie.
