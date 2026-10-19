import {
  makeRecord,
  quantity,
  unknown,
  EXPORT_MAX_AGE,
  WAREHOUSES,
} from '../../shared/warehouse-stock/model.js';

const MAX_BYTES = 32 * 1024 * 1024;
export const DEFAULT_EXPORT_COLUMNS = Object.fromEntries(
  WAREHOUSES.map(({ key, title }) => [key, 'stock:' + title]),
);

// Strict CSV, never availability text, an aggregate "stock" column, or a guessed schema.
export function parseStockCsv(csv, { delimiter = ';', columns = DEFAULT_EXPORT_COLUMNS } = {}) {
  if (![';', ',', '\t'].includes(delimiter) || typeof csv !== 'string' || csv.length > MAX_BYTES)
    throw new Error('export-format-invalid');
  csv = csv.replace(/^\uFEFF/, '');
  for (const { key, title } of WAREHOUSES) {
    const expected = 'stock:' + title;
    if (![expected, expected + ' (predvolené)'].includes(columns[key]))
      throw new Error('export-warehouse-column-mismatch');
  }
  const rows = [];
  let row = [],
    field = '',
    quoted = false,
    closed = false;
  const push = () => {
    row.push(field);
    field = '';
    closed = false;
  };
  for (let i = 0; i < csv.length; i++) {
    const char = csv[i];
    if (quoted) {
      if (char === '"' && csv[i + 1] === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        quoted = false;
        closed = true;
      } else field += char;
    } else if (char === '"') {
      if (field || closed) throw new Error('export-csv-invalid');
      quoted = true;
    } else if (char === delimiter) push();
    else if (char === '\n' || char === '\r') {
      push();
      rows.push(row);
      row = [];
      if (char === '\r' && csv[i + 1] === '\n') i++;
    } else {
      if (closed) throw new Error('export-csv-invalid');
      field += char;
    }
    if (row.length > 100 || rows.length > 50000) throw new Error('export-size-limit');
  }
  if (quoted) throw new Error('export-csv-invalid');
  if (field || row.length || closed) {
    push();
    rows.push(row);
  }
  const header = rows
    .shift()
    ?.map((value, index) => (index ? value : value.replace(/^\uFEFF/, '')));
  if (!header || new Set(header).size !== header.length || columns.hricov === columns.csnk)
    throw new Error('export-header-invalid');
  const required = [
    'code',
    'unit',
    'productVisibility',
    'variantVisibility',
    columns.hricov,
    columns.csnk,
  ];
  if (!required.every((name) => header.includes(name))) throw new Error('export-columns-missing');
  const index = new Map();
  const seen = new Set();
  for (const values of rows) {
    if (values.every((value) => value === '')) continue;
    if (values.length !== header.length) throw new Error('export-row-invalid');
    const item = Object.fromEntries(header.map((name, i) => [name, values[i]]));
    if (
      !item.code ||
      item.code !== item.code.trim() ||
      item.code.length > 80 ||
      /[\x00-\x1f]/.test(item.code)
    )
      throw new Error('export-sku-invalid');
    if (seen.has(item.code)) throw new Error('export-duplicate-sku');
    seen.add(item.code);
    if (item.productVisibility !== 'visible' || item.variantVisibility !== '1') continue;
    if (!item.unit || item.unit.length > 30 || /[\x00-\x1f]/.test(item.unit)) continue;
    const amounts = {};
    for (const key of ['hricov', 'csnk']) {
      const raw = item[columns[key]].trim();
      amounts[key] = /^-?\d+(?:[.,]\d+)?$/.test(raw) ? quantity(raw.replace(',', '.')) : null;
    }
    if (Object.values(amounts).some((value) => value === null)) continue;
    if (item.guid && !/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(item.guid)) continue;
    index.set(item.code, { amounts, unit: item.unit, guid: item.guid || null });
  }
  if (!index.size) throw new Error('export-no-public-stock-records');
  return index;
}

export function createExportStockProvider({
  readExport,
  verified = false,
  mode,
  columns = DEFAULT_EXPORT_COLUMNS,
  delimiter = ';',
  now = Date.now,
  refreshMs = 300000,
} = {}) {
  if (!(refreshMs >= 60000 && refreshMs <= 300000)) throw new Error('export-refresh-invalid');
  let snapshot,
    pending,
    timer,
    nextRefreshAt = 0;
  let state = 'export-not-loaded';
  async function refresh() {
    if (!verified || mode !== 'available') {
      state = 'export-verification-required';
      return;
    }
    if (pending) return pending;
    if (now() < nextRefreshAt) return;
    nextRefreshAt = now() + refreshMs;
    pending = Promise.resolve()
      .then(readExport)
      .then(({ csv, observedAt }) => {
        if (
          !Number.isFinite(observedAt) ||
          observedAt > now() ||
          now() - observedAt >= EXPORT_MAX_AGE
        )
          throw new Error('export-observation-invalid');
        const index = parseStockCsv(csv, { columns, delimiter });
        snapshot = { index, asOf: observedAt };
        state = 'export-ready';
      })
      .catch(() => {
        state = 'export-refresh-failed';
      })
      .finally(() => {
        pending = null;
      });
    return pending;
  }
  return {
    refresh,
    start() {
      if (timer) return;
      void refresh();
      timer = setInterval(() => {
        void refresh();
      }, refreshMs);
      timer.unref?.();
    },
    stop() {
      clearInterval(timer);
      timer = null;
    },
    status: () => ({ state, snapshotAsOf: snapshot?.asOf ?? null }),
    async batch(items) {
      const time = now();
      if (!verified || mode !== 'available')
        return items.map((identity) => ({
          ...identity,
          ...unknown('export-verification-required'),
        }));
      if (time >= nextRefreshAt) void refresh();
      return items.map((identity) => {
        const entry = snapshot?.index.get(identity.code);
        if (!snapshot || time - snapshot.asOf >= EXPORT_MAX_AGE)
          return { ...identity, ...unknown('export-missing-or-expired') };
        if (!entry || (entry.guid && entry.guid.toLowerCase() !== identity.guid.toLowerCase()))
          return { ...identity, ...unknown('export-sku-unavailable') };
        return makeRecord(identity, entry.amounts, {
          unit: entry.unit,
          asOf: snapshot.asOf,
          expiresAt: Math.min(time + 30000, snapshot.asOf + EXPORT_MAX_AGE),
          source: 'shoptet-export',
        });
      });
    },
  };
}

// The secured URL stays on the server; even error output never includes it.
export function createExportReader({
  url,
  encoding = 'utf-8',
  fetcher = fetch,
  now = Date.now,
} = {}) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error('export-url-invalid');
  }
  if (
    parsed.protocol !== 'https:' ||
    !['www.timberstore.sk', '765909.myshoptet.com'].includes(parsed.hostname) ||
    parsed.username ||
    parsed.password ||
    parsed.port ||
    parsed.hash
  )
    throw new Error('export-url-invalid');
  if (!['utf-8', 'windows-1250'].includes(encoding)) throw new Error('export-encoding-invalid');
  return async () => {
    const started = now();
    try {
      const response = await fetcher(parsed.href, {
        method: 'GET',
        credentials: 'omit',
        redirect: 'error',
        headers: { Accept: 'text/csv', 'Cache-Control': 'no-cache' },
        signal: AbortSignal.timeout(20000),
      });
      if (
        !response.ok ||
        !response.body ||
        /text\/html/i.test(response.headers.get('content-type') || '')
      )
        throw new Error();
      const age = response.headers.get('age') || '0';
      if (!/^\d+$/.test(age) || Number(age) * 1000 >= EXPORT_MAX_AGE) throw new Error();
      if (Number(response.headers.get('content-length')) > MAX_BYTES) throw new Error();
      const chunks = [];
      let size = 0;
      for await (const chunk of response.body) {
        size += chunk.byteLength;
        if (size > MAX_BYTES) throw new Error();
        chunks.push(chunk);
      }
      return {
        csv: new TextDecoder(encoding, { fatal: true }).decode(Buffer.concat(chunks)),
        observedAt: started - Number(age) * 1000,
      };
    } catch {
      throw new Error('export-fetch-failed');
    }
  };
}
