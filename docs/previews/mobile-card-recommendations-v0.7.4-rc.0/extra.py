import asyncio,ast,json,os,subprocess
from pathlib import Path
from urllib.parse import urlparse
from playwright.async_api import async_playwright
w=Path(os.environ.get('TIMBER_CARD_WORK','/tmp/timber-card-recommendations'));repo=Path(__file__).resolve().parents[3];results=[]
MEASURE=next(ast.literal_eval(n.value) for n in ast.parse(Path(__file__).with_name('check.py').read_text()).body if isinstance(n,ast.Assign) and any(isinstance(t,ast.Name) and t.id=='MEASURE' for t in n.targets))
w.mkdir(parents=True,exist_ok=True)
async def main():
 async with async_playwright() as p:
  b=await p.chromium.launch(executable_path='/usr/bin/chromium',proxy={'server':os.environ['HTTPS_PROXY']},args=['--no-sandbox'])
  for width in [375,1440]:
   ctx=await b.new_context(viewport={'width':width,'height':900});page=await ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   async def route(r):
    if '/dist/timber.min.css' in r.request.url:await r.fulfill(path=str(repo/'dist/timber.min.css'),content_type='text/css');return
    if '/dist/timber.min.js' in r.request.url:await r.fulfill(path=str(repo/'dist/timber.min.js'),content_type='text/javascript');return
    if urlparse(r.request.url).hostname in ['www.timberstore.sk','cdn.myshoptet.com','cdn.jsdelivr.net','fonts.googleapis.com','fonts.gstatic.com','shoptet.webotvurci.cz']:await r.continue_()
    else:await r.abort()
   await page.route('**/*',route)
   async def goto(path):
    await page.goto('https://www.timberstore.sk'+path+'?ts_preview=v0.7.3',wait_until='domcontentloaded',timeout=60000);await page.wait_for_function('window.Timber?.version==="v0.7.4-rc.0"&&document.body.classList.contains("is-loaded")');await page.wait_for_timeout(500)
    if await page.locator('[data-testid=buttonCookiesAccept]').is_visible():await page.locator('[data-testid=buttonCookiesAccept]').click()
   await goto('/strongpower-elektricka-zasuvka-3x-230v--schuko--strieborna/');cards=page.locator('#content .products-alternative-block .product');card=cards.first
   await card.scroll_into_view_if_needed();await page.wait_for_timeout(600);fixtures=[]
   for unit,stock,price,net in [('ks','(>100 ks)','40,06 €','32,57 € bez DPH'),('balenie','(58 balenie)','186,49 €','151,62 € bez DPH'),('pár','(9 pár)','275,70 €','224,15 € bez DPH'),('sada','(>100 sada)','1 234,56 €','1 003,71 € bez DPH')]:
    await card.evaluate('''(e,d)=>{e.querySelector('.availability-amount').textContent=d.stock;e.querySelector('.price-final strong').textContent=d.price;e.querySelector('.price-additional').textContent=d.net;let u=e.querySelector('.ts-recommendation-unit,.pr-list-unit');if(!u){u=document.createElement('span');u.className='ts-recommendation-unit';e.querySelector('.price-final').append(u)}u.textContent=' / '+d.unit}''',{'unit':unit,'stock':stock,'price':price,'net':net});await page.wait_for_timeout(80)
    row=(await card.evaluate_all(MEASURE))[0]
    # Compare text on each corresponding row, not the two-row stock box extent.
    assert row['strong']['x']>=row['stockFirst']['right']+5,(width,unit,'gross overlap',row)
    assert row['netText']['x']>=row['amount']['right']+2,(width,unit,'net overlap',row)
    assert row['unit']['right']<=row['card']['right']-11,(width,unit,'price outside card',row)
    assert row['gross']['h']==22 and row['net']['y']==row['gross']['bottom'] and row['unit']['y']==row['gross']['y'],(width,unit,'wrapped',row)
    fixtures.append({'unit':unit,'firstRowGap':row['strong']['x']-row['stockFirst']['right'],'secondRowGap':row['netText']['x']-row['amount']['right'],'twoLines':True})
   # A delayed missing unit has a reserved slot equal to the eventual short unit.
   transition=await card.evaluate("(e)=>{let measure="+MEASURE+";e.querySelectorAll('.ts-recommendation-unit,.pr-list-unit').forEach(u=>u.remove());let before=measure([e])[0];let u=document.createElement('span');u.className='ts-recommendation-unit';u.textContent=' / ks';e.querySelector('.price-final').append(u);let after=measure([e])[0];return {before,after}}")
   before,after=transition['before'],transition['after']
   for field in ['strong','gross','net','q','button']:assert all(abs(before[field][axis]-after[field][axis])<=.5 for axis in ['x','y','w','h']),(width,'late unit shift',field,before[field],after[field])
   # Native navigation still moves the horizontal rail and doesn't stack controls.
   nav=page.locator('.products-alternative-block button').filter(has_text='›')
   if not await nav.count():nav=page.locator('.products-alternative-block .swiper-button-next,.products-alternative-block .ts-rail__nextEl')
   if await nav.count():
    x=await card.evaluate('e=>e.getBoundingClientRect().x');await nav.first.click();await page.wait_for_timeout(700);assert abs(await card.evaluate('e=>e.getBoundingClientRect().x')-x)>20
   results.append({'width':width,'longUnitFixtures':fixtures,'lateUnitNoShift':True,'syntheticDataPresentationOnly':True})
   if width==375:
    await goto('/');await page.wait_for_timeout(800);print('HOME',await page.locator('.product').count(),await page.locator('.product').first.evaluate('e=>{let a=[];while(e&&a.length<8){a.push(e.tagName+"#"+e.id+"."+e.className);e=e.parentElement}return a}'),flush=True);home=await page.locator('.content-wrapper .product:has(form.pr-action .btn-cart)').evaluate_all("es=>es.map(e=>{let b=e.querySelector('.btn-cart'),l=b.querySelector('span:not(.ts-cart-count)');return {label:l?.textContent,shown:l&&getComputedStyle(l).display!=='none',overflow:b.scrollWidth>b.clientWidth+1}})")
    assert home and all(r['shown'] and not r['overflow'] for r in home),home
    results[-1]['homepageMobileLabels']=len(home)
   assert not errors,errors;print('PASS extras',width,fixtures,flush=True);await ctx.close()
  await b.close()
 (w/'extra.json').write_text(json.dumps(results,indent=2))
asyncio.run(main())
