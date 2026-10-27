import asyncio,json,os,subprocess
from pathlib import Path
from playwright.async_api import async_playwright
from checks import route,goto
base=Path(os.environ.get('TIMBER_MENU_WORK', '/tmp/timberstore-menu-rc3'));results=[]
base.mkdir(parents=True, exist_ok=True)
for ext in ['css', 'js']:
 (base/('reference.'+ext)).write_bytes(subprocess.check_output(['git','show','125e208:dist/timber.min.'+ext],cwd=Path(__file__).resolve().parents[4]))

SNAP='''()=>{let f=document.querySelector('#footer .custom-footer__contact'),header=document.querySelector('.ts-service-bar');return {footer:[...f.querySelectorAll('a,svg,.ts-service-bar__hours')].map(e=>{let s=getComputedStyle(e);return {tag:e.tagName,href:e.getAttribute('href'),path:e.querySelector('path')?.getAttribute('d'),font:s.fontSize,color:s.color,bg:s.backgroundColor,image:s.backgroundImage,width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height}}),header:[...header.querySelectorAll('.ts-service-bar__social')].map(e=>({href:e.href,svg:e.querySelector('svg')?.outerHTML,color:getComputedStyle(e).color})),categories:[...document.querySelectorAll('#navigation .menu-level-1>li>a')].map(e=>({text:e.textContent,href:e.getAttribute('href')}))}}'''
async def main():
 async with async_playwright() as p:
  b=await p.chromium.launch(executable_path=os.environ.get('TIMBER_CHROMIUM', '/usr/bin/chromium'),proxy={'server':os.environ['HTTPS_PROXY']},args=['--no-sandbox'])
  for w in [375,1024,1440]:
   samples=[]
   for old in [True,False]:
    ctx=await b.new_context(viewport={'width':w,'height':1000});page=await ctx.new_page()
    async def assets(r):
     if old and '/dist/timber.min.css' in r.request.url:await r.fulfill(path=str(base/'reference.css'),content_type='text/css')
     elif old and '/dist/timber.min.js' in r.request.url:await r.fulfill(path=str(base/'reference.js'),content_type='text/javascript')
     else:await route(r)
    await page.route('**/*',assets)
    await page.goto('https://www.timberstore.sk/',wait_until='load',timeout=60000)
    await page.wait_for_function('window.Timber?.version&&document.body.classList.contains("is-loaded")')
    if await page.locator('[data-testid=buttonCookiesReject]').is_visible():await page.locator('[data-testid=buttonCookiesReject]').click()
    await page.evaluate('document.fonts.ready');await page.wait_for_timeout(500)
    samples.append(await page.evaluate(SNAP));await ctx.close()
   assert samples[0]==samples[1],(w,samples)
   results.append({'test':'footer/header/categories match rc.2','width':w,'pass':True});(base/'regression-results.json').write_text(json.dumps(results,indent=2));print('PASS unchanged footer, desktop service contacts, native categories',w,flush=True)
  for w in [375,1440]:
   ctx=await b.new_context(viewport={'width':w,'height':1000});page=await ctx.new_page();errors=[];posts=[]
   page.on('pageerror',lambda e:errors.append(str(e)));page.on('request',lambda r:posts.append(r.url) if '/Cart/addCartItem/' in r.url and r.method=='POST' else None);await page.route('**/*',route)
   await goto(page,'/franke-drez-ubg-611-86-860x500mm-sedy-kamen/')
   await page.locator('#product-detail-form [data-testid=buttonAddToCart]').click();await page.wait_for_function("document.querySelector('.cart-count.full')")
   await goto(page,'/kosik/');field=page.locator('#cart-wrapper tr.removeable .quantity input').first
   assert await field.input_value()=='1';await page.locator('#cart-wrapper tr.removeable .quantity .increase').first.click();await page.wait_for_timeout(1000)
   assert await field.input_value()=='2' and len(posts)==1,(posts,await field.input_value())
   await page.locator('a[href*="krok-1"]:visible, #continue-order-button:visible, [data-testid=buttonNextStep]:visible').first.click();await page.wait_for_selector('#order-shipping-methods')
   await page.locator('input[name=shippingId]:enabled').first.check(force=True);await page.wait_for_timeout(650)
   await page.locator('input[name=billingId]:enabled').first.check(force=True);await page.wait_for_timeout(650)
   assert not errors,errors
   results.append({'test':'native purchase/cart/checkout shipping/payment','width':w,'posts':len(posts),'pass':True});(base/'regression-results.json').write_text(json.dumps(results,indent=2));print('PASS native purchase/cart/checkout',w,flush=True);await ctx.close()
  await b.close()
asyncio.run(main())
