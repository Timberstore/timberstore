// Shared footer/mobile-menu contact SVGs; no icon-font loading dependency.
const paths = {
  email: 'M3 5h18v14H3z M3 5l9 8 9-8',
  phone: 'M5 3h4l2 5-3 2c2 3 3 4 6 6l2-3 5 2v4c0 2-3 3-5 2C9 19 5 15 3 8 2 6 3 3 5 3z',
  facebook: 'M14 22v-9h3l1-4h-4V7c0-1 0-2 2-2h2V1h-3c-4 0-5 3-5 6v2H7v4h3v9z',
  instagram:
    'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4z M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0 M17 6h.01',
};
export function addContactIcon(link, kind) {
  if (link.querySelector('.ts-footer-contacts__icon')) return;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('ts-footer-contacts__icon');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS(svg.namespaceURI, 'path');
  path.setAttribute('d', paths[kind]);
  svg.append(path);
  link.prepend(svg);
}

