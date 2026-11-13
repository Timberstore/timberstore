# Luigi podpora — pripravená požiadavka, NEODOSLANÉ / NEPUBLIKOVANÉ

TIMBER STORE, www.timberstore.sk, tracker842889-1266949. Aktuálny produkčný
loader je v0.7.7. Ten opravil iba nechcený H1; Luigi preview je samostatné
0.7.8-rc.0 (commit3cef596). Majiteľ neočakával nové homepage sekcie a nechce ich.

Pred externým zásahom požadujeme export pôvodnej konfigurácie, jej verziu,
čas/autora publikácie a diff presných admin polí. Verejné runtime hodnoty nižšie
nie sú náhradou exportu admin hodnôt. Nič zákaznícke nepublikovať bez schválenia.

## Presný zoznam žiadaných zmien a otvorených kontraktov

| Umiestnenie | Pozorovaný pôvodný stav | Požadovaná zmena / odpoveď | Overenie |
|---|---|---|---|
| homepage_personalized | user_conversion_based, Size8, „Vybrali sme pre Vás“, vloženie po benefitBanner | Podporované selektívne vypnutie iba tejto homepage inštancie v izolovanom vendor preview | Bez widgetu, 12 pôvodných kategórií, pôvodné poradie, Search/AC aktívne |
| homepage_last_seen | last_seen, Size8, „Naposledy ste si prezerali“, obsah pri >2 items | Rovnaké selektívne vypnutie, nie DOM/CSS skrývanie | Aj existujúca história a čisté cookies, bez prázdneho slotu |
| Search / AC / Top | Default buy na SKU237597 pridáva správne100ks; chýba podporovaný editovateľný qty kontrakt | Potvrdiť verejný hook a mapovanie minimum/krok/maximum/balenie/variant. Neodvodzovať step len z minimum_amount | Natívny settled detail237597 má value/min/step100; typed101 →200; serverový cart200ks×0,09=18€. Rovnaké pravidlo musí mať widget |
| Všetky nákupné umiestnenia | SKU344255 unit=balenie, min1; názov obsahuje8650ks | Potvrdiť nezávislé mapovanie jednotky balenie a obsahu balenia | 1 balenie186,49€, nie8650 objednávkových jednotiek; native/Search/AC porovnanie doložené |
| AC/Top + recommender templates | Jednotky/sku/net chýbajú alebo nie sú vo všetkých widgetoch prítomné; net nevypočítavame | Verejné polia a podporovaná template pre gross/net/VAT label/unit/SKU/manufacturer code/stock counts, s source timestamp ak feed môže meškať | Zhodné ceny a význam jednotky s natívnym detailom/košíkom, žiadna univerzálna odvodená DPH sadzba |
| product_detail | item_detail_alternatives, Size8, extra pás za #content-wrapper, vedľa natívnych súvisiacich/podobných | Potvrdiť žiadaný placement a podporované zjednotenie bez duplicity s pôvodnými pásmi | Pôvodné natívne pásy zachované, prípadná zmena navyše samostatne schválená |
| basket / basket_popup | basket, Size8, append do #cart-wrapper / .advanced-order | Podporovaná šablóna jednotiek/DPH/sku/qty a natívneho cart glyphu; nepridávať druhé handlery | SprávnySKU/priceId, amount, unit a total, jedna operácia na klik |
| Search analytics | CDP zachytil buy; bežné Playwright postData() nemalo telo jednej požiadavky | Diagnostikovať konkrétny chýbajúci resource_identifier/attributions, nie iba HTTP200 | Validné resource + list/impression väzba v každom buy; potvrdenie vo vendor reporte oddelene |
| Consent | Bez čakania po UI accept môže byť payload ešte consent=false | Potvrdiť oficiálne consent napojenie, timing a správne anonymné správanie | Po ustálení accept/reject overiť payload consent a vendor reporting |
| Variant/nedostupný | Natívny variantový doplnok mimo dostupného kontraktu; neobjednateľné SKU zatiaľ nepotvrdené | Dodať testovacie SKU, authoritative variant/priceId/orderable dáta a podporované CTA | Žiadny neurčený variant/inýprodukt ani buy pre neobjednateľný |
| Filtre/články/paging | Časť polí sa dá overiť v UI, globálny whitelist nemáme | Presný whitelist zákazníckych facetov a typov výsledkov; vylúčiť creation_time a „Stránka nenájdená“ na dátovej/konfiguračnej úrovni | Rozličné dopyty, paging, prázdny stav a jazykové verzie |

Dokumentácia stable roots/OnDone/templates a všetkých verejných API je požadovaná
pred funkčnou implementáciou. Pozorovaný DOM nie je záruka verejného API.
Konfigurácia prostredia nepovoľuje docs.luigisbox.com; posledný prístup bol
CONNECT403. Prosíme o dostupný export dokumentácie alebo schválený dostupný zdroj.

Nákupné alternatívy typu „prejsť na detail namiesto buy“ sú iba návrh na výslovné
schválenie. Nepublikovať ich ako tichú náhradu požadovaného množstevného ovládania.

## Rollback externých zmien

Odovzdať pôvodné a navrhnuté hodnoty skutočných admin polí + identifikátor exportu
pred zmenou. Návrat na tento export/verziu musí byť otestovaný v vendor preview.
Repo rollback/ts_preview=off tieto nastavenia nevráti. Aktuálne neboli žiadne
externé hodnoty zmenené ani publikované; nepoužili sa nezdokumentované runtime API.


### Nové presné analytické reprodukcie

Dopyt237597: jediný vrátený produkt, default buy správne pridá100ks, ale zachytený
click.action má iba type=buy bez resource_identifier/attributions. Rovnaký jav
na baseline v0.7.7 aj preview. Po skutočnom UI accept a3s ustálení je consent=true,
no atribučné polia stále chýbajú. DopytBLUM71B3550 (2výsledky): resource URL prvého
produktu a Search Results/event väzba prítomné. Prosíme preveriť rozdiel extrakcie
konverzie a jej attribution v podporovanej Shoptet integrácii; počet výsledkov
je rozdiel reprodukcie, zatiaľ nie dokázaná príčina. Screenshoty/dôkazy neobsahujú
visitor/client GUID. Prijatie200 neoznačujeme za potvrdený vendor reporting.
