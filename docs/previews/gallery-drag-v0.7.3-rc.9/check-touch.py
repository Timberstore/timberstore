import asyncio,os,json
from pathlib import Path
from urllib.parse import urlparse
from playwright.async_api import async_playwright
work=Path(os.environ.get('TIMBER_GALLERY_WORK','/tmp/timber-gallery-drag'));repo=Path(__file__).resolve().parents[3];results=[]
async def main():
 work.mkdir(parents=True,exist_ok=True)
 async with async_playwright() as p:
  b=await p.chromium.launch(executable_path='/usr/bin/chromium',proxy={'server':os.environ['HTTPS_PROXY']},args=['--no-sandbox']);ctx=await b.new_context(viewport={'width':375,'height':900},is_mobile=True,has_touch=True);page=await ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)));cdp=await ctx.new_cdp_session(page)
  async def route(r):
   u=r.request.url
   if '/dist/timber.min.css' in u:await r.fulfill(path=str(repo/'dist/timber.min.css'),content_type='text/css')
   elif '/dist/timber.min.js' in u:await r.fulfill(path=str(repo/'dist/timber.min.js'),content_type='text/javascript')
   elif urlparse(u).hostname in ['www.timberstore.sk','cdn.myshoptet.com','cdn.jsdelivr.net','fonts.googleapis.com','fonts.gstatic.com','shoptet.webotvurci.cz']:await r.continue_()
   else:await r.abort()
  await page.route('**/*',route)
  async def goto(path):
   await page.goto('https://www.timberstore.sk'+path+'?ts_preview=f66dd06e018f3b8d18352b1a3b1cfe5666676006',wait_until='domcontentloaded',timeout=60000);await page.wait_for_function('window.Timber?.version==="v0.7.3-rc.9"&&document.body.classList.contains("is-loaded")');await page.wait_for_timeout(450)
   if await page.locator('[data-testid=buttonCookiesAccept]').is_visible():await page.locator('[data-testid=buttonCookiesAccept]').click();await page.wait_for_timeout(200)
   await page.evaluate('document.querySelectorAll(".js-close-information-msg").forEach(e=>e.click())')
  async def swipe(target,dx,dy,cancel=False):
   await target.evaluate('e=>e.scrollIntoView({block:"center"})');await page.wait_for_timeout(400);r=await target.bounding_box();x=r['x']+r['width']*.6;y=r['y']+r['height']/2
   await cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y,'id':1}]})
   for i in range(1,7):await cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x+dx*i/6,'y':y+dy*i/6,'id':1}]});await page.wait_for_timeout(25)
   await cdp.send('Input.dispatchTouchEvent',{'type':'touchCancel' if cancel else 'touchEnd','touchPoints':[]});await page.wait_for_timeout(500)
  active='''()=>[...document.querySelectorAll('.p-thumbnails .p-thumbnail')].findIndex(e=>e.classList.contains('highlighted'))'''
  await goto('/tulip-uchytka-tende-32-146-antracit-2/')
  strip=page.locator('.p-thumbnails');image=page.locator('.p-image-wrapper .p-image')
  await strip.evaluate('e=>e.scrollIntoView({block:"center"})');await page.wait_for_timeout(400);before=await page.evaluate('scrollY');await swipe(strip,0,-100);after=await page.evaluate('scrollY');assert after>before+30 and await page.evaluate(active)==0 and not await strip.evaluate('e=>e.classList.contains("ts-gallery-strip--dragging")'),(before,after)
  results.append({'verticalTouchOverStripScrollsPage':True,'beforeY':before,'afterY':after})
  await swipe(strip,-70,0,True);assert not await strip.evaluate('e=>e.classList.contains("ts-gallery-strip--dragging")') and await page.evaluate(active)==0
  # Real tap after touch cancellation must remain native and unsuppressed.
  await page.mouse.move(100,100);await page.locator('.p-thumbnails-arrows .thumbnail-prev').click();await page.wait_for_timeout(450);await page.locator('.p-thumbnails .p-thumbnail').nth(1).tap();await page.wait_for_timeout(400);assert await page.evaluate(active)==1
  results.append({'realTouchCancelCleansUp':True,'tapAfterCancelSelects':1})
  await swipe(image,-90,0);assert await page.evaluate(active)==2 and not await page.locator('#colorbox').is_visible()
  await page.locator('.p-thumbnails .p-thumbnail').first.evaluate('e=>e.click()');await page.wait_for_timeout(350);await swipe(image,90,0);assert await page.evaluate(active)==0
  await page.locator('.p-thumbnails .p-thumbnail').last.evaluate('e=>e.click()');await page.wait_for_timeout(350);last=await page.evaluate(active);await swipe(image,-90,0);assert await page.evaluate(active)==last
  results.append({'mainTouchSwipe':True,'firstLastLimits':True})
  # Native variant navigation gets the same handler on the new gallery.
  links=page.locator('a.friend:not(.active)[href], .friend:not(.active) a[href]')
  href=await links.first.get_attribute('href') if await links.count() else None
  if href:
   await goto(href);assert await page.locator('.p-thumbnails.ts-gallery-strip').count()==1;await swipe(page.locator('.p-thumbnails'),-60,0);assert await page.evaluate(active)==0;results.append({'nativeVariantGallery':page.url,'dragAfterVariant':True})
  if not href:results.append({'nativeVariantCards':'not present on this current live Tende detail','variantSwitch':'NOT TESTED'})
  await goto('/bosch-2607001561-skrutkovaci-hrot-extra-hart-pz-2--25-mm/')
  image=page.locator('.p-image-wrapper .p-image');count=await page.locator('.p-thumbnails .p-thumbnail').count();assert count<=1,count
  await swipe(image,-90,0);assert not await page.locator('#colorbox').is_visible();await image.tap();await page.wait_for_selector('#cboxLoadedContent .cboxPhoto');await page.locator('#cboxClose').click();results.append({'singlePhotoCount':count,'singleDragSafeAndTapOpens':True})
  assert not errors,errors;(work/'touch-regression.json').write_text(json.dumps({'checks':results,'errors':errors,'pass':True},indent=2));print('PASS vertical scroll / cancel / main touch / limits / variant / single-photo',flush=True);await ctx.close();await b.close()
asyncio.run(main())
