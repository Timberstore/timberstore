# LB1 · Luigi continuation 0.7.8-rc.0 — NESCHVÁLENÉ / ČIASTOČNÉ

## Stabilný základ a izolácia

Vydaná stabilná v0.7.7 smeruje na f0bfec1128d82a5f48a749991a00ce11d33e4f04;
main obsahuje aj doklady publikácie. Aktuálny verejný HTML loader aj živý browser
potvrdili v0.7.7/preview=false. Stabilná oprava obsahuje iba odstránenie nechceného
homepage H1; nevydala rozpracované Luigi zmeny.

Pracovná vetva PR68 má main zapracovaný merge commitom5cc930c. Štyri zdrojové
súbory opravy H1 sú bez rozdielu oproti main. Loader v pracovnej vetve ostáva
PROD=v0.7.7 a H1 sa v novom kandidátovi znovu nevytvára.

Nový voľný kandidát **0.7.8-rc.0**, nemenný build **3cef596**:
https://www.timberstore.sk/?ts_preview=3cef596

Search preview: https://www.timberstore.sk/vyhladavanie/?string=BLUM+450&ts_preview=3cef596
Žiadny existujúci build/tag sa neprepisoval; tags-before.txt zaznamenáva vzdialené
tagy pred prácou. Publikovaný je iba commit-preview, nie nový stabilný tag/release.

## Neblokované zmeny v tomto kroku

Iba scoped CSS pod html.ts-luigi-preview a explicitnými existujúcimi Luigi rootmi.
Homepage odporúčania sa tým NEVYPÍNAJÚ — požadované selektívne vypnutie vyžaduje
externú konfiguráciu podľa SUPPORT-REQUEST.md. Produkčné ani vendor nastavenia
sa nemenili. Existujúci root/DOM sa nereinicializuje, nepreusporadúva, neklonuje.

| Komponent | Problém → referencia | Zmena / stav |
|---|---|---|
| Search/AC vrátane Top | Technické názvy preberali clamp; referencia je zachovanie podstatných údajov | Zachované staršie kandidátne unclamp/flow/focus úpravy; nová verifikácia proti0.7.7 |
| Home personalizovaný/last_seen | Odporúčania pridané navyše, majiteľ ich nechce | Externá deaktivácia BLOKOVANÁ; spoločný preview title/focus štýl nemení existenciu ani placement |
| product_detail / basket / basket_popup | Pásy preberajú title cap z produktových štýlov | Nové izolované odstránenie cap/maxheight bez orezávania textu; zachované carousel/slide/buy prvky |
| Všetky odporúčacie pásy | Existujúce gross/SKU/unit/net mali rozdielne ink/focus pravidlá | Zjednotenie iba prítomných uzlov: modrá gross/SKU, sekundárna netto/unit, viditeľný keyboard focus. Chýbajúce údaje nevytvárame |
| Search a recommender dostupnosť | Vendor generuje potvrdenú natívnu zelenú aj ako inline rgb(46,125,50), ktorú hex-only override nepokrýval | Normalizácia iba tejto pozorovanej inline zelenej na schválený #00C853; žiadne odvodenie počtu/stavu. Unknown farby/stavy nezmenené |
| CTA/ikony/množstvá | Existujúce native/vendor handlery majú vlastný kontrakt | Žiadne nové nákupné ovládače ani handlery. Nezamieňame oranžové tlačidlo za funkčnú paritu množstiev |

Referencie: pôvodná karta/kompaktné odporúčania/košík a tokeny sú v
../homepage-restoration/INVENTORY.md a reference-computed.json; šírky1440/768/375.
Nevyvodzujeme net cenu z univerzálnej DPH sadzby, nevymýšľame stock counts, SKU
alebo unit, ktoré vendor aktuálne nevykresľuje. Zákaznícka identita sa nemení.

## Overenie a význam výsledkov

verification.json má šesť oddelených kontextov: produkcia0.7.7 vs skutočný CDN
preview0.7.8-rc.0 pri1440/768/375. Kontexty nezdieľajú cookies. V každom sa
zachytáva homepage, AC prázdny/písanie, výsledky, detailový pás, popup a košík.
Screenshoty before sú produkcia, after je preview. Dopyt/probe cesta sú zhodné;
personalizované odporúčania môžu mať rôzny obsah — zmena obsahu sa nevydáva
za CSS efekt. DOM počty zahŕňajú carousel klony, nie unikátne odporúčania.

Preview v zaznamenaných menách nemá title clipping ani page horizontálny overflow;
žiaden pageerror v šiestich behoch. Toto nie je dôkaz všetkých dynamických stavov
widgetov. Tabletový vendor vstup preberá mobilný hero panel, preto test používa
aktuálne viditeľný hero input aj pri768px, nie skryté pôvodné pole.

SKU237597: v každom kontexte native detail amount100 a Luigi Search default add
100ks ×0,09 =9€. Jedna cart operácia na daný klik. Reálne serverové hodnoty
sú v cart.amounts/text. Žiadna objednávka alebo osobné údaje neodoslané.

native-step.json priniesol novú presnú referenciu: po úplnom načítaní multiply_order
má natívny detail min100/step100. Zadané101 sa po blur normalizuje na200 a serverový
košík účtuje200ks/18€. Staršie rýchle čítanie step1 zachytilo prechodný stav pred
ustálením doplnku; nebolo dôkazom finálneho pravidla. Toto nenahrádza test min≠step.

package-purchases.json porovnáva iný význam balenia: SKU344255 je 1 balenie
(obsah8650ks) za186,49€. Natívny detail, Luigi výsledky a AC vložili do troch
oddelených košíkov vždy1 balenie za186,49€, nie8650 jednotiek. Vendor request má
iný encoding, takže null v jednoduchom URL-form parseri nie je množstvo;
rozhoduje skutočný serverový cart. Sú to konkrétne prípady, nie celá integrácia.

## Analytika — dôležitá oprava spôsobu merania

Pôvodný Playwright request.postData() nezachytil telo jednej conversion požiadavky.
Nemožno z toho vyvodiť stratu udalosti. Nový read-only CDP záznam getRequestPostData
zachytáva aj toto telo bez zmeny transportu, bez náhradných udalostí/handlerov.
Ukladajú sa iba typy, consent, verejný resource a logické väzby — nie visitor IDs.

analytics-cdp.json a analytics-baseline-cdp.json potvrdzujú Search buy na preview
aj stabilnej produkcii pri reject/accept UI. Po bezprostrednom accept môže byť
consent ešte false; analytics-consent-settled.json overuje zmiznutie UI a3s
ustálenie pred nákupom. V tejto ustálenej preview udalosti je consent=true.

**Otvorený konkrétny problém:** Search dopyt237597 poslal buy, ale v zachytenej
action chýbal resource_identifier a attributions. Baseline aj preview meranie
ukazujú chýbajúce tieto polia v exporte. Je to dôvod pre vendor diagnostiku,
nie úspešne potvrdená atribúcia. Samotné HTTP200 je iba príjem transportu.
Vo vendor reportingu zápis nemáme ako overiť. Všetky placementy/consent stavy
zatiaľ nemožno vyhlásiť za funkčne zjednotené.

## Zostávajúce blokery

- Externé vypnutie iba homepage_personalized/homepage_last_seen v podporovanom
  vendor preview; UI/settings export a admin audit log nie sú dostupné.
- Oficiálne qty/min/step/pack/max/variant/orderable mapovanie a podporované
  šablóny pre chýbajúce unit/net/sku/stock quantity vo všetkých placementoch.
- Neobjednateľný výrobok, živý variant a nezávislý min≠step stále nie sú
  kvalifikované vzorky; nesimulujeme ich ako dôkaz živého fungovania.
- Attribúcia jednotlivých buy vrátane resource/list/impression a vendor reporting.
- Globálny whitelist facetov/článkov a všetky stránky/paging, keyboard/scroll/
  carousel interakcie a fyzická mobilná klávesnica; Safari/WebKit nedostupné.
- Presná parita jednotiek, netto a nákupného ovládania všetkých odporúčacích
  widgetov zostáva neúplná; schválená identita má samostatný kontrastný nedostatok.

## Vypnutie a rollback

https://www.timberstore.sk/?ts_preview=off → navigácia bez parametra,
TimberLoader.preview=false, Timber.version=v0.7.7. Produkčný loader/tag nemeníme.
Staré preview commity aj stabilná v0.7.6 zostávajú zachované. Návrat na starší
stable nie je potrebný na vypnutie tohto preview a vrátil by nechcený H1.

Externé nastavenia sa cez ts_preview/Git nevracajú. Ich budúca zmena vyžaduje
samostatný presný export pôvodných admin hodnôt, izolovaný vendor preview,
schválenie publikácie a vlastný rollback. SUPPORT-REQUEST.md je pripravený,
neodoslaný a nepublikovaný. Žiadny merge ani produkčné nasadenie nových Luigi zmien.

Lint/build PASS: JS36.08KiB /36.25, CSS32.92KiB /33.25 (nový preview rozpočet
podľa zaznamenaného preview oprávnenia; stabilné rozpočty nezmenené).


## Doplňujúce konkrétne výsledky

- repeat-and-ajax.json: dva Luigi Search buy kliky naSKU237597 dali200ks/18€;
  natívna zmena košíkového množstva na300 sa uložila cez AJAX a po reload zostala
  300ks/27€. Je to konkrétny prípad opakovaného kliku a natívneho prekreslenia,
  nie dôkaz všetkých widgetových editácií množstva.
- analytics-two-results.json: na preview dopyt BLUM71B3550 (dva produkty) poslal
  buy s presným resource URL306317, consent=true, Search Results atribúciou
  previazanou na zachytený impression event. Pri jedno-produktovom dopyte237597
  ostali resource/attributions neprítomné aj po3s ustálení consentu. Podpora má
  teda konkrétne dve reprodukcie na porovnanie. Netvrdíme, že príčinou je samotný
  počet výsledkov; to je pozorovaný rozdiel, nie dokázaná vnútorná príčina.
- last-seen.json: po návšteve troch konkrétnych detailov v každom izolovanom
  kontexte ostal homepage_last_seen root bez produktov. Obsahový before/after
  tohto widgetu preto nie je potvrdený a nie je falošne nahradený modelom.
  Selektívne vypnutie podľa majiteľa stále vyžaduje vendor preview.

Kópie testovacích skriptov sú pri reporte; CDP slúži iba na čítanie existujúcej
sieťovej prevádzky, žiadne nové business eventy neposiela. Raw visitor IDs sú
iba dočasný privátny diagnostický podklad mimo repa a nie sú súčasťou dôkazov.
Galéria: index.html. Snímky pokrývajú7stavov ×3šírky ×2verzie=42PNG, okrem
nezobrazeného last_seen. Ďalšie3 package cart snímky sú funkčné dôkazy3vstupov.
