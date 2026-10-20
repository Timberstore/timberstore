# Opakovanie overení

Node, Chromium a `playwright-core`; v tomto prostredí `/usr/bin/chromium` a `/opt/codex/cua_node/lib/node_modules/playwright-core`. Iné cesty: `CHROMIUM_PATH` / `PLAYWRIGHT_CORE`. Harness používa zdedené sieťové/proxy nastavenia cez curl; neobsahuje tokeny ani credentials. Púšťať iba proti autorizovanému TimberStore testovaciemu košíku: skripty naozaj pridávajú produkty do anonymnej relácie, ale nevytvárajú objednávku ani platbu.

Z koreňa repo najprv `npm run lint && npm run build && git diff --check`, potom napríklad:

```sh
node docs/previews/ui-regressions-20261020/verification/layout.cjs
node docs/previews/ui-regressions-20261020/verification/live-popup.cjs
node docs/previews/ui-regressions-20261020/verification/gallery.cjs
node docs/previews/ui-regressions-20261020/verification/shipping-summary.cjs
node docs/previews/ui-regressions-20261020/verification/visual-more.cjs
node docs/previews/ui-regressions-20261020/verification/cold-final.cjs
BEFORE=1 node docs/previews/ui-regressions-20261020/verification/cold-final.cjs
WIDTHS=1440,390,320 DELAY=0 NAME=normal node docs/previews/ui-regressions-20261020/verification/cold-final.cjs
WIDTHS=1440,390,320 NAME=long SLUG=k-blum-legrabox--zasuvka-c-pure-450mm-40kg--tip-on--cierna--skrutka--komplet- node docs/previews/ui-regressions-20261020/verification/cold-final.cjs
```

Ďalšie skripty zodpovedajú tabuľke v hlavnom reporte. Výstup JSON sa pri novom behu zapisuje vedľa skriptu; pôvodné `../evidence` sú zachované výsledky tejto verifikácie. Screenshoty zapisujú do `../images`; pred opakovaním prípadne pracovať v samostatnom checkoute.

`browser.cjs` zachováva živé document/AJAX/serverové cookies a verejné Shoptet assets; nahrádza iba Timber CSS/JS lokálnym `dist`. Baseline/reference pochádzajú z `git show 47f7f16:dist/...` / `git show v0.7.0:dist/...`. `cdn:true` nič z toho nenahrádza a slúži na publikovaný smoke.

`fixture.json` je explicitná snapshot odpoveď nedostupného externého variant feedu. `fixtures/native-popup.html` je zachytený natívny HTML obsah, používaný iba v replay layout/záťaž testoch. `live-popup.cjs` nepoužíva ani jeden fixture; čaká na skutočný GetExtendedOrder a serverové cart quantity. V `shipping-summary` sú presné zostatky 1,97/91,72/1 234,56 výslovne iba layout fixtures. DOM fixture manipulácie sa nikdy nedostávajú do produkčného kódu.
