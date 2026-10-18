# STOCK: oddelené zobrazenie skladov (rozpracované, 18. 10. 2026)

Požiadavka klienta: pri kladnej zásobe Dolný Hričov ukázať SKLADOM s množstvom; pri kladnej zásobe centrálneho skladu ukázať CENTRÁLNY SKLAD s množstvom. Nulové riadky vynechať. Administratívne zásoby, pravidlá objednávania a termíny dodania táto zmena nemení.

## Blokátor pred dokončením

Na verejnom detaile produktu 467126 natívna dátová vrstva aj GET /action/ProductStockAmount/?ids[]=334721 vracajú iba syntetický sklad ext s názvom Sklad a množstvom > 100. Nevracajú samostatné sklady Dolný Hričov a Centrálny sklad. Screenshot administrácie ukazuje 9 a 232, ale tieto čísla nie sú živý zdroj a nesmú sa vložiť do kódu. ext sa nesmie automaticky považovať za centrálny sklad: teraz zahŕňa aj vlastnú zásobu.

Pred aktiváciou treba sprístupniť nezávislé živé zásoby oboch skladov. Overiť nastavenia viditeľnosti a verejné skladové dáta s prístupom do administrácie; ak natívny výstup nestačí, dohodnúť skladový export/integráciu a jeho aktualizáciu. Označenie centrálneho skladu za odberné miesto len kvôli dátam nie je prijateľné bez overenia dopadu na osobný odber. Žiadne nastavenia Shoptetu alebo Mergada zatiaľ neboli upravené.

## Implementácia

Modul podporuje iba detail produktu bez variantov so samostatne pomenovanými skladmi v natívnej dátovej vrstve. Neodvodzuje zásoby z agregátu. Pri chýbajúcich alebo nejednoznačných dátach ponechá pôvodné zobrazenie. Obe nuly ponechajú natívnu informáciu o nedostupnosti. Používa pôvodnú jednotku produktu a rešpektuje zverejnené obmedzenie presnosti množstva. Kód pre výber skutočných variantov potrebuje samostatné overenie pred zapnutím pre takéto produkty.

## Overenie

Šesť testov skladovej logiky, lint a build prešli. JS 26,47 KiB gzip / 30 KiB, CSS 20,99 KiB gzip / 21 KiB. Zatiaľ bez živého vizuálneho overenia samostatných skladov, mobilného/Safari a nákupného checklistu. Draft nie je určený na merge ani nasadenie. Produkčný loader sa nemení; zostavené dist súbory sa doplnia po doriešení dát a kontrole preview. Staršie vydania zostávajú zachované.
