import asyncio,json,os,sys
from pathlib import Path
from playwright.async_api import async_playwright
from flows import route
REPO=Path(__file__).resolve().parents[4]
base=Path(os.environ.get('TIMBER_LOADING_WORK', '/tmp/timberstore-loading-check'))
base.mkdir(parents=True, exist_ok=True)
CHROMIUM=os.environ.get('TIMBER_CHROMIUM', '/usr/bin/chromium')
async def main():
 rows=json.loads((base/'extra-results.json').read_text()) if (base/'extra-results.json').exists() else []
 async with async_playwright() as p:
  browser=await p.chromium.launch(executable_path=CHROMIUM,proxy=({'server':os.environ['HTTPS_PROXY']} if os.environ.get('HTTPS_PROXY') else None),args=['--no-sandbox'])
  for width in ([int(x) for x in sys.argv[1:]] or [375,1440]):
   ctx=await browser.new_context(viewport={'width':width,'height':1000});page=await ctx.new_page();errors=[]
   page.on('pageerror',lambda e:errors.append(str(e)))
   await page.route('**/*',route)
   await page.goto('https://www.timberstore.sk/spojovaci-material/',wait_until='domcontentloaded',timeout=60000)
   await page.wait_for_function('window.Timber&&document.body.classList.contains("is-loaded")')
   await page.locator('#products > .product').first.screenshot(path=str(base/f'fasteners-{width}.png'))
   await page.goto('https://www.timberstore.sk/vyhladavanie/?string=15021',wait_until='domcontentloaded',timeout=60000)
   await page.wait_for_function('window.Timber&&document.body.classList.contains("is-loaded")')
   f=page.locator('#products .product').filter(has=page.locator('.p-code',has_text='15021')).first.locator('form.pr-action')
   await f.wait_for()
   await page.wait_for_timeout(900)
   vals=await f.evaluate('(f)=>({amount:f.querySelector("[name=amount]").value,field:f.querySelector(".ts-qty__value").value})')
   assert vals=={'amount':'10','field':'10'},vals
   await f.locator('.ts-qty__btn--plus').click()
   assert await f.locator('[name=amount]').input_value()=='20'
   await f.locator('.ts-qty__btn--minus').click()
   assert await f.locator('[name=amount]').input_value()=='10'
   # Respect the shop's 5 EUR minimum for checkout: six native ten-piece packs.
   await f.locator('.ts-qty__value').fill('60')
   await f.locator('.ts-qty__value').dispatch_event('change')
   assert await f.locator('[name=amount]').input_value()=='60'
   await f.locator('[data-testid=buttonAddToCart]').click()
   await page.wait_for_selector('#colorbox .advanced-order',timeout=20000)
   await page.wait_for_timeout(500)
   # Close only the current native popup; then exercise the separate mini-cart trigger.
   await page.evaluate('()=>window.jQuery.colorbox.close()');await page.wait_for_timeout(400)
   await page.evaluate('()=>window.scrollTo(0,0)');await page.wait_for_timeout(400)
   toggle=page.locator(('#header .header-top ' if width>=768 else '.top-navigation-bar .responsive-tools ')+'.ts-cart-preview-toggle:visible').first
   await toggle.click();await page.wait_for_timeout(500)
   mini=await page.locator('#cart-widget').evaluate('(e)=>{let r=e.getBoundingClientRect(),s=getComputedStyle(e);return {x:r.x,y:r.y,w:r.width,h:r.height,visibility:s.visibility}}')
   assert mini['w']>0 and mini['x']>=-1 and mini['x']+mini['w']<=width+1,mini
   await page.goto('https://www.timberstore.sk/kosik/',wait_until='domcontentloaded',timeout=60000)
   await page.wait_for_selector('#cart-wrapper .cart-table tr.removeable')
   await page.wait_for_timeout(700)
   links=await page.locator('#cart-wrapper a[href]').evaluate_all('(es)=>es.map(e=>({text:e.textContent.trim(),href:e.getAttribute("href"),test:e.dataset.testid}))')
   (base/f'cart-links-{width}.json').write_text(json.dumps(links,indent=2))
   (base/f'cart-document-{width}.html').write_text(await page.content())
   nextstep=page.locator('a[href*="krok-1"]:visible, #continue-order-button:visible, [data-testid="buttonNextStep"]:visible').first
   await nextstep.click();await page.wait_for_timeout(1800)
   checkout=await page.locator('body').get_attribute('class')
   assert 'in-krok-1' in checkout,(page.url,checkout)
   await page.wait_for_selector('#order-shipping-methods')
   # Verify native method choices and the continuation to details, without submitting an order.
   shipping=page.locator('input[name=shippingId]:enabled').first
   billing=page.locator('input[name=billingId]:enabled').first
   await shipping.check(force=True);await page.wait_for_timeout(700)
   billing=page.locator('input[name=billingId]:enabled').first
   await billing.check(force=True);await page.wait_for_timeout(700)
   rows.append({'width':width,'actualPack':vals,'miniCart':mini,'checkoutUrl':page.url,'shipping':await shipping.count(),'billing':await billing.count(),'errors':errors})
   assert not errors,errors
   print('PASS actual 10-pack, mini-cart, cart, checkout',width,flush=True)
   (base/'extra-results.json').write_text(json.dumps(rows,indent=2))
   await ctx.close()
  await browser.close()
asyncio.run(main())
