import asyncio,json,os
from pathlib import Path
from urllib.parse import urlparse
from playwright.async_api import async_playwright
base=Path(os.environ.get('TIMBER_TRANSITION_WORK', '/tmp/timberstore-transition-rc6'));repo=Path(__file__).resolve().parents[4];out=[]
base.mkdir(parents=True,exist_ok=True)
async def main():
 async with async_playwright() as p:
  b=await p.chromium.launch(executable_path=os.environ.get('TIMBER_CHROMIUM','/usr/bin/chromium'),proxy={'server':os.environ['HTTPS_PROXY']},args=['--no-sandbox'])
  for w in [375,1440]:
   ctx=await b.new_context(viewport={'width':w,'height':900});page=await ctx.new_page();abortNext=True;posts=[]
   async def route(r):
    nonlocal abortNext
    u=r.request.url
    if '/dist/timber.min.css' in u:await r.fulfill(path=str(repo/'dist/timber.min.css'),content_type='text/css')
    elif '/dist/timber.min.js' in u:await r.fulfill(path=str(repo/'dist/timber.min.js'),content_type='text/javascript')
    elif '/Cart/addCartItem/' in u:
     posts.append(u)
     if abortNext:abortNext=False;await r.abort('failed')
     else:await r.continue_()
    elif urlparse(u).hostname in ['www.timberstore.sk','cdn.myshoptet.com','cdn.jsdelivr.net','fonts.googleapis.com','fonts.gstatic.com','765909.myshoptet.com','shoptet.webotvurci.cz']:await r.continue_()
    else:await r.abort()
   await page.route('**/*',route)
   await page.goto('https://www.timberstore.sk/franke-drez-ubg-611-86-860x500mm-sedy-kamen/?ts_preview=46388947cff61b950c5674cd304f720b89853b75',wait_until='load',timeout=60000)
   if await page.locator('[data-testid=buttonCookiesAccept]').is_visible():await page.locator('[data-testid=buttonCookiesAccept]').click()
   await page.wait_for_timeout(700);speed=await page.evaluate('jQuery.colorbox.settings.speed')
   button=page.locator('#product-detail-form [data-testid=buttonAddToCart]');await button.click();await page.wait_for_timeout(5200)
   assert await page.evaluate('jQuery.colorbox.settings.speed')==speed
   assert await page.locator('.ts-cart-add-spinner').count()==0,('stuck custom presentation',w)
   nativeFailureSpinner=await page.locator('.overlay.spinner:visible').count()
   # Native HTTP-abort handling can leave its own mask. This fixture clears it
   # through the native API before the remaining interaction checks.
   await page.evaluate('hideSpinner()');await page.wait_for_timeout(350)
   # Simulate a variant form rejected by another native validation handler. No
   # product data is submitted; a later unrelated spinner must stay untouched.
   await page.evaluate('''()=>{let f=document.createElement('form');f.className='variant-submit';f.addEventListener('submit',e=>{e.preventDefault();e.stopPropagation()});document.body.append(f);f.requestSubmit();f.remove()}''');await page.wait_for_timeout(50)
   future=await page.evaluate('''()=>{showSpinner();let e=document.querySelector('.overlay.spinner'),s=getComputedStyle(e);let r={marked:e.classList.contains('ts-cart-add-spinner'),bg:s.backgroundColor,loader:getComputedStyle(e.firstElementChild).visibility};hideSpinner();return r}''')
   assert not future['marked'] and future['bg']!='rgba(0, 0, 0, 0)' and future['loader']=='visible',future
   await page.wait_for_timeout(5200);assert await page.evaluate('jQuery.colorbox.settings.speed')==speed
   await page.locator('.p-image-wrapper .p-image').click();await page.wait_for_selector('#cboxLoadedContent img');assert await page.locator('#colorbox').evaluate('e=>getComputedStyle(e).animationName')=='none';await page.locator('#cboxClose').click()
   await button.click();await page.wait_for_function("document.querySelector('.cart-count.full')")
   await page.goto('https://www.timberstore.sk/kosik/',wait_until='load',timeout=60000);await page.wait_for_timeout(700)
   field=page.locator('#cart-wrapper tr.removeable .quantity input').first;assert await field.input_value()=='1'
   await page.evaluate('''()=>{window.cartSpinners=[];new MutationObserver(rs=>{for(let r of rs)for(let e of r.addedNodes)if(e.nodeType===1&&e.matches('.overlay.spinner'))cartSpinners.push({marked:e.classList.contains('ts-cart-add-spinner'),bg:getComputedStyle(e).backgroundColor})}).observe(document.body,{childList:true})}''')
   await page.locator('#cart-wrapper tr.removeable .quantity .increase').first.click();await page.wait_for_timeout(1500);assert await field.input_value()=='2'
   masks=await page.evaluate('cartSpinners');assert masks and all(not e['marked'] and e['bg']!='rgba(0, 0, 0, 0)' for e in masks),masks
   await page.locator('a[href*="krok-1"]:visible, #continue-order-button:visible, [data-testid=buttonNextStep]:visible').first.click();await page.wait_for_selector('#order-shipping-methods');await page.locator('input[name=shippingId]:enabled').first.check(force=True);await page.wait_for_timeout(500);await page.locator('input[name=billingId]:enabled').first.check(force=True)
   assert len(posts)==2,posts
   out.append({'width':w,'customFailureStateRecovered':True,'nativeFailureSpinnerCount':nativeFailureSpinner,'rejectedVariantFixtureNoObserverLeak':True,'galleryNative':True,'futureSpinner':future,'cartMasks':masks,'nativeAddRequests':len(posts),'nativeSuccessfulAdds':1,'cartQuantity':2,'checkoutShippingPayment':True,'pass':True});(base/'regression-results.json').write_text(json.dumps(out,indent=2));print('PASS failure recovery, rejected variant fixture, gallery, native cart/checkout',w,flush=True);await ctx.close()
  await b.close()
asyncio.run(main())
