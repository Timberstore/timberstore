import { SEL } from '../../core/selectors.js';
import { TEXTS } from '../../core/texts.js';
import { SHOPTET_EVENTS } from '../../core/events.js';
import { stockUnit } from '../../core/warehouse-unit.js';
import { cardIdentity, detailIdentity } from '../../core/warehouse-identity.js';
import { createStockService, stockKey, STOCK_TTL } from '../../core/warehouse-stock.js';
/* global __WAREHOUSE_PREVIEW__, __WAREHOUSE_NATIVE_VERIFIED__ */

const records = new Set();
const byHost = new WeakMap();
const format = /* @__PURE__ */ new Intl.NumberFormat('sk-SK', { maximumFractionDigits: 6 });
let service;
let scheduled = false;
let started = false;
function visible(element) {
  return element.getClientRects().length > 0 && getComputedStyle(element).visibility !== 'hidden';
}
function identity(record) {
  const unit = record.root.querySelector(SEL.warehouseUnit)?.dataset.variantUnit?.trim() || null;
  if (record.detail) {
    const product = window.getShoptetDataLayer?.('product');
    const form = document.querySelector(SEL.warehouseDetailForm);
    const priceId = form?.querySelector(SEL.cartFormPriceId)?.value;
    return detailIdentity(product, priceId, window.getShoptetProductsList?.(), unit);
  }
  const codes = [...record.root.querySelectorAll(SEL.warehouseCardCode)];
  if (codes.length !== 1) return null; // Never combine variants or guess a default.
  return cardIdentity(
    record.root.dataset.microProductId,
    record.root.dataset.microIdentifier,
    codes[0].textContent,
    unit,
  );
}
function reset(record) {
  clearTimeout(record.expiryTimer);
  record.host.classList.remove('ts-warehouse-host--known');
  record.component.hidden = true;
  record.expiresAt = 0;
  record.generation++;
}
function render(record, result) {
  const rows = result.warehouses.filter((row) => row.quantity > 0);
  if (!rows.length) {
    reset(record);
    record.expiresAt = result.expiresAt;
    return;
  } // Native zero/backorder/unavailable wording wins.
  const native = [
    ...record.host.querySelectorAll(
      record.detail ? SEL.warehouseNativeDetail : SEL.warehouseNativeCard,
    ),
  ];
  if (
    !native.length ||
    [...record.host.childNodes].some((node) => node.nodeType === 3 && node.textContent.trim())
  )
    return;
  native.forEach((element) => element.classList.add('ts-warehouse-original'));
  const signature = JSON.stringify([result.code, result.unit, rows]);
  if (record.signature !== signature) {
    const nodes = rows.map((row) => {
      const element = document.createElement('div');
      element.className = 'ts-warehouse-stock__row';
      const label = document.createElement('span');
      label.className = 'ts-warehouse-stock__label';
      label.textContent = TEXTS.warehouseStock[row.key];
      const amount = document.createElement('strong');
      amount.className = 'ts-warehouse-stock__amount';
      amount.textContent = `${format.format(row.quantity)} ${stockUnit(result.unit, row.quantity)}`;
      element.append(label, ' — ', amount);
      return element;
    });
    record.component.replaceChildren(...nodes);
    record.signature = signature;
  }
  record.host.classList.add('ts-warehouse-host--known');
  record.component.hidden = false;
  record.expiryTimer = window.setTimeout(
    () => {
      reset(record);
      schedule();
    },
    Math.max(0, result.expiresAt - Date.now()) + 1,
  );
}
function refreshRecord(record) {
  if (!record.host.isConnected) {
    reset(record);
    records.delete(record);
    return;
  }
  if (!visible(record.host)) {
    reset(record);
    return;
  }
  const current = identity(record);
  const key = current && stockKey(current);
  if (!key) {
    reset(record);
    record.key = null;
    return;
  }
  if (key === record.key && record.expiresAt > Date.now()) return;
  reset(record);
  record.key = key;
  const rect = record.host.getBoundingClientRect();
  if (!record.detail && (rect.bottom < -200 || rect.top > window.innerHeight + 200)) return;
  const generation = record.generation;
  service.get(current).then((result) => {
    const latest = identity(record);
    if (
      !record.host.isConnected ||
      generation !== record.generation ||
      !latest ||
      stockKey(latest) !== key
    )
      return;
    record.expiresAt = result.state === 'known' ? result.expiresAt : Date.now() + STOCK_TTL;
    if (result.state === 'known') render(record, result);
    window.Timber.warehouseStock = service.status();
  });
}
function scan() {
  scheduled = false;
  for (const [rootSelector, hostSelector, detail] of [
    [SEL.warehouseDetailRoot, SEL.warehouseDetailHost, true],
    [SEL.warehouseCards, SEL.warehouseCardHost, false],
  ]) {
    for (const root of document.querySelectorAll(rootSelector)) {
      for (const host of root.querySelectorAll(hostSelector)) {
        if (byHost.has(host)) continue;
        const component = document.createElement('div');
        component.className = 'ts-warehouse-stock';
        component.setAttribute('role', 'group');
        component.setAttribute('aria-label', TEXTS.warehouseStock.group);
        component.hidden = true;
        host.append(component);
        const record = { root, host, detail, component, generation: 0, expiresAt: 0 };
        byHost.set(host, record);
        records.add(record);
      }
    }
  }
  for (const record of records) refreshRecord(record);
}
function schedule() {
  if (scheduled || document.hidden) return;
  scheduled = true;
  window.requestAnimationFrame(scan);
}
export default {
  name: 'warehouse-stock',
  pages: ['*'],
  init() {
    if (!__WAREHOUSE_PREVIEW__ || !window.TimberLoader?.preview) return;
    if (started) {
      schedule();
      return;
    }
    started = true;
    service = createStockService({ nativeVerified: __WAREHOUSE_NATIVE_VERIFIED__ });
    for (const event of [
      SHOPTET_EVENTS.variantAvailable,
      SHOPTET_EVENTS.variantUnavailable,
      SHOPTET_EVENTS.variantSimple,
      SHOPTET_EVENTS.variantSplit,
      SHOPTET_EVENTS.variantReset,
      SHOPTET_EVENTS.dataLayerUpdated,
    ]) {
      document.addEventListener(event, () => {
        for (const record of records)
          if (record.detail) {
            reset(record);
            record.key = null;
          }
        schedule();
      });
    }
    document.addEventListener(
      'change',
      (event) => {
        if (!(event.target instanceof Element) || !event.target.closest(SEL.warehouseDetailForm))
          return;
        for (const record of records)
          if (record.detail) {
            reset(record);
            record.key = null;
          }
        schedule();
      },
      true,
    );
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    document.addEventListener('visibilitychange', schedule);
    window.setInterval(schedule, STOCK_TTL);
    new MutationObserver((changes) => {
      if (
        changes.some((change) =>
          [...change.addedNodes].some(
            (node) =>
              node.nodeType === 1 &&
              (node.matches(SEL.warehouseNewContent) ||
                node.querySelector(SEL.warehouseNewContent)),
          ),
        )
      )
        schedule();
    }).observe(document.body, { childList: true, subtree: true });
    scan();
    // Apollo may reveal its purchase panel after our DOMContentLoaded boot.
    window.addEventListener('load', schedule, { once: true });
    window.setTimeout(schedule, 250);
    window.setTimeout(schedule, 1000);
  },
};
