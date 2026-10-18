# STOCK: oddelené zobrazenie skladov (rozpracované, 18. 10. 2026)

Požiadavka klienta: pri kladnej zásobe Dolný Hričov ukázať SKLADOM s množstvom; pri kladnej zásobe centrálneho skladu ukázať CENTRÁLNY SKLAD s množstvom. Nulové riadky vynechať. Administratívne zásoby, pravidlá objednávania a termíny dodania táto zmena nemení.

## Blokátor pred dokončením

Na verejnom detaile produktu 467126 natívna dátová vrstva aj GET /action/ProductStockAmount/?ids[]=334721 vracajú iba syntetický sklad ext s názvom Sklad a množstvom > 100. Nevracajú samostatné sklady Dolný Hričov a Centrálny sklad. Screenshot administrácie ukazuje 9 a 232, ale tieto čísla nie sú živý zdroj a nesmú sa vložiť do kódu. ext sa nesmie automaticky považovať za centrálny sklad: teraz zahŕňa aj vlastnú zásobu.

Pred aktiváciou treba sprístupniť nezávislé živé zásoby oboch skladov. Overiť nastavenia viditeľnosti a verejné skladové dáta s prístupom do administrácie; ak natívny výstup nestačí, dohodnúť skladový export/integráciu a jeho aktualizáciu. Označenie centrálneho skladu za odberné miesto len kvôli dátam nie je prijateľné bez overenia dopadu na osobný odber. Žiadne nastavenia Shoptetu alebo Mergada zatiaľ neboli upravené.

## Implementácia

Modul podporuje iba detail produktu bez variantov so samostatne pomenovanými skladmi v natívnej dátovej vrstve. Neodvodzuje zásoby z agregátu. Pri chýbajúcich alebo nejednoznačných dátach ponechá pôvodné zobrazenie. Obe nuly ponechajú natívnu informáciu o nedostupnosti. Používa pôvodnú jednotku produktu a rešpektuje zverejnené obmedzenie presnosti množstva. Kód pre výber skutočných variantov potrebuje samostatné overenie pred zapnutím pre takéto produkty.

## Overenie

Šesť testov skladovej logiky, lint a build prešli. JS 26,47 KiB gzip / 30 KiB, CSS 20,99 KiB gzip / 21 KiB. Zatiaľ bez živého vizuálneho overenia samostatných skladov, mobilného/Safari a nákupného checklistu. Draft nie je určený na merge ani nasadenie. Produkčný loader sa nemení; zostavené dist súbory sa doplnia po doriešení dát a kontrole preview. Staršie vydania zostávajú zachované.

## Overenie administrácie po prihlásení

Sklady: Dolný Hričov ID 6 (predvolený fyzický sklad), Centrálny sklad ID 3 a TIMBER SKLAD ID 1. Všetky tri majú viditeľnosť na e-shope zapnutú; žiadny nie je označený ako odberné miesto. Globálne zobrazenie množstva je zapnuté s limitom 100. V detaile Hričova nie je samostatná voľba pre publikovanie presného stavu do frontendových dát. Tieto nastavenia boli iba prečítané, nezmenené. Samotné zapnutie viditeľnosti teda blokátor nevyrieši. Ďalší krok: zistiť existujúci proces synchronizácie skladov a pripojiť k nemu publikovanie oddelených stavov bez zmeny pravidiel výdajných miest.

## Overenie Mergada

Klient potvrdil, že zásoby aktualizuje Mergado. V projekte DEMOS – Danielův vývoj (351860) sú viditeľné elementy SKLAD-HRICOV, SKLAD-CSNK a SKLAD-NITRA a aktívne importy skladu (pravidlá 57 a 58), zaokrúhlenie hodnôt (59–61), doplnenie prázdnych hodnôt príslušných skladov (63 a 64) a dostupnostné pravidlá pre externý sklad, nedostupnosť a skladom (79–81). Samostatné skladové vstupy teda existujú; presné kopírovanie do výstupu a poradie vrátane XML pre konkrétny produkt ešte neboli overené v detailoch pravidiel. Pri navigácii do detailu pravidla opakovane blokuje čítanie ochrana prihlasovacích údajov prehliadača. Konektor Mergado sa v dostupnom vyhľadávaní pluginov nenašiel. Žiadne pravidlo ani proces Mergada nebol upravený alebo manuálne spustený. Na pokračovanie treba sprístupniť detail pravidiel / výstup XML, potom navrhnúť publikovanie samostatných stavov a overiť čerstvosť lokálnej zásoby po objednávke. Čas aktualizácie synchronizácie sa zatiaľ nemeria ani nepredpokladá.
