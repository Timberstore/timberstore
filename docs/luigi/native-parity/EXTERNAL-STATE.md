# LB1 · Externý stav a navrhované zásahy — nič nezmenené

Žiadny zásah v tomto registri nebol vykonaný. Pôvodná hodnota z verejného bootstrapu
nie je export administrácie; pred publikáciou dodávateľ musí dodať skutočný export,
verziu, autora/čas a presné admin polia vrátane ich pôvodných hodnôt.

| Oblasť | Doložený pôvodný stav | Navrhovaná zmena | Návrat / podmienka |
|---|---|---|---|
| Šablóny/bootstrap | SHA2563b99802…c221; vlastné vendor templates, ResultsRenderer nenastavený | Izolovaný vendor preview s natívnou template alebo schváleným renderer hookom | Obnoviť export pôvodných templates a inicializácie; repo rollback nestačí |
| Search RemoveFields | Verejný bootstrap `["nested"]` | Variantové údaje zachovať podľa potvrdeného kontraktu | Export presného pôvodného admin poľa; neprepisovať globálnu premennú z repo JS |
| Search Facets | Bootstrap `price_amount,category:10,brand:10`; živý UI rozširuje aj štítky/farby | Úplný schválený zákaznícky whitelist a podporované vylúčenie interných atribútov | Export výslednej konfigurácie aj zdroja dynamických rozšírení; pôvodné admin hodnoty zatiaľ BLOCKED |
| Pole netto / nákupné pravidlá | Dostupné gross/unit/minimum/vat_rate, chýbajú kvalifikované zvyšné bindingy | Doplniť mapovanie podľa DATA-CONTRACT | Export feed/API mappingu a jeho predchádzajúcej verzie |
| Index article | typearticle, identity`/stranka-nenajdena/`, title„Stránka nenájdená“ | Po exporte/vyradení importného zdroja odstrániť práve tento objekt podporovaným Content Removal | Pred odstránením uchovať úplný objekt a pôvod zdroja; obnova podľa exportu/synchronizačnej verzie. Kandidátsky JSON nie je vykonaný príkaz |
| Zdrojová chybová stránka | HTTP200, robotsindex,follow, canonical sama na seba | Podporovaná oprava indexovateľnosti/chybového stavu v Shoptete; potvrdiť vlastníkmi obsahu | Zachovať pôvodné nastavenie/status/robots, presné admin pole musí identifikovať dodávateľ |
| Feed/crawl pôvod článku | Nedostupný export; príčina ingestu nepreukázaná | Doložiť pipeline a vylúčiť iba systémovú chybovú stránku zo zdroja | Pôvodné hodnoty BLOCKED exportom; nepripisovať Mergadu ani crawleru bez dôkazu |
| Homepage dva widgety | Existujúci runtime z rc.4 support requestu, bootstrap sa zhoduje | Selektívne vypnúť homepage_personalized a homepage_last_seen, zachovať natívne kategórie | Export každej inštancie/placementu; pôvodné admin hodnoty BLOCKED. Samotný návrat buildu nevráti widgety |
| Analytika | Doložený automatický zber; čiastkové missing attribution v starších testoch | Jeden potvrdený vlastník udalostí pri novom renderi | Export pôvodného tracking/consent nastavenia a dôkaz bez duplicít vo vendor preview |

Produkčný loader zostáva v0.7.7. Žiadne externé nastavenie sa nemenilo ani pri
priamych verejných GET testoch API. DELETE, HMAC operácia, import, admin publikácia
a produkčné nasadenie neboli spustené. Schválenie týchto zásahov nebolo udelené.
