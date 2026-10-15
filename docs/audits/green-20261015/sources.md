# Rozsah skenovania

Audit aktuálneho pracovného kódu, nie úplnej Git histórie. 96 sledovaných projektových súborov CSS/SCSS/JS/MJS/HTML/SVG/JSON (SCSS sa nenašli), sedem načítaných externých CSS, dva zachytené natívne DOM dokumenty a CSS reťazec natívneho shadow widgetu. Navyše štyri build artefakty vrátane sourcemáp a živé dynamické style elementy. Node_modules, .git a textové historické dokumenty/screenshoty nie sú runtime zdroje; pred týmto auditom dokumentácia neobsahovala ďalšie CSS/JS/HTML súbory. Nový samostatný swatches.html obsahuje ukážky aj navrhované odtiene, je analytickým výstupom a nie je importovaný e-shopom. Súpis nižšie identifikuje každý skenovaný zdroj a jeho SHA-256.

CSS tokenizer číta aj vnorené @media/@supports, deklarácie a aliasy premenných. Kontrolované HEX 3/4/6/8, RGB/RGBA, HSL/HSLA, named colours a var() reťazce; zelené rodiny sú posudzované podľa RGB/HSL hodnoty, vrátane bledých pozadí. V autorovaných deklaráciách nájdených odtieňov je zápis HEX a named green; samostatná ďalšia zelená RGBA/HSL hodnota nebola nájdená. Odvodené opacity/filter odtiene popisuje súhrn. Rastrové fotografie, logá dopravcov ani farebné vzorky produktov nie sú paleta stavového UI. CSS background-image SVG, ak obsahuje farbu, je súčasťou skenovania; vektorové/rastrové vzdialené assety neboli analyzované pixel po pixeli.

Externé CSS je snímka načítaná 15. 10. 2026, nie vlastný spravovaný kód repozitára. Pri pomenovaných dizajnových tokenoch bez lokálneho spotrebiteľa nie je možné tvrdiť, že ich nepoužíva externý JS alebo iný widget. Pri alternatívnych hodnotách var() inventár uvádza potenciálne odtiene; účinnosť sa overuje kaskádou a computed vzorkami.

| Súbor / URL | Pôvod | SHA-256 |
|---|---|---|
| eslint.config.js | Timber konfigurácia/HTML | `50d608c10809f319f5377fab1e07b61a6047b88c7029be35302d8f54afee64a4` |
| package.json | Timber konfigurácia/HTML | `f324dd1cca07d137ea5f3204ebae83002b792afb0cb58143425fdc44c0a0ccc5` |
| scripts/build.mjs | Timber konfigurácia/HTML | `3b2534bdaa0e54bfd03576d9f24e8a82da8d9669ebfc905ad59c0014592469c5` |
| scripts/wait-cdn.mjs | Timber konfigurácia/HTML | `a830f066800d8ed76d207e62dab80308a4073a6f5a944d15606097881d30e67f` |
| shoptet/apollo-config-current.js | Timber konfigurácia/HTML | `91ffb2eca2551c5d1409e297ccd867b457e87a6f52c973d3651301c247687969` |
| shoptet/backup/2026-09-26-zahlavi.html | Timber archív | `358f626f3c334c0abc85babe96b005e4991770e595e497fd8c4be651f7867bb6` |
| shoptet/backup/2026-10-01-timber-custom-v173.css | Timber archív | `8818dc60df644fc7bb079b799d43d365ecf82abdf9b8d9fa7b63cec7ab7bc2b8` |
| shoptet/backup/2026-10-05/live-body.html | Timber archív | `daf02611b0ea2b67ce0d5e0730400f8e3eb7807a07b18fddabf9d83e43778dc1` |
| shoptet/backup/2026-10-05/live-head.html | Timber archív | `57912dde4ccaf83b0a07a3674196e887644094c8754a209c530317edd1433e6b` |
| shoptet/backup/2026-10-05/timber-custom-v175.css | Timber archív | `8e0e51f4c85306fedb25d3975632e517a6cb523820c65cf3007b5611e4556158` |
| shoptet/backup/2026-10-05/timber-empty-cart-fixed.css | Timber archív | `5011879d2c90d4719f470a0dec8a71254c16fd397dce536364ae81153ad20c39` |
| shoptet/backup/2026-10-05/timber-empty-cart.js | Timber archív | `f77939899c35867338844fbfcc7686ad76e43ff8afd74006acfaf10dc4bc9dc8` |
| shoptet/backup/2026-10-05/timber-kategorie-banner.css | Timber archív | `44f3177a21017b6405b3185fc8b62f90862e89b0f62dfeacc415d90165626f71` |
| shoptet/backup/2026-10-05/timber-kategorie-banner.js | Timber archív | `5ed7b91032263b76451151baff764b80f15d6d67c868bb8ea274b25f68469b01` |
| shoptet/backup/2026-10-05/timber-menu.js | Timber archív | `0ea2d97ff6a751d613c3a3b2deace65563fc8c117d847cd43a495d09b17a2586` |
| shoptet/loader.html | Timber konfigurácia/HTML | `f0adb1d609c74919820d5c1653d2b0c3ba31c89d0542d804692fd88e204f2a69` |
| shoptet/target/body-after-migration.html | Timber konfigurácia/HTML | `794a36dc23ebee36b9030b740b5368fdaf623ffaba27277bf3cbd662ec770a52` |
| shoptet/target/head-after-migration.html | Timber konfigurácia/HTML | `0d16368d49397c60cb41f9021015916c86db1ff7b17e629115767b3d73b332c6` |
| src/core/cart.js | Timber | `96afd8bb4fc99b092669f134bd4d76494dadb43e74ae4ad0fc9a707b174f25ed` |
| src/core/contacts.js | Timber | `4f8d1f6b501854b8703dd974a8271d8bb0b8d34354f30507ab63aa84837b604c` |
| src/core/events.js | Timber | `5fea39733fe2034fef7ee55eb90e1c5b1b8e25a2d5f236f23633e152a49a9509` |
| src/core/idle.js | Timber | `712250fc402671fd6c16fffff6b9e031ceb7606abd931eaf9cd5e16b76c6b8c1` |
| src/core/index.js | Timber | `7d4c83581cf24757990d561497f2d69c942f605d3aa14a4c732c916098bd0757` |
| src/core/log.js | Timber | `be7b9f28652c1841a02d1863c0dcfd7cf2d527cd5c23909824d07e586d52f277` |
| src/core/order.js | Timber | `1e34ab87286bcc3fe46faa0b210a1e6f15ec3be216652523f8ca2d46af51b5e5` |
| src/core/page.js | Timber | `90ead5a60e9f8357a7053153b53951a0d5a12d2b1090e5669f1185f99cf198e9` |
| src/core/selectors.js | Timber | `0bd2c6af27b9efbc587a602b5941a5e39797479e73e5605e930acab110a6d6c3` |
| src/core/shipping.js | Timber | `c1c06f0aa76112b8caaed513d47fa3ee6819e0106e1eb095edfe8dc340c94342` |
| src/core/swipe.js | Timber | `cf1545e973bb01c7180c42fd680cf41342ea6a431ff347c8e640079434f6d3fe` |
| src/core/texts.js | Timber | `e0c290155d0b69f028efeb4ae754c6ba7567ec913bf4744b5f77bfbc99108778` |
| src/legacy/inline-head.css | Timber legacy | `8ff0b0595312cb9cbe0358f5fbdb7a3d4e31c3900b1a9636003e3cc797162068` |
| src/legacy/list-view/list-view.css | Timber legacy | `f67df65567c03cedac447dc0dfb6799e3e1950b5f103b76f2fe0a06dd8b6a433` |
| src/legacy/list-view/list-view.js | Timber legacy | `fbd6c5ca8d6be35616fddf2acc51b96fb451ddd263c442a0100418ff105f07d6` |
| src/legacy/page-loading.js | Timber legacy | `4144dea83a0169557bebd5d06670f543ba527970e2324596496b7a5d41cc72df` |
| src/legacy/timber-custom-v175.css | Timber legacy | `71d67383133092eab931096ccefab1ae671b2d66f0ec5c2283aa48666012b319` |
| src/legacy/timber-empty-cart-fixed.css | Timber legacy | `5011879d2c90d4719f470a0dec8a71254c16fd397dce536364ae81153ad20c39` |
| src/legacy/timber-empty-cart.js | Timber legacy | `69e0e2af099aec8957c78a04a3f4bea596cafe6c3fdd442756fc119ba249edf8` |
| src/legacy/timber-menu-guard.js | Timber legacy | `fddc3fa3aacb57b4fdf279ca6e245f9119d341b4ea836c65218238b36cfe6a0e` |
| src/legacy/top-category-addon.css | Timber legacy | `830d981dbe2322642d387630b39082c8e647276c35d70b277740853508930342` |
| src/main.css | Timber | `b715130ffe5e8e53c37c5f74368bd1aa3a68ffbe2dda1043e8cfccb45b36fca8` |
| src/main.js | Timber | `1e52dca5e1bf7642b00dbd24d66c7a1ffbfd375d50c39870d94ee6cd70fe100b` |
| src/modules/carousel-swipe/carousel-swipe.css | Timber | `a206f2ae78244e27719df951caaec4ecfd56a24abd47b084b584dd18eba1db6c` |
| src/modules/carousel-swipe/index.js | Timber | `9587383882645b1877b08fc15eccac675e69edff92620ed60f3660046524328a` |
| src/modules/cart-count/cart-count.css | Timber | `40647e23aaba4aef03aa8891bb9198e34329c5887316f3022b680e341750a26e` |
| src/modules/cart-count/index.js | Timber | `363718ec5a22ca1505bfa4331ecb10f7ce28ec4e740856239ab839fe2d5a69d0` |
| src/modules/cart-modal-speed/index.js | Timber | `3dd6860a6bfc24e5dfb6cf2a7ad8ff9638b7b4bf8c00eb44f7a32077b3588a46` |
| src/modules/cart-presentation/bottom.js | Timber | `7cab2fe9588dd256041382b94eee7519a0e89b3dd3392c37215fd1c79d734b5f` |
| src/modules/cart-presentation/checkout.js | Timber | `bf009ce76f868c73a345d27dc0c0662b5589154a66c258c90020e74760b0685c` |
| src/modules/cart-presentation/index.js | Timber | `9e71507803ebf235f2bd7425940ecb13072bf91b6aac7b4e4f6a58b3713a420b` |
| src/modules/cart-presentation/quantity.js | Timber | `d22470084ae81b279f4c269b7781d25619552bc79081da75ba423cf93ed15cc3` |
| src/modules/cart-presentation/related.js | Timber | `c99bead9ebc14ecefb3b883c306cc6f6247f8e6fbb74d62e716f112cf2b29368` |
| src/modules/cart-presentation/rows.js | Timber | `67e22155e4bdab02cb3264a49c835040e27cd1f0b77e670e383a11158a3227a6` |
| src/modules/category-bestsellers-sidebar/category-bestsellers-sidebar.css | Timber | `cd955d63a522f9b5f3cd1a926ce3e7c1d9c76c8110dc22bfb7552891a2c006db` |
| src/modules/category-bestsellers-sidebar/index.js | Timber | `b98e2deb5ed758d0715bdfda9e3d61960ac03c4f5a7fac39d3c1a04d2c1e55fe` |
| src/modules/category-filter-compact/index.js | Timber | `5aae5344c62bb15b798d931803227636c5c0c0d88df91c96396ce259b3944f79` |
| src/modules/empty-cart/index.js | Timber | `021d9ed0a5a28fa00b58f59198beac580bcdcb0070d26b6290e1e62886be97ad` |
| src/modules/footer-payments/index.js | Timber | `ae54ff9fefc7fd3f6f496f4e9213f5df494857b422f3c1638a2a0c793da53fbf` |
| src/modules/gallery-swipe/gallery-swipe.css | Timber | `4b79dfca5b724704817894a25b67284451394f7d568fec23604af12efc962867` |
| src/modules/gallery-swipe/index.js | Timber | `73ae0f2b1263f98ea577a83283aa58524aeef01cac63612d2bac5030fe7b7439` |
| src/modules/header-service-bar/business-hours.js | Timber | `bb503db3e8e3a84494a0e9c6db48bce1d6a4ec879a34ed8f73cfc9bdf0a9d8d1` |
| src/modules/header-service-bar/header-service-bar.css | Timber | `42054a92c3906bcb0604583ae4f6736eb6ee3e83c43d881fd6efbaf185115013` |
| src/modules/header-service-bar/index.js | Timber | `2b66b8fbc13fa9c2fadd396573e8fb19ce2c7ddb304fc8e579056f384520086e` |
| src/modules/homepage-categories/homepage-categories.css | Timber | `44f3177a21017b6405b3185fc8b62f90862e89b0f62dfeacc415d90165626f71` |
| src/modules/homepage-categories/index.js | Timber | `cf39f4b362353c596bc9e06eb25254737f8ed1689ecb91bc2ece75d5b583e236` |
| src/modules/information-message/index.js | Timber | `35b5e35fd4f77d4280917e064735a8b9220ec7ec417439f389c2c515ba2ffac2` |
| src/modules/list-view/index.js | Timber | `6ee5c1f6593471cd00d8fe73b9785ffd08a4be1a3235658fb00743bf2c5962f1` |
| src/modules/list-view/list-view.css | Timber | `d45383776e765ae4d51b6067996f148f033c6dd662c44952a0099a930fef3abe` |
| src/modules/menu-card-click/index.js | Timber | `434ee6150ee79db56e591d22081a717870b8879debf7d21ed6e4db9f85f799cf` |
| src/modules/mobile-category-controls/index.js | Timber | `1bc535d72c83bd55ba50b2b58e977553e83986d5a4853bea33dcd684ea4c9f6d` |
| src/modules/mobile-category-controls/mobile-category-controls.css | Timber | `ede831812ae71152e2a9aa1b02cb195c30d44c0aea7fbb227eae854c945a28cb` |
| src/modules/mobile-category-controls/values.js | Timber | `51c23cc3d4c135efdd012434a7eb70de064ffcba6ede4e9c2accbfce58505a8f` |
| src/modules/order-detail/index.js | Timber | `abeeb4d9786a5ba6e891e0163db487c3608d1c8942d5a08107adc35c54f44a63` |
| src/modules/product-text-cleanup/index.js | Timber | `0bf6ab5f048373c6aecc937084e9befea1f67d63e56010dd43f9fec9b1ee2fd2` |
| src/modules/qty-picker/index.js | Timber | `cdff0d2f5ffb1934804fcccfd72e1f9e0dd26ece141d3c7df04ebeca87be65b0` |
| src/modules/qty-picker/qty-picker.css | Timber | `b2c96b25e99c7f9f773baba89cd517e454d1f39cae830e552dbe40d57961aba4` |
| src/modules/sidebar-active-path/index.js | Timber | `dd2a37f82d2b832b486478ddf01a4965c8b67d8ebb318a778ec8594dc0552cd2` |
| src/styles/core.css | Timber | `38365e2a649c5d7318a5f03e06d2fcb28f0ef4f92f997a80f93daf74fb563fca` |
| src/styles/overrides/carousel.css | Timber | `53a6174fe6302fd0e3be4e912ba0e6d5f5f2fc31eef1780d67ed9bcc5da02772` |
| src/styles/overrides/cart-modal.css | Timber | `b31c82bd7bbe865b0739278b9b608236e9d3ad2e2abf69f6ac62585befca5587` |
| src/styles/overrides/cart-presentation.css | Timber | `ab9c50e308b9881e325cd727e94888861a3f7c422b0642b2684504e11195901c` |
| src/styles/overrides/checkout.css | Timber | `c5d9883ae4e0fac352c8832e37d2ce9894297884c8d3ccded797121134e311ef` |
| src/styles/overrides/filters.css | Timber | `cc5f0b583dccef182606827015b2fb8594b3189c5693f7f04db46cab841418a9` |
| src/styles/overrides/header-popups.css | Timber | `e3a30e3a6bd94cf40e34b1f6eff270c50f2d07dda3209bc303e006484de574d9` |
| src/styles/overrides/header.css | Timber | `1a228f1b524547137ce61ffc7202902b3bc898e83e9baf7b08ff109e026a8100` |
| src/styles/overrides/homepage-welcome.css | Timber | `987577b9ef3de5baa5358916b2d07fea292be961aaaac168cee8b5df06f6289e` |
| src/styles/overrides/information-message.css | Timber | `76c220b7600ebfacc30d39ecddde28d70ebda493ae678f871662dbbe0cabfed1` |
| src/styles/overrides/instagram.css | Timber | `6d1d69c817f29f683d0ded56c28e842fa80141d4b1244fd70edd05bdd9a96553` |
| src/styles/overrides/mobile-category-controls.css | Timber | `9b8701c5e2e42a9d87068de9dafa479402d700fecb5bcb262684757de901441e` |
| src/styles/overrides/navigation.css | Timber | `48b24528dd46d8cee868fe6d6e82b4835dd00f279ee8edc5dd7e01bb05dca15f` |
| src/styles/overrides/order-detail.css | Timber | `5412bd6677b67893c248f564e80cc65f993dede1fd6899a66859d97561110dfc` |
| src/styles/overrides/product-card.css | Timber | `4880648fbc7506a43e3ef31529c650df286df24551f177fcb369cb385a232bfb` |
| src/styles/overrides/product-detail.css | Timber | `1bb5d4d6d6404523b77e130f9f3c02a43346d639082c205c43165ffcd717cd67` |
| src/styles/overrides/sidebar.css | Timber | `e3fe1529de3c7c8de78426adca40ed79aee8a19cd7f2b116e706d0117ce4f703` |
| src/styles/overrides/subcategories.css | Timber | `b1239e9cf1a1ee7dea4461dfa0c8a9f188f35b3c1d8b25ddc44c4a529730fe32` |
| src/styles/overrides/top-bar.css | Timber | `d08a5c3f0a4de6483ad504e9849b67159d54c9273be4c73d985032b9630885fc` |
| src/styles/tokens.css | Timber | `114c7a55180c91fd36f3f4242e2be1347213f12dc6c7024ff3082a85cfabde9d` |
| https://cdn.myshoptet.com/prj/dist/master/cms/templates/frontend_templates/shared/css/font-face/open-sans.css | Apollo/Shoptet | `5d716f43a546daa40100c53e6b6627c8fa6ef8a4e1db7d2443ce0741e937eb96` |
| https://cdn.myshoptet.com/prj/dist/master/cms/templates/frontend_templates/shared/css/font-face/raleway.css | Apollo/Shoptet | `1f694d3f6836042d11ef8af1e154b66de2f78b7f0a532889dc8bee9e6027c971` |
| https://cdn.myshoptet.com/usr/apollo.jakubtursky.sk/user/documents/assets/main.css?v=1864 | Apollo/Shoptet | `a089b358ed6e4cd6b2631e0185396ea54e09037a44de25b56d16450d85f2df31` |
| https://cdn.myshoptet.com/usr/webotvurci.myshoptet.com/user/documents/plugin-product-interconnection/css/all.min.css?v=29 | Tretia strana – Webotvůrci | `dbe3c254db8999205000eddf3cee5c4c13abe8a351c2af6197cd7134c4a33f96` |
| https://cdn.myshoptet.com/addons/dominikmartini/multiply_order/styles.header.min.css?fea9f98d1592abba368d3a1166665d5f530696be | Tretia strana – Multiply Order | `a769dd3a9a06e218fb57770a117b0d7b6bd73df8a4d8cfae82caf8f8041689cb` |
| https://cdn.myshoptet.com/usr/apollo.jakubtursky.sk/user/documents/assets/kategorie/main.css?v=15 | Apollo/Shoptet | `044d4f978827385b214291f7d7504911696ee6f38483d7d14ab3417c6ffb4a54` |
| https://www.timberstore.sk/user/documents/allstyle.css?v=1111 | Externý vlastný allstyle (mimo repozitára) | `ec885e03997397acd14dea8f106cae6400b972e081870983bf8e309ffc73a1fc` |
| dist/timber.min.css | Generovaný bundle/mapa; zdrojové deklarácie v inventári nezdvojujeme | `dda76226e28b0a04db25c1e5ba1c668cb7af0d833e7d0b81a3a76bd1ad9704e2` |
| dist/timber.min.css.map | Generovaný bundle/mapa; zdrojové deklarácie v inventári nezdvojujeme | `d0fcef05ec1e77d60cee3fdf0bfdc32746339502903e794144ab1e83bbdbdb39` |
| dist/timber.min.js | Generovaný bundle/mapa; zdrojové deklarácie v inventári nezdvojujeme | `f2baee85f40ef5c60cd6a6b5ab67b42ef713d629c1e55d2ca6535277472b774b` |
| dist/timber.min.js.map | Generovaný bundle/mapa; zdrojové deklarácie v inventári nezdvojujeme | `f21fa2ccee8404eedc070595b6aa4d085878b35607be93823ac32cacfbc785f4` |
| shipping.html (súkromná pracovná snímka; nepublikuje sa) | Shoptet/Apollo, len štýlové údaje v reporte | `0b6d5f0f05e7da175876831801f019c9f4353a247388fb92afc93d46a38f532d` |
| cart.html (súkromná pracovná snímka; nepublikuje sa) | Shoptet/Apollo, len štýlové údaje v reporte | `defa91718e3b8bc72d3cba7a14c3484ac83c9f1d73a134d369ffae50bb14f534` |
| order-component.js (súkromná pracovná snímka; nepublikuje sa) | Shoptet/Apollo, len štýlové údaje v reporte | `6b57604f63eeeddebdf46c4f5cc970f78820ad28240f0dcdfb557d10fb2da55f` |
| apollo.js (súkromná pracovná snímka; nepublikuje sa) | Shoptet/Apollo, len štýlové údaje v reporte | `509d232026ccfe097b25ca522af5e82b5745f1b19546babf7221a18e649da383` |
