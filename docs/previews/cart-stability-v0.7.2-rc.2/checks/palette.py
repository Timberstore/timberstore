import asyncio,json,os,sys
from pathlib import Path
from playwright.async_api import async_playwright
from regression import route,goto
base=Path(os.environ.get('TIMBER_CART_WORK', '/tmp/timberstore-cart-rc2'));results=json.loads((base/'palette-results.json').read_text()) if (base/'palette-results.json').exists() else []
base.mkdir(parents=True, exist_ok=True)
async def main():
 async with async_playwright() as p:
  b=await p.chromium.launch(executable_path=os.environ.get('TIMBER_CHROMIUM', '/usr/bin/chromium'),proxy={'server':os.environ['HTTPS_PROXY']},args=['--no-sandbox'])
  for w in ([int(x) for x in sys.argv[1:]] or [375,1440]):
   ctx=await b.new_context(viewport={'width':w,'height':1000});page=await ctx.new_page();await page.route('**/*',route)
   await goto(page,'/spojovaci-material/');await page.wait_for_timeout(800)
   await page.locator('#products .product .btn-cart').first.click()
   await page.wait_for_function("document.querySelector('.cart-count.full')")
   await page.wait_for_timeout(1000)
   popup=await page.locator('#colorbox .advanced-order').count()
   popupColors=None
   if popup:
    popupColors=await page.evaluate('''()=>{let root=document.querySelector('#colorbox .advanced-order'),fill=root.querySelector('.price-range>div');return {remainder:getComputedStyle(root.querySelector('.extra.delivery strong')).color,fill:fill&&getComputedStyle(fill).backgroundColor}}''')
    assert popupColors=={'remainder':'rgb(0, 200, 83)','fill':'rgb(0, 200, 83)'},popupColors
    await page.locator('#colorbox').screenshot(path=str(base/f'shipping-remaining-{w}.png'))
    await page.locator('[data-testid=buttonPopupBack]').click();await page.locator('#colorbox').wait_for(state='hidden')
   await page.evaluate('scrollTo(0,0)');await page.wait_for_timeout(200)
   await page.locator(('#header .header-top ' if w>=768 else '.top-navigation-bar .responsive-tools ')+'.ts-cart-preview-toggle').first.click();await page.wait_for_timeout(300)
   mini=await page.locator('#cart-widget .cart-free-shipping').evaluate('''e=>({fill:getComputedStyle(e,'::before').backgroundColor,amount:getComputedStyle(e.querySelector('strong')).color,truck:getComputedStyle(e.querySelector('div'),'::before').color})''')
   assert all(c=='rgb(0, 200, 83)' for c in mini.values()),mini
   await goto(page,'/kosik/');await page.wait_for_timeout(600)
   cart=await page.locator('#cart-wrapper .ts-cart-shipping').evaluate('''e=>({fill:getComputedStyle(e.querySelector('.price-range>div')).backgroundColor,amount:getComputedStyle(e.querySelector('.extra.delivery strong')).color,truck:getComputedStyle(e.querySelector('.extra.delivery'),'::before').color,percent:e.querySelector('.price-range>div').style.width})''')
   assert all(cart[k]=='rgb(0, 200, 83)' for k in ['fill','amount','truck']),cart
   assert 0<float(cart['percent'].strip('%'))<100,cart
   await goto(page,'/franke-drez-ubg-611-86-860x500mm-sedy-kamen/')
   speed=await page.evaluate('jQuery.colorbox.settings.speed')
   await page.locator('.p-image-wrapper .p-image').click();await page.wait_for_selector('#cboxLoadedContent img')
   gallery=await page.locator('#colorbox').evaluate('(e)=>({transform:getComputedStyle(e).transform,hasCart:!!e.querySelector(".advanced-order")})')
   assert gallery=={'transform':'none','hasCart':False} and await page.evaluate('jQuery.colorbox.settings.speed')==speed,gallery
   await page.locator('#cboxClose').click();await page.locator('#colorbox').wait_for(state='hidden')
   results.append({'width':w,'popup':popupColors,'mini':mini,'cart':cart,'gallery':gallery,'pass':True});(base/'palette-results.json').write_text(json.dumps(results,indent=2));print('PASS incomplete shipping popup/mini/cart palette + gallery',w,flush=True)
   await ctx.close()
  await b.close()
asyncio.run(main())
