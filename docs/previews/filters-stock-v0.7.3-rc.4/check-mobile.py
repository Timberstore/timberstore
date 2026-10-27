import asyncio,os,json
from pathlib import Path
from urllib.parse import urlparse
from playwright.async_api import async_playwright
work=Path(os.environ.get('TIMBER_FILTERS_WORK','/tmp/timber-filters-stock'));repo=Path(__file__).resolve().parents[3];results=[]
async def main():
 work.mkdir(parents=True,exist_ok=True)
 async with async_playwright() as p:
  b=await p.chromium.launch(executable_path='/usr/bin/chromium',proxy={'server':os.environ['HTTPS_PROXY']},args=['--no-sandbox'])
  for w in [375,430]:
   ctx=await b.new_context(viewport={'width':w,'height':900},is_mobile=True,has_touch=True);page=await ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)));cdp=await ctx.new_cdp_session(page)
   async def route(r):
    u=r.request.url
    if '/dist/timber.min.css' in u:await r.fulfill(path=str(repo/'dist/timber.min.css'),content_type='text/css')
    elif '/dist/timber.min.js' in u:await r.fulfill(path=str(repo/'dist/timber.min.js'),content_type='text/javascript')
    elif urlparse(u).hostname in ['www.timberstore.sk','cdn.myshoptet.com','cdn.jsdelivr.net','fonts.googleapis.com','fonts.gstatic.com','shoptet.webotvurci.cz']:await r.continue_()
    else:await r.abort()
   await page.route('**/*',route);await page.goto('https://www.timberstore.sk/nabytkove-kovania/?ts_preview=v0.7.2',wait_until='domcontentloaded',timeout=60000);await page.wait_for_function('window.Timber?.version==="v0.7.3-rc.4"&&document.body.classList.contains("is-loaded")');await page.wait_for_timeout(500)
   if await page.locator('[data-testid=buttonCookiesAccept]').is_visible():await page.locator('[data-testid=buttonCookiesAccept]').click();await page.wait_for_timeout(250)
   await page.evaluate('document.querySelectorAll(".js-close-information-msg").forEach(e=>e.click())')
   filters=page.locator('[data-ts-panel=filters]');sorting=page.locator('[data-ts-panel=sorting]');root=page.locator('.ts-mobile-category');panel=page.locator('#ts-mobile-category-filters');sortpanel=page.locator('#ts-mobile-category-sorting');groups=page.locator('#filters .ts-mobile-category__row')
   async def open_(button):
    await button.scroll_into_view_if_needed();await page.wait_for_timeout(200)
    if await button.get_attribute('aria-expanded')!='true':await button.tap();await page.wait_for_timeout(160)
    assert await button.get_attribute('aria-expanded')=='true'
   async def swipe(x,y,dy):
    await cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y,'id':1}]})
    for i in range(1,7):
     await cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x,'y':y+dy*i/6,'id':1}]});await page.wait_for_timeout(20)
    await cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});await page.wait_for_timeout(250)
   widths=[]
   for index in range(await groups.count()):
    await open_(filters);heading=groups.nth(index).locator('h4');await heading.tap();await page.wait_for_timeout(180)
    box=await heading.evaluate('e=>{let r=e.getBoundingClientRect(),p=e.closest(".ts-mobile-category__panel").getBoundingClientRect();return {x:r.x,right:r.right,px:p.x,pr:p.right,bg:getComputedStyle(e).backgroundColor,active:e.parentElement.classList.contains("is-active")}}');widths.append(box);assert box['active'] and abs(box['x']-box['px'])<=2 and abs(box['right']-box['pr'])<=2,(w,index,box)
    if index==0:await panel.screenshot(path=str(work/f'full-width-price-{w}.png'))
   await open_(filters);await page.evaluate('window.scrollBy(0,70)');await page.wait_for_timeout(180);assert await filters.get_attribute('aria-expanded')=='false' and not await panel.is_visible()
   await open_(sorting);await page.evaluate('window.scrollBy(0,70)');await page.wait_for_timeout(180);assert await sorting.get_attribute('aria-expanded')=='false' and not await sortpanel.is_visible()
   await open_(filters);y=min(800,(await root.bounding_box())['y']+250);before=await page.evaluate('scrollY');await swipe(8,y,-100);assert await filters.get_attribute('aria-expanded')=='false'
   await open_(sorting);y=min(800,(await root.bounding_box())['y']+250);await swipe(8,y,-100);assert await sorting.get_attribute('aria-expanded')=='false'
   # Genuine internal touch scroll must leave the panel open.
   await open_(filters);brand=groups.filter(has_text='Značky').first;await brand.locator('h4').tap();await page.wait_for_timeout(200)
   more=brand.locator('.ts-mobile-category__more')
   if await more.count():await more.tap();await page.wait_for_timeout(150)
   scroll=page.locator('#filters');r=await scroll.bounding_box();old=await scroll.evaluate('e=>e.scrollTop');await swipe(r['x']+r['width']/2,min(r['y']+r['height']-35,830),-80);new=await scroll.evaluate('e=>e.scrollTop');assert await filters.get_attribute('aria-expanded')=='true',(w,'inside closed');assert new>old,(w,'inside did not scroll',old,new)
   # Native accordion/slider remain present and focus/escape/click-away still work.
   await page.keyboard.press('Escape');assert await filters.get_attribute('aria-expanded')=='false'
   await open_(filters);await page.locator('#filters .slider-wrapper>h4').tap();await page.wait_for_timeout(150);assert await page.locator('#filters .ui-slider-handle:visible').count()==2
   # Real sort selection must close and preserve native sorting.
   await sorting.tap();await page.wait_for_timeout(120);button=page.locator('#ts-mobile-category-sorting [data-sort=price]').first;await button.tap();await page.wait_for_timeout(1500);await page.wait_for_function('document.querySelector(".listSorting__control--current")?.getAttribute("data-sort")==="price"');assert await page.locator('[data-ts-panel=sorting]').get_attribute('aria-expanded')=='false'
   assert await page.locator('.ts-mobile-category').count()==1 and not errors,errors
   row={'width':w,'fullWidthHeadings':widths,'pageScrollClosesFilterAndSort':True,'realOutsideTouchClosesBoth':True,'insideScrollBefore':old,'insideScrollAfter':new,'insideScrollKeepsOpen':True,'escape':True,'nativeSliderHandles':True,'nativeSortPrice':True,'singleRootAfterAjax':True,'errors':errors,'pass':True};results.append(row);(work/'mobile.json').write_text(json.dumps(results,indent=2));print('PASS mobile full-width / page+touch dismiss / internal scroll / native sort',w,flush=True);await ctx.close()
  await b.close()
asyncio.run(main())
