// LB1 · Read-only official API checks. No analytics emission, indexing or settings writes.
import { writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { searchProducts, readSearchState, buildSearchRequest } from '../shared/luigi/search.js';
const config = { trackerId: '842889-1266949', facets: ['brand', 'color', 'flags', 'price_amount'], sorts: ['price_amount:asc', 'price_amount:desc'], size: 3 };
const fields = ['price_amount', 'unit', 'minimum_amount', 'vat_rate', 'Balenie', 'negative_amount', 'availability', 'availability_stock_quantity', 'availability_timber_sklad', 'availability_dolny_hricov', 'availability_rank_text', 'availability_centralny_sklad_', 'item_id', 'code', 'flags_codes'];
export async function runPreflight() {
  const out = { recordedAt: new Date().toISOString(), diagnosticOnly: true, frontendActivated: false, analyticsEmitted: false, requests: [] };
  for (const query of ['306317', '553488', '344255', '491405', '237597', '494606', 'BLUM 450']) {
    const state = { query, filters: [], sort: '', page: 1 };
    const results = await searchProducts(state, config);
    out.requests.push({ query, request: buildSearchRequest(state, config).href, productCount: results.total_hits, facets: results.facets.map((f) => f.name), hits: results.hits.map((h) => ({ identity: h.url, type: h.type, title: h.attributes.title, fields: Object.fromEntries(fields.filter((f) => f in h.attributes).map((f) => [f, h.attributes[f]])), attributeNames: Object.keys(h.attributes).sort(), nestedCount: h.nested?.length ?? null })) });
  }
  for (const query of ['?q=BLUM+450&f[]=flags:Skladom', '?q=BLUM+450&f[]=flags:Skladom&f[]=color:Biela&f[]=brand:BLUM&sort=price_amount:asc']) {
    const state = readSearchState(query), results = await searchProducts(state, config);
    out.requests.push({ state, request: buildSearchRequest(state, config).href, productCount: results.total_hits, filters: results.filters, facets: results.facets.map((f) => f.name), returnedPrices: results.hits.map((h) => h.attributes.price_amount) });
  }
  // Look for candidate fixtures only. Zero availability is not a proven orderable=false.
  const url = new URL('https://live.luigisbox.com/search');
  for (const [key, value] of [['tracker_id', config.trackerId], ['f[]', 'type:product'], ['f[]', 'availability:0'], ['size', '3']]) url.searchParams.append(key, value);
  const candidates = await (await fetch(url)).json();
  out.unavailableCandidates = { productCount: candidates.results?.total_hits, hits: candidates.results?.hits?.map((h) => ({ identity: h.url, type: h.type, fields: Object.fromEntries(fields.filter((f) => f in h.attributes).map((f) => [f, h.attributes[f]])) })), qualifiedUnorderable: false };
  return out;
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const output = process.argv[2];
  if (!output) throw new Error('Usage: node scripts/luigi-parity-preflight.mjs <output.json>');
  await writeFile(output, JSON.stringify(await runPreflight(), null, 2) + '\n');
  console.log('Read-only Search API preflight saved; not a frontend/cart acceptance.');
}
