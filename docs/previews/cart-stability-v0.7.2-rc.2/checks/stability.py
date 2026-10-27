import asyncio,json,os,sys
from pathlib import Path
from urllib.parse import urlparse
from playwright.async_api import async_playwright
base=Path(os.environ.get('TIMBER_CART_WORK', '/tmp/timberstore-cart-rc2'));repo=Path(__file__).resolve().parents[4];results=json.loads((base/'stability-results.json').read_text()) if (base/'stability-results.json').exists() else []
DETAIL='/franke-drez-ubg-611-86-860x500mm-sedy-kamen/'
UNIT='/franke-prislusenstvo-112-0473-656-vrtak-freza-pre-frezovanie-otvorov-v-granite/'
base.mkdir(parents=True, exist_ok=True)
async def main():
 async with async_playwright() as p:
  b=await p.chromium.launch(executable_path=os.environ.get('TIMBER_CHROMIUM', '/usr/bin/chromium'),proxy={'server':os.environ['HTTPS_PROXY']},args=['--no-sandbox'])
  for w,h in ([(int(x),1000) for x in sys.argv[1:]] or [(320,568),(375,1000),(768,1000),(1440,1000)]):
   ctx=await b.new_context(viewport={'width':w,'height':h});page=await ctx.new_page();errors=[];native=[]
   page.on('pageerror',lambda e:errors.append(str(e)))
   async def response(r):
    if '/Cart/GetExtendedOrder/' in r.url:
     try:native.append((await r.json()).get('payload',{}).get('content'))
     except Exception:pass
   page.on('response',response)
   async def route(r):
    u=r.request.url
    if '/dist/timber.min.css' in u:await r.fulfill(path=str(repo/'dist/timber.min.css'),content_type='text/css')
    elif '/dist/timber.min.js' in u:await r.fulfill(path=str(repo/'dist/timber.min.js'),content_type='text/javascript')
    elif urlparse(u).hostname in ['www.timberstore.sk','cdn.myshoptet.com','cdn.jsdelivr.net','fonts.googleapis.com','fonts.gstatic.com','765909.myshoptet.com','shoptet.webotvurci.cz']:
     if UNIT in u and r.request.resource_type=='fetch':await asyncio.sleep(8)
     await r.continue_()
    else:await r.abort()
   await page.route('**/*',route)
   await page.goto('https://www.timberstore.sk'+DETAIL,wait_until='load',timeout=60000)
   await page.wait_for_function('Timber.version==="v0.7.2-rc.2"&&document.body.classList.contains("is-loaded")')
   if await page.locator('[data-testid=buttonCookiesReject]').is_visible():await page.locator('[data-testid=buttonCookiesReject]').click()
   await page.wait_for_timeout(600)
   speed=await page.evaluate('jQuery.colorbox.settings.speed')
   await page.evaluate('''()=>{window.timeline=[];window.modalEvents=[];let start=performance.now();jQuery(document).on('cbox_open cbox_complete cbox_closed',e=>modalEvents.push({t:performance.now()-start,type:e.type}));function frame(){let box=document.querySelector('#colorbox'),pr=box?.querySelector('.price-final>strong'),r=box?.getBoundingClientRect();if(pr&&r.width&&getComputedStyle(box).display!=='none'){let a=pr.getBoundingClientRect(),unit=pr.parentElement.querySelector('.pr-list-unit,.ts-recommendation-unit'),s=getComputedStyle(pr);timeline.push({t:performance.now()-start,x:r.x,y:r.y,w:r.width,h:r.height,px:a.x,py:a.y,pw:a.width,ph:a.height,color:s.color,opacity:s.opacity,unit:unit?.innerText,visible:a.width>0&&s.visibility==='visible'});}if(performance.now()-start<16000)requestAnimationFrame(frame)}frame()}''')
   await page.locator('#product-detail-form [data-testid=buttonAddToCart]').click()
   try:await page.wait_for_selector('#colorbox .advanced-order .product',timeout=15000)
   except Exception:
    (base/f'native-popup-failure-{w}.json').write_text(json.dumps({'width':w,'contentFalse':[x is False for x in native],'errors':errors}))
    raise
   await page.wait_for_timeout(8500)
   rows=await page.evaluate('timeline');events=await page.evaluate('modalEvents')
   assert rows and all(r['visible'] and r['opacity']=='1' for r in rows),(w,'late visibility')
   assert all(r['color']=='rgb(36, 84, 166)' for r in rows),(w,'late price colour')
   variation={k:max(r[k] for r in rows)-min(r[k] for r in rows) for k in ['x','y','w','h','px','py','pw','ph']}
   assert max(variation.values())<=1,(w,variation)
   assert rows[-1]['unit'],(w,'missing verified unit')
   assert await page.evaluate('jQuery.colorbox.settings.speed')==speed,(w,'gallery defaults not restored')
   colors=await page.evaluate('''()=>{let d=document.querySelector('#colorbox .extra.delivery'),head=document.querySelector('#colorbox .advanced-order>.h1');return {icon:getComputedStyle(head,'::before').color,border:getComputedStyle(head).boxShadow,free:getComputedStyle(d.querySelector('strong')).color,truck:getComputedStyle(d,'::before').color}}''')
   assert all(colors[k]=='rgb(0, 200, 83)' for k in ['icon','free','truck']),(w,colors)
   field=page.locator('#colorbox .product :is(.ts-qty__value,.quantity input[name=amount])').first
   await field.fill('10000');assert await field.input_value()=='10000'
   await field.fill('1');await field.dispatch_event('change')
   await page.locator('#colorbox').screenshot(path=str(base/f'popup-{w}.png'))
   await page.locator('[data-testid=buttonPopupBack]').click();await page.locator('#colorbox').wait_for(state='hidden')
   assert await page.evaluate('jQuery.colorbox.settings.speed')==speed
   # A second native add verifies close/reopen without stale dimensions.
   await page.locator('#product-detail-form [data-testid=buttonAddToCart]').click()
   await page.wait_for_selector('#colorbox .advanced-order .product',timeout=15000)
   await page.wait_for_timeout(500)
   again=await page.locator('#colorbox').evaluate('(e)=>({x:e.getBoundingClientRect().x,w:e.getBoundingClientRect().width})')
   assert again['x']>=-1 and again['x']+again['w']<=w+1,(w,again)
   await page.locator('[data-testid=buttonPopupBack]').click();await page.locator('#colorbox').wait_for(state='hidden')
   await page.locator('.p-image-wrapper .p-image').click()
   await page.wait_for_selector('#cboxLoadedContent img')
   gallery=await page.locator('#colorbox').evaluate('(e)=>({position:getComputedStyle(e).position,transform:getComputedStyle(e).transform,hasCart:!!e.querySelector(".advanced-order")})')
   assert not gallery['hasCart'] and gallery['transform']=='none' and await page.evaluate('jQuery.colorbox.settings.speed')==speed,gallery
   await page.locator('#cboxClose').click()
   assert not errors,errors
   results[:]=[row for row in results if row['width']!=w]
   results.append({'width':w,'height':h,'frames':len(rows),'variation':variation,'unitAbsentInitially':not rows[0]['unit'],'events':events,'colors':colors,'defaultsRestored':True,'gallery':gallery,'nativeAdds':len(native),'pass':True})
   (base/'stability-results.json').write_text(json.dumps(results,indent=2));print('PASS stable native popup, delayed unit, green accents, reopen',w,variation,flush=True)
   await ctx.close()
  await b.close()
asyncio.run(main())
