import { createRequire } from 'node:module';
import { build } from 'esbuild';
import * as fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright-core');
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
    headless: true,
    args: ['--no-sandbox'],
  });
  try {
    let failSource = false;
    const exportMode = process.env.STOCK_TEST_SOURCE === 'export';
    const bundle = await build({
      stdin: {
        contents: "import module from './src/modules/warehouse-stock/index.js';module.init();",
        resolveDir: process.cwd(),
      },
      bundle: true,
      write: false,
      define: {
        __WAREHOUSE_PREVIEW__: 'true',
        __WAREHOUSE_NATIVE_VERIFIED__: 'false',
        __WAREHOUSE_ENDPOINT__: '"https://stock.test/batch"',
      },
    });
    const page = await browser.newPage({ viewport: { width: 375, height: 1000 } });
    page.on('pageerror', (e) => console.log('PAGEERROR', e.message));
    await page.route('https://stock.test/**', async (route) => {
      if (failSource) return route.fulfill({ status: 503, body: 'offline' });
      const items = JSON.parse(route.request().postData()).items;
      await new Promise((r) => setTimeout(r, items[0].code === 'A' ? 500 : 10));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        headers: { 'access-control-allow-origin': '*' },
        body: JSON.stringify({
          items: items.map((i) => ({
            ...i,
            state: 'known',
            unit: 'pár',
            asOf: Date.now() - (exportMode ? 120000 : 0),
            expiresAt: Date.now() + 5000,
            source: exportMode ? 'shoptet-export' : 'MODELED TEST DATA',
            warehouses: [
              { key: 'hricov', quantity: i.code === 'A' ? 12 : 0 },
              { key: 'csnk', quantity: i.code === 'A' ? 45 : i.code === 'B' ? 8 : 0 },
            ],
          })),
        }),
      });
    });
    await page.setContent(
      `<style>body{margin:8px;font:14px Arial}.p-detail{max-width:500px}.availability-value{display:block}.products{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.products.list{display:block}.p{min-width:0;margin:5px;padding:10px;border:1px solid #eee}</style><b>TESTOVACIE DÁTA – nie reálny sklad</b><div class=p-detail><h1>Test variantov</h1><form id=product-detail-form><input name=priceId value=11><input name=amount value=1><button type=button>Do košíka</button></form><div class=p-code><span class=parameter-dependent>A</span></div><div class=availability-value><span class=availability-label>Pôvodný stav Shoptet</span><span class=availability-amount>(57 ks)</span><small class=delivery>Termín doručenia</small></div><span data-variant-unit=ks hidden></span></div><div class=products><div class=p data-micro=product data-micro-product-id=101 data-micro-identifier=11111111-1111-1111-1111-111111111111><span data-micro=sku>A</span><div class=availability><span>Natívny stav</span></div></div></div>`,
    );
    await page.addStyleTag({ path: 'src/modules/warehouse-stock/warehouse-stock.css' });
    await page.addStyleTag({ path: 'src/styles/overrides/warehouse-stock.css' });
    await page.evaluate(() => {
      window.Timber = {};
      window.TimberLoader = { preview: true };
      window.getShoptetDataLayer = () => ({
        id: 101,
        guid: '11111111-1111-1111-1111-111111111111',
        hasVariants: true,
        codes: [{ code: 'A' }, { code: 'B' }, { code: 'ZERO' }],
      });
      window.getShoptetProductsList = () => ({
        11: { base_id: 101, content_ids: ['A'] },
        22: { base_id: 101, content_ids: ['B'] },
        33: { base_id: 101, content_ids: ['ZERO'] },
      });
      window.originalNodes = [...document.querySelectorAll('.availability-value>span')];
      window.changeVariant = (v) => {
        document.querySelector('input[name=priceId]').value = v;
        document
          .querySelector('input[name=priceId]')
          .dispatchEvent(new Event('change', { bubbles: true }));
      };
    });
    await page.addScriptTag({ content: bundle.outputFiles[0].text });
    await page.waitForTimeout(40);
    await page.evaluate(() => changeVariant('22'));
    await page.waitForFunction(() =>
      document.querySelector('.p-detail .ts-warehouse-stock')?.innerText.includes('8 párov'),
    );
    await page.waitForTimeout(600);
    assert.equal(
      (await page.locator('.p-detail .ts-warehouse-stock').allTextContents())[0],
      'CENTRÁLNY SKLAD — 8 párov',
    );
    await page.evaluate(() => changeVariant('11'));
    await page.waitForFunction(() =>
      document.querySelector('.p-detail .ts-warehouse-stock')?.innerText.includes('12 párov'),
    );
    assert.equal(
      (await page.locator('.p-detail .ts-warehouse-stock').allTextContents())[0],
      'SKLADOM — 12 párovCENTRÁLNY SKLAD — 45 párov',
    );
    for (const width of [320, 375, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    }
    assert(await page.locator('.delivery').isVisible());
    assert(await page.evaluate(() => originalNodes.every((n) => n.isConnected)));
    assert(await page.locator('.p .ts-warehouse-stock').isVisible());
    await page.evaluate(() => document.querySelector('.products').classList.add('list'));
    assert(await page.locator('.p .ts-warehouse-stock').isVisible());
    await page.evaluate(() => {
      const clone = document.querySelector('.p').cloneNode(true);
      clone.querySelector('.ts-warehouse-stock').remove();
      document.querySelector('.products').append(clone);
      document.dispatchEvent(new Event('ShoptetDOMPageMoreProductsLoaded'));
    });
    await page.waitForFunction(
      () => document.querySelectorAll('.p .ts-warehouse-stock:not([hidden])').length === 2,
    );
    if (process.env.STOCK_TEST_ARTIFACT_DIR) {
      await fs.mkdir(process.env.STOCK_TEST_ARTIFACT_DIR, { recursive: true });
      await page.screenshot({
        path: process.env.STOCK_TEST_ARTIFACT_DIR + '/modeled-dom.png',
        fullPage: true,
      });
    }
    await page.evaluate(() => changeVariant('33'));
    await page.waitForTimeout(100);
    assert(await page.locator('.p-detail .ts-warehouse-stock').isHidden());
    await page.evaluate(() => changeVariant('0'));
    await page.waitForTimeout(100);
    assert(await page.locator('.p-detail .ts-warehouse-stock').isHidden());
    await page.evaluate(() => changeVariant('11'));
    await page.waitForFunction(
      () => !document.querySelector('.p-detail .ts-warehouse-stock').hidden,
    );
    failSource = true;
    await page.waitForFunction(
      () => document.querySelector('.p-detail .ts-warehouse-stock').hidden,
      null,
      { timeout: 6500 },
    );
    assert(await page.locator('.availability-label').isVisible());
    const report = {
      type: 'MODELED DOM ONLY',
      sourceMode: exportMode ? 'export-cache' : 'api-contract',
      passed: true,
      checks: [
        'variant race: delayed A never overwrites B',
        'two stocks ordered; exact quantities',
        'zero and unselected native fallback',
        'native nodes, delivery and form preserved',
        'card/grid/list and AJAX append',
        'no horizontal overflow at 320/375/768/1440',
        'expired quantities hidden during source outage',
      ],
      realStockVerified: false,
    };
    if (process.env.STOCK_TEST_ARTIFACT_DIR)
      await fs.writeFile(
        process.env.STOCK_TEST_ARTIFACT_DIR + '/dom-results.json',
        JSON.stringify(report, null, 2),
      );
    console.log(report);
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
