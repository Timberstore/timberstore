import { SEL } from '../../core/selectors.js';

const PAYMENT_LOGOS = [
  {
    src: 'https://www.timberstore.sk/user/documents/upload/Online%20Platby%20Loga/visa-logo-png-extra-large-size.png',
    alt: 'Visa',
  },
  {
    src: 'https://www.timberstore.sk/user/documents/upload/Online%20Platby%20Loga/new-Mastercard-logo-png-medium-size.png',
    alt: 'Mastercard',
  },
  {
    src: 'https://www.timberstore.sk/user/documents/upload/Online%20Platby%20Loga/Google_Pay_Logo.svg.png',
    alt: 'Google Pay',
  },
  {
    src: 'https://www.timberstore.sk/user/documents/upload/Online%20Platby%20Loga/Apple_Pay-Logo.wine_1.png',
    alt: 'Apple Pay',
  },
];

function render(root) {
  const paymentBox = root.querySelector?.(SEL.footerOnlinePayments) || document.querySelector(SEL.footerOnlinePayments);
  if (!paymentBox) return;

  if (paymentBox.querySelector('.timber-payments')) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'timber-payments';

  PAYMENT_LOGOS.forEach(({ src, alt }) => {
    const card = document.createElement('div');
    card.className = 'timber-payment-card';

    const image = document.createElement('img');
    image.src = src;
    image.alt = alt;

    card.append(image);
    wrapper.append(card);
  });

  paymentBox.replaceChildren(wrapper);
}

export default {
  name: 'footer-payments',
  pages: ['*'],
  init(root) {
    render(root);
  },
};
