# TIMBER STORE · finálna požiadavka funkčnej parity

**PRIPRAVENÉ — NEODOSLANÉ, NEPUBLIKOVANÉ.**

Obchod: www.timberstore.sk, tracker842889-1266949. Stabilná produkcia v0.7.7.
Aktuálny doplnok a všetky rozpracované preview vrátane rc.8 nie sú majiteľom
akceptované ako funkčne rovnocenná náhrada natívnych kariet.

Cieľ: ponechať váš index, relevanciu, synonymá a vyhľadávacie filtre, ale zachovať
existujúce natívne TIMBER STORE produktové karty a ich nákupné pravidlá. Nežiadame
ďalšie kozmetické prefarbenie predvolených kariet.

## 1. Požadujeme záväznú technickú odpoveď a zvolenú cestu

V aktuálnej oficiálnej dokumentácii sú podporované vlastné Search.js templates,
ResultsRenderer (funkcia/HTML endpoint) a vlastné Search API rozhranie. Potvrďte
**áno/nie pre našu konkrétnu Shoptet integráciu, tarif a nasadený build**:

1. Môžete dodať podporovanú vlastnú šablónu s natívnym TIMBER STORE HTML, natívnym
   nákupným bindingom a kompletným dátovým kontraktom? Kto ju bude spravovať?
2. Alternatívne: podporujete ResultsRenderer s existujúcimi serverovými Shoptet
   kartami? Dodajte podporovaný dávkový renderer, jeho vstup, kontext relácie,
   odpoveď a init/cleanup. URL režim vyžaduje item_id — v skúšaných hitoch chýba.
   Ak sa zvolí funkčný režim s identitami hitov, potvrďte tento konkrétny binding.
3. Ak1/2 nie, povoľuje naša licencia API integráciu, pri ktorej ovládame celé UI?
   Potvrďte náklady, rate limits, SLA, podporu a zachovanie súčasných indexových
   pravidiel/synoným. Verejná dostupnosť Search endpointu nie je potvrdením tarifu.
4. Ak funkčnú paritu v tejto inštalácii neviete podporovane dodať, výslovne to
   uveďte. Nepokračovať predvolenými kartami, ktoré prídu o natívne funkcie.

Rozsah zahŕňa Search, AC/Top a odporúčania product_detail/basket/basket_popup.
V existujúcom bootstrape sú identifikátory `template-result-default`,
`template-results`, `template-search`, `template-quick-search-default`,
`template-top-items`, `template-recommend-product_detail`,
`template-recommend-basket`, `template-recommend-basket_popup`. Potvrďte presný
podporovaný spôsob override a lifecycle každej šablóny; hook Search ResultsRenderer
nepovažujeme za potvrdený pre AC/Recco. AC má zachovať kompaktné tri stĺpce,
ohraničenie a vnútorné posúvanie; pridať úplné údaje/nákup až podporovanou šablónou.

## 2. Povinný dátový a nákupný kontrakt

Vyplňte všetky riadky `DATA-CONTRACT.md`: zdrojové pole, dátový typ, jednotka,
kontext variantu/cenovej skupiny, normalizácia, frekvencia aktualizácie a podporovaný
render/buy hook. Konkrétne chýbajú:

- autoritatívna netto cena a konzistentný pár gross/net/currency/unit; vat_rate23
  vo vzorke nie je náhradou netto ceny pre všetky sadzby/skupiny/zaokrúhlenia;
- potvrdené počty jednotlivých skladov, ich jednotky, priorita a prah zobrazenia
  napr. >100; nezamieňať príznaky0/1 s počtami;
- nezávislé minimum, krok, objednávkový násobiteľ, maximum, presnosť množstva,
  orderable a pravidlá predaja nad sklad; oddeliť to od obsahu balenia;
- presná mapa identity/SKU → productId/priceId/variant a jeden podporovaný nákup
  požadovaného amount s existujúcim popupom, ikonou košíka a udalosťami;
- variantová voľba a kompletné údaje zvoleného variantu; bootstrap teraz odstraňuje
  nested. Dodať bezpečný kvalifikovaný variantový a skutočne neobjednateľný fixture,
  plus produkt s objednávkovým násobiteľom odlišným od minima;
- zachovanie kódu Komplet ako `.flag-komplet`, natívnych ikon a všetkých technických
  názvov/kódov. `flags_codes[].code=komplet` už existuje, nemožno ho stratiť v HTML.

Kontrolné produkty:306317 ks,553488 sada/Komplet,344255 balenie8650ks,
491405 metráž/Skladom,237597 min100ks/Centrálny sklad,494606 variantový kandidát.
Pri344255 unit=balenie, minimum1 a Balenie32; pri491405 unit=m a Balenie50.
Tieto hodnoty sa nesmú bez vysvetlenia zmeniť na objednávkový krok.

## 3. Výsledky a filtre

- Použiť natívny kontajner a počet kariet podľa doloženého kontextu, nie vaše
  breakpointy3/4. Natívny Search1440 má3 karty (~459px); váš má3 (~299px), pri1920
  má váš4 a natívny stále3. Zachovať funkčný natívny grid/table switch, jeho stav,
  poradie cien, qty, kódy, dostupnosť, medzery a mobilné ovládanie.
- Dodať úplný slovník mapovania natívnych filtrovatelných parametrov na Luigi
  atribúty vrátane hodnôt/jednotiek, poradia a slovenských zákazníckych názvov.
  Referencia kategórie zásuvkových výsuvov zahŕňa Dĺžka mm, Druh vedenia výsuvu,
  Farba, Nosnosť kg, Pohyb výsuvu, Priložené čelné kovanie, Svetlosť výsuvu mm,
  Výška bočnice mm, dostupnosť, značky a cenu. Zahrnúť ďalšie vhodné parametre
  ostatných kategórií. Facety4 z nášho API testu nie sú konečný slovník.
- Podporovane konfigurovať Facets/ModifyRequestParams/dynamic_facets_size podľa
  schváleného whitelistu. `creation_time`, #kamaradi, UUID, boost a iné interné
  údaje nevkladať do zákazníckych filtrov. Neskryť ich iba CSS.
- Použiť produktový count typu product; počty query/category/brand neoznačovať
  ako počet produktov. Kvalifikovať OR v skupine/AND medzi skupinami a counts.
- Dokázať celý label checkboxu/vzorky, rozbalenie/zbalenie, kombinácie, reset,
  mobilné otvorenie/aplikovanie/zatvorenie a zachovanie filtrov pri radení,
  reload, back/forward. Čiastkové existujúce PASS nie sú plná parita.

## 4. Chybový článok — konkrétny zdroj a odstránenie

Overené3.11.2026:
- Verejný Search API vracia type=article, identity `/stranka-nenajdena/`,
  original_url=`https://www.timberstore.sk/stranka-nenajdena/`.
- Zdrojová URL vracia HTTP200, title/H1„Stránka nenájdená“, canonical na tú istú URL
  a robots=index,follow. Ide o indexovanú stránku s chybovým obsahom, nie iba chybu
  CSS ani obyčajný nedostupný odkaz. Ktorý import ju vytvoril, zatiaľ nie je dokázané.

Žiadame zistiť a doložiť zdroj tejto identity (feed/API/crawl alebo ručné vloženie),
vyradiť ju v autoritatívnom importnom zdroji a po zálohe odstrániť z indexu podporovanou
operáciou Content Removal. Kandidátsky payload je v `remove-error-article.proposed.json`;
pred jeho použitím potvrdiť presnú type/identity proti exportu indexu. Vymazať iba
jeden objekt. Zároveň opraviť indexovateľnosť chybovej stránky v zdrojovom Shoptete
podporovaným nastavením. Overiť absenciu v Search, AC/Top Items aj populárnych článkoch
hneď a po ďalšej kompletnej synchronizácii. HMAC kľúč nikdy neposielať do repa/frontendu.
Bez schválenia teraz nevykonať DELETE ani zmenu importu/robots/adminu.

## 5. Analytika, výkon a prevádzková zodpovednosť

- Jeden natívny submit + ShoptetCartUpdated na akciu; žiadne duplicitné handlery.
  Jeden vlastník search impression/click/variant/amount attribution a consent.
  Navigačná URL a data-lb-id môžu byť odlišné; zachovať identitu indexu.
- Pri vlastnom API UI dodať podporované DataLayer/Events API napojenie s pôvodným
  consent/identity, bez duplicitného auto-reportingu. Overiť resource/list/impression
  aj vo vendor reporte pre Search, AC/Top, detail, košík, popup.
- Pre renderer jednu dávku na stránku a zachovanie relevančného poradia/append;
  žiadne N+1 sťahovanie detailov. Cenová/skladová synchronizácia, cache kontext,
  meraná latencia/SLA, retry/timeout/stale request a rollback musia byť explicitné.
  Nepridávať Hetzner ako runtime závislosť obchodu.

## 6. Preview, export a akceptácia

Vopred dodať izolovaný vendor preview, verziu Search.js/bootstrapu, export pôvodných
šablón a konfigurácie, identifikátor/verziu publikácie, časy/autora a presný diff
navrhovaných admin polí vrátane pôvodných hodnôt. Súčasné runtime hodnoty v staršom
SUPPORT-REQUEST nie sú náhradou admin exportu. Merge alebo návrat repozitára tieto
externé nastavenia nevráti; rollback musí obnoviť presný vendor export.

Homepage naďalej: vypnúť iba homepage_personalized a homepage_last_seen, zachovať
pôvodné kategórie a ich umiestnenie, Search/AC a ostatné schválené plochy.
Tento bod sa nemení na redizajn widgetov.

Akceptácia až po porovnaní rovnakéhoSKU a zadaného množstva s natívnou kartou a
serverovým košíkom vo všetkých placementoch,1440/375px, vrátane balenia, metráže,
nezávislého minima/násobiteľa, variantu a neobjednateľnosti; bez objednávky.
Každý bod PASS/FAIL/BLOCKED s dôkazom. Bez schválenia majiteľa nič nepublikovať.

Primárne dokumentačné odkazy a alternatívy sú v `DECISION.md`.
