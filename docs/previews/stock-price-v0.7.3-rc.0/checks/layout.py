import asyncio,os,json
from pathlib import Path
from urllib.parse import urlparse
from playwright.async_api import async_playwright
work=Path(os.environ.get('TIMBER_STOCK_WORK','/tmp/timber-stock-price'));repo=Path(__file__).resolve().parents[4];results=[]
CHECK='''es=>es.filter(e=>e.getBoundingClientRect().width>0).map(e=>{let s=e.querySelector('.availability'),p=e.querySelector('.prices'),o=e.querySelector('.p-bottom>[data-micro=offer]');if(!s||!p||!o)return null;let a=s.getBoundingClientRect(),b=p.getBoundingClientRect(),r=o.getBoundingClientRect();let central=s.querySelector('.ts-stock-central'),amount=s.querySelector('.availability-amount');let last=null;if(central){let t=central.firstChild,range=document.createRange();range.setStart(t,t.textContent.indexOf('\\n')+1);range.setEnd(t,t.length);last=range.getBoundingClientRect().y}let count=amount?.getBoundingClientRect();return {sku:e.querySelector('[data-micro=sku]')?.textContent,width:r.width,sx:a.x,sy:a.y,sw:a.width,sh:a.height,px:b.x,py:b.y,pw:b.width,ph:b.height,stockOverflow:s.scrollWidth>s.clientWidth+1,priceOverflow:p.scrollWidth>p.clientWidth+1,netBefore:getComputedStyle(e.querySelector('.price-additional'),'::before').content,netAfter:getComputedStyle(e.querySelector('.price-additional'),'::after').content,central:!!central,lastWordY:last,countY:count?.y,overlap:a.x+a.width>b.x+1&&a.y<b.bottom-1&&a.bottom>b.y+1}}).filter(Boolean)'''
async def main():
 work.mkdir(parents=True,exist_ok=True)
 async with async_playwright() as p:
  b=await p.chromium.launch(executable_path='/usr/bin/chromium',proxy={'server':os.environ['HTTPS_PROXY']},args=['--no-sandbox']);sem=asyncio.Semaphore(2)
  async def case(w):
   async with sem:
    ctx=await b.new_context(viewport={'width':w,'height':900});page=await ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
    async def route(r):
     u=r.request.url
     if '/dist/timber.min.css' in u:await r.fulfill(path=str(repo/'dist/timber.min.css'),content_type='text/css')
     elif '/dist/timber.min.js' in u:await r.fulfill(path=str(repo/'dist/timber.min.js'),content_type='text/javascript')
     elif urlparse(u).hostname in ['www.timberstore.sk','cdn.myshoptet.com','cdn.jsdelivr.net','fonts.googleapis.com','fonts.gstatic.com','shoptet.webotvurci.cz']:await r.continue_()
     else:await r.abort()
    await page.route('**/*',route)
    for name,path in [('category','/spojovaci-material/'),('central','/vyhladavanie/?string=11455'),('brand','/znacka/tulip/'),('home','/')]:
     await page.goto('https://www.timberstore.sk'+path+('&' if '?' in path else '?')+'ts_preview=v0.7.2',wait_until='domcontentloaded',timeout=60000);await page.wait_for_function('window.Timber?.version==="v0.7.3-rc.0"&&document.body.classList.contains("is-loaded")');await page.wait_for_timeout(500)
     if await page.locator('[data-testid=buttonCookiesAccept]').is_visible():await page.locator('[data-testid=buttonCookiesAccept]').click();await page.wait_for_timeout(300)
     await page.evaluate('document.querySelectorAll(".messages .close,.js-close-information-msg").forEach(e=>e.click())')
     data=await page.locator('#products .product' if name!='home' else '.content-wrapper :is(.products,.products-block) .product').evaluate_all(CHECK)
     bad=[d for d in data if d['overlap'] or d['stockOverflow'] or d['priceOverflow'] or (d['central'] and abs(d['lastWordY']-d['countY'])>4)]
     row={'width':w,'page':name,'cards':len(data),'bad':bad,'data':data,'errors':errors.copy()};results.append(row);(work/'layout.json').write_text(json.dumps(results,indent=2));print(w,name,'cards',len(data),'bad',[(d['sku'],d['width'],d['stockOverflow'],d['priceOverflow'],d['lastWordY'],d['countY']) for d in bad],flush=True)
     if name in ['category','central'] and w in [375,1440]:
      card=page.locator('#products .product:visible').first;await card.scroll_into_view_if_needed();await card.screenshot(path=str(work/f'{name}-{w}.png'))
    await ctx.close()
  await asyncio.gather(*(case(w) for w in [320,375,480,768,1024,1440,1920]));await b.close()
asyncio.run(main())
