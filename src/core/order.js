// Current My Order endpoint, verified in Shoptet's shipped widget. This is a
// read-only presentation adapter; the native widget still owns all actions.
import { SEL } from './selectors.js';

const statuses = new Map();

export function classifyOrderStatus(status) {
  if (status.canceled || /^(zrušená|stornovaná)( objednávka)?$/iu.test(status.name))
    return 'cancelled';
  if (/^(vybavená|dokončená|doručená)( objednávka)?$/iu.test(status.name)) return 'success';
  if (/^(vybavuje sa|spracováva sa|v spracovaní)$/iu.test(status.name)) return 'warning';
  return 'info'; // Unknown/custom states retain a neutral indicator.
}

export function getOrderStatus(root) {
  // Signed email links use ?token= rather than ?orderCode=. Read the verified
  // widget configuration, never decode the token or infer an order identifier.
  let config;
  try {
    config = JSON.parse(root.querySelector(SEL.orderWidget)?.dataset.widget || 'null');
  } catch {
    return Promise.resolve(null);
  }
  const code = ['valid', 'cancelled'].includes(config?.state) ? config.orderCode : null;
  if (!code) return Promise.resolve(null);
  if (!statuses.has(code)) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    statuses.set(
      code,
      fetch(`/action/MyOrder/data/?orderCode=${encodeURIComponent(code)}`, {
        credentials: 'same-origin',
        signal: controller.signal,
      })
        .then(async (response) => {
          if (!response.ok) return null;
          const data = await response.json();
          const status = data?.order?.status;
          if (data?.order?.code !== code || typeof status?.name !== 'string' || !status.name.trim())
            return null;
          return { name: status.name, kind: classifyOrderStatus(status) };
        })
        .catch(() => null)
        .finally(() => clearTimeout(timer)),
    );
  }
  return statuses.get(code);
}
