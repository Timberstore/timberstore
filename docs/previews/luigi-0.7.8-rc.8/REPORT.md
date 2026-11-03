# LB1 · 0.7.8-rc.8 · kompaktný našepkávač

Nový kandidát na schválenie v existujúcom [PR #68](https://github.com/Timberstore/timberstore/pull/68).
Toto odovzdanie opravuje konkrétnych sedem regresií našepkávača. Nie je vyhlásením
akceptácie celej Luigi integrácie ani opakovaním predchádzajúcej inventarizácie.

- **Build 0.7.8-rc.8**, nemenný commit **197550549a296603eb6fc307bd9921966fde8a2d**.
- [Zapnúť preview](https://www.timberstore.sk/?ts_preview=1975505).
- [Skutočné screenshoty vedľa seba](index.html): pôvodný Luigi / odmietnuté rc.4 / rc.8.
- Produkcia a loader zostávajú **v0.7.7**. Žiadny merge, release tag, produkčné
  nasadenie, zmena Luigi/Shoptet administrácie ani odoslanie objednávky.

## Referencia a rozsah

Referenciou je pôvodný Luigi na čistej produkcii v0.7.7, nie natívna TOP karta ani
maketa. Pred úpravou boli zachytené produkcia a odmietnuté rc.4 na rovnaký výraz
**BLUM 450**, vrátane prázdneho vstupu s populárnymi frázami. Každá verzia a rozlíšenie
používajú samostatný nový browser kontext bez zdieľaných cookies. Screenshoty vznikli
3. 11. 2026 cez Chromium na skutočnom webe s externým Luigi; finálne rc.8 snímky
načítavajú verejné CDN assety bez interceptovania či nahradenia dát.

| Rozlíšenie | Pôvodný Luigi | Odmietnuté rc.4 | rc.8 |
|---|---|---|---|
| Desktop 1440 × 1000 | panel 960 × 535 | panel 960 × 820 | panel 960 × 535 |
| Mobil 375 × 812 | panel 375 × 1141 | panel 375 × 1470 | panel 375 × 812, vnútorné posúvanie |

Metriky sú v `metrics-original.json`, `metrics-rc4.json`, `metrics-rc8.json`.
Obsah a poradie živých výsledkov môžu kolísať. Full-size PNG majú rovnaké rozlíšenie;
nie sú to orezané makety. Príčinu regresie tvorili naše konfliktné AC pravidlá v
`luigi-preview.css`: `width:100%` zmenilo pôvodné dvojice na vysoký jeden stĺpec; `height:auto!important` odstránilo ohraničenie vnútorných stĺpcov a ponechalo iba limit celej plochy `100vh − 180px` (pri1000px teda820px).
Tieto pravidlá nahrádza jedna preview-only AC vrstva. Ostatné Luigi selektory a ich
deklarácie ostali nezmenené (`scope.json`). Nákupné pravidlá a handlery sa nemenia;
kompilovaný JS je bajtovo rovnaký po nahradení samotného čísla verzie rc.4 → rc.8.

## Konkrétne nedostatky

| Bod | Stav | Oprava a dôkaz |
|---|---|---|
| 1 · Príliš vysoký panel | **FIXED** | Desktop opäť 535 px, krátky viewport má limit `100dvh − 180px`. Mobil je ohraničený viewportom. Porovnanie `rc4-1440/375-typed.png` → `rc8-1440/375-typed.png`; krátky desktop v `short-desktop/`. |
| 2 · Pretekajúci ľavý stĺpec | **FIXED** | Vlastná obmedzená výška a `overflow-y:auto`, miesto pre branding pod obsahom. Hranice stĺpca zostávajú v paneli aj pri prázdnom vstupe s dlhšími návrhmi; `*-empty.png`, geometria v metrikách. |
| 3 · Prázdne miesto nad Top fotografiou | **FIXED** | Prirodzený tok od nadpisu, obrázok 160 px hneď pod ním, potom celý názov, sklad, cena a pôvodný nákup. Žiadne vertikálne centrovanie vo vysokom stĺpci; `rc4-1440-typed.png` → `rc8-1440-typed.png`. |
| 4 · Vysoké produktové riadky | **FIXED** | Pôvodná desktopová mriežka 2 × 3 vo výsledkovom stĺpci, malé contain obrázky, odstránené nadbytočné minimá/auto marginy. Technické názvy zostávajú celé. Ceny a akcie v každej dvojici majú rovnaké Y (`functional.json`). Mobil kompaktný zoznam so skutočnými vendor akciami. |
| 5 · X mimo panelu | **FIXED desktop** | X má vlastné miesto vpravo hore 12 px od okrajov, 32 × 32 px; hlavička výsledkov rezervuje jeho priestor. Klik zatvára panel. Na mobile sa zámerne zachováva pôvodné Luigi ovládanie: šípka späť vľavo, X vpravo vo vstupnom poli slúži na zmazanie výrazu. Nezamieňame tieto funkcie ani nepridávame handler. |
| 6 · Nevyvážené stĺpce | **FIXED** | Tri hlavné stĺpce: približne 211 / 239 / 509 px z 960 px. Kategórie/značky, Top, výsledky; zachovaná pôvodná šírka panelu. Presný pôvodný vendor breakpoint: do 1020 px mobil, od 1021 px desktop; reálne snímky `responsive/`. |
| 7 · Tmavé hranaté frázy | **FIXED** | Svetlé pozadie `#f5f0e9`, decentná hrana, radius16, tmavý text, pôvodná klikacia akcia. `rc4-1440/375-empty.png` → `rc8-1440/375-empty.png`, farba/radius v `functional.json`. |
| Dlhý obsah / všetky produkty | **FIXED** | Tlačidlo má vlastný riadok pod výsledkami, bez sticky prekrývania poslednej ceny. Pri nízkom desktope a na mobile treba posúvať vnútro. `*-scroll-end.png`, `scroll-*.json`: buttonTop ≥ lastBottom. Klik otvorí výsledky správneho výrazu. |

Na desktopových, mobilných, hraničných a krátkych snímkach bola vykonaná vlastná
vizuálna kontrola výšky, hraníc stĺpcov, rozstupov, fotografie, zarovnania cien/akcií
a konca zoznamu. Build ani HTTP200 nie sú použitým kritériom vizuálnej akceptácie.

Rc.5 **a0a6641** vznikol počas tejto opravy. Pri krátkej obrazovke bolo ešte
zistené sticky prekrytie poslednej ceny; preto nebol predložený ako finálny kandidát.
Jeho commit sa neprepisoval. Rc.6 odstránil prekrytie tlačidlom; kontrola posunutého zoznamu následne odhalila vrstvenie štítkov cez hlavičku. Rc.7 bez sticky hlavičky zase neudržal čisté miesto pod X pri posúvaní. Finálny rc.8 izoluje vrstvy jednotlivých výsledkov a zachováva nepriehľadnú sticky hlavičku pod X. Tlačidlo zostáva v bežnom toku. Všetky staršie preview commity/tagy zostávajú dostupné. Voľné čísla sa overili proti vzdialeným
referenciám a existujúcej histórii preview; nevznikol žiadny nový release tag.

## Funkčné kontroly a hranice

`functional.json` obsahuje čerstvé UI-only testy rc.8: Top aj bežný výsledok na
1440 × 1000 a 375 × 812. Referenciou je vždy aktuálny natívny detail toho istého
produktu v oddelenom čistom kontexte, vrátane predvoleného množstva/minima/kroku,
jednotky a hrubej ceny. Identifikátor sa číta z hlavného produktového formulára,
nie z odporúčaných kariet.

| Produkt | Ovládanie | Očakávanie podľa natívneho detailu |
|---|---|---|
| 237597 · BLUM skrutka | Top, desktop aj mobil | 100 ks, minimum/krok100; 0,09 €/ks, spolu9 € |
| 255401 · K-BLUM Legrabox komplet | Bežný výsledok, desktop aj mobil | 1 sada, minimum/krok1; 118,08 €/sada, spolu118,08 € |

Pri každom nákupe sa overuje výsledný serverový košík: správna SKU, množstvo,
jednotková cena s jednotkou a celková cena. Jeden klik musí vytvoriť práve jeden
`addCartItem` POST a jednu udalosť `ShoptetCartUpdated`. Zachytáva sa aj existujúci
Luigi click s produktovým resource URL a consent. Nijaký handler sa nenahrádza,
žiadne interné API sa nevolá priamo. Tieto skúšky sú regresným overením našepkávača,
nie novým tvrdením, že sú splnené všetky skoršie nákupné scenáre integrácie.

Navigácia: všetky produkty, klik na frázu, desktopové X a mobilná šípka späť. Luigi na mobile zatvára panel presunutím mimo viewportu (x=−375), nie `display:none`; preto samotné Playwright `isHidden()` nie je vhodným dôkazom zatvorenia. Samostatný test a screenshoty `mobile-back.json` / `mobile-back-original.png` / `mobile-back-rc8.png` porovnávajú pôvodné a aktuálne správanie.
`controls-and-rollback.json` overuje živé „Skladom“ (491405) a „Centrálny sklad“
(237597): existujúci klientom schválený Emerald token `#00c853`, oranžová `#c97a2b`,
technická modrá cien `#2454a6`, nákupná oranžová `#d4884a`.

- **NOT TESTED:** Safari a fyzické iOS/Android zariadenia; prostredie poskytuje Chromium.
  Mobilné screenshoty sú Chromium viewport/touch emulácia, nie Safari.
- **BLOCKED:** existujúca obsahová položka „Stránka nenájdená“ v populárnych článkoch (`/stranka-nenajdena/`). Je viditeľná aj v dôkazoch; CSS ju neskrýva. Presná neodoslaná požiadavka je v [SUPPORT-ADDENDUM.md](SUPPORT-ADDENDUM.md).
- **NOT TESTED:** vendor reporting po spracovaní udalostí na serveri.
- **BLOCKED, bez zmeny v tejto oprave:** širšie dátové/šablónové požiadavky na DPH,
  skladové počty, editáciu množstva/nezávislý násobiteľ, varianty/neobjednateľnosť,
  sémantický Komplet a externé vypnutie dvoch homepage widgetov. Zostávajú podľa
  [existujúceho zoznamu](../luigi-0.7.8-rc.4/REPORT.md) a
  [pripravenej požiadavky podpore](../luigi-0.7.8-rc.4/SUPPORT-REQUEST.md).
  Táto oprava ich nepredstiera funkčným vizuálnym ovládaním.

## Zapnutie, vypnutie a návrat

1. Otvoriť [rc.8 preview](https://www.timberstore.sk/?ts_preview=1975505) v samostatnom
   profile. Overiť badge `PREVIEW 1975505`, `Timber.version=v0.7.8-rc.8` a
   `TimberLoader.preview=true`. Preview cookie platí iba v tomto profile; zákazníci
   bez nej ostávajú na v0.7.7. Pri načítaní musia doraziť JS aj CSS.
2. Vypnúť cez [ts_preview=off](https://www.timberstore.sk/?ts_preview=off), potom
   prejsť na URL bez preview parametra. Overiť `preview=false`, `version=v0.7.7`,
   chýbajúcu triedu `ts-luigi-preview` a assety s `@v0.7.7`.
3. Toto je zároveň rollback testera: v produkcii sa nič nepreplo, takže sa nerobí
   žiadna administrátorská zmena ani produkčný rollback. Stabilný návratový bod je
   tag **v0.7.7**, commit **f0bfec1128d82a5f48a749991a00ce11d33e4f04**. Main ostáva
   **03d3ea78f565c12e6be8bd414670dc3b0e9b25df**; PR zostáva draft.
4. **Externé nastavenia v tomto kole: žiadne zmeny.** Pôvodné nastavenia neboli
   publikované ani prepísané. Vypnutie preview nevracia existujúce vendor nastavenia;
   samostatný export a selektívne vypnutie homepage widgetov naďalej vyžadujú
   schválený zásah podľa existujúcej požiadavky podpore.

Pri dvoch prvých snímkach priebežného rc.7 prekročila navigácia limit25 sekúnd; neboli započítané ako úspešné kontroly. Snímky sa zopakovali s limitom60 sekúnd a podmienkou skutočne načítaného CSS. Nevyvodzujeme z toho overenie spoľahlivosti všetkých externých služieb.

Lint/build: PASS, JS36.09/CSS34.77 KiB gzip; limity preview36.25/34.875 KiB.
Stabilné limity a loader sa nezmenili. Reprodukcia: skripty `capture.cjs`,
`test-regression.cjs`, `test-controls.cjs` vyžadujú `PREVIEW_HASH=1975505` a povolený
prístup k živému webu/CDN/Luigi. Nákupný skript používa iba dočasné čisté košíky.
