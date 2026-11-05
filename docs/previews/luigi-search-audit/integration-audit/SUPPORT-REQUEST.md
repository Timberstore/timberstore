# Návrh požiadavky pre podporu Luigi’s Box — NEODOSLANÉ

Obchod www.timberstore.sk, Shoptet/Apollo, tracker 842889-1266949.
Prosíme o oficiálne podporovaný kontrakt pre Autocomplete (vrátane Top produktu)
a Search: verziu rendereru, verejnú dokumentáciu, podporované templates/hooks
pre nižšie uvedené dáta a nákupné operácie. Nechceme vlastný náhradný cart API
ani duplicitnú analytiku. Žiadna konfigurácia zatiaľ nebola upravená.

1. Ako renderovať a odosielať natívne množstvo s minimom a nezávislým násobiteľom?
   SKU 237597 má unit=ks, minimum_amount=[100]; detail má amount/min=100,
   step=1. Shoptet listing qty-picker používa amount z multiply_order ako krok.
   minimum_amount samo o sebe nepreukazuje násobiteľ. Kde je autoritatívny
   pack increment? Prosíme o potvrdenie mapovania z doplnku multiply_order,
   serverové zaokrúhlenie, limity a chyby pre typed qty 101/199/200.
2. Jednotka, cena za jednotku, cena za minimálne balenie, s/bez DPH: ktoré polia
   a formátovače sú podporované? SKU 344255 je unit=balenie (8650 fyzických ks
   v balení), minimum=1. Nemožno zmeniť objednávkové množstvo na 8650.
   SKU 306317 má 4,11 €/ks s DPH, detail 3,34 € bez DPH. Autocomplete nesmie
   neoznačenú cenu prezentovať ako cenu za balenie či netto.
3. Varianty: ako zobraziť a vybrať konkrétne priceId/SKU alebo bezpečne navigovať
   na natívny variantový detail? SKU 494606 používa externý variantový doplnok.
   Prosíme o podporu jeho zdroja/kontraktu a pravidlo kedy je iba detailové CTA.
4. Nedostupné produkty: prosíme o konkrétne testovacie SKU a kontrakt
   availability/orderable, zákaz buy a správne CTA. availability rank/číselné
   availability nemožno bez dokumentácie interpretovať ako možnosť nákupu.
5. Konverzie: zachovať buy s resource_identifier, listom, impression/event
   atribúciou a consentom v Search aj Autocomplete/Top. Prvý lokálny test
   zaznamenal Search Results atribúciu, opakované CDN testy nie; prosíme
   o diagnostiku podporovaného consent/transport mechanizmu a spôsob testovania
   reportov bez odoslania objednávky. Bez visitor identifikátorov v prílohách.
6. Potvrdiť podporované tematické hooks pre menší Top, celý technický názov,
   jednotky, SKU, DPH a identické košíkové ikony. Existujúci DOM nie je záruka
   stabilného API. Dokumentačný host docs.luigisbox.com je z testovacieho
   prostredia blokovaný (CONNECT 403); prosíme aj o dostupný export dokumentácie.
7. Filtre: whitelist zákazníckych polí a vylúčenie creation_time či interných
   atribútov v konfigurácii, bez maskovania CSS. Potvrdiť scope všetkých query.

Ak treba zmeniť administráciu/feed, žiadame presný diff pôvodná → nová hodnota,
spôsob zálohy, samostatný rollback a identifikátor verzie nastavenia. Návrat
repo buildu tieto zmeny nevracia. Pred schválením nič nepublikovať.

Akceptácia: referenčné SKU pre kus/minimum/násobiteľ/balenie/variant/nedostupnosť,
rovnaký SKU, amount, unit, gross/net a total ako natívny Shoptet pri každej
operácii; jedna cart operácia a správne atribuovaná buy udalosť; žiadne buy pre
neobjednateľný produkt. Desktop/mobil, klávesnica a čitateľné celé názvy.

8. Podporovaný indikátor „už v košíku“: Timber cart-count mapuje priceId z
   natívneho formu na dataLayer a počúva Shoptet cart aktualizácie. Ako napojiť
   tú istú informáciu do Search/AC bez zmeny vendor buy handlerov?
