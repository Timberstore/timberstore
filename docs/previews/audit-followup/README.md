# Audit follow-up – 0.7.6-rc.0, iba preview

Požiadavka majiteľa 1. 11. 2026: vyskúšať kontrast a nadpisy v preview; prázdne kategórie rieši sám; N/A značku nahradiť Timber Store; zlepšiť kontakty a doplniť spoločné hodiny. Dodatočne schválil viditeľný H1 „Nábytkové kovanie a príslušenstvo“. Trello kód nedodaný, karta nevymyslená.

## Bezpečné porovnanie

Všetky nové experimenty sa spustia iba pri `TimberLoader.preview === true`. Produkčný loader stále obsahuje `PROD = 'v0.7.5'`. Žiadny merge, stabilný release/tag ani admin zmena. Kategórie, expedičné lehoty, produktové názvy/prílohy/URL/Mergado a zelená paleta checkoutu nezmenené.

- `ts_contrast=copper`: odporúčaná tmavšia medená #a95d25 s bielym textom (4.91:1), hover #8f4d1e (6.47:1).
- `ts_contrast=ink`: existujúca oranžová #d4884a s tmavým textom #29241f (5.43:1).
- Voľba je uložená iba v sessionStorage konkrétnej karty a medzi stránkami sa zachová. Odkaz s explicitným variantom ju prepne; `?ts_preview=off` vráti produkciu.
- Menia sa iba overené oranžové CTA detailu/podpory/pätičky/kontaktného formulára. Iné tlačidlá, výška, text, množstvo a natívne eventy ostávajú.
- Obidve možnosti majú navyše tmavší text centrálneho skladu a dostatočne tmavé odkazy v informačnej pätičke. Toto nie je úplný WCAG audit celého webu.

## Kontakty

Pôvodný formulár sa presunie ako ten istý DOM uzol. Zachová `action`, method, ID, všetky polia, hidden hodnoty, honeypot, CAPTCHA, súhlas aj natívnu validáciu a odoslanie. Pridané autocomplete name/email. Na mobile ide najprv podpora/hodiny/email/telefón, potom formulár, sídlo a pomocné odkazy; od 992 px dva stĺpce.

Hodiny a stav zdieľajú existujúci Bratislava timer s hlavičkou/pätičkou. Pôvodné fakturačné údaje sú presunuté bez prepisu; pridané DIČ 2122201609 potvrdené priamo majiteľom (FinStat odkaz), IČ DPH SK2122201609 zostáva. Adresa je označená ako sídlo, bez tvrdenia o predajni/osobnom odbere. Dopĺňa sa podpora, Facebook/Instagram z overených spoločných konštánt a odkazy na stav objednávky, dopravu, reklamácie a ochranu údajov. Údaj o zápise v OR zatiaľ nebol dodaný a nevymýšľa sa. Nejde o potvrdenie úplnej právnej zhody.

## Nadpisy

V preview: hlavný natívny titul článku ostáva H1; opakovaný obsahový titul ostáva vizuálne ako odstavec, očíslované kapitoly sú H2, podkapitoly H3. Texty, inline atribúty/obsah a pôvodný vizuálny vzhľad nadpisov sa zachovajú. Úvod má schválený viditeľný H1 nad kategóriami.

Toto je prehliadačová ukážka: pôvodné HTML v CMS stále obsahuje chybnú hierarchiu. Trvalé SEO riešenie má opraviť zdrojový HTML obsah v editore článkov a následne odstrániť dočasnú runtime normalizáciu. Žiadny právny text ani expedičné tvrdenie sa nemení. Počet H1 na článkoch po inicializácii: doprava 10→1, VOP 23→1, reklamácie 12→1.

## Značka N/A

Iba presné N/A (s toleranciou medzier/veľkosti písmen) v sémantických miestach značky sa nahradí hodnotou Timber Store. Ostatné značky, produkty a text „N/A“ mimo značiek sa neprepisujú. Starý odkaz /znacka/n-a/ sa zmení na obyčajný text; nevymýšľa sa nová URL. Aktualizuje sa aj DOM Brand meta name, nie deklarácia manufacturer. Pozor: import/databáza/pôvodné HTML sa tým nemení; trvalá dátová oprava musí ísť do zdroja/importu s exportom a dry-run podľa CONTRIBUTING.

## Overenie a limity

Lint/build a kontroly na Chromium desktop/mobile; 16 stránka×šírka kontrol na 375/1440 px, kontakty navyše 320/1024 px PASS, konzola bez nových chýb. Presné bajty CDN a produkčné vypnutie experimentov overené. Doprava/VOP/reklamácie: textContent aj vypočítané vizuálne štýly všetkých pôvodných nadpisov identické. Centrálny sklad 5.43:1, informačné odkazy pätičky 5.50:1. Kumulatívne nákupné kontroly oboch kontrastov na desktop/mobile prešli až po osobné údaje; vlastný skúšobný košík vyčistený. Nákupné dôkazy sú z 40612a1; jediný následný aplikačný rozdiel v 0054e90 je majiteľom potvrdené DIČ v kontaktoch. Finálny CDN test vrátane DIČ je 0054e90. Formulár/účet ani objednávka sa neodosielajú. Safari na reálnom iPhone a PageSpeed NOT TESTED. Tretie strany blokované sieťovou politikou sa nepovažujú za chybu webu. Expedičné lehoty čakajú na obchodné rozhodnutie majiteľa. [Zoznam 21 prázdnych kategórií](PRAZDNE-KATEGORIE.sk.md).


## Overený commit-preview

Zmrazený zdroj/build: `0054e904ef4e27824406a8e96fb7a3e71e3d6f0f`. Nasledujúci commit iba dopĺňa dôkazy. Gzip: JS 36.17/36.25, CSS 32.20/32.5 KiB. `cdn-assets.json`, `cdn-qa.json`, `cdn-extra.json`, `cdn-copper-cart.json`, `cdn-ink-cart.json`.

- Odporúčaná medená: https://www.timberstore.sk/hmozdinka-do-steny-10x60mm/?ts_preview=0054e904ef4e27824406a8e96fb7a3e71e3d6f0f&ts_contrast=copper
- Alternatíva tmavý text: https://www.timberstore.sk/hmozdinka-do-steny-10x60mm/?ts_preview=0054e904ef4e27824406a8e96fb7a3e71e3d6f0f&ts_contrast=ink
- Kontakty: https://www.timberstore.sk/kontakty/?ts_preview=0054e904ef4e27824406a8e96fb7a3e71e3d6f0f&ts_contrast=copper
- Úvod: https://www.timberstore.sk/?ts_preview=0054e904ef4e27824406a8e96fb7a3e71e3d6f0f&ts_contrast=copper
- Nadpisy dopravy: https://www.timberstore.sk/doprava-a-platba/?ts_preview=0054e904ef4e27824406a8e96fb7a3e71e3d6f0f
- Vypnutie: https://www.timberstore.sk/?ts_preview=off
