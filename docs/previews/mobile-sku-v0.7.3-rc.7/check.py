import asyncio,os,json
from pathlib import Path
from urllib.parse import urlparse
from playwright.async_api import async_playwright
work=Path(os.environ.get('TIMBER_SKU_WORK','/tmp/timber-mobile-sku'));repo=Path(__file__).resolve().parents[3];results=[]
async def main():
 work.mkdir(parents=True,exist_ok=True)
 async with async_playwright() as p:
  b=await p.chromium.launch(executable_path='/usr/bin/chromium',proxy={'server':os.environ['HTTPS_PROXY']},args=['--no-sandbox']);sem=asyncio.Semaphore(2)
  async def case(w):
   async with sem:
    page=await b.new_page(viewport={'width':w,'height':900});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
    async def route(r):
     u=r.request.url
     if '/dist/timber.min.css' in u:await r.fulfill(path=str(repo/'dist/timber.min.css'),content_type='text/css')
     elif '/dist/timber.min.js' in u:await r.fulfill(path=str(repo/'dist/timber.min.js'),content_type='text/javascript')
     elif urlparse(u).hostname in ['www.timberstore.sk','cdn.myshoptet.com','cdn.jsdelivr.net','fonts.googleapis.com','fonts.gstatic.com','shoptet.webotvurci.cz']:await r.continue_()
     else:await r.abort()
    await page.route('**/*',route)
    for name,path in [('category','/spojovaci-material/'),('brand','/znacka/tulip/'),('home','/'),('related','/franke-drez-ubg-611-86-860x500mm-sedy-kamen/')]:
     await page.goto('https://www.timberstore.sk'+path+'?ts_preview=v0.7.2',wait_until='domcontentloaded',timeout=60000);await page.wait_for_function('window.Timber?.version==="v0.7.3-rc.7"&&document.body.classList.contains("is-loaded")');await page.wait_for_timeout(450)
     if await page.locator('[data-testid=buttonCookiesAccept]').is_visible():await page.locator('[data-testid=buttonCookiesAccept]').click();await page.wait_for_timeout(120)
     await page.evaluate('document.querySelectorAll(".js-close-information-msg").forEach(e=>e.click())')
     data=await page.locator('.content-wrapper .product').evaluate_all('''es=>es.filter(e=>e.getBoundingClientRect().width>0).map(e=>{let c=e.querySelector('.p-code'),i=e.querySelector('.image'),n=e.querySelector('a.name');if(!c||!i)return null;let r=c.getBoundingClientRect(),p=e.getBoundingClientRect(),img=i.getBoundingClientRect(),style=getComputedStyle(c);let flags=[...e.querySelectorAll('.flags-default .flag')].map(f=>f.getBoundingClientRect()).filter(f=>f.width&&f.height&&f.left<r.right&&f.right>r.left&&f.top<r.bottom&&f.bottom>r.top);return {sku:c.querySelector('[data-micro=sku]')?.textContent.trim(),text:c.textContent.trim(),display:style.display,visible:r.width>0&&r.height>0&&style.visibility==='visible',withinCard:r.left>=p.left-1&&r.right<=p.right+1&&r.top>=p.top-1,aboveName:r.bottom<=n.getBoundingClientRect().top,photoBand:r.bottom<=img.bottom,overlappingFlags:flags.length}}).filter(Boolean)''')
     assert data,(w,name,'no cards');bad=[x for x in data if not x['visible'] or not x['withinCard'] or not x['aboveName'] or not x['photoBand'] or x['overlappingFlags']];row={'width':w,'page':name,'cards':len(data),'bad':bad,'errors':errors.copy()};results.append(row);(work/'verification.json').write_text(json.dumps(results,indent=2));print(w,name,len(data),'bad',bad[:3],flush=True)
     if w==375 and name in ['category','home']:
      card=page.locator('#products>.product' if name=='category' else '.content-wrapper .product').first;await card.scroll_into_view_if_needed();await card.screenshot(path=str(work/f'{name}-375.png'))
    await page.close()
  await asyncio.gather(*(case(w) for w in [320,375,480,768,1440]));await b.close()
asyncio.run(main())

assert results and all(not x['bad'] and not x['errors'] for x in results)
