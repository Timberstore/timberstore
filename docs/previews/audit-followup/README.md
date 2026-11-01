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

Lint/build a kontroly na Chromium desktop/mobile; kompletné výsledky sa doplnia po presnom CDN teste. Formulár/účet ani objednávka sa neodosielajú. Safari na reálnom iPhone a PageSpeed NOT TESTED. Tretie strany blokované sieťovou politikou sa nepovažujú za chybu webu. Expedičné lehoty čakajú na obchodné rozhodnutie majiteľa. [Zoznam 21 prázdnych kategórií](PRAZDNE-KATEGORIE.sk.md).
