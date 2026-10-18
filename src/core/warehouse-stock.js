import { fromNative, unknown, validRecord } from '../../shared/warehouse-stock/model.js';
/* global __WAREHOUSE_ENDPOINT__ */
export const STOCK_TTL = 30000;
export const stockKey = (item) =>
  `${item.productId}|${item.guid || ''}|${item.code}|${item.unit || ''}`;

// One shared queue for detail, variants, related products, GRID and LIST.
export function createStockService({
  fetcher = (...args) => fetch(...args),
  endpoint = __WAREHOUSE_ENDPOINT__,
  nativeVerified = false,
  nativeUrl = () => window.shoptet?.config?.stockAmountUrl,
  now = Date.now,
} = {}) {
  const cache = new Map();
  const pending = new Map();
  const queue = [];
  let timer;
  let active = 0;
  let discoveryRetryAt = 0;
  let status = unknown('not-loaded');
  function pump() {
    if (active >= 2 || !queue.length) return;
    const jobs = queue.splice(0, 24);
    active++;
    const ids = [...new Set(jobs.map((job) => String(job.identity.productId)))];
    const native = endpoint ? null : nativeUrl();
    let request;
    if (endpoint) {
      request = [
        endpoint,
        {
          method: 'POST',
          credentials: 'omit',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: jobs.map(({ identity }) => identity) }),
        },
      ];
    } else if (
      typeof native === 'string' &&
      native.startsWith('/') &&
      !native.startsWith('//') &&
      now() >= discoveryRetryAt
    ) {
      const url = new URL(native, window.location.origin);
      ids.forEach((id) => url.searchParams.append('ids[]', id));
      request = [
        url.href,
        { credentials: 'same-origin', headers: { 'X-Shoptet-XHR': 'Shoptet_Coo7ai' } },
      ];
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    Promise.resolve()
      .then(async () => {
        if (!request) return null;
        const response = await fetcher(request[0], { ...request[1], signal: controller.signal });
        if (!response.ok) throw new Error('stock-source-unavailable');
        return response.json();
      })
      .then((data) => {
        for (const job of jobs) {
          let result = endpoint
            ? data?.items?.find(
                (item) =>
                  String(item.productId) === String(job.identity.productId) &&
                  item.code === job.identity.code &&
                  item.guid?.toLowerCase() === job.identity.guid?.toLowerCase(),
              )
            : data
              ? fromNative(data.payload, job.identity, now(), STOCK_TTL)
              : unknown(
                  now() < discoveryRetryAt
                    ? 'required-warehouses-not-exposed'
                    : 'native-url-unavailable',
                );
          if (!endpoint && result?.state === 'known' && !nativeVerified)
            result = unknown('native-semantics-unverified');
          if (!validRecord(result, job.identity, now()))
            result = unknown(result?.reason || 'unverified-response');
          if (result.reason === 'required-warehouses-not-exposed')
            discoveryRetryAt = now() + 300000;
          status = result.state === 'known' ? { state: 'known', source: result.source } : result;
          finish(job, result);
        }
      })
      .catch(() => {
        status = unknown('source-unavailable');
        jobs.forEach((job) => finish(job, status));
      })
      .finally(() => {
        clearTimeout(timeout);
        active--;
        pump();
      });
    pump();
  }
  function finish(job, value) {
    cache.delete(job.key);
    cache.set(job.key, {
      value,
      expiresAt: value.state === 'known' ? value.expiresAt : now() + STOCK_TTL,
    });
    while (cache.size > 400) cache.delete(cache.keys().next().value);
    pending.delete(job.key);
    job.resolve(value);
  }
  return {
    get(identity) {
      const key = stockKey(identity);
      const entry = cache.get(key);
      if (entry?.expiresAt > now()) return Promise.resolve(entry.value);
      if (pending.has(key)) return pending.get(key);
      if (queue.length >= 120) return Promise.resolve(unknown('queue-limit'));
      const promise = new Promise((resolve) => queue.push({ identity, key, resolve }));
      pending.set(key, promise);
      clearTimeout(timer);
      timer = setTimeout(pump, 15);
      return promise;
    },
    status: () => status,
  };
}
