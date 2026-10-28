# Changelog

## v0.7.4 · 2026-10-28 · Schválené mobilné karty a centrovanie cien

- Mobilné Do košíka s ikonou, väčšie medzery a vnútorné odsadenie.
- Podobné/súvisiace: množstvo a ikona vedľa seba, sklad a ceny v dvoch riadkoch, štyri produkty na PC zachované.
- Celý riadok ceny s €/jednotkou centrovaný nad cenou bez DPH na PC aj mobile; PC odporúčania viac doprava nad košíkom.
- Povýšenie schváleného rc.3 bez funkčných zmien; [celý popis, overenie a aktivácia](docs/releases/v0.7.4.md). Safari/iPhone NOT TESTED. Aktivácia Shoptetu vyžaduje prihlásenie.

## v0.7.4-rc.3 — preview (28. 10. 2026)

- Mobilné/tabletové podobné a súvisiace produkty: celý riadok ceny s €, lomitkom a jednotkou centrovaný na cenu bez DPH. Odstránené natívne zmenšovanie dlhých jednotiek a jednostranné pretečenie ceny.
- PC centrovanie a ostatné rozloženie zachované. Iba mobilné CSS a verzia buildu, bez zmeny produkcie. [Overenie](docs/previews/mobile-rail-centering-v0.7.4-rc.3/README.md).

## v0.7.4-rc.2 — preview (28. 10. 2026)

- Centrovanie celého riadka ceny: suma, €, lomitko aj jednotka spolu nad cenou bez DPH, podľa spresnenia majiteľa. Mobilné karty zdieľajú stred s košíkom.
- PC podobné/súvisiace: kompaktný cenový blok ukotvený pri pravom okraji košíka, o 23.33px viac doprava na overenom príklade StrongPower. Zachované dva riadky, sklad vľavo, odstupy a štyri karty.
- PC klasické a obľúbené produkty: celá cena s jednotkou v spoločnom riadku. Iba CSS a verzia buildu, bez zmeny produkcie. [Overenie](docs/previews/full-price-centering-v0.7.4-rc.2/README.md).

## v0.7.4-rc.1 — preview (28. 10. 2026)

- Mobilný katalóg: hlavná cena nad stredom tlačidla košíka v spoločnom pravom stĺpci; jednotka vedľa sumy. V najmenších kartách sa centruje celý riadok ceny s jednotkou, aby sa neorezal.
- PC podobné/súvisiace a obľúbené produkty: hlavná suma má spoločný stred s cenou bez DPH, sekundárna jednotka ho neposúva. Zachované dva skladové riadky, rozostupy a štyri odporúčania vedľa seba.
- Iba CSS a verzia buildu. Predchádzajúce úpravy aj stabilný release zachované. [Overenie](docs/previews/price-centering-v0.7.4-rc.1/README.md).

## v0.7.4-rc.0 — preview (28. 10. 2026)

- Mobilné produktové karty: viditeľné Do košíka aj s ikonou, 14px medzera a o 6px väčšie vnútorné odsadenie nákupných blokov. Jedna katalógová karta do 599px, na úzkych homepage slidroch čitateľné tlačidlo v samostatnom riadku.
- Súvisiace/podobné produkty: množstvo vľavo a iba ikona košíka vpravo v jednom riadku; odstránené zdvojené odsadenie. Zachované štyri produkty na PC a natívne karusely.
- Dva zarovnané riadky skladu a cien vrátane jednotky, centrálneho skladu a počtu. Cena bez DPH v zátvorkách. Menšie označenie skladu a kompaktná typografia podľa šírky karty.
- Iba CSS a verzia buildu; funkčný JS, produkčný loader a stabilný release bez zmeny. [Overenie](docs/previews/mobile-card-recommendations-v0.7.4-rc.0/README.md).

## v0.7.3 · 2026-10-28 · Schválené produktové karty, filtre a galéria

- Jednotné zarovnanie skladov, cien, množstva a košíka; väčšie PC rozostupy, štyri riadky názvu a jemná oranžová čiara.
- Opravený PC tabuľkový výpis vrátane dvojriadkového skladu a cien; názvy zostávajú tučné.
- Mobilný kód na fotografii, počet pod SKLADOM a jedna karta na úzkom mobile.
- Mobilné filtre so širokým aktívnym pozadím, posúvaním spolu so stránkou a zatvorením až pri geste mimo panelu.
- Plynulé ťahanie pásu miniatúr myšou aj prstom v detaile, zachované šípky, výber a zväčšenie.
- Povýšenie schváleného rc.9 bez funkčných zmien. [Celý popis, overenie a aktivácia](docs/releases/v0.7.3.md). Safari/iPhone NOT TESTED. Aktivácia v Shoptete vyžaduje prihlásenie.

## v0.7.3-rc.9 — preview (27. 10. 2026)

- Detail produktu: pás miniatúr sa plynulo posúva počas držania a ťahania myšou aj prstom, oboma smermi. Zachované natívne miniatúry, šípky, výber hlavnej fotky a zväčšenie.
- Presné hranice pásu, zachytenie pohybu mimo pásu, bez nechceného kliknutia po potiahnutí. Zvislé dotykové posúvanie stránky zostáva funkčné.
- Hlavná fotografia používa pôvodné swipe prepínanie; súvisiace/podobné Swiper bloky bez zmeny. Predchádzajúce produktové/filter úpravy zachované. Iba preview bez zmeny loadera.

## v0.7.3-rc.8 — preview (27. 10. 2026)

- Aj na mobilných kartách je počet kusov pod označením SKLADOM. CENTRÁLNY / SKLAD (počet) ostáva zachovaný.
- PC, kód na fotografiách, 24px rozostupy a mobilné filtre bez zmeny. Iba preview.

## v0.7.3-rc.7 — preview (27. 10. 2026)

- Mobil: natívny kód produktu je opäť viditeľný na fotografiách v kategóriách, značkách, homepage karuseloch a súvisiacich produktových kartách. Zachované pôvodné hodnoty, pozícia a farby; odstránené iba mobilné skrytie.
- Zachované predchádzajúce úpravy vrátane 24px medzery na PC. Len preview, produkčný loader bez zmeny.

## v0.7.3-rc.6 — preview (27. 10. 2026)

- Na ďalšiu požiadavku majiteľa zväčšená PC medzera medzi nákupnými stĺpcami zo 16 na 24px. Bloky sú o ďalšie 4px bližšie k okrajom pri zachovaní šírok a vnútorného odsadenia.
- Mobilné karty, správanie filtrov a tabuľka bez zmeny. Len preview.

## v0.7.3-rc.5 — preview (27. 10. 2026)

- PC karty: medzera medzi ľavou a pravou nákupnou stranou 16px namiesto 8px; oba bloky o 4px bližšie k okrajom v rámci existujúceho vnútorného odsadenia. Šírka ceny/tlačidla a päťciferného množstva zachované.
- Mobilné filtre a zoradenie sú pri otvorení súčasťou toku stránky, bez maximálnej výšky a bez samostatného vnútorného scrollovania. Posúvajú sa spolu so stránkou hore aj dole.
- Gesto začaté vo filtri/zoradení ho nezatvára ani pri dobehnutí pohybu; ďalšie gesto mimo panelu ho zatvorí. Zachované hodnoty, natívne checkboxy/reset/zoradenie a Escape.
- Rozpočty JS 32.5 / CSS 29.75 KiB bez navýšenia. Iba preview, produkčný loader bez zmeny.

## v0.7.3-rc.4 — preview (27. 10. 2026)

- PC karty: SKLADOM v prvom riadku oproti hlavnej cene, počet kusov pod ním oproti cene bez DPH v zátvorkách. Cena a tlačidlo zdieľajú stred pravého stĺpca. Tok CENTRÁLNY / SKLAD (počet) zachovaný.
- V PC tabuľke sú názvy opäť tučné (700) podľa nového rozhodnutia majiteľa.
- Mobilné filtre: aktívne pozadie nadpisu je na celú šírku panelu pri všetkých skupinách.
- Filtre aj zoradenie sa zatvoria po posunutí stránky o viac ako 16px alebo pri posúvaní mimo panelu (touch/wheel). Posúvanie vo vnútri a ovládanie filtra zostávajú funkčné, hodnoty sa neresetujú.
- Mobilné produktové karty bez zmeny; iba preview bez zmeny produkčného loadera.

## v0.7.3-rc.3 — preview (27. 10. 2026)

- PC karty: sklad a množstvo vľavo, ceny a tlačidlo vpravo, s jednotným 2px vnútorným odstupom nad rámec existujúceho odsadenia karty.
- Suma a jednotka používajú explicitný flex riadok; na kartách do 300px ide jednotka vždy do druhého riadka, bez rozdielu medzi ks, pár a balenie.
- Názov PC karty 19px namiesto 18px; označenia skladov 12px namiesto 13px na kartách aj v PC tabuľke. Tabuľkový názov a ceny zachované. Mobil bez zmeny.
- Len preview, bez zmeny produkčného loadera.

## v0.7.3-rc.2 — preview (27. 10. 2026)

- PC karty: sklad a množstvo používajú spoločný stĺpec; cena a tlačidlo Do košíka druhý spoločný stĺpec. Vycentrované pod sebou. Mobilné zobrazenie ostáva bez zmeny.
- PC tabuľka: SKLADOM a cena s DPH v prvom riadku, počet kusov a cena bez DPH v zátvorkách v druhom. Pri centrálnom sklade CENTRÁLNY v prvom, SKLAD (počet) v druhom riadku. Dostupnosť vľavo.
- V tabuľke označenie skladu 13px namiesto 14px; viditeľná modrá suma vrátane € 19px namiesto 20px. Názov produktu v tabuľke normálnou hrúbkou 400; na kartách zostáva tučný.
- Len preview, zachované predchádzajúce úpravy, natívne formuláre a produkčný loader.

## v0.7.3-rc.1 — preview (27. 10. 2026)

- Len PC od 992 px: produktové karty rezervujú štyri riadky názvu namiesto troch. Pod názvom je jemná oranžová oddeľovacia čiara pred skladom a cenou.
- Mobilné štýly ostávajú z rc.0; desktopová tabuľka a horizontálne riadky popupu ostávajú bez tejto úpravy.
- Zachované rozloženie skladu/ceny a potvrdená jedna karta na úzkom mobile z rc.0. Iba preview bez zmeny produkčného loadera.

## v0.7.3-rc.0 — preview (27. 10. 2026)

- Produktové karty: sklad vľavo a cena vpravo v spoločnom riadku; cena bez DPH zostáva v zátvorkách.
- CENTRÁLNY / SKLAD (počet): pevné zalomenie označenia na dva riadky, počet spolu so slovom SKLAD. Pôvodné hodnoty, farby a jednotky zachované.
- Na úzkych telefónoch do 479 px jedna katalógová karta v riadku pre čitateľné údaje; natívne slidery a desktopová tabuľka zachované.
- Iba preview, bez zmeny produkčného loadera, merge alebo stabilného vydania.


## v0.7.2 · 2026-10-27 · Schválené úpravy od v0.7.1

- Plynulý popup po pridaní do košíka: odstránený biely načítavací záblesk, jemné zobrazenie hotového okna a pozadia, stabilné rozmery aj pri doplnení jednotky ceny. Prázdne obaly už nezväčšujú produkty na pozadí pri opakovanom otvorení. Rešpektované obmedzené animácie.
- Čitateľné polia množstva aj pre 10000 kusov v kartách, odporúčaniach a košíku; zachované skladové limity a balenia. Počítadlo v hlavičke sa zobrazuje pred ikonou košíka.
- Odporúčané a podobné produkty: názov/kód vľavo, cena vpravo, množstvo vedľa tlačidla na mobile. Počet kusov zostáva pri slove SKLAD aj pri centrálnom sklade.
- Zjednotené zelené potvrdenie a údaje o doprave zadarmo vrátane zostávajúcej sumy a priebehu. Hlavné tlačidlá sú oranžové s bielym textom, vedľajšie neutrálne; ceny produktov zostávajú modré.
- Mobilné MENU: oranžové čiary pri zatvorení, biele po otvorení, pôvodné pozadie. Kontakty podľa pätičky: hodiny, e-mail, telefón, Napíšte nám, farebné sociálne siete.
- Cookies: oranžové Súhlasím s bielym textom a jemnejšie Odmietnuť; pôvodné funkcie súhlasu zostali zachované.
- Technická údržba: zjednotené pravidlá štýlov a bezstratovo zmenšené formátovanie starších testovacích JSON záznamov pre CDN limit; dáta a odkazy zachované.
- Majiteľ schválil merge, vydanie a nasadenie. Stabilné vydanie povyšuje schválené rc.6 bez funkčných zmien; [popis, overenie a aktivácia](docs/releases/v0.7.2.md). Safari/iPhone NOT TESTED. Pred aktiváciou bol na webe overený v0.7.1; administrácia vyžaduje prihlásenie.

## Unreleased · 0.7.2-rc.6 · 2026-10-27 · M2 complete cart transition

- Remove the native white loading wash only from the spinner created during a product/variant submit, preserving its pointer shield and native request/error lifecycle. Limit the observer to the current event task and restore its class on completion/fallback; unrelated loaders stay native.
- Reveal the completed cart popup/backdrop with a 160ms opacity fade, respecting reduced motion. Retain synchronous native structural completion and stable dimensions.
- Hide empty purchase wrappers left by Apollo's global advanced-order product rearrangement; repeated popup opens no longer grow background cards. Reserve unit-slot height as well as width on narrow recommendation rows.
- Keep the new CDN snapshot under its 50MB package limit by removing only insignificant whitespace from historical JSON reports; preserve all paths and parsed data.
- Verify the complete click/loading/reveal sequence, stable background, delayed real responses, repeated opens/double-click shielding, galleries, failure-state isolation and native cart/checkout. Preview only; production v0.7.1 and loader unchanged. [Evidence and videos](docs/previews/cart-transition-v0.7.2-rc.6/README.md).

## Unreleased · 0.7.2-rc.5 · 2026-10-27 · M1 open menu glyph

- Show white hamburger lines on the dark open MENU toggle; retain orange lines when closed. Other menu/contact styling stays as in rc.4. Preview only, with unchanged budgets and production loader.

## Unreleased · 0.7.2-rc.4 · 2026-10-27 · M1 menu toggle correction

- Restore the mobile MENU toggle's original background, label and focus treatment. Colour only the three-line hamburger glyph orange in closed/open states.
- Retain rc.3 contact order, write-us action and footer-matched icons. Preview only; no production loader, stable tag or release changes.

## Unreleased · 0.7.2-rc.3 · 2026-10-27 · M1 mobile menu contacts

- Keep the mobile MENU toggle orange, including its open, hover and keyboard states.
- Match the footer contact sequence in the mobile menu: business hours, email, phone, Napíšte nám, social links. Preserve native mail/tel destinations, category navigation and legal links.
- Share contact SVGs with the footer and use its Facebook blue, Instagram gradient, orange mail/phone icons and text styling. Add the existing native contact-page destination as the write-us action.
- Validate repeated initialization, responsive menu cloning, native category accordions, footer/desktop parity and purchase flow. Preview only; production v0.7.1 and the loader are unchanged. [Evidence](docs/previews/mobile-menu-v0.7.2-rc.3/README.md).

## Unreleased · 0.7.2-rc.2 · 2026-10-27 · M2/C3 cart stability and green delivery

- Restore the established Emerald success icon/outline, free-delivery text/remainder and progress accents across the advanced popup, mini-cart and cart. Primary purchase buttons retain their orange treatment.
- Use the final native price colour before JS text cleanup; reserve missing-unit space so verified unit fetches cannot push prices later.
- Keep the last warehouse word and stock amount together with an idempotent nonbreaking space, preserving native stock spans, data and colour.
- Remove the competing custom post-open/unit resizes. Use content-driven cart-only Colorbox geometry and skip its size tween, so Apollo finishes rearranging forms before paint. Restore normal Colorbox speed for galleries and other dialogs.
- Preview only; published v0.7.1, the production loader and previous bundle budgets are unchanged. [Evidence and checks](docs/previews/cart-stability-v0.7.2-rc.2/README.md).

## Unreleased · 0.7.2-rc.1 · 2026-10-27 · Cart and recommendation controls

- Keep header counts above the cart icon, with wide mobile badges growing away from the price.
- Give native/custom quantity inputs at least 64 px of centre space for 10000; retain original min/max, pack steps, native submissions and stock validation. Extend list/cart tracks; narrow two-column cards wrap the purchase row instead of clipping it.
- Remove the recommendation/popup specificity conflict. Left-align recommendation titles and SKU, show stock counts beside labels, right-align prices and keep mobile popup/detail quantities left of labelled add-to-cart buttons.
- Use brand orange for cart/checkout primary actions and the add confirmation/shipping accents; neutral secondary back buttons. Preserve stock colours and other native status logic.
- Combined preview includes the approved cookie-button colours/white text. No stable release, main merge or production loader change. [Evidence and reproducible checks](docs/previews/cart-controls-v0.7.2-rc.1/README.md).

## Unreleased · 0.7.2-rc.0 · 2026-10-27 · Cookie button colours

- Give the native “Súhlasím” button the Timber orange background with the requested white label. Keep “Odmietnuť” on the notice background with a subtle inset outline. Preserve sizes, settings, native consent handlers and both choices.
- Isolated preview branch only; published v0.7.1 and the production loader are unchanged.
- [Mobile/desktop appearance and native-choice checks](docs/previews/cookies-v0.7.2-rc.0/README.md).

## v0.7.1 · 2026-10-27 · Site-wide loading stability

- Apply final product metadata, card, native quantity and detail-control styles before JS classes arrive. Remove Apollo's geometry/visibility interpolation from interactive controls; preserve colour/shadow feedback and native component states.
- Reserve quantity slots in grid/list/homepage and cart-related rows. Prepare streaming, AJAX and cloned cards before paint; preserve native form submission, bounds, pack steps and quantity handlers. Include manufacturer listings and their saved list view.
- Use font-independent cart SVG masks on purchase/header controls, native mobile-header geometry, early category bestseller visibility and native footer styles/icon/hour reservations.
- Restore a saved list view in the head loader before the bundle arrives. Keep the bounded loader fallback and native purchasing available if the bundle fails.
- Preserve the detail `KÓD:`/`ZNAČKA:` fix, including Apollo's intermediate `Kód produktu:` label.
- Owner authorized release/deployment on 2026-10-27. Promote the tested candidate to v0.7.1 without application-code changes. Retain its JS 32 KiB / CSS 27.5 KiB budgets; earlier stable limits unchanged. Shoptet activation is pending authenticated admin access; the target loader preserves the live historical guards and rollback v0.7.0. See [release status](docs/releases/v0.7.1.md).
- Published plain-CDN bytes verified against SHA-256; real-CDN mobile/desktop smoke PASS, including native cart updates. Clean production remains v0.7.0 pending admin login/activation.
- [Coverage, functional checks, slow/failed-load measurements and limitations](docs/fixes/loading-stability/README.md); [original detail metadata evidence](docs/fixes/product-metadata-loading/README.md).

## v0.7.0 · 2026-10-20

- Promote approved product-detail, catalogue/filter, homepage, quantity and cart presentation to stable v0.7.0. Preserve native Shoptet purchasing, prices and stock logic.
- Retain tested 32 KiB JS / 26.75 KiB CSS budgets without increase. Production loader remains v0.6.13 pending manual owner activation.
- Safari/WebKit and physical iPhone: **WAIVED BY OWNER**. Live external variant feed: **NOT VERIFIED**.
- [Release, final Chromium results, activation and rollback](docs/releases/v0.7.0.md); [complete changes since v0.6.13](docs/releases/v0.7.0/CHANGES.sk.md).

## PD Price, Stock & Feed-Case Polish · 2026-10-19 · Preview only

- Restore product titles to native feed case while retaining centring and whole-word wrapping.
- Increase desktop header separation to 24 px, balance native CTA spacing, colour only final-price numeric amounts #2454A6, centre mobile stock label/quantity rows and use the existing orange for KOMPLET.
- Preserve native price/currency/unit/stock/form data and handlers; reuse the existing observer for idempotent amount presentation and dynamic text updates.
- [Responsive measurements, native tests, screenshots, changed files and limits](docs/previews/product-price-stock-polish/README.md). Same preview branch; no merge, release or production deployment.

## PD UI & Gallery Final Refinement · 2026-10-19 · Preview only

- Centre uppercase product titles and native code/brand groups without changing title metrics; share whole-word product presentation across catalogue/search/related cards, excluding cart/checkout.
- Remove variant-heading side rules, colour only contact icons orange, centre mobile partial variant rows and give the existing expansion button its own row.
- Add subtle mobile submenu backgrounds and opt-in mouse dragging through the existing native-thumbnail gallery integration; retain CloudZoom, Colorbox, touch gestures and native purchasing.
- [35 responsive comparisons, interaction tests, screenshots and replay limitations](docs/previews/product-ui-gallery-refinement/README.md). Existing preview branch only; no merge, release or production deployment.

## PD Mobile Overflow & Gallery Refinement · 2026-10-19 · Preview only

- Fix real mobile layout expansion (390→402 px) at the frame, without global overflow hiding or header changes. Tests now assert requested device width and category/home header geometry.
- Keep native title/code/brand outside a bounded detail-body frame; preserve original form and node identities.
- Branded gallery controls with desktop clearance; centred partial desktop variant rows, 12 px extra desktop purchase spacing, green selected marker.
- [Root cause, 36 responsive comparisons, native interactions, screenshots and known limits](docs/previews/product-mobile-gallery/README.md). Same preview branch; no merge, release or production deployment.

## PD Panel Insets, Metadata & Variant Heading · 2026-10-19 · Preview only

- Symmetric measured frame insets: 18 px desktop, 15 px tablet, 16 px small mobile, with card/purchase/gallery dimensions retained.
- Shared neutral KÓD:/ZNAČKA: labels and #2454A6 native values across detail/catalogue; existing observer normalizes AJAX updates without duplicate wrappers.
- VŠETKY VARIANTY is centred between equal subtle rules on all devices, reusing the category-heading presentation.
- [Measurements, native tests, screenshots, changed files and limits](docs/previews/product-panel-metadata/README.md). WIRELI live URL became unavailable; its final layout evidence uses stored native HTML. Same preview branch; no merge/release/production deployment.

## PD Final Density & Code Typography · 2026-10-19 · Preview only

- Remove code chip surface/border/padding; neutral labels and matching blue code/brand values share typography.
- Compact actual title/metadata/variant/purchase/contact spacing. Align title, metadata, short description and links with unchanged card/purchase edges, including Apollo's separate mobile header.
- [Measured before/after geometry, responsive/native checks, screenshots and limits](docs/previews/product-final-density/README.md). Native DOM/JS, card dimensions, purchase panel and gallery unchanged. No merge, release or production deployment.

## PD Blue Unification & Variant Alignment · 2026-10-19 · Preview only

- Use computed brand blue #2454A6 as the shared custom accent; retain native/social/carrier colours and semantic success/error/medal neutrals. Product-code label matches the neutral brand label; code value stays blue.
- Orange variant heading; purchase panel follows unchanged native card-grid edges. Symmetric tablet frame; card/image sizes, gaps, active marker and handlers unchanged.
- [Colour inventory/exceptions, measured alignment, native tests and screenshots](docs/previews/product-blue-alignment/README.md). No JavaScript change, merge, release or production deployment.

## PD Final Purchase Panel · 2026-10-19 · Preview only

- Same-case delivery labels, accessible visually hidden price label and centred price/net price within the existing columns.
- One subtle #F8FAFC / #DDE4ED bordered purchase surface contains native information and existing quantity/CTA, guarded to retain their original form. Variants and contact links stay outside.
- [Three-product responsive/native checks, screenshots and known limits](docs/previews/product-purchase-panel/README.md). No merge, release or production changes.

## PD Purchase Information Columns · 2026-10-19 · Preview only

- Group existing native price/availability blocks inside the same Apollo grid: stock/delivery/link left, dominant price and parenthetical net price right. One idempotent wrapper, no duplicate native nodes or pricing/stock logic changes.
- Compact natural-height columns; intrinsic safe wrap at 320 px and for long prices. Purchase controls, variants, gallery and contacts preserved.
- [Responsive/native tests, long-price cases, card replay and screenshots](docs/previews/product-purchase-columns/README.md). Same preview branch; no merge, release or production change.

## PD Final Product Information Spacing · 2026-10-19 · Preview only

- Remove Apollo's invisible 10 px unit-price margin; use matching grid rows and one measured spacing rhythm. Visible glyph gaps: 30/20 px → 13/13 px, or 13.5/13 px with wrapped net price at 320 px.
- Up to 767 px, native delivery date sits 4 px below its label; the delivery-options link remains on the right when it fits and otherwise wraps. Desktop delivery stays horizontal.
- [Before/after measurements, screenshots and native checks](docs/previews/product-information-spacing/README.md). JS, quantity/CTA styles and production unchanged; no merge or release.

## PD Final Unification Fix · 2026-10-19 · Preview only

- Detail quantity uses the mini-cart's existing shared CSS: 36 px shell, 30/38/30 px segments, original colours, dividers and typography. Mini-cart presentation and native handlers preserved.
- Price, availability and delivery labels use 14 px / 500 / 21 px typography and a shared 16 px information rhythm. Native price hierarchy, green availability/date and CTA rules retained.
- [Changed files, reference comparisons and native checks](docs/previews/product-unification-fix/README.md). No merge, release or production change.

## PD Final Spacing & Controls · 2026-10-19 · Preview only

- Background-free delivery with the native date in availability green; 16 px information gaps, cart-token quantity styling, 22/14 px CTA spacing and a slightly narrower desktop button.
- Product shipping-popup text +1 px; relative ~16 px units, weight 600, kept with the real price. JavaScript, native logic and protected components unchanged.
- [Changed files, responsive/native tests and limits](docs/previews/product-final-spacing-controls/README.md). No merge, release or production change.

## PD Final Polish · 2026-10-19 · Same isolated preview branch

- Four separately checked phases: information rows, native purchase controls, shipping popup, and mobile variant expansion styling. No merge, release or production change.
- Fixed Apollo contact-row width, open Colorbox overflow on viewport narrowing, CTA icon wrapping, and net-price whitespace.
- [Phase results, regressions, changed files and verification limits](docs/previews/product-final-polish/README.md).

## PD Compact PRO · 2026-10-19 · Isolated preview only

- Compact native detail rows, royal blue product code, subtle shared frame and whole-word titles. Stable v0.6.13 base; no prior redesign or warehouse logic carried over.
- Native variant dimensions/order/active state preserved; Shoptet prices, stock, date, gallery and cart retain their logic.
- [Changed files, verification evidence and limits](docs/previews/product-compact-pro/README.md). No merge, release tag or production deployment.

## v0.6.13 · 2026-10-19 · Dokončenie homepage, Instagramu a kontaktov

- Biely text aj v širokej oranžovej hlavičke FAQ, nielen v aktívnom tlačidle kategórie.
- Pozadie celej Instagram sekcie zladené s blokom Overené reálnou výrobou (#F9EFE6), rámiky príspevkov zachované. Klient schválil vydanie; nový produktový detail vylúčený. [Súhrn, overenie a aktivácia](docs/releases/v0.6.13.md).

- Instagram má jemný béžový rámik s vnútorným pásikom; pri značkách sa rámik podľa následného zadania zobrazuje iba na mobile.

- Aktívna oranžová kategória FAQ má biely text aj po opakovanom prepínaní; ostatné kategórie a obsah zachované.

- Následné zadanie: na mobile Instagram opäť nad kontaktom; zhodné vizuálne aj DOM poradie, desktop zachovaný.

- Odstránená voľná mobilná šípka skrytého desktopového košíka; prázdny mobilný popup má oranžovú ikonu nad vycentrovaným textom.
- Instagram bez potreby súhlasu: dynamicky obnovované verejné dáta s overenými Shoptet obrázkami a natívnymi permalinks, bez embed skriptov a bez zmeny cookies návštevníkov. PC galéria po celej šírke; mobil zostáva 2½ fotky.
- Kontakt: aj PC hodiny prvé, širšie tlačidlo a sociálne siete vycentrované pod ním.
- Bez nového release/tagu, bez prepnutia produkčného loadera. [Príčiny, kontrola a limity](docs/fixes/v0.6.12-cart-instagram/README.md).


## v0.6.12 · 2026-10-18 · FAQ, Instagram a pätička

- Schválené večerné zmeny prenesené samostatne na main v0.6.11; rozpracovaný nový produktový detail a produktové informácie vylúčené.
- Čisté rohy FAQ bez Apollo výstupkov; opravené načítanie natívnych Instagram obrázkov, responzívny slider bez bodiek a desktopový hover šípok.
- Zjednotené kontakty a hodiny podľa hlavičky, farebné sociálne ikony; mobilné centrovanie, poradie údajov a samostatné NAPÍŠTE NÁM nad sociálnymi sieťami.
- Zjednotené mobilné footer akordeóny, vrátane Najvyhľadávanejšie; mobilné značky po dvoch a ponukové karty po jednej s natívnymi bodkami a swipe správaním.
- Build JS 29,14 KiB / CSS 22,81 KiB gzip, lint a oddelenie produktového preview overené. Reálny iOS a PageSpeed nemerané. [Podrobnosti a aktivácia](docs/releases/v0.6.12.md).
- Loader v repozitári pripravený na v0.6.12; aktivácia v Shoptet adminu musí prebehnúť samostatne.


Formát: verze · datum · karty · co se změnilo · PageSpeed mobil před/po.


## v0.6.11 · 2026-10-16 · Schválený košík, checkout a Apollo opravy

- Klient schválil dokončené preview `653d6f5172ae7f707082f0c922e6df5ed6bb75e3` a publikovanie do main ako nové stabilné vydanie. Funkčné zdroje sa pri povýšení z rc.4 nemenia; v0.6.9 zostáva nemenným rollback tagom. Odmietnutá v0.6.10 sa nevydáva. Trello kód nebol poskytnutý.
- Univerzálne mobilné karty dopravy, upravené kontakty checkoutu a menu, biele CTA texty/šípky, jednotný tvar login tlačidla, klientom objednaná Emerald #00C853. Oranžová, béžová a success background zachované.
- Mobilný náhľad košíka so scroll lockom a obnovením pozície, oddelená navigácia hlavného tlačidla a rozbaľovacej šípky, funkčný natívny prechod do košíka. Zjednotené odsadenie dopravy/súčtu/CTA, deliaca linka, stavový progress oranžový pred limitom a Emerald po jeho dosiahnutí.
- Opravené prekrývanie mobilného loga/košíka, foregroundy kategóriového sidebaru, oneskorené ovládanie súvisiaceho tovaru a zobrazenie nespracovaného Apollo detailu. Doplnený responzívny detail existujúcej objednávky bez zásahu do natívnych dát a formulárov.
- Prebliknutie pri zmene množstva: synchronizácia nového cart DOM aj pri serverom odmietnutom množstve, sledovanie nových koreňov a natívna loading vrstva až do dokončenia štruktúry. Zachované serverové výpočty, skladové limity, formuláre a event listenery.
- Schválené testy: desktop 1440 a mobily 320/375/390/430, reálne kliky/dotyky a navigácia, 35 AJAX zmien množstva vrátane odmietnutej skrutky 4000 → 6000, cold/pomalší transport a doprava zadarmo oboma smermi. Podrobné výsledky a hranice overenia zostávajú v docs/previews/; reálny iOS, PageSpeed, platba a odoslanie objednávky neboli testované.
- Stabilný build zachováva rozpočty rc.4: CSS 21 KiB / JS 30 KiB gzip. Loader v repozitári pripravený na v0.6.11; samotný merge/tag nemení živý Shoptet. Aktivácia a rollback: docs/releases/v0.6.11.md, ADMIN-CHANGES.md.

## Preview 0.6.11-rc.4 · 2026-10-15 · Mobilný náhľad košíka a stav dopravy

- Aktuálna pracovná vetva nad `8503ada9c320befb1a8377a49aa18eda77b5de2d`, samostatné preview cez nemenné SHA. Bez merge, release tagu a produkčného nasadenia. Loader v0.6.9 a paleta rc.3 bez zmeny; Trello kód nebol v zadaní poskytnutý.
- Mobilný náhľad ukotvený pod viditeľnou hlavičkou; zámok pozadia s obnovením pôvodného scrollu, jediná vnútorná scrollovacia oblasť produktov, stabilný titulok/zatvorenie a spodná doprava/súčet/CTA. Dvojité touch/click prepnutie nevzniká; dvh s vh fallbackom a safe-area. Pôvodný popup, formuláre, listenery a AJAX zostávajú zachované. Back-to-top skrytý iba pri otvorenom mobilnom košíku.
- SPOLU má 16px vnútorné odsadenie a jemnú hornú linku; doprava aj CTA používajú rovnaký horizontálny inset na mobile aj desktope. Desktopová šírka 420px zachovaná. Suma pochádza z pôvodného naformátovaného header súčtu, bez nového výpočtu cien.
- Doprava: oprava prezentačnej chyby Apolla pri slovenskom „Nakúpte“ a starom footer texte po AJAX. Stav zo serverových `cartInfo.leftToFreeShipping` a `freeShippingFrom`, žiadny pevný limit ani timer. Nedosiahnutý progress oranžový, splnený Emerald, zadarmo! Emerald bold, prefix tmavý a truck oranžový. Pôvodný nový serverový shipping uzol sa zachová, zastaraný neinteraktívny text odstráni; žiadne duplikáty.
- Mobilný dátum doručenia v pôvodnom uzle zarovnaný doprava, ikona na os shipping trucku. Mobilný header košík preberá desktopové farby bez zmeny geometrie. V menu vyrovnané len vertikálne medzery kontaktov.
- Živé testy: 320/375/390/430, otvorenie hore/uprostred/dole, scroll/obnovenie, opakované natívne AJAX množstvá cez hranicu oboma smermi, odstránenie produktu a desktop geometria. Navyše 72 modelových kombinácií v natívnom markupe vrátane prázdneho/1/8/40 produktov a dvoj-/troj-/štvorciferných súm. Podrobnosti a limity: `docs/previews/cart-rc4.md`.
- Lint/build prešli: JS 26 346 B (25,73 KiB) / 30 KiB, CSS 21 099 B (20,60 KiB) / 21 KiB gzip. Rozpočet zvýšený podľa trvalého súhlasu klienta, iba pre rc.4. PageSpeed a fyzický iOS/Android neoverené.

### Doplnenie aktuálnej rc.4 · finálne zadanie košíka, checkoutu a sidebara

- Bez zmeny čísla verzie podľa pokynu klienta. Ďalší commit na rovnakej preview vetve nad `b075e8c`, bez merge/tagu/release/admin zásahu a produkčného nasadenia; package, loader v0.6.9 aj paleta bez zmeny.
- Mobilný header: biela samostatná šípka a rezervované miesto pre pôvodný glyph, badge 99+, cenu a šípku bez prekrytia. Native produktové riadky mobilného náhľadu cez grid: obrázok/názov, pod nimi množstvo vľavo a cena + desktopová červená delete vpravo; pôvodné formuláre a AJAX bez zmeny.
- Zhrnutie: dátum a shipping majú zhodný 12px font, os ľavých ikon a pravé texty aj na desktope; opravená natívna zelená truck ikona po splnení dopravy, ostáva oranžová. Zachované 16px SPOLU/divider a serverové stavy oranžového/Emerald progressu.
- Login má plnú šírku nadpisu, pôvodný orange/white vzhľad a väčší odstup od prvého poľa na mobile/desktope. Doplnkový kontaktný odsek odstránený z JS/CSS/textov, horné funkčné kontakty bez zmeny. Mobilné menu zachováva jednotné 10px medzery.
- Sidebar: iba biely foreground hlavičky a plných oranžových active/current stavov a šípok, vrátane hover. Svetlé rodičovské/vnorené položky tmavé. Žiadne nové pozadia, geometria, názvy kategórií ani zásah do rozbaľovania.
- Súvisiaci tovar detailu: preukázané natívne formuláre už v HTML; lokálne odstránený opacity:0 gate a 250ms fade kariet/slider shellu čakajúci na body.is-loaded. Bez nového JS, zásahu do min/max/pack/submit, lazy obrázkov, slidera alebo dizajnu detailu.
- Živé testy mobil 320/375/390/430 a desktop, natívny hover, scroll restore, quantity/remove a AJAX nad/pod limit, všetky tri kroky checkoutu, tel/mailto, šírka/spacing loginu, tri sidebar kategórie a súvisiaci native AJAX submit prešli. 72 modelových kombinácií plus header 99+/dlhé ceny. Podrobnosti, súbory, príčiny a limity: `docs/previews/cart-final.md`.
- Lint/build prešli v existujúcom rc.4 rozpočte (JS 25,63/30 KiB, CSS 20,82/21 KiB gzip). Reálny iOS/Android a PageSpeed neoverené. Chromium pri navigácii checkoutu zaznamenal existujúcu hlášku Transition was skipped bez stacku, funkčné testy prešli; hláška sa tu neopravovala.

### Kontrola kliknutí a vykresľovania v rovnakej rc.4

- Základ `155eea9`, rovnaká pracovná vetva/verzia, bez merge/release/tagu/produkcie. Ostatné hotové opravy a finančná logika zostávajú zachované.
- Potvrdené reálnymi dotykmi: mobilná vetva hlavného cart linku rušila href a otvárala popup. Odstránená iba táto vetva, hlavná plocha/ikona/počet navigujú natívnym odkazom; samostatná šípka naďalej výhradne ovláda popup. Mobilný transition:all nahradený iba prechodmi farieb/tieňa, aby sa neanimovala visibility/geometria pri prestavbe header clone.
- CTA: natívny href/redirect boli správne. Pri 320px však reálny hit zachytil zalomený dlhý PREVIEW SHA štítok a vypol preview. Badge sa teraz skryje výhradne počas otvoreného mobilného náhľadu a po zatvorení sa obnoví. Natívny AJAX loader sa neobchádza.
- Súvisiaci tovar: predchádzajúce opacity:1 predčasne odkrývalo nespracovaný serverový layout (.p-tools → .product-btn, 522/527 → 482px). Zachovaná natívna pripravenosť body.is-loaded, detail dovtedy nemení rezervovaný priestor a neodhalí medzistav. Odstránený zostáva 250ms fade; žiadny nový JS, observer alebo timeout pre detail. Global loader aj package/paleta bez zmeny.
- Pred/po: 20 navigácií v každej render sérii, 320/375/390/430/1440, prvé načítanie a reálny súvisiaci produkt, cache statických assets vs no-cache. Presné príčiny, reálne CTA výsledné URL/obsah, údaje a obmedzenia testov: `docs/previews/cart-actions.md` a `docs/previews/cart-actions/render-traces.json`. Cache je TLS-overujúci transport testovacieho prostredia; nejde o fyzický browser disk-cache benchmark.
- Lint/build v rovnakých rc.4 limitoch 30 KiB JS / 21 KiB CSS. Bez vytvorenia objednávky/platby, bez reálneho iOS/Android a PageSpeed.

### Doplňujúce overenie tej istej rc.4 · reálne dotyky s dvoma produktmi

- Na 320px natívne absolútne logo prekrývalo ikonu košíka pri širšej celkovej cene. Skutočný hit-test aj touch listener zachytili logo a home URL. Mobilný header teraz prideľuje tools ich obsahovú šírku a logu zostávajúci priestor; proporčné zmenšenie loga odstráni prekrývanie bez zásahu do navigačných listenerov. Desktop bez zmeny.
- Samotné related tlačidlo dedilo natívnu transition:all a po body.is-loaded ešte animovalo visibility. Obmedzené iba súvisiace btn na farebné vlastnosti a tieň; quantity/input/button sa odhalia spolu po natívnej inicializácii, bez nového časovača alebo JS.
- Tá istá pracovná vetva/verzia, bez merge, release/tagu a produkčného nasadenia. Presné príčiny, merania a obmedzenia: docs/previews/cart-actions.md.

### Oprava prebliknutia pri AJAX zmene množstva · 2026-10-16

- Reprodukcia podľa videa 12.mp4 a tej istej skrutky 50151: 4000 → 6000 server správne odmietne pre skladový limit 4000. V tejto vetve sa cart updated odošle na už odpojenom formulári, zatiaľ čo celý cart wrapper je nový. Pôvodné sledovanie preto mohlo zostať na starom DOM; Apollo následne 10ms krokom odhalilo svoje rozloženie.
- Cart presentation počúva aj ShoptetDOMCartContentLoaded, opätovne sleduje nové prvky a prvý krok, úpravy dokončí v mutation microtasku pred paintom. Vlastné zápisy nespúšťajú observer slučku. Krátku štrukturálnu medzeru kryje pôvodný spinner cez natívne API, uvoľnený podľa DOM pripravenosti, bez nového timeoutu, kópií košíka alebo override natívnych funkcií.
- 35 živých zmien pri troch produktoch: 320/375/390/430/1440, plus cold/600ms pomalší cart content pri 390/1440. Plus, mínus, ručné vstupy aj serverom odmietnuté množstvo; ceny/ostatné produkty zachované, bez odhaleného nespracovaného layoutu alebo overflow. Regresne aj mobilný náhľad a doprava zadarmo oboma smermi. Podrobnosti a obmedzenia: docs/previews/cart-flicker.md.
- Tá istá rc.4, bez merge/release/tagu/produkčného nasadenia. JS 26 460 B (25,84 KiB) / 30 KiB, CSS 21 473 B (20,97 KiB) / 21 KiB gzip; rozpočty, produkčný loader a paleta bez zmeny.

## Preview 0.6.11-rc.3 · 2026-10-15 · Kontaktné riadky, biele CTA a tvar prihlásenia

- Aktuálna vetva, základ `4e66dbce0de8fe8756e43687f6f46847311b09b6`, staršie preview commity zachované. Iba izolované preview cez SHA, bez merge, tagu a produkčného nasadenia; loader v0.6.9.
- Mobilné kontakty presne podľa zadania: nadpis, samostatné centrované hodiny, e-mail vľavo a telefón vpravo, pod oboma pôvodné ikony v rovnakom riadku. Jemný pôvodný oddeľovač, žiadne hodiny v ľavom stĺpci. Jediný pomocný odsek s klikateľným a pri zalomení nerozdeleným mailto e-mailom.
- Checkout kontakt používa mailto: aj na desktope, odstránená závislosť destinácie od breakpointu. Bežná desktopová hlavička/formulárový odkaz mimo checkoutu sa nemenia. Pôvodný tel: a natívne listenery zachované.
- Pokračovať/dokončiť: biely text, šípky a právny podtext v base/hover/active/focus; Emerald a pozadia bez zmeny. Biele číslo aktívneho kroku a natívny tick na plnom Emerald disku iba pre konzistenciu foregroundu, žiadna zmena geometrie krokov. ZADARMO/SKLADOM na svetlých plochách ostávajú Emerald.
- Login button: spoločný 8px radius token s mobilným blokom Osobné údaje, padding 14px 12px, min-height 48px, centrovaný text na mobile/desktope. Farby a štruktúra osobného formulára sa nemenia.
- Živé merania obrazoviek 2/3 (Shoptet krok-1/krok-2): 320/375/390/430/1024/1440, kontakty, presné biele CTA foregroundy/šípky v stavoch, mailto/tel, zaoblenie login buttonu, bez overflow. Modelové desktop kontakty aj pri 768 px rovnaká geometria ako rc.2. Doplnkové overenie opakovanej inicializácie/AJAX, klikov na odkazy, success farieb a nezmenených jemných pozadí. Žiadna objednávka/platba sa neodoslala. Podrobnosti a limity: `docs/previews/checkout-rc3.md`.
- Lint/build prešli v existujúcich rc.2 limitoch: CSS 20,15 / 20,25 KiB a JS 24,69 / 30 KiB gzip. Safari/PageSpeed neoverené. Biela na presne zadanej Emerald zostáva 2,24:1, nejde o WCAG certifikáciu.

## Preview 0.6.11-rc.2 · 2026-10-15 · Mobilné kontakty a Emerald

- Len aktuálna pracovná vetva, základ `c5fda5277e5b5d29359b7dd71b05650aa96ace01`; po následnom pokyne klienta publikované izolované preview cez commit hash. Bez merge, release tagu a produkčného nasadenia. Produkčný loader v0.6.9 a predchádzajúci rc.1 commit zostávajú zachované.
- Mobilné checkout kontakty: hodiny vľavo, telefón/e-mail vpravo s jemným oddeľovačom, pôvodné ikony pod textami. Telefón zachováva tel:, mobilný e-mail a nový doplnkový riadok používajú mailto:. Desktopový kontaktný formulár a geometria zachované. Nový riadok je mimo béžového panelu, skrytý na desktope a idempotentný pri opakovanej inicializácii/AJAX.
- Autíčko pri mobilnom nadpise používa existujúci `--ts-color-accent` (#d4884a), ako existujúca dopravná ikona košíka. Referenčná fotografia 5 nebola priložená, preto sa netvrdí vizuálne porovnanie s fotografiou.
- Výslovne objednaná Emerald #00C853: spoločné primary/border/active tokeny a aliasy pre dostupnosť, ZADARMO, indikátory, progress, potvrdenia, order status a CTA. Success Background #e8f5ed, oranžové a béžové tokeny zostávajú nezmenené. Success CTA hover už nepoužíva brightness, teda nevytvára ďalší odtieň.
- Tmavý text CTA/právnej vety a natívny znak zaškrtnutia/číslo aktívneho kroku zachovávajú čitateľnosť na Emerald. Malý Emerald text na bielej má kontrast 2,24:1 (AA nespĺňa), na success pozadí 1,99:1; ide o klientom presne určenú farbu. Nemenia sa nesúvisiace natívne/externé palety ani historické súbory.
- Kontaktné modely 320/375/390/430, desktop 768/1024/1440 a opakovaná inicializácia/AJAX prešli. Živé natívne prepínanie dopravy, AJAX a pickup widget s lokálne substituovanými Timber assets prešli. Detailné podmienky a limity v `docs/previews/emerald-checkout-rc2.md`. Reálny Safari a odoslanie objednávky/platby neoverené.
- Lint/build prešli; CSS limit 20,25 KiB a JS 30 KiB, podľa existujúceho klientovho súhlasu na potrebné zvýšenie rozpočtu. Predchádzajúce limity zachované. PageSpeed nemerané.

## Preview 0.6.11-rc.1 · 2026-10-15 · Dokončenie mobilnej dopravy a audit zelených

- Pokračovanie v existujúcej pracovnej vetve, pôvodný preview commit `fb75c3e` a stabilná v0.6.9 zachované. Bez merge, release tagu a produkčného nasadenia; loader zostáva v0.6.9.
- Iba mobilná doprava: voliteľný natívny výber odberného miesta pred posledným riadkom logo/cena; automatické grid riadky podporujú aj ďalšie sublabel riadky, chýbajúce logo a Apollo vnorené logo. Nadpis spolu s pôvodnou truck ikonou centrovaný ako flex skupina. Bez nového JS, DOM presunov alebo zásahu do platieb a desktopu.
- Živé kontroly 320/375/390/430 px, porovnanie platieb 375/390 a desktopovej dopravy 768/1024/1440 prešli. Prepnutie štyroch dopráv, AJAX HTTP 200 a otvorenie pôvodného pickup widgetu overené; 16 modelových kombinácií pre krátke/dlhé texty, nulu, chýbajúce logo/pickup, jeden/osem dopravcov a obe štruktúry loga. Limity a detaily: `docs/audits/green-20261015/README.md`.
- Analytický audit: 27 odtieňov, 161 záznamov so selektormi, pôvodom a stavom; vlastný/importovaný legacy kód, konfigurácia, externé Apollo, integrácie a shadow widget. Kompletný inventár, pozorované computed štýly, návrh s WCAG kontrastmi a vizuálne vzorky v `docs/audits/green-20261015/`. Žiadna farba sa neimplementovala; `tokens.css` byte-identický s v0.6.9. Návrh rámika/hover čaká na výslovný súhlas.
- Build/lint prešli; CSS 20 475 B (20,00 KiB) / limit 20 KiB, JS 25 164 B (24,57 KiB) / 30 KiB gzip. Limity rc.0 a starších verzií zachované; PageSpeed a reálny iOS Safari nemerané.

## Preview 0.6.11-rc.0 · 2026-10-15 · Mobilné karty dopravy

- Nová samostatná pracovná vetva nad predchádzajúcim preview `e67b3db`; pôvodné commity/tagy zachované, bez merge a produkčného nasadenia. Produkčný loader ostáva v0.6.9. Odmietnuté farebné experimenty v0.6.10 sa nepreberajú.
- Iba mobilná doprava: názov a doručenie cez celú šírku, pod nimi logo vľavo/cena vpravo, potom natívny odkaz na výdajné miesto. Zachované veľkosti písma, farby, polia, tooltipy a ovládanie. Žiadny nový JS ani presun/duplikácia DOM prvkov.
- Spoločné Shoptet selektory bez názvov/ID dopravcov, cien a nth-child. Podporované pôvodné súrodenecké logo aj logo vložené Apollom do ceny, chýbajúce logo/odberné miesto, jeden aj viac spôsobov dopravy.
- Overené živé rozloženie 320/375/390/430 px, porovnanie mobilných platieb a desktopovej dopravy s predchádzajúcim preview bez geometrickej/typografickej zmeny. Natívne prepínanie štyroch dopráv, AJAX HTTP 200 a otvorenie pôvodného pickup widgetu prešli. Ďalších 16 kombinácií overených na lokálnych dátach v natívnom markupe. Limity testov: `docs/previews/mobile-shipping-layout.md`.
- Klient povolil potrebné budúce zvýšenia kB rozpočtu; toto preview má CSS limit 20,0 kB a JS 30 kB gzip. Pôvodné rozpočty zostávajú zachované. Lint/build prešli.

## Nevydané · 2026-10-15 · Doprava, AJAX košíka a detail objednávky

- Bez zmeny palety v0.6.9, produkčného loadera alebo čísla verzie. Pracovná vetva `work`, izolované preview cez commit na `preview/shipping-cart-order-20261015`; bez merge, release tagu a produkčného nasadenia.
- Doprava: prezentačné rozdelenie natívneho textového názvu na výrazný názov a samostatný normálny riadok doručenia. Zachované hodnoty formulára, logá, ceny, tooltipy a odkazy na výdajné miesta.
- Košík: opravená príčina oranžového prebliknutia po AJAX. Rozmery `price-range` platia už pre nový serverový obsah pred inicializáciou `ts-*` obalov; zachytený chybný stav bol približne 246 px namiesto 6 px. Bez timerov, nových prekrytí alebo zásahu do prepočtov.
- Detail objednávky: lokálny štýl v natívnom Shoptet shadow root; oddelené produkty, doprava/platba, natívny finančný súčet, kontakty a responzívny layout. Skutočný stav objednávky zo schváleného read-only endpointu, bezpečný neutrálny vzhľad neznámych stavov. Len explicitná nulová cena dopravy/platby v EUR sa zobrazuje ako ZADARMO.
- Overené reálne AJAX prepočty, opakované plus/mínus, doprava/platba a checkout bez vytvorenia objednávky, desktop/mobil; reálny autentifikovaný detail s tromi produktmi pri 320–1920 px a porovnanie cien/odkazov s v0.6.9. Ďalšie počty produktov a stavy overené na lokálnych vzorkách v natívnom React komponente.
- Lint/build prešli v pôvodných limitoch, JS približne 24,57 / 30 kB gzip; CSS približne 19,75 / 19,75 kB (bez navýšenia). Skutočný iOS Safari, odoslanie objednávky a platobné brány neoverené, PageSpeed nemerané. Podrobnosti a limity: `docs/previews/order-detail-cart-followup.md`.

## v0.6.9 · 2026-10-14 · Košík, checkout a kontakty

Produkcia: klient nasadil 14. 10. 2026; overené živé načítanie v0.6.9 bez preview aj nákupný priechod po posledný krok bez odoslania objednávky. Detail nasadenia a drobný nález Apollo assetu: `ADMIN-CHANGES.md`.

Súhrn schválených zmien od posledného vydania v0.6.5 (vývojové preview 0.6.6–0.6.9):

- Prehľadnejšie desktopové aj mobilné produktové riadky košíka: názvy, kódy, dostupnosť, množstvo, jednotková a celková cena, odstránenie. Na mobile kompaktný spoločný riadok a oddelené ceny; pružné pole pre vysoké množstvá so zachovaním natívnych limitov a násobkov.
- Zjednotené množstvo v hlavnom košíku, mini-košíku a súvisiacom tovare; pri súvisiacich produktoch natívne pridanie zvoleného množstva, celé názvy a overené produktové údaje.
- Súhrn košíka s pôvodným dátumom doručenia, progressom dopravy zdarma a oboma tlačidlami v jednom paneli. Zelené checkout CTA, čitateľné aktívne kroky a sekundárne tlačidlá Späť.
- Konzistentné súhrny vo všetkých krokoch objednávky, ceny a hlavná akcia pred zoznamom produktov; oddelené kartičky Doprava/Platba. Statický sidebar a vnútorný desktopový scroll dlhého zoznamu, bez preskakovania pri inicializácii Apollo/AJAX.
- Kompaktné kontakty v checkoute: spoločné hodiny/stav podpory, telefón, kontaktný formulár a sociálne odkazy; správne medzery ikon. Mobilné menu s prehľadnými kontaktmi a rovnakou logikou otváracích hodín.
- Zjednotená dostupnosť a informačné vety: iba SKLADOM zelené a CENTRÁLNE SKLADY oranžové; zachované reálne ceny, termíny a skladové údaje.
- Opravené duplicitné mobilné filter panely pri resize a prekrytie kontaktov zatvoreným mobilným menu. Zachované pôvodné filtre, radenie, GRID/LIST, formuláre, košík a AJAX.
- Zachovaná existujúca produkčná oprava mobilnej galérie z 12. 10.: mobilné Colorbox rozmery sa vzťahujú len na add-to-cart popup a touch-only mouseout nespúšťa neotvorenú lupu. Oprava je teraz v zdrojových moduloch namiesto lokálneho CSS a podmienky loadera viazanej na v0.6.5.
- Overenie: regresná kontrola homepage/kategórie/detailu/košíka, 320–1920 px, radenie, filtre/reset, AJAX, 15 rôznych produktov a checkout bez odoslania objednávky; cielené overenie resize a interného scrollu. Lint/build prešli. Schválený CSS rozpočet 19,75 kB sa pri vydaní nemení; JS 30 kB.
- Skutočné iOS Safari, externé platby/výdajné miesta a odoslanie objednávky neboli automaticky dokončené. PageSpeed mobil pred/po: nemerané. Publikovanie GitHub release samo neprepína živý Shoptet; postup a rollback: `docs/releases/v0.6.9.md`.

### Vývojové záznamy preview 0.6.9 (historické)


- Opravy po regresnej kontrole (14. 10.): mobilný filter už nepoužíva natívnu triedu `filters-wrapper`, ktorá spôsobovala premiestňovanie a zvyšné duplicitné obaly pri resize. Teardown explicitne odstráni vlastné panely po obnovení natívnych uzlov. Zatvorené mobilné menu v checkoute počas prechodu šírky neprekrýva kontaktné odkazy; otvorenie ostáva pod natívnym Apollo stavom. Bez zásahu do cien, formulárov a produkcie. Lint/build v existujúcom limite. Detail: `docs/previews/cart-v069/regression-resize-fixes.md`.

- Malý follow-up nad `5264c2b`: desktopová obálka mala prirodzenú šírku 25,4 px v 18 px boxe, preto opticky pohltila skoro celú medzeru. Glyph box má teraz prirodzenú šírku, e-mail 12 px odstup, telefón zostáva na 8 px. Overené 1024/1280/1366/1600/1920 px a reload; desktopový panel 920×52 pri 1280+ zachovaný, mobilné pravidlá bez zmeny. Lint/build prešli v pôvodnom limite. Príprava merge/release pozastavená na pokyn klienta, iba opravené preview.

- Ďalší preview nad `850f6e0` (14. 10.): PC kontakty s reálnou 8 px medzerou ikona/text bez sčítaného Apollo paddingu; mobilné dva rovnocenné stĺpce s ikonami nad údajmi. Biele aktívne číslice, jednotná CTA plocha `#3a841f` s bielym textom (4,67:1), odstránený tmavý podklad právneho dodatku; hlavná zelená zostáva `#439d29`. Biely text pôvodného oranžového loginu obnovený. Spoločný selektor zachytí odlišný serverový DOM dopravy/platby aj v kroku 3, takže oba kroky majú rovnaké kartičky. Bez animácie responzívnych šírok sidebaru/CTA, bez floatingu. Overené všetky kroky pri 320–1920 px, natívny AJAX/15 reálnych produktov, stavové štýly a reload/klikateľné ikony. Lint/build prešli v existujúcom limite: CSS 19,71 / 19,75 kB, JS 22,18 / 30 kB. Vizuálne screenshoty, fyzický wheel/iOS a finálne odoslanie zostávajú neoverené. Bez merge/tagu/produkcie. Detail: `docs/previews/cart-v069/contacts-and-recap-followup.md`.

- Ďalší preview commit 14. 10. nad `60ac444`: svieža hlavná zelená `#439d29` a nevyhnutný kontrastný textový variant `#31771c`; biele veľké CTA 3,45:1, malý právny dodatok na kontrastnom podklade 5,55:1. Zrušené vlastné sticky/floating aj merací ResizeObserver; cena/CTA stále pred produktmi, stabilný 55vh desktop limit zoznamu. Mobil: odstránené natívne prázdne odsadenie pred hodinami, dve rovnaké kontaktné polovice, zúžené prechody bez animácie rozmerov, vycentrovaná ikona/nadpis a login s pôvodnou oranžovou. Overené 320/375/390/430 px, natívne AJAX/checkout aj 15 reálnych produktov; vizuálny screenshot a fyzický wheel nedokončil testovací prehliadač, ostávajú na manuálne overenie. Lint/build prešli: CSS 19,64 / 19,75 kB, JS 22,17 / 30 kB. Bez merge/tagu/produkcie. Detail: `docs/previews/cart-v069/fresh-green-static-summary.md`.

- Ďalšia dávka 14. 10. 2026 nad `7febe7e`: stabilné vizuálne obaly súhrnu pred Apollo `window.load` aj po AJAX; cena/CTA hore, produkty pod nimi. Kontakty sa dopĺňajú pri vzniku natívneho panela, desktopový povrch má stabilné rozmery. Jedna zelená `#387b20` pre checkout pozitívne stavy aj CTA (biely text 5,22:1). Oddelené riadky Doprava/Platba, zelená aj platená doprava so zachovaním reálnej sumy. Mobil: centrované kontakty/hodiny, telefón a email s deliacou čiarou, skryté sociálne ikony, kompaktné informačné bloky bez odrážok, centrovaná natívna fajka, symetrická hlavička Osobné údaje a login pod ňou. Overený natívny flow s 1 aj 15 reálnymi produktmi, AJAX, 320/360/390/430 px a notebook; fyzický wheel/iOS/odoslanie objednávky neoverené. Lint/build prešli, CSS 19,53 / schválených 19,75 kB iba pre preview 0.6.9; JS 22,53 / 30 kB. Detail a limity: `docs/previews/cart-v069/checkout-stability-2026-10-14.md`. Bez merge/tagu/produkcie.

- Cielené opravy 14. 10. 2026 nad `2dea483`: potvrdený natívny `removeAttr("style")` mazal maximálnu výšku súhrnu. Limit presunutý na zoznam s bezpečným CSS fallbackom, vlastné sticky pre checkout oddelené od inline posúvania Shoptetu. Ceny/súhlasy/CTA vizuálne nad produktmi, bez presunu alebo klonovania funkčných elementov. Checkout e-mail vedie presne na `https://www.timberstore.sk/kontakty/`. Mobil: usporiadané kontaktné riadky, centrovaná informačná ikona, cena nad logom v pravom stĺpci natívnych dopráv/platieb, centrovaná skupina nadpisu Osobné údaje. Zachované natívne formy a pickup linky. Lint/build prešli bez zvýšenia rozpočtu; CSS 19,24 kB, JS 22,12 kB. Testy/limity vrátane nedokončeného fyzického wheel testu: `docs/previews/cart-v069/checkout-2026-10-14.md`.

- Samostatné preview nad 0.6.8 `349c64f`, bez merge/tagu/produkčného loadera.
- Kroky 2/3: natívny Apollo zoznam produktov/dopravy/platby ako horný box s desktop scrollom; celkové ceny, súhlasy/právne texty a pôvodné CTA mimo neho v spodnom vizuálnom boxe. Bez klonovania alebo presúvania funkčných elementov.
- Sticky len pri dostatku miesta pre oba boxy, podľa skutočnej výšky spodného obsahu; nízky notebook používa scroll stránky, mobil bez vnoreného scrollu. Jeden idempotentný ResizeObserver, existujúci lifecycle a jediný resize handler.
- 28 px odstup ceny/CTA, jemná typografická hierarchia názov/metadáta/cena, tlmené množstvo a jednotky, výraznejšia celková suma. Schválené farby, lomítka pri jednotkách a úzke stĺpce zachované.
- V informačnej vete iba SKLADOM veľkými písmenami a zelenou; zvyšok vety bez zmeny. Pôvodné dostupnosti/počty a centrálny sklad bez zmeny.
- Klient schválil 19,25 kB CSS iba pre preview 0.6.9. Lint/build prešli; CSS 18,91 kB, JS 22,13 kB gzip. Testy a výslovné obmedzenia vrátane DOM fixtures pre 10/21 položiek a ručného wheel/trackpad overenia: `docs/previews/cart-v069/checkout-summary.md`. Žiadna reálna objednávka odoslaná.

## v0.6.8 · 2026-10-13 · Inkrementálne doladenie checkoutu (preview, nevydané)

- Ďalšie doladenie nad `8422e56`: scroll chaining bez blokovania stránky, užší 70/30 desktop súhrn, tmavý nadpis, bold názvy/množstvá a lomítko pri jednotkách. Iba slová CENTRÁLNYCH SKLADOV oranžové; CTA tmavšia zelená s bielym textom (4,95:1). Kontakty vpravo na desktope a usporiadané vľavo na mobile, klikateľné tel/mail ikony. Osobné údaje s label/input riadkami, nadpis vedľa login buttonu bez ZÁKAZNÍCKY ÚČET; odstup nad štátom. Natívne formuláre/ceny/handlery bez zmeny. Rovnaká verzia a rozpočet; detail: `docs/previews/cart-v068/checkout-followup.md`.

- Samostatné preview nad 0.6.7 `89e3505`; main, produkčný loader a tagy bez zmeny.
- Spoločná zelená `#66BF3A` podľa natívneho Apollo indikátora vybratej dopravy: hlavné checkout CTA, aktívny krok, dostupnosť Skladom, bezplatné ceny a potvrdzovacie akcenty. Súhrnný nadpis opäť Timber oranžový; tmavé CTA texty pre čitateľný kontrast, hover/focus/disabled stavy. Ostatné stránky zachovávajú paletu.
- Názov produktu v súhrne na samostatnom riadku, množstvo/jednotka a cena pod ním; väčšie medzery a oddelené položky dopravy/platby bez kurzívy.
- Desktop súhrny od 1200 px sticky s 200 px odstupom a vnútorným scrollom vysokých panelov; hlavné CTA približne 67 % šírky. Mobil bez sticky, natívne formuláre a tlačidlá zachované.
- Účet/prihlásenie a štát/hodnota vodorovne; meno, e-mail a telefón každý na vlastnom plnom riadku. Skryté country inputy, company/shipping polia a validácie bez zmeny.
- Kontaktný panel podľa šírky obsahu, bez rozťahovania medzery medzi nadpisom a hodinami. Existujúce kontakty a odkazy zachované.
- Iba existujúci oznam externého skladu nahradený oranžovým textom o centrálnych skladoch; ostatné tri riadky bez zmeny. Idempotentná synchronizácia cez existujúci lifecycle, bez nových listenerov.
- Klient schválil CSS rozpočet 18,75 kB iba pre preview 0.6.8; JavaScript zostáva 30 kB. Overenie a neoverené scenáre: `docs/previews/cart-v068/checkout-refinements.md`. Bez odoslania objednávky, merge alebo nasadenia.

## v0.6.7 · 2026-10-12 · Pravý súhrn košíka a spoločné kontakty (preview, nevydané)

- Apollo audit 13. 10. 2026: spoločné súhrny troch krokov, stabilné poradie produktov/dopravy/platby pred cenami aj pred vytvorením natívnych wrapperov. Neutralizovaný pôvodný 65 px odstup a biely pseudo-pás pred `after-load`, obnovený natívny medzisúčet a oddelenie spodnej časti. Zjednotené šírky odstránením 60 px sidebar paddingu a mobilných záporných okrajov; košík bez dodatočného JS shellu/presúvania tlačidla. Kontaktný box rastie a zalamuje celé bloky, e-mail vedie na kontaktný formulár, opravené vnorené telefónne odkazy Apollo. Nulové ceny používajú natívne numerické dáta a akcenty sa synchronizujú aj bez animation frame; platené metódy nepreberajú Apollo zelenú. Natívne formuláre, ceny a finálny submit bez zmeny logiky. Klient schválil CSS limit 18,25 kB iba pre preview. Po obnove prostredia zopakovaný lint/build a regresná kontrola troch krokov na 1920/1366/768/390/375/320 px; výsledky a limity v `docs/previews/cart-v067/apollo-audit.md`.

- Doladenie súhrnov 13. 10. 2026: živšia zelená iba pre súhrn, dlhší oranžový akcent, menší text dopravy zadarmo so zelenou sumou. Doprava/platba má jeden natívny vizuálny shell, Pokračovať nad Späť s 18 px odstupom, nezalamované jednotky a oddelené položky; širší sidebar a väčší odstup medzi textom, logom a cenou metód. Kontaktný panel odsadený od nadpisu, kontakty zarovnané doprava. Opravené preblikávanie: štýly nadpisu platia už pre serverový DOM, bez závislosti na neskoršom Apollo wrapperi, bez časovačov alebo zmeny loadera. CSS limit 18 kB iba pre preview schválený klientom; natívne formuláre, ceny a handlery bez zmien.

- Zjednotenie súhrnov 13. 10. 2026: spoločný zelený nadpis 20 px s tenkou oranžovou čiarou, zelený natívny dátum, zdieľané štýly cien/CTA pre Doprava & platba so zachovaným natívnym umiestnením tlačidiel. Mobilná celková cena má jemný ľavý border a 8 px odsadenie; desktop produktové riadky bez zmeny. Klient schválil limit 17,75 kB CSS iba pre toto preview; JS/produkcia bez zmeny.

- Kompaktné doladenie 13. 10. 2026: ikona/prefix/natívny červený dátum v jednom centrovanom menšom riadku, opravená špecificita návratového tlačidla (stred + 20 px odstup), desktop kontakty vodorovne v poradí nadpis/hodiny/telefón/e-mail/sociálne siete. Len CSS; produktové riadky a nákupné handlery bez zmeny. Základná desktop geometria a pôvodné hrefs overené, bez screenshotov a rozsiahleho testovania.

- Finálne doladenie 13. 10. 2026: mobilné množstvo/jednotková cena/celkom/odstránenie v jednom grid riadku od 360 px (pod 360 px kontrolované zalomenie), bez zmeny obrázka a informácií nad ním. Návrat do obchodu späť v jednom béžovom boxe s 16 px odstupom, centrovaný nadpis desktop/mobil. Cielené zobrazenie existujúceho telefónu a sociálnych odkazov v checkout kontaktoch a desktop lište; bez duplikovania kontaktov alebo zmien výpočtov.

- Doladenie 13. 10. 2026: overený /kontakty s natívnym formContact ako fallback desktop e-mailu, samostatný pôvodný návrat do obchodu mimo farebného boxu, mobilné centrovanie doručenia/dopravy, jeden teplý podklad celého súhrnu, mobilné kontakty iba s hodinami/bodkou bez dodatočnej stavovej vety. Bez zmien produktov, cien alebo nákupnej logiky.

- Klient schválil CSS limit 17,5 kB gzip iba pre preview 0.6.7; JS limit 30 kB a produkcia bez zmeny.
- Samostatná vetva nad návratovým preview 0.6.6 `83f5a71`; bez merge, tagu alebo nasadenia.
- Dvojstĺpcový košík od 1200 px, približne 70/30; jeden pravý súhrnný panel s natívnym dátumom, dopravou, progressom, cenami a pôvodnými CTA. Mobil má panel pod produktmi. CSS sticky iba od 1440 px pri výške aspoň 900 px.
- Nákupný košík v nadpise/prvom kroku, menšie medzery stĺpcov, kód za názvom a uppercase dostupnosti; native quantity, varianty a súvisiaci tovar zachované.
- Kontaktný panel „Potrebujete pomoc? Sme tu pre Vás:“ používa spoločné hodiny/stav podpory, pôvodné odkazy a ikony. Overené sociálne URL zdieľané ako fallback pre checkout bez footer profilov; hodiny aj sociálne odkazy dostupné v desktop lište od 768 px.
- „Vybrané pre Vás“ odložené: v natívnom DOM košíka nie je samostatný odporúčací produktový zdroj. Nevytvárame nový algoritmus ani duplicitné related produkty.
- Iba základná kontrola: add-to-cart, množstvo/AJAX/prepočet, otvorenie dopravy bez odoslania objednávky, desktop a mobil. Sticky pri dlhom zozname, ostatné šírky, varianty/zľavy a celý checkout zostávajú NEOVERENÉ na manuálne preview.

## v0.6.6 · 2026-10-12 · Nákupný košík (preview, nevydané)

- Ďalšie preview: desktop hlavička/stĺpce, natívne kódy a dostupnosť pod názvom, related metadata, mobilné ceny spolu, tri rovnaké footer panely a existujúce mobilné kontakty so spoločnou logikou zákazníckej podpory a sociálnymi odkazmi. Bez zmeny verzie, nákupnej logiky, merge alebo nasadenia. Súhrn: docs/previews/v0.6.6-cart-menu.md.

- Druhé preview: červený tučný dynamický dátum, CTA pod sebou, Timber hover názvov/krokov, related quantity/cena/natívna ikonová CTA v kompaktnom riadku, výraznejšia skladová typografia. Verzia zostáva 0.6.6; iba základné cielené overenie podľa zadania. Súhrn: docs/previews/v0.6.6-cart-refinement.md.

- Jednotné množstvo main/mini/related, pružná šírka čísla, rovnaké +/- a natívne min/max/step.
- Plné desktop názvy, dostupnosť na jednom riadku + počet pod ňou, tablet/mobil bez pretekania.
- Funkčné množstvo súvisiaceho tovaru z overených metadata verejného detailu, pôvodný native add-to-cart a násobky zachované.
- Kompaktnejší dátum doručenia, 6 px progress z natívnych dát/thresholdu, súhrn a sekundárny pôvodný Späť do obchodu; AJAX a reduced motion.
- Čitateľný hover/focus krokov objednávky; ceny dopravy/platby nepretekajú na úzkom mobile.
- Diagnostika: native config/HTML max 9999, serverový skladový limit testovaného produktu 178, multiply_order min/step 1000. Žiadne obchádzanie platformových alebo skladových pravidiel.
- Obmedzená client-approved CSS výnimka 17 kB iba pre preview 0.6.6; JavaScript limit 30 kB bez zmeny. Detailné výsledky, scenáre a limity overenia v docs/previews/v0.6.6-cart.md.
- Main, produkčný loader, tagy a release nezmenené; žiadny merge ani nasadenie.

## v0.6.5 · 2026-10-12 · Schválené doladenie hlavičky, košíka a pôvodnej Timber palety

Finálny súhrn od stabilnej v0.6.1; klient schválil preview 87ff73a k merge a publikovaniu.

- Hlavička: hlavná plocha košíka používa natívny odkaz, samostatná prístupná šípka otvára/zatvára náhľad cez Apollo API. Desktop hover, dotyk, klávesnica, Escape/focus, klik mimo, resize mobile clone a AJAX lifecycle bez násobenia listenerov.
- Service bar: stabilné teplé pozadie aj pri mega menu, hodiny PO – PIA (08:00 – 16:00), kompaktné kontakty a jemné oddeľovače. Pri 1440/1920 px všetkých päť odkazov bez Viac; natívny overflow helper na úzkych šírkach zachovaný.
- Pôvodná Timber identita: oranžová #D4884A naprieč CTA vrátane homepage karuselov, tmavé pôvodné nadpisy benefitov, overené pôvodné súbory a rozmery ikon. Biele názvy menu a biela ikona/cena/šípka desktop košíka; oceľový count badge #29465B s bielym číslom.
- Produktové karty: pôvodná CTA paleta a presný quantity CSS zo stabilnej verzie, zachovaná geometria a nákupná logika; požadovaný hover názvu pôvodnou oranžovou. Žiadne experimentálne preusporiadanie GRID kariet zo zahodených 0.5.6 preview.
- Košík/checkout: jemné úspešné hlásenia vrátane add-to-cart modalu, kontrastné zatváranie, neutrálny súhrn s tmavou cenou, teplá doprava a medený progress, čitateľný mobile mini-cart súhrn, aktuálne/dokončené/budúce natívne kroky.
- Overenie: Chromium 375/390/768/1024/1440/1920 px, quantity 1/10/100, add-to-cart, hover/touch/keyboard, natívne filtre AJAX/radenie/reset, GRID/LIST, všetky tri checkout kroky bez odoslania objednávky. Galérie a presné výsledky v docs/previews/v0.6.5-brand-palette.md a predchádzajúcich súvisiacich reportoch.
- Lint/build prešli; finálne CSS 15,80 kB a JS 17,54 kB gzip. Schválená 16 kB CSS výnimka je vo build skripte obmedzená na package version 0.6.5. Reálny iOS Safari a PageSpeed po nasadení neboli vykonané.
- Repozitárový loader pripravený na PROD v0.6.5; živý Shoptet HEAD sa cez GitHub release automaticky nemení. Rollback: PROD v0.6.1.

## v0.6.4 · 2026-10-12 · Targeted colour regression fixes preview (not released)

- Obnovené presné biele pravidlá hlavnej oranžovej navigácie z v0.6.1; tmavý hover na bielom podklade a geometria zachované. Header cart ikona/cena/šípka opäť biele na medenom desktope; oceľový počet zostáva.
- Produktový listing používa presné pôvodné CTA premenné (#D4884A / #B8692E) iba na jeho buttonoch. Quantity CSS obnovené byte-for-byte z v0.6.1; rovnaké rozmery, fonty, padding, glyph a layout overené v DOM. Názov/cena/skladovosť bez zmeny, požadovaný title hover pôvodnou značkovou oranžovou #D4884A.
- Kompaktné kontakty: 8 px gap, 8 px k oddeľovaču, 12 px deliaca čiara. Vlastník paddingu opravený, aby neskorší reset nelepil telefón na border. 1440/1920: všetkých päť odkazov bez Viac; úzke šírky používajú natívny helper. Béžové pozadie stabilné, pôvodné medené ikonky overené a zachované.
- 375/390/768/1024/1440/1920 px: porovnanie so stabilnou 0.6.1 aj predchádzajúcim preview, sidebar a horná časť karty bez regresie. Quantity 1/10/100, plus/minus, add-to-cart, mini-cart, sticky, neutral cart summary a nedotknuté detail/checkout CTA overené. Funkčné testy bez JS chýb.
- CSS-only oprava komponentov; aplikačný JS, Shoptet logika, main/tag/loader bez zmeny. Lint/build prešli v existujúcom preview rozpočte 16 kB CSS / 30 kB JS gzip. Dokumentácia a screenshoty: docs/previews/v0.6.4-regressions.md. Žiadna objednávka odoslaná; bez produkčného nasadenia.

## v0.6.3 · 2026-10-09 · Header/cart refinement preview (not released)

- Podľa nového zadania nadväzuje na farebný preview 0.6.2; nemení main, produkčný loader ani release/tag.
- Natívny odkaz na košík opäť naviguje kliknutím aj dotykom. Samostatná prístupná šípka používa Apollo popup API; desktop hover zostáva natívny, prázdny košík využíva rovnaké API. ARIA, Escape/focus, click outside, mobile clone a AJAX sú synchronizované bez násobenia listenerov.
- Trvalé teplé pozadie service baru pri mega menu, opravená CSS špecificita bez zvýšenia jeho z-indexu. Hodiny PO – PIA (08:00 – 16:00), jemné kontaktné oddeľovače.
- Add-to-cart modal používa rovnakú jemnú zelenú rodinu ako quantity toast, tmavý kontrastný X. Doprava a progress zjednotené aj v mobile mini-carte; súhrny neutrálne, oceľový badge a checkout stepper zachované.
- Responzívne UI a natívne interakcie overené na 375/390/768/1024/1440 px; kategórie bez meranej regresie geometrie či výšky dokumentu. Lint/build prešli v existujúcom preview rozpočte CSS 16 kB / JS 30 kB gzip. Natívna Apollo chyba backToTop je samostatne zaznamenaná, bez nesúvisiaceho workaroundu.
- Screenshoty, farby, rozsah a limity: docs/previews/v0.6.3-header-cart.md. Bez odoslania objednávky; bez produkčného nasadenia.

## v0.6.2 · 2026-10-09 · Unified colour system preview (not released)

- Izolovaný farebný návrh nad stabilným v0.6.1: zachované logo, rozloženie, native Apollo komponenty a obchodná logika. Produkčný loader/main/tag sa nemenia.
- Centralizované farebné role: značková meď, AA companion odtiene pre biele CTA a drobné odkazy, oceľovomodrý cart count/Novinka, neutrálne veľké plochy a jednotné úspešné/informačné/varovné/chybové správy.
- Košík a checkout: teplá doprava, technický súhrn, tmavá dominantná cena, čitateľné ceny bez DPH, jasné active/completed/future native kroky. Quantity success zachováva schválený jemný obvod/radius a používa zelenú sémantiku.
- Zladené filtre, sorting, count badge, sidebar support/TOP poradie, service CTA, formuláre, focus a dostupnosť. Green stock dátová logika zachovaná; centrálne skladové texty majú kontrastný oranžový odtieň.
- Vyčistené prepisované a nepoužívané legacy pravidlá; 856 → 771 !important v aktívnom legacy CSS. Nové important iba na overených inline farbách. Jediný JS diff je tokenizácia farebných literálov jeho existujúceho injected empty-cart CSS.
- Chromium 375/390/768/1024/1440 px; geometria, badge/sticky, quantity/add-to-cart, GRID/LIST, filter AJAX/sorting/reset, mobilné menu, login a native checkout po osobné údaje. Žiadna objednávka neodoslaná. Pred/po galéria a detailný audit: docs/previews/v0.6.2-color-system.md.
- Lint/build prešli. Klient schválil CSS limit 16 kB iba pre toto testovacie preview; JS zostáva 30 kB. PageSpeed po nasadení a reálny iOS Safari zatiaľ nevykonané; nejde o produkčný release.

## v0.6.1 · 2026-10-09 · Header, account and cart release preparation

- Mobilný „Súvisiaci tovar: počet (od cena)“ je v samostatnom riadku cez celý cart grid, bez nesprávneho zalamovania do úzkej automatickej bunky. Podporené oba natívne Apollo DOM varianty; related toggle a native add-to-cart zostávajú funkčné.
- Account ikona má jemný oranžový hover a jasnejší oranžový otvorený stav s napojením na popup. Login vstupy, fokus, sekundárna registrácia a zabudnuté heslo používajú bielu/teplú neutrálnu/Timber paletu; primárne oranžové prihlásenie a originál formulár/odkazy zachované.
- Mini-cart footer má stabilné poradie doprava → SPOLU → CTA. Súčet je kompaktný riadok s jemnými deliacimi čiarami, shipping text má 13 px a väčší odstup truck ikony. Hodnota SPOLU stále používa presnú natívnu header cenu, bez vlastného prepočtu/requestu.
- Cart trigger používa grid pre ikonu/badge, cenu a šípku; počet číslic rozširuje prvý cell a drží cenu oddelene. Orange otvorený/zatvorený trigger, 50 px výška a jedna Apollo šípka zachované. Odstránené redundantné legacy desktop cart pravidlá.
- Plus/minus v košíku sú pokojnejšie: tmavé symboly a teplý neutrálny povrch, pôvodná geometria, click target, jemný obvod a native AJAX zostávajú. Quantity success toast má teplý povrch, tmavý text a oranžový akcent; označuje sa iba pôvodná správa o zmene množstva. Role alert, text a auto-dismiss sa nemenia; ostatné notices/error ostávajú native.
- Natívne popup/cart CSS presunuté do `styles/overrides/` namiesto ďalšej vrstvy. Bez zásahu do produktových gridov/detailových related kariet, filtrov, footeru, neskorších checkout krokov alebo menu logiky.
- Chromium: desktop 1440/1280/1024/768 px; mobil 430/390/375 px, related toggle/add, quantity AJAX a súčet, account/login, success notice, skutočná doprava zadarmo, dlhý mini-cart a badge fixtures s 1–4 číslicami. Natívna minimálna objednávka 5 € je zachovaná. Lint/build prešli pri pôvodnom 30/15 kB gzip rozpočte. Podrobný report a limity: `docs/previews/v0.6.1.md`.
- Zahŕňa aj schválené úpravy preview 0.5.7–0.6.0 nad stabilnou 0.5.6: trojpásovú hlavičku, teplú servisnú lištu, kontakty/otváracie hodiny/sociálne odkazy, kompaktnejší hlavný riadok, ukotvené account/cart popupy, natívne desktop otváranie košíka a mobilný cart layout. Mobilná hlavička a kategóriové ovládanie zostávajú zachované.
- Finálne vizuálne opravy: jedna natívna otočná šípka košíka má polovičnú veľkosť 8 px; potvrdenie množstva má jednotný jemný 1 px oranžový rámik; otvorená ikona účtu má oranžový rámik zhora a po bokoch, s bielym spodkom. Registrácia zostáva tmavým textom na svetlom povrchu pri hoveri, fokuse aj stlačení; odstránené splývanie oranžového textu s oranžovým pozadím. Overené na 1440/768 px vrátane klávesnice a quantity AJAX.
- Dodatočný krátky fix prázdneho mini-košíka v rámci 0.6.1: produktový grid a hover platia iba pod natívnym `.popup-widget-inner.full`. Prázdny stav zachováva pôvodnú Apollo ikonu nad textom bez prekrývania. Overené po odstránení posledného produktu, opätovnom otvorení, na 1440/1280/1024/768 px a s mobilnou regresiou 430/390/375 px. Schválené opravené preview `1fa190cd45e246d6d8fe27be251171eb28e133c1`; používateľ výslovne požiadal zahrnúť fix do existujúcej 0.6.1 namiesto vydania 0.6.2.
- Schválené finálne preview `2ce6cba7805816d0bed9dcca4032ae3bf0cf731f` pripravené na main. Package/lock sú 0.6.1 a `shoptet/loader.html` má pripravený PROD `v0.6.1`. GitHub tag/release a vloženie loadera do Shoptetu sú samostatné nasadzovacie kroky; touto prípravou sa živý web nemení.

## v0.6.0 · 2026-10-07 · Header / cart refinement preview

- Servisný pás má stabilnú výšku 36 px už na natívnom markupe pred JS inicializáciou, bez stránkových offsetov. Rozostupy informačných odkazov zväčšené na 20 px; pôvodné texty, href, bodky a overflow menu zostávajú.
- Header košík ostáva oranžový aj otvorený; jedna natívna šípka označuje stav. Zelený count badge s tmavým textom a jemným bielym okrajom, výraznejšia 17 px cena, väčší odstup od ikony. Zachovaný oranžový keyboard focus a native desktop toggle z 0.5.9 namiesto presmerovania.
- Mini-cart má 420 px šírku a max. 600 px / dostupný viewport. Samostatný vnútorný scroll zoznamu, dostupný footer a CTA. CSS grid nad pôvodným Apollo markupom: obrázok/názov, potom kompaktnejšie quantity + výrazná cena + červená delete akcia. Natívne formy, množstevné limity, AJAX a ceny sa nemenia.
- Nový izolovaný idempotentný modul `cart-presentation` synchronizuje „Celkom za tovar“ z natívnej header ceny do footeru, aj po AJAX; žiadne nové requesty alebo vlastné prepočty. Prázdny košík súčet skryje. Doprava zadarmo je kompaktnejšia s väčším odstupom truck ikony; pôvodná CTA zachovaná.
- Mobilná skutočná cart stránka `.in-kosik #cart-wrapper` pod 768 px má jednotnú štruktúru obrázok/názov/dostupnosť a quantity/cena/remove, 44 px dotykové plochy, zachované jednotky a čitateľný natívny súčet s neutrálnym shellom. Podporené oba natívne DOM varianty aj po zúžení už načítanej desktop stránky košíka. Ďalšie checkout kroky ani desktop cart stránka sa nemenia.
- Cart/account ukotvenie a povolený native scroll-close fallback z 0.5.9 zachované. Menu/submenu kontinuita, search, mobilný header a návrat medzi breakpointmi overené bez zmeny logiky.
- Chromium: všetkých sedem desktop šírok 768–1920 px, mobil 375/390/430 px, osem produktov a vnútorný scroll, AJAX quantity/delete/súčet, CTA, account a stabilita pásu na siedmich typoch stránok. Lint/build prešli v gzip rozpočtoch. Podrobnosti a limity: `docs/previews/v0.6.0.md`.
- Iba preview, bez merge/tag/release. Main a produkčný loader sa nemenia; produkty, filtre, sidebar, footer a ďalší checkout bez zásahu.

## v0.5.9 · 2026-10-07 · Desktop header popup fixes preview

- Izolovaná oprava/refinement preview 0.5.8. Informačné odkazy servisnej lišty majú horizontálny padding 16 px namiesto 8 px, väčšie rozostupy okolo pôvodných bodiek, bez zmeny textov/href, výšky 36 px alebo zarovnania kontajnerov. Apollo overflow helper zostáva natívny.
- Počet položiek v header košíku používa existujúci Apollo zelený odtieň #66BF3A a tmavý text #20242A (kontrast 6,74 : 1). Kompaktný badge zachováva rovnaký vzhľad v otvorenom aj zatvorenom stave.
- Odstránený default modrý cart outline; klávesnicový fokus má jemný Timber oranžový tieň. Otvorený cart/account trigger má biely povrch, zladený jemný border a rovné spodné rohy napojené na pôvodný popup.
- Desktopový cart trigger, jeho suma, badge a pôvodná šípka prepínajú mini-cart cez overené `shoptet.popups.showPopupWindow`, namiesto navigácie alebo Apollo hovered prvého kliku. Presmerovanie ostáva iba na natívnom CTA „Pokračovať do košíka“. Enter/Space/ArrowDown a tabletový touch toggle podporované; mobilné redirect/role atribúty sa obnovujú pri návrate pod 768 px.
- Popupy majú jedného scoped vlastníka štýlov, fixed súradnice podľa skutočného triggera a obmedzenie podľa viewportu. Pri začiatku scrollovania dokumentu sa cart/login zatvoria cez natívne API (povolený fallback pre animovanú Apollo sticky hlavičku); po opätovnom otvorení sa znovu ukotvia. Žiadne samostatné plávajúce panely.
- Mini-cart používa pôvodné názvy, obrázky, ceny, množstvá a mazacie formuláre. Jednotnejšia typografia, jemné riadky a kompaktné ovládanie; spodná shipping časť má menej whitespace, 3 px jemný progress pás, menší text a zreteľné oranžové CTA. Login form, registrácia a zabudnuté heslo zostávajú pôvodné.
- Custom listenery a observéry sa pri AJAX nenásobia. Žiadna zmena cart business logiky, produktov, filtrov, sidebaru, homepage, footeru, search alebo menu logiky. Objednávkové stránky bez natívneho mini-cartu ostávajú bez nového ovládania.
- Chromium: 1920 / 1600 / 1440 / 1366 / 1280 / 1024 / 768 px; hover, opakovaný click, chevron/badge/amount, keyboard, scroll-close/reopen, account fields/buttons, AJAX quantity a delete, vnútorné CTA. Tablet touch 768 px, mobile 375/430 px a desktop ↔ mobil restoration prešli. Menu/submenu kontinuita overená na 1024/1280/1440/1920 px, search suggestions rovnaké ako 0.5.8. Lint/build prešli. Reálny Safari a prihlásený zákazník neboli testovaní; PageSpeed sa nemeral.
- Preview vyžaduje schválenie. Main a produkčný loader sa nemenia; bez merge, tagu a release.

## v0.5.8 · 2026-10-07 · Header refinement preview

- Refinement preview 0.5.7 iba v hlavičke: zachovaná trojpásová štruktúra, pôvodné informačné odkazy, oranžová navigácia a natívna Apollo logika.
- Servisná lišta zostáva vysoká 36 px; písmo 13 px a ikony 18 px zlepšujú čitateľnosť. Hodiny, telefón a e-mail používajú váhu 600, ľavé odkazy zostávajú ľahšie.
- Hodinovú ikonu nahrádza bodka: zelená PO–PIA od 08:00 vrátane do 16:00 výhradne, inak Timber oranžová. Výpočet používa Europe/Bratislava vrátane letného/zimného času; jeden časovač aktualizuje stav každých 30 sekúnd a po návrate do tabu. Text hodín zostáva bez zmeny; stav má aj textový prístupný popis. Sviatky nemajú samostatný kalendár.
- E-mailový text je na desktope mimo odkazu; klikateľná je iba natívna ikona, smerujúca na existujúci kontaktný formulár `/kontakty`. URL bola overená v natívnom contact-boxe aj na cieľovej stránke. Pod 768 px sa obnoví pôvodná Apollo mailto štruktúra.
- Desktop search je vycentrovaný v pôvodnom strednom priestore, s maximom 500 px a šírkou 70 % od 1200 px: približne −33,5 % na 1280 px a −34,2 % na 1440 px oproti 0.5.7. Tablet si ponecháva dostupnú šírku; natívny formulár a AJAX návrhy sú zachované.
- Account trigger má čistý 50 × 50 px neutrálny povrch, radius 8 px, výšku a vertikálne zarovnanie s košíkom, jemný otvorený stav a viditeľný klávesnicový fokus. Pôvodný login popup a jeho merané ukotvenie sa nemenia.
- Natívny count badge v hlavičke má biele pozadie a tmavý text. Odstránené staré skrývanie cart šípky; jedna pôvodná Apollo pseudo-šípka reaguje na `cart-window-visible` / `aria-expanded`, s rešpektovaním reduced-motion. Bez nového cart handlera alebo zmeny cart logiky.
- Overenie v Chromium na 375 / 430 / 768 / 1024 / 1280 / 1440 / 1920 px: mobile porovnanie s 0.5.7, email DOM pri prechode desktop ↔ mobil, login / Escape / ukotvenie, AJAX idempotencia, rovnaké reálne search suggestions, natívne menu, anonymné pridanie produktu a trvalý stav košíka po načítaní stránky, count badge, otvorená/zatvorená šípka a sticky popup. Štrnásť časových prípadov overilo hranice otváracích hodín, víkendy a DST aj pri systémovom časovom pásme America/New_York. Lint/build prešli a gzip rozpočty sú splnené.
- Preview je izolované na samostatnej vetve. Main, produkčný loader, produkty, filtre, sidebar a obsah homepage sa nemenia. Bez merge, tagu a release; PageSpeed ani reálny iOS Safari sa nemerali.

## v0.5.7 · 2026-10-07 · Header / service bar preview

- Izolované preview zo schváleného buildu 0.5.6: tri pásy hlavičky — teplá neutrálna servisná lišta #F4F1ED s výškou 36 px, biely hlavný riadok a existujúca oranžová kategóriová navigácia. Natívne kontajnery majú spoločné horizontálne zarovnanie.
- Pôvodné informačné odkazy a ich href zostávajú zachované, vrátane natívneho Apollo overflow menu. Telefón a e-mail už nemajú samostatný sivý box. Pridané otváracie hodiny PO – PIA: 08:00 – 16:00 a drobné oranžové ikony; sociálne odkazy sa preberajú z existujúcej pätičky, bez odhadovaných URL alebo externej knižnice.
- Hlavný riadok má kompaktnú výšku 90 px, pôvodné logo, dominantné natívne vyhľadávanie a účet iba s ikonou. Prihlasovacie tlačidlo si zachováva prístupný názov aj Apollo ovládanie. Košík, suma, počet položiek, formuláre a menu handlery sa nemenia.
- Nahradené konfliktné legacy rozmery loga, padding hlavičky a pevné popup offsety. Pôvodné prihlasovacie a košíkové popupy sa zarovnávajú podľa skutočných ovládacích prvkov aj pri resize, sticky hlavičke a opakovanej AJAX inicializácii; listenery sa nenásobia.
- Od 768 px platí desktopová/tabletová úprava. Pod 1200 px sú otváracie hodiny skryté pre dostatok miesta; pod 768 px zostáva natívna mobilná hlavička a nové sociálne odkazy/hodiny sú skryté. Bez zásahu do produktov, filtrov, sidebaru, detailu alebo obsahu homepage.
- Overenie v Chromium: 375 / 430 px mobil, 768 / 1024 / 1280 / 1366 / 1440 / 1600 / 1920 px desktop/tablet, resize, native search suggestions, anonymné pridanie do košíka, prihlasovací popup / Escape / fokus, sticky hlavička a opakovaná inicializácia. Porovnanie natívneho mobilného layoutu a kategóriového menu s 0.5.6. Reálny Safari, prihlásený účet a Shoptet administrácia neboli testované; PageSpeed nebol meraný.
- Preview vyžaduje schválenie pred merge/tagom/release. Produkčný main a loader zostávajú bez zmeny.

## v0.5.6 · 2026-10-07 · Production frontend audit fixes

- Položka VIAC v desktopovej navigácii má rovnakú veľkosť textu, vertikálne zarovnanie a jednu spoločnú šípku ako kategórie. Natívne Apollo presúvanie položiek pri zmene šírky zostáva zachované.
- Oranžový pás hlavičky je zarovnaný so sliderom: odstránený legacy posun −10 px a viewportová šírka; používa skutočnú šírku hlavičky bez scrollbar gutteru.
- Informačný oznam má nižšiu prioritu než natívne cookies a dialógy; neblokuje nastavenia cookies.
- Pôvodný Apollo krížik oznamu má prístupný názov, fokus a ovládanie Enter / Space cez existujúcu zatváraciu logiku. Inicializácia je idempotentná aj po AJAX.
- Odstránený horizontálny presah desktopovej homepage neutralizovaním páru záporných marginov a kompenzačného paddingu sekcie welcome.
- Cena bez DPH v produktových kartách má tmavší sekundárny text pre dostatočný kontrast na bielom pozadí, bez zmeny rozloženia.
- Nadpisy H1 a zahodené preview úpravy produktových kariet nie sú súčasťou zmeny. PageSpeed nebol meraný.
- Overenie v Chromium: cookies na 320 / 375 / 390 / 414 / 768 / 1024 / 1440 / 1920 px, odmietnutie aj súhlas, zatvorenie oznamu myšou a klávesnicou, opakovaná AJAX inicializácia; geometria homepage a kariet oproti mainu bez zmeny. Kontrast ceny bez DPH na bielom pozadí 4,82 : 1. Mobilný filter/reset, desktopové GRID/LIST, natívne radenie s AJAX a mobilná galéria prešli.
- Navigácia VIAC, geometria šípky, zarovnanie oranžového pásu a natívne otváranie/zatváranie overené na 768 / 992 / 1024 / 1200 / 1280 / 1366 / 1440 / 1600 / 1920 px vrátane opakovaného resize a sticky hlavičky. Mobilná navigácia na 320 / 375 / 414 px zostala bez zmeny.
- Schválené preview `b6d0b1f98c2b54821bfbdc896f47a1142e8f5379` pripravené ako build 0.5.6 na samostatnej vetve. Produkčný merge, tag a nasadenie sa vykonajú v samostatnom kroku.

## v0.5.5 · 2026-10-06 · Mobile category controls

- **Mobilné ovládanie** · Samostatný modul `mobile-category-controls` iba pod Apollo breakpointom 768 px. Dva rovnocenné horné buttony FILTROVAŤ / aktuálne RADENIE; dropdown piatich možností nahrádza pôvodné sorting chipy. Pôvodné Shoptet/Apollo sorting tlačidlá a ich natívna AJAX logika zostávajú zdrojom pravdy.
- **Filter popup / overlay** · Celý existujúci `#filters` sa presúva bez klonovania checkboxov, formulárov alebo slidera do spoločnej oblasti pod toolbarom. Naraz je otvorený iba filter alebo radenie. Absolute overlay neposúva produkty ani nemení výšku dokumentu; pôvodný wrapper nezaberá miesto. Dlhý obsah scrolluje vo vnútri panela a zatvorené accordiony nevytvárajú prázdny scrollovací priestor.
- **Timber Store vzhľad** · Zjednotené fonty, rozmery buttonov, biele panely, jemné Timber bordery, radius 12 px a tieň. Odstránené čierne active/focus/hover stavy radenia a konfliktné telefónne legacy štýly. Tmavý text, Timber oranžová a jemné aktívne pozadia; Cena, Dostupnosť, Značky a parametre majú rovnakú geometriu. Zachovaná jedna natívna Apollo šípka `h4::after` a natívny stav `is-active`; otvorenie sa neodvodzuje od focusu.
- **Dlhé zoznamy** · Prvých 10 hodnôt a ovládanie Zobraziť viac / Zobraziť menej. Vybrané hodnoty zostávajú viditeľné aj mimo prvých desiatich; rozbalenie sa zachováva po AJAX prekreslení.
- **Počty produktov** · Celkový počet pod toolbarom je centrovaná sekundárna informácia. Počty pri jednotlivých hodnotách sú vpravo v jednom stĺpci, bez zátvoriek a bez „ks“. Jemný neutrálny count badge má min. 32 × 23 px, radius 5 px, centrovaný sivý text a pozadie #FAF8F5; väčšie čísla ho prirodzene rozšíria.
- **Reset filtrov** · ZRUŠIŤ VŠETKY FILTRE používa pôvodný Shoptet reset odkaz a jeho natívnu AJAX akciu. Zruší cenu, dostupnosť, značky a parametre naraz, obnoví výpis a zachová aktuálne radenie. Sekundárna spodná lišta zostáva dostupná mimo scrollujúceho obsahu a zobrazuje sa iba pri aktívnych filtroch; reset synchronizuje UI a zatvorí popup.
- **Responzivita / iPhone SE** · Overené šírky 320 / 375 / 390 / 414 px v Chromium mobilnej emulácii, vrátane viewportu 320 × 568. Dlhé „Najpredávanejšie“ používa ellipsis a neprekrýva šípku; popup nepretečie vodorovne. Badge overené pre 1–4 číslice. Reálny iOS Safari nebol v cloud prostredí testovaný.
- **AJAX / accessibility** · Idempotentná inicializácia po filtrovaní, radení a načítaní ďalších produktov, bez násobenia listenerov. Zachované natívne Apollo accordiony, doplnené ARIA stavy, klávesnicové ovládanie, Escape a zatvorenie klikom mimo popupu.
- **Desktop bez regresie** · Mobilné štýly sú obmedzené pod 768 px; desktopové a tabletové pravidlá zostávajú zachované. Pri návrate na desktop sa obnoví pôvodné umiestnenie natívnych DOM uzlov, reset odkaz aj Apollo handlery. Porovnania na 768 / 992 / 1200 / 1440 px a opakované prechody desktop ↔ mobil prešli.
- **Overenie / schválenie** · Natívne radenie, Cena, Dostupnosť, Značky, Farba, Rozteč úchytiek, dlhé zoznamy, vybrané hodnoty, AJAX reset aj nemenný scrollHeight overené na živom Apollo DOM. Finálne preview `eb92414179bdf447120e44e596ed0bc786fa48a8` schválené používateľom. Lint a build prešli; gzip rozpočty JS ≤ 30 kB / CSS ≤ 15 kB splnené. Nové PageSpeed meranie sa nevykonávalo.

## v0.5.4 · 2026-10-06 · Mobile category bestsellers
- **Mobil / tablet** · Natívny blok „Najpredávanejšie“ je pod 1200 px úplne skrytý, takže sa už nezobrazuje v hlavnom obsahu kategórie.
- **Desktop** · Bez zmeny; kategóriové bestsellery zostávajú v ľavom sidebare od 1200 px vyššie.
- **Apollo** · Oprava je čisto CSS a rešpektuje breakpoint šablóny bez zásahu do DOM alebo produktového výpisu.

## v0.5.3 · 2026-10-06 · Category heading
- **Nadpis kategórie** · Bočné deliace čiary sa rozťahujú na celú dostupnú šírku hlavného obsahu; názov zostáva presne vycentrovaný.
- **Apollo** · Bez zmeny DOM a bez zásahu do šírky obsahového stĺpca.

## v0.5.2 · 2026-10-06 · Category UI
- **Podkategórie / Apollo** · Doplnený rovnomerný horizontálny aj vertikálny odstup medzi kartami bez zmeny natívnych stĺpcov Apolla; karty sa už rámikmi nedotýkajú.
- **Karty podkategórií** · Jemný stále viditeľný rámik, zachovaný hover, radius a tieň.
- **Mobil** · Menší horizontálny gutter, aby sa nezúžili karty viac než je nutné.

## v0.5.1 · rozpracované
- **Category UI** · H1 kategórie centrovaný s jemnými čiarami po stranách.
- **Podkategórie** · väčší rozostup medzi riadkami, biele karty s radiusom a jemným tieňom; hover zvýraznenie na desktope bez zásahu do Apollo rozloženia.
- **Mobil/tablet** · zachované Apollo rozloženie; kategóriové bestsellery ostávajú skryté pod 1200 px.
- **HEAD loader** · čistejší zápis bez ternárneho `document.cookie` warningu v Shoptet editore; `PROD` je opäť čitateľná verzia `v0.5.0`.

## v0.5.0 · 2026-10-05 · GitHub migration
- Dokončená migrace Timber custom kódu do GitHubu.
- Produkční Shoptet používá GitHub bundle; staré FTP soubory zůstávají pouze jako záloha a nejsou načítané.
- Záloha původního produkčního stavu je zachována ve větvi `backup/pre-cutover-v0.4.2-2026-10-05` a v `shoptet/backup/2026-10-05/`.
- **CI / migrace** · Automatické build notifikace pro každé dílčí uložení byly vypnuty; migrační workflow je nově pouze ruční. Tím se omezí zbytečné GitHub e-maily a build se spustí až při kontrolním bodu.
- **Footer platby** · Inline skript pro Visa / Mastercard / Google Pay / Apple Pay převeden do idempotentního modulu `footer-payments`. Starý inline skript zatím zůstává aktivní; oba výstupy jsou vizuálně stejné, takže produkce se nemění.
- **Migrace `timber-custom.css`** · Aktuální v175 je nyní jako přesná legacy kopie uvnitř GitHub bundle (`src/legacy/timber-custom-v175.css`). V preview se zatím načte společně se starým FTP souborem, takže lze ověřit beze změny produkce; odstranění FTP include přijde až po kontrole.
- **Migrace `timber-menu.js`** · Původní monolitický skript rozdělen do čtyř idempotentních modulů: klikací karty horního menu, aktivní cesta sidebaru, čištění produktových textů a kompaktní desktopový filtr. Preview dočasně blokuje starý `timber-menu.js`, aby neběžela stará i nová logika současně.
- **Migrace custom kódu do GitHubu** · Záloha aktuálních souborů `timber-custom.css`, `timber-menu.js`, `timber-kategorie-banner.css/js` a `timber-empty-cart.js/css` uložena do `shoptet/backup/2026-10-05/`.
- **Homepage kategorie** · `timber-kategorie-banner.css/js` převeden do standardního modulu `homepage-categories` (`src/modules/`), bez starého dynamického načítání `timber-menu.js`. Produkce zatím beze změny; externí soubory se odstraní až po preview kontrole.

## v0.4.2 · 2026-10-05 · kategorie / sidebar
- **Najpredávanejšie v kategórii** · Pôvodný veľký blok nad výpisom produktov je na desktopoch presunutý do ľavého sidebaru a z hlavného obsahu odstránený.
- **Apollo sidebar** · Nový blok používa natívny vzhľad widgetu TOP 10 produktov, takže má rovnaké orámovanie, radius, vnútorné rozloženie a štýl položiek.
- **Poradie sidebaru** · Kategórie → Najpredávanejšie v kategórii → Sme tu pre vás → TOP 10 produktov.
- **Mobil / tablet** · Nový blok Najpredávanejšie v kategórii sa nezobrazuje pod 1200 px.
- **Apollo kompatibilita** · Úprava pracuje vo `.sidebar-inner`, presúva celé widget kontajnery a odstraňuje prázdny wrapper po presune TOP 10.


## v0.4.1 · 2026-10-05 · M2, C3
- **C3** · Názov produktu v tabuľkovom zobrazení je tučný (`font-weight: 700`) namiesto bežného rezu 400.
- **M2 / animace** · Mobilní animace košíkového popupu zůstává zachovaná, ale její rychlost je zkrácená na 120 ms pouze při otevření po přidání do košíku; ostatní Colorboxy zůstávají beze změny.
- **M2** · Mobilní okno po vložení do košíku: pevná šířka od prvního snímku odstraní roztažení popupu z pravé strany; výška je omezená na viewport a delší obsah se posouvá uvnitř okna.

## v0.4.0 · 2026-10-02 · C3, drobnosti
- **Drobnosti** · Instagram na homepage jako úzký pás: všech 9 příspěvků v jedné řadě, široké jako obsah stránky (lícuje s patičkou), dlaždice max. 160 px – na 1920 px ~146 px (dřív přes celou šířku okna, ~360 px na 1440 px monitoru). Na mobilu a tabletu jedna řada posuvná prstem (~2,4 fotky vidět po ~135 px, aby šel přečíst text příspěvků; max. 180 px) místo mřížky 2 × 2. Tlačítko „Sledovať na Instagrame“ pod pásem, už nepřekrývá další blok; menší mezery kolem. Počet příspěvků nastaven v adminu (viz ADMIN-CHANGES).
- **C3** · Odznak s počtem kusů v košíku byl na tlačítku „Do košíka“ vpravo uříznutý: vedle pole pro množství sahá tlačítko až k okraji dlaždice a dlaždice ořezává, co přečnívá. Odznak je teď v rohu tlačítka, nepřesahuje ho.
- **C3** · Tabulka (Riadky) čitelnější, varianta B2 schválená v návrzích (jen tabulka, mřížka beze změny): název produktu se už neořezává na 2 řádky – zalomí se, kolik potřebuje, a je normálním (ne tučným) písmem 14,5 px. „Do košíka“ je kulaté tlačítko jen s ikonou košíku, „Detail“ kulaté se šipkou ›, takže název má víc místa (1280 px: 182 → 274 px, 1440 px: 254 → 462 px; nejdelší názvy 3 řádky místo oříznutí). Pod názvem „Kód: 496544“ šedě a tence na všech šířkách – samostatný sloupec Kód (od 1440 px) zrušen, jeho místo dostal název. Písmo o 1–2 px větší: kód a dostupnost 13 px (z 10,5/11), cena 16 px (z 14,5), „bez DPH“ a jednotková cena 11,5 px, záhlaví 12 px, množství 14 px. Méně tučné: dostupnost a záhlaví 500, cena 700.
- **C3** · Detail produktu: kód a značka pod názvem 12,5 px a tmavší (šablona 10 px šedě).

## v0.3.1 · 2026-09-30 · oprava
- **Oprava (v0.3.0)** · Okno „Produkt bol pridaný do košíka“ – blok „Ostatní zákazníci tiež nakúpili“: na mobilu ceny a tlačítka odjely mimo obrazovku (o 452 px). Blok má stejné `#products.products-block` jako výpis, takže na něj působila úprava výšky dlaždic (K5). Všechny úpravy výpisu (dlaždice, tabulka, TB1, pole pro množství, odznak košíku) jsou teď jen pro skutečný výpis (`#products:not(.products-related)`). Okno je zase jako bez našeho kódu – původní rozpad dlaždic v něm řeší karta M3.
- **C3** · Přepnutí Mriežka ↔ Riadky bez animace: po návratu na mřížku se názvy produktů „zvětšovaly“ z 13,5 na 18 px (přechody šablony 0,3 s). Přechody jsou vypnuté jen na okamžik přepnutí, hover efekty dlaždic v mřížce zůstávají.

## v0.3.0 · 2026-09-29 · první nasazení
Obsahuje i v0.1.0 a v0.2.0 (nikdy nenasazené, jen tagy / rc).

- **M1** · Hlavní slider na homepage jde na mobilu posunout prstem (swipe nad stávajícím Bootstrap carouselem). Obrázky ostatních slidů se přednačtou, jakmile je stránka načtená a prohlížeč volný; na dotykových zařízeních slide za 350 ms místo 600 ms (desktop beze změny).
- **M1** · Fotky na detailu produktu jdou na mobilu přepínat prstem (přepíná náhledy galerie Shoptetu, na první/poslední fotce se zastaví, lightbox se tahem neotevře). Pás náhledů se posune, aby byl aktivní náhled vždy vidět; velké fotky sousedních náhledů se přednačítají. Na dotyku vypnutý zoom Shoptetu nad fotkou (při rychlém swipování zůstával viset se starou fotkou); klepnutí dál otevírá lightbox.
- **M1** · Swipe reaguje jen na dotyk (mobil/tablet). Myš na desktopu se chová jako bez našeho kódu.
- **Drobnosti** (PR #1) · submenu bez tmavé čáry; bez tečky na konci horního pruhu; logo 200 × 44 px v hlavičce i ve sticky hlavičce; stín pod bílým textem banneru (M4); Instagram 2 × 2 na mobilu; celé názvy podkategorií na mobilu (M5); filtr značek bez zalamování (K3); stejně vysoké dlaždice produktů a zarovnaná tlačítka; nenápadné „Späť“ v košíku (i při najetí myší); iPad na šířku bez postranního panelu, produkty po 3 (TB1).
- **C3** (PR #2) · Přepínač Mriežka / Riadky nad výpisem (kategorie, vyhledávání; desktop od 992 px, volba se pamatuje). Riadky = tabulka: obrázek, název, kód, dostupnost, cena, množství, košík; řazení podle ceny v záhlaví přes řazení Shoptetu (oba směry). Pole pro množství (− / + i psaní) v mřížce i v tabulce, zaokrouhluje na celá balení z doplňku Násobky objednávky. Odznak s počtem kusů v košíku. Přepis klientovy rozpracované verze (nikdy nenasazené).
- Loader: `PROD = ''` vypne náš kód pro zákazníky, preview funguje dál. Štítek preview ukazuje načtený tag/commit. Kód se spouští až po DOMContentLoaded (dynamicky vložený skript mohl z cache naběhnout dřív než `<body>`).
- **C4** · řazení podle dostupnosti se neprogramuje: výchozí řazení „Odporúčame“ už řadí skladem napřed (klientův doplněk Brani). Otevřené: produkty „Objednané“ mezi „Skladom“ – nastavení Brani.
- PageSpeed mobil (Lighthouse 12, medián 3 měření): před — homepage 46 (LCP 9,4 s, CLS 0), kategorie 42 (LCP 6,0 s, CLS 0) / po —

## v0.1.0 · nenasazeno (jen tag)
- Základ repa: core (detekce stránky, registr modulů, preview štítek), loader, build s kontrolou rozpočtu.
