# Doprava, oprava košíka a detail objednávky — pracovné preview

Dátum: 15. 10. 2026. Základ: `bf464db` (vzdialený main a dokumentácia stabilnej v0.6.9), aktuálna vetva `work`. Zmeny sú pripravené na izolovanej preview vetve `preview/shipping-cart-order-20261015`; bez merge, release tagu a produkčného nasadenia. Číslo verzie, produkčný loader a farebné tokeny v0.6.9 zostávajú bez zmeny. Lokálny build obsahuje nevydané zmeny; nesmie nahradiť existujúci nemenný tag v0.6.9.

## Vykonané zmeny

1. Doprava: mení sa iba textový obsah overeného prezentačného názvu `.shipping-billing-name`. Hlavná časť je v `strong`, koncová zátvorka v samostatnom bloku s 4 px odstupom a váhou 400. Silnejší názov využíva existujúcu natívnu typografiu strong, bez duplicitného prepisu fontu. Názov v textContent zostáva súvislý a rovnaký. Bez zmeny dátových názvov, input hodnôt, cien, log, tooltipov, výdajných miest či spracovania formulára. Idempotentné po AJAX.
2. Košík: opravené existujúce pravidlo geometrie indikátora dopravy zdarma. Počas AJAX bolo v0.6.9 závislé od triedy `ts-cart-shipping`, ktorú nový serverový HTML obsah ešte nemal. Medzitým platilo Apollo `.extras-wrap .price-range { position:absolute; height:100%; }`, oranžová výplň mala približne 244 px a samotný track 246 px. Po inicializácii sa zmenšili na 6 px. Nové pravidlo platí od vloženia natívneho prvku pod `#cart-wrapper`, teda aj pred vlastnými obalmi. Natívny spinner, stránkové načítavanie, AJAX formuláre a výpočty zostávajú zachované. Žiadne dodatočné prekrytie, skrývanie obsahu, oneskorenie ani nový AJAX handler.
3. Detail objednávky: natívny My Order komponent používa open shadow root. Nový modul vloží jediný lokálny štýl do tohto koreňa, čo je nevyhnutné, pretože globálne CSS cez hranicu shadow DOM neprechádza. Existujúce React uzly sa neklonujú ani nepresúvajú. Štýly sú obmedzené na `.layout__order`; prihlasovací formulár, formulár vrátenia a ostatné sekcie webu nedostávajú nové štýly. Build vloží minifikovaný CSS text do JS balíka; tým sa jeho veľkosť započítava do existujúceho JS limitu.
4. Produktové riadky majú natívne obrázky, jemné deliace čiary, priestor pre dlhé názvy, množstvo pod názvom a oddelené ceny vpravo. Doprava/platba zostávajú v samostatnej natívnej sekcii. Len explicitná natívna nulová cena metódy v EUR sa označí ZADARMO.
5. Stav objednávky sa číta z reálneho `order.status` v existujúcom read-only MyOrder/data endpointe. Identifikátor pochádza z overenej konfigurácie natívneho widgetu, takže fungujú aj podpísané odkazy s tokenom. Token sa nedekóduje, nezapisuje do repozitára ani do preview. Zaplatenie sa nezamieňa za stav vybavenia. Neznáme vlastné stavy zostávajú neutrálne; explicitne zrušené sú červené. Pri chýbajúcich dátach sa stav nevymýšľa a zlyhanie adaptéru neblokuje natívnu stránku.
6. Kontaktný panel používa pôvodné natívne údaje a tel/mailto odkazy, teplý svetlý podklad, oranžový akcent, tmavé odkazy, ikony a oranžový hover. Nepridávajú sa duplicitné kontakty.

## Overenie

- `npm run lint`: prešlo.
- `npm run build`: prešlo, pôvodné prahy bez zmeny. JS cca 24,57 / 30 kB gzip, CSS cca 19,75 / 19,75 kB. CSS rezerva je veľmi malá; ďalšie rozšírenia budú vyžadovať samostatné posúdenie.
- `git diff --check`: prešlo.
- Živý web, čerstvé testovacie relácie Chromium s lokálne nahradenými CDN súbormi: natívne pridanie produktu, zmena 1 → 2, opakované fyzické +/+/-/+ a ustálený stav 4 ks, jednotková cena 8,68 € a riadok 34,72 €. Test čaká na skutočné ukončenie AJAX; nehodnotí medzistav pred odpoveďou. Natívny spinner počas prepočtu zostáva. Zachytené snímky indikátora majú po oprave výšku najviac 6 px.
- Doprava: všetky štyri názvy, zachované texty a formulár, font 700 pre hlavný názov a 400 pre údaj doručenia. Oddelená cena, bez horizontálneho pretekania pri 320/375/768/1024/1440 px. Natívny výber dopravy/platby a postup do osobných údajov prešli. Objednávka sa neodoslala. Rovnaké hlavné kontroly prešli aj v mobilnom kontexte s dotykom; úplný test výdajného miesta je uvedený medzi limitmi.
- Reálna objednávka cez používateľom poskytnutý overovací odkaz: tri produkty, stav, kontakty, opakovaná inicializácia a šírky 320/375/430/768/1024/1440/1920 px. Bez horizontálneho pretekania, kontaktné odkazy majú tmavú farbu `#29465b`. Porovnanie v tej istej autentifikovanej relácii s presnými stabilnými CSS/JS v0.6.9 potvrdilo nezmenené ceny a kontaktné odkazy; rozdiel pri explicitnej nule je iba označenie ZADARMO. Objednávka sa neupravila.
- Dôležité: natívny detail tejto reálnej objednávky nezobrazuje celkový finančný súčet. Zachovaný je tento natívny stav; chýbajúce údaje sa nedopočítavajú z domnienok. Vzorka s natívnym dostupným súčtom bola overená samostatne.
- Lokálne modelové dáta v skutočnom natívnom React komponente Shoptetu: 1, 3 a 12 produktov, dlhé názvy, oddelená doprava/platba, zľava, celková cena, bezplatná platba, prijatá/vybavovaná/vybavená/zrušená objednávka a neznámy vlastný stav. Bez pretekania 320–1920 px. Ide o testovacie dáta, nie o ďalšie reálne objednávky.
- Regresná kontrola homepage, kategórie a detailu produktu pri 375 a 1440 px: nové štýly sa na ne neaplikujú, bez horizontálneho pretekania a bez nových zachytených JS výnimiek.

## Limity a zostávajúce overenie

- Úplný výber a potvrdenie odberného miesta sa v testovacej relácii nepodarilo dokončiť. Pri následnej návšteve dopravy nebola jedna voľba viditeľná; ďalší pokus po vložení iného produktu zostal v natívnej validácii košíka. Zachované inputy a výdajňové odkazy sú overené, celý priechod externým pickerom nie.
- Skutočný iOS Safari, fyzické iOS zariadenie, platobné brány, platný kupón a odoslanie novej objednávky neboli testované. PageSpeed sa nemeral.
- Testovací prehliadač blokoval marketingové domény a niektoré externé platobné/logové služby. Ich plnú funkčnosť tieto kontroly nepotvrdzujú.
- Preview sa sprístupňuje cez `?ts_preview=<commit>` po publikovaní pracovného commitu a overení oboch CDN súborov. Produkčný loader zostáva na v0.6.9; preview cookie platí iba v prehliadači, ktorý odkaz otvorí. Lokálna statická HTML ukážka s modelovými dátami je medzi pracovnými podkladmi mimo repozitára. Funkčné skúšky prebiehali na skutočnom webe s lokálne nahradenými assetmi, izolovane od zákazníkov.
- Trello kód úlohy nebol dodaný; väzbu na kartu treba doplniť pri následnej evidencii. Používateľ výslovne požiadal o izolované preview; produkčný loader ani existujúci tag sa nemenia.

## Zmenené súbory

- `CHANGELOG.md`
- `dist/timber.min.css`
- `dist/timber.min.css.map`
- `dist/timber.min.js`
- `dist/timber.min.js.map`
- `docs/previews/order-detail-cart-followup.md`
- `scripts/build.mjs`
- `src/core/events.js`
- `src/core/order.js`
- `src/core/page.js`
- `src/core/selectors.js`
- `src/core/shipping.js`
- `src/core/texts.js`
- `src/main.js`
- `src/modules/cart-presentation/checkout.js`
- `src/modules/cart-presentation/index.js`
- `src/modules/order-detail/index.js`
- `src/styles/overrides/cart-presentation.css`
- `src/styles/overrides/checkout.css`
- `src/styles/overrides/order-detail.css`

Preview postup: publikovať pracovný commit na samostatnej preview vetve, overiť dostupnosť a zhodu oboch assetov na CDN a až potom použiť `?ts_preview=<hash>`. Vypnutie preview: `?ts_preview=off`. Vizuálne schválenie a povinný release checklist predchádzajú akémukoľvek produkčnému nasadeniu. Merge ani produkcia nie sú týmto pripravené ani vykonané.
