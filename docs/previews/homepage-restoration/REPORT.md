# TIMBER STORE · obnova homepage, preview 0.7.7-rc.5

Majiteľ 2. 11. 2026 potvrdil dnešné nasadenie Luigi a očakávanie iba vyhľadávania.
Nechce homepage „Vybrali sme pre Vás“, „Naposledy ste si prezerali“ ani pridaný
H1. Jeho úplné podmienky sú zachované v OWNER-REQUIREMENTS.txt a určujú ďalšiu
prácu s celou integráciou. Doterajšia integrácia nie je dokončená ani schválená.

## Čo je pripravené a čo ešte bráni úplnej obnove

**Nový build 0.7.7-rc.5, nemenný commit 9eede39:**
https://www.timberstore.sk/?ts_preview=9eede39

V tomto builde sa náš pridaný homepage H1 vôbec nevytvorí. Nie je skrytý CSS
ani odstránený dodatočným DOM skriptom. Mení sa iba home vetva audit-preview pri
explicitnom TimberLoader.preview. Produkčný loader ostáva v0.7.6; kontakty a
nadpisy článkov sa nemenia. Ďalší vizuálny redizajn Luigi sa nevykonal.

**Obe homepage odporúčania týmto buildom ešte nie sú vypnuté.** Ich publikovaná
konfigurácia je mimo repozitára. Nemáme Luigi admin nástroj/prístup a nebudeme
ju obchádzať blokovaním celého bootstrapu, skrývaním CSS, mazaním DOM alebo
nezdokumentovanými runtime API. Preview odkaz je teda kandidát odstránenia H1,
nie dokončená obnova homepage. Kompletná obnova vyžaduje samostatný podporovaný
vendor preview pre selektívne vypnutie dvoch homepage inštancií.

Presná pripravená požiadavka: EXTERNAL-CHANGE-REQUEST.md (neodoslaná).
Pôvodné pozorované runtime hodnoty sú zapísané; presné admin polia/export a
rollback ich publikácie musí doložiť vendor/admin. Nič externé sa nemenilo.

## Pôvodný a súčasný stav

Zachovaný audit a archív: ../homepage-investigation/REPORT.md.
Kategórie neboli vymazané ani nahradené: vznikajú pôvodným Timber modulom,
majú 12 pôvodných odkazov. Luigi homepage_personalized vloží nový blok pred ne;
homepage_last_seen pridáva vlastný pás pri viac než dvoch vrátených položkách.
Starý archív zobrazuje kategórie bez týchto pásov. Produkčné vypnutie iba
repo preview widgety nevráti späť, lebo ide o samostatnú vendor konfiguráciu.

Cieľ obnovy: pôvodné bannery a obsah → Najobľúbenejšie kategórie → pôvodné
produktové sekcie, bez oboch homepage odporúčaní a bez nášho dodatočného H1.
Žiadne nové vlastné poradie kategórií alebo produktových sekcií sa nenavrhuje.
Natívny Shoptet hero a jeho správanie sa neprepisujú spolu s Luigi Recommenderom.

## Rozsah mimo homepage

INVENTORY.md rozlišuje Luigi od natívnych Shoptet/Apollo/Timber komponentov.
Nový živý priechod zachytil aj product_detail, basket a basket_popup vedľa
pôvodných súvisiacich/podobných produktov. Tieto ostatné zmeny nie sú automaticky
schválené ani plošne vypnuté; platia na ne všetky priložené podmienky zjednotenia.

Referenčné ceny, jednotky, labely a stavy sa čítajú z natívnych komponentov,
nie z predvoleného Luigi dizajnu. Výber computed štýlov pri desktop/tablet/mobile
je v reference-computed.json. Nákupná špecifikácia a blokery sú aj v
../luigi-search-audit/integration-audit/REPORT.md a SUPPORT-REQUEST.md.

## Overenie rc.5

- Lint/build PASS; JS36.18KiB / limit36.25, CSS32.75 / limit32.75.
- Skutočný CDN build, bez nahrádzania súborov v prehliadači.
- Čisté kontexty pre produkciu a preview, desktop1440/tablet768/mobile375.
- Na všetkých troch šírkach produkcia v0.7.6 má H1, rc.5 ho nemá.
- V oboch stavoch je 1 pôvodný kategóriový blok a 12 pôvodných odkazov;
  presné párové porovnanie v preview-qa.json. Luigi homepage widgety sú stále
  zaznamenané, nie potichu skryté.
- Kontakty majú stále 1 ts-contact-grid a doprava 1 H1; regression.json.
- home-*-before.png je čistá produkcia, home-*-after.png je iba rc.5 H1 zmena.
  Snímky preto nezobrazujú tvrdenú kompletnú obnovu bez vendor widgetov.
- inventory-live.json + päť desktop screenshotov zachytávajú aktuálne AC
  prázdne/písanie, detail, popup a košík. Sú to baseline dôkazy, nie kompletné
  responsive alebo funkčné schválenie týchto komponentov.
- Pri inventarizácii bol pridaný 1 testovací produkt do oddeleného anonymného
  košíka. Žiadna objednávka, osobné údaje, platba ani formulár neboli odoslané.

## Zostávajúce blokery

1. Selektívny vendor preview/deaktivácia homepage_personalized a homepage_last_seen.
2. Podporované qty/min/step/pack/unit/net/variant mapovanie pre všetky Luigi
   placementy; nezávislý násobiteľ a neobjednateľný SKU nie sú potvrdené.
3. Správnosť košíka, AJAX, opakovaných akcií a analytickej atribúcie vo všetkých
   umiestneniach/consent stavoch. Predchádzajúci100ks test nie je celá integrácia.
4. Parita detailových/košíkových odporúčaní a duplicít s pôvodnými pásmi.
5. Články/kategórie bez nerelevantných položiek, globálna politika interných
   filtrov a stránkovanie všetkých stavov.
6. Kompletné responzívne/klávesnicové testy všetkých placementov; Safari a
   fyzická mobilná klávesnica nie sú k dispozícii. Vendor reporting neoverený.

## Zapnutie, vypnutie, rollback

Zapnúť vyššie uvedený odkaz a overiť badge9eede39 a Timber.version=v0.7.7-rc.5.
Cookie platí iba v tomto prehliadači 7 dní; nevkladať preview do produkčného loadera.

Vypnúť: https://www.timberstore.sk/?ts_preview=off a navigovať bez parametra.
Overiť TimberLoader.preview=false, Timber.version=v0.7.6. Toto vráti aj pôvodný
produkčný H1; nepredstiera sa tým oprava produkcie.

Predchádzajúci neschválený preview: e8148ed /0.7.7-rc.4. Žiadny build/tag sa
neprepísal. Aktuálny produkčný loader ani stabilný tag sa nemenili.
Externý rollback sa pripraví podľa exportu konkrétnych vendor admin polí;
repo rollback externé nastavenia NEVRÁTI. Bez schválenia nič nepublikovať v
Luigi/Shoptet administrácii a nič nemergovať ani produkčne nenasadzovať.
