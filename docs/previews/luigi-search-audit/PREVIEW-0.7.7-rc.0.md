# LB1 · samostatný preview 0.7.7-rc.0

Produkčný HTML loader bol pred zmenou overený: PROD v0.7.6. Vzdialené tagy
sú zaznamenané vo versions-before.txt; najvyšší stabilný tag je v0.7.6,
existujúce dokumentované preview sú 0.7.6-rc.0 až rc.4. 0.7.7-rc.0 bolo voľné.
Nový build je publikovaný pod nemenným commitom
`5c2a7e7f43fb612564964bd64716447550fbadd5`, nie prepísaným tagom.

## Zapnutie, vypnutie a rollback

1. Otvoriť https://www.timberstore.sk/vyhladavanie/?string=BLUM+71B3550&ts_preview=5c2a7e7
2. Overiť badge PREVIEW 5c2a7e7 a `Timber.version === 'v0.7.7-rc.0'`.
3. Preview cookie platí sedem dní iba v danom prehliadači. Neposielať preview
   odkaz zákazníkom. Ostatní návštevníci používajú stabilnú v0.7.6.
4. Vypnutie: https://www.timberstore.sk/?ts_preview=off, potom otvoriť požadovanú
   stránku bez ts_preview. Overiť `TimberLoader.preview === false` a v0.7.6.
5. Rollback tohto testu je rovnaký krok: zmaže preview cookie a načíta existujúci
   stabilný tag v0.7.6. Produkčný loader sa počas tejto práce nemenil.
   Predchádzajúci docs-only bod je b5af83c; nejde o nový produkčný build.

## Mapovanie a izolácia

`src/styles/overrides/luigi-preview.css` je pod `html.ts-luigi-preview`.
Triedu zapína idempotentný modul iba ak TimberLoader.preview je true.
Autocomplete číta explicitné `content` metadáta: Skladom → #00C853,
Centrálny sklad → #C97A2B. Neznáme hodnoty sa nepreklasifikujú.
Produktové kódy zostávajú #2454A6. Search používa pôvodnú dostupnosť feedu.
Žiadne nové buy/click handlery ani reinitializácia Luigi.

## Externé nastavenia Luigi — samostatná evidencia

Žiadne nastavenie mimo repozitára nebolo zapísané. Pozorovaný pôvodný stav:
Autocomplete farbil Centrálny sklad zelenou; Search používal oranžovú #C97A2B.
Pôvodné administrátorské hodnoty nie sú dostupné a neboli odhadnuté.
Oprava je lokálna preview CSS, nie zmena indexu alebo vendor theme.
Ak sa neskôr zmení vendor konfigurácia, zaznamenať presný setting, pôvodnú
hodnotu, novú hodnotu a samostatný postup obnovenia. Návrat buildu vendor
konfiguráciu nevráti.

## Kontroly a zostávajúce nedostatky

Lint a build prešli: JS 36.18 KiB / limit 36.25, CSS 32.72 / limit 32.75.
Nový CSS preview limit je oddelený, staršie rozpočty nezmenené.
Živé výsledky testu sú v preview-0.7.7-rc.0/verification.json a PNG v tom istom
adresári. Test používa skutočný CDN build, bez lokálneho nahrádzania assetov.

- Safari: NOT TESTED, prostredie je Linux; dostupnosť WebKit je zaznamenaná
  samostatne a ani WebKit by nebol fyzický Safari/iPhone.
- Objednávka sa neodosiela, checkout a platba nie sú testované.
- Prijatie analytickej HTTP udalosti neoveruje reportovanie v administrácii.
- Neznáme dostupnosti a jazykové varianty vyžadujú doplnenie potvrdených metadát.
- Kontrast schválenej zelenej/oranžovej zostáva známy nedostatok.
- Relevancia, feed, creation_time a produkčné Core Web Vitals nie sú týmto
  farebným preview vyriešené.

Bez merge, produkčného deploymentu alebo zmeny produkčného loadera.

### Výsledok košíka

CDN test: BLUM 71B3550 Onyx, SKU 306317, 1 ks, 4,11 €/ks a 4,11 € spolu.
Potvrdené `Timber.version` v0.7.7-rc.0; cart-verification.json.
Prvý test lokálneho podania identických build assetov zachytil `buy` s odkazom
na správny produkt a atribúciou Search Results previazanou na impression event;
bez uloženia visitor identifikátorov (analytics-initial.json).
Opakovaný CDN test po odmietnutí cookies nezachytil analytický buy event.
Tento rozdiel nie je označený ako úspešná kontrola analytiky; treba rozlíšiť
consent gating od straty udalosti. Reporting v Luigi administrácii je neoverený.

Aj opakovanie CDN testu po kliknutí na „Súhlasím“ neprinieslo zachytený buy event.
**Zostávajúci blokujúci bod pre produkčné prijatie:** analytická atribúcia nie je
na CDN preview spoľahlivo potvrdená. Bez prístupu k vendor reportom nemožno
vyhlásiť, že reporting funguje. Nepridávali sa náhradné event handlery, ktoré by
mohli vytvoriť duplicity. Košík a ceny pri oboch opakovaniach prešli.

Poznámka k verification.json: `codes` meria obal `.p-code`, ktorého neutrálny
label nie je samotná hodnota SKU. Hodnoty SKU sú vnorené a na snímkach ostávajú
modré. Staršie snímky pred zmenou zostávajú v live/; nové snímky sú oddelené,
keďže nové farebné testy používajú výrazy BLUM 71B3550 a BLUM záves.
