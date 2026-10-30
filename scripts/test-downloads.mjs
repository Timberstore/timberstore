import assert from 'node:assert/strict';
import { downloadMetadata } from '../src/core/downloads.js';
import { TEXTS } from '../src/core/texts.js';
import downloads from '../src/modules/product-downloads/index.js';

const base = 'https://www.timberstore.sk/product/';
const cases = [
  ['/user/file.pdf', '', { format: 'PDF', external: false }],
  ['https://supplier.example/a.JPG?key=1#page', '', { format: 'JPG', external: true }],
  ['/a%2Epng', '', { format: 'PNG', external: false }],
  ['/a.docx', '', { format: 'DOCX', external: false }],
  ['/a.xlsx', '', { format: 'XLSX', external: false }],
  ['/a.zip', '', { format: 'ZIP', external: false }],
  ['/document?id=123&name=file.pdf', '', { format: '', external: false }],
  ['/document', 'application/pdf; charset=binary', { format: 'PDF', external: false }],
  ['/document', 'application/octet-stream', { format: '', external: false }],
  ['//supplier.example/document', '', { format: '', external: true }],
  ['/a.pdf.exe', '', { format: '', external: false }],
  ['https://[broken', '', null],
  ['/bad%ZZ.pdf', '', null],
  ['javascript:alert(1)', '', null],
  ['data:application/pdf;base64,abc', '', null],
  ['https://user:pass@example.com/a.pdf', '', null],
  ['', '', null],
  ['#description', '', null],
];
for (const [url, type, expected] of cases) {
  assert.deepEqual(downloadMetadata(url, type, base), expected, url);
}
for (const count of ['', ' (1)', ' (2)', ' (27)']) {
  const original = `Súvisiace súbory${count}`;
  const renamed = original.replace(TEXTS.productDownloads.oldTab, TEXTS.productDownloads.tab);
  assert.equal(renamed, `Súbory na stiahnutie${count}`);
  assert.equal(renamed.replace(TEXTS.productDownloads.oldTab, TEXTS.productDownloads.tab), renamed);
}
for (const label of ['Súvisiace produkty (2)', 'Podobné produkty (3)', 'Diskusia']) {
  assert.equal(label.replace(TEXTS.productDownloads.oldTab, TEXTS.productDownloads.tab), label);
}
assert.deepEqual(downloads.pages, ['detail']);
console.log('PASS: 18 URL/format cases; 4 counters + repeated replacement; 3 unrelated tabs; detail-only registration.');
console.log('DOM, tab interaction, geometry and real browser checks are pending; this is not browser QA.');
