(function () {
  var isHomepage = window.location.pathname === "/" || window.location.pathname === "";
  if (!isHomepage) return;

  var categories = [
    {name:"Knopky", img:"https://765909.myshoptet.com/user/documents/upload/Najoblubenejsie%20Kategorie/Knopky.jpg", url:"/knopky/"},
    {name:"Úchytky", img:"https://765909.myshoptet.com/user/documents/upload/Najoblubenejsie%20Kategorie/Uchytky.jpg", url:"/uchytky/"},
    {name:"Smetné koše", img:"https://765909.myshoptet.com/user/documents/upload/Najoblubenejsie%20Kategorie/Smetne%20kose.jpg", url:"/smetne-kose/"},
    {name:"Organizéry", img:"https://765909.myshoptet.com/user/documents/upload/Najoblubenejsie%20Kategorie/Organizer.jpg", url:"/priborniky--protismykove-podlozky/"},
    {name:"Stolové nohy", img:"https://765909.myshoptet.com/user/documents/upload/Najoblubenejsie%20Kategorie/Stolove%20Nohy.jpg", url:"/stolove-nohy/"},
    {name:"Drezy", img:"https://765909.myshoptet.com/user/documents/upload/Najoblubenejsie%20Kategorie/Drezy.jpg", url:"/drezy/"},
    {name:"Batérie", img:"https://765909.myshoptet.com/user/documents/upload/Najoblubenejsie%20Kategorie/Baterie.jpg", url:"/baterie/"},
    {name:"Nábytkové závesy", img:"https://765909.myshoptet.com/user/documents/upload/Najoblubenejsie%20Kategorie/PANTY.jpg", url:"/nabytkove-zavesy-panty/"},
    {name:"Zásuvkové výsuvy", img:"https://765909.myshoptet.com/user/documents/upload/Najoblubenejsie%20Kategorie/Vysuvy.jpg", url:"/zasuvkove-vysuvy/"},
    {name:"Káblové priechodky", img:"https://765909.myshoptet.com/user/documents/upload/Najoblubenejsie%20Kategorie/Priechodky.jpg", url:"/kablove-priechodky/"},
    {name:"Elektrické zásuvky", img:"https://765909.myshoptet.com/user/documents/upload/Najoblubenejsie%20Kategorie/Elektricke%20Zasuvky.jpg", url:"/elektricke-zasuvky/"},
    {name:"Stolárske pomôcky", img:"https://765909.myshoptet.com/user/documents/upload/Najoblubenejsie%20Kategorie/Stolarske%20pomocky.jpg", url:"/stolarske-pomocky/"}
  ];

  function createCategories() {
    if (document.querySelector(".timber-categories-banner")) return;

    var section = document.createElement("section");
    section.className = "timber-categories-banner";

    section.innerHTML =
      '<h2 class="timber-categories-banner__title">Najobľúbenejšie kategórie</h2>' +
      '<div class="timber-categories-banner__grid">' +
      categories.map(function (item) {
        return '<a class="timber-categories-banner__item" href="' + item.url + '">' +
          '<img src="' + item.img + '" alt="' + item.name + '" loading="lazy">' +
          '<span>' + item.name + '</span>' +
        '</a>';
      }).join("") +
      '</div>';

    var firstProductTitle = document.querySelector(".homepage-group-title");

    if (firstProductTitle && firstProductTitle.parentNode) {
      firstProductTitle.parentNode.insertBefore(section, firstProductTitle);
    }
  }

  function findTitleByText(textToFind) {
    var titles = document.querySelectorAll(".homepage-group-title");

    for (var i = 0; i < titles.length; i++) {
      var text = titles[i].textContent.trim().toLowerCase();

      if (text.indexOf(textToFind) !== -1) {
        return titles[i];
      }
    }

    return null;
  }

  function findProductsAfterTitle(title) {
    var el = title.nextElementSibling;

    while (el) {
      if (el.classList && el.classList.contains("products")) {
        return el;
      }

      el = el.nextElementSibling;
    }

    return null;
  }

  function findMiddleBanners() {
    var bannerLink =
      document.querySelector('a[href*="kineticke"]') ||
      document.querySelector('a[href*="led-pas"]') ||
      document.querySelector('a[href*="lepid"]') ||
      document.querySelector('a[href*="krabic"]');

    if (!bannerLink) return null;

    return (
      bannerLink.closest(".middle-banners-wrapper") ||
      bannerLink.closest(".content-wrapper") ||
      bannerLink.closest(".banners-content") ||
      bannerLink.closest(".next-to-carousel-banners")
    );
  }

  function reorderHomepage() {
    var saleTitle = findTitleByText("akciový tovar");
    var newsTitle = findTitleByText("novinky v ponuke");

    if (!saleTitle || !newsTitle) return;

    var saleProducts = findProductsAfterTitle(saleTitle);
    var newsProducts = findProductsAfterTitle(newsTitle);
    var middleBanners = findMiddleBanners();
    var benefits = document.querySelector(".position--benefitHomepage");

    if (!saleProducts || !newsProducts) return;

    var parent = saleProducts.parentNode;
    var reference = saleProducts;

    parent.insertBefore(newsTitle, reference.nextSibling);
    reference = newsTitle;

    parent.insertBefore(newsProducts, reference.nextSibling);
    reference = newsProducts;

    if (middleBanners) {
      parent.insertBefore(middleBanners, reference.nextSibling);
      reference = middleBanners;
    }

    if (benefits) {
      parent.insertBefore(benefits, reference.nextSibling);
    }
  }

  function runTimberHomepage() {
    createCategories();

    setTimeout(reorderHomepage, 300);
    setTimeout(reorderHomepage, 1000);
    setTimeout(reorderHomepage, 2000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runTimberHomepage);
  } else {
    runTimberHomepage();
  }
})();


/* TIMBER STORE – načítanie úprav hlavného menu */
(function () {
  var s = document.createElement('script');
  s.src = '/user/documents/upload/CSS/timber-menu.js?v=1';
  s.defer = true;
  document.head.appendChild(s);
})();