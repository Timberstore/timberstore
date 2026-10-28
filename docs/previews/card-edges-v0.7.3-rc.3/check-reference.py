import asyncio,os,json
from pathlib import Path
from urllib.parse import urlparse
from playwright.async_api import async_playwright
work=Path(os.environ.get('TIMBER_EDGES_WORK','/tmp/timber-card-edges'));repo=Path(__file__).resolve().parents[3];rows=[]
async def main():
 work.mkdir(parents=True,exist_ok=True)
 async with async_playwright() as p:
  b=await p.chromium.launch(executable_path='/usr/bin/chromium',proxy={'server':os.environ['HTTPS_PROXY']},args=['--no-sandbox']);page=await b.new_page(viewport={'width':1440,'height':1000})
  async def route(r):
   u=r.request.url
   if '/dist/timber.min.css' in u:await r.fulfill(path=str(repo/'dist/timber.min.css'),content_type='text/css')
   elif '/dist/timber.min.js' in u:await r.fulfill(path=str(repo/'dist/timber.min.js'),content_type='text/javascript')
   elif urlparse(u).hostname in ['www.timberstore.sk','cdn.myshoptet.com','cdn.jsdelivr.net','fonts.googleapis.com','fonts.gstatic.com','shoptet.webotvurci.cz']:await r.continue_()
   else:await r.abort()
  await page.route('**/*',route)
  async def goto(path):
   await page.goto('https://www.timberstore.sk'+path+('&' if '?' in path else '?')+'ts_preview=v0.7.2',wait_until='domcontentloaded',timeout=60000);await page.wait_for_function('window.Timber?.version==="v0.7.3-rc.3"&&document.body.classList.contains("is-loaded")');await page.wait_for_timeout(400)
   if await page.locator('[data-testid=buttonCookiesAccept]').is_visible():await page.locator('[data-testid=buttonCookiesAccept]').click();await page.wait_for_timeout(200)
   await page.evaluate('document.querySelectorAll(".js-close-information-msg").forEach(e=>e.click())')
  cards=[]
  for sku in ['11455','344255','381119']:
   await goto('/vyhladavanie/?string='+sku);card=page.locator('#products>.product').first;assert (await card.locator('[data-micro=sku]').text_content()).strip()==sku;cards.append(await card.evaluate('e=>e.outerHTML'))
  for w in [992,1024,1440,1920]:
   await page.set_viewport_size({'width':w,'height':1000});await goto('/spojovaci-material/')
   # Geometry fixture only: unmodified public native cards share one real grid.
   await page.locator('#products').evaluate('(e,html)=>e.innerHTML=html',''.join(cards));await page.wait_for_timeout(350);await page.locator('#products').scroll_into_view_if_needed();await page.wait_for_timeout(250)
   data=await page.locator('#products>.product').evaluate_all('''es=>es.map(e=>{let r=n=>n.getBoundingClientRect(),q=e.querySelector('.ts-qty'),a=e.querySelector('.availability'),p=e.querySelector('.prices'),f=e.querySelector('.price-final'),b=e.querySelector('.btn-cart'),t=e.querySelector('a.name'),c=r(e);return {sku:e.querySelector('[data-micro=sku]').textContent,stockLeft:r(a).x-c.x,qtyLeft:r(q).x-c.x,priceRight:r(p).right-c.x,buttonRight:r(b).right-c.x,grossTop:r(f).y-c.y,grossHeight:r(f).height,netTop:r(e.querySelector('.price-additional')).y-c.y,unit:e.querySelector('.pr-list-unit').textContent.trim(),font:getComputedStyle(t).fontSize,stockFont:getComputedStyle(a.querySelector('span')).fontSize,priceOverflow:p.scrollWidth>p.clientWidth+1,stockOverflow:a.scrollWidth>a.clientWidth+1}})''')
   bad=[x for x in data if x['font']!='19px' or x['stockFont']!='12px' or x['priceOverflow'] or x['stockOverflow'] or abs(x['stockLeft']-x['qtyLeft'])>1 or abs(x['priceRight']-x['buttonRight'])>1]
   same={key:max(x[key] for x in data)-min(x[key] for x in data) for key in ['grossTop','grossHeight','netTop']}
   row={'width':w,'fixture':'Three unmodified public product cards in one native catalogue grid; geometry only','data':data,'variation':same,'bad':bad};rows.append(row);(work/'reference.json').write_text(json.dumps(rows,indent=2));print('reference',w,'bad',[(x['sku'],x['stockOverflow'],x['priceOverflow']) for x in bad],'variation',same,flush=True)
   if w==1440:await page.locator('#products').screenshot(path=str(work/'reference-1440.png'))
  await b.close()
asyncio.run(main())

assert rows and all(not x['bad'] and max(x['variation'].values()) <= 1 for x in rows)
