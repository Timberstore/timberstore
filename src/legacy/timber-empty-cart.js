(function () {

    function isEmptyCart() {
        var text = (document.body.innerText || "").toLowerCase();

        return (
            text.indexOf("košík je prázdny") !== -1 ||
            text.indexOf("košík je zatiaľ prázdny") !== -1 ||
            text.indexOf("váš košík je prázdny") !== -1
        );
    }


    function isMobileDevice() {
        return (
            /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
            window.innerWidth <= 767 ||
            window.screen.width <= 767
        );
    }


    function addStyles() {

        if (document.getElementById("timber-empty-cart-style")) return;

        var style = document.createElement("style");
        style.id = "timber-empty-cart-style";

        style.innerHTML = `

            .timber-empty-extra {
                width: 100%;
                max-width: 1100px;
                margin: 34px auto 60px;
                padding: 0 20px;
                box-sizing: border-box;
            }

            .timber-empty-extra__title,
            .timber-empty-extra__section-title {
                text-align: center;
                color: #2f2b29;
                font-weight: 800;
                line-height: 1.2;
            }

            .timber-empty-extra__title {
                margin: 0 0 22px;
                font-size: 26px;
            }

            .timber-empty-extra__section-title {
                margin: 36px 0 22px;
                font-size: 24px;
            }


            /* ODKAZ V HLAVNOM TEXTE */

            .timber-empty-main-link {
                color: #D4884A !important;
                text-decoration: underline !important;
                text-decoration-thickness: 1px !important;
                text-underline-offset: 4px !important;
                font-weight: inherit !important;
                transition: .2s ease !important;
            }

            .timber-empty-main-link:hover {
                color: #B8692E !important;
            }


            /* KATEGÓRIE */

            .timber-empty-extra__cats {
                display: grid;
                grid-template-columns: repeat(4, minmax(0, 1fr));
                gap: 12px;
            }

            .timber-empty-extra__cats a {
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 58px;
                padding: 12px 14px;

                background: #FAF3EB;
                border: 1px solid #E9E1D8;
                border-radius: 12px;

                color: #423E3E;
                text-decoration: none;
                text-align: center;

                font-size: 14px;
                line-height: 1.25;
                font-weight: 700;

                box-sizing: border-box;
                transition: .2s ease;
            }

            .timber-empty-extra__cats a:hover {
                border-color: #D4884A;
                color: #C97A2B;
                transform: translateY(-1px);
            }


            /* PRODUKTY */

            .timber-empty-extra__products {
                display: grid;
                grid-template-columns: repeat(4, minmax(0, 1fr));
                gap: 16px;
            }

            .timber-empty-extra__product {
                display: flex;
                flex-direction: column;
                min-width: 0;
                padding: 14px;

                background: #fff;
                border: 1px solid #E9E1D8;
                border-radius: 14px;

                color: #423E3E;
                text-decoration: none;

                box-sizing: border-box;
                transition: .2s ease;
            }

            .timber-empty-extra__product:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(66,62,62,.08);
                border-color: #D4884A;
            }

            .timber-empty-extra__product-img {
                width: 100%;
                height: 165px;

                display: flex;
                align-items: center;
                justify-content: center;

                margin-bottom: 12px;
            }

            .timber-empty-extra__product-img img {
                display: block;
                max-width: 100%;
                max-height: 155px;
                width: auto;
                height: auto;
                object-fit: contain;
            }

            .timber-empty-extra__product-name {
                font-size: 14px;
                line-height: 1.35;
                font-weight: 700;
                margin-bottom: 9px;
                flex-grow: 1;
            }

            .timber-empty-extra__product-price {
                font-size: 16px;
                font-weight: 800;
                color: #2f2b29;
            }


            /* ZOBRAZIŤ CELÚ PONUKU */

            .timber-empty-extra__cta {
                text-align: center;
                margin-top: 34px;
            }

            .timber-empty-extra__cta a {
                display: inline-flex;
                align-items: center;
                justify-content: center;

                min-height: 46px;
                padding: 12px 24px;

                background: #D4884A;
                color: #fff;

                border-radius: 999px;
                font-weight: 800;
                text-decoration: none;

                box-shadow: 0 8px 18px rgba(201,122,43,.16);
                transition: .2s ease;
            }

            .timber-empty-extra__cta a:hover {
                background: #B8692E;
                color: #fff;
                transform: translateY(-1px);
            }


            /* PÔVODNÝ PRÁZDNY KOŠÍK */

            .cart-empty,
            .empty-cart,
            .cart-empty-wrapper {
                max-height: 360px !important;
            }

            .cart-empty img,
            .empty-cart img,
            .cart-empty-wrapper img {
                max-height: 135px !important;
                width: auto !important;
            }


            @media (max-width: 900px) {

                .timber-empty-extra__cats,
                .timber-empty-extra__products {
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                }
            }


            @media (max-width: 767px) {

                .timber-empty-extra {
                    margin: 24px auto 40px;
                    padding: 0 12px;
                }

                .timber-empty-extra__title {
                    font-size: 22px;
                    margin-bottom: 16px;
                }

                .timber-empty-extra__section-title {
                    font-size: 21px;
                    margin: 28px 0 16px;
                }

                .timber-empty-extra__cats {
                    gap: 8px;
                }

                .timber-empty-extra__cats a {
                    min-height: 54px;
                    padding: 10px 8px;
                    font-size: 12px;
                    border-radius: 10px;
                }

                .timber-empty-extra__products {
                    gap: 10px;
                }

                .timber-empty-extra__product {
                    padding: 10px;
                    border-radius: 12px;
                }

                .timber-empty-extra__product-img {
                    height: 120px;
                    margin-bottom: 8px;
                }

                .timber-empty-extra__product-img img {
                    max-height: 110px;
                }

                .timber-empty-extra__product-name {
                    font-size: 12px;
                    line-height: 1.3;
                }

                .timber-empty-extra__product-price {
                    font-size: 14px;
                }

                .timber-empty-extra__cta a {
                    width: 100%;
                    box-sizing: border-box;
                }

                .cart-empty,
                .empty-cart,
                .cart-empty-wrapper {
                    max-height: 280px !important;
                }

                .cart-empty img,
                .empty-cart img,
                .cart-empty-wrapper img {
                    max-height: 100px !important;
                }
            }


            /* MOBIL NATVRDO CEZ JS */

            .timber-empty-mobile {
                width: 100% !important;
                max-width: 100% !important;
                margin: 22px auto 40px !important;
                padding: 0 12px !important;
                box-sizing: border-box !important;
            }

            .timber-empty-mobile .timber-empty-extra__title {
                font-size: 21px !important;
                margin-bottom: 16px !important;
            }

            .timber-empty-mobile .timber-empty-extra__cats {
                display: grid !important;
                grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                gap: 8px !important;
            }

            .timber-empty-mobile .timber-empty-extra__cats a {
                min-height: 52px !important;
                padding: 8px 6px !important;
                font-size: 12px !important;
            }

            .timber-empty-mobile .timber-empty-extra__section-title {
                font-size: 20px !important;
                margin: 26px 0 15px !important;
            }

            .timber-empty-mobile .timber-empty-extra__products {
                display: grid !important;
                grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                gap: 9px !important;
            }

            .timber-empty-mobile .timber-empty-extra__product {
                padding: 9px !important;
                border-radius: 10px !important;
            }

            .timber-empty-mobile .timber-empty-extra__product-img {
                height: 115px !important;
                margin-bottom: 7px !important;
            }

            .timber-empty-mobile .timber-empty-extra__product-img img {
                max-width: 100% !important;
                max-height: 105px !important;
            }

            .timber-empty-mobile .timber-empty-extra__product-name {
                font-size: 11px !important;
                line-height: 1.3 !important;
            }

            .timber-empty-mobile .timber-empty-extra__product-price {
                font-size: 13px !important;
            }

            .timber-empty-mobile .timber-empty-extra__cta {
                margin-top: 25px !important;
            }

            .timber-empty-mobile .timber-empty-extra__cta a {
                width: 100% !important;
                box-sizing: border-box !important;
            }

        `;

        document.head.appendChild(style);
    }


    /* ZMENA HLAVNÉHO TEXTU */

    function changeEmptyCartText() {

        var elements = document.querySelectorAll(
            "h1, h2, h3, h4, p, div, span"
        );

        for (var i = 0; i < elements.length; i++) {

            var text = (elements[i].textContent || "")
                .replace(/\s+/g, " ")
                .trim();

            if (
                text === "Košík je prázdny. Naplňte ho radosťou!" ||
                text === "Košík je zatiaľ prázdny. Naplňte ho radosťou!"
            ) {

                elements[i].innerHTML =
                    'Košík je zatiaľ prázdny. ' +
                    '<a href="/" class="timber-empty-main-link">' +
                    'Objavte našu ponuku.' +
                    '</a>';

                return;
            }
        }
    }


    /* NÁJDE PÔVODNÝ BÉŽOVÝ BOX */

    function findEmptyCartBox() {

        var elements = document.querySelectorAll("div, section");

        for (var i = 0; i < elements.length; i++) {

            var text = (elements[i].innerText || "")
                .replace(/\s+/g, " ")
                .trim();

            if (
                text.indexOf("Košík je prázdny.") !== -1 ||
                text.indexOf("Košík je zatiaľ prázdny.") !== -1
            ) {

                var rect = elements[i].getBoundingClientRect();

                if (
                    rect.width > 220 &&
                    rect.width < 1500
                ) {
                    return elements[i];
                }
            }
        }

        return null;
    }


    /* ORANŽOVÉ SPÄŤ DO OBCHODU - PC AJ MOBIL */

    function styleBottomBackButton() {

        var elements = document.querySelectorAll("a, button");
        var found = [];

        for (var i = 0; i < elements.length; i++) {

            var text = (elements[i].textContent || "")
                .replace(/\s+/g, " ")
                .trim()
                .toLowerCase();

            if (
                text.indexOf("späť do obchodu") !== -1 ||
                text.indexOf("spat do obchodu") !== -1
            ) {

                var rect = elements[i].getBoundingClientRect();

                if (
                    rect.width > 0 &&
                    rect.height > 0
                ) {

                    found.push({
                        element: elements[i],
                        top: rect.top
                    });
                }
            }
        }

        if (!found.length) return;

        found.sort(function (a, b) {
            return a.top - b.top;
        });

        /* najnižšie položený odkaz */
        var btn = found[found.length - 1].element;


        /* Priame inline štýly s !important */
        btn.style.setProperty(
            "display",
            "inline-flex",
            "important"
        );

        btn.style.setProperty(
            "align-items",
            "center",
            "important"
        );

        btn.style.setProperty(
            "justify-content",
            "center",
            "important"
        );

        btn.style.setProperty(
            "min-height",
            "46px",
            "important"
        );

        btn.style.setProperty(
            "padding",
            "12px 24px",
            "important"
        );

        btn.style.setProperty(
            "background",
            "#D4884A",
            "important"
        );

        btn.style.setProperty(
            "background-color",
            "#D4884A",
            "important"
        );

        btn.style.setProperty(
            "color",
            "#ffffff",
            "important"
        );

        btn.style.setProperty(
            "border",
            "none",
            "important"
        );

        btn.style.setProperty(
            "border-radius",
            "999px",
            "important"
        );

        btn.style.setProperty(
            "font-weight",
            "800",
            "important"
        );

        btn.style.setProperty(
            "text-decoration",
            "none",
            "important"
        );

        btn.style.setProperty(
            "box-shadow",
            "0 8px 18px rgba(201,122,43,.16)",
            "important"
        );

        btn.style.setProperty(
            "transition",
            ".2s ease",
            "important"
        );


        /*
         * Mobil - nech nie je button zbytočne cez celú šírku.
         */
        if (isMobileDevice()) {

            btn.style.setProperty(
                "width",
                "auto",
                "important"
            );

            btn.style.setProperty(
                "max-width",
                "90%",
                "important"
            );
        }
    }


    function createExtras() {

        if (!isEmptyCart()) return;

        if (
            document.querySelector(".timber-empty-extra")
        ) return;

        addStyles();

        var emptyBox = findEmptyCartBox();

        if (!emptyBox) return;

        var section = document.createElement("section");
        section.className = "timber-empty-extra";

        if (isMobileDevice()) {
            section.classList.add("timber-empty-mobile");
        }


        var categories = [
            ["Nábytkové kovania", "/nabytkove-kovania/"],
            ["Úchytky a vešiaky", "/uchytky-a-vesiaky/"],
            ["Spojovací materiál", "/spojovaci-material/"],
            ["Svetlá", "/svetla/"],
            ["Drezy a batérie", "/drezy-a-baterie/"],
            ["Chémia", "/chemia/"],
            ["Obaly", "/obaly/"],
            ["3D tlačené produkty", "/3d-tlacene-produkty/"]
        ];


        var cats = "";

        categories.forEach(function (item) {

            cats +=
                '<a href="' + item[1] + '">' +
                item[0] +
                '</a>';
        });


        section.innerHTML =

            '<h2 class="timber-empty-extra__title">' +
                'Pokračujte v nákupe' +
            '</h2>' +

            '<div class="timber-empty-extra__cats">' +
                cats +
            '</div>' +

            '<h3 class="timber-empty-extra__section-title">' +
                'Novinky v ponuke' +
            '</h3>' +

            '<div class="' +
                'timber-empty-extra__products ' +
                'timber-empty-extra__news-products' +
            '"></div>' +

            '<h3 class="timber-empty-extra__section-title">' +
                'Akciový tovar' +
            '</h3>' +

            '<div class="' +
                'timber-empty-extra__products ' +
                'timber-empty-extra__sale-products' +
            '"></div>' +

            '<div class="timber-empty-extra__cta">' +
                '<a href="/">' +
                    'Zobraziť celú ponuku' +
                '</a>' +
            '</div>';


        emptyBox.insertAdjacentElement(
            "afterend",
            section
        );


        loadSectionProducts(
            "novinky v ponuke",
            ".timber-empty-extra__news-products",
            8,
            section
        );


        loadSectionProducts(
            "akciový tovar",
            ".timber-empty-extra__sale-products",
            4,
            section
        );
    }


    function findProductsByTitle(doc, searchText) {

        var titles =
            doc.querySelectorAll(".homepage-group-title");

        for (var i = 0; i < titles.length; i++) {

            var text =
                (titles[i].textContent || "")
                    .trim()
                    .toLowerCase();

            if (text.indexOf(searchText) !== -1) {

                var element =
                    titles[i].nextElementSibling;

                while (element) {

                    if (
                        element.classList &&
                        element.classList.contains("products")
                    ) {
                        return element;
                    }

                    element =
                        element.nextElementSibling;
                }
            }
        }

        return null;
    }


    function createProductCard(product) {

        var nameEl =
            product.querySelector(".name") ||
            product.querySelector(".p-name") ||
            product.querySelector(".name span");


        var linkEl =
            product.querySelector("a.name") ||
            product.querySelector(".p-name a") ||
            product.querySelector("a[href]");


        var imageEl =
            product.querySelector("img");


        var priceEl =
            product.querySelector(".price-final") ||
            product.querySelector(".price");


        if (!nameEl || !linkEl) return null;


        var name =
            (nameEl.textContent || "").trim();


        var url =
            linkEl.getAttribute("href");


        var image = "";


        if (imageEl) {

            image =
                imageEl.getAttribute("data-src") ||
                imageEl.getAttribute("data-original") ||
                imageEl.getAttribute("src") ||
                "";
        }


        var price =
            priceEl
                ? (priceEl.textContent || "").trim()
                : "";


        var card =
            document.createElement("a");


        card.className =
            "timber-empty-extra__product";


        card.href =
            url;


        card.innerHTML =

            '<div class="timber-empty-extra__product-img">' +

                (
                    image
                        ? '<img src="' +
                            image +
                            '" alt="' +
                            name.replace(/"/g, "&quot;") +
                            '">'
                        : ''
                ) +

            '</div>' +

            '<div class="timber-empty-extra__product-name">' +
                name +
            '</div>' +

            (
                price
                    ? '<div class="timber-empty-extra__product-price">' +
                        price +
                      '</div>'
                    : ''
            );


        return card;
    }


    function loadSectionProducts(
        sectionTitle,
        targetSelector,
        limit,
        section
    ) {

        fetch("/", {
            credentials: "same-origin"
        })

        .then(function (response) {
            return response.text();
        })

        .then(function (html) {

            var parser =
                new DOMParser();


            var doc =
                parser.parseFromString(
                    html,
                    "text/html"
                );


            var block =
                findProductsByTitle(
                    doc,
                    sectionTitle
                );


            var target =
                section.querySelector(
                    targetSelector
                );


            if (!block || !target) {

                hideSection(target);
                return;
            }


            var products =
                block.querySelectorAll(".product");


            var added = 0;


            for (
                var i = 0;
                i < products.length &&
                added < limit;
                i++
            ) {

                var card =
                    createProductCard(
                        products[i]
                    );


                if (!card) continue;


                target.appendChild(card);
                added++;
            }


            if (added === 0) {
                hideSection(target);
            }
        })

        .catch(function () {

            var target =
                section.querySelector(
                    targetSelector
                );


            hideSection(target);
        });
    }


    function hideSection(target) {

        if (!target) return;


        var title =
            target.previousElementSibling;


        target.style.display =
            "none";


        if (title) {
            title.style.display =
                "none";
        }
    }


    function updateMobileClass() {

        var section =
            document.querySelector(
                ".timber-empty-extra"
            );


        if (!section) return;


        if (isMobileDevice()) {

            section.classList.add(
                "timber-empty-mobile"
            );

        } else {

            section.classList.remove(
                "timber-empty-mobile"
            );
        }
    }


    function refreshTimberEmptyCart() {

        changeEmptyCartText();
        styleBottomBackButton();
        updateMobileClass();
    }


    function run() {

        addStyles();

        changeEmptyCartText();

        setTimeout(createExtras, 200);
        setTimeout(createExtras, 700);
        setTimeout(createExtras, 1500);

        setTimeout(refreshTimberEmptyCart, 250);
        setTimeout(refreshTimberEmptyCart, 750);
        setTimeout(refreshTimberEmptyCart, 1600);
        setTimeout(refreshTimberEmptyCart, 2500);
    }