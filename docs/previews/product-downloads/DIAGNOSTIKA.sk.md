# Mergado → Shoptet: názvy príloh

Stav k 30. 10. 2026: read-only diagnostika, bez prístupu do administrácie, bez zdrojového/výstupného feedu TIMBERSTORE. Žiadne produkčné údaje ani nastavenia sa nemenili.

## Čo vieme

Verejná [stránka produktu 313668](https://www.timberstore.sk/spojovacia-lista-rohova-na-pracovnu-dosku-38-l-p-hlinik/) pri čítaní webovým nástrojom uvádza dve prílohy: **Priloha 1** a **Priloha 2** (bez diakritiky). Odkazy smerujú na doménu dodávateľa demos24plus.com. Ich obsah sa neotváral. Úplné href sa týmto čítaním nezískali, preto sa nepovažujú za zaznamenanú zálohu URL. Aktuálnu dvojicu názov + úplná URL treba pred testom uložiť z administrácie/exportu alebo DOM stránky.

[Dokumentácia automatického importu Shoptetu](https://podpora.shoptet.cz/automaticke-importy-produktu/) uvádza `RELATED_FILES` medzi položkami úplného importu. Aktualizované oblasti sa vyberajú v nastavení profilu. Dokumentácia nepreukazuje samostatný prepínač aktualizácie názvu a URL jednej prílohy. Samotné vypnutie celej oblasti môže zastaviť aj aktualizáciu dokumentov; nejde teda o potvrdené riešenie oboch požiadaviek. Shoptet zavádza novú verziu importov postupne, preto nemožno bezpečne predpokladať rovnaké správanie prázdnych hodnôt na každom e-shope.

[Dokumentácia Mergada – elementy](https://help.mergado.com/sk/mergado-editor/praca-s-datami/zakladne-prvky/elementy-v-mergade/) opisuje vnorenú štruktúru `RELATED_FILES | RELATED_FILE` s podelementmi `TEXT` a `URL`. Názov a URL teda môžu byť vo feede samostatné údaje. To nepotvrdzuje konkrétny obsah feedu TIMBERSTORE ani správanie jeho importu.

## Odpovede na šesť otázok

| Otázka | Výsledok |
| --- | --- |
| Odkiaľ pochádza „Priloha 1“? | Neoverené. Porovnať dodávateľský vstup, výstup Mergada a záznam Shoptetu pre rovnakú URL. |
| Posiela názov Mergado, alebo ho vytvára Shoptet? | Neoverené. Ak výstupné `TEXT` obsahuje tento názov, do Shoptetu ho už posiela feed. Jeho pôvod môže byť ešte v dodávateľskom vstupe alebo pravidle Mergada. Ak vo výstupe chýba, treba preveriť import/šablónu alebo starší uložený názov. |
| Dá sa príloha ručne premenovať v administrácii? | Pre konkrétny účet neoverené. V detaile produktu skontrolovať oblasť Súvisiace/Súvisiace súbory a editovateľný názov pri prílohe. Existencia názvu v dátovom modeli sama nepotvrdzuje oprávnenia ani dostupnosť konkrétneho ovládania. |
| Prepíše názov ďalší úplný import? | Neoverené. Závisí od vstupných hodnôt, zaškrtnutých oblastí, párovania príloh a verzie importu. Potrebný kontrolovaný test. |
| Dá sa aktualizovať URL oddelene od názvu? | Feed ich môže mať oddelene; samostatný bezpečný prepínač v Shoptete sa nepotvrdil. Prázdne `TEXT` nie je bez testu riešenie. |
| Zachovajú sa ručné názvy a aktualizácie dokumentov? | Zatiaľ nemáme potvrdený postup. Možná cesta je autoritatívny názov vo výstupe Mergada a nezmenené URL, ale iba pri spoľahlivom zdroji názvu a otestovanom párovaní. Frontend zostáva pri aktuálnych názvoch. |

## Čo skontrolovať bez zmien

1. V Shoptete nájsť produkt podľa **kódu 313668**, nie iba názvu. Uložiť export/zálohu jeho aktuálnych príloh: poradie, názov, úplné href, prípadné ID a počet; dátum a čas Europe/Bratislava.
2. V automatických importoch identifikovať presný profil, ktorý aktualizuje produkt. Poznačiť plán najbližšieho úplného importu, posledný úspešný protokol, zapnutie oblasti Súvisiace súbory a dostupné správanie prázdnych hodnôt. Nič neprepínať.
3. V Mergade nájsť ten istý produkt podľa kódu. Porovnať dodávateľský vstup a skutočný výstup odovzdávaný Shoptetu. Pri každej prílohe skontrolovať `TEXT`, `URL`, poradie a pravidlá meniacich tieto elementy.
4. Zaznamenať názvy pravidiel a ich poradie. Nesprístupňovať tajné URL feedov, tokeny ani prihlasovacie údaje do verejného repozitára.

## Presný bezpečný test – zatiaľ iba návrh

1. Najprv vykonať vyššie uvedenú zálohu a čítanie nastavení. Overiť obsah prvého dokumentu spoľahlivým existujúcim údajom alebo potvrdením majiteľa. Bez toho nepoužiť vecné označenie „Technický výkres“.
2. **Až po osobitnom schválení zmeny produkčného údaja** v administrácii zmeniť iba názov prvej prílohy na **Technický výkres**, ak je toto označenie potvrdené. Ak nie je, navrhnúť neutrálny jednoznačný názov na test a vyžiadať jeho schválenie. URL, poradie a druhú prílohu nemeníme.
3. Ihneď po uložení zaznamenať presný názov, obe URL a počet príloh; skontrolovať verejný detail v čistej relácii. Zmena nesmie vytvoriť novú prílohu.
4. Počkať na **najbližší riadny úplný import**. Nespúšťať dodatočný import ani meniť jeho globálne nastavenia. Samotný aktualizačný import nemusí oblasť príloh vôbec spracovať.
5. Z protokolu potvrdiť úspešné spracovanie produktu a príloh a uložiť čas. Potom porovnať s oboma predchádzajúcimi záznamami: názov prvej prílohy, názov druhej, úplné URL, počet, poradie a prípadné ID.
6. Ak meno zostalo, ale prílohy neboli v importe zapnuté alebo produkt nebol spracovaný, výsledok je **nepriekazný**. Jediné zachovanie mena tiež nepotvrdzuje, že sa pri zmene dodávateľskej URL spáruje tá istá príloha; to vyžaduje samostatný test v testovacom e-shope.
7. Ak sa meno vráti, import názov v tejto konfigurácii prepísal. Ak vznikne duplicita alebo sa zmení URL/počet, test zastaviť a porovnať feed a log; nespúšťať hromadnú opravu.
8. Návrat na pôvodný názov vykonať iba v schválenom rozsahu testu zo zálohy, bez zmeny URL či ostatných produktov.

Výstup testu: riadky PRED / PO PREMENOVANÍ / PO RIADNOM ÚPLNOM IMPORTE s časom, menami, URL a počtom + identifikácia protokolu. Až tento záznam umožní rozhodnúť o ďalšom postupe.
