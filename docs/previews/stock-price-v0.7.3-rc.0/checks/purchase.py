import asyncio,ast,json,os
from pathlib import Path
from urllib.parse import urlparse
from playwright.async_api import async_playwright
work=Path(os.environ.get('TIMBER_STOCK_WORK','/tmp/timber-stock-price'));results=[];empty=[]
MONITOR="()=>{window.motion=[];let start=performance.now();function snap(sel){let e=document.querySelector(sel);if(!e)return null;let s=getComputedStyle(e),r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,display:s.display,visibility:s.visibility,opacity:+s.opacity,bg:s.backgroundColor,marked:e.classList.contains('ts-cart-add-spinner'),loader:e.firstElementChild&&getComputedStyle(e.firstElementChild).visibility}}function frame(){motion.push({t:performance.now()-start,spinner:snap('.overlay.spinner'),box:snap('#colorbox'),overlay:snap('#cboxOverlay'),ready:!!document.querySelector('#colorbox .advanced-order'),background:snap('#content'),sections:[...document.querySelectorAll('#colorbox .advanced-order>*')].map(e=>({class:e.className,h:e.getBoundingClientRect().height})),fonts:document.documentElement.className,emptyButtons:document.querySelectorAll('#content .product .product-btn:empty').length});if(performance.now()-start<14000)requestAnimationFrame(frame)}frame()}"
async def main():
 work.mkdir(parents=True,exist_ok=True)
 async with async_playwright() as p:
  browser=await p.chromium.launch(executable_path='/usr/bin/chromium',proxy={'server':os.environ['HTTPS_PROXY']},args=['--no-sandbox'])
  async def route(r):
   if '/dist/timber.min.css' in r.request.url:await r.fulfill(path=str(Path(__file__).resolve().parents[4] / 'dist/timber.min.css'),content_type='text/css');return
   if '/dist/timber.min.js' in r.request.url:await r.fulfill(path=str(Path(__file__).resolve().parents[4] / 'dist/timber.min.js'),content_type='text/javascript');return
   if urlparse(r.request.url).hostname in ['www.timberstore.sk','cdn.myshoptet.com','cdn.jsdelivr.net','fonts.googleapis.com','fonts.gstatic.com','765909.myshoptet.com','shoptet.webotvurci.cz']:await r.continue_()
   else:await r.abort()
  async def goto(page,path):
   await page.goto('https://www.timberstore.sk'+path,wait_until='domcontentloaded',timeout=60000);await page.wait_for_function('window.Timber?.version==="v0.7.3-rc.0"&&document.body.classList.contains("is-loaded")');await page.wait_for_timeout(400)
  for w in [375,1440]:
   done=False
   for attempt in range(4):
    ctx=await browser.new_context(viewport={'width':w,'height':900});page=await ctx.new_page();errors=[];native=[];page.on('pageerror',lambda e:errors.append(str(e)))
    async def response(r):
     if '/Cart/GetExtendedOrder/' in r.url:
      try:native.append((await r.json()).get('payload',{}).get('content') is False)
      except Exception:pass
    page.on('response',response);await page.route('**/*',route);await goto(page,'/?ts_preview=v0.7.2')
    meta=await page.evaluate('({version:Timber.version,loader:TimberLoader.version,preview:TimberLoader.preview,assets:[...document.querySelectorAll("script[src],link[href]")].map(e=>e.src||e.href).filter(u=>u.includes("/dist/timber.min."))})');assert meta['loader']=='v0.7.2' and meta['preview'] and all('@v0.7.2/' in u for u in meta['assets']) and len(meta['assets'])==2,meta
    if await page.locator('[data-testid=buttonCookiesAccept]').is_visible():
     colors=await page.locator('[data-testid=buttonCookiesAccept]').evaluate('e=>({bg:getComputedStyle(e).backgroundColor,color:getComputedStyle(e).color})');assert colors=={'bg':'rgb(212, 136, 74)','color':'rgb(255, 255, 255)'},colors
     await page.locator('[data-testid=buttonCookiesAccept]').click();await page.wait_for_timeout(600)
    if w==375:
     closed=await page.locator('[data-target=navigation]').first.evaluate("e=>getComputedStyle(e,'::before').color");assert closed=='rgb(212, 136, 74)'
     await page.locator('[data-target=navigation]').first.click();await page.wait_for_timeout(300)
     opened=await page.locator('[data-target=navigation]').first.evaluate("e=>getComputedStyle(e,'::before').color");assert opened=='rgb(255, 255, 255)'
     order=await page.locator('#header .navigation-in-bottom .top-navigation-contacts').evaluate('(e)=>[...e.children].map(e=>e.className)');assert order==['ts-menu-contact-title','ts-service-bar__hours','project-email','project-phone','ts-menu-write-us btn btn-primary','ts-menu-socials'],order
     await page.locator('[data-target=navigation]').first.click()
    for label,path in [('category','/spojovaci-material/'),('brand','/znacka/tulip/'),('detail','/franke-drez-ubg-611-86-860x500mm-sedy-kamen/')]:
     await goto(page,path)
     fields=await page.locator('.ts-qty__value,.quantity input[name=amount]').evaluate_all("es=>es.filter(e=>e.getBoundingClientRect().width>0).map(e=>e.getBoundingClientRect().width)");assert fields and min(fields)>=64,(label,w,fields)
    button=page.locator('#product-detail-form [data-testid=buttonAddToCart]');await button.scroll_into_view_if_needed();await page.wait_for_timeout(400);await page.evaluate(MONITOR);await button.click()
    try:await page.wait_for_selector('#colorbox .advanced-order',timeout=8000)
    except Exception:
     if native and all(native):empty.append({'width':w,'attempt':attempt+1,'contentFalse':True});await ctx.close();continue
     raise
    await page.wait_for_timeout(700);frames=await page.evaluate('motion');masks=[f['spinner'] for f in frames if f['spinner'] and f['spinner']['visibility']=='visible'];assert masks and all(e['marked'] and e['bg']=='rgba(0, 0, 0, 0)' and e['loader']=='hidden' for e in masks)
    visible=[f for f in frames if f['box'] and f['box']['display']!='none' and f['box']['opacity']>0];assert visible and all(f['ready'] for f in visible)
    active=[f for f in frames if f['spinner'] or f['ready']]
    bg={k:max(f['background'][k] for f in active)-min(f['background'][k] for f in active) for k in ['x','y','w','h']};assert max(bg.values())<=1,bg
    await page.locator('#colorbox').screenshot(path=str(work/f'popup-v072-{w}.png'))
    await page.locator('[data-testid=buttonPopupBack]').click();await page.locator('#colorbox').wait_for(state='hidden')
    await goto(page,'/kosik/');field=page.locator('#cart-wrapper tr.removeable .quantity input').first;assert await field.input_value()=='1'
    await page.locator('#cart-wrapper tr.removeable .quantity .increase').first.click();await page.wait_for_timeout(1300);assert await field.input_value()=='2'
    await page.locator('a[href*="krok-1"]:visible,#continue-order-button:visible,[data-testid=buttonNextStep]:visible').first.click();await page.wait_for_selector('#order-shipping-methods')
    await page.locator('input[name=shippingId]:enabled').first.check(force=True);await page.wait_for_timeout(650);await page.locator('input[name=billingId]:enabled').first.check(force=True);await page.wait_for_timeout(650)
    await page.locator('#continue-order-button:visible,.next-step-forward:visible,[data-testid=buttonNextStep]:visible').first.click()
    await page.wait_for_selector('#billFullName, input[name=billFullName]',timeout=20000)
    assert not errors,errors
    results.append({'width':w,'meta':meta,'homeCategoryBrandDetail':True,'cookiesAndMobileMenu':True,'nativeAddAndCartIncrease':True,'shippingPaymentToPersonalDetails':True,'personalDetailsUrl':page.url,'backgroundVariation':bg,'whiteFrames':0,'blankPopupFrames':0,'errors':errors,'pass':True});(work/'purchase-smoke.json').write_text(json.dumps({'checks':results,'nativeEmptyAttempts':empty},indent=2));print('PASS locally routed candidate + native purchase through personal details',w,flush=True);done=True;await ctx.close();break
   assert done,(w,empty)
  await browser.close()
 (work/'purchase-smoke.json').write_text(json.dumps({'checks':results,'nativeEmptyAttempts':empty,'mode':'Locally routed candidate'},indent=2))
asyncio.run(main())
