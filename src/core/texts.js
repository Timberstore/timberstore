// Customer-facing texts (Slovak). No hard-coded strings in modules.
export const TEXTS = {
  header: {
    hours: 'PO – PIA: 08:00 – 16:00',
    account: 'Môj účet',
    facebook: 'Timber Store na Facebooku',
    instagram: 'Timber Store na Instagrame',
  },
  closeInformationMessage: 'Zavrieť oznam',
  viewSwitch: {
    label: 'Zobrazenie',
    group: 'Zobrazenie produktov',
    grid: 'Mriežkové zobrazenie',
    list: 'Riadkové zobrazenie',
  },
  productTable: {
    product: 'Produkt',
    availability: 'Dostupnosť',
    price: 'Cena',
    amount: 'Množstvo',
    sortPriceAsc: 'Zoradiť od najlacnejšieho',
    sortPriceDesc: 'Zoradiť od najdrahšieho',
  },
  qty: {
    decrease: 'Znížiť množstvo',
    increase: 'Zvýšiť množstvo',
    value: 'Množstvo',
  },
  cartCount: (qty) => `V košíku: ${qty} ks`,
  categoryFilter: {
    more: 'Ďalšie',
    less: 'Menej',
  },
  mobileCategory: {
    filter: 'Filtrovať',
    controls: 'Filtrovanie a radenie produktov',
    more: 'Zobraziť viac',
    less: 'Zobraziť menej',
    reset: 'Zrušiť všetky filtre',
  },
  homeCategories: {
    title: 'Najobľúbenejšie kategórie',
    saleTitleNeedle: 'akciový tovar',
    newsTitleNeedle: 'novinky v ponuke',
  },
};
