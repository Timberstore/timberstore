import asyncio,os,json
from pathlib import Path
from urllib.parse import urlparse
from playwright.async_api import async_playwright
w=Path(os.environ.get('TIMBER_CARD_WORK','/tmp/timber-card-recommendations'));repo=Path(__file__).resolve().parents[3];results=[]
MEASURE=r'''es=>es.filter(e=>e.querySelector('.btn-cart')&&e.querySelector('.availability-amount')).map(e=>{
 let rect=e=>{if(!e)return null;let r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom}};
 let q=e.querySelector('.quantity,.ts-qty'),b=e.querySelector('.btn-cart'),a=e.querySelector('.availability'),p=e.querySelector('.prices'),g=e.querySelector('.price-final'),n=e.querySelector('.price-additional'),strong=g?.querySelector('strong'),u=g?.querySelector('.pr-list-unit,.ts-recommendation-unit');
 let label=b.querySelector('span:not(.ts-cart-count)'),textRect=node=>{let range=document.createRange();range.selectNodeContents(node);return rect({getBoundingClientRect:()=>range.getBoundingClientRect()})};
 let sn=a?.querySelector('span:first-child')?.firstChild,sr=document.createRange();if(sn){let start=sn.textContent.search(/\S/),len=sn.textContent.trim().split(/\s/)[0].length;sr.setStart(sn,start);sr.setEnd(sn,start+len)};let stockFirst=sn?rect({getBoundingClientRect:()=>sr.getBoundingClientRect()}):null;return {stockFirst,sku:e.querySelector('[data-micro=sku]')?.textContent,card:rect(e.querySelector('.p')),q:rect(q),button:rect(b),availability:rect(a),price:rect(p),gross:rect(g),net:rect(n),strong:rect(strong),unit:rect(u),unitText:u?.textContent,stock:a?.textContent,central:!!a?.querySelector('.ts-stock-central'),amount:rect(a?.querySelector('.availability-amount')),fieldWidth:q?.querySelector('input')?.getBoundingClientRect().width,labelShown:label&&getComputedStyle(label).display!=='none',label:label?.textContent,buttonOverflow:b.scrollWidth>b.clientWidth+1,netText:n?textRect(n):null,priceFont:strong&&getComputedStyle(strong).fontSize,icon:getComputedStyle(b,'::after').display};})'''
w.mkdir(parents=True,exist_ok=True)
async def main():
 async with async_playwright() as p:
  b=await p.chromium.launch(executable_path='/usr/bin/chromium',proxy={'server':os.environ['HTTPS_PROXY']},args=['--no-sandbox']);sem=asyncio.Semaphore(3)
  async def case(width,path,kind):
   async with sem:
    ctx=await b.new_context(viewport={'width':width,'height':900});page=await ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
    async def route(r):
     if '/dist/timber.min.css' in r.request.url:await r.fulfill(path=str(repo/'dist/timber.min.css'),content_type='text/css');return
     if '/dist/timber.min.js' in r.request.url:await r.fulfill(path=str(repo/'dist/timber.min.js'),content_type='text/javascript');return
     if urlparse(r.request.url).hostname in ['www.timberstore.sk','cdn.myshoptet.com','cdn.jsdelivr.net','fonts.googleapis.com','fonts.gstatic.com','shoptet.webotvurci.cz']:await r.continue_()
     else:await r.abort()
    await page.route('**/*',route);await page.goto('https://www.timberstore.sk'+path+('?ts_preview=v0.7.3' if '?' not in path else '&ts_preview=v0.7.3'),wait_until='domcontentloaded',timeout=60000);await page.wait_for_function('window.Timber?.version==="v0.7.4-rc.0"&&document.body.classList.contains("is-loaded")')
    if await page.locator('[data-testid=buttonCookiesAccept]').is_visible():await page.locator('[data-testid=buttonCookiesAccept]').click()
    await page.evaluate('document.querySelectorAll(".js-close-information-msg").forEach(e=>e.click())');await page.wait_for_timeout(900)
    selector='#content :is(.products-related-block,.products-alternative-block) .product' if kind=='recommendation' else '#products>.product'
    cards=page.locator(selector);assert await cards.count()>0,(width,path)
    await cards.first.scroll_into_view_if_needed();await page.wait_for_timeout(700)
    metrics=await cards.evaluate_all(MEASURE);assert metrics,(width,path,'no buyable cards')
    for row in metrics:
     a,q,bt,g,n=row['availability'],row['q'],row['button'],row['gross'],row['net'];assert q and bt and g and n,(width,path,row)
     assert row['fieldWidth']>=63.5 and not row['buttonOverflow'],(width,path,'quantity/button clipping',row)
     assert abs((q['y']+q['h']/2)-(bt['y']+bt['h']/2))<=1 and bt['x']-q['right']>=(9 if kind=='recommendation' or width<=767 else 7.5),(width,path,'purchase row',row)
     assert q['x']>=row['card']['x']+11 and bt['right']<=row['card']['right']-11,(width,path,'card inset',row)
     if kind=='recommendation':
      assert not row['labelShown'] and row['icon']!='none',(width,path,'icon only',row)
      assert abs(a['y']-g['y'])<=1 and abs(g['h']-22)<=1 and abs(n['y']-g['bottom'])<=1 and abs(a['h']-44)<=1,(width,path,'offer lines',row)
      assert row['strong']['x']>=row['stockFirst']['right']+6 and row['netText']['x']>=row['amount']['right']+3,(width,path,'overlap',row)
      if row['unit']:assert abs(row['unit']['y']-g['y'])<=1 and row['unit']['right']<=row['card']['right']-11,(width,path,'unit wrap',row)
     elif width<=767:
      assert row['labelShown'] and 'košíka' in row['label'].lower() and bt['x']-q['right']>=13,(width,path,'mobile label/gap',row)
      assert abs(a['y']-g['y'])<=3,(width,path,'mobile stock/price',row)
    if width==1440 and kind=='recommendation' and 'strongpower' in path:
     visible=await cards.evaluate_all('es=>{let v=es[0].closest(".products-alternative-block").getBoundingClientRect();return es.filter(e=>{let r=e.getBoundingClientRect();return r.left>=v.left-1&&r.right<=v.right+1}).length}');assert visible==4,(width,'not four visible',visible)
    if width==375:
     await cards.first.screenshot(path=str(w/f'final-{kind}-{("franke" if "franke" in path else "strongpower" if "strongpower" in path else "catalogue")}-375.png'))
    assert not errors,errors;results.append({'width':width,'path':path,'kind':kind,'cards':len(metrics),'pass':True,'metrics':metrics});(w/'verification.json').write_text(json.dumps(results,indent=2));print('PASS',width,kind,path,len(metrics),flush=True);await ctx.close()
  jobs=[case(width,'/spojovaci-material/','catalogue') for width in [320,375,430,480,600,767,768,992,1440]]
  jobs += [case(width,path,'recommendation') for width in [320,375,600,768,1024,1440,1920] for path in ['/strongpower-elektricka-zasuvka-3x-230v--schuko--strieborna/','/franke-drez-ubg-611-86-860x500mm-sedy-kamen/']]
  await asyncio.gather(*jobs);await b.close()
asyncio.run(main())
