> Aktuálne pokračovanie z 2. 11. 2026: [LIVE-REVIEW.md](LIVE-REVIEW.md).
> Sieťové blokácie nižšie sú historické; reálne Luigi odpovede sú v `live/search-responses.json`.

# TIMBER STORE · audit Luigi’s Box a návrh redizajnu

Dátum: 2. 11. 2026. Pracovná vetva: `feature/lb1-search-audit-preview`. Základ repozitára: `dd709bb`, verzia 0.7.6. Stav: dokončený audit dostupných zdrojov a samostatný dizajnový model; **audit funkčnej integrácie Luigi’s Box ostáva blokovaný sieťou**. Žiadne produkčné nasadenie ani zmena administrácie.

## 1. Čo bolo skutočne overené

- Verejné HTML homepage a stránky `https://www.timberstore.sk/vyhladavanie/?string=BLUM%20450`.
- Renderovanie Chromium pri 1440 × 1000 a 375 × 812, computed CSS premenné a reprezentatívne prvky existujúcich produktových kariet.
- Lokálny repozitár `Timberstore/timberstore`, pravidlá CONTRIBUTING.md a CLAUDE.md, tokeny, produktové štýly, detekcia stránok a prepínač zobrazenia.
- Všetkých 15 požadovaných výrazov cez zákaznícku URL vyhľadávania, prvých najviac 10 produktov. **Je to porovnávací základ Shoptetu; nejde o výsledky Luigi’s Box.** Kompletné zachytené názvy/kódy sú vo fallback-results.json a hodnotenie v RELEVANCE.md.
- Kontrast presných sRGB hodnôt podľa WCAG, nie odhad z obrázkov.

Prekážka: skript `https://scripts.luigisbox.tech/LBX-1266949.js` končí v testovacom prehliadači `net::ERR_TUNNEL_CONNECTION_FAILED`. Doména chýba v povolených hostoch prostredia. Toto je obmedzenie testovacieho prostredia, nie dôkaz chyby zákazníckeho webu. Neobchádzal som blokovanie ani nevolal interné API.

Nie sú overené: reálne DOM/triedy ani runtime verzia Luigi widgetu, našeptávanie pred písaním/počas písania, jeho mobilné správanie, Top produkt, košíkové a analytické udalosti Luigi, ním poskytované filtre a radenie, obsah indexu, mapovanie feedu, Luigi administrácia, reálny iPhone/Safari, PageSpeed ani meranie produkčných Core Web Vitals. Štruktúra troch stĺpcov a problém creation_time sú hlásenia zo zadania; neboli nezávisle reprodukované.

## 2. Technológia a hranice integrácie

**Potvrdené:** Shoptet + Apollo; asynchrónne načítaný Luigi script s identifikátorom LBX-1266949. Ide o vloženú klientsku JS integráciu. Z loadera nemožno bezpečne určiť konkrétny produktový balík, verziu komponentov, A/B režim, konfiguráciu zobrazenia ani to, či výsledky preberá Luigi pre všetkých návštevníkov. Označiť integráciu napr. za konkrétny framework by bolo nepodložené.

Živý TimberLoader má PROD `v0.7.6` a načítava verzované `dist/timber.min.css/js` z jsDelivr. Navyše sa načítava Apollo CSS/JS a `/user/documents/allstyle.css?v=1111`, `/user/documents/allscript.js?v=111`. Existencia týchto súborov sama nepreukazuje konflikt ani duplicitu; ich obsah a pôvod treba porovnať s legacy inventárom pri pokračovaní auditu.

V `src` nie je vlastná implementácia Luigi ani jeho tematický adaptér. Zachytené vyhľadávanie pri blokovanom Luigi vykresľuje natívne Shoptet karty `#products > .product` a vlastný prepínač mriežka/tabuľka.

### Miesta možného konfliktu, nie potvrdené incidenty Luigi

1. `src/styles/overrides/product-card.css`: globálne `.price-final` a `body :is(.btn-primary,.btn-conversion,.btn-cart)` môžu zasiahnuť aj vložený widget, ak používa tie isté triedy. Bez DOM Luigi nemožno potvrdiť ani vylúčiť zásah.
2. Farebné availability selektory rozpoznávajú inline zápisy `#C97A2B` a `#2e7d32`; nový renderer, iný zápis farby či iná štruktúra ich obíde. Dostupnosť sa nesmie klasifikovať podľa farby ani hádania z textu pri novej integrácii; použiť dátový stav podporovaný dodávateľom.
3. `src/modules/list-view/index.js` pracuje s natívnym radením a DOM Shoptetu. Pri Luigi výsledkoch s iným DOM nesmie vzniknúť druhý prepínač alebo nefunkčné radenie.
4. Dlhé názvy majú v existujúcich prepisových štýloch pravidlá pre zalamovanie a vodorovný overflow; nemožno ich automaticky preniesť na Luigi. Pri modeli názvy ostávajú celé, bez line-clamp.
5. HTML loader spúšťa 1500 ms timeout triedy timber-page-loading. Je to indikátor možného dočasného skrytia/fallbacku, nie meranie prebliknutia. Treba sledovať cold load s funkčným Luigi a spomalenou sieťou.
6. Komentár „AA white labels on deeper copper“ v produktovom CSS už nezodpovedá súčasným tokenom. CTA je reálne #D4884A, preto komentár nie je dôkaz AA.

## 3. Zoznam problémov podľa závažnosti

| Priorita | Zistenie | Dôkaz / istota | Odporúčanie |
|---|---|---|---|
| P1 | Biely malý text na primárnej oranžovej nespĺňa AA | Computed CTA: biela/#D4884A, 14 px; kontrast 2,83 : 1 | Porovnať schválenú paletu s odvodeným tmavším CTA variantom |
| P1 | Emerald text na bielej nespĺňa AA | Token #00C853, kontrast 2,24 : 1 | Zachovať Emerald indikátor a tmavý text; prípadne schváliť tmavšiu textovú zelenú |
| P1 | Interný creation_time ako zákaznícky filter | Hlásené používateľom, nereprodukované | Auditovať mapovanie a povolené filtre v indexe/config; neprekrývať problém iba CSS |
| P1 | Technicky nesprávne výsledky môžu viesť k nesprávnemu nákupu | Potvrdené v Shoptet baseline, Luigi neoverený | Posilniť presné kódy, parametre a kategóriu; samostatne otestovať Luigi |
| P2 | Dominantný Top produkt môže znižovať počet viditeľných zhôd | Hlásený layout, bez live snímky Luigi | Porovnať tri varianty nižšie, neodstrániť automaticky |
| P2 | Možné pretekanie globálnych štýlov a dvojité ovládanie | Statická analýza zdrojov | Izolovať vzhľad cez potvrdený koreň komponentu a podporované hooks |
| P2 | Dlhé technické názvy vyžadujú priestor | Zachytené názvy obsahujú dĺžku, nosnosť, montáž, farbu | Zachovať úplný názov a oddeliť SKU; nepoužívať skryté podstatné parametre |
| P2 | Centrálna dostupnosť ako malý oranžový text má slabý kontrast | #C97A2B/biela 3,33 : 1; firemná oranžová ešte menej | Oranžový indikátor a tmavý popis ako návrh na schválenie |
| P3 | RAL 9002 nie je jednoznačná webová hodnota | V tokenoch sa používajú iné explicitné plochy | Použiť skutočné tokeny; nevymýšľať „presný RAL hex“ |

P1 = opraviť/rozhodnúť pred produkčným prijatím redizajnu; P2 = dôležité pre použiteľnosť a stabilitu; P3 = konzistencia. Sieťová prekážka je stav auditu, nie produkčná závažnosť.

## 4. Presná overená paleta a kontrast

Zdroj: `src/styles/tokens.css` + computed premenné živého webu, zachytené v computed.json.

| Účel | Token / hodnota | Použitie v návrhu |
|---|---|---|
| Firemná oranžová | --ts-color-accent, --ts-color-action: #D4884A | Akcenty a pôvodný variant CTA |
| Pôvodná oranžová | --ts-color-controls-active: #C97A2B | Pôvodné ovládanie; centrálna dostupnosť je takto nastavená inline |
| Hover oranžovej | --ts-color-action-hover: #B8692E | Pôvodný variant hover |
| Hlavná tmavá | --ts-color-controls-text: #423E3E | Nadpisy ovládania a neutrálne stavové texty |
| Bežný text | --ts-color-text: #0F0F0F | Názvy produktov |
| Emerald Green | --ts-color-success-primary: #00C853 | Skladový indikátor; pôvodný variant zeleného textu |
| Kráľovská/technická modrá | --ts-color-blue: #2454A6 | Zachovať hodnotu pre kódy; ceny podľa existujúcich kariet |
| Sekundárny text | --ts-color-muted, --ts-color-price-secondary: #666878 | Nedostupné, DPH a pomocné údaje |
| Biela | --ts-color-bg: #FFFFFF | Povrch a text tlačidla |
| Jemná aktuálna plocha | --ts-color-service-bg: #F5F0E9 | Pozadie kategórií/značiek |
| Zvýraznenie/hover plocha | --ts-color-controls-active-bg: #FFF8F1 | Jemné zvýraznenie s tmavým textom |
| Orámovanie | --ts-color-controls-border: #E5E0DA | Oddeľovače |
| Technická plocha | --ts-color-technical-bg: #F3F5F7 | Doplnkové sekcie |
| Neutrálna cena | --ts-color-price: #252B32 | Token existuje; vlastné pravidlá navyše farbia hlavnú sumu modro |

Zachytený natívny SKU má celý wrapper #4A525E, vnútorná hodnota je modrá. Návrh zachováva modrú, nezamieňa ju s dostupnosťou. Jemné pozadie požadované ako RAL 9002 nemožno prehlásiť za presný hex; použité webové tokeny sú vyššie.

| Kombinácia | Kontrast | AA bežný text ≥ 4,5 | AA veľký text ≥ 3 |
|---|---:|---|---|
| biela / #D4884A | 2,83 : 1 | Nie | Nie |
| biela / #C97A2B | 3,33 : 1 | Nie | Áno |
| biela / #B8692E | 4,12 : 1 | Nie | Áno |
| #423E3E / #D4884A | 3,73 : 1 | Nie | Áno |
| #00C853 / biela | 2,24 : 1 | Nie | Nie |
| #2454A6 / biela | 7,26 : 1 | Áno | Áno |
| #423E3E / biela | 10,55 : 1 | Áno | Áno |

Samotné zväčšenie bieleho textu na #D4884A problém nevyrieši. Ani automatická výmena bielej za #423E3E nie je AA pre malý text.

**Odporúčaný variant na schválenie:** ponechať firemnú oranžovú pre identitu a použiť pre biele textové CTA odtieň odvodený z existujúcej hover oranžovej: `color-mix(in srgb, #B8692E 90%, black)` ≈ #A65E29, hover 80 % ≈ #935425. Nie je to existujúci firemný token; ide o výslovne označený návrh. Model umožňuje prepínať pôvodný a AA variant. Presný kontrast vypočítaného výsledku je uložený v QA.json. Globálne tokeny webu sa nemenia.

Pri skladových stavoch je odporúčaný Emerald/oranžový indikátor s tmavým textom. To je odchýlka od požiadavky na farebný text a vyžaduje rozhodnutie majiteľa; pôvodný farebný text ostáva dostupný na porovnanie. Alternatívou je schválený tmavší textový odtieň zelenej/oranžovej. Nedostupné: #666878 s explicitným textom. Význam nikdy nesmie závisieť len od farby.

Toto je finálny súpis overených farieb, nie tvrdenie, že kontrastný variant už bol schválený.

## 5. Návrh našepkávača

### Desktop

Odporúčaný dvojzónový panel: približne 240 px pre kategórie/značky a zvyšok pre produkty. V modeli pri 1200 px kontajneri produkty získavajú väčšinu šírky. Kategórie a značky majú 18 px nadpisy, 15 px semibold odkazy, jednotné jemné oranžové hover pozadie a podčiarknutie. Každý odkaz aj tlačidlo má aspoň 44 px cieľ. Focus je viditeľný modrým obrysom.

Produktový riadok: obrázok s rezervovanou plochou a object-fit contain v budúcej integrácii; samostatný kód; celý technický názov; explicitná dostupnosť; cena s jednotkou/DPH; konzistentné košíkové tlačidlo. Názvy sa prirodzene zalamujú bez line-clamp. Obrázky v modeli nahrádza označená plocha 450 mm, nejde o fotografie ani overené finálne obrázkové zarovnanie Luigi.

Porovnanie Top produktu:

| Variant | Výhoda | Nevýhoda / podmienka |
|---|---|---|
| Súčasné tri stĺpce podľa zadania | Výrazný odporúčaný produkt | Menej šírky pre dlhé názvy a ďalšie zhody; live neoverené |
| Kompaktný Top ako prvý produktový riadok — odporúčanie | Zachová funkciu a uvoľní priestor | Vyžaduje podporované nastavenie alebo zásah dodávateľa |
| Bez Top produktu | Maximum organických zhôd | Môže znížiť prínos odporúčaní; iba porovnávací variant |

Model má prepínač kompaktného Top. Neimplementuje reálnu deduplikáciu ani analytiku. Vo funkčnej integrácii sa nesmie ten istý produkt zdvojiť medzi Top a ostatnými bez jasného dôvodu.

Prázdny vstup: navrhnúť obmedzené populárne dopyty/kategórie alebo históriu, ak ju podporuje dodávateľ a zodpovedá správe súkromia. Nezobrazovať zdanlivo personalizované dáta bez podkladu. Počas písania prioritne presné kódy a produkty, sekundárne kategórie/značky; články iba pri relevantnej zhode. Bez výsledkov uviesť zachovaný dopyt, možnosť opravy a kontakt; neprerobiť technické čísla automaticky.

### Mobil

Jeden tok: vstup, krátke kategórie/značky, produkty, všetky výsledky. Top nemá vlastný stĺpec. Pri skutočnom overlay riešení treba overiť klávesnicu, zmenu visual viewport, uzatvorenie Escape/späť, návrat fokusu a scroll stránky. Model ukazuje iba responzívny obsah, nie funkčný overlay. Technické hodnoty neskrývať do hover tooltipu. Kontrola pri 375 px a 768 px bez horizontálneho overflow; skutočný iOS zostáva netestovaný.

Rádiusy: aktuálny web nemá jeden univerzálny radius — 4 px všeobecný token, 12 px controls, 5 px SKU, približne 25 px computed košíkové tlačidlo. Model volí 12 px panel a zachováva 25 px CTA; netreba plošne zaobliť všetko rovnakou hodnotou. Rozstupy vychádzajú z 4/8/16 px.

## 6. Stránka výsledkov

Zachytený Shoptet fallback má tri karty v riadku na desktope a vlastný prepínač mriežka/tabuľka, modré SKU a hlavné sumy, oranžové CTA. Cena, jednotka, suma bez DPH a dostupnosť musia zostať samostatnými dátami. V Luigi karte sa nesmie preberať formát ceny parsovaním viditeľného HTML.

Navrhnúť čitateľné názvy bez straty systému, dĺžky, nosnosti, farby, strany a montáže. Rovnako vysoké obrázkové plochy; nákupný blok dole pri kartách, vpravo pri desktopových riadkoch. Pri veľkých rozdieloch dĺžok názvu overiť reálne produkty, nie nútené skrytie názvu. Existujúce ceny sú aj modré; nové čierne ceny nemožno vyhlásiť za jedinú natívnu normu.

Radenie: predvolene relevantnosť; cenu a dostupnosť len podľa podporovaných indexovaných dát. Pri zmene filtra/radenia zachovať stav, aktualizovať počet, ovládateľnosť klávesnicou a históriu URL. Nemiešať Shoptet sort s Luigi sort. Mobilné filtre majú samostatný spúšťač, počet aktívnych filtrov a možnosť vymazať; konkrétny renderer nie je overený.

Výkon: merať cold/warm navigáciu s funkčným Luigi, priame otvorenie URL aj Enter z našepkávača, pomalú sieť a rýchle písanie. Zaznamenať LCP/CLS/INP a počet iniciácií widgetu. Súčasné snímky s blokovaným Luigi nie sú použiteľné ako dôkaz výkonu Luigi ani prebliknutia. Pripravený model nemá produkčný JS listener, observer ani sieťové API volania.

## 7. Parametrické filtre

Príčinu creation_time nemožno určiť bez indexu a konfigurácie. Možnosti: automatický výber zo všetkých indexovaných atribútov, nesprávne mapovanie feedu alebo ručne povolený technický atribút. Interné pole môže byť potrebné pre radenie/čerstvosť, preto ho bez overenia nemažte z indexu; najprv vylúčte zo zákazníckych filtrov podporovanou konfiguráciou.

Odporúčaný postup v administrácii alebo cez podporu (názvy obrazoviek/položiek zatiaľ neoverené):

1. Uložiť súčasný stav konfigurácie a ukážku indexovaného produktu pre každú kategóriu.
2. Nájsť mapovanie creation_time a zdroj. Nastaviť jeho zákaznícku filtrovateľnosť na vypnuté; nezasahovať do analytiky ani dátumu bez kontroly jeho využitia.
3. Získať úplný zoznam atribútov s typom, pokrytím a príkladmi hodnôt. Porovnať minimálne 5 produktov/kategória medzi Shoptet detailom, zdrojovým feedom a Luigi indexom.
4. Zaviesť explicitný zoznam povolených filtrov. Skryť creation_time a ďalšie interné polia po inventarizácii, nie slepým mazaním všetkých polí s technickým názvom.
5. Preveriť, či účet podporuje podmienené/dynamické filtre podľa kategórie. Ak áno, nastaviť kategóriové pravidlá. Ak nie, odovzdať podpore tabuľku nižšie a žiadať podporovaný variant; nesimulovať pravidlá skrytím DOM.
6. Overiť viac kategórií v jednom dopyte, chýbajúce hodnoty, nulu výsledkov, reset, mobil a zdieľanú URL. Uložiť návrh bez publikovania.

| Sortiment | Povolené kandidáty na filtre | Typ / kontrola |
|---|---|---|
| Úchytky | Rozteč, dĺžka, farba, materiál | Oddeliť rozteč od celkovej dĺžky; mm |
| Pánty | Typ naloženia, uhol otvorenia, tlmenie | Naložený/polonaložený/vložený ako odlišné hodnoty; °; tlmenie áno/nie |
| Výsuvy | Menovitá dĺžka, nosnosť, systém, farba | mm, kg, kontrolovaný systém; príslušenstvo oddeliť |
| LED | Napätie, výkon, IP krytie, farba svetla | V; W vs W/m nesmie splynúť; IP ako trieda; K a názov odtieňa |
| Skrutky | Priemer, dĺžka, typ hlavy, drážka | mm; M4 oddeliť od priemeru vrutu 4 mm; PZ/PH/TX oddelene |
| Drezy | Materiál, farba, min. šírka skrinky, montáž | mm; rozmer drezu nie je šírka skrinky; horná/spodná/rovina |

Tieto atribúty sú návrh požadovanej schémy; **žiadny sa tu netvrdí ako potvrdene indexovaný**. Dynamické filtre podľa kategórie ostávajú funkciou na overenie s dodávateľom. Z názvu produktu sa nemajú dopĺňať parametre regexom bez kontroly.

## 8. Relevancia a synonymá

Samostatný RELEVANCE.md obsahuje hodnotenie všetkých zachytených výsledkov. Luigi skóre/NDCG/precision nie je možné vykázať: jeho engine nebol dostupný a chýba schválený referenčný zoznam relevantných produktov.

Kandidáti na schválenie: pánt ↔ záves iba v kategórii pántov; šuflíkové pojazdy → zásuvkové výsuvy/pojazdy s overením, či zákazník hľadá mechanizmus alebo celý zásuvkový systém; pás ↔ pásik iba pri LED; onyx/čierna len pre konkrétne mapované farby výrobcu. TOB → TIP-ON BLUMOTION len tam, kde výrobca/skutočný produkt potvrdzuje túto funkciu.

Nezavádzať všeobecné synonymá TIP-ON = BLUMOTION, naložený = polonaložený, IP20 = IP65, 12V = 24V, M4 = ľubovoľná skrutka 4 mm, PZ = PH. Presné výrobné aj interné kódy majú prednosť; normalizácia medzier, pomlčiek, ×/x a desatinnej čiarky nesmie zmeniť technický význam.

Pri dopytoch s viacerými technickými požiadavkami exact zhody nad čiastočné; značku, produktový typ a kritické parametre zohľadniť samostatne. Nezvýhodňovať sklad alebo maržu nad technicky správnu zhodu. Návrhy neboli publikované.

## 9. Kto má čo upraviť

| Úprava | Prvý krok | Následný krok, ak nie je dostupný |
|---|---|---|
| Farby a základný vzhľad | Overiť oficiálne tematické nastavenia Luigi | Podporované CSS premenné/tematický hook, až potom izolované CSS v repozitári |
| Rozloženie Top a sekcií | Overiť layout v Luigi konfigurácii | Podpora Luigi; nepresúvať uzly cez observer |
| creation_time / filtre | Index a konfigurácia filtrov Luigi | Podpora s exportom schémy; úprava feedu iba po overení mapovania |
| Parametre produktov | Porovnať Shoptet → feed → Luigi | Opraviť zdroj alebo mapovanie a riadený reindex |
| Synonymá a relevancia | Schválené pravidlá v Luigi | Podpora pre kategóriové obmedzenie alebo presné kódy |
| Názvy, rozstupy, hover/focus | Podporované témy/hooks | Repo CSS pod potvrdeným koreňom |
| Košík a analytika | Oficiálny integračný mechanizmus | Podpora; nevytvárať paralelný košíkový handler |
| Native Shoptet fallback | Existujúci repozitár | Samostatne otestovať pri výpadku Luigi |

Bez prístupu do Luigi administrácie a potvrdenia, ktorá z dokumentovaných implementácií je na webe aktívna nemožno poctivo uviesť presné názvy položiek menu alebo CSS API. Uvedené hodnoty a pravidlá sú odovzdávacia špecifikácia; nie vymyslený klikací návod. Ďalší krok podpory: potvrdiť podporované theme hooks, šablónu, dostupné layouty, per-category facets a vylúčenie technických atribútov. Správa podpore nebola odoslaná.

## 10. Implementačný postup a akceptácia

1. Povoliť scripts.luigisbox.tech cez konfiguráciu prostredia; následne iba potrebné pozorované závislosti. Zopakovať audit s viditeľným Luigi bez obchádzania sieťových pravidiel.
2. Získať read-only konfiguráciu/index schému a oficiálne možnosti prispôsobenia. Overiť, či trial/experiment zobrazuje rovnaký variant na desktope aj mobile.
3. Zachytiť skutočné „pred“: prázdny vstup, písanie, výsledky, filtre, hover/focus, dlhé názvy, nula zhôd pri 375/768/1440 px. Zaznamenať reálny renderer.
4. Rozhodnúť konflikt AA a firemnej farebnosti na modeli. Vlastník vyberie CTA a stavové riešenie, nie automatickú zmenu identity.
5. Uložiť návrh nastavení Luigi ako draft alebo špecifikáciu bez publikovania; v repozitári použiť iba podporované, overené selektory. Preview sa aktivuje explicitne a nesmie meniť produkčný bundle zákazníkov.
6. Otestovať všetkých 15 výrazov v Luigi a porovnať zachytený Shoptet základ. Technické chyby opraviť pred dolaďovaním obchodných boostov. Odsúhlasiť synonymá s človekom znalým sortimentu.
7. Overiť klávesnicu, screen reader oznámenia výsledkov, iOS/Safari, Enter/Escape/späť, mobilnú klávesnicu, filtre/radenie/reset, cenu/DPH/jednotku a sklad proti detailu.
8. Otestovať nákupný tok až po údaje bez odoslania objednávky, konzolu, zachovanie udalostí Luigi/Shoptet a deduplikáciu analytiky. Zmerať výkon pred/po na rovnakom prostredí. Aktuálne tieto kontroly nemajú PASS.
9. Klient schváli konkrétny funkčný preview. Až potom samostatné schválenie merge/nasadenia/publikovania nastavení. Rollback: pôvodná konfigurácia Luigi a pôvodný verzovaný loader; oba stavy zaznamenať pred zmenou.

## 11. Odovzdané súbory

- AUDIT.md — tento audit s oddelením dôkazov a obmedzení.
- RELEVANCE.md + fallback-results.json — všetky dopyty, názvy/kódy a hodnotenie porovnávacieho základu.
- computed.json — aktuálne CSS premenné a reprezentatívne computed štýly.
- preview.html + preview.css — izolovaný model desktop/mobil s porovnaním Top a kontrastu.
- before-results-desktop/mobile.png — skutočný Shoptet fallback, nie Luigi „pred“.
- proposal-desktop/mobile.png a proposal-aa-desktop/mobile.png — snímky modelu, nie produkčné „po“.
- QA.json — kontrola lokálneho modelu a kontrastu.

Pracovné podklady sú v repozitári. Produkčné src/dist/loader, verzia balíka aj administrácia zostávajú bez zmeny. Model sa neinjektuje do živého e-shopu. Kompletné uzavretie Luigi auditu vyžaduje odstrániť vyššie uvedenú sieťovú prekážku a overiť index/konfiguráciu.

## 12. Overené oficiálne možnosti Luigi (všeobecné, nie konfigurácia tohto účtu)

Dokumentácia bola dostupná cez webový nástroj; nezávisí od blokovaného runtime skriptu v testovacom prehliadači.

- [Autocomplete.js customization](https://docs.luigisbox.com/quickstart/autocomplete/customizing-autocompletejs/): dokumentované sú layouty, Actions, Types/defaultFilters a lokalizácia. Knižnica zabezpečuje automatickú analytiku. Druhý tracking handler nepridávať. Toto potvrdzuje podporované možnosti knižnice, nie oprávnenie alebo potrebu znovu inicializovať existujúci widget.
- [Search.js customization](https://docs.luigisbox.com/quickstart/search/customizing-searchjs/): vlastné šablóny pre hlavný layout, výsledok a facet sú podporované. Musia existovať pred inicializáciou. Pri výsledkových odkazoch treba zachovať resultUrl a dataLbId/data-lb-id pre atribúciu. Ak sa potvrdí Search.js, je to vhodnejšia cesta než presúvanie DOM; v spravovanej integrácii ju musí potvrdiť Luigi.
- [Filters and facets](https://docs.luigisbox.com/search/guides/filters-and-facets/): dynamický výber facetov podľa dopytu je dokumentovaný cez dynamic_facets_size. To nie je dôkaz, že creation_time musí byť vhodný zákaznícky filter alebo že tento účet sprístupňuje per-category pravidlá v administrácii. V tomto audite sa API nevolalo.
- [Dynamic Filters](https://www.luigisbox.com/features/dynamic-filters/): dodávateľ opisuje prispôsobovanie filtrov sortimentu/kategóriám. Dostupnosť, explicitné vylúčenia atribútov a úroveň konfigurácie treba overiť pre tento účet.

Tieto zdroje nemenia prioritu administrácia → oficiálne prispôsobenie → izolované CSS/JS → podpora. Do repozitára nebol pridaný druhý AutoComplete/Search.js init ani odvodený vendor selektor.
