# TIMBER STORE · príčina zmeny homepage, 2. 11. 2026

**Kategórie nezmizli. Sú viditeľné, majú všetkých 12 odkazov a pôvodný názov.**
Na aktuálnej homepage je pred nimi ďalší, samostatný Luigi Recommender.
Tento stav sa reprodukuje v čistej produkcii v0.7.6 aj v preview e8148ed.
Nie je spôsobený spoločnou preview cookie. Vizuálne práce na Luigi sú pozastavené.
Počas vyšetrovania sa nemenil zdroj aplikácie, build, loader ani administrácia.

## Zachované dôkazy a metóda

Každý variant mal nový browser context bez cookies/storage od ostatných variantov.
`production.json` potvrdzuje v0.7.6/preview=false; `preview.json` e8148ed/true.
Snímky pri DOMContentLoaded, +3s a +12s, plná screenshot homepage, verejné HTML
s redigovanými input hodnotami, zoznam skriptov, HTTP statusy a stacky relevantných
DOM vložení. Žiadne cookies, storage hodnoty alebo request bodies sa neukladajú.
`manifest.json` obsahuje hash archivovaných súborov.

Kontrolné varianty `without-luigi` a `without-timber` blokovali príslušné requesty
len v samostatnom testovacom prehliadači. Nie sú produkčná oprava. Diagnostické
wrappers DOM metód zachovávajú pôvodné volania, iba zapisujú stack. Cez live
Shoptet sa nič nemaže ani nepresúva. Absolútne Y sú orientačné, závisia od layoutu;
rozhodujú prítomnosť, viditeľnosť, obsah a poradie sekcií.

## Zistenia so zdrojom a podmienkou

| Jav | Potvrdený zdroj | Podmienka aktivácie / dôkaz |
|---|---|---|
| H1 „Nábytkové kovanie a príslušenstvo“ | `src/modules/audit-preview/index.js`, text v core/texts.js | getAuditPage()=home, žiadny h1, existuje `.timber-categories-banner`; vloží H1 pred kategórie. Od 8d43017 už bez preview guardu. V čistom v0.7.6 aj preview. |
| Kategórie | `src/modules/homepage-categories/index.js` | page=home; ak `.timber-categories-banner` ešte neexistuje, vloží 12 kategórií pred prvý `.homepage-group-title`. Stack v production.json ukazuje v0.7.6 bundle. Bez Timber buildu nevzniknú; bez Luigi zostávajú. |
| „Vybrali sme pre Vás“ | aktuálny verejný LBX-1266949.js, `homepage_personalized`, recco.js | Type=user_conversion_based, Size=8; slovenská translácia rc_title_hp_perso. Homepage route, dostupná locale/currency konfigurácia, aktívna služba/A-B vetva a načítané dáta. Renderuje sa z odporúčaných produktov, nie z kategórií. |
| Umiestnenie odporúčania | initialize homepage_personalized v LBX skripte | prvá vetva po `.benefitBanner.position--benefitHomepage`; inak po footer-banners, inak banners-row, inak začiatok homepage-banners-wrap. Existencia benefitBanner je doložená už v server HTML. `placement.json` overuje runtime parent/sibling. |
| Výmena obrázka produktu pri hoveri | natívny Shoptet main-3g.js, modul5053 | Delegovaný mouseenter na `.swap-images` nastaví `.swap-image.src=data-next`, mouseleave vráti data-src. Luigi šablóna tieto triedy a druhý obrázok poskytuje. motion.json zachytáva obe zmeny a stack až do Shoptet súboru. |
| Automatický posun hlavného banneru | server HTML + Bootstrap carousel | `#carousel data-ride=carousel data-interval=9000`, runtime pause=hover/wrap=true. motion.json má rôzne hero src pred/po. Repo carousel-swipe pridáva swipe a preload, nie nový autoplay timer. |
| Automatický posun Luigi produktov | pozorované runtime nastavenie | `_carouselAutoPlay=0`, teda automatický posun tohto widgetu nebol v zachytenej konfigurácii zapnutý. Arrows/infinite/carousel existujú; nemožno to zamieňať s hero autoplay ani hover swapom. |

Zdrojové úryvky a offsety: source-excerpts.json. Celý verejný bootstrap je
luigi-bootstrap-observed.js, ide o pozorovanú externú konfiguráciu, nie návrh zmeny.
Kategórie používajú pri hoveri translateY(-2px), nie rotate; tvrdenie o ich
geometrickom otáčaní sa nepotvrdilo. Ak majiteľ myslí iný konkrétny pohyb,
nie je touto reprodukciou automaticky vysvetlený.

## Poradie obsahu

Server HTML (`source-structure.json`): bannery → benefitBanner → TOP Produkty →
Novinky v ponuke → Výsuvy MERIVOBOX → ďalší statický obsah. Kategórie ani nový
H1 nie sú serverová Shoptet sekcia; tvorí ich frontend. Luigi blok nie je
premenovaný natívny titul TOP Produktov.

Aktuálny render oboch plných kontextov:
„Vybrali sme pre Vás“ → H1 „Nábytkové kovanie a príslušenstvo“ →
„Najobľúbenejšie kategórie“ → TOP Produkty → Novinky → MERIVOBOX.
Kategórie: display=block, 12 položiek, približne Y2164 pri 1440px viewportu.
Bez Luigi: bez „Vybrali sme pre Vás“, kategórie display=block, približne Y1553.
Bez Timber: Luigi zostáva, ale repo kategórie/H1 nevzniknú.

`homepage-categories.reorderHomepage` vie presúvať Novinky/bannery/benefity,
ale vyžaduje súčasne titul „Akciový tovar“ a „Novinky v ponuke“. V aktuálnom
serverovom/renderovanom zozname titul „Akciový tovar“ chýba; táto vetva sa
pre daný zachytený stav neaktivuje. Nejde o dôkaz zmeny poradia v Shoptet admin.

## Porovnanie s doloženým starším stavom

Najnovšia nájdená lokálna archívna snímka s jasne zachyteným miestom kategórií:
`/workspace/audits/brand-v065/home-1440-stable.png` (archív 12. 10.). Je zachovaná
ako historical-v065-home-1440.png. Ukazuje kategórie hneď po banneroch, bez
odporúčacieho bloku pred nimi. Súčasný vlastníkov opis je s tým zhodný.

To je obrazový dôkaz rozdielu umiestnenia, nie úplný historický export externých
nastavení. Staršie testovacie prostredia blokovali Luigi. Preto z archívnej
absencie widgetu NEVYPLÝVA presný dátum jeho produkčného zapnutia ani zmena
vykonaná práve teraz. Sprístupnenie live.luigisbox.tech mohlo widget iba zviditeľniť
v našich nových testoch. Kompletný „posledný správny produkčný snapshot“ medzi
12.10 a dneškom so súčasne funkčným Luigi nemáme potvrdený.

Kategórie sa od migrácie 5.10 v repo module obsahovo nemenili. Záloha
shoptet/backup/2026-10-05/timber-kategorie-banner.js obsahuje rovnakých 12 položiek
a vkladanie pred prvý produktový titul. LEGACY.md dokumentuje migráciu.

H1 je staršia samostatná zmena: commit40612a1 ho pridal do preview; commit8d43017
z1.11 odstránil preview guard pri v0.7.6. OWNER-APPROVAL.md a tag-qa.json evidujú
schválený homepage H1 a jeho aktiváciu bez preview. To vysvetľuje zdroj a dátum
repo aktivácie, nepredstavuje dnešné schválenie jeho ďalšej úpravy.
PR68 nemenil audit-preview ani homepage-categories; nové Luigi CSS je ohraničené
na Search/Autocomplete, nie homepage Recommender. Vypnutie preview dnes preto
neodstráni H1 ani odporúčanie z produkcie.

## História AI/Mergado a hranice priradenia

Skontrolované dostupné vybrané chaty: „List Mergado MCP tools“, „Overiť prácu
v Mergade“ a release chat „Ideme pokracovat dalsimi udajmi TIMBERSTORE: Bude to dalsi…“.
Zhrnutie bez produktových/citlivých výstupov je v history-review.json.
Dostupné Mergado úlohy riešia exporty, mapovanie produktových kategórií a Pilot V2
texty, nie doloženú zmenu homepage slotu. To nie je kompletný audit všetkých
zásahov. K živému Mergado/Luigi admin audit logu v tejto session prístup nemáme.

**Potvrdený je technický zdroj widgetu a jeho polohy. Autor, čas publikácie a
pôvodný admin placement pred zmenou sú NEZNÁME.** Nepripisujeme ich Mergadu ani
konkrétnemu AI zásahu bez záznamu. Externý runtime je Luigi, čo samo neidentifikuje
človeka/proces, ktorý jeho konfiguráciu nastavil.

## Presný návrh obnovy — ZATIAĽ NEVYKONANÝ

1. Zachovať tieto dôkazy, export aktuálneho Luigi nastavenia a jeho audit log
   (verzia/publikácia/autor). Aktuálne verejné hodnoty: homepage_personalized,
   Type user_conversion_based, Size8, slovenský titul, insertion po benefitBanner.
   Hodnoty administrátorských polí neodhadovať podľa mien JS properties.
2. Pre obnovu vlastníkom opísaného miesta nechať pôvodný kategóriový modul,
   12 položiek a jeho anchor pred TOP Produkty. Kategórie netreba vytvoriť znovu.
3. Cez podporovanú konfiguráciu Luigi pripraviť izolovanú preview zmenu IBA
   homepage_personalized: nezobrazovať ho pred kategóriami. Ak cieľ je presná
   obnova archívneho layoutu bez tohto widgetu, deaktivovať iba túto homepage
   inštanciu. Ak ho chceme zachovať, zvoliť explicitný schválený slot až za
   kategóriami, nie súčasný fallback po benefitBanner. Search/Autocomplete,
   detailové a košíkové odporúčania tým nemeníme. Publikáciu musí predchádzať
   export pôvodných hodnôt a používateľské schválenie; v tejto session sa nerobí.
4. H1 riešiť oddelene: aktuálne ide o historicky schválenú zmenu v0.7.6.
   Presná obnova staršej homepage bez H1 by vyžadovala zúženú zmenu iba home
   vetvy audit-preview v NOVOM preview builde; nevracať celý modul/guard,
   čo by zasiahlo kontakty a články. Neodstraňovať H1 iba CSS a nevracať celý
   v0.7.6 na v0.7.5 kvôli umiestneniu externého widgetu.
5. Hover swap je natívna reakcia na triedu dodanú Luigi template. Ak je nechcený,
   pripraviť cez podporovaný vendor template vypnutie swap-images len v danej
   homepage inštancii; zachovať statický správny obrázok. Hero autoplay je
   samostatný Shoptet parameter9000ms; nemení sa spolu s Recommenderom.
6. Nový voľný preview build overiť až pre konkrétnu schválenú opravu; staré
   nemenné buildy/tagy neprepisovať. Pred/po testy bez spoločných cookies,
   1440/375px, jeden kategóriový blok, 12 pôvodných odkazov, kategórie pred TOP,
   správny plánovaný slot odporúčania, bez skrývania CSS a bez duplicitných
   nákupných/analytických handlerov. Opakovať po vyprázdnení aj naplnení last_seen.
7. Rollback repo preview: ?ts_preview=off →v0.7.6. Externá zmena placementu/
   template sa vracia samostatným obnovením presného exportu pôvodných nastavení.
   Samotný rollback buildu Luigi konfiguráciu NEVRÁTI.

Podľa poslednej priority „najprv zachovať, nič nemaž/nepreusporadúvaj“ ide teraz
o evidence-only zmenu PR. Žiadny opravný build alebo zmena externého nastavenia
sa ešte nepublikoval. Presná pôvodná homepage nemôže byť poctivo obnovená iba
repo CSS, keď zdroj jej posunutia žije v externom placement kontrakte.
