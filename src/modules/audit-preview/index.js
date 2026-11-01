import { SEL } from '../../core/selectors.js';
import { TEXTS } from '../../core/texts.js';
import { getAuditPage } from '../../core/page.js';
import { CONTACT_HELP_LINKS, SOCIALS, COMPANY_TAX_ID } from '../../core/contacts.js';
import { addContactIcon } from '../../core/contact-icons.js';
import { addHours, updateHours } from '../header-service-bar/index.js';

const copy = TEXTS.auditPreview;
let brandObserver;

function heading(element, tag) {
  if (!element || element.tagName.toLowerCase() === tag) return element;
  const replacement = document.createElement(tag);
  for (const { name, value } of [...element.attributes]) replacement.setAttribute(name, value);
  // Change document structure while retaining the exact current visual treatment.
  const style = getComputedStyle(element);
  for (const property of [
    'font-size',
    'font-weight',
    'line-height',
    'letter-spacing',
    'text-transform',
    'margin-top',
    'margin-bottom',
    'color',
  ])
    replacement.style.setProperty(property, style.getPropertyValue(property));
  replacement.classList.add('ts-audit-heading');
  replacement.append(...element.childNodes);
  element.replaceWith(replacement);
  return replacement;
}

function articleHeadings(root) {
  const body = root.querySelector(SEL.auditArticle)?.querySelector(SEL.auditArticleBody);
  if (!body || body.dataset.tsHeadings) return;
  body.dataset.tsHeadings = 'true';
  for (const element of [...body.querySelectorAll('h1, h2, h3, h4')]) {
    const text = element.textContent.trim();
    // Numbered chapters -> H2; numbered subchapters or inner topic titles -> H3.
    // The repeated article title remains visible as an introduction, without a
    // second semantic main title or an artificial extra heading level.
    if (element.tagName === 'H1' && !/^\d+[.)]\s/.test(text)) heading(element, 'p');
    else heading(element, /^\d+[.)]\s/.test(text) ? 'h2' : 'h3');
  }
}

function brands(root) {
  for (const element of root.querySelectorAll(SEL.unknownBrand)) {
    const meta = element.querySelector('meta[itemprop="name"]');
    if (meta) {
      if (copy.unknownBrand.test(meta.content.trim())) meta.content = copy.brandFallback;
      continue;
    }
    const value = element.querySelector('.ts-product-meta__value') || element;
    if (!copy.unknownBrand.test(value.textContent.trim())) continue;
    value.textContent = copy.brandFallback;
    // The old /znacka/n-a/ destination is not Timber Store. Keep a plain label,
    // avoiding an invented manufacturer URL or changes to source/import data.
    if (element.tagName === 'A') {
      const span = document.createElement('span');
      for (const { name, value } of [...element.attributes]) {
        if (!['href', 'target', 'rel'].includes(name)) span.setAttribute(name, value);
      }
      span.append(...element.childNodes);
      element.replaceWith(span);
    }
  }
}

function section(className, title) {
  const el = document.createElement('section');
  el.className = className;
  const h = document.createElement('h2');
  h.textContent = title;
  el.append(h);
  return el;
}

function contacts(root) {
  const article = root.querySelector(SEL.auditArticle);
  const about = article?.querySelector(SEL.auditArticleBody);
  const form = about?.querySelector(SEL.contactForm);
  if (!form || about.dataset.tsContacts) return;
  about.dataset.tsContacts = 'true';
  article.classList.add('ts-contact-page');
  article.querySelector(SEL.auditArticleTitle).textContent = copy.contacts;
  const company = [...about.querySelectorAll(SEL.contactCompany)].find((el) =>
    el.querySelector('h3'),
  );
  const support = section('ts-contact-support', copy.support);
  const intro = document.createElement('p');
  intro.textContent = copy.supportIntro;
  support.append(intro);
  const hours = document.createElement('div');
  hours.className = 'ts-contact-hours';
  hours.setAttribute('aria-label', copy.hours);
  addHours(hours);
  support.append(hours);
  for (const [kind, text, href] of [
    ['email', TEXTS.footer.email, `mailto:${TEXTS.footer.email}`],
    ['phone', TEXTS.footer.phone, 'tel:+421904479842'],
  ]) {
    const a = document.createElement('a');
    a.className = 'ts-contact-link';
    a.textContent = text;
    a.href = href;
    addContactIcon(a, kind);
    support.append(a);
  }
  const socials = document.createElement('div');
  socials.className = 'ts-contact-socials';
  for (const [network, href] of Object.entries(SOCIALS)) {
    const a = document.createElement('a');
    a.href = href;
    a.setAttribute('aria-label', TEXTS.header[network]);
    addContactIcon(a, network);
    socials.append(a);
  }
  support.append(socials);
  const formSection = section('ts-contact-form', copy.form);
  // Move the original form, its labels, captcha, consents and handlers intact.
  // Keep all pre-form authored content in order, including its existing intro.
  while (about.firstChild && about.firstChild !== form) formSection.append(about.firstChild);
  formSection.append(form);
  if (company) {
    company.classList.add('ts-contact-company');
    const caption = document.createElement('p');
    caption.className = 'ts-contact-company__caption';
    caption.textContent = copy.company;
    company.prepend(caption);
    const walker = document.createTreeWalker(company, 4 /* NodeFilter.SHOW_TEXT */);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (!copy.vatLabel.test(node.textContent)) continue;
      const tax = document.createElement('span');
      tax.className = 'ts-contact-company__tax';
      tax.textContent = copy.taxId + COMPANY_TAX_ID;
      node.before(tax, document.createElement('br'));
      break;
    }
    const title = heading(company.querySelector('h3'), 'h2');
    title?.classList.add('ts-contact-company__name');
    company.setAttribute('aria-label', copy.company);
  }
  const help = section('ts-contact-help', copy.shortcuts);
  for (const [index, href] of CONTACT_HELP_LINKS.entries()) {
    const a = document.createElement('a');
    a.href = href;
    a.textContent = copy.links[index];
    help.append(a);
  }
  const grid = document.createElement('div');
  grid.className = 'ts-contact-grid';
  const aside = document.createElement('div');
  aside.className = 'ts-contact-aside';
  aside.append(support);
  if (company) aside.append(company);
  aside.append(help);
  grid.append(aside, formSection);
  about.prepend(grid);
  form.querySelector('[name="fullName"]')?.setAttribute('autocomplete', 'name');
  form.querySelector('[name="email"]')?.setAttribute('autocomplete', 'email');
  updateHours();
}

export default {
  name: 'audit-preview',
  pages: ['*'],
  init(root) {
    const page = getAuditPage();
    if (page === 'contacts') contacts(root);
    if (page === 'article') articleHeadings(root);
    if (page === 'home' && !root.querySelector('h1')) {
      const anchor = root.querySelector(SEL.auditHomeTitleAnchor);
      if (anchor) {
        const title = document.createElement('h1');
        title.className = 'ts-home-title';
        title.textContent = copy.homeTitle;
        anchor.before(title);
      }
    }
    brands(root);
    if (!brandObserver && document.body) {
      brandObserver = new MutationObserver(() => brands(document));
      brandObserver.observe(document.body, { childList: true, subtree: true });
    }
  },
};
