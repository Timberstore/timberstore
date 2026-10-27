import asyncio,json,os,sys
from pathlib import Path
from urllib.parse import urlparse
from playwright.async_api import async_playwright
REPO=Path(__file__).resolve().parents[4]
base=Path(os.environ.get('TIMBER_LOADING_WORK', '/tmp/timberstore-loading-check'))
base.mkdir(parents=True, exist_ok=True)
CHROMIUM=os.environ.get('TIMBER_CHROMIUM', '/usr/bin/chromium')
class Results(list):
 def append(self, item):
  super().append(item)
  (base/'functional-results.json').write_text(json.dumps(self,indent=2))
results=Results()
async def route(r):
 u=r.request.url
 if '/dist/timber.min.css' in u:await r.fulfill(path=str(REPO/'dist/timber.min.css'),content_type='text/css')
 elif '/dist/timber.min.js' in u:await r.fulfill(path=str(REPO/'dist/timber.min.js'),content_type='text/javascript')
 elif (urlparse(u).hostname or '') not in ['www.timberstore.sk','cdn.myshoptet.com','fonts.googleapis.com','fonts.gstatic.com','cdn.jsdelivr.net','shoptet.webotvurci.cz','765909.myshoptet.com']:await r.abort()
 else:await r.continue_()
check='''() => {let forms=[...document.querySelectorAll('body:not(.type-detail,.ordering-process) .content-wrapper :is(.products,.products-block) .product form.pr-action, .products-related-block .product form.pr-action, .products-alternative-block .product form.pr-action, #colorbox .advanced-order .product form.pr-action')];return forms.map(f=>{let q=f.querySelector('.ts-qty,.quantity'),b=f.querySelector('[data-testid=buttonAddToCart]'),s=b&&getComputedStyle(b),p=b&&getComputedStyle(b,'::after'),r=b?.getBoundingClientRect();return {priceId:f.querySelector('[name=priceId]')?.value,qty:!!q,duplicates:f.querySelectorAll('.ts-qty').length,amount:f.querySelector('[name=amount]')?.value,visibleAmount:q?.querySelector('input')?.value,w:r?.width,h:r?.height,font:s?.fontSize,transition:s?.transitionProperty,mask:p?.maskImage,overflow:q&&q.getBoundingClientRect().width>f.getBoundingClientRect().width+1}})}'''
async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(executable_path=CHROMIUM,proxy=({'server':os.environ['HTTPS_PROXY']} if os.environ.get('HTTPS_PROXY') else None),args=['--no-sandbox'])
  for width in ([int(x) for x in sys.argv[1:]] or [375,768,1440]):
   ctx=await browser.new_context(viewport={'width':width,'height':1000});page=await ctx.new_page();errors=[]
   page.on('pageerror',lambda e:errors.append(str(e)))
   await page.route('**/*',route)
   for name,path in [('category','/nabytkove-kovania/'),('search','/vyhladavanie/?string=skrutka'),('brand','/znacka/tulip/'),('home','/')]:
    await page.goto('https://www.timberstore.sk'+path,wait_until='domcontentloaded',timeout=60000)
    await page.wait_for_function('window.Timber && document.body.classList.contains("is-loaded")')
    await page.wait_for_timeout(400)
    data=await page.evaluate(check)
    assert data and all(x['qty'] and x['duplicates']<=1 and not x['overflow'] for x in data),(name,width,data)
    assert all('url(' in (x['mask'] or '') for x in data),(name,width,'cart glyph')
    results.append({'page':name,'width':width,'cards':len(data),'errors':errors.copy(),'controls':data[:3]})
    print('PASS',name,width,len(data),'cards',flush=True)
    if name=='category':
     # An enhanced carousel/AJAX clone must receive working listeners, not a copied data flag.
     clone=await page.evaluate('''async()=>{let c=document.querySelector('#products > .product').cloneNode(true);c.id='loading-test-clone';let f=c.querySelector('form.pr-action'),a=f.querySelector('[name=amount]');a.value='10';a.setAttribute('value','10');a.min='10';a.max='50';a.step='10';document.querySelector('#products').append(c);await new Promise(requestAnimationFrame);let field=f.querySelector('.ts-qty__value');if(!field)throw Error('missing picker on clone');let initial=field.value;f.querySelector('.ts-qty__btn--plus').click();let plus=a.value;field.value='21';field.dispatchEvent(new Event('change',{bubbles:true}));let rounded=a.value;f.querySelector('.ts-qty__btn--minus').click();let minus=a.value;let submitted=[...new FormData(f).getAll('amount')];let count=f.querySelectorAll('.ts-qty').length;c.remove();return {initial,plus,rounded,minus,submitted,count}}''')
     assert clone=={'initial':'10','plus':'20','rounded':'30','minus':'20','submitted':['20'],'count':1},clone
     results.append({'test':'cloned card / pack step / rounding / one native amount','width':width,'result':clone})
     # Observe the first frame of actual replacement cards after native sorting.
     await page.evaluate('''() => {window.newCardFrames=[];let frame=()=>{let fs=[...document.querySelectorAll('#products .product form.pr-action')];if(fs.length)window.newCardFrames.push({t:performance.now(),missing:fs.filter(f=>!f.querySelector('.ts-qty,.quantity')).length});if(window.monitorCards)requestAnimationFrame(frame)};window.monitorCards=true;frame()}''')
     if width>=768:
      await page.locator('.listSorting__control[data-sort="price"]').click()
     else:
      await page.locator('.ts-mobile-category__button[data-ts-panel="sorting"]').click()
      await page.locator('.listSorting__control[data-sort="price"]').click()
     await page.wait_for_timeout(2200)
     ajax=await page.evaluate('() => {window.monitorCards=false;return {frames:window.newCardFrames,controls:[...document.querySelectorAll("#products .ts-qty")].length}}')
     assert ajax['controls']>0 and all(x['missing']==0 for x in ajax['frames']),ajax
     results.append({'test':'native AJAX sorting first-frame quantities','width':width,'frames':len(ajax['frames']),'controls':ajax['controls']})
   # Native detail -> add-to-cart popup -> mini cart -> full cart -> checkout, no order submitted.
   await page.goto('https://www.timberstore.sk/pruzina-k-zdvihaku-kp03-3-00x22-5x142x36-silnejsia/',wait_until='domcontentloaded',timeout=60000)
   await page.wait_for_selector('[data-ts-compact="ready"]')
   await page.locator('#product-detail-form .add-to-cart [data-testid="buttonAddToCart"]').click()
   await page.wait_for_selector('#colorbox .advanced-order',timeout=20000)
   await page.wait_for_timeout(600)
   popup=await page.evaluate(check);assert all(x['qty'] and x['duplicates']<=1 for x in popup),popup
   results.append({'test':'native add-to-cart popup recommendations','width':width,'cards':len(popup)})
   await page.goto('https://www.timberstore.sk/kosik/',wait_until='domcontentloaded',timeout=60000)
   await page.wait_for_selector('#cart-wrapper .cart-table tr.removeable')
   await page.wait_for_timeout(700)
   amount=page.locator('#cart-wrapper .cart-table tr.removeable .quantity input[name="amount"]').first
   initial=await amount.input_value()
   await page.locator('#cart-wrapper .cart-table tr.removeable .quantity .increase').first.click()
   await page.wait_for_timeout(1500)
   updated=await page.locator('#cart-wrapper .cart-table tr.removeable .quantity input[name="amount"]').first.input_value()
   assert float(updated)>float(initial),(initial,updated)
   results.append({'test':'native cart quantity update','width':width,'before':initial,'after':updated})
   # Enter the first checkout step using its native link.
   link=page.locator('a.next-step').first
   if await link.count():
    await link.click();await page.wait_for_timeout(1700)
    results.append({'test':'checkout entry','width':width,'url':page.url,'body':await page.locator('body').get_attribute('class')})
   assert not errors,errors
   await ctx.close()
  await browser.close()
 (base/'functional-results.json').write_text(json.dumps(results,indent=2))
if __name__ == "__main__": asyncio.run(main())
