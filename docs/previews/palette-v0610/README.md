# v0.6.10 — kráľovská modrá a mobilný footer (preview, nevydané)

Baseline: `bf464db` / schválená produkčná v0.6.9. Vetva: `feature/royal-blue-footer-v0610`.
Produkčný loader ostáva v0.6.9. Bez merge, tagu, release a produkčného nasadenia.

**Stav:** implementácia a lokálne funkčné overenie dokončené. Klient 14. 10. 2026 schválil CSS limit 20,5 kB gzip iba pre preview 0.6.10. Lint a build prešli: CSS 20,32 / 20,5 kB, JS 22,32 / 30 kB. Samostatný preview commit; žiadny merge, tag ani produkčné nasadenie.

## Paleta a zdroj RAL

| Použitie | v0.6.9 | Preview 0.6.10 |
|---|---|---|
| Firemná oranžová | #D4884A | #D4884A — bez zmeny |
| Pôvodný oranžový hover / aktívny odtieň | #B8692E / #C97A2B | Bez zmeny |
| Pozitívny akcent, aktívne kroky a otvorená podpora | #439D29 | #225B99 |
| Hlavné checkout CTA | #3A841F | #225B99 |
| Menšie pozitívne texty | #31771C | #225B99 |
| Natívna inline dostupnosť | #2E7D32 (HTML) | #225B99 cez existujúci presný CSS selektor; HTML sa neprepisuje |
| Pozadie úspešných hlášok a vybratého mobilného rádia | #E8F5ED | #EDF3F9 — jemný modrý podklad |
| Dotknuté béžové panely | #F5F0E9 / #F9F4ED / #FFF8F1 | #D7D5CB — digitálna aproximácia RAL 9002 |
| Sekundárny text na novom RAL podklade | #666878 | #535560 iba v príslušných paneloch |
| Modré CTA hover / pressed / disabled | zelená s brightness / opacity | #1D4E83 / #183F6B / #4374A8 |

Jeden základný sekundárny token `--ts-accent-secondary: #225b99`; sémantické pozitívne tokeny sa naň odkazujú. Tri ďalšie modré odtiene sú výlučne pre interakčné stavy. Starý návrh RAL Design 180 90 05 nebol použitý.

**Overený digitálny zdroj RAL 9002:** [rs-colors-ral.lisp, riadok 258](https://github.com/ralph-schleicher/rs-colors/blob/eb87dc4436be9b0a7b16dfc617d73dc5e180ae7e/dictionaries/rs-colors-ral.lisp#L258), definícia `#XD7D5CB ral-9002 ... greywhite`. Riadky 36–38 uvádzajú pôvod sRGB hodnôt z farebných vzoriek ral-farben.de. Ide o sekundárnu tabuľku s uvedeným pôvodom, nie o tvrdenie o aktuálnej oficiálnej HEX norme RAL. Priame načítanie ral-farben.de a ralcolorchart.com blokovala sieťová politika; údaj bol overený v uvedenej verejnej tabuľke cez GitHub. Digitálna aproximácia nezaručuje zhodu s fyzickou vzorkou na každom displeji.

## Audit zelených výskytov a výnimiek

Úplný zoznam nájdených vlastných zdrojových deklarácií a spotrebiteľov s cestami/riadkami: [green-audit.json](green-audit.json). Osobitný inventár natívnych Apollo pravidiel: [native-green-inventory.json](native-green-inventory.json).

- Tri aktívne zelené HEX deklarácie boli iba v `tokens.css`; zelené pozadie úspechu bolo štvrtým aktívnym tokenom. Vlastný JS nevkladá zelené inline HEX štýly. Zmena tokenov pokrýva všetky ich spotreby bez nového globálneho prepisovania farieb cez JS.
- CTA Pokračovať/Objednať, aktívne kroky vrátane hoveru, kruhy rádií, checkbox checkmark border, úspešné ikony/hlášky, skladové texty, bezplatné ceny, doručovací akcent, ceny rekapitulácie dopravy a stavové bodky zdieľajú modrý akcent. Biely právny podtext zostáva na priehľadnom pozadí; biele číslice krokov sú zachované.
- Existujúce natívne inline `#2E7D32` v dostupnosti je zdrojový selektor, nie ponechaná vlastná zelená deklarácia. Cielený override platí už pri parsovaní HTML aj po AJAX. Cart availability zostáva pod natívnym textom a existujúcou triedou `ts-checkout-in-stock`.
- Zelené #2E9C42 v `src/legacy/list-view/list-view.css` je iba archív, ktorý sa neimportuje do main.css; nemenil sa a vo finálnom CSS nebeží.
- Ikona nákladného auta pri doprave zdarma mala natívny hardcoded #66BF3A na pseudo-elemente rodiča display:contents; pri vizuálnej kontrole bola doplnená cielená oprava v existujúcom cart CSS. Plný progress dopravy zdarma používa pozitívny token/modrú; čiastočný progress, jeho oranžový vrchný pás a iné pôvodne oranžové prvky zostávajú oranžové. Červené chyby/odstránenie a zatvorená podpora zostávajú bez zmeny. Brand logá, fotografie a cudzie embed komponenty sa nepremaľujú.
- Rozsah výnimiek: natívna cookie consent paleta (#007C47), bezpečnostná vstupná brána, darčekové/výpredajové štítky, express-checkout, potvrdenie po odoslaní a cudzie doplnky majú aj vlastné hardcoded zelené mimo doterajších vlastných tokenov. Sú uvedené v osobitnom inventári a v tejto izolovanej dávke sa plošne neprepisujú. Nepovažujú sa za overené modré komponenty; modrý návrh pokrýva vlastné pozitívne stavy a konkrétne požadované miesta košíka/checkoutu. Ak sa má modrá rozšíriť aj do týchto pôvodne neupravovaných komponentov, ide o ďalší jasne oddelený rozsah, nie o skrytý globálny RGB prepis.
- Existujúce oceľové modré odtiene cien/odznakov a informačný podklad sa nemenia, pretože nejde o pôvodnú zelenú. Tmavý súhrnný nadpis z aktuálnej 0.6.9 sa nemení na nový farebný nadpis.
- Modrá môže pri pozitívnych stavoch pôsobiť viac ako značka/informácia než univerzálny signál úspechu. Preto zostávajú texty SKLADOM/ZADARMO, natívne fajky a prístupné označenie otvorenej podpory. Preview zámerne ukazuje požadovanú náhradu zelenej; význam sa neopiera iba o farbu.

## RAL podklady a hranice zásahu

Nový panelový token je aplikovaný v pôvodných zdrojových pravidlách súhrnu košíka, oboch neskorších súhrnných skupín, súhlasov/spodku panelu, rekapitulácií dopravy/platby, mini-košíkovej informácie o doprave, sidebarovej navigácie a vnútorného SME TU PRE VÁS.

Globálny `--ts-color-service-bg` sa nemení, pretože zdieľa aj hornú lištu, account/login a quantity tlačidlá. Biele polia a karty, malé count badge, oddeľovače, oranžové hover podklady a neutrálne technické plochy ostávajú pôvodné. Horný checkout kontaktný bar si zachováva farby povrchu a celé rozloženie; mení sa iba pôvodne zelená otvorená stavová bodka podľa novej sekundárnej palety.

Na tmavšom RAL podklade má pôvodná sekundárna #666878 len 3,74:1. V paneloch sa preto lokálne používa #535560 (5,03:1). Iné časti webu týmto stmavením nie sú dotknuté.

## Mobilný footer

Overený DOM: `#footer .custom-footer__contact .contact-box`, samostatný kontaktný ul a `.contact-box-icon-list` s `.facebook`/`.instagram`. Všetky natívne odkazy a ich URL zostali rovnaké.

Pod 768 px sú telefón/e-mail/hodiny v 28 px riadkoch s 10 px medzerami, 24 px ikonovým stĺpcom a 12 px medzerou k textu. Sociálne odkazy majú rovnocenné 36×36 px plochy, 28 px pôvodné Apollo glyphy a 12 px rozostup. Pseudoikony sú v normálnom grid flow namiesto absolútneho vertikálneho posúvania.

Živý footer hodiny pôvodne nemal. Dopĺňa sa iba mobilný riadok použitím existujúceho addHours/updateHours/isBusinessOpen a rovnakého timeru. Pri desktope sa vlastný riadok a trieda odstránia, bez presunu natívnych odkazov. Žiadna samostatná logika hodín ani nové listenery/timery. Vlastný CSS footer fix sa nedotýka horných kontaktov.

Pri 390 px má kontaktná časť rovnakú šírku 350 px; výška sa zmenila z 201,98 na 212 px vrátane doplnených hodín. Desktopový kontaktný blok zostal presne 214,5 × 206,98 px.

## Oprava chýbajúceho loading.gif

Apollo CSS odkazuje na neexistujúci `assets/img/colorbox/loading.gif`. Existujúci `#cboxLoadingGraphic` dostal lokálny CSS kruhový indikátor s pôvodnou Timber oranžovou. Natívny Colorbox stále riadi jeho zobrazenie/skrytie. Žiadny externý obrázok, nový JS timer ani zásah do galérie/košíka; reduced-motion vypne animáciu.

Pri otvorení galérie/add-to-cart nebol zaznamenaný žiadny request na loading.gif ani HTTP chyba.

## Kontrast

| Kombinácia | Pomer |
|---|---:|
| Biely text / #225B99 | 6,94:1 |
| Biely text / hover #1D4E83 | 8,50:1 |
| Biely text / pressed #183F6B | 10,70:1 |
| Biely text / disabled #4374A8 | 4,88:1 |
| #225B99 / RAL #D7D5CB | 4,72:1 |
| #225B99 / tint #EDF3F9 | 6,21:1 |
| #535560 / RAL #D7D5CB | 5,03:1 |

Pôvodná #D4884A s bielym malým textom má 2,83:1. Túto existujúcu výnimku nemožno vylepšiť zmenou oranžovej bez porušenia zadania, preto oranžové CTA/menu/ikony a pôvodné stavy neboli prefarbené. Nové modré CTA vrátane 12 px právneho dodatku spĺňajú 4,5:1.

## Overenie a limity

Lokálne finálne dist boli načítané na živom Apollo DOM cez testovací browser route; tieto funkčné testy používajú lokálne zostavenie. Publikované preview používa rovnaké dist súbory cez commit hash.

- Desktop 1366 px: homepage/footer, kategória/sidebar, AJAX radenie, detail, natívne pridanie, košík, množstvo AJAX, refresh, doprava/platba AJAX a osobné údaje.
- Mobil 390 px: rovnaký nákupný priechod; navyše otvorenie galérie bez GIF requestu, footer pri 320/375/390/414 a spätný resize na desktop/mobil bez duplicitných hodín.
- V testovaných vlastných HTML komponentoch nebola po načítaní/AJAX/refreshi nájdená stará zelená vo foreground/background/border. Doplnková vizuálna kontrola zachytila natívny free-delivery pseudo-element mimo bežných bounding boxov a ten bol opravený osobitne. Fotografie a brand SVG/image assets sa týmto skenom nepremaľujú ani nezaručujú.
- Aktívne kroky sú modré s bielymi číslicami vo všetkých troch krokoch; pôvodné formuláre a ceny zostali natívne. Finálny submit stále patrí `order-form`; nebol stlačený.
- Pred a po oneskorenom window.load sú farby a rozmery checkout cenového panela zhodné; práve jedna vlastná súhrnná skupina. Nevznikol nový page loader, časovač ani skrývanie komponentov.
- Koncové computed stavy default/hover/focus/pressed/disabled finálneho CTA prešli, vrátane bieleho priehľadného dodatku. Pri CDP pseudo-state teste bol iba v testovacom prehliadači dočasne vypnutý prechod, aby sa čítal koncový stav namiesto prvého animačného snímku; aplikácia používa svoj pôvodný krátky prechod.
- Automatizovaný mobile tap acknowledgement v cloud Chromium je nespoľahlivý; natívna aktivácia label.click a následný Shoptet AJAX/checkout prešli. Zachytené `Transition was skipped` pochádza z natívneho view-transition pri rýchlej automatizácii, bolo prítomné už v baseline. Nová vlastná JS výnimka sa neobjavila.
- Bez skutočného iOS/Safari, externej platby/výdajného miesta, platného kupónu a odoslania objednávky. Kompletné používateľské posúdenie palety zostáva cez schválené preview.

## Zmenené súbory

- `src/styles/tokens.css`
- `src/styles/overrides/{cart-presentation,checkout,header-popups,sidebar,cart-modal}.css`
- nový `src/styles/overrides/footer.css`, jeho import v `src/main.css`
- `src/legacy/timber-custom-v175.css` — iba existujúci sidebarový podklad
- `src/modules/header-service-bar/index.js`, `src/core/selectors.js` — footer adaptér a overené selektory
- `package.json`, `package-lock.json` — 0.6.10
- generované `dist/*`, táto dokumentácia a audit
- `scripts/build.mjs`, `CONTRIBUTING.md` — schválená výnimka 20,5 kB CSS iba pre preview 0.6.10
