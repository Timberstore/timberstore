# LB1 · Minimálny kontrakt natívnej karty

Toto sú **požadované významy**, nie tvrdenie, že Luigi už má rovnomenné polia.
`purchaseContractProblems()` v `shared/luigi/search.js` kontroluje navrhovaný
normalizovaný kontrakt pri príprave integrácie. Nie je zapojený do zákazníckeho UI
ani označený za dodanie nákupnej funkcionality.

| Údaj / význam | Skutočne doložené údaje | Čo ešte treba potvrdiť/dodať |
|---|---|---|
| identity / navigácia / SKU | `hit.url`, `attributes.original_url`, `code[]`, `uuid[]` | Presné prepojenie na natívny productId, priceId a konkrétny variant. `item_id` pre dokumentovaný URL ResultsRenderer v skúšaných hitoch chýba. SKU sa nesmie použiť ako priceId. |
| title, technické údaje, kód | `title`, `code[]`, `part_number`, `serial_number`, description | Úplný neskrátený názov a sémantické kódové sloty v každej šablóne. Žiadna identifikácia variantu z textu názvu. |
| prices.gross / prices.net | `price_amount`, `price_eur_amount`, `vat_rate[]` sú dostupné | Autoritatívne netto zo Shoptetu/pricing API. `vat_rate=23` pri vzorke nie je oprávnenie počítať všetko univerzálne. Jedna menová/cenová položka musí obsahovať obe ceny s jednotkou, presnosť a kontext cenovej skupiny/DPH. |
| unit | `unit[]`: ks, sada, balenie, m | Normalizovaná objednávková jednotka oddelená od fyzického obsahu balenia a mernej jednotkovej ceny; rovnaká na karte aj v košíku. |
| stock.warehouses[] | `availability_stock_quantity[]`, `availability_dolny_hricov[]`, `availability_timber_sklad[]`, `availability_centralny_sklad_[]`, `availability_rank_text[]` | Zdrojové ID/skutočný počet/jednotka každého skladu, priorita zobrazenia, formát `>100`, timestamp. Názov poľa neznamená počet: overená metráž má Dolný Hričov1, centrálny1, Timber0 a celkovú hodnotu28334. Hodnoty1 preto nekopírovať ako „1ks“. |
| purchase.minimum | `minimum_amount[]` | Význam jednotky a variantového kontextu. Minimum neznamená automaticky krok ani násobiteľ. |
| purchase.step | V sledovaných hitoch nebol doložený samostatný objednávkový krok | Autoritatívne pole alebo podporované natívne rozhranie; presnosť desatinných množstiev a presná normalizácia. |
| purchase.packMultiple | `Balenie[]` existuje, význam nie je kvalifikovaný ako objednávkový násobiteľ | Samostatný násobiteľ a jeho jednotka, oddelený od minimálneho odberu a obsahu balenia. 344255 má unit=balenie, minimum1, Balenie32 a názov8650ks: objednávka1 balenia nie je32 ani8650 objednávkových jednotiek. |
| purchase.maximum / orderable | `availability`, `negative_amount[]`, `visibility` nie sú potvrdeným orderable kontraktom | Explicitné orderable, maximálne objednateľné množstvo alebo výslovné unlimited=null, pravidlo predaja nad sklad a neobjednateľnosti. `availability:0` aktuálne nevrátilo žiadny kandidátsky produkt; nevydávame to za test neobjednateľnosti. |
| purchase.binding | Natívny formulár nesie productId/priceId/amount; vendor default buy funguje | Jeden podporovaný submit existujúcej natívnej formy alebo dodávateľom potvrdená funkcia s product/variant/amount. Musí aktualizovať popup aj košíkovú ikonu a vrátiť výsledok serverovej validácie. Žiadny druhý handler. |
| variant | Pri priamom úplnom API dopyte sú `nested` objekty dostupné; bootstrap však má RemoveFields=[nested] | Potvrdiť sémantiku nested variantov, selectionRequired, možnosti, zvolený variant a jeho ceny/ID/min/step/stock. Existencia nested objektu sama nepotvrdzuje objednateľnú variantovú voľbu. Externý natívny variantový doplnok bol v predchádzajúcom teste sieťovo blokovaný. |
| flags.codes | `flags_codes[].code=komplet` existuje; zdrojová farba je hnedá | Podporovaná šablóna musí zachovať sémantický `.flag-komplet` a natívny CSS token. Generic `.flag` bez kódu nestačí. Ostatné flagy sa nesmú prefarbiť odhadom. |
| source.updatedAt / cenový kontext | Verejné hit snapshoty neobsahujú potvrdený čas aktuálnosti obchodných údajov | Zdroj + dátum/čas + verzia pravidiel/cenovej skupiny; SLA synchronizácie. Konfliktné/oneskorené ceny alebo sklad nesmú viesť k tichému nákupu so starou cenou. |
| analytika | Hit identity, navigačná URL a SKU sú rôzne koncepty | Jeden vlastník impression/click a natívneho cart eventu, súhlas a väzba na list/impression. Rovnaký produkt/variant/amount v košíku aj reporte; neduplikovať automatický a ručný zber. |

## Overené významové rozdiely vzoriek

- 237597: minimum100ks; natívne ustálené min/step100 a serverový košík100ks ×0,09€.
  Je to dôkaz tejto SKU, nie všeobecné pravidlo „step=minimum“.
- 344255: 1balenie ×186,49€; 8650ks v názve je obsah. `Balenie=32` sa nepoužije
  na výpočet objednávky bez vysvetlenia zdroja.
- 491405: predaj v m, minimum1; `Balenie=50` neoprávňuje zmeniť odber na50m.
- 553488: sada, Komplet, gross225,83€. Aktuálny API stock snapshot má80; starší
  natívny dôkaz84 je historický údaj, nie chyba CSS. Počty musia byť synchronizované.
- 494606: nested objekty sú prítomné v úplnom Search API dopyte. Aktuálny doplnok
  ich nežiada; natívny variantový test nebol kvalifikovaný. **BLOCKED.**

Čerstvé hodnoty a zoznamy dostupných polí sú v `api-preflight.json`.
Mená dodávateľských polí, mapovanie, podporovaný init/cleanup a zodpovedný systém
musí doplniť Luigi/Shoptet integrátor. Neimplementovať renderer s defaultnými
jednotkami, odhadom počtu skladu či min/step a následne ho označiť za funkčne hotový.
