# LB1 · 0.7.8-rc.4 — opravy A, otvorené blokery B

**Integrácia nie je dokončená ani schválená.** Toto je samostatný pracovný preview
s konkrétnymi opravami; body BLOCKED nižšie naďalej bránia akceptácii celej integrácie.

- Build **0.7.8-rc.4**, nemenný commit **a4e7ebc70e0a98216b3bd9c76f9c4406adb29154**.
- [Zapnúť preview](https://www.timberstore.sk/?ts_preview=a4e7ebc)
  · [Výsledky BLUM450](https://www.timberstore.sk/vyhladavanie/?string=BLUM+450&ts_preview=a4e7ebc)
  · [Galéria pred/po a natívna/Luigi karta](index.html).
- Produkcia zostáva **v0.7.7**. PR68 zostáva draft; nič sa nemergovalo ani nemenilo
  v Luigi/Shoptet administrácii. Neodoslala sa objednávka ani správa podpore.
- Odmietnuté rc.0 **3cef596** aj priebežný rc.1 **1e82d9e** zostali zachované.
  Rc.2 dopĺňa zarovnanie ďalších riadkov a mobilné ponuky bez prekrývania.
  `refs-before.txt` a `source-checks.json` dokladajú verzie pred novým buildom.

Nadväzujeme na [OWNER-REQUIREMENTS](../homepage-restoration/OWNER-REQUIREMENTS.txt)
a existujúci audit. Nová inventarizácia ho nenahrádza. Referenciou je skutočná
pôvodná TOP karta **553488**, nie maketa. `native-top-1440.png` a `native-top-375.png`
sú čistá produkcia v0.7.7. V galérii je vedľa nej tá istá SKU z Luigi na oboch šírkach.
**Pred = odmietnuté rc.0, po = rc.4**, každé v oddelenom browser kontexte bez cookies
z druhého buildu. Personalizovaný obsah môže kolísať; nevydávame ho za efekt CSS.

## Stav každého požadovaného bodu

| Bod | Trieda a stav | Konkrétna oprava alebo zostávajúca prekážka | Dôkaz |
|---|---|---|---|
| 1 · Riadky našepkávača | A · FIXED | Cena a akcia majú vlastné stĺpce; úplné technické názvy zostali viditeľné | `autocomplete-1440/375-before/after.png`, `verification.json` |
| 1 · Zobraziť všetky produkty | A · FIXED vizuálne | Normálny tok pod posledným riadkom, desktopový panel má vlastné posúvanie; žiadne prekrývanie produktu | `autocomplete-footer-1440/375-before/after.png`, geometria buttonTop/lastBottom v `verification.json`; samostatný klik test je v `show-all-and-config.json` |
| 1 · Ikona a Top produkt | A · FIXED ikona; B · BLOCKED nákupné ovládanie | Zdieľa sa presný natívny mask SVG; desktop nezobrazuje aj mobilnú akciu. Default Top nákup je otestovaný, editácia množstva/DPH/unit/skladové počty naďalej vyžadujú šablónu | `source-checks.json`, `purchases.json`, AC snímky |
| 1/2/4 · Komplet | B · BLOCKED | `flags_codes[].code=komplet` v dátach existuje, HTML stráca sémantickú triedu. Nepriraďujeme Komplet podľa hnedej farby ani textového prepisu DOM | Natívna a Luigi karta553488 v galérii; `SUPPORT-REQUEST.md` |
| 2 · Výsledky a zarovnanie | A · FIXED rozloženie | Skutočné karty sa rozťahujú na výšku riadka, aj pri rozdielne dlhých názvoch v druhom riadku. Ponuka má sklad/cenu a vlastný spodný riadok akcie | `results-row2-1440-before/after.png`, rovnaké offerY v každej otestovanej trojici v `verification.json` |
| 2 · Typografia/obrázky/názvy | A · FIXED prezentácia | Natívne 19px/1.3 desktop a14px/1.25 mobile, centrované názvy bez clampu; obrazová plocha s contain, na mobile prirodzený pomer strán. Neodstraňujeme technické údaje | `luigi-card-1440/375-after.png`, `results-*`, `detail-*`; porovnanie s natívnou kartou |
| 2 · Tabuľkové zobrazenie a popisy | B · BLOCKED | Natívny switch ukladá list voľbu, vendor Search ju nepoužíva. Chýba podporovaný row template/prepínač a potvrdené nastavenie slotu description. Nepridávame nefunkčný switch ani pretiahnutú dlaždicu označenú za tabuľku | `table-1440-before/after.png`, `verification.json`, konkrétne template identifikátory v požiadavke |
| 3 · Checkbox/vzorka a text | A · FIXED | Rezervovaný stĺpec, vertikálny stred s textom. Rozdiel stredu bol −10px, teraz0px na desktope aj mobile | `filters-open-1440/375-before/after.png`, `filters.json` labelGeometry |
| 3 · Hlásená nefunkčnosť | B · BLOCKED neuzavretá pôvodná chyba; funkčné skúšky prešli | Konkrétne kliky fungovali aj na rc.0. Klik na celý popis, Skladom, Biela, BLUM, kombinácie a reset sú odskúšané na oboch šírkach. Netvrdíme opravu nereprodukovaného handlera | `filters.json`: 24 načítaných →14 skladom →3 biele →3 BLUM →reset24; URL a zaškrtnuté inputy |
| 3 · Počet a interné polia | B · BLOCKED | Hlavička mieša produkty/kategórie/značky: napr.21=14+6+1. Viditeľné testované facety sú zákaznícke, globálny whitelist a všetky dopyty nie sú exportované | `filters.json`, presná reprodukcia v `SUPPORT-REQUEST.md` |
| 4 · Detail/košík/popup | A · FIXED fyzická ponuka a ikona; B · BLOCKED plná parita | Existujúce uzly, vlastný riadok CTA, zrušená rezerva pre absolútne tlačidlo. Úzka mobilná ponuka sa skladá do riadkov, ikona zachováva prístupný text tlačidla. Šírky slidov/track a pôvodné handlery zostali nedotknuté | `detail-*`, `cart-*`, `popup-*` pred/po; serverové nákupy v `recommendation-purchases.json`. Prípad chýbajúceho widgetu je označený NOT TESTED v `verification.json`, nie nahradený staršou snímkou |
| 1/2/4 · Ceny a množstvá | B · BLOCKED | Chýba autoritatívna netto cena/mapping a verejný nezávislý min/step/pack/max/variant kontrakt pre editáciu. `minimum_amount` a `unit` existujú. Nič nepočítame univerzálnou DPH sadzbou a nevyrábame vizuálne +/- bez funkcie | Natívna/Luigi553488, `native-reference.json`, `purchases.json`, požiadavka s presnými poliami |
| 1/2/4 · Dostupnosť | A · FIXED známe farby; B · BLOCKED počet/jednotka | Skladom zelené, Centrálny sklad oranžové, produktové kódy modré. `availability_stock_quantity` existuje, no význam skladových polí a natívny prah >100 potrebujú potvrdený render/mapping | Snímky a existujúce auditové hity; `SUPPORT-REQUEST.md` |
| 5 · Homepage | B · BLOCKED | Požiadavkou zostáva selektívne vypnúť iba homepage_personalized a homepage_last_seen. Z preview CSS sme ich vyradili; neskrývame ani nepreusporadúvame ich DOM. Zachovaných12 pôvodných kategórií a stabilná oprava H1 | `homepage-*`, `boundaries-and-rollback.json`, `source-checks.json`, presná neodoslaná požiadavka podpore |
| Safari | NOT TESTED | Prostredie Linux/Chromium, Safari/WebKit nie je dostupné | Browser verzia v `show-all-and-config.json`; žiadne tvrdenie Safari kompatibility |

## Funkčné nákupy — skutočný serverový košík

`purchases.json` obsahuje **12 oddelených kontextov**: štyri vzorky × natívny detail,
Luigi výsledky a Luigi AC/Top. Natívna referencia používa čistú v0.7.7, Luigi rc.4.
Pri každej operácii sa kontroluje SKU, skutočný košík, množstvo a jednotka/cena;
je jedna addCartItem operácia na jeden klik. Screenshoty `purchase-SKU-surface.png`
zobrazujú košík po operácii, nie len odpoveď200. Nenakupovalo sa do objednávky.

| Vzorka | Natívne ustálené pravidlo | Výsledný košík vo všetkých troch skúškach | Stav/limit |
|---|---|---|---|
| Kus306317 | min1/step1, ks, gross4,11€ / net3,34€ | 1ks,4,11€ | FIXED zachovanie default nákupu; netto v Luigi stále BLOCKED |
| Minimum/násobiteľ237597 | min100/step100 po ustálení multiply_order | 100ks ×0,09€ =9€ | FIXED zachovanie default; editácia100→200 v Luigi BLOCKED |
| Balenie344255 | min1/step1, jednotka balenie; názov8650ks | 1balenie,186,49€ | FIXED zachovanie významu balenia; nie8650 objednávkových jednotiek |
| Metráž491405 | min1/step1, decimals0, jednotka m | 1m,6,03€ | FIXED zachovanie default. Tento konkrétny produkt nepreukazuje predaj zlomkov metra |
| Variant494606 | Natívny variantový doplnok potrebuje friends.shopcode.cz | NOT TESTED | `net::ERR_TUNNEL_CONNECTION_FAILED`, native variantová voľba nebola kvalifikovaná. Nezamieňame predaj základnejSKU za test voľby variantu |
| Skutočne neobjednateľný | Chýba kvalifikovanéSKU/autoritatívny orderable fixture | NOT TESTED | Verejné UI dopyty nedostupné/vypredané nie sú dôkaz neobjednateľnéhoSKU; požadujeme ho od dodávateľa |
| Nezávislé minimum≠step | Žiadna kvalifikovaná vzorka | NOT TESTED | min=step100 ani balenie8650 nie sú tento prípad; samostatná požiadavka na fixture/mapping |

`recommendation-purchases.json` ďalej porovnáva konkrétnu viditeľnú odporúčaciu
kartu s jej natívnym detailom a výsledným serverovým košíkom pre product_detail,
basket a basket_popup. Každý odporúčací klik vytvoril jedinú košíkovú operáciu,
rovnaký produkt a predvolenú jednotku/množstvo/cenu. Nie je to test editácie
množstva ani všetkých variantových/neobjednateľných stavov odporúčacích kariet.

## Udalosti a podporovaný spôsob

Natívne `cart-modal.css` aplikovalo grid aj mobilný `margin-left:66px` na
všetky `.advanced-order .product`, teda aj na Luigi karty. Natívne odporúčacie
CSS zároveň skrývalo cart `::after`; pri mobilnej icon CTA vzniklo prázdne
tlačidlo. Toto je doložená príčina konfliktu v repozitári, nie pripísanie vendorovi.
Rc.3 v týchto natívnych pravidlách používa nulovo špecifický guard
`:not(:where(.lb-product))`, takže pôvodné natívne pravidlá majú rovnakú špecifickosť.
Natívny `recommendationCard`/`productPurchaseForms` v `src/core/selectors.js` tiež
vylučuje Luigi. Natívny enhancer preto nepreberá vendor kartu, nepridáva jej
fallback jednotku/qty ani neprepisuje label. Existujúci Luigi handler vlastní
nákupnú akciu; nové buy handlery, DOM observer alebo API sa nepridávajú.
`native-scope-evidence.json` dokladá presné selektory a nezmenené pôvodné CSS po
odstránení guardu. `popup-conflict-375-before/after.png` ukazuje túto opravu samostatne.

Read-only CDP zaznamenáva payload vrátane tiel, ktoré Playwright postData niekedy
nevidí. Ukladá sa iba typ/consent/resource a logická väzba udalostí, bez visitor IDs.
Vo všetkých12 nákupných skúškach je **ShoptetCartUpdated=1**. AC/Top má zachytený
resource a väzbu na Autocomplete impression. Search306317/237597 stále posiela buy
bez resource/attributions, Search344255/491405 ich má. V aktuálnych skúškach detail/basket/popup odporúčaní tiež chýbal resource. Starší
rc.2 test iného popup produktu293824 mal Recommendation väzbu; preto nevyvodzujeme
príčinu iba z umiestnenia alebo počtu výsledkov. Tento
konkrétny rozdiel je v požiadavke podpore. Reporting na strane Luigi je NOT TESTED.
CSS úspech ani HTTP200 neznamenajú úplnú analytickú akceptáciu.

Oficiálny verejne načítaný bootstrap podporuje konfigurované `templates` a
`initializeTemplates`; aktuálny SHA256 sa zhoduje s archivovaným. Presné identifikátory
sú v `template-contract-evidence.json` a `SUPPORT-REQUEST.md`. Podporovaný spôsob
editácie pre túto Shoptet inštaláciu nie je dostupný a dokumentácia na docs.luigisbox.com
má CONNECT403. Preto žiadame vlastnú podporovanú šablónu alebo jej úpravu dodávateľom;
nepokračujeme nahrádzaním nákupných pravidiel krehkým prepisovaním DOM.

## Stabilná verzia, zapnutie, vypnutie a rollback

Vydaná **v0.7.7 → f0bfec1128d82a5f48a749991a00ce11d33e4f04** je bod návratu.
Obsahuje iba schválené odstránenie nechceného homepage H1, nevydala Luigi úpravy.
PR68 ju už obsahuje cez merge5cc930c; nový kandidát H1 nevytvára. Aktuálny main má
navyše automatickú aktualizáciu Instagram dát03d3ea7; nejde o nový frontend release.

1. Preview zapnúť odkazom s `ts_preview=a4e7ebc` v samostatnom profile. Overiť
   `TimberLoader.preview=true` a `Timber.version=v0.7.8-rc.4`. Cookie platí7 dní
   iba v danom profile; zákazníci bez nej ostávajú na stabilnej verzii.
2. Vypnúť [ts_preview=off](https://www.timberstore.sk/?ts_preview=off), následne
   navigovať bez parametra. Overiť `preview=false`, `version=v0.7.7` a chýbajúcu
   preview cookie. Tento návrat bol vykonaný v `boundaries-and-rollback.json`.
3. Žiadna zmena produkčného loadera/tagu nie je na rollback preview potrebná.
   Nenahrádzať stabilnú verziu odmietnutým rc.0/rc.1 ani starou0.7.6, ktorá vracia H1.
4. Externé Luigi nastavenia sa rollbackom Git/preview nevrátia. Nič sme nemenili;
   samostatný register pôvodných verejných runtime hodnôt a požadovaný export
   presných admin hodnôt sú v `SUPPORT-REQUEST.md`. Pred budúcou externou zmenou
   treba uložiť pôvodnú konfiguráciu/šablóny/mapovanie a ID publikácie; obnovuje
   sa tento export, nie vymyslená predvolená hodnota.

Lint a build prešli: JS36,09KiB/36,25, CSS33,76KiB/33,875. Nový limit
platí iba pre tento preview podľa existujúceho oprávnenia; stabilné limity nezmenené.
Vizuálna a funkčná akceptácia celej integrácie tým nie je vyhlásená.


Pri predchádzajúcich automatických behoch sa raz nevytvoril popup widget v čase
kontroly a raz ešte nebol jeho ikonový štýl pripravený. Samostatný kontrolný beh
a opakovaný celý mobilný beh prešli. Skorú/stresovú inicializáciu preto neoznačujeme
za garantovane opravenú; v požiadavke podpore ostáva stabilný mount/ready kontrakt.
Samotný screenshot po ustálení nedokazuje všetky počiatočné sieťové stavy.
