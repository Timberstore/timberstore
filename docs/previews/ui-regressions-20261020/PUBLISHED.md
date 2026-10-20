# Immutable preview — v0.7.1-rc.1

- **[Otvoriť preview](https://www.timberstore.sk/?ts_preview=ff681ac9c1f789e4a848cd5ac13bf7d6d49478f8)**
- [Košík](https://www.timberstore.sk/kosik/?ts_preview=ff681ac9c1f789e4a848cd5ac13bf7d6d49478f8) · [AGOFORM / živý popup](https://www.timberstore.sk/vyhladavanie/?string=354068&ts_preview=ff681ac9c1f789e4a848cd5ac13bf7d6d49478f8) · [TULIP detail](https://www.timberstore.sk/tulip-knopka-jota-zlata-matna/?ts_preview=ff681ac9c1f789e4a848cd5ac13bf7d6d49478f8)
- Presný testovaný commit: **`ff681ac9c1f789e4a848cd5ac13bf7d6d49478f8`**.
- Vetva: `preview/ui-consistency-20261020`. Následný commit upravuje iba túto dokumentáciu a dôkazy publikovania; nemení testované CSS/JS.
- [CSS CDN](https://cdn.jsdelivr.net/gh/Timberstore/timberstore@ff681ac9c1f789e4a848cd5ac13bf7d6d49478f8/dist/timber.min.css)
- [JS CDN](https://cdn.jsdelivr.net/gh/Timberstore/timberstore@ff681ac9c1f789e4a848cd5ac13bf7d6d49478f8/dist/timber.min.js)

Oba stiahnuté CDN súbory sú **bajtovo zhodné** s lokálnym finálnym buildom: [hash/bytes/URL](evidence/assets.json). JS 33 107 B gzip / CSS 28 869 B gzip; limity 32,5 / 28,25 KiB sa nezvyšovali.

**[Skutočný CDN smoke](evidence/cdn-smoke.json): PASS 1440 / 390 / 320 px.** Browser používal normálny produkčný loader s parametrom preview a verejné CDN assets, bez lokálnej náhrady CSS/JS. Overené homepage, kategória a oranžové listing controls, živý AGOFORM popup, natívny nákup, košík bez sivého vnútorného panelu, modré hlavné ceny, natívna AJAX zmena množstva a detailové metadata. Žiadny horizontálny overflow ani nové JS výnimky.

**[Samostatná čistá produkčná relácia](evidence/production-observed.json): `v0.7.0`, `preview=false`.** [Scope proof](evidence/scope.json): main a starý tag zachované, loader bez zmeny. Žiadny merge, nový tag, release, administrácia Shoptetu, objednávka alebo platba.

Návrat na bežný web: [vypnúť preview](https://www.timberstore.sk/?ts_preview=off). Do Shoptetu netreba nič kopírovať.

Safari/WebKit, fyzický iPhone a živý externý variant feed zostávajú **NOT VERIFIED**. Fixture/replay testy sú oddelené v [hlavnom reporte](README.md); živý popup je osobitne doložený skutočnými odpoveďami a nákupmi na troch šírkach.
