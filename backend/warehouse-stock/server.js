import http from 'node:http';
import { pathToFileURL } from 'node:url';
import { createApiStockProvider, createShoptetRequest } from './provider.js';
import {
  createExportStockProvider,
  createExportReader,
  DEFAULT_EXPORT_COLUMNS,
} from './export-provider.js';

export function validItems(value) {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.length <= 24 &&
    value.every(
      (item) =>
        item &&
        typeof item.productId === 'string' &&
        /^\d{1,12}$/.test(item.productId) &&
        typeof item.guid === 'string' &&
        /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(item.guid) &&
        typeof item.code === 'string' &&
        item.code.length > 0 &&
        item.code.length <= 80 &&
        !/[\x00-\x1f]/.test(item.code),
    )
  );
}
function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    let bytes = 0;
    request.on('data', (chunk) => {
      bytes += chunk.length;
      if (bytes > 16000) {
        reject(new Error('body-too-large'));
        return;
      }
      body += chunk;
    });
    request.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('invalid-json'));
      }
    });
    request.on('error', reject);
  });
}
export function createStockServer({
  provider,
  origin = 'https://www.timberstore.sk',
  now = Date.now,
} = {}) {
  let count = 0;
  let windowStart = now();
  const server = http.createServer(async (req, res) => {
    const send = (status, value) => {
      res.writeHead(status, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
        Vary: 'Origin',
        ...(req.headers.origin === origin ? { 'Access-Control-Allow-Origin': origin } : {}),
      });
      res.end(JSON.stringify(value));
    };
    if (req.headers.origin && req.headers.origin !== origin)
      return send(403, { error: 'origin-not-allowed' });
    if (req.url === '/health' && req.method === 'GET')
      return send(200, {
        status: provider ? 'configured' : 'not-configured',
        source: provider?.status?.(),
      });
    if (req.url !== '/v1/warehouse-stock/batch') return send(404, { error: 'not-found' });
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '300',
        Vary: 'Origin',
      });
      return res.end();
    }
    if (req.method !== 'POST') return send(405, { error: 'method-not-allowed' });
    if (now() - windowStart >= 60000) {
      windowStart = now();
      count = 0;
    }
    if (++count > 200) return send(429, { error: 'request-budget-exceeded' });
    if (!provider) return send(503, { error: 'stock-source-not-configured' });
    try {
      const body = await readBody(req);
      if (!validItems(body.items)) return send(400, { error: 'invalid-items' });
      return send(200, {
        items: await provider.batch(
          body.items.map(({ productId, guid, code }) => ({ productId, guid, code })),
        ),
      });
    } catch (error) {
      return send(error.message === 'body-too-large' ? 413 : 400, { error: 'invalid-request' });
    }
  });
  server.on('close', () => provider?.stop?.());
  server.requestTimeout = 8000;
  server.headersTimeout = 5000;
  server.maxConnections = 100;
  return server;
}
export function providerFromEnv(env = process.env) {
  const source = env.STOCK_SOURCE || 'api';
  if (source === 'export') {
    if (!env.SHOPTET_EXPORT_URL) return null;
    return createExportStockProvider({
      verified: env.SHOPTET_EXPORT_VERIFIED === '1',
      mode: env.SHOPTET_EXPORT_AMOUNT_MODE,
      delimiter: env.SHOPTET_EXPORT_DELIMITER || ';',
      refreshMs: Number(env.SHOPTET_EXPORT_REFRESH_SECONDS || 300) * 1000,
      columns: {
        hricov: env.SHOPTET_EXPORT_HRICOV_COLUMN || DEFAULT_EXPORT_COLUMNS.hricov,
        csnk: env.SHOPTET_EXPORT_CSNK_COLUMN || DEFAULT_EXPORT_COLUMNS.csnk,
      },
      readExport: createExportReader({
        url: env.SHOPTET_EXPORT_URL,
        encoding: env.SHOPTET_EXPORT_ENCODING || 'utf-8',
      }),
    });
  }
  if (source !== 'api') throw new Error('Unknown stock source');
  if (!env.SHOPTET_ACCESS_TOKEN && !env.SHOPTET_PRIVATE_API_TOKEN) return null;
  return createApiStockProvider({
    verified: env.SHOPTET_STOCK_VERIFIED === '1',
    mode: env.SHOPTET_STOCK_AMOUNT_MODE,
    explicit: { hricov: env.SHOPTET_HRICOV_STOCK_ID, csnk: env.SHOPTET_CSNK_STOCK_ID },
    request: createShoptetRequest({
      accessToken: env.SHOPTET_ACCESS_TOKEN,
      privateToken: env.SHOPTET_PRIVATE_API_TOKEN,
    }),
  });
}
function start() {
  const provider = providerFromEnv();
  provider?.start?.();
  createStockServer({
    provider,
    origin: process.env.STOCK_ALLOWED_ORIGIN || 'https://www.timberstore.sk',
  }).listen(Number(process.env.STOCK_PORT || 8787), process.env.STOCK_BIND || '127.0.0.1');
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) start();
