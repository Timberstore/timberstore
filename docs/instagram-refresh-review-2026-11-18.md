# Instagram galéria — doplňujúca kontrola 18. 11. 2026

## Výsledok

Samotná frekvencia nie je preukázanou príčinou HTTP 403. Aktívny plán na `main`
je `17 */6 * * *`, teda štyri plánované behy denne. Bežný beh stiahne jednu HTML
stránku e-shopu; nestiahne Instagram priamo a nesťahuje každú fotografiu zvlášť.
Testy sieťové odpovede simulujú, nevytvárajú ďalšie požiadavky na e-shop.
Všetkých päť zistených neúspešných behov prišlo po odstupe viac ako osem hodín od
predchádzajúceho behu. Nižšia frekvencia obmedzí požiadavky, nezaručí odstránenie
pravidla, ktoré požiadavky odmieta. Zdieľaný limit IP adresy sa tým nevylučuje.

Podstatné prevádzkové zistenie: **PR #72 je od 12. novembra otvorený a nebol
zlúčený do `main`. Denný plán a vyhodnotenie opakovaných chýb preto nie sú aktívne.**
Samotné úspešné testy PR nezapínajú jeho plán. GitHub spúšťa plánované úlohy z
predvolenej vetvy, čo potvrdzuje aj
[oficiálna dokumentácia](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule).

Odporúčanie: použiť už pripravený a opätovne skontrolovaný PR #72 ako okamžité
zlepšenie prevádzky; súčasne neoznačovať tolerovanie výpadku za úspešné získanie
nových dát. Definitívne vysvetlenie odmietnutí vyžaduje serverové záznamy Shoptetu.
Trvalá náhrada čítania HTML má byť podporovaný feed Shoptetu alebo autorizovaný
producent cez oficiálne Instagram API so statickou galériou.

## Overené dôkazy

Prejdená bola história 86 behov s názvom Instagram refresh a úplné logy 29 behov
od 6. novembra. Z týchto 29 bol jeden PR iba s testami; 28 bolo plánovaných
produkčných behov, z ktorých 23 uspelo a päť skončilo na HTTP 403. Súhrn bez
tokenov a celých logov je v
[CSV](fixes/instagram-refresh/runs-2026-11-18.csv).

| Beh | Začiatok UTC | Výsledok | Odstup od predchádzajúceho behu | Prostredie |
| --- | --- | --- | --- | --- |
| [60](https://github.com/Timberstore/timberstore/actions/runs/42345753595) | 7. 11. 06:09 | HTTP 403 | 10 h 40 min | Azure westus |
| [63](https://github.com/Timberstore/timberstore/actions/runs/42453947547) | 8. 11. 06:14 | HTTP 403 | 8 h 18 min | Azure centralus |
| [72](https://github.com/Timberstore/timberstore/actions/runs/43174706533) | 12. 11. 07:21 | HTTP 403 | 11 h 41 min | Azure westus2 |
| [85](https://github.com/Timberstore/timberstore/actions/runs/44043521230) | 17. 11. 08:03 | HTTP 200, 16 príspevkov, bez zmeny | 9 h 48 min | Azure westus |
| [86](https://github.com/Timberstore/timberstore/actions/runs/44175450604) | 17. 11. 21:01 | HTTP 403 | 12 h 58 min | AWS us-east-1 |
| [87](https://github.com/Timberstore/timberstore/actions/runs/44260585533) | 18. 11. 07:39 | HTTP 403 | 10 h 38 min | AWS us-west-2 |

Posledné tri uvedené behy mali rovnaký commit `3c82de3`. AWS má aj úspešný beh
[79](https://github.com/Timberstore/timberstore/actions/runs/43625425488) zo
14. novembra; Azure má tiež odmietnutia. Vzorka preto nepreukazuje blokovanie
jedného poskytovateľa cloudu. Výmena runnera alebo opakované spúšťanie s cieľom
získať inú IP adresu nie sú navrhnutým riešením.

GitHub výslovne opisuje dynamické IP adresy zo zdieľanej infraštruktúry a vplyv
reputácie ostatných používateľov na blokovanie
([dokumentácia](https://docs.github.com/en/actions/how-tos/troubleshoot-workflows#runner-ip-addresses-flagged-by-security-scanners)).
Jeho [referencia runnerov](https://docs.github.com/en/actions/reference/runners/github-hosted-runners#ip-addresses)
tiež potvrdzuje použitie viacerých cloudov. Shoptet dokumentuje dočasné geografické
blokovanie počas útokov
([ochrana a Cloudflare](https://podpora.shoptet.sk/cloudflare/)). Sú to možné
mechanizmy, nie dôkaz, ktorý z nich spôsobil odmietnutie Timberstore. Z logov
nie je známy názov vrstvy, pravidlo, odchádzajúca IP adresa ani korelačný identifikátor.

Chyba 403 sama neurčuje limit požiadaviek. Ani neprítomnosť chyby 429 nedokazuje,
že žiadny ochranný limit neexistuje. Časové odstupy a počet požiadaviek iba
nepodporujú vysvetlenie, že túto automatizáciu blokuje jej vlastná vysoká frekvencia.

## Kontrola administrácie Shoptetu

Pri kontrole 18. novembra bolo zobrazené:

- Prepojenie → Sociálne siete → Instagram: účet `timberstore.sk` je pripojený,
  nastavené sú štyri stĺpce a štyri riadky fotografií.
- Nastavenia → Zákazníci → Blokovanie IP adries: žiadne záznamy.
- Vzhľad a obsah → Cookies: Facebook/Instagram widget sa spúšťa po súhlase
  používateľa.

Pripojený účet v administrácii sám osebe nepotvrdzuje aktuálnosť každého nového
príspevku na Instagrame. Nebolo použité tlačidlo Obnoviť ani odpojenie/opätovné
pripojenie účtu. Nastavenia, počty obrázkov a súhlasy sa nemenili.

Verejná JSON záloha má poslednú zmenu obsahu 13. novembra; úspešný beh 85
overil zdroj 17. novembra a nenašiel zmenu. `updatedAt` preto nemožno použiť ako
čas poslednej úspešnej kontroly. Prvá kontrola 18. novembra overila dostupnosť
všetkých 16 uložených obrázkov. Táto opätovná kontrola nepovažuje samotnú
validáciu URL za test aktuálnej dostupnosti obrázkov ani za porovnanie s novými
príspevkami v účte Instagram.

## Konkrétne riešenie pripravené v PR #72

| Situácia | Správanie návrhu |
| --- | --- |
| Bežná automatizácia | Jeden beh denne o 03:00 Europe/Bratislava, so zohľadnením letného času |
| Úspešné načítanie | Overiť dáta; publikovať len skutočnú zmenu obsahu |
| Jedno odmietnutie 403 po úspešnej kontrole za posledných 48 hodín | Jedna požiadavka bez opakovania, ponechať galériu, uviesť upozornenie a súhrn |
| Druhé odmietnutie po sebe alebo chýbajúca nedávna úspešná kontrola | Zlyhaný beh a bežné GitHub upozornenie |
| Chybná galéria, programová chyba alebo neoveriteľný stav monitorovania | Zlyhať okamžite |

Tento návrh zachováva automatické získavanie nových príspevkov a zobrazenie
existujúcej galérie aj pri dočasnom výpadku. Samotný web sa pri chybe nemaže.
Zelený beh po tolerovanom odmietnutí výslovne neznamená aktualizovaný zdroj;
samostatné značky krokov uchovávajú skutočný výsledok získavania dát.

Denný interval znamená, že nový príspevok sa v zálohe môže objaviť až pri ďalšom
dennom behu a neskôr pri oneskorení GitHubu. Pri opakovaných odmietnutiach môže
byť oneskorenie dlhšie. Návrh nemá nezávislý alarm pre prípad, keď GitHub úlohu
vôbec nespustí. Nastavenia e-mailových upozornení GitHubu sa nemenia.

Syntax `timezone: Europe/Bratislava` bola opätovne overená v
[oficiálnej dokumentácii workflow](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#onschedule).

## Trvalé možnosti

| Možnosť | Prínos a potrebné kroky |
| --- | --- |
| Podporovaný feed Shoptetu s existujúcimi CDN obrázkami | Najmenej zmien; Shoptet musí potvrdiť dostupný formát, autorizáciu a interval. V preskúmanom verejnom katalógu API nebol nájdený Instagram export. |
| Pravidelný producent s pevnou, výslovne povolenou IP adresou | Zachová existujúci čítač. Najprv potvrdiť a povoliť prístup so Shoptetom; samotná pevná IP odstránenie blokovania nezaručuje. Repo obsahuje iba prázdnu kostru servera, nie overené funkčné nasadenie. |
| Oficiálne Instagram API → statické obrázky a JSON | Odstráni závislosť od sťahovania homepage. Vyžaduje autorizáciu firemného/tvorcovského účtu, bezpečnú obnovu tokenu, schválené umiestnenie obrázkov a úzku úpravu povolených URL galérie. |

Oficiálne [Instagram API s Instagram Login](https://developers.facebook.com/documentation/instagram-platform/instagram-api-with-instagram-login)
podporuje profesionálne účty a nevyžaduje prepojenú Facebook stránku. Pre čítanie
médií má byť použitý potrebný základný rozsah bez práv na publikovanie, správy či
komentáre. [Dokumentácia prihlásenia](https://developers.facebook.com/documentation/instagram-platform/instagram-api-with-instagram-login/business-login)
opisuje 60-dňový token a jeho automatickú obnovu pred vypršaním.
[Referencia médií](https://developers.facebook.com/documentation/instagram-platform/reference/instagram-media)
poskytuje permalink, obrázok alebo náhľad. Obrázky sa musia publikovať na
schválené statické úložisko; aktuálny frontend zámerne prijíma len konkrétny
Shoptet CDN adresár. Takáto migrácia nie je iba výmenou jednej URL v skripte.

Dokumentácia dkLAB [Instagram Widget+](https://www.dklab.cz/instagram-widget)
potvrdzuje použitie natívneho prepojenia Shoptetu. Nákup samotnej úpravy vzhľadu
widgetu nie je doloženým riešením serverového odmietania dnešného čítača.

## Text pre Shoptet — pripravený, neodoslaný

> Dobrý deň, prosíme preveriť občasné HTTP 403 pri jednej serverovej GET
> požiadavke na `https://www.timberstore.sk/?ts_feed=1`. Ide o vlastnú automatickú
> aktualizáciu galérie, ktorá číta natívne Instagram odkazy a Shoptet CDN obrázky.
> Použitý User-Agent je `TimberStore-gallery-refresh/1.0`.
>
> Najnovšie odmietnutia nastali 17. 11. 2026 o 21:01:52 UTC (22:01:52 slovenského
> času) a 18. 11. o 07:39:42 UTC (08:39:42 slovenského času). Medzi požiadavkami
> bol odstup viac ako desať hodín. Rovnaký kód úspešne načítal dáta 17. 11.
> o 08:03:52 UTC. Zoznam ručne blokovaných IP adries v administrácii je prázdny.
>
> Prosíme určiť vrstvu a pravidlo, ktoré tieto požiadavky odmietli: reputácia/IP,
> dočasný geoblock, frekvenčný limit alebo iný dôvod. Ak treba, ďalší beh zaznamená
> dostupný korelačný identifikátor požiadavky. Je možné nastaviť úzko vymedzený,
> podporovaný prístup pre náš čítač, prípadne poskytujete serverový JSON/API/export
> galérie vrátane permalinkov, poradia a CDN obrázkov? Nežiadame vypnutie ochrany
> celého e-shopu. Prosíme odporúčaný interval a spôsob autorizácie.

## Stav overenia a nasadenia

- Preskúmaný návrh: `c4082351edf2472cc55f0d44afad993640705254` v PR #72.
- Opätovne spustených 26 testov získavania dát a monitorovania: všetky prešli.
- `--check` overil 16 uložených príspevkov; ide o offline kontrolu ich štruktúry.
- GitHub označil existujúci PR ako zlúčiteľný bez konfliktov; existujúci PR test
  má výsledok success a získavanie zdroja na PR je správne skipped.
- Samostatná zmena dát na `main` po vytvorení PR musí zostať zachovaná pri zlúčení;
  lokálna skúška zlúčenia do `3c82de3` prešla bez konfliktov. V zlúčenom stave
  znovu prešlo 26 testov a validácia 16 príspevkov. `data/instagram.json`,
  frontend, zostavené súbory a loader zostali bez rozdielu oproti aktuálnemu `main`.
- Prehranie skutočnej histórie cez monitorovací kód dalo očakávaný výsledok:
  beh 86 by bol upozornenie po úspešnom behu 85; beh 87 by už bol opakovaná chyba.
- Výskum nevytvoril nové oprávnenia pre Meta, nenakúpil doplnok a neposlal správu.
- Produkčný plán sa zmení až po zlúčení PR. Nižšia frekvencia a obmedzenie
  upozornení sú zlepšenie odolnosti, nie preukázané odstránenie príčiny HTTP 403.
