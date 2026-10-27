import asyncio,json,os
from pathlib import Path
from urllib.parse import urlparse
from playwright.async_api import async_playwright
base=Path(os.environ.get('TIMBER_CART_WORK', '/tmp/timberstore-cart-rc2'));repo=Path(__file__).resolve().parents[4];results=[]
base.mkdir(parents=True, exist_ok=True)
async def route(r):
 u=r.request.url
 if '/dist/timber.min.css' in u:await r.fulfill(path=str(repo/'dist/timber.min.css'),content_type='text/css')
 elif '/dist/timber.min.js' in u:await r.fulfill(path=str(repo/'dist/timber.min.js'),content_type='text/javascript')
 elif urlparse(u).hostname in ['www.timberstore.sk','cdn.myshoptet.com','cdn.jsdelivr.net','fonts.googleapis.com','fonts.gstatic.com','765909.myshoptet.com','shoptet.webotvurci.cz']:await r.continue_()
 else:await r.abort()
async def goto(page,path):
 await page.goto('https://www.timberstore.sk'+path,wait_until='domcontentloaded',timeout=60000)
 await page.wait_for_function('window.Timber?.version==="v0.7.2-rc.2"&&document.body.classList.contains("is-loaded")')
 if await page.locator('[data-testid=buttonCookiesReject]').is_visible():await page.locator('[data-testid=buttonCookiesReject]').click()
 await page.wait_for_timeout(400)
measure='''()=>{let canvas=document.createElement('canvas').getContext('2d');return [...document.querySelectorAll('.ts-qty__value,.quantity input[name=amount]')].filter(e=>e.getBoundingClientRect().width>0&&getComputedStyle(e).visibility!=='hidden').map(e=>{let r=e.getBoundingClientRect(),s=getComputedStyle(e),q=e.closest('.ts-qty,.quantity'),b=q.getBoundingClientRect(),card=e.closest('.p'),c=card?.getBoundingClientRect();canvas.font=`${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;let needed=canvas.measureText('10000').width;let available=r.width-parseFloat(s.paddingLeft)-parseFloat(s.paddingRight)-parseFloat(s.borderLeftWidth)-parseFloat(s.borderRightWidth);return {width:r.width,needed,available,qty:b.width,inside:r.x>=b.x-1&&r.right<=b.right+1,cardFits:!c||(b.x>=c.x-1&&b.right<=c.right+1),value:e.value,kind:q.className,cardWidth:c?.width}})}'''
def save(): (base/'regression-results.json').write_text(json.dumps(results,indent=2)+'\n')
async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(executable_path=os.environ.get('TIMBER_CHROMIUM', '/usr/bin/chromium'),proxy={'server':os.environ['HTTPS_PROXY']},args=['--no-sandbox'])
  sem=asyncio.Semaphore(2)
  async def layout(width,name,path,view='grid'):
   async with sem:
    ctx=await browser.new_context(viewport={'width':width,'height':1000});await ctx.add_init_script("localStorage.setItem('ts-product-view','"+view+"')")
    page=await ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)));await page.route('**/*',route)
    await goto(page,path)
    qs=await page.evaluate(measure)
    bad=[q for q in qs if q['available']+1<q['needed'] or not q['inside'] or not q['cardFits']]
    assert not bad,(width,name,view,bad)
    assert qs,(width,name,'no quantity fields')
    assert not errors,errors
    results.append({'test':'layout','width':width,'page':name,'view':view,'quantities':len(qs),'minInput':min(q['width'] for q in qs),'errors':errors});save()
    print('PASS layout',width,name,view,len(qs),flush=True);await ctx.close()
  tasks=[]
  for w in [320,375,430,768,1024,1440]:
   for n,path in [('category','/spojovaci-material/'),('home','/'),('detail','/franke-drez-ubg-611-86-860x500mm-sedy-kamen/')]:tasks.append(layout(w,n,path))
  for w in [375,1440]:
   for n,path in [('search','/vyhladavanie/?string=skrutka'),('brand','/znacka/tulip/')]:tasks.append(layout(w,n,path))
  tasks += [layout(w,'table','/spojovaci-material/','list') for w in [1024,1440]]
  await asyncio.gather(*tasks)
  await browser.close()
if __name__=="__main__":asyncio.run(main())
