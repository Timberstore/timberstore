# Inventár integrácie a stav požiadaviek

Zdroj: zachovaný verejný LBX bootstrap z homepage-investigation a nový živý
priechod v inventory-live.json. Počty `.lb-product` zahŕňajú carousel klony;
24 DOM kariet neznamená 24 unikátnych odporúčaní (konfigurácia Size8).
Názov sekcie sám o sebe neurčuje pôvod.

| Komponent | Preukázaný pôvod / podmienka | Rozhodnutie a stav |
|---|---|---|
| AC pred písaním | #lbx-ac-element, Luigi bootstrap/autocomplete runtime; živá prázdna vstupná relácia | Referenčný stav zachytený; relevantnosť a parita nákupu otvorená |
| AC počas písania, Top, kategórie/značky/články | Ten istý Luigi root a templates, dopyt BLUM71B3550 | Predchádzajúce CSS kandidáty nie sú schválené; funkčný kontrakt minimum/step/unit/net/variant musí potvrdiť dodávateľ |
| Výsledky, filtre, sort, paging | #lb-search-element; Luigi dáta/renderer, Shoptet/Apollo triedy karty + Timber štýly | Doterajší test sort/filter prešiel, nie celá konfigurácia; paging/regresie všetkých stavov neoverené |
| Vybrali sme pre Vás | #lb-recommend-element-homepage_personalized; user_conversion_based | NECHCENÉ na homepage; selektívna externá deaktivácia pripravená, nepublikovaná |
| Naposledy ste si prezerali | #lb-recommend-element-homepage_last_seen; last_seen, items>2 | NECHCENÉ na homepage; rovnaký stav. V prázdnej relácii ostáva koreň bez obsahu |
| H1 na homepage | Timber audit-preview, od v0.7.6 aj produkčne | Vynechaný iba v novom explicitnom repo preview rc.5. Iné nadpisy/kontakty nemeníme |
| Najobľúbenejšie kategórie | Timber homepage-categories, dôkaz insertBefore stack + modul a záloha legacy | Zachovať 12 pôvodných položiek, anchor pred TOP Produkty; neprepisovať obsah |
| Súvisiace / Podobné produkty na detaile | Natívne .products-related-block/.products-alternative-block prítomné vedľa Luigi; serverové Shoptet karty, Apollo transformácie + Timber štýly | Zachovať; nesplývajú automaticky s Luigi sekciou |
| Mohlo by Vás zaujímať | #lb-recommend-element-product_detail, Type item_detail_alternatives | Luigi initialize vkladá nový container za #content-wrapper (fallback za .p-detail); živý dôkaz v detail snímke. Duplikácia s natívnymi pásmi je otvorená, nie vyriešená |
| Zákazníci tiež kúpili — hlavný košík | #lb-recommend-element-basket, Type basket | Luigi append do #cart-wrapper; živý dôkaz v cart snímke. Parita s pôvodným košíkom neoverená |
| Zákazníci tiež kúpili — popup | #lb-recommend-element-basket_popup, Type basket | Luigi append do #cboxLoadedContent .advanced-order; živý dôkaz v cart-popup snímke |
| Natívny advanced-order obsah | Shoptet formulár a Apollo, Timber popup/qty moduly | Zachovať; nepridávať druhý cart handler/analytiku |
| Pohyb hero banneru | Bootstrap z HTML interval9000, Timber iba swipe/preload | Nie je súčasťou selektívneho vypnutia homepage Luigi |
| Hover zmena fotografie | Natívny Shoptet main-3g delegated handler; Luigi template má swap-images a data-next | Zdroj doložený, žiadna globálna CSS oprava/disable |

Nové screenshoty pre detail/popup/cart sú **baseline dôkazy**, nie predstierané
„po oprave“ všetkých widgetov. Významné nákupné rozdiely zostávajú blokované.
Žiadna nová funkčná šablóna bez dokumentovaného podporovaného kontraktu nevznikla.

## Referenčné pravidlá

Autorita: src/styles/tokens.css, product-card.css, qty-picker, cart-count,
natívne Shoptet detail/form a aktuálny serverový košík. Živý výber computed
štýlov native karty a odlišnej Luigi karty pri1440/768/375 je v
reference-computed.json; je to meranie, nie povolenie preniesť veľkú kartu do AC.

- SKU #2454A6; cena gross podľa existujúceho .price-final a .ts-price-number.
- Pozitívny sklad #00C853; centrálny sklad #C97A2B podľa potvrdených dát.
- CTA brand #D4884A, hover #B8692E; konzistencia s natívnym tlačidlom/glyphom.
- Netto pomocný údaj #666878. Presné popisy/formát/netto hodnoty brať z natívneho
  cenového kontraktu; nepoužiť vlastnú univerzálnu DPH sadzbu na feed gross.
- Natívny qty-picker má výšku38px, radius7px, label/input font14px,
  krokuje podľa natívneho amount od multiply_order s min/max. Compact/detail/
  cart majú vlastný natívny layout; neprekopírovať fixné rozmery všade.
- Referencia kompaktnej/popup geometrie je natívny advanced-order a príslušné
  cart-modal/recommendations štýly, nie nový Luigi hero. Živé úplné rozmery
  kompaktného riadka/košíka a všetky varianty nie sú v tomto kroku recertifikované.
- Dostupné počty nevymýšľať podľa farby/ranku; jednotka balenie nie je počet
  fyzických kusov vo vnútri. Minimum_amount nie je dôkaz samostatného násobiteľa.
- Dlhý technický názov zachovať celý; bez orezania parametrov pre zarovnanie.
- Kontrast schválenej identity sa eviduje ako samostatný otvorený bod.

## Blokované / neotestované

Podporované vendor qty/min/step/pack/unit/net/variant templates/hooks,
objednateľnosť nedostupného výrobku, parita priceId cart-count, attribúcia podľa
placementu a consentu a potvrdenie vendor reportingu zostávajú neoverené.
Reprezentatívne hraničné SKU (nezávislý min≠step a neobjednateľný) zatiaľ nie sú
potvrdené; doterajší sku237597 test preukázal predvolené100ks v troch miestach,
nie všetky prípady. Safari/fyzická mobilná klávesnica nie sú dostupné.
Žiadne výsledky sa nepovyšujú na kompletné splnenie priložených podmienok.

## Nameraná natívna karta (verejné SKU553488)

Roboto; cena225,83€/sada, netto183,60€bezDPH. Ide o meranie správnej natívnej karty, nie geometriu na kopírovanie do AC.

| Šírka | Gross | Netto | SKU | CTA / qty výška |
|---|---|---|---|---|
| 1440 | 20px, 700, rgb(36, 84, 166) | 14px, rgb(102, 104, 120) | 12.5px, rgb(36, 84, 166) | 38 / 38 px |
| 768 | 20px, 700, rgb(36, 84, 166) | 14px, rgb(102, 104, 120) | 12.5px, rgb(36, 84, 166) | 38 / 38 px |
| 375 | 16px, 700, rgb(36, 84, 166) | 12px, rgb(102, 104, 120) | 12.5px, rgb(36, 84, 166) | 38 / 38 px |
