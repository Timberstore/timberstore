import asyncio,json,os
from pathlib import Path
from urllib.parse import urlparse
from playwright.async_api import async_playwright
base=Path(os.environ.get('TIMBER_TRANSITION_WORK', '/tmp/timberstore-transition-rc6'));out=[]
base.mkdir(parents=True,exist_ok=True)
async def main():
 async with async_playwright() as p:
  b=await p.chromium.launch(executable_path=os.environ.get('TIMBER_CHROMIUM','/usr/bin/chromium'),proxy={'server':os.environ['HTTPS_PROXY']},args=['--no-sandbox'])
  for w in [375,1440]:
   ctx=await b.new_context(viewport={'width':w,'height':900});page=await ctx.new_page();posts=[];page.on('request',lambda r:posts.append(r.url) if '/Cart/addCartItem/' in r.url and r.method=='POST' else None)
   async def route(r):
    u=r.request.url
    if '/dist/timber.min.css' in u:await r.fulfill(path=str(Path(__file__).resolve().parents[4]/'dist/timber.min.css'),content_type='text/css')
    elif '/dist/timber.min.js' in u:await r.fulfill(path=str(Path(__file__).resolve().parents[4]/'dist/timber.min.js'),content_type='text/javascript')
    elif urlparse(u).hostname in ['www.timberstore.sk','cdn.myshoptet.com','cdn.jsdelivr.net','fonts.googleapis.com','fonts.gstatic.com','765909.myshoptet.com','shoptet.webotvurci.cz']:await r.continue_()
    else:await r.abort()
   await page.route('**/*',route);await page.goto('https://www.timberstore.sk/spojovaci-material/?ts_preview=46388947cff61b950c5674cd304f720b89853b75',wait_until='load',timeout=60000)
   if await page.locator('[data-testid=buttonCookiesAccept]').is_visible():await page.locator('[data-testid=buttonCookiesAccept]').click()
   await page.wait_for_timeout(700);button=page.locator('#products .product .btn-cart').first;await button.scroll_into_view_if_needed();await page.wait_for_timeout(400)
   height=await page.locator('#products .product').first.evaluate('e=>e.getBoundingClientRect().height');opened=0;attempt=0;rows=[]
   while opened<3 and attempt<6:
    attempt+=1
    if attempt==1:await button.dblclick()
    else:await button.click()
    try:await page.wait_for_selector('#colorbox .advanced-order',timeout=6000)
    except Exception:rows.append({'attempt':attempt,'nativeNoPopup':True});continue
    await page.wait_for_timeout(300)
    h=await page.locator('#products .product').first.evaluate('e=>e.getBoundingClientRect().height');assert abs(h-height)<1,(w,height,h)
    assert len(posts)==attempt,(w,attempt,posts)
    rows.append({'attempt':attempt,'height':h,'posts':len(posts),'pass':True});opened+=1
    await page.locator('[data-testid=buttonPopupBack]').click();await page.locator('#colorbox').wait_for(state='hidden');await page.wait_for_timeout(150)
   assert opened==3,(w,rows)
   out.append({'width':w,'opened':opened,'attempts':rows,'doubleClickOnlyOnePost':True,'backgroundHeight':height,'pass':True});(base/'reopen-results.json').write_text(json.dumps(out,indent=2));print('PASS repeated opening stable background and native double-click shield',w,flush=True);await ctx.close()
  await b.close()
asyncio.run(main())
