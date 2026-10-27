import asyncio,json,os
from pathlib import Path
from playwright.async_api import async_playwright
from regression import route,goto,measure
base=Path(os.environ.get('TIMBER_CART_WORK','/tmp/timberstore-cart-rc1'));base.mkdir(parents=True,exist_ok=True);rows=[]
async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(executable_path=os.environ.get('TIMBER_CHROMIUM','/usr/bin/chromium'),proxy=({'server':os.environ['HTTPS_PROXY']} if os.environ.get('HTTPS_PROXY') else None),args=['--no-sandbox']);sem=asyncio.Semaphore(2)
  async def case(w,name,path):
   async with sem:
    c=await browser.new_context(viewport={'width':w,'height':1000});page=await c.new_page();await page.route('**/*',route);await goto(page,path)
    qs=await page.evaluate(measure);assert all(q['inside'] and q['cardFits'] and q['available']+1>=q['needed'] for q in qs),(w,name,qs)
    checks=await page.evaluate('''()=>[...document.querySelectorAll('.product form.pr-action')].map(f=>{let q=f.querySelector('.ts-qty,.quantity'),b=f.querySelector('.btn-cart'),card=f.closest('.p');if(!q||!b||!card||!q.getBoundingClientRect().width)return null;let r=q.getBoundingClientRect(),s=b.getBoundingClientRect(),c=card.getBoundingClientRect();return {q:{x:r.x,right:r.right,y:r.y,bottom:r.bottom},button:{x:s.x,right:s.right,y:s.y,bottom:s.bottom},card:{x:c.x,right:c.right,y:c.y,bottom:c.bottom},fits:r.x>=c.x-1&&r.right<=c.right+1&&r.bottom<=c.bottom+1&&s.x>=c.x-1&&s.right<=c.right+1&&s.bottom<=c.bottom+1}}).filter(Boolean)''')
    assert all(x['fits'] for x in checks),(w,name,checks[:3])
    related=await page.evaluate('''()=>[...document.querySelectorAll('#content :is(.products-related-block,.products-alternative-block) .product')].filter(e=>e.getBoundingClientRect().width>0).map(e=>({align:getComputedStyle(e.querySelector('a.name')).textAlign,price:getComputedStyle(e.querySelector('.price-final')).textAlign,label:e.querySelector('.btn-cart')?.innerText,color:e.querySelector('.btn-cart')&&getComputedStyle(e.querySelector('.btn-cart')).color}))''')
    assert all(x['align']=='left' and x['price']=='right' and 'Pridať do košíka' in (x['label'] or '') for x in related),(w,name,related)
    main=await page.evaluate('''()=>{let e=document.querySelector('.p-info-wrapper .add-to-cart'),q=e?.querySelector('.quantity'),b=e?.querySelector('.add-to-cart-button');if(!q||!b)return null;let a=q.getBoundingClientRect(),c=b.getBoundingClientRect();return {sameRow:Math.abs(a.y+a.height/2-c.y-c.height/2)<3,left:a.right<=c.x+1}}''')
    assert not main or all(main.values()),(w,name,main)
    rows.append({'width':w,'page':name,'controls':len(checks),'normalRecommendations':related,'mainPurchasePair':main});(base/'geometry-results.json').write_text(json.dumps(rows,indent=2))
    print('PASS complete control geometry',w,name,flush=True);await c.close()
  await asyncio.gather(*(case(w,n,path) for w in [320,375,430,768,1024,1440] for n,path in [('category','/spojovaci-material/'),('home','/'),('detail','/franke-drez-ubg-611-86-860x500mm-sedy-kamen/')]))
  await browser.close()
asyncio.run(main())
