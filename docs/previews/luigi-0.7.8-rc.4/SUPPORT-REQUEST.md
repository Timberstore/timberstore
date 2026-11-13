# Luigi podpora — pripravená požiadavka, NEODOSLANÉ / NEPUBLIKOVANÉ

TIMBER STORE, www.timberstore.sk, tracker842889-1266949. Aktuálny produkčný
loader je v0.7.7. Ten opravil iba nechcený H1; Luigi preview je samostatné
0.7.8-rc.4 (samostatný commit-preview; rc.0 majiteľ odmietol). Majiteľ neočakával nové homepage sekcie a nechce ich.

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

## Konkrétne zmeny šablón po odmietnutí rc.0

Prosíme realizovať v **izolovanom vendor preview**, nie publikovať na zákaznícky web.
Oficiálny verejne načítaný bootstrap (`../homepage-investigation/luigi-bootstrap-observed.js`)
používa `initializeTemplates` a konfigurované šablóny. Existencia mechanizmu je
doložená; podporovaný spôsob editácie pre našu Shoptet inštaláciu nie je k dispozícii.
Žiadame potvrdiť podporu vlastnej šablóny alebo vykonať tieto úpravy dodávateľom:

- AC: `template-quick-search-default`, Top: `template-top-items`.
- Search: `template-result-default`, `template-results`, `template-search`.
- Odporúčania: `template-recommend-product_detail`, `template-recommend-basket`,
  `template-recommend-basket_popup`.
- Home: selektívne deaktivovať iba `homepage_personalized` a `homepage_last_seen`.
  Nezmeniť ostatné placementy, Search/AC ani pôvodné kategórie.

| Požiadavka | Skutočne pozorované dáta / chýbajúci kontrakt | Konkrétna požadovaná oprava |
|---|---|---|
| Dve ceny a jednotka | `price_eur_amount`, `unit` existujú. Autoritatívna netto cena a jej režim nie sú v zachytených hitoch | Dodať netto pole zo Shoptetu, režim zobrazenia DPH a cenu/jednotku; vykresliť gross nad netto rovnako ako native. Žiadne univerzálne prepočítanie DPH |
| Počet skladu | `availability_stock_quantity`, `availability_dolny_hricov`, `availability_timber_sklad`, `availability_in_stock`, `availability_rank_text` existujú | Potvrdiť význam a aktualizáciu každého skladu, jednotku a natívne pravidlo limitovaného zobrazenia napr. >100; vykresliť počet podľa rovnakej logiky, nie automaticky surovú sumu |
| Množstvá | `minimum_amount` existuje; nezávislý krok, pack multiplier, maximum a normalizačný kontrakt nie sú doložené | Dodať presné polia min/step/pack/max + podporovaný binding existujúceho add-to-cart s variantom/priceId. Funkčné ovládanie množstva podľa natívnej normalizácie, jedna operácia a pôvodná analytika |
| Oranžový Komplet | `flags_codes[].code=komplet` je dostupné. Generované HTML ho stráca a necháva iba generic `.flag` s pôvodnou hnedou farbou | Zachovať sémantický `.flag-komplet` podľa natívnej karty alebo podporovaný flag-code atribút. Nezmeniť iné štítky cez odhad farby alebo textový DOM prepis |
| Tabuľka / popisy | Natívny switch ukladá voľbu, vendor Search ho nevykresľuje a descriptions nemajú garantovaný table slot | Podporovaný grid/list prepínač, hlavičky/radenie a správny slot description v row template; zachovať celé názvy. Preview nepridáva nefunkčný prepínač ani neoznačuje pretiahnutú dlaždicu za funkčnú tabuľku |
| Zákaznícke filtre | Presné polia whitelistu a všetky podmienky ich zobrazenia nie sú exportované | Poslať export facetov; zákaznícke názvy, bez interného `creation_time`, funkčné kombinácie/reset cez vendor handler |

Prijať až po porovnaní toho istého SKU s natívnou kartou na desktope a mobile,
vrátane kusov, balenia, metráže, variantu a naozaj neobjednateľného výrobku.
Prosíme dodať kvalifikovaný variantový a neobjednateľný testovací SKU a výstup
zo serverového košíka pre každý placement. Samotné HTTP200 nestačí.

### Register externého stavu — žiadna zmena nebola vykonaná

| Nastavenie | Doložená pôvodná runtime hodnota | Cieľ | Pôvodná admin hodnota / rollback |
|---|---|---|---|
| homepage_personalized | Type user_conversion_based, Size8, po `.benefitBanner.position--benefitHomepage` | Vypnutá iba táto inštancia | BLOCKED: vyžadujeme export skutočného admin poľa pred zmenou |
| homepage_last_seen | Type last_seen, Size8, render pri >2 items | Vypnutá iba táto inštancia | BLOCKED: export konfigurácie a jej verzie |
| AC/Search/3 odporúčacie šablóny | Pozorovaný bootstrap vyššie; chýbajúce údaje v aktuálnom renderi | Šablóny s natívnymi nákupnými pravidlami | Export plných pôvodných šablón + ID publikácie pred úpravou |
| Feed a facets | Pozorované verejné polia vyššie | Potvrdené mapovanie, whitelist | Export pôvodného mapovania, žiadne domyslené admin hodnoty |

Repo rollback tieto externé nastavenia nevráti. Obnova musí použiť presný pôvodný
vendor export/verziu; bez jeho dodania a schválenia sa nesmie publikovať.

### Reprodukcia filtrov a počtu výsledkov (desktop)

`BLUM 450`: kliknutie na text Skladom skutočne zaškrtne input a URL dostane
`lb.f[]=flags:Skladom`; 14 produktov je Skladom. Kombinácia BLUM pridá
`lb.f[]=brand:BLUM`, reset cez „Zrušiť všetky filtre“ obnoví nevyfiltrovaný stav.
Nefunkčnosť tohto konkrétneho handlera sa na rc.0 nereprodukovala.
Konkrétny nesúlad počtu je však reprodukovateľný: hlavička uvádza 21 výsledkov,
zatiaľ čo produktov je 14 (ďalej 6 kategórií + 1 značka). Pred filtrom 526
znamená 521 produktov + 4 kategórie + 1 značka. Žiadame oddelený produktový počet
v hlavičke a filtroch alebo jednoznačné zákaznícke označenie zmiešaného počtu
v podporovanej Search šablóne. Neprepisovať vypočítaný počet cez DOM/CSS.

### Mobilné odporúčania a stabilita štruktúry

Aktuálny oficiálny bootstrap sa zhoduje s archivovaným (SHA256 v
`template-contract-evidence.json`), obsahuje `_carouselItemsSix=2` pre mobilný
breakpoint. Pri375px má detailová karta šírku137,5px. Potvrďte podporované
nastavenie počtu kariet podľa schválenej natívnej referencie; neupravujeme šírky
slidov CSS, lebo ich používa carousel na výpočet dráhy/šípok. Repo preview zatiaľ
zabraňuje prekrývaniu úzkym mobilným ponukovým blokom a zachováva pôvodnú akciu.

Pozorovali sme dva DOM stavy dostupnosti/tlačidla pri načítaní odporúčaní.
Apollo `partsRepositionProducts()` používa globálny selektor `.products-block .product`
a premiestňuje `.p-tools`/`.product-btn`; ten zodpovedá aj Luigi kartám.
Bootstrap má vlastné OnDone callbacky a `inStock()` volania. Samotný zdroj nie je
call stack dokazujúci pôvod každej mutácie: žiadame konkrétnu kompatibilnú šablónu
s jedným inicializačným cyklom a zachovaním pôvodných nákupných/analytických udalostí.
Nezavádzame ďalší opravný DOM observer alebo duplicitný cart handler.


### Opravený konflikt s našimi natívnymi pravidlami (rc.4)

V repozitári boli natívne popup pravidlá a enhancer príliš široké: zasahovali aj
`.lb-product`. V rc.4 sú z nich Luigi karty vylúčené. Dodávateľská šablóna musí
naďalej vlastniť svoje dáta a buy handler; natívny fallback sa nepoužíva ako náhrada
podporovaného data bindingu. Toto odstránilo konkrétny 66px odsadený názov/kód a
skrytú ikonu. Nezamieňať túto opravu za dodanie netto/skladových počtov/qty kontraktu.


### Potvrdené pôvodné runtime voľby (read-only, bez zmeny)

- `hasDescription=false`.
- `hasUnit=true`.
- `hasCode=true`.
- `hasActionButton=versionB`.
- `carouselItemsSix=2`.

Aktuálne meranie všetkých troch odporúčacích plôch pri SKU306383/481640
zachytilo buy bez resource_identifier/attributions. Starší rc.2 popup test
SKU293824 mal Recommendation väzbu. Prosíme porovnať tieto konkrétne produkty,
nie iba globálny transport. Verejné runtime voľby nie sú exportom admin polí.


AC/Top požaduje tiež natívne formátovanie peňažnej hodnoty podľa konkrétnej
cenovej položky (napr.125,90€, nie125,9€), rovnaký režim DPH a jednotku.
Použiť podporovaný formatter/šablónu; nemeniť amount ani odvodzovať netto
univerzálnou sadzbou.
