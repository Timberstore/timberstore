import asyncio,json,os,sys
from pathlib import Path
from urllib.parse import urlparse
from playwright.async_api import async_playwright
base=Path(os.environ.get('TIMBER_MENU_WORK', '/tmp/timberstore-menu-rc3'));repo=Path(__file__).resolve().parents[4];results=json.loads((base/'results.json').read_text()) if (base/'results.json').exists() else []
base.mkdir(parents=True, exist_ok=True)
async def route(r):
 u=r.request.url
 if '/dist/timber.min.css' in u:await r.fulfill(path=str(repo/'dist/timber.min.css'),content_type='text/css')
 elif '/dist/timber.min.js' in u:await r.fulfill(path=str(repo/'dist/timber.min.js'),content_type='text/javascript')
 elif urlparse(u).hostname in ['www.timberstore.sk','cdn.myshoptet.com','cdn.jsdelivr.net','fonts.googleapis.com','fonts.gstatic.com','765909.myshoptet.com','shoptet.webotvurci.cz']:await r.continue_()
 else:await r.abort()
async def goto(page,path):
 await page.goto('https://www.timberstore.sk'+path,wait_until='domcontentloaded',timeout=60000)
 await page.wait_for_function('window.Timber?.version==="v0.7.2-rc.3"&&document.body.classList.contains("is-loaded")')
 if await page.locator('[data-testid=buttonCookiesReject]').is_visible():await page.locator('[data-testid=buttonCookiesReject]').click()
 await page.wait_for_timeout(700)
MEASURE='''()=>{let root=document.querySelector('#header .navigation-in-bottom .top-navigation-contacts'),r=root.getBoundingClientRect(),style=e=>{let s=getComputedStyle(e);return {color:s.color,font:s.fontSize,bg:s.backgroundColor,w:Math.round(e.getBoundingClientRect().width*1000)/1000,h:Math.round(e.getBoundingClientRect().height*1000)/1000}},socials=[...root.querySelectorAll('.ts-menu-socials>a')];return {order:[...root.children].map(e=>e.className),text:root.innerText,email:root.querySelector('.project-email').href,phone:root.querySelector('.project-phone').href,write:root.querySelector('.ts-menu-write-us').getAttribute('href'),buttonCount:root.querySelectorAll('.ts-menu-write-us').length,nested:root.querySelectorAll('a a').length,icons:[...root.querySelectorAll('a')].map(e=>e.querySelectorAll('svg').length),hours:root.querySelector('.ts-service-bar__hours').dataset.open,footerHours:document.querySelector('#footer .ts-service-bar__hours').dataset.open,emailStyle:style(root.querySelector('.project-email>span')),footerEmailStyle:style(document.querySelector('#footer .mail a')),socials:socials.map(e=>({href:e.href,style:style(e.querySelector('svg')),path:e.querySelector('path').getAttribute('d'),background:getComputedStyle(e.querySelector('svg')).backgroundImage})),footerSocials:[...document.querySelectorAll('#footer .ts-footer-contacts__social')].map(e=>({href:e.href,style:style(e.querySelector('svg')),path:e.querySelector('path').getAttribute('d'),background:getComputedStyle(e.querySelector('svg')).backgroundImage})),inside:[...root.querySelectorAll('a,.ts-service-bar__hours')].every(e=>{let b=e.getBoundingClientRect();return b.x>=r.x-1&&b.right<=r.right+1}),toggle:style(document.querySelector('[data-target=navigation]'))}}'''
def save(): (base/'results.json').write_text(json.dumps(results,indent=2))
async def main():
 async with async_playwright() as p:
  b=await p.chromium.launch(executable_path=os.environ.get('TIMBER_CHROMIUM', '/usr/bin/chromium'),proxy={'server':os.environ['HTTPS_PROXY']},args=['--no-sandbox'])
  sem=asyncio.Semaphore(2)
  async def case(w,name,path):
   async with sem:
    ctx=await b.new_context(viewport={'width':w,'height':1000});page=await ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)));await page.route('**/*',route)
    await goto(page,path)
    nav=await page.locator('#navigation .menu-level-1>li>a').evaluate_all('(es)=>es.map(e=>e.getAttribute("href"))')
    toggle=page.locator('[data-target=navigation]').first
    await toggle.click();await page.wait_for_function('document.body.classList.contains("navigation-window-visible")')
    await page.wait_for_timeout(350)
    data=await page.evaluate(MEASURE)
    expected=['ts-menu-contact-title','ts-service-bar__hours','project-email','project-phone','ts-menu-write-us btn btn-primary','ts-menu-socials']
    assert data['order']==expected,(w,name,data['order'])
    assert data['write']=='/kontakty' and data['phone']=='tel:+421904479842' and data['email']=='mailto:info@timberstore.sk',data
    assert data['buttonCount']==1 and data['nested']==0 and data['icons']==[1,1,0,1,1],data
    assert data['hours']==data['footerHours'] and data['inside'],data
    assert data['emailStyle']['color']==data['footerEmailStyle']['color'] and data['emailStyle']['font']==data['footerEmailStyle']['font']=='16px',data
    assert data['socials']==data['footerSocials'],data
    assert data['toggle']['bg']=='rgb(212, 136, 74)',data
    # Exercise native category accordion without replacing any links/handlers.
    arrow=page.locator('#navigation .menu-level-1>li>a .submenu-arrow').nth(1)
    await arrow.click();await page.wait_for_timeout(200)
    assert await arrow.locator('..').get_attribute('aria-expanded')=='true'
    await arrow.click()
    for _ in range(3):
     await toggle.click();await page.wait_for_function('!document.body.classList.contains("navigation-window-visible")')
     await toggle.focus();await toggle.press('Enter');await page.wait_for_function('document.body.classList.contains("navigation-window-visible")')
    # Reinitialization after native content events must remain idempotent.
    await page.evaluate("()=>{for(let i=0;i<3;i++)document.dispatchEvent(new Event('ShoptetDOMPageContentLoaded'))}")
    await page.wait_for_timeout(250);again=await page.evaluate(MEASURE)
    assert again['order']==expected and again['buttonCount']==1 and again['icons']==[1,1,0,1,1] and again['nested']==0,again
    assert await page.locator('#navigation .menu-level-1>li>a').evaluate_all('(es)=>es.map(e=>e.getAttribute("href"))')==nav
    if w==375 and name=='home':
     await page.locator('#header .navigation-in-bottom').scroll_into_view_if_needed();await page.screenshot(path=str(base/'menu-375.png'))
     await page.locator('#header .navigation-in-bottom .top-navigation-contacts').screenshot(path=str(base/'contacts-375.png'))
     await page.locator('.ts-menu-write-us').click();await page.wait_for_url('**/kontakty/**')
     await page.wait_for_selector('#formContact');assert await page.locator('#formContact').is_visible()
    assert not errors,errors
    results[:]=[r for r in results if not (r.get('width')==w and r.get('page')==name)]
    results.append({'width':w,'page':name,'contact':data,'nativeCategoryAccordion':True,'repeatInit':True,'errors':errors,'pass':True});save();print('PASS menu contacts, palette, accordion, reopen, init',w,name,flush=True)
    await ctx.close()
  await asyncio.gather(*(case(w,n,path) for w in [320,375,430,767] for n,path in [('home','/'),('category','/spojovaci-material/'),('detail','/franke-drez-ubg-611-86-860x500mm-sedy-kamen/')] if not sys.argv[1:] or f'{w}:{n}' in sys.argv[1:]))
  # Cross the native breakpoint twice: cloned menu remains complete/unique.
  page=await b.new_page(viewport={'width':375,'height':1000});await page.route('**/*',route);await goto(page,'/')
  for w in [430,1024,375]:
   await page.set_viewport_size({'width':w,'height':1000});await page.wait_for_timeout(500)
  await page.locator('[data-target=navigation]').first.click();await page.wait_for_timeout(300)
  data=await page.evaluate(MEASURE);assert data['buttonCount']==1 and data['icons']==[1,1,0,1,1] and data['inside'],data
  results.append({'test':'resize through desktop breakpoint','contact':data,'pass':True});save();print('PASS responsive clone',flush=True)
  await b.close()
if __name__=='__main__':asyncio.run(main())
