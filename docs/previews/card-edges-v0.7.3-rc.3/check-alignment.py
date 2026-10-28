import asyncio,os,json,subprocess
from pathlib import Path
from urllib.parse import urlparse
from playwright.async_api import async_playwright
work=Path(os.environ.get('TIMBER_EDGES_WORK','/tmp/timber-card-edges'));repo=Path(__file__).resolve().parents[3];results=[]
MEASURE='''es=>es.filter(e=>e.getBoundingClientRect().width>0).map(e=>{let $=s=>e.querySelector(s),r=n=>{let x=n.getBoundingClientRect();return {x:x.x,y:x.y,w:x.width,h:x.height,cx:x.x+x.width/2,cy:x.y+x.height/2,right:x.right,bottom:x.bottom}},s=$('.availability'),l=s.querySelector('span:first-child'),a=s.querySelector('.availability-amount'),p=$('.prices'),n=$('.price-additional'),v=$('.price-final'),q=$('.ts-qty'),b=$('.btn-cart'),title=$('a.name');let word=null;if(l.firstChild?.nodeType===3){let t=l.firstChild,z=document.createRange();z.setStart(t,0);z.setEnd(t,t.textContent.includes('\\n')?t.textContent.indexOf('\\n'):t.length);word=r({getBoundingClientRect:()=>z.getBoundingClientRect()})}return {sku:$('[data-micro=sku]')?.textContent,stock:r(s),price:r(p),qty:q&&r(q),button:b&&r(b),label:r(l),word,count:a&&r(a),gross:r(v),net:r(n),labelFont:getComputedStyle(l).fontSize,numberFont:getComputedStyle($('.ts-price-number')).fontSize,nameWeight:getComputedStyle(title).fontWeight,netBefore:getComputedStyle(n,'::before').content,netAfter:getComputedStyle(n,'::after').content,central:l.classList.contains('ts-stock-central'),stockOverflow:s.scrollWidth>s.clientWidth+1,priceOverflow:p.scrollWidth>p.clientWidth+1}})'''
async def main():
 work.mkdir(parents=True,exist_ok=True)
 async with async_playwright() as p:
  b=await p.chromium.launch(executable_path='/usr/bin/chromium',proxy={'server':os.environ['HTTPS_PROXY']},args=['--no-sandbox']);sem=asyncio.Semaphore(2)
  async def case(w):
   async with sem:
    ctx=await b.new_context(viewport={'width':w,'height':950});page=await ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
    async def route(r):
     u=r.request.url
     if '/dist/timber.min.css' in u:await r.fulfill(path=str(repo/'dist/timber.min.css'),content_type='text/css')
     elif '/dist/timber.min.js' in u:await r.fulfill(path=str(repo/'dist/timber.min.js'),content_type='text/javascript')
     elif urlparse(u).hostname in ['www.timberstore.sk','cdn.myshoptet.com','cdn.jsdelivr.net','fonts.googleapis.com','fonts.gstatic.com','shoptet.webotvurci.cz']:await r.continue_()
     else:await r.abort()
    await page.route('**/*',route)
    for name,path in [('stock','/spojovaci-material/'),('central','/nabytkove-kovania/?order=-price'),('home','/')]:
     await page.goto('https://www.timberstore.sk'+path+('&' if '?' in path else '?')+'ts_preview=v0.7.2',wait_until='domcontentloaded',timeout=60000);await page.wait_for_function('window.Timber?.version==="v0.7.3-rc.3"&&document.body.classList.contains("is-loaded")');await page.wait_for_timeout(500)
     if await page.locator('[data-testid=buttonCookiesAccept]').is_visible():await page.locator('[data-testid=buttonCookiesAccept]').click();await page.wait_for_timeout(200)
     await page.evaluate('document.querySelectorAll(".js-close-information-msg").forEach(e=>e.click())')
     cards=page.locator('#products>.product' if name!='home' else '.content-wrapper .products .product')
     for view in (['grid','list'] if w>=992 and name!='home' else ['grid']):
      if w>=992 and name!='home':await page.locator(f'[data-ts-view={view}]').click();await page.wait_for_timeout(100)
      data=await cards.evaluate_all(MEASURE);assert data,(w,name,'no cards');bad=[]
      for d in data:
       issue=[]
       if d['stockOverflow'] or d['priceOverflow']:issue.append('overflow')
       if view=='grid' and w>=992:
        if d['qty'] and (abs(d['qty']['x']-d['stock']['x'])>1 or abs(d['button']['right']-d['price']['right'])>1):issue.append('column centres')
        if d['nameWeight']!='700':issue.append('grid name weight')
        if d['labelFont']!='12px':issue.append('grid stock font')
       if view=='list':
        if d['labelFont']!='12px' or d['numberFont']!='19px' or d['nameWeight']!='400':issue.append('fonts')
        if d['count'] and abs(d['count']['cy']-d['net']['cy'])>4:issue.append('second row')
        if d['word'] and abs(d['word']['cy']-d['gross']['cy'])>4:issue.append('first row')
        if d['netBefore']!='"("' or d['netAfter']!='")"':issue.append('parentheses')
       if issue:bad.append({'sku':d['sku'],'issues':issue,'data':d})
      row={'width':w,'page':name,'view':view,'cards':len(data),'bad':bad,'errors':errors.copy(),'data':data};results.append(row);(work/'alignment.json').write_text(json.dumps(results,indent=2));print(w,name,view,'bad',[(d['sku'],d['issues']) for d in bad],flush=True)
      if w==1440 and name in ['stock','central']:
       await cards.first.scroll_into_view_if_needed();await page.screenshot(path=str(work/f'{name}-{view}.png'));await cards.first.screenshot(path=str(work/f'{name}-{view}-card.png'))
     if w>=992 and name!='home':await page.locator('[data-ts-view=grid]').click()
    await ctx.close()
  await asyncio.gather(*(case(w) for w in [375,992,1024,1440,1920]));await b.close()
asyncio.run(main())

assert results and all(not x['bad'] and not x['errors'] for x in results)
