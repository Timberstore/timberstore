import { fromApi, mapWarehouses, unknown } from '../../shared/warehouse-stock/model.js';

// GET-only API adapter. A global limiter and per-GUID single flight protect
// Shoptet even when many browser batches arrive together.
export function createApiStockProvider({
  request,
  verified = false,
  mode,
  explicit = {},
  now = Date.now,
  ttlMs = 30000,
  maxEntries = 1000,
  maxPerMinute = 120,
} = {}) {
  if (!(ttlMs > 0 && ttlMs <= 30000)) throw new Error('Invalid stock cache TTL');
  const cache = new Map();
  const pending = new Map();
  const queue = [];
  let active = 0;
  let windowStart = now();
  let used = 0;
  let warehouses;
  let warehousePromise;
  let projectVerified = false;
  async function limited(path) {
    if (now() - windowStart >= 60000) {
      windowStart = now();
      used = 0;
    }
    if (used >= maxPerMinute || queue.length >= 100) throw new Error('upstream-budget');
    used++;
    return new Promise((resolve, reject) => {
      queue.push({ path, resolve, reject });
      pump();
    });
  }
  function pump() {
    while (active < 4 && queue.length) {
      const job = queue.shift();
      active++;
      Promise.resolve()
        .then(() => request(job.path))
        .then(job.resolve, job.reject)
        .finally(() => {
          active--;
          pump();
        });
    }
  }
  async function mapping() {
    if (warehouses?.expiresAt > now()) return warehouses.value;
    if (!warehousePromise)
      warehousePromise = (async () => {
        if (!projectVerified) {
          const shop = await limited('/api/eshop');
          if (shop?.data?.contactInformation?.eshopId !== 765909) throw new Error('wrong-project');
          projectVerified = true;
        }
        return limited('/api/stocks');
      })()
        .then((body) => {
          const value = mapWarehouses(body?.data?.stocks || [], explicit);
          if (!value) throw new Error('required-warehouses-not-found');
          warehouses = { value, expiresAt: now() + 300000 };
          return value;
        })
        .finally(() => {
          warehousePromise = null;
        });
    return warehousePromise;
  }
  function product(guid) {
    const key = guid.toLowerCase();
    if (cache.get(key)?.expiresAt > now()) return Promise.resolve(cache.get(key));
    if (pending.has(key)) return pending.get(key);
    const work = limited(`/api/products/${encodeURIComponent(key)}?include=perStockAmounts`)
      .then((body) => {
        if (!body?.data || body.errors?.length) throw new Error('invalid-product-response');
        const item = { data: body.data, asOf: now(), expiresAt: now() + ttlMs };
        cache.delete(key);
        cache.set(key, item);
        while (cache.size > maxEntries) cache.delete(cache.keys().next().value);
        return item;
      })
      .finally(() => pending.delete(key));
    pending.set(key, work);
    return work;
  }
  return {
    async batch(items) {
      if (!verified || !['available', 'physical-minus-claim'].includes(mode)) {
        return items.map((identity) => ({ ...identity, ...unknown('api-verification-required') }));
      }
      let map;
      try {
        map = await mapping();
      } catch {
        return items.map((identity) => ({ ...identity, ...unknown('warehouse-discovery-failed') }));
      }
      return Promise.all(
        items.map(async (identity) => {
          try {
            const entry = await product(identity.guid);
            const record = fromApi(entry.data, identity, map, mode, entry.asOf, ttlMs);
            return {
              productId: identity.productId,
              guid: identity.guid,
              code: identity.code,
              ...record,
            };
          } catch {
            return { ...identity, ...unknown('api-unavailable') };
          }
        }),
      );
    },
  };
}

export function createShoptetRequest({ accessToken, privateToken, fetcher = fetch } = {}) {
  if (!!accessToken === !!privateToken)
    throw new Error('Configure exactly one server-side Shoptet token');
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    [privateToken ? 'Shoptet-Private-Api-Token' : 'Shoptet-Access-Token']:
      privateToken || accessToken,
  };
  return async (path) => {
    if (!/^\/api\/(eshop$|stocks$|products\/[a-f0-9-]{36}\?include=perStockAmounts$)/i.test(path))
      throw new Error('Unexpected upstream path');
    const response = await fetcher(`https://api.myshoptet.com${path}`, {
      method: 'GET',
      headers,
      redirect: 'error',
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) throw new Error(`Shoptet request failed (${response.status})`);
    return response.json();
  };
}
