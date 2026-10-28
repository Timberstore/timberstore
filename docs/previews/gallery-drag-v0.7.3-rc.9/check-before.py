import asyncio,os,json,subprocess
from pathlib import Path
from playwright.async_api import async_playwright
from urllib.parse import urlparse
work=Path(os.environ.get('TIMBER_GALLERY_WORK','/tmp/timber-gallery-drag'));repo=Path(__file__).resolve().parents[3]
work.mkdir(parents=True,exist_ok=True)
for ext in ['js','css']:(work/f'before.{ext}').write_bytes(subprocess.check_output(['git','show',f'c23bdbe:dist/timber.min.{ext}'],cwd=repo))
async def main():
 work.mkdir(parents=True,exist_ok=True)
 async with async_playwright() as p:
  b=await p.chromium.launch(executable_path='/usr/bin/chromium',proxy={'server':os.environ['HTTPS_PROXY']},args=['--no-sandbox']);page=await b.new_page(viewport={'width':375,'height':900})
  async def route(r):
   u=r.request.url
   if '/dist/timber.min.css' in u:await r.fulfill(path=str(work/'before.css'),content_type='text/css')
   elif '/dist/timber.min.js' in u:await r.fulfill(path=str(work/'before.js'),content_type='text/javascript')
   elif urlparse(u).hostname in ['www.timberstore.sk','cdn.myshoptet.com','cdn.jsdelivr.net','fonts.googleapis.com','fonts.gstatic.com','shoptet.webotvurci.cz']:await r.continue_()
   else:await r.abort()
  await page.route('**/*',route);await page.goto('https://www.timberstore.sk/tulip-uchytka-tende-32-146-antracit-2/?ts_preview=f66dd06e018f3b8d18352b1a3b1cfe5666676006',wait_until='domcontentloaded',timeout=60000);await page.wait_for_function('window.Timber?.version==="v0.7.3-rc.8"&&document.body.classList.contains("is-loaded")')
  if await page.locator('[data-testid=buttonCookiesAccept]').is_visible():await page.locator('[data-testid=buttonCookiesAccept]').click()
  await page.locator('.p-thumbnails').evaluate('e=>e.scrollIntoView({block:"center"})');await page.wait_for_timeout(500);r=await page.locator('.p-thumbnails').bounding_box();x=r['x']+r['width']*.72;y=r['y']+r['height']/2;samples=[]
  await page.mouse.move(x,y);await page.mouse.down()
  for dx in [-25,-75]:
   await page.mouse.move(x+dx,y,steps=5);await page.wait_for_timeout(150);samples.append(await page.locator('.p-thumbnails-inner').evaluate('e=>parseFloat(getComputedStyle(e).left)||0'))
  await page.mouse.up();await page.wait_for_timeout(400);active=await page.evaluate('[...document.querySelectorAll(".p-thumbnail")].findIndex(e=>e.classList.contains("highlighted"))');assert samples==[0,0],samples
  (work/'before.json').write_text(json.dumps({'baseline':'c23bdbe','width':375,'heldOffsets':samples,'selectedAfterRelease':active,'reproducedNoContinuousStripMovement':True},indent=2));print('REPRODUCED before: held offsets',samples,'selected after release',active,flush=True);await b.close()
asyncio.run(main())
