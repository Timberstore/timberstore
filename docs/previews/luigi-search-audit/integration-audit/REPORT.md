# LB1 · audit nákupného kontraktu a rc.4 — NEDOKONČENÉ / NESCHVÁLENÉ

Nový preview build **0.7.7-rc.4**, commit `e8148ed`, nadväzuje na rc.0 bez
prepísania buildu/tagu. Pred začiatkom overené vzdialené refs, produkčný HTML
loader stále PROD v0.7.6. Žiadna administrácia Luigi/Shoptet sa nemenila.

Zapnutie: https://www.timberstore.sk/vyhladavanie/?string=BLUM+450&ts_preview=e8148ed
Vypnutie a rollback: https://www.timberstore.sk/?ts_preview=off a ďalšia navigácia
bez parametra; overiť TimberLoader.preview=false a Timber.version=v0.7.6.
Preview cookie platí 7 dní iba v danom prehliadači. Stabilný bod v0.7.6 zachovaný.
Build nie je pripravený na produkčné schválenie.

## Zdroj pravdy

Preštudované CLAUDE.md, CONTRIBUTING.md, core/selectors.js, qty-picker/index.js,
cart-modal-speed/index.js, product-card.css a existujúce dôkazy nákupných testov.
Natívny qty-picker nemení cart API: zapisuje amount do Shoptet formulára, submit
ponecháva Shoptetu. Krok vychádza z amount doplneného multiply_order, hranice sa
čítajú z min/max, hodnota sa zaokrúhľuje nahor na krok. Nie je to všeobecné
pravidlo odvodené len z feed minimum_amount. Detail/košík majú natívne ovládače.
Native form nesie productId/priceId a amount; variant sa nesmie hádať podľa názvu.

## Konkrétne rozdiely

| Oblasť | Existujúci Timber/Shoptet | Luigi | Stav |
|---|---|---|---|
| Množstvo | Natívny amount + qty-picker, hranice a balenie | Search nemá form ani amount; AC/Top majú vlastnú buy akciu | BLOCKED: potrebný podporovaný qty hook |
| Minimum | SKU 237597 amount/min=100 | Feed minimum_amount=100; UI ho nevysvetľuje | Default add reálne 100; editácia/zaokrúhlenie neoverené |
| Balenie ako jednotka | SKU 344255: 1 balenie obsahuje 8650 ks | Feed unit=balenie, minimum=1 | Nezamieňať obsah balenia s order amount |
| Jednotky | Native ks/pár/balenie/sada | Search má jednotku; AC/Top má v pozorovanom DOM len cenu | BLOCKED: podporovaná unit šablóna |
| DPH | SKU 306317 detail 4,11 gross / 3,34 net | Search/AC v zachytených kartách neukazujú zodpovedajúci net údaj | BLOCKED: autoritatívny net/tax kontrakt; nevypočítavať vlastnou sadzbou |
| Varianty | SKU 494606 natívny detail + externý doplnok | Samostatný výsledok nie je potvrdený variantový výber | BLOCKED: živý variantový kontrakt a API dostupnosť |
| Dostupnosť | Skladom zelené, centrálny sklad oranžové | Pôvodný AC mal centrálny sklad zelený | Opravené v preview podľa explicitných metadát |
| Kód | Modrý SKU, neutrálny label | Search používa vnorený SKU; AC SKU nezobrazuje | Search modrá zachovaná; AC doplnenie vyžaduje template |
| Ikony | Natívny Shoptet glyph + jednotný button | AC používa SVG/cart icon a vendor button | Čiastočné: farebnosť CSS; vendor ikonu nenahrádzame krehkým JS |
| Názvy | Dôležité technické parametre | Legacy clamp prenikol do Search, AC vlastný clamp | Preview odstráni clamp; mobilný rc.4 má 1 čitateľný stĺpec |
| Top produkt | Nemá preberať väčšinu plochy | AC samostatný hero stĺpec | Obrázok zmenšený; úplný template redesign čaká na podporované hooks |
| Filtre/radenie | Natívna zákaznícka taxonómia | Cena/štítky/kategórie/výrobca/farba a vendor sort | Konkrétne UI kontroly v filters.json; nejde o audit celej konfigurácie |

CSS rieši len vzhľad. Nevkladá nefunkčné qty ani variantové ovládače, nemení
vendor eventy, neinicializuje widget znovu a nevolá vlastný cart endpoint.
Pozorované vendor DOM triedy nie sú deklarované za dokumentované verejné API.

## Reprezentatívne kontroly a hranice

- **Kusový 306317:** predchádzajúci CDN test 1 ks × 4,11 = 4,11; rc.1 audit
  potvrdil amount/min/step=1, unit=ks, detail gross/net 4,11/3,34. Nákup z rc.1
  nie je týmto automaticky recertifikovaný.
- **Minimum/balenie 237597:** nový živý test native-detail, Luigi Search aj
  Autocomplete/Top, každý v samostatnom anonymnom kontexte: v košíku SKU237597,
  100 ks × 0,09 = 9 €. Jedna pozorovaná cart POST na akciu. Vendor POST používa
  iný encoding; null v parsovanom amount nie je dôkaz chýbajúceho množstva.
  Skutočný serverový cart amount bol 100 vo všetkých troch prípadoch.
- **Balenie 344255:** feed 186,49 €/balenie a minimum1. Detail amount/min1.
  Nákup 1 balenia/hranice/účtovanie fyzických ks **NOT TESTED**.
- **Variant 494606:** feed 2,26 €/ks, minimum1; detail má priceId.
  Variantové odkazy v zachytenom DOM chýbali. Variantový nákup **BLOCKED**;
  staršie fixture testy nie sú živý dôkaz. Niektoré detailové innerText boli
  prázdne počas načítania, preto nimi nepotvrdzujeme aktuálnu netto cenu.
- **Nedostupný:** dopyt „nedostupné“ vrátil odporúčanie dostupného produktu,
  nie kvalifikovaný test nedostupnosti. **NOT TESTED**, treba potvrdené SKU.
- **Násobiteľ odlišný od minima:** 237597 nepokrýva nezávislé pravidlo min≠step;
  **NOT TESTED**, potrebné potvrdené SKU a kontrakt multiply_order.
- **Analytika:** otvorený blocker z rc.0; zachytenie atribúcie sa nepodarilo
  spoľahlivo zopakovať na CDN. Žiadne duplicitné/náhradné handlery nepridané.
- Safari/WebKit: nedostupné, **NOT TESTED**. Objednávka neodoslaná.

Reálne snímky pred/po sú oddelené `*-before.png` (stabilná v0.7.6) a
`*-after.png` (CDN rc.4), s rovnakým dopytom BLUM450 a viewportom.
products.json obsahuje verejné metadáta/DOM, pack-purchases.json serverový cart.
Snímky natívneho/Luigi pack cartu dokladajú skutočné pridanie, nie model.

## Externé nastavenia a zostávajúca práca

Žiadne externé nastavenie nebolo zmenené. Pôvodný pozorovaný AC centrálny sklad
zelený; Search oranžový. Admin hodnoty nie sú dostupné, preto nie sú vymyslené.
Ak sa bude meniť konfigurácia, zaznamenať samostatný export pôvodných hodnôt,
presný diff a vendor rollback; návrat buildu nastavenia nevráti.

Konkrétna neodoslaná požiadavka: SUPPORT-REQUEST.md. Blokery: qty/min/step
kontrakt, units/net template, varianty/nedostupnosť a analytika. Dokumentačný host
je blokovaný sieťovou politikou; žiadny bypass. Bez potvrdenia podporovaných
hooks nepovažujeme prepracovanie za dokončené. HTTP200 ani jeden úspešný nákup
nepredstavujú overenie celej integrácie. Produkčné schválenie sa nežiada.


## Nové vykonané UI kontroly

BLUM450, rc.1: sort price_eur_amount:asc dal 24 monotónne rastúcich cien
0,11 → 9,03 €. Kliknutie na Skladom vrátilo 13 produktov, všetky so Skladom.
Zobrazené facety: Cena, Štítky, Kategórie, Výrobca, Farby; creation_time sa
v tomto dopyte nezobrazuje. Nejde o dôkaz globálneho whitelistu všetkých dopytov.
SKU hodnoty v screenshots.json sú potvrdené computed #2454A6 pred aj po.

Rc.1 bol pri vizuálnej kontrole odmietnutý ako kandidát mobilného stĺpca:
vendor injected !important pravidlo ho prepisovalo. Jeho build commit zostáva
nezmenený; rc.2 pridáva zdokumentovanú izolovanú CSS výnimku. Historické PNG
neoznačujú dokončené nákupné prepracovanie.

Rc.2 tiež neprešiel vizuálnou kontrolou: kontajner nebol grid, samotná zmena
počtu grid stĺpcov nestačila. Rc.3 aktivuje grid iba v mobilnom preview.
Rc.1 a rc.2 zostali zachované pod vlastnými commitmi, žiadny tag sa neprepisuje.


Rc.3 diagnostika potvrdila computed display:flex vynútený vendorom; grid návrh
bol preto opustený. Rc.4 zachováva pôvodný flex kontajner a mení len mobilný
smer a šírku karty. Nejde o zásah do poradia ani vendor rendereru.

Ďalší nález zo zdrojov: cart-count/index.js mapuje natívny priceId cez Shoptet
dataLayer a počúva CartUpdated/DataLayerUpdated. Luigi Search nemá tento
natívny form/priceId input, preto parita indikátora „už v košíku“ nie je
potvrdená. Aj túto funkciu treba riešiť podporovaným vendor kontraktom, nie
pridaním druhého buy handlera.

Majiteľ nevie určiť hraničné SKU; hľadanie cez dostupné dáta zatiaľ nepotvrdilo
nezávislý násobiteľ ani neobjednateľný výrobok. Tieto dve medzery zostávajú
explicitne nepokryté a sú zahrnuté v neodoslanej požiadavke pre podporu.
