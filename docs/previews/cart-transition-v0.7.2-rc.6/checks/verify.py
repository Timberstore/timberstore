import asyncio,json,os,sys
from pathlib import Path
from urllib.parse import urlparse
from playwright.async_api import async_playwright
base=Path(os.environ.get('TIMBER_TRANSITION_WORK', '/tmp/timberstore-transition-rc6'));repo=Path(__file__).resolve().parents[4];results=json.loads((base/'verification.json').read_text()) if (base/'verification.json').exists() else [];emptyAttempts=json.loads((base/'native-empty-attempts.json').read_text()) if (base/'native-empty-attempts.json').exists() else []
class NativeEmpty(Exception):pass
PATHS={'category':'/spojovaci-material/','home':'/','detail':'/franke-drez-ubg-611-86-860x500mm-sedy-kamen/'}
MONITOR='''()=>{window.motion=[];let start=performance.now();function snap(sel){let e=document.querySelector(sel);if(!e)return null;let s=getComputedStyle(e),r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,display:s.display,visibility:s.visibility,opacity:+s.opacity,bg:s.backgroundColor,marked:e.classList.contains('ts-cart-add-spinner'),loader:e.firstElementChild&&getComputedStyle(e.firstElementChild).visibility}}function frame(){motion.push({t:performance.now()-start,spinner:snap('.overlay.spinner'),box:snap('#colorbox'),overlay:snap('#cboxOverlay'),ready:!!document.querySelector('#colorbox .advanced-order'),background:snap('#content'),sections:[...document.querySelectorAll('#colorbox .advanced-order>*')].map(e=>({class:e.className,h:e.getBoundingClientRect().height})),fonts:document.documentElement.className,emptyButtons:document.querySelectorAll('#content .product .product-btn:empty').length});if(performance.now()-start<14000)requestAnimationFrame(frame)}frame()}'''
base.mkdir(parents=True,exist_ok=True)
async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(executable_path=os.environ.get('TIMBER_CHROMIUM','/usr/bin/chromium'),proxy={'server':os.environ['HTTPS_PROXY']},args=['--no-sandbox'])
  sem=asyncio.Semaphore(2)
  async def case(width,name,slow=False,reduced=False):
   async with sem:
    ctx=await browser.new_context(viewport={'width':width,'height':900},reduced_motion='reduce' if reduced else 'no-preference');page=await ctx.new_page();errors=[];posts=[];native=[]
    page.on('pageerror',lambda e:errors.append(str(e)));page.on('request',lambda r:posts.append(r.url) if r.method=='POST' and '/Cart/addCartItem/' in r.url else None)
    async def response(r):
     if '/Cart/GetExtendedOrder/' in r.url:
      try:native.append((await r.json()).get('payload',{}).get('content') is False)
      except Exception:pass
    page.on('response',response)
    async def route(r):
     u=r.request.url
     if '/dist/timber.min.css' in u:await r.fulfill(path=str(repo/'dist/timber.min.css'),content_type='text/css')
     elif '/dist/timber.min.js' in u:await r.fulfill(path=str(repo/'dist/timber.min.js'),content_type='text/javascript')
     elif urlparse(u).hostname in ['www.timberstore.sk','cdn.myshoptet.com','cdn.jsdelivr.net','fonts.googleapis.com','fonts.gstatic.com','765909.myshoptet.com','shoptet.webotvurci.cz']:
      if slow and ('/Cart/addCartItem/' in u or '/Cart/GetExtendedOrder/' in u):
       response=await r.fetch();await asyncio.sleep(.6 if '/addCartItem/' in u else 1.4);await r.fulfill(response=response);return
      await r.continue_()
     else:await r.abort()
    await page.route('**/*',route)
    await page.goto('https://www.timberstore.sk'+PATHS[name]+'?ts_preview=46388947cff61b950c5674cd304f720b89853b75',wait_until='load',timeout=60000)
    await page.wait_for_function('Timber.version==="v0.7.2-rc.6"&&document.body.classList.contains("is-loaded")')
    if await page.locator('[data-testid=buttonCookiesAccept]').is_visible():await page.locator('[data-testid=buttonCookiesAccept]').click()
    await page.wait_for_timeout(700)
    speed=await page.evaluate('jQuery.colorbox.settings.speed')
    button=page.locator('#product-detail-form [data-testid=buttonAddToCart]' if name=='detail' else '.product [data-testid=buttonAddToCart]').first
    await button.scroll_into_view_if_needed();await page.wait_for_timeout(200);await page.evaluate(MONITOR)
    await button.click()
    try:await page.wait_for_selector('#colorbox .advanced-order',timeout=8000)
    except Exception:
     if native and all(native):
      emptyAttempts.append({'width':width,'page':name,'slow':slow,'reduced':reduced,'contentFalse':True});(base/'native-empty-attempts.json').write_text(json.dumps(emptyAttempts,indent=2));await ctx.close();raise NativeEmpty()
     raise
    await page.wait_for_timeout(700)
    frames=await page.evaluate('motion');(base/f'frames-{width}-{name}-{slow}-{reduced}.json').write_text(json.dumps(frames,indent=2));visible=[f for f in frames if f['box'] and f['box']['display']!='none' and f['box']['opacity']>0]
    spinner=[f for f in frames if f['spinner'] and f['spinner']['visibility']=='visible' and f['spinner']['display']!='none']
    assert spinner and all(f['spinner']['marked'] and f['spinner']['bg']=='rgba(0, 0, 0, 0)' and f['spinner']['loader']=='hidden' for f in spinner),(width,name,'white loading frame')
    assert visible and all(f['ready'] for f in visible),(width,name,'blank popup frame')
    active=[f for f in frames if f['spinner'] or f['ready']]
    backgroundVariation={key:max(f['background'][key] for f in active)-min(f['background'][key] for f in active) for key in ['x','y','w','h']}
    assert max(backgroundVariation.values())<=1,(width,name,'background shifted',backgroundVariation)
    for key in ['x','y','w','h']:
     assert max(f['box'][key] for f in visible)-min(f['box'][key] for f in visible)<=1,(width,name,'popup geometry',key)
    alpha=[f['box']['opacity'] for f in visible];assert alpha[-1]==1 and all(b+.015>=a for a,b in zip(alpha,alpha[1:])),(width,name,alpha)
    if reduced:assert all(a==1 for a in alpha),('reduced motion',alpha)
    assert await page.evaluate('jQuery.colorbox.settings.speed')==speed
    assert len(posts)==1 and not errors,(posts,errors)
    if name=='detail' and width in [375,1440] and not slow and not reduced:
     await page.locator('#colorbox').screenshot(path=str(base/f'popup-{width}.png'))
     await page.locator('#colorbox .product :is(.ts-qty__value,.quantity input[name=amount])').first.fill('2')
     await page.locator('#colorbox .product .btn-cart').first.click();await page.wait_for_timeout(1000)
     assert len(posts)==2,(width,'duplicate recommendation add',posts)
    await page.locator('[data-testid=buttonPopupBack]').click();await page.locator('#colorbox').wait_for(state='hidden')
    if name=='detail':
     await page.locator('.p-image-wrapper .p-image').click();await page.wait_for_selector('#cboxLoadedContent img')
     assert await page.locator('#colorbox').evaluate("e=>getComputedStyle(e).animationName")=='none'
     await page.locator('#cboxClose').click()
    # An unrelated later native mask must retain its normal white loading state.
    future=await page.evaluate('''()=>{showSpinner();let e=document.querySelector('.overlay.spinner'),s=getComputedStyle(e),r={marked:e.classList.contains('ts-cart-add-spinner'),bg:s.backgroundColor,loader:getComputedStyle(e.firstElementChild).visibility};hideSpinner();return r}''')
    assert not future['marked'] and future['bg']!='rgba(0, 0, 0, 0)' and future['loader']=='visible',future
    row={'width':width,'page':name,'slowPost600msGet1400ms':slow,'reduced':reduced,'frames':len(frames),'backgroundVariation':backgroundVariation,'whiteLoadingFrames':0,'blankPopupFrames':0,'opacitySamples':sorted(set(alpha)),'posts':len(posts),'futureSpinner':future,'nativeEmptyResponses':native,'errors':errors,'pass':True}
    results[:]=[r for r in results if (r['width'],r['page'],r['slowPost600msGet1400ms'],r['reduced'])!=(width,name,slow,reduced)]
    results.append(row);(base/'verification.json').write_text(json.dumps(results,indent=2));print('PASS full transition + future spinner',width,name,'slow',slow,'reduce',reduced,flush=True);await ctx.close()
  async def retry(*args,**kwargs):
   for attempt in range(5):
    try:return await case(*args,**kwargs)
    except NativeEmpty:print('Native empty content, fresh context retry',args,attempt+1,flush=True)
   raise NativeEmpty(args)
  if sys.argv[1:]:tasks=[retry(int(arg),'detail') for arg in sys.argv[1:]]
  else:tasks=[retry(w,'detail') for w in [320,375,768,1440,1920]]+[retry(w,n) for w in [375,1440] for n in ['home','category']]+[retry(w,'detail',slow=True) for w in [375,1440]]+[retry(w,'detail',reduced=True) for w in [375,1440]]
  await asyncio.gather(*tasks)
  await browser.close()
asyncio.run(main())
