# Skutočné sklady: technický záver a pripojenie zdroja

19. 10. 2026, Europe/Bratislava. Pokračovanie v `preview/stock-by-warehouse-20261019` z `da9837d`. **Rozdelenie 2 + 193 zatiaľ nebolo načítané zo živého strojového zdroja. Riešenie nie je označené za dokončené.** Dizajn, ceny, košík, doručovacie pravidlá, produkčný loader a main sa nemenia. Nevytvárame novú skladovú evidenciu: Shoptet zostáva jediným zdrojom, prípadná serverová pamäť je len dočasná read-only cache.

## Opravené mapovanie a overené/neoverené údaje

| Skutočný názov podľa administrácie klienta | Verejný názov | Spracovanie |
| --- | --- | --- |
| Dolný Hričov | SKLADOM | prvý samostatný riadok |
| Centrálny sklad | CENTRÁLNY SKLAD | druhý samostatný riadok |
| TIMBER SKLAD | žiadny | ignorovať, nikdy nepripočítať |

`SKLAD-HRICOV` a `SKLAD-CSNK` neboli skutočné názvy. Sú odstránené z aktívneho mapovania; staršie reporty sú historické. Stabilné interné programové kľúče `hricov`/`csnk` ostávajú, aby sa nemusela prepisovať cache, kontrakt ani renderer.

Mapovanie sa vykonáva z dvojice **ID + skutočný názov v odpovedi zdroja**, nikdy z poradia. Ak je nastavené explicitné ID, musí stále súhlasiť s názvom. Agregát `ext`, duplicita, chýbajúci sklad, nesúlad názvu/ID alebo ID tretieho skladu sa odmietne. Poradie zdroja sa môže meniť. **Skutočné číselné ID troch skladov zatiaľ nie sú k dispozícii**; žiadne ID sa nevymyslelo ani nenastavilo do konfigurácie. Čísla v testoch sú výslovne modelové.

Klient overil v administrácii pre SKU 404394: Dolný Hričov 2 páry, Centrálny sklad 193 párov, TIMBER SKLAD 0, spolu 195, nároky 0. Je to referenčný stav od klienta, nie výsledok nášho HTTP načítania. Referencia je v `admin-reference.json` a **aplikácia ju nepoužíva ako dátový zdroj**. Skutočný stav sa odvtedy môže zmeniť. Predajná jednotka `pár` sa nemení na dva kusy; renderer len skloňuje `1 pár`, `2–4 páry`, `5+ párov`.

## A. Priamy frontend: konkrétny výsledok

Nový read-only GET:

```text
https://www.timberstore.sk/action/ProductStockAmount/?ids[]=331847
X-Shoptet-XHR: Shoptet_Coo7ai
```

Relevantná skutočná odpoveď:

```json
{
  "payload": {
    "products": {
      "331847": {
        "codes": {
          "404394": {"amount": "> 100", "stocks": {"ext": "> 100"}}
        }
      }
    },
    "stocks": {"ext": {"title": "Sklad", "isDeliveryPoint": 0}}
  }
}
```

Data Layer poskytuje takisto iba `quantity: "> 100"`, `stocks:[{id:"ext",quantity:"> 100"}]` a zoznam skladov obsahuje len `ext`. `getShoptetProductsList()[332123]` obsahuje identitu, cenu a `variant:null`, nie samostatné počty skladov. Overené boli aj frontendové objekty `stockAvailabilities`, `variantsData`, `variantsSimple`, `variantsSplit` a príslušná stock konfigurácia. Natívny JS používa presne uvedený stock endpoint a jeho payload. Nenašiel sa podporovaný zákaznícky zdroj s dvojicou 2/193 ani s ID pomenovaných skladov.

SKU 404394 má interné ID `331847`, GUID `e4f27f78-3daf-11f1-b943-bc241158b559`. Strieborná je samostatný produkt `232861`, biela `289124`; všetky tri hlásia `hasVariants:false`. Strieborná vracia 94/ext, biela 92/ext — tieto čísla neoznačujeme ako stav konkrétneho skladu. Pre skutočný variantový produkt ostáva potrebná reálna skúška po pripojení zdroja. Dôkazy sú v `current-native-response.json` a `current-public-objects.json`.

**Samotné odstránenie hranice 100 môže odkryť súčet 195, ale nevytvorí dva chýbajúce údaje.** Rozklad súčtu, odhad alebo použitie referencie ako odpovede by boli nepresné. Shoptet podporu je možné požiadať, aby pre Apollo a tieto dva neodberné sklady potvrdila podporovaný spôsob vystavenia pomenovaných počtov a ID v zákazníckom rozhraní. Nemáme potvrdenie, že na to existuje jednoduché nastavenie. Dodávateľský sklad sa kvôli dátam nesmie naslepo meniť na odberné miesto; ovplyvnilo by to reálne objednávanie.

## B. Export: oficiálna možnosť bez privátneho API

[Shoptet Viac skladov](https://podpora.shoptet.sk/viac-skladov/) výslovne uvádza samostatné množstvá v produktových exportoch. [Tabuľka stĺpcov](https://podpora.shoptet.sk/import-produktov/) definuje `code`, `unit` a `stock:<názov skladu>`. To je podporovaný formát, ale ešte nie dôkaz o skutočnom exporte tohto účtu.

Pre najmenší bezpečný vstup volíme **vlastný CSV export** s potrebnými poliami. [Oficiálny Data export](https://developers.shoptet.com/shoptet-tools/data-export/) uvádza XLSX, CSV a XML, ale vlastný výber polí nie je dostupný pre XML. Úplný XML môže obsahovať ďalšie obchodné údaje; jeho konkrétnu štruktúru pre tri sklady a rezervácie sme bez skutočného súboru neoverili. Reklamný XML s jediným STOCK_AMOUNT nestačí. Nevymýšľame XML parser podľa nevideného exportu.

Pripravený CSV adaptér vracia len presné dva počty a jednotku pre požadované verejné SKU. Ignoruje ďalšie stĺpce, nepoužíva súčtový `stock`, nezlučuje TIMBER SKLAD. Pre CSV sú identifikátorom skladu presné hlavičky obsahujúce skutočný názov; **nejde o číselné stock ID**. Nemusíme ich vyrábať. Ak export poskytne aj GUID, preverí sa; inak sa páruje podľa globálne jedinečného SKU. Nejednoznačné SKU alebo chýbajúci počet nie je nula.

### Presné nastavenie v Shoptete

1. **Produkty → Export → Export → Vytvoriť vlastný typ exportu.** Názov napr. `TimberStore dostupnosť preview`. Vybrať údaje s technickými hlavičkami:
   - `code`, `unit`, `productVisibility`, `variantVisibility`;
   - `stock:Dolný Hričov`, `stock:Centrálny sklad`.
2. Vybrať CSV, ideálne UTF-8. Nepridávať nákupné ceny, marže, dodávateľov, zákazníkov ani objednávky. Voliteľný `guid` umožní dodatočnú kontrolu. Pri názve východiskového skladu môže byť oficiálny príznak `(predvolené)`; jeho skutočnú hlavičku možno nastaviť v konfigurácii. Iný sklad nemožno premenovať na Hričov len pomocou konfiguračného stĺpca.
3. Najprv stiahnuť súkromnú vzorku vrátane SKU 404394, 232861, 289124. Porovnať riadok 404394 s **aktuálnym** stavom administrácie a jednotkou pár. Následne overiť aspoň jednu položku s nenulovým skladovým nárokom: export musí obsahovať voľný **Stav skladu**, nie fyzický **Reálny stav**. Rezervácie sa nesmú odpočítať dvakrát. Zdroj: [Skladové hospodárstvo](https://podpora.shoptet.sk/skladove-hospodarstvo/).
4. Pre automatizáciu použiť **Produkty → Export → Export cez URL**, vybrať tento CSV typ a samostatný partnerský prístup. Jeho nastavenie: **Nastavenia → Administrácia → Zabezpečenie exportov**. Ak zatiaľ nie je aktívny žiadny partner, **prvá aktivácia zneplatní staré exportné URL** — najprv preveriť Mergado/účtovníctvo. Je to konkrétne zdokumentovaný dopad, nie krok vykonaný týmto preview. Alternatívou je obmedzenie exportu na pevnú IP služby. [Postup a dopady](https://podpora.shoptet.sk/zabezpecenie-exportov/).
5. Zabezpečenú URL uložiť výlučne do serverového secretu `SHOPTET_EXPORT_URL`. Nikdy do chatu, GitHubu, CDN ani `TIMBER_STOCK_ENDPOINT`. Surový export sa nezverejňuje a neimportuje späť do Shoptetu.

Ak CSV neobsahuje očakávané viditeľnosti alebo hlavičky, treba najprv overiť skutočnú vzorku a upraviť podporované mapovanie; prázdne hodnoty sa z bezpečnostných dôvodov neodhadujú.

### Zapojenie existujúceho backendu

Nevytvára sa skladový systém ani zápisová synchronizácia. K existujúcemu serveru bol pridaný druhý **read-only zdroj**. Rovnaký batch endpoint, klientská cache, variantové mapovanie a fallback zostávajú.

- Súkromná služba Node 22+ (môže bežať na existujúcom hostingu; nový fyzický server nie je nutný).
- `STOCK_SOURCE=export`, tajná `SHOPTET_EXPORT_URL`; príklad premenných je v `backend/warehouse-stock/.env.example`.
- `SHOPTET_EXPORT_VERIFIED=0` a prázdny `SHOPTET_EXPORT_AMOUNT_MODE` ponechať do porovnania reálnych dát/rezervácií. Až potom `1` a `available`. Žiadne API oprávnenie ani API token sa pri exportnej ceste nepoužíva.
- Jeden export na inštanciu každých 300 sekúnd, nastaviteľne 60–300 sekúnd po zmeraní záťaže; nejde o jeden export pri každom zobrazení produktu. Neškálovať na viac nezávislých inštancií bez spoločného zámku/cache. Limit 32 MiB, 50 000 riadkov, GET-only na domény tohto e-shopu, zákaz presmerovaní, timeout 20 s, bezpečné chybové správy bez tajnej URL.
- Pozorovaný čas sa pri cache hite nemení. Exportný snapshot je platný najviac 10 minút; browserová odpoveď najviac 30 s alebo zvyšok platnosti snapshotu. Staré dáta sa po expirácii skryjú. HTTP Age sa započítava. Cache/generovanie na strane Shoptetu a import pred zápisom môžu pridať oneskorenie, ktoré musíme zmerať na skutočnom zdroji. Nejde o real-time zobrazenie.
- Pri zdravom chode: približne interval exportu + čas jeho vytvorenia/stiahnutia + do 30 s na browserovú obnovu. Po výpadku sa posledný snapshot môže použiť len po pôvodnú 10-minútovú hranicu. HTTPS, TLS, limit požiadaviek a úložisko secretu patria hostingu. Prevádzku nemožno spustiť v tomto prostredí bez jeho pripojenia.

Súkromné overenie po vložení reálnej URL do serverového env súboru:

```sh
node --env-file=/secure/stock.env backend/warehouse-stock/probe-export.js --remote
```

Prípadne offline vzorka: `node backend/warehouse-stock/probe-export.js /private/sample.csv`. Voliteľná premenná `SHOPTET_EXPORT_REFERENCE_FILE` môže ukazovať na `docs/previews/warehouse-stock-20261019/admin-reference.json`; diagnostika porovná skutočne načítané čísla s referenciou, nikdy ju nepoužije ako odpoveď. Po zmenách zásob treba referenciu znovu potvrdiť v administrácii.

Spustenie: `node --env-file=/secure/stock.env backend/warehouse-stock/server.js`. Interný bind je predvolene `127.0.0.1:8787`. Health rozlišuje `export-ready`, chýbajúce overenie a chybu. Verejná trasa `POST /v1/warehouse-stock/batch` vracia iba normalizované počty pre explicitne verejné produkty/varianty. Údaje obmedzené na registrovaných sa nezverejňujú; CORS nie je autentifikácia. Celý katalóg ani tajná URL sa neposielajú do prehliadača.

Až po reálnom overení nastaviť **verejný HTTPS endpoint služby** do `TIMBER_STOCK_ENDPOINT` pri preview builde. Tento commit nemá taký endpoint, žiadny export nestiahol a nezapína vymyslené hodnoty.

## C. Porovnanie a odporúčanie

| Cesta | Presnosť / odozva | Náklady a údržba | Aktuálny záver |
| --- | --- | --- | --- |
| A. natívny frontend | ideálna, ak Shoptet poskytne skutočné samostatné údaje | najjednoduchšie, žiadny pomocný server | súčasná odpoveď obsahuje len ext a >100; nemožno teraz použiť |
| B. zabezpečený CSV export | presné hodnoty v čase exportu, definované oneskorenie | bez požiadavky na Premium; malá HTTPS služba a kontrola exportu | najjednoduchšia pripravená alternatíva pre Enterprise; treba reálny export/hosting a validáciu |
| C. API cez schválený doplnok alebo Premium | perStockAmounts a claim, kratšia cache a prípadné webhooky | oprávnenia, poskytovateľ/OAuth obnova alebo Premium; ceny podľa ponuky | technicky podporované, ale dnes nemáme taký prístup; Premium nie je automatické odporúčanie |

Konkrétna cena hostingu/doplnku nebola zistená a nič nebolo objednané. Existujúci vhodný hosting môže ďalší server odstrániť z nákladov; dostupný hosting tu nebol pripojený. Privátna exportná URL, testy rezervácií a monitoring zostávajú nevyhnutné aj pri lacnom riešení. Enterprise podľa dokumentácie obsahuje Skladové hospodárstvo; účtové doplnky/zabezpečenie exportov treba potvrdiť v administrácii, nie predpokladať.

**Najprv má zmysel vyžiadať od Shoptetu potvrdenie priameho pomenovaného stock výstupu pre Apollo.** Ak ho vedia podporovane sprístupniť, využijeme hotový natívny adaptér bez služby. Ak nie, CSV je pripravené ako voliteľný dátový prenos z tej istej evidencie, bez kúpy Premium.

## Overenie a hranica dokončenia

Automatické testy používajú modelové hodnoty označené TEST, nikdy sa neservujú do preview. Pokrývajú zmenené mapovanie, zámenu ID/názvu, poradie a tretí sklad s nenulovou zásobou, neznáme/cenzurované množstvá, CSV quoting/BOM a desatinné čiarky, viditeľnosť, 16 000 SKU jedným načítaním, expirácie, výpadky a unit/variant kontrakt. Browser testy zdrojov API/export-cache overujú existujúci DOM, páry, GRID/LIST, rýchle prepínanie a responzivitu. Podrobnosti sú vo výsledkoch tohto commitu.

**Chýba skutočný zdroj s rozdelením 2 + 193, skutočné ID skladov a aktivované pripojenie.** Od klienta potrebujeme buď podporovaný natívny výstup potvrdený Shoptetom, alebo bezpečne sprístupnený skutočný export a hosting. Stačí najprv súkromná malá CSV vzorka s hlavičkou a danými SKU, bez tajnej URL a ďalších obchodných údajov. To umožní overiť formát a referenciu, ale až automatický zdroj dokončí dynamické napojenie. Hodnoty z administrácie sa nedajú preniesť do live odpovede samotným JavaScriptom, ak ich Shoptet zákazníckemu rozhraniu neposiela.

### Pripravený text otázky pre podporu Shoptetu (neodoslaný)

> Projekt 765909, Enterprise, Apollo. V administrácii máme samostatné sklady Dolný Hričov, Centrálny sklad a TIMBER SKLAD. Potrebujeme zákazníkom zobraziť iba prvé dva sklady s ich predajnými počtami po rezerváciách. Natívny `/action/ProductStockAmount/?ids[]=331847` a Data Layer pri SKU 404394 vracajú iba agregát `ext` a limit `>100`, hoci administrácia pri overení uvádzala 2 + 193 + 0. Existuje podporované nastavenie alebo frontendové rozhranie, ktoré v Apollo sprístupní skutočné ID, názov a samostatný počet týchto skladov bez zmeny dodávateľského skladu na odberné miesto? Ak nie, prosíme potvrdiť exportné polia `stock:Dolný Hričov` / `stock:Centrálny sklad`, význam počtov voči nárokom a interval/cache generovania zabezpečeného produktového CSV exportu.
