# LB1 · Reálny Luigi preview, 2. 11. 2026

Tento report nahrádza staršie sieťové blokácie v AUDIT.md a NETWORK-ACCESS.md.
Zmena je iba v `docs/previews/luigi-search-audit`; CSS sa injektuje do izolovanej
Chromium session. Produkčné src/dist, loader, verzia a Luigi administrácia sa nemenia.

## Načítanie a odpovede

`live/verification.json` obsahuje pozorované HTTP statusy bootstrapu, runtime,
našeptávača, výsledkov a analytického endpointu pri 1440 × 1000 a 375 × 812.
`live/search-responses.json` obsahuje 15 pôvodných dopytov, počty výsledkov a prvých
najviac desať verejných produktov priamo z Luigi API. Všetky vracajú HTTP 200.
Neukladajú sa cookies, visitor GUID, request bodies ani prihlasovacie údaje.
Úspešná odpoveď analytiky sama neoveruje atribúciu nákupu.

Reálne korene: `#lbx-ac-element` pre Autocomplete a `#lb-search-element` pre Search.
Search používa `.lb-product` s vnorenou Shoptet kartou `.p`; preto sa naň prenáša
produkčné obmedzenie názvu na štyri riadky. Autocomplete používa samostatné
`.luigi-ac-*` komponenty. Selektory sú overené v aktuálnom DOM; vendor ich môže
zmeniť a nejde o záruku stabilného API. Referencia možností prispôsobenia:
https://docs.luigisbox.com/quickstart/autocomplete/customizing-autocompletejs/

## Izolované CSS

`luigi-scoped.css` povoľuje celé technické názvy, zmenšuje obrázok Top produktu,
na desktope dáva ostatné zhody do čitateľných riadkov a zjednocuje oranžové akcie.
Zväčšuje plochy filtrov, radenia a akcií na 44 px a pridáva viditeľný focus.
Existujúci Top produkt, poradie, linky, ceny a vendor handlery ostávajú v DOM.
Kód/SKU používa modrú. Žiadne nové event listenery ani opätovná inicializácia Luigi.

Dve označené výnimky `!important` prebijú existujúci produkčný clamp a vendor
pozadie akcie. Sú potrebné iba pre izolovaný preview; pred prípadnou produkčnou
integráciou treba vyriešiť pôvodné konfliktné pravidlá podľa CONTRIBUTING.md.

Dostupnosť sa nepreklasifikuje podľa farby alebo odhadovaného významu číselnej
triedy. Pozorovaný rozdiel: autocomplete zobrazuje aj „Centrálny sklad“ zelenou,
zatiaľ čo Search používa oranžovú #C97A2B z feedu. Je to existujúci stav, zachytený
pred aj po. Pred nasadením treba potvrdiť vendor mapovanie dostupnosti, aby
centrálny sklad používal schválenú oranžovú a lokálny sklad #00C853. Slabý kontrast
schválenej palety zostáva otvoreným bodom; tmavý variant z modelu sa neaktivuje.

## Snímky a reprodukcia

Galéria: [live/index.html](live/index.html). V `live/` sú páry `results-{1440,375}-{before,after}.png` a
`autocomplete-{1440,375}-{before,after}.png`. Vždy ide o živý Luigi DOM pre
„BLUM 450“, rovnakú šírku a stav v jednej session. Nie sú to modely ani fallback.
Doplňujúce `results-cards-*` ukazujú samotné karty pri zhodnom odscrollovaní.
Strojové porovnanie je v `live/qa.json`. Staré `before-results-*` a `proposal-*` sa na reálne snímky nepremenovali.

Reprodukcia: nainštalovaný `playwright-core`, Chromium a dôvera k CA prostredia;
spustiť `node capture-live.cjs` v povolenom sieťovom prostredí. Voliteľné
`PLAYWRIGHT_MODULE` a `CHROMIUM_PATH` vyberajú už nainštalované nástroje.
Skript rešpektuje HTTPS_PROXY a nevypína TLS kontrolu. Na mobile používa živý
vstup `.luigi-ac-heromobile-input`, pretože vendor po otvorení preberá vstup.

## Hranice overenia

Chromium mobile je emulácia viewportu a dotyku, nie fyzický iPhone/Safari.
Nákupný tok, atribúcia konkrétneho košíkového eventu, klávesnica reálneho mobilu,
produkčné Core Web Vitals a administrácia/index konfigurácia nie sú overené.
CSS nenahrádza úpravu relevancie, creation_time ani feedu. V zachytenom paneli
BLUM 450 sa creation_time medzi filtrami nezobrazil; jeho existencia v metadátach
produktu sama nepreukazuje zákaznícky filter.

Bez merge, tagu, release, deploymentu alebo zápisu nastavení dodávateľa.

## Aktuálne počty produktových výsledkov

| Dopyt | Výsledky | HTTP |
|---|---:|---:|
| BLUM 450 | 510 | 200 |
| Legrabox K 450 čierna | 194 | 200 |
| BLUM 71B3550 | 2 | 200 |
| pánt 110 naložený | 4 | 200 |
| záves 155 | 23 | 200 |
| úchytka 160 čierna | 65 | 200 |
| SPAX 4x16 PZ | 9 | 200 |
| skrutka M4x8 | 1 | 200 |
| LED pás 24V IP65 | 6 | 200 |
| Gola J profil | 40 | 200 |
| Hettich Sensys | 124 | 200 |
| Franke UBG 611-86 | 3 | 200 |
| TIP-ON BLUMOTION | 773 | 200 |
| potravinová skriňa | 233 | 200 |
| šuflíkové pojazdy | 131 | 200 |

Počty patria okamihu merania. HTTP 200 nie je hodnotenie technickej relevancie;
poradie a presné názvy sú uložené oddelene od historického Shoptet baseline.
