# Priame zobrazenie skladov — kontrola 19. 10. 2026

Pokračovanie z `b639c8c97778c8f743897e351cbbf0292dc2e7c0`, iba vetva `preview/stock-by-warehouse-20261019`. Klient potvrdil **Enterprise bez API** a následne **odmietol exportnú cestu**. Rozpracovaný exportný adaptér bol odstránený z aktívneho kódu; nebol commitnutý, pushnutý, nasadený ani zapojený. Tento záznam nemení frontend, build, verziu, tagy, loader, main ani nastavenia administrácie.

## Skutočné verejné dáta

| Produkt | SKU | ID | GUID | Verejný stock údaj | Predajná jednotka |
| --- | --- | --- | --- | --- | --- |
| TULIP Gola J, čierna matná P+L | 404394 | 331847 | e4f27f78-3daf-11f1-b943-bc241158b559 | `> 100` | pár |
| TULIP Gola J, strieborná P+L | 232861 | 313121 | 4684fd84-3daf-11f1-8dd3-bc241158b559 | `94` | pár |
| TULIP Gola J, biela P+L | 289124 | 313175 | 4700372e-3daf-11f1-96fa-bc241158b559 | `92` | pár |
| StrongSinks S3 sada | 549369 | 347129 | 6cba90bc-3db0-11f1-a956-bc241158b559 | `23` | sada |

Data Layer aj aktuálny natívny GET `/action/ProductStockAmount/` vracajú len sklad `ext`, názov `Sklad`, `isDeliveryPoint:0`. Názvy `SKLAD-HRICOV` a `SKLAD-CSNK` sa v týchto verejných odpovediach nenachádzajú. U produktu 404394 je `> 100` už v dátach, nielen vo viditeľnom texte. Z údaja nemožno získať presný počet ani rozdelenie. Čísla 94/92/23 sa nesmú vydávať za počet konkrétneho požadovaného skladu.

Čierna, strieborná aj biela sú podľa Shoptetu samostatné produkty (`hasVariants:false`), nie tri varianty jedného GUID. Pri čiernej a striebornej nebol vo formulári natívny variantový select; druhé vyhotovenie je odkaz na samostatný produkt. Biela sa našla cez vyhľadávanie.

Ďalšia obmedzená dávka 24 produktov z kategórie profilov vrátila tiež iba `ext`. Medzi skutočnými stavmi boli napríklad SKU `506411` = 2, `506406` = 1, `494253` = 1; opäť nejde o rozdelenie na Hričov/CSNK. Nulový stav ani rezervácie konkrétneho skladu sa z týchto vzoriek nepotvrdili.

## Prístup do administrácie

Klient uviedol, že prístup je k dispozícii. Preto bola vykonaná priama kontrola cez dostupný browser runtime:

- otvorené `https://www.timberstore.sk/admin/`;
- konečná adresa `https://www.timberstore.sk/admin/login/`;
- titulok `Prihlásenie - timberstore.sk`;
- prítomné pole typu password, nie prihlásená správa obchodu.

Dostupné tool pripojenia v tejto relácii neposkytli prihlásený Shoptet browser ani Shoptet prihlasovací secret. To neznamená, že klient nemá prihlásenie vo vlastnom prehliadači alebo inom vlákne; znamená to, že táto relácia ho aktuálne nepoužíva. Heslá, tokeny ani súbory súkromného profilu sa nevyhľadávali a žiadne prihlasovacie pokusy sa nevykonali. Je potrebné sprístupniť existujúcu prihlásenú reláciu podporovaným pripojením prehliadača, nie posielať heslo do chatu.

## Čo skontrolovať po sprístupnení relácie

1. **Nastavenia → Produkty → Sklady → Prehľad skladov**: oba skutočné sklady, názov/ID, viditeľnosť na e-shope a režim odberného miesta. Žiadne zmeny pomenovania, priradenia ani výdajného miesta naslepo.
2. **Nastavenia → Produkty → Sklady → Nastavenia**: stav kontroly skladu, zobrazovanie počtu a obmedzenie maximálne zobrazeného množstva. Samotná zmena limitu môže odstrániť `>100`, ale ešte nepotvrdzuje rozdelenie oboch skladov.
3. **Produkty → Prehľad → 404394 → Sklad**: oba jednotlivé skladové stavy, fyzický stav a nároky. Rovnako `232861` a `289124`; jednotka musí zostať pár, nesmie sa násobiť na jednotlivé kusy.
4. Overiť, ktoré sklady Shoptet skutočne zverejňuje natívnej šablóne Apollo. Existencia dát v administrácii a ich prítomnosť v zákazníckom dátovom rozhraní sú dva odlišné overiteľné stavy. Po prípadnom podporovanom nastavení znova porovnať Data Layer a stock GET.
5. Ak sú pomenované predajné počty dostupné natívne, pripojiť existujúci spoločný komponent na overený zdroj a otestovať počty, jednotky, nuly aj skutočný variantový produkt. Ak priamy zdroj neexistuje, doložiť presné obmedzenie a podporovanú možnosť integrácie; nepredstierať dokončenie.

Zmeny skladových nastavení by platili globálne, nielen v JS preview. Povolenie úprav preview sa preto nesmie zameniť za oprávnenie meniť objednávanie, viditeľnosť skladov alebo odberné miesta v produkcii. Najskôr read-only kontrola a konkrétne zistenie; žiadna taká zmena nebola vykonaná.

Oficiálne podklady: [Viac skladov](https://podpora.shoptet.sk/viac-skladov/), [nastavenie skladu, počet a limit zobrazenia](https://podpora.shoptet.sk/skladove-hospodarstvo/), [skladové nároky](https://podpora.shoptet.sk/skladove-naroky/), [Data Layer](https://developers.shoptet.com/shoptet-tools/data-layer/). Dokumentácia popisuje možnosti produktu, nepotvrdzuje aktuálnu konfiguráciu tohto účtu.

**Výsledok:** presné počty oboch skladov zatiaľ neoverené a nezobrazované. Nový build sa nevydáva. Ďalším potrebným vstupom je prihlásená Shoptet relácia; export sa podľa pokynu klienta nepoužíva.
