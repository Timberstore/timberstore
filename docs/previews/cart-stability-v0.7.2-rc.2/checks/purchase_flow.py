import asyncio,json,os,sys
from pathlib import Path
from playwright.async_api import async_playwright
from regression import route,goto,measure
base=Path(os.environ.get('TIMBER_CART_WORK', '/tmp/timberstore-cart-rc2'));results=json.loads((base/'purchase-results.json').read_text()) if (base/'purchase-results.json').exists() else []
def save(): (base/'purchase-results.json').write_text(json.dumps(results,indent=2)+'\n')
base.mkdir(parents=True, exist_ok=True)
async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(executable_path=os.environ.get('TIMBER_CHROMIUM', '/usr/bin/chromium'),proxy={'server':os.environ['HTTPS_PROXY']},args=['--no-sandbox'])
  for w in ([int(x) for x in sys.argv[1:]] or [320,375,768,1440]):
   ctx=await browser.new_context(viewport={'width':w,'height':1000});page=await ctx.new_page();errors=[];posts=[]
   page.on('pageerror',lambda e:errors.append(str(e)))
   page.on('request',lambda r:posts.append(r.url) if r.method=='POST' and '/Cart/addCartItem/' in r.url else None)
   await page.route('**/*',route)
   await goto(page,'/franke-drez-ubg-611-86-860x500mm-sedy-kamen/')
   await page.locator('#product-detail-form .add-to-cart [data-testid=buttonAddToCart]').click()
   await page.wait_for_selector('#colorbox .advanced-order .product :is(.ts-qty__value, .quantity input[name=amount])',timeout=20000)
   await page.wait_for_timeout(1500)
   geometry=await page.evaluate('''()=>{let c=document.querySelector('#colorbox .product'),q=c.querySelector('.ts-qty,.quantity'),f=q.querySelector('input'),b=c.querySelector('.btn-cart'),n=c.querySelector('a.name'),stock=c.querySelector('.availability'),sp=[...stock.children].map(e=>e.getBoundingClientRect()),p=c.querySelector('.price-final'),r=e=>{let b=e.getBoundingClientRect();return {x:b.x,y:b.y,w:b.width,h:b.height,right:b.right}};let head=document.querySelector('.advanced-order > .h1'),primary=document.querySelector('[data-testid=buttonPopupCart]'),back=document.querySelector('[data-testid=buttonPopupBack]');return {q:r(q),input:r(f),button:r(b),titleAlign:getComputedStyle(n).textAlign,line:getComputedStyle(n).lineHeight,priceAlign:getComputedStyle(p).textAlign,stockInline:sp.length<2||Math.abs(sp[0].y-sp[1].y)<6,buttonLabel:b.innerText,headerBg:getComputedStyle(head).backgroundColor,primary:getComputedStyle(primary).backgroundColor,back:getComputedStyle(back).backgroundColor,overflow:document.querySelector('#cboxLoadedContent').scrollWidth-document.querySelector('#cboxLoadedContent').clientWidth}}''')
   assert geometry['titleAlign']=='left' and geometry['priceAlign']=='right' and geometry['stockInline'],(w,geometry)
   assert geometry['input']['w']>=64 and geometry['q']['right']<=geometry['button']['x']+1,(w,geometry)
   assert abs(geometry['q']['y']+geometry['q']['h']/2-geometry['button']['y']-geometry['button']['h']/2)<3,(w,geometry)
   assert 'Pridať do košíka' in geometry['buttonLabel'] and geometry['overflow']<=1,(w,geometry)
   assert geometry['headerBg']=='rgb(232, 245, 237)' and geometry['primary']=='rgb(212, 136, 74)',geometry
   q=page.locator('#colorbox .product :is(.ts-qty,.quantity)').first;field=q.locator('input')
   await field.fill('10000')
   visible=await field.evaluate('(e)=>({value:e.value,scroll:e.scrollLeft,w:e.getBoundingClientRect().width})')
   assert visible['value']=='10000' and visible['scroll']<=1,visible
   await q.screenshot(path=str(base/f'quantity-10000-{w}.png'))
   await field.fill('1');await field.dispatch_event('change')
   await q.locator('.ts-qty__btn--plus,.increase').click();assert await field.input_value()=='2'
   await page.locator('#colorbox .advanced-order').screenshot(path=str(base/f'popup-{w}.png'))
   await page.locator('#colorbox .product .btn-cart').first.click()
   await page.wait_for_timeout(1600)
   assert len(posts)==2,(w,posts)
   await page.locator('[data-testid=buttonPopupBack]').click();await page.locator('#colorbox').wait_for(state='hidden')
   await page.evaluate('()=>window.scrollTo(0,0)');await page.wait_for_timeout(350)
   badge=page.locator(('#header .header-top ' if w>=768 else '.top-navigation-bar .responsive-tools ')+'.cart-count > i').first
   layer=await badge.evaluate('''e=>{let old=e.textContent;e.textContent='10000';let b=e.getBoundingClientRect(),p=e.parentElement.querySelector('[data-testid=headerCartPrice]').getBoundingClientRect();let s=getComputedStyle(e),icon=getComputedStyle(e.parentElement,'::before');let out={z:s.zIndex,iconZ:icon.zIndex,width:b.width,right:b.right,priceX:p.x,old};e.textContent=old;return out}''')
   assert int(layer['z'])>int(layer['iconZ']) and layer['right']<=layer['priceX']+1,(w,layer)
   await page.locator(('#header .header-top ' if w>=768 else '.top-navigation-bar .responsive-tools ')+'.ts-cart-preview-toggle').first.click()
   await page.wait_for_timeout(400)
   mini=await page.locator('#cart-widget').evaluate('(e)=>({x:e.getBoundingClientRect().x,w:e.getBoundingClientRect().width})')
   assert mini['x']>=-1 and mini['x']+mini['w']<=w+1,(w,mini)
   minis=await page.evaluate(measure);assert all(x['available']+1>=x['needed'] and x['inside'] for x in minis),(w,minis)
   await goto(page,'/kosik/')
   amounts=await page.locator('#cart-wrapper tr.removeable .quantity input[name=amount]').evaluate_all('(es)=>es.map(e=>({v:e.value,min:e.min,max:e.max,step:e.step}))')
   assert sorted(x['v'] for x in amounts)==['1','2'],(w,amounts)
   fields=await page.evaluate(measure);assert all(x['available']+1>=x['needed'] and x['inside'] for x in fields),(w,fields)
   first=page.locator('#cart-wrapper tr.removeable .quantity input[name=amount]').first
   old=await first.input_value();await page.locator('#cart-wrapper tr.removeable .quantity .increase').first.click();await page.wait_for_timeout(1300)
   assert float(await first.input_value())==float(old)+1,(w,'cart plus')
   if w==1440:
    bounds=await first.evaluate('(e)=>({min:e.min,max:e.max,step:e.step})')
    await first.fill('10000');await first.press('Tab');await page.wait_for_timeout(1400)
    capped=await first.input_value();assert float(capped)<10000,(capped,bounds)
    assert await first.evaluate('(e)=>({min:e.min,max:e.max,step:e.step})')==bounds
   nxt=page.locator('a[href*="krok-1"]:visible, #continue-order-button:visible, [data-testid=buttonNextStep]:visible').first
   await nxt.click();await page.wait_for_selector('#order-shipping-methods')
   await page.locator('input[name=shippingId]:enabled').first.check(force=True);await page.wait_for_timeout(650)
   await page.locator('input[name=billingId]:enabled').first.check(force=True);await page.wait_for_timeout(650)
   assert not errors,errors
   results.append({'width':w,'popup':geometry,'fiveDigits':visible,'badge':layer,'mini':mini,'cartAmounts':amounts,'singlePosts':len(posts),'checkout':page.url,'errors':errors});save()
   print('PASS purchase, popup, 10000, badge, mini/cart, checkout',w,flush=True)
   await ctx.close()
  await browser.close()
if __name__=='__main__':asyncio.run(main())
