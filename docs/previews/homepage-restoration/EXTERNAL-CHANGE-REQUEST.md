# Návrh pre Luigi podporu/admin — NEODOSLANÉ, NEPUBLIKOVANÉ

Majiteľ 2. 11. 2026 uviedol, že doplnok bol nasadený dnes a očakával iba
vyhľadávanie. Výslovne nechce dodatočné homepage odporúčacie sekcie.
Prosíme pripraviť podporovanú testovaciu konfiguráciu obnovy pôvodnej homepage.
Žiadnu zákaznícku konfiguráciu nepublikovať bez majiteľovho schválenia.

| Inštancia | Pôvodný pozorovaný runtime | Požadovaný výsledok |
|---|---|---|
| homepage_personalized | user_conversion_based, Size8, slovenský rc_title_hp_perso „Vybrali sme pre Vás“, vykresľuje sa za benefitBanner | Neinitializovať a nevykresľovať túto homepage inštanciu |
| homepage_last_seen | last_seen, Size8, rc_title_lastseen „Naposledy ste si prezerali“, template až pri items.length>2 | Neinitializovať a nevykresľovať túto homepage inštanciu |

Nejde o presun widgetov na iné miesto ani ich display:none. Pôvodný Shoptet,
Apollo, kategóriový modul Timber, 12 pôvodných kategóriových odkazov a produktové
sekcie majú zostať v pôvodnom poradí. Search/Autocomplete nechať aktívne.
Nezastavovať celý bootstrap, Recommender globálne, analytiku alebo nákupné akcie.

Ostatné nájdené inštancie basket, product_detail a basket_popup sa týmto
návrhom automaticky nevypínajú ani neschvaľujú. Ich parita s pôvodným webom
je otvorená podľa priložených požiadaviek majiteľa a auditov v PR68.

Pred prípravou zmeny žiadame:
1. Export konfigurácie a identifikátor/verziu publikácie + dostupný audit log.
2. Presné názvy podporovaných admin polí a ich existujúce hodnoty pre obe
   inštancie. Tie z verejného JS nemáme; neodhadovať ich ako enabled=true.
3. Diff týchto polí pre ich selektívnu deaktiváciu, v testovacej konfigurácii
   dostupnej iba explicitnému preview. Žiadny zásah do ostatných umiestnení.
4. Oficiálny preview odkaz a rollback cez presný export pôvodných polí/verzie.
5. Overenie aj s existujúcou históriou prehliadania (aspoň3 vrátené items),
   čistou reláciou a pri všetkých podporovaných jazykoch.

Samostatný H1 „Nábytkové kovanie a príslušenstvo“ je náš zdrojový kód, nie
Luigi nastavenie. Jeho odstránenie má samostatný repo preview 0.7.7-rc.5.
Git rollback sa nepovažuje za rollback vendor nastavení.
