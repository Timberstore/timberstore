import asyncio,json,os
from pathlib import Path
from playwright.async_api import async_playwright
from flows import route,check
REPO=Path(__file__).resolve().parents[4]
base=Path(os.environ.get('TIMBER_LOADING_WORK', '/tmp/timberstore-loading-check'))
base.mkdir(parents=True, exist_ok=True)
CHROMIUM=os.environ.get('TIMBER_CHROMIUM', '/usr/bin/chromium')
async def main():
 rows=[]
 async with async_playwright() as p:
  browser=await p.chromium.launch(executable_path=CHROMIUM,proxy=({'server':os.environ['HTTPS_PROXY']} if os.environ.get('HTTPS_PROXY') else None),args=['--no-sandbox'])
  for width in [320,430,1024]:
   ctx=await browser.new_context(viewport={'width':width,'height':950});page=await ctx.new_page();errors=[]
   page.on('pageerror',lambda e:errors.append(str(e)));await page.route('**/*',route)
   for name,path in [('fasteners','/spojovaci-material/'),('home','/'),('detail','/pruzina-k-zdvihaku-kp03-3-00x22-5x142x36-silnejsia/')]:
    await page.goto('https://www.timberstore.sk'+path,wait_until='domcontentloaded',timeout=60000)
    await page.wait_for_function('window.Timber&&document.body.classList.contains("is-loaded")');await page.wait_for_timeout(300)
    values=await page.evaluate(check)
    assert values and all(x['qty'] and x['duplicates']<=1 and not x['overflow'] for x in values),(name,width,values)
    rows.append({'width':width,'page':name,'forms':len(values),'errors':errors.copy()})
    print('PASS',name,width,len(values),flush=True)
   assert not errors,errors
   await ctx.close()
  await browser.close()
 (base/'responsive-results.json').write_text(json.dumps(rows,indent=2))
asyncio.run(main())
