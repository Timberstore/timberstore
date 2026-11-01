# Vizuálne doladenie príloh – preview 0.7.5-rc.1

30. 10. 2026, pokračovanie existujúcej implementácie a toho istého commit-preview postupu. Bez tagu, release, merge alebo zmeny produkčného loadera.

## Zmeny

- Ľavá ikona je čistá SVG kresba dokumentu so zahnutým rohom a riadkami, namiesto prázdneho obdĺžnika.
- Pravá SVG ikona vyjadruje otvorenie v novej karte. Zodpovedá skutočným externým odkazom; iba odkazy s už existujúcim atribútom `download` dostávajú ikonu sťahovania.
- SVG masky sú vložené v CSS, bez ďalších súborov alebo sieťových požiadaviek. Používajú existujúci oranžový akcent.
- Pôvodný odkaz pokrýva celý riadok vrátane oboch ikon. Jemný hover a viditeľný klávesnicový focus ostávajú.
- Len aktívna sekcia `#relatedFiles.ts-downloads` má zmenšené spodné odsadenie: desktop z pôvodných 40/60 px na 16 px, mobil vnútorného obsahu z 30 px na 16 px. Zbalený mobilný obsah zostáva bez pridaného odsadenia.
- Typografia, farby, oddeľovače, rám, rozloženie, názvy a href sa nemenia. Bez zmien JavaScriptovej logiky, importov alebo ďalších častí detailu. Generovaný JS sa líši iba interným číslom kandidáta.

## Overenie

Prehliadač Chromium 151: šírky **320, 375, 390, 768, 1024, 1440 px**, pri prvých troch s mobilnou dotykovou emuláciou. Testuje sa aktuálny verejný produkt 313668 a jeho natívne Apollo DOM/skripty. Pri lokálnom teste je pridané iba kandidátne CSS nad predchádzajúci preview. Pre následný CDN test sa nepoužíva žiadna náhrada kandidátnych súborov.

- Pri každej šírke klik/tap na ľavom okraji, texte a pravom okraji oboch riadkov: **36/36** úspešných zásahov odkazu.
- Riadky minimálne 56 px, SVG masky 24 px vľavo a 20 px vpravo, nulový presah stránky a riadkov.
- Dlhý názov vrátane slova bez medzier sa zalomí; iba dočasný browser fixture, nepersistuje sa do zdrojov ani údajov produktu.
- Overené podfarbenie pri hoveri a 2px outline po skutočnom klávesnicovom Tab.
- Natívny mobilný accordion sa zavrie/otvorí; na desktope funguje prepnutie Popis → Súbory na stiahnutie.
- Presná zhoda názvov a href pred/po. Dve pôvodné dodávateľské URL sa neotvárajú; všetky testovacie kliky sa zachytávajú pred navigáciou. Požiadavky na obsah dokumentov: **0**.
- HTML a vypočítané odsadenie sekcií popis/diskusia sa pred/po CSS presne zhodujú.
- Vizuálne skontrolované snímky 375 a 1440 px.

Existujúce cookie upozornenie a informačný toast sa v testovacej relácii zatvárajú ich natívnym ovládaním, aby neprekrývali testované riadky. Produkčný kód ich nemení.

HTTPS zdroje načítava Node cez zdedené proxy a CA trust s platnou TLS kontrolou; Chromium ich dostáva cez route.fulfill, pretože jeho samostatná dôvera v proxy certifikát nie je nakonfigurovaná. Obsah stránky a skripty sú aktuálne živé zdroje. Safari a fyzický iPhone **NOT TESTED**. Nevykonal sa nákupný priechod ani plošný regresný test ďalších častí webu pre túto malú zmenu.

`npm run lint`, `npm run build`, `node scripts/test-downloads.mjs`, `git diff --check`: PASS. Gzip JS 34.01 / 34.25 KiB, CSS 31.16 / 31.25 KiB. Limity starších verzií nezmenené.

Zmenené zdroje: `src/styles/overrides/product-downloads.css`; interná lokálna verzia v package.json/package-lock.json, zodpovedajúci rozpočet v scripts/build.mjs, generované dist súbory a dokumentácia. Zdrojový modul JS, názvy, href a import zostali bez zmeny voči predchádzajúcemu preview.

Dôkazy: `polish-local-qa.json`, reprodukovateľný skript `polish-qa.mjs`. Štart z koreňa checkoutu: `node --use-env-proxy docs/previews/product-downloads/polish-qa.mjs`. CDN režim: `TS_QA_SHA=<preview-commit> node --use-env-proxy docs/previews/product-downloads/polish-qa.mjs`. Vyžaduje dostupný Playwright/Chromium, sieťové oprávnenie a existujúci adresár work/downloads/polish.
