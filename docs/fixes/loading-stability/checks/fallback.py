import asyncio,json,os,re
from pathlib import Path
from urllib.parse import urlparse
from playwright.async_api import async_playwright
REPO=Path(__file__).resolve().parents[4]
base=Path(os.environ.get('TIMBER_LOADING_WORK', '/tmp/timberstore-loading-check'))
base.mkdir(parents=True, exist_ok=True)
CHROMIUM=os.environ.get('TIMBER_CHROMIUM', '/usr/bin/chromium')
loader=(REPO/'shoptet/loader.html').read_text().split('<script>')[1].split('</script>')[0]
async def main():
 rows=[]
 async with async_playwright() as p:
  browser=await p.chromium.launch(executable_path=CHROMIUM,proxy=({'server':os.environ['HTTPS_PROXY']} if os.environ.get('HTTPS_PROXY') else None),args=['--no-sandbox'])
  for width,name,path,view in [(375,'fasteners','/spojovaci-material/','grid'),(1440,'fasteners','/spojovaci-material/','list'),(1440,'brand','/znacka/tulip/','list')]:
   ctx=await browser.new_context(viewport={'width':width,'height':1000});page=await ctx.new_page();errors=[]
   page.on('pageerror',lambda e:errors.append(str(e)))
   await ctx.add_init_script("localStorage.setItem('ts-product-view', '"+view+"')")
   async def route(r):
    u=r.request.url
    if r.request.resource_type=='font':await r.abort()
    elif '/dist/timber.min.css' in u:await r.fulfill(path=str(REPO/'dist/timber.min.css'),content_type='text/css')
    elif '/dist/timber.min.js' in u:await r.abort()
    elif r.request.resource_type=='document' and r.request.is_navigation_request():
     res=await r.fetch();html=await res.text()
     for m in re.finditer(r'<script[^>]*>(.*?)</script>',html,re.S):
      if 'var BASE' in m.group(1) and 'TimberLoader' in m.group(1):
       html=html[:m.start(1)]+loader+html[m.end(1):];break
     await r.fulfill(response=res,body=html)
    elif (urlparse(u).hostname or '') not in ['www.timberstore.sk','cdn.myshoptet.com','fonts.googleapis.com','fonts.gstatic.com','cdn.jsdelivr.net','shoptet.webotvurci.cz','765909.myshoptet.com']:await r.abort()
    else:await r.continue_()
   await page.route('**/*',route)
   await page.goto('https://www.timberstore.sk'+path,wait_until='domcontentloaded',timeout=60000);await page.wait_for_timeout(2000)
   metric='''()=>{let f=document.querySelector('#products .product form.pr-action'),b=f?.querySelector('[data-testid=buttonAddToCart]'),c=f?.closest('.product'),h=document.querySelector('[data-testid=headerCart]');let box=e=>{let r=e.getBoundingClientRect(),s=getComputedStyle(e);return {w:r.width,h:r.height,rx:r.x-c.getBoundingClientRect().x,ry:r.y-c.getBoundingClientRect().y,font:s.fontSize,transition:s.transitionProperty}};return {view:document.documentElement.classList.contains('ts-view-list'),timber:!!window.Timber,loading:document.documentElement.classList.contains('timber-page-loading'),button:box(b),card:box(c),glyph:getComputedStyle(b,'::after').maskImage,headerGlyph:getComputedStyle(h,'::before').maskImage,pseudo:getComputedStyle(f,'::before').width,footerFont:getComputedStyle(document.querySelector('#footer .custom-footer__contact .tel a')).fontSize,enabled:!b.disabled}}'''
   before=await page.evaluate(metric)
   assert not before['loading'] and not before['timber'] and before['enabled'],before
   assert before['view']==(view=='list'),before
   assert 'url(' in before['glyph'] and 'url(' in before['headerGlyph'],before
   await page.add_script_tag(path=str(REPO/'dist/timber.min.js'));await page.wait_for_timeout(400)
   after=await page.evaluate(metric)
   for field in ['button','card','footerFont']:
    assert before[field]==after[field],(width,name,field,before[field],after[field])
   assert not errors,errors
   rows.append({'width':width,'page':name,'view':view,'before':before,'after':after,'errors':errors})
   (base/'fallback-results.json').write_text(json.dumps(rows,indent=2))
   print('PASS font/JS failure fallback and late enhancement',width,name,view,flush=True)
   await ctx.close()
  await browser.close()
asyncio.run(main())
