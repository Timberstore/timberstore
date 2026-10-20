# TimberStore — zhrnutie pripraveného preview od v0.6.13

**Stav: nevydané.** Finálne vydanie čaká na povinné Safari/WebKit testy. Produkcia zostáva v0.6.13; nový tag ani merge neboli vykonané.

## Header a navigácia

Hlavička, vyhľadávanie a prihlásenie zostávajú. Rozbalené mobilné podkategórie majú jemné pozadie; produktový layout má hranice, ktoré chránia zarovnanie mobilnej hlavičky.

## Kategórie, filtre a radenie

Tabuľka má viac miesta na cenu/jednotku a čitateľnejšie kódy a sklady. Filtre sa konzistentne otvárajú/zatvárajú, reagujú na klik mimo a Escape. Mobilná CENA má rovnakú šípku ako ostatné filtre. Natívne radenie a dátové filtrovanie zostávajú.

## Detail produktu

Centrovaný názov zostáva v pôvodnom zápise z feedu. Pod ním sú kód a značka. Varianty a nákupný panel sú prehľadne oddelené; sklad a doručenie vľavo, cena vpravo, množstvo a košík pod nimi. Varianty, galéria a natívne výpočty zostávajú. Doprava a kontaktné odkazy sú upratané.

## Homepage a produktové karty

TOP Produkty, Novinky a MERIVOBOX majú sklad nad množstvom a cenu nad košíkom. Ovládače sú kompaktné a použiteľné na mobile. Ceny vrátane € sú modré, jednotky neutrálne, ceny bez DPH na kartách v zátvorkách. Kód na obrázku má svetlý podklad. NOVINKA je slivková. Fotografie a počet kariet sa nemenili.

## Dostupnosť, košík a odporúčané produkty

Sklady majú pôvodné významové farby a skutočné Shoptet počty. Nevznikla nová skladová logika. Množstvo používa referenčný vzhľad košíka. Popup po pridaní, súvisiace a podobné produkty majú jednotné ceny, jednotky a funkčné nákupné ovládače. Checkoutové výpočty ani platby sa neprepisovali.

## Overenie a ďalší krok

Dostupný Chromium smoke a build prešli; predchádzajúce nákupné testy sú zdokumentované. **Safari ani fyzický iPhone neboli overené.** WebKit v prostredí chýba a jeho download je blokovaný; pred vydaním treba sprístupniť testovanie a vykonať celý finálny nákupný/checkout test bez skutočných objednávok alebo platieb.

Navrhnuté číslo budúceho vydania je v0.7.0, zatiaľ však nie je vytvorené ani pripravené na aktiváciu. Používateľ po úspešnom vydaní zmení iba `PROD` v existujúcom loaderi. Návrat je rovnakým spôsobom na potvrdenú v0.6.13.
