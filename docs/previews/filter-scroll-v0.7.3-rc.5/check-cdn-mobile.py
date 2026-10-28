import asyncio,os,json
from pathlib import Path
from urllib.parse import urlparse
from playwright.async_api import async_playwright
work=Path(os.environ.get('TIMBER_SCROLL_WORK','/tmp/timber-filter-scroll'));repo=Path(__file__).resolve().parents[3];results=[]
async def main():
 work.mkdir(parents=True,exist_ok=True)
 async with async_playwright() as p:
  b=await p.chromium.launch(executable_path='/usr/bin/chromium',proxy={'server':os.environ['HTTPS_PROXY']},args=['--no-sandbox'])
  for w,path in [(375,'/spony--klince/'),(430,'/nabytkove-kovania/')]:
   ctx=await b.new_context(viewport={'width':w,'height':900},is_mobile=True,has_touch=True);page=await ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)));cdp=await ctx.new_cdp_session(page)
   async def route(r):
    u=r.request.url
    if urlparse(u).hostname in ['www.timberstore.sk','cdn.myshoptet.com','cdn.jsdelivr.net','fonts.googleapis.com','fonts.gstatic.com','shoptet.webotvurci.cz']:await r.continue_()
    else:await r.abort()
   await page.route('**/*',route);await page.goto('https://www.timberstore.sk'+path+'?ts_preview=0b52102db4ef13610a0255476ccf538891f88af0',wait_until='domcontentloaded',timeout=60000);await page.wait_for_function('window.Timber?.version==="v0.7.3-rc.5"&&document.body.classList.contains("is-loaded")');await page.wait_for_timeout(500)
   if await page.locator('[data-testid=buttonCookiesAccept]').is_visible():await page.locator('[data-testid=buttonCookiesAccept]').click();await page.wait_for_timeout(200)
   await page.evaluate('document.querySelectorAll(".js-close-information-msg").forEach(e=>e.click())')
   assert await page.evaluate('TimberLoader.version')=='0b52102db4ef13610a0255476ccf538891f88af0'
   filters=page.locator('[data-ts-panel=filters]');sorting=page.locator('[data-ts-panel=sorting]');root=page.locator('.ts-mobile-category');fp=page.locator('#ts-mobile-category-filters');sp=page.locator('#ts-mobile-category-sorting');groups=page.locator('#filters .ts-mobile-category__row');panels={'filters':fp,'sorting':sp}
   async def open_(button):
    if await button.get_attribute('aria-expanded')=='true':await button.tap();await page.wait_for_timeout(80)
    await button.evaluate('e=>{let r=e.closest(".ts-mobile-category").getBoundingClientRect();window.scrollTo(0,scrollY+r.top-180)}');await page.wait_for_timeout(220);await button.tap();await page.wait_for_timeout(180);assert await button.get_attribute('aria-expanded')=='true'
   async def swipe(x,y,dy):
    await cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y,'id':1}]})
    for i in range(1,7):
     await cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x,'y':y+dy*i/6,'id':1}]});await page.wait_for_timeout(25)
    await cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});await page.wait_for_timeout(400)
   async def snap(panel):
    return await panel.evaluate('e=>({scrollY:window.scrollY,y:e.getBoundingClientRect().y,h:e.getBoundingClientRect().height})')
   geometry=[]
   for i in range(await groups.count()):
    await open_(filters);h=groups.nth(i).locator('h4');await h.tap();await page.wait_for_timeout(120)
    g=await h.evaluate('e=>{let r=e.getBoundingClientRect(),p=e.closest(".ts-mobile-category__panel").getBoundingClientRect();return {x:r.x,right:r.right,px:p.x,pr:p.right,active:e.parentElement.classList.contains("is-active")}}');assert g['active'] and abs(g['x']-g['px'])<=2 and abs(g['right']-g['pr'])<=2,g;geometry.append(g)
   gestures=[]
   for kind,button in [('filters',filters),('sorting',sorting)]:
    await open_(button)
    if kind=='filters':await groups.filter(has_text='Podľa dostupnosti').first.locator('h4').tap();await page.wait_for_timeout(120)
    host=panels[kind]
    for dy in [-100,100]:
     before=await snap(host);r=await host.bounding_box();low=max(165,r['y']+35);high=min(780,r['y']+r['height']-25);y=(low+high)/2
     await swipe(r['x']+r['width']*.55,y,dy);after=await snap(host);assert await button.get_attribute('aria-expanded')=='true',(kind,dy,'closed inside')
     delta=after['scrollY']-before['scrollY'];move=after['y']-before['y'];assert delta*(-1 if dy>0 else 1)>35 and move*(1 if dy>0 else -1)>35,(kind,dy,before,after)
     await page.wait_for_timeout(500);assert await button.get_attribute('aria-expanded')=='true',(kind,'momentum closed')
     gestures.append({'panel':kind,'fingerDy':dy,'before':before,'after':after,'keptOpen':True})
    await swipe(6,650,-100);assert await button.get_attribute('aria-expanded')=='false',(kind,'outside did not close')
   # A long expanded group is page content; no inner scroll container traps it.
   await open_(filters);brand=groups.filter(has_text='Značky').first;await brand.locator('h4').tap();await page.wait_for_timeout(100)
   more=brand.locator('.ts-mobile-category__more')
   if await more.count():await more.tap();await page.wait_for_timeout(100)
   flow=await fp.evaluate('e=>({max:getComputedStyle(e).maxHeight,slot:getComputedStyle(e.parentElement).position,bodyOverflow:getComputedStyle(e.querySelector("#filters")).overflowY,bodyHeight:e.querySelector("#filters").clientHeight,bodyScroll:e.querySelector("#filters").scrollHeight})');assert flow['max']=='none' and flow['slot']=='static' and flow['bodyOverflow']=='visible' and flow['bodyScroll']<=flow['bodyHeight']+2,flow
   # Native checkbox AJAX persists through inside movement and outside dismissal.
   await page.evaluate("()=>{window.filterEvents=0;document.addEventListener('ShoptetDOMPageContentLoaded',()=>window.filterEvents++)}");prev=await page.evaluate('filterEvents');await page.locator('#filters input[type=checkbox]:enabled').first.evaluate('e=>e.click()');await page.wait_for_function('(n)=>filterEvents>n',arg=prev);await page.wait_for_timeout(150);assert await page.locator('#filters input:checked').count()>0
   await open_(filters);await swipe(6,650,-80);assert await filters.get_attribute('aria-expanded')=='false';await open_(filters);assert await page.locator('#filters input:checked').count()>0
   prev=await page.evaluate('filterEvents');await page.locator('.ts-mobile-category__footer #clear-filters a').tap();await page.wait_for_function('(n)=>filterEvents>n',arg=prev);await page.wait_for_timeout(150);assert await page.locator('#filters input:checked').count()==0
   await open_(filters);priceGroup=page.locator('#filters .slider-wrapper');await priceGroup.locator('h4').tap();await page.wait_for_timeout(120);handle=page.locator('#filters .ui-slider-handle:visible').first;await handle.scroll_into_view_if_needed();await page.wait_for_timeout(120);box=await handle.bounding_box();rangeBefore=await page.locator('#filters .ui-slider-range').first.get_attribute('style');prev=await page.evaluate('filterEvents')
   await page.mouse.move(box['x']+box['width']/2,box['y']+box['height']/2);await page.mouse.down();await page.mouse.move(box['x']+box['width']/2+25,box['y']+box['height']/2,steps=6);await page.mouse.up();await page.wait_for_function('(n)=>filterEvents>n',arg=prev);await page.wait_for_timeout(150);rangeAfter=await page.locator('#filters .ui-slider-range').first.get_attribute('style');assert rangeBefore!=rangeAfter,(rangeBefore,rangeAfter)
   # Close on outside wheel and unowned document scrolling; keep on inside wheel.
   await open_(filters);r=await fp.bounding_box();await page.mouse.move(r['x']+r['width']/2,r['y']+30);before=await page.evaluate('scrollY');await page.mouse.wheel(0,80);await page.wait_for_timeout(220);assert await filters.get_attribute('aria-expanded')=='true';assert await page.evaluate('scrollY')>before
   await page.mouse.move(5,650);await page.mouse.wheel(0,80);await page.wait_for_timeout(180);assert await filters.get_attribute('aria-expanded')=='false'
   await open_(sorting);await page.evaluate('window.scrollBy(0,70)');await page.wait_for_timeout(150);assert await sorting.get_attribute('aria-expanded')=='false'
   await open_(sorting);await page.locator('#ts-mobile-category-sorting [data-sort=price]').first.tap();await page.wait_for_function('document.querySelector(".listSorting__control--current")?.getAttribute("data-sort")==="price"');await page.wait_for_timeout(250);assert await page.locator('[data-ts-panel=sorting]').get_attribute('aria-expanded')=='false'
   await open_(filters);await page.keyboard.press('Escape');assert await filters.get_attribute('aria-expanded')=='false'
   assert await page.locator('.ts-mobile-category').count()==1 and not errors,errors
   await page.set_viewport_size({'width':1024,'height':900});await page.wait_for_timeout(400);assert await page.locator('.ts-mobile-category').count()==0;await page.set_viewport_size({'width':w,'height':900});await page.wait_for_timeout(400);assert await page.locator('.ts-mobile-category').count()==1
   row={'width':w,'path':path,'headings':geometry,'insidePageGestures':gestures,'outsideTouchClosesBoth':True,'insideMomentumPreserved':True,'normalDocumentFlow':flow,'nativeCheckboxPersistenceAndReset':True,'insideWheelScrollsPageWithoutClosing':True,'outsideWheelCloses':True,'unownedPageScrollCloses':True,'nativeSortAndEscape':True,'nativePriceSliderAjax':True,'rangeBefore':rangeBefore,'rangeAfter':rangeAfter,'responsiveRoundTrip':True,'errors':errors,'pass':True};results.append(row);(work/'cdn-mobile.json').write_text(json.dumps(results,indent=2));print('PASS shared page scroll, inside/outside touch+wheel, filter AJAX and sort',w,path,flush=True)
   await open_(filters);await groups.filter(has_text='Podľa dostupnosti').first.locator('h4').tap();await page.wait_for_timeout(130);await root.screenshot(path=str(work/f'cdn-filter-flow-{w}.png'));await ctx.close()
  await b.close()
asyncio.run(main())
