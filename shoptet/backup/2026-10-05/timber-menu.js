/* =========================================================
   TIMBER STORE – MAIN MENU + SIDEBAR ACTIVE PATH
   ========================================================= */

(function () {
    'use strict';

    /* Súbor je momentálne na webe vložený dvakrát.
       Guard zabráni dvojitému listeneru a dvojitému spúšťaniu. */
    if (window.__timberMenuInitialized) return;
    window.__timberMenuInitialized = true;


    /* =====================================================
       1. CELÁ KARTA PODKATEGÓRIE V HORNOM MENU JE KLIKATEĽNÁ
       ===================================================== */

    document.addEventListener('click', function (e) {

        var item = e.target.closest('#navigation .menu-level-2 > li');

        if (!item) return;

        /* Priamy klik na existujúci link necháme fungovať */
        if (e.target.closest('a')) return;

        var link =
            item.querySelector('.menu-content-title[href]') ||
            item.querySelector('.menu-content a[href]') ||
            item.querySelector('a[href]');

        if (!link) return;

        window.location.href = link.href;
    });



    /* =====================================================
       2. NORMALIZÁCIA URL
       ===================================================== */

    function normalizePath(url) {

        try {

            var path = new URL(
                url,
                window.location.origin
            ).pathname;

            path = path
                .replace(/\/+$/, '')
                .toLowerCase();

            return path || '/';

        } catch (e) {

            return '';
        }
    }



    /* =====================================================
       3. OZNAČENIE CELEJ CESTY V ĽAVOM STROME

       Triedy dávame PRIAMO NA LINK:
       .timber-parent-link
       .timber-current-link

       Funguje nezávisle od hĺbky Apollo stromu.
       ===================================================== */

    function markSidebarPath() {

        var root = document.getElementById('categories');

        if (!root) return;


        /* Reset našich starých označení */
        root.querySelectorAll(
            '.timber-parent-link, .timber-current-link'
        ).forEach(function (link) {

            link.classList.remove(
                'timber-parent-link',
                'timber-current-link'
            );
        });


        var currentPath = normalizePath(
            window.location.href
        );


        /* =================================================
           ZÍSKAME RODIČOVSKÚ CESTU Z BREADCRUMBS
           ================================================= */

        var parentPaths = new Set();

        var breadcrumbLinks = document.querySelectorAll(
            '.breadcrumbs-wrapper a[href], ' +
            '.breadcrumbs a[href], ' +
            '.breadcrumb a[href]'
        );

        breadcrumbLinks.forEach(function (link) {

            var path = normalizePath(link.href);

            if (
                path &&
                path !== '/' &&
                path !== currentPath
            ) {
                parentPaths.add(path);
            }
        });


        /* =================================================
           PREJDEME VŠETKY LINKY V SIDEBARI
           ================================================= */

        var sidebarLinks = root.querySelectorAll('a[href]');

        sidebarLinks.forEach(function (link) {

            var path = normalizePath(link.href);

            if (!path) return;


            /* Presne aktuálna kategória */
            if (path === currentPath) {

                link.classList.add(
                    'timber-current-link'
                );

                return;
            }


            /* Ktorákoľvek nadradená kategória */
            if (parentPaths.has(path)) {

                link.classList.add(
                    'timber-parent-link'
                );
            }
        });
    }





    /* =====================================================
       4. ČISTENIE TEXTOV PRODUKTOV
       Opravuje typografiu dodávateľských názvov a popisov.

       záves,naložený -> záves, naložený
       3,5 mm zostáva bez zmeny
       ===================================================== */

    function cleanProductTextValue(text) {

        if (!text) return text;

        return text

            /* odstráni medzeru pred čiarkou */
            .replace(/\s+,/g, ',')

            /* doplní medzeru za čiarkou,
               pokiaľ za ňou nezačína číslo alebo medzera */
            .replace(/,([^\s\d])/g, ', $1')

            /* viac medzier zjednotí na jednu */
            .replace(/[ \t]{2,}/g, ' ');
    }


    function cleanTextNodes(element) {

        if (!element) return;

        var walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function (node) {

                    var parent = node.parentElement;

                    if (!parent) {
                        return NodeFilter.FILTER_REJECT;
                    }

                    /* Nikdy neupravovať obsah skriptov, štýlov ani formulárov */
                    if (
                        parent.closest(
                            'script, style, textarea, input, select, option'
                        )
                    ) {
                        return NodeFilter.FILTER_REJECT;
                    }

                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        var nodes = [];
        var node;

        while ((node = walker.nextNode())) {
            nodes.push(node);
        }

        nodes.forEach(function (textNode) {

            var original = textNode.nodeValue;
            var cleaned = cleanProductTextValue(original);

            if (cleaned !== original) {
                textNode.nodeValue = cleaned;
            }
        });
    }


    function cleanProductTexts(root) {

        root = root || document;

        /* DETAIL PRODUKTU */
        root.querySelectorAll(
            '.p-detail-inner-header h1, ' +
            '.p-detail h1, ' +
            '.product-top h1, ' +
            'h1[itemprop="name"], ' +
            '.p-short-description, ' +
            '.description-inner, ' +
            '.basic-description, ' +
            '.p-detail-tabs'
        ).forEach(cleanTextNodes);

        /*
           PRODUKTOVÉ KARTY – desktop aj mobil.
           Apollo používa na mobile mierne inú vnútornú štruktúru,
           preto čistíme text v celej karte, nie iba v .name.
           Číselné desatinné hodnoty (napr. 3,5) regex nemení.
        */
        root.querySelectorAll(
            '.products-block .product, ' +
            '.products-block .p, ' +
            '.products .product, ' +
            '.products .p, ' +
            '.product[data-micro="product"], ' +
            '.p[data-micro="product"]'
        ).forEach(cleanTextNodes);
    }


    function observeProductChanges() {

        if (window.__timberProductObserver) return;

        var observer = new MutationObserver(function (mutations) {

            var shouldClean = false;

            mutations.forEach(function (mutation) {
                if (mutation.addedNodes && mutation.addedNodes.length) {
                    shouldClean = true;
                }
            });

            if (shouldClean) {
                cleanProductTexts();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        window.__timberProductObserver = observer;
    }




    /* =====================================================
       5. KOMPAKTNÝ DESKTOP FILTER KATEGÓRIÍ

       Stabilné správanie:
       - ĎALŠIE/MENEJ zostáva posledné v prvom riadku,
       - rozšírené filtre sa zobrazia až pod ním,
       - stav rozbalenia prežije Shoptet AJAX prekreslenie,
       - pri kliknutí na MENEJ sa zavrú aj otvorené dropdowny.
       ===================================================== */

    var timberFilterResizeTimer = null;
    var timberFilterExpandedState = false;


    function getTimberFilterBar() {
        return document.getElementById('category-filter-hover');
    }


    function getTimberFilterItems(bar) {
        if (!bar) return [];

        return Array.prototype.slice.call(bar.children).filter(function (item) {
            return (
                item.classList.contains('slider-wrapper') ||
                (
                    item.classList.contains('filter-section') &&
                    !item.classList.contains('filter-section-count')
                )
            );
        });
    }


    function closeTimberFilterDropdowns(bar) {
        if (!bar) return;

        getTimberFilterItems(bar).forEach(function (item) {
            item.classList.remove('is-active');

            var heading = item.querySelector(':scope > h4');
            if (heading) {
                heading.setAttribute('aria-expanded', 'false');
            }
        });
    }


    function setTimberFilterExpanded(bar, expanded) {
        if (!bar) return;

        var button = bar.querySelector(':scope > .timber-filter-more');

        timberFilterExpandedState = !!expanded;
        bar.classList.toggle('timber-filter-expanded', timberFilterExpandedState);

        if (button) {
            button.textContent = timberFilterExpandedState ? 'Menej' : 'Ďalšie';
            button.setAttribute(
                'aria-expanded',
                timberFilterExpandedState ? 'true' : 'false'
            );
        }

        if (!timberFilterExpandedState) {
            closeTimberFilterDropdowns(bar);
        }
    }


    function ensureTimberFilterControls(bar) {

        var button = bar.querySelector(':scope > .timber-filter-more');

        if (!button) {
            button = document.createElement('button');
            button.type = 'button';
            button.className = 'timber-filter-more';
            button.setAttribute('aria-expanded', 'false');
            bar.appendChild(button);

            button.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                setTimberFilterExpanded(
                    bar,
                    !bar.classList.contains('timber-filter-expanded')
                );
            });
        }

        var breakElement = bar.querySelector(':scope > .timber-filter-break');

        if (!breakElement) {
            breakElement = document.createElement('span');
            breakElement.className = 'timber-filter-break';
            breakElement.setAttribute('aria-hidden', 'true');
            bar.appendChild(breakElement);
        }

        /* DOM poradie nech je vždy button + break na konci.
           Vizuálne poradie rieši CSS order. */
        bar.appendChild(button);
        bar.appendChild(breakElement);

        return {
            button: button,
            breakElement: breakElement
        };
    }


    function getTimberVisibleFilterLimit(bar, items, button) {
        if (!bar || !items.length || !button) return items.length;

        /*
           Počet filtrov už neurčujeme podľa pevného čísla.
           Reálne odmeriame šírku názvov v konkrétnej kategórii a
           VŽDY rezervujeme miesto pre tlačidlo ĎALŠIE/MENEJ.

           To je dôležité napr. pri LED pásoch, kde sú názvy
           „CRI RA VERNOSŤ FARIEB“ a „MAXIMÁLNY VÝKON W“ výrazne
           dlhšie než pri väčšine ostatných kategórií.
        */

        var computed = window.getComputedStyle(bar);
        var paddingLeft = parseFloat(computed.paddingLeft) || 0;
        var paddingRight = parseFloat(computed.paddingRight) || 0;
        var available = bar.clientWidth - paddingLeft - paddingRight;

        /* Meriame vždy so širším textom ĎALŠIE, aby MENEJ po
           rozbalení nikdy nepretieklo do ďalšieho riadku. */
        var originalText = button.textContent;
        var originalHidden = button.hidden;

        button.hidden = false;
        button.textContent = 'Ďalšie';

        var buttonWidth = Math.ceil(button.getBoundingClientRect().width);
        var used = buttonWidth + 4; /* malá bezpečnostná rezerva */
        var limit = 0;

        items.forEach(function (item) {
            item.classList.remove('timber-filter-overflow');
        });

        for (var i = 0; i < items.length; i++) {
            var itemWidth = Math.ceil(items[i].getBoundingClientRect().width);

            if (limit > 0 && used + itemWidth > available) {
                break;
            }

            /* Aspoň jeden filter musí zostať viditeľný. */
            if (limit === 0 || used + itemWidth <= available) {
                used += itemWidth;
                limit++;
            } else {
                break;
            }
        }

        button.textContent = originalText;
        button.hidden = originalHidden;

        return Math.max(1, limit);
    }


    function initTimberFilters() {

        var bar = getTimberFilterBar();
        if (!bar) return;

        var controls = ensureTimberFilterControls(bar);
        var button = controls.button;
        var items = getTimberFilterItems(bar);

        /* Mobil = pôvodné Apollo. */
        if (window.innerWidth < 992) {
            timberFilterExpandedState = false;
            bar.classList.remove('timber-filter-expanded');

            items.forEach(function (item) {
                item.classList.remove('timber-filter-overflow');
            });

            button.hidden = true;
            button.textContent = 'Ďalšie';
            button.setAttribute('aria-expanded', 'false');
            return;
        }

        /*
           Pred meraním na okamih zrušíme iba naše overflow triedy.
           Nezapíname žiadny observer a nerobíme cyklické prepočty,
           takže nevzniká preblikávanie.
        */
        items.forEach(function (item) {
            item.classList.remove('timber-filter-overflow');
        });

        var limit = getTimberVisibleFilterLimit(bar, items, button);

        items.forEach(function (item, index) {
            item.classList.toggle('timber-filter-overflow', index >= limit);
        });

        var hasMore = items.length > limit;
        button.hidden = !hasMore;

        if (!hasMore) {
            timberFilterExpandedState = false;
            setTimberFilterExpanded(bar, false);
            return;
        }

        /* Stav po AJAX prekreslení zostáva zachovaný. */
        setTimberFilterExpanded(bar, timberFilterExpandedState);
    }


    window.addEventListener('resize' , function () {
        window.clearTimeout(timberFilterResizeTimer);

        timberFilterResizeTimer = window.setTimeout(function () {
            initTimberFilters();
        }, 160);
    });


    document.addEventListener('ShoptetDOMPageContentLoaded', function () {
        initTimberFilters();
    });


    /* =====================================================
       6. SPUSTENIE
       Apollo môže strom dorenderovať neskôr
       ===================================================== */

    function init() {

        markSidebarPath();
        cleanProductTexts();
        observeProductChanges();
        initTimberFilters();

        /* Apollo môže niektoré časti stránky prekresliť po načítaní. */
        setTimeout(function () {
            markSidebarPath();
            cleanProductTexts();
            initTimberFilters();
        }, 100);

        setTimeout(function () {
            markSidebarPath();
            cleanProductTexts();
        }, 500);
    }


    if (document.readyState === 'loading') {

        document.addEventListener(
            'DOMContentLoaded',
            init
        );

    } else {

        init();
    }

})();