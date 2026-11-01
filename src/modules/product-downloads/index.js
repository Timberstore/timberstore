import { SEL } from '../../core/selectors.js';
import { TEXTS } from '../../core/texts.js';
import { downloadMetadata } from '../../core/downloads.js';

const observed = new WeakSet();

function renameTabs(root) {
  for (const tab of root.querySelectorAll(SEL.productDownloadsTabs)) {
    // Replace text nodes only: retain counters, event handlers and tab attributes.
    const walker = document.createTreeWalker(tab, 4);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const text = node.nodeValue.replace(
        TEXTS.productDownloads.oldTab,
        TEXTS.productDownloads.tab,
      );
      if (text !== node.nodeValue) node.nodeValue = text;
    }
  }
}

function decorate(panel) {
  renameTabs(document);
  const links = [...panel.querySelectorAll(SEL.productDownloadLinks)];
  // Leave absent/empty native sections alone; never manufacture an empty tab.
  if (!links.some((link) => link.textContent.trim())) return;
  panel.classList.add('ts-downloads');
  for (const list of panel.querySelectorAll(SEL.productDownloadLists)) {
    list.classList.add('ts-downloads__list');
  }
  const body = panel.querySelector(SEL.productDownloadsBody) || panel;
  let heading = panel.querySelector('[data-ts-downloads-heading]');
  if (!heading) {
    heading = document.createElement('h3');
    heading.dataset.tsDownloadsHeading = '';
    heading.className = 'ts-downloads__heading';
    heading.textContent = TEXTS.productDownloads.heading;
    const subtitle = document.createElement('p');
    subtitle.className = 'ts-downloads__subtitle';
    subtitle.textContent = TEXTS.productDownloads.subtitle;
    body.prepend(heading, subtitle);
  }
  // Apollo adds a product-name heading after load. Only remove that direct heading.
  const headings = new Set([
    ...panel.querySelectorAll(SEL.productDownloadHeadings),
    ...body.querySelectorAll(SEL.productDownloadHeadings),
  ]);
  for (const native of headings) {
    if (native !== heading) native.remove();
  }
  for (const link of links) {
    if (link.dataset.tsInit === 'downloads' || !link.textContent.trim()) continue;
    const metadata = downloadMetadata(
      link.getAttribute('href'),
      link.getAttribute('type'),
      document.baseURI,
    );
    // Invalid/unsupported links retain their native markup and URL.
    if (!metadata) continue;
    const name = document.createElement('span');
    name.className = 'ts-downloads__name';
    name.append(...link.childNodes);
    const copy = document.createElement('span');
    copy.className = 'ts-downloads__copy';
    copy.append(name);
    if (metadata.format) {
      const format = document.createElement('small');
      format.className = 'ts-downloads__format';
      format.textContent = metadata.format;
      copy.append(format);
    }
    link.append(copy);
    link.classList.add('ts-downloads__row');
    link.dataset.tsInit = 'downloads';
    if (metadata.external) link.target = '_blank';
    if (link.target === '_blank') {
      const rel = new Set((link.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
      rel.add('noopener');
      rel.add('noreferrer');
      link.setAttribute('rel', [...rel].join(' '));
    }
    // Native navigation remains intact; no download attribute or click handler.
  }
}

export default {
  name: 'product-downloads',
  pages: ['detail'],
  init(root) {
    renameTabs(root);
    for (const panel of root.querySelectorAll(SEL.productDownloads)) {
      decorate(panel);
      if (observed.has(panel)) continue;
      observed.add(panel);
      // Apollo inserts its mobile accordion label and heading after our boot.
      // Observe this small section only, not the document or product description.
      const observer = new MutationObserver(() => decorate(panel));
      observer.observe(panel, { childList: true, subtree: true });
    }
  },
};
