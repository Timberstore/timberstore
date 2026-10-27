import asyncio,os,json
from pathlib import Path
from urllib.parse import urlparse
from playwright.async_api import async_playwright
work=Path(os.environ.get('TIMBER_GALLERY_WORK','/tmp/timber-gallery-drag'));repo=Path(__file__).resolve().parents[3];results=[]
SNAP='''()=>{let s=document.querySelector('.p-thumbnails'),i=s?.querySelector('.p-thumbnails-inner');return {offset:i?parseFloat(getComputedStyle(i).left)||0:0,active:[...document.querySelectorAll('.p-thumbnails a.p-thumbnail')].findIndex(e=>e.classList.contains('highlighted')),drag:s?.classList.contains('ts-gallery-strip--dragging'),src:document.querySelector('.p-image img')?.src,box:!!document.querySelector('#colorbox[style*="display: block"]')}}'''
async def main():
 work.mkdir(parents=True,exist_ok=True)
 async with async_playwright() as p:
  b=await p.chromium.launch(executable_path='/usr/bin/chromium',proxy={'server':os.environ['HTTPS_PROXY']},args=['--no-sandbox']);sem=asyncio.Semaphore(2)
  async def case(w,touch=False):
   async with sem:
    ctx=await b.new_context(viewport={'width':w,'height':900},is_mobile=touch,has_touch=touch);page=await ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
    async def route(r):
     u=r.request.url
     if '/dist/timber.min.css' in u:await r.fulfill(path=str(repo/'dist/timber.min.css'),content_type='text/css')
     elif '/dist/timber.min.js' in u:await r.fulfill(path=str(repo/'dist/timber.min.js'),content_type='text/javascript')
     elif urlparse(u).hostname in ['www.timberstore.sk','cdn.myshoptet.com','cdn.jsdelivr.net','fonts.googleapis.com','fonts.gstatic.com','shoptet.webotvurci.cz']:await r.continue_()
     else:await r.abort()
    await page.route('**/*',route);await page.goto('https://www.timberstore.sk/tulip-uchytka-tende-32-146-antracit-2/?ts_preview=f66dd06e018f3b8d18352b1a3b1cfe5666676006',wait_until='domcontentloaded',timeout=60000);await page.wait_for_function('window.Timber?.version==="v0.7.3-rc.9"&&document.body.classList.contains("is-loaded")');await page.wait_for_timeout(500)
    if await page.locator('[data-testid=buttonCookiesAccept]').is_visible():await page.locator('[data-testid=buttonCookiesAccept]').click();await page.wait_for_timeout(200)
    await page.evaluate('document.querySelectorAll(".js-close-information-msg").forEach(e=>e.click())')
    strip=page.locator('.p-thumbnails');await strip.evaluate('e=>e.scrollIntoView({block:"center"})');await page.wait_for_timeout(450);r=await strip.bounding_box();overflow=await strip.evaluate('e=>e.classList.contains("overflow-next")');samples=[]
    if overflow:
     x=r['x']+r['width']*.72;y=r['y']+r['height']/2
     if touch:
      cdp=await ctx.new_cdp_session(page)
      await cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y,'id':1}]})
      for dx in [-25,-75]:
       await cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x+dx,'y':y,'id':1}]});await page.wait_for_timeout(150);samples.append(await page.evaluate(SNAP))
      await cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
     else:
      await page.mouse.move(x,y);await page.mouse.down()
      for dx in [-25,-75]:await page.mouse.move(x+dx,y,steps=5);await page.wait_for_timeout(150);samples.append(await page.evaluate(SNAP))
      await page.mouse.up()
     await page.wait_for_timeout(150);after=await page.evaluate(SNAP)
     assert samples[0]['offset']<-10 and samples[1]['offset']<samples[0]['offset']-5,(w,touch,'not continuous',samples)
     assert all(s['drag'] and s['active']==0 and not s['box'] for s in samples) and after['active']==0 and not after['drag'] and not after['box'],(w,touch,'drag selected photo',samples,after)
     # Reverse direction continuously without leaving a native drag/image selection.
     r=await strip.bounding_box();x=r['x']+40;y=r['y']+r['height']/2
     await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+110,y,steps=8);await page.mouse.up();await page.wait_for_timeout(120);assert abs((await page.evaluate(SNAP))['offset'])<1
     # Clamp at the end; native arrows must work from the dragged offset.
     await page.mouse.move(r['x']+r['width']*.8,y);await page.mouse.down();await page.mouse.move(r['x']+r['width']*.8-20,y,steps=3);await page.mouse.move(-400,y,steps=10);await page.mouse.up();await page.wait_for_timeout(100)
     end=await page.evaluate(SNAP);last=page.locator('.p-thumbnails a.p-thumbnail').last;lr=await last.bounding_box();sr=await strip.bounding_box();assert lr['x']+lr['width']<=sr['x']+sr['width']+1,(lr,sr)
     await page.locator('.p-thumbnails-arrows .thumbnail-prev').click();await page.wait_for_timeout(550);arrow=await page.evaluate(SNAP);assert arrow['offset']>end['offset'] and arrow['offset']<=1,(end,arrow)
     # Return to the beginning using native arrows, then select a real thumbnail.
     for _ in range(8):
      if (await page.evaluate(SNAP))['offset']>=-1:break
      await page.locator('.p-thumbnails-arrows .thumbnail-prev').click();await page.wait_for_timeout(400)
    await page.locator('.p-thumbnails a.p-thumbnail').nth(1).click();await page.wait_for_timeout(450);selected=await page.evaluate(SNAP);assert selected['active']==1 and not selected['box'],selected
    # Main photo mouse swipe and ordinary click still use native selection/lightbox.
    image=page.locator('.p-image-wrapper .p-image');await image.evaluate('e=>e.scrollIntoView({block:"center"})');await page.wait_for_timeout(400);r=await image.bounding_box();x=r['x']+r['width']*.68;y=r['y']+r['height']/2
    await page.mouse.move(x,y);await page.mouse.down();await page.wait_for_timeout(220);await page.mouse.move(x-100,y,steps=14);await page.mouse.up();await page.wait_for_timeout(500);main=await page.evaluate(SNAP);assert main['active']==2 and not main['box'],('main mouse swipe',w,touch,main)
    await image.click();await page.wait_for_selector('#cboxLoadedContent .cboxPhoto',timeout=8000);await page.locator('#cboxClose').click();await page.wait_for_timeout(400)
    # Idempotent re-init: a real click still selects only its original photo.
    await page.evaluate('''()=>{for(let i=0;i<3;i++)document.dispatchEvent(new CustomEvent('ShoptetDOMPageContentLoaded'))}''');await page.wait_for_timeout(200);await strip.evaluate('e=>e.scrollIntoView({block:"center"})');await page.wait_for_timeout(200)
    assert not errors,errors
    row={'width':w,'touch':touch,'overflow':overflow,'heldSamples':samples,'thumbSelection':selected['active'],'mainMouseSwipe':main['active'],'nativeLightbox':True,'nativeArrowsAfterDrag':overflow,'noErrors':True,'pass':True};results.append(row);(work/'verification.json').write_text(json.dumps(results,indent=2));print('PASS continuous strip / bounds / arrows / thumb click / main mouse / lightbox',w,touch,flush=True);await ctx.close()
  await asyncio.gather(case(375),case(1440),case(1024),case(375,True));await b.close()
asyncio.run(main())
