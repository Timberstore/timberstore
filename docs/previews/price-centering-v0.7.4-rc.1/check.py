import asyncio,os,json
from pathlib import Path
from urllib.parse import urlparse
from playwright.async_api import async_playwright
work=Path(os.environ.get('TIMBER_CENTER_WORK','/tmp/timber-price-centering'));repo=Path(__file__).resolve().parents[3];results=[]
MEASURE=r'''es=>es.filter(e=>e.querySelector('.btn-cart')&&e.querySelector('.price-final>strong')).map(e=>{let box=e=>{if(!e)return null;let r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,cx:r.x+r.width/2,cy:r.y+r.height/2}};let textBox=e=>{let r=document.createRange();r.selectNodeContents(e);return box({getBoundingClientRect:()=>r.getBoundingClientRect()})};let b=e.querySelector('.btn-cart'),q=e.querySelector('.quantity,.ts-qty'),g=e.querySelector('.price-final'),n=e.querySelector('.price-additional');return {sku:e.querySelector('[data-micro=sku]')?.textContent,card:box(e.querySelector('.p')),button:box(b),qty:box(q),amount:box(g.querySelector('strong')),gross:box(g),net:box(n),netText:n&&textBox(n),unit:box(g.querySelector('.pr-list-unit,.ts-recommendation-unit')),label:getComputedStyle(b.querySelector('span')).display}})'''
work.mkdir(parents=True,exist_ok=True)
async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(executable_path='/usr/bin/chromium',proxy={'server':os.environ['HTTPS_PROXY']},args=['--no-sandbox']);sem=asyncio.Semaphore(3)
  async def case(width,path,kind):
   async with sem:
    ctx=await browser.new_context(viewport={'width':width,'height':900});page=await ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
    async def route(r):
     if '/dist/timber.min.css' in r.request.url:await r.fulfill(path=str(repo/'dist/timber.min.css'),content_type='text/css');return
     if '/dist/timber.min.js' in r.request.url:await r.fulfill(path=str(repo/'dist/timber.min.js'),content_type='text/javascript');return
     if urlparse(r.request.url).hostname in ['www.timberstore.sk','cdn.myshoptet.com','cdn.jsdelivr.net','fonts.googleapis.com','fonts.gstatic.com','shoptet.webotvurci.cz']:await r.continue_()
     else:await r.abort()
    await page.route('**/*',route);await page.goto('https://www.timberstore.sk'+path+'?ts_preview=v0.7.3',wait_until='domcontentloaded',timeout=60000);await page.wait_for_function('window.Timber?.version==="v0.7.4-rc.1"&&document.body.classList.contains("is-loaded")');await page.wait_for_timeout(800)
    if await page.locator('[data-testid=buttonCookiesAccept]').is_visible():await page.locator('[data-testid=buttonCookiesAccept]').click()
    await page.evaluate('document.querySelectorAll(".js-close-information-msg").forEach(e=>e.click())')
    sel='#content :is(.products-related-block,.products-alternative-block) .product' if kind=='detail' else '.content-wrapper .product' if kind=='home' else '#products>.product'
    cards=page.locator(sel);await cards.first.scroll_into_view_if_needed();await page.wait_for_timeout(700);rows=await cards.evaluate_all(MEASURE);assert rows,(width,path)
    for r in rows:
     if kind=='catalogue' and width<=767:
      assert abs(((r['amount']['x']+r['unit']['right'])/2 if r['card']['w']<=280 and r['unit'] else r['amount']['cx'])-r['button']['cx'])<1,(width,'amount/button',r)
      assert r['label']!='none' and r['button']['x']-r['qty']['right']>=13,(width,'controls',r)
     if kind=='home' and width>=992:assert abs(r['amount']['cx']-(r['net']['cx'] if r['netText']['h']>22 else r['netText']['cx']))<1,(width,'home amount/net',r)
     if kind=='detail' and width>=992:
      assert abs(r['amount']['cx']-(r['net']['cx'] if r['netText']['h']>22 else r['netText']['cx']))<1,(width,'amount/net',r)
      assert r['label']=='none' and abs(r['button']['cy']-r['qty']['cy'])<1,(width,'detail controls',r)
     if r['unit']:assert r['unit']['right']<=r['card']['right']-3,(width,'unit outside card',r)
    if (width==375 and kind=='catalogue') or (width==1440 and kind=='detail'):
     await page.screenshot(path=str(work/f'{kind}-{width}.png'))
    assert not errors,errors;results.append({'width':width,'path':path,'kind':kind,'cards':len(rows),'rows':rows,'errors':errors,'pass':True});(work/'verification.json').write_text(json.dumps(results,indent=2));print('PASS',width,kind,len(rows),flush=True);await ctx.close()
  await asyncio.gather(*[case(w,'/spojovaci-material/','catalogue') for w in [320,375,480,600,767,1440]],*[case(w,path,'detail') for w in [375,992,1440,1920] for path in ['/strongpower-elektricka-zasuvka-3x-230v--schuko--strieborna/','/franke-drez-ubg-611-86-860x500mm-sedy-kamen/']],case(1440,'/','home'))
  await browser.close()
asyncio.run(main())
