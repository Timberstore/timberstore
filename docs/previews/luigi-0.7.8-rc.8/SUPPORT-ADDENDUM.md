# Prepared only — not sent or published

V našepkávači TIMBER STORE pri prázdnom vstupe sa medzi „Populárne články“
zobrazuje položka „Stránka nenájdená“, URL `/stranka-nenajdena/`.
Dôkaz: `rc8-1440-empty.png`; skutočný výsledok má `data-type="article"`,
`href="/stranka-nenajdena/"` a `data-autocomplete-value="Stránka nenájdená"`.

Prosíme identifikovať pôvod tejto položky v indexe/konfigurácii a pripraviť
podporované vylúčenie výhradne tejto systémovej chybovej stránky z odporúčaných
článkov aj vyhľadávateľných článkov, bez vypnutia platných článkov, kategórií alebo
značiek. Pred zmenou dodať export pôvodných hodnôt, presný konfiguračný rozdiel a
postup návratu; publikácia až po schválení majiteľom. Príčinu nepripisujeme feedu,
Mergadu ani konkrétnemu nastaveniu bez overenia. V repozitári položku neskrývame CSS.

Ostatné existujúce požiadavky zostávajú v `../luigi-0.7.8-rc.4/SUPPORT-REQUEST.md`.
