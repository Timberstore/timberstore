/* Run with Playwright installed; PLAYWRIGHT_MODULE can select the environment copy.
   Uses public pages and injected CSS only. No cart mutation or vendor config. */
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright-core');
const fs = require('node:fs');
const path = require('node:path');
const dir = __dirname;
const out = path.join(dir, 'live');
fs.mkdirSync(out, { recursive: true });
process.env.PW_TEST_SCREENSHOT_NO_FONTS_READY = '1';
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
    proxy: { server: process.env.HTTPS_PROXY },
    args: ['--no-sandbox'],
  });
  const report = {
    checkedAt: new Date().toISOString(),
    requests: [],
    states: [],
    errors: [],
    cart: 'NOT TESTED: no cart mutation',
    safari: 'NOT TESTED',
  };
  for (const width of [1440, 375]) {
    const page = await browser.newPage({
      viewport: { width, height: width === 375 ? 812 : 1000 },
      isMobile: width === 375,
      hasTouch: width === 375,
    });
    page.on('response', (r) => {
      if (/luigisbox/.test(r.url()))
        report.requests.push({ width, url: r.url(), status: r.status() });
    });
    page.on('requestfailed', (r) => {
      if (/luigisbox/.test(r.url()))
        report.requests.push({ width, url: r.url(), error: r.failure()?.errorText });
    });
    page.on('pageerror', (e) => report.errors.push({ width, message: e.message }));
    await page.goto('https://www.timberstore.sk/vyhladavanie/?string=BLUM+450', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    await page.locator('#lb-search-element .lb-product').first().waitFor({ timeout: 60000 });
    await page.waitForTimeout(3000);
    const reject = page.getByText('Odmietnuť', { exact: true });
    if (await reject.isVisible()) await reject.click();
    await page.waitForTimeout(2500);
    const noticeClose = page.getByRole('button', { name: 'Zavrieť oznam', exact: true });
    if (await noticeClose.isVisible()) await noticeClose.evaluate((element) => element.click());
    const capture = async (state, root, after = false) => {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(500);
      const data = await page.evaluate(
        ({ root, state, after, width }) => {
          const el = document.querySelector(root);
          const names = [...el.querySelectorAll('.luigi-ac-name, .lb-product .name')].map((e) => ({
            text: e.textContent.trim(),
            clipped: e.scrollHeight > e.clientHeight + 2,
            clamp: getComputedStyle(e).webkitLineClamp,
            height: e.clientHeight,
            scrollHeight: e.scrollHeight,
          }));
          const links = [...el.querySelectorAll('a[href]')].map((e) => e.getAttribute('href'));
          const colors = [...el.querySelectorAll('.availability span[style], .luigi-ac-attrs')]
            .slice(0, 7)
            .map((e) => ({ text: e.textContent.trim(), color: getComputedStyle(e).color }));
          return {
            width,
            state,
            after,
            names,
            links,
            colors,
            horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
            root: el.className,
          };
        },
        { root, state, after, width },
      );
      report.states.push(data);
      await page.screenshot({
        path: path.join(out, `${state}-${width}-${after ? 'after' : 'before'}.png`),
        timeout: 20000,
        animations: 'disabled',
      });
      if (state === 'results') {
        await page
          .locator('#lb-search-element .lb-product')
          .first()
          .evaluate((e) => window.scrollTo(0, e.getBoundingClientRect().top + scrollY - 150));
        await page.waitForTimeout(300);
        await page.screenshot({
          path: path.join(out, `results-cards-${width}-${after ? 'after' : 'before'}.png`),
          timeout: 20000,
          animations: 'disabled',
        });
      }
    };
    for (const after of [false, true]) {
      if (after) await page.addStyleTag({ path: path.join(dir, 'luigi-scoped.css') });
      await page.evaluate(() => window.scrollTo(0, 0));
      await capture('results', '#lb-search-element', after);
    }
    // Use only a visible native search control, preserving vendor listeners.
    let input = page.locator('input[name="string"]:visible').first();
    if (!(await input.count())) {
      await page.locator('[data-target="search"]:visible').first().click();
      input = page.locator('input[name="string"]:visible').first();
    }
    await input.fill('BLUM 450');
    if (width === 375) {
      const hero = page.locator('.luigi-ac-heromobile-input:visible');
      await hero.waitFor();
      await hero.fill('BLUM 450');
    }
    await page.waitForFunction(
      () =>
        document.querySelector('#lbx-ac-element meta[itemprop="query"]')?.content === 'BLUM 450',
    );
    await page
      .locator('#lbx-ac-element .luigi-ac-product')
      .first()
      .waitFor({ state: 'visible', timeout: 30000 });
    await page.waitForTimeout(1500);
    // Remove only the injected preview stylesheet for the matching baseline.
    await page.evaluate(() =>
      document.querySelectorAll('style').forEach((e) => {
        if (e.textContent.includes('LB1 preview only:')) e.remove();
      }),
    );
    await capture('autocomplete', '#lbx-ac-element');
    await page.addStyleTag({ path: path.join(dir, 'luigi-scoped.css') });
    await capture('autocomplete', '#lbx-ac-element', true);
    await page.close();
    fs.writeFileSync(path.join(out, 'verification.json'), JSON.stringify(report, null, 2) + '\n');
  }
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
