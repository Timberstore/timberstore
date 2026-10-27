import asyncio,json,os
from pathlib import Path
from playwright.async_api import async_playwright
from regression import route,goto
base=Path(os.environ.get('TIMBER_CART_WORK', '/tmp/timberstore-cart-rc2'));results=[]
base.mkdir(parents=True, exist_ok=True)
async def main():
 async with async_playwright() as p:
  b=await p.chromium.launch(executable_path=os.environ.get('TIMBER_CHROMIUM', '/usr/bin/chromium'),proxy={'server':os.environ['HTTPS_PROXY']},args=['--no-sandbox'])
  for w in [320,375,768,1440]:
   page=await b.new_page(viewport={'width':w,'height':1000});await page.route('**/*',route)
   await goto(page,'/');await page.wait_for_timeout(500)
   # Use a real central-warehouse card, constrain only its stock width in this
   # browser fixture, and verify the last native label word shares the count line.
   info=await page.evaluate('''()=>{let a=[...document.querySelectorAll('.product .availability')].find(e=>/centr/i.test(e.innerText));a.style.width='118px';let label=a.querySelector('span:first-child'),count=a.querySelector('.availability-amount');let walker=document.createTreeWalker(label,4),last;while(walker.nextNode())if(walker.currentNode.textContent.trim())last=walker.currentNode;let m=last.textContent.match(/\\S+\\s*$/),r=document.createRange();r.setStart(last,m.index);r.setEnd(last,m.index+m[0].trimEnd().length);let word=r.getBoundingClientRect(),c=count.getBoundingClientRect();return {label:label.textContent,count:count.textContent,wordY:word.y,countY:c.y,wordBottom:word.bottom,countBottom:c.bottom,space:count.previousSibling.textContent,wordRight:word.right,countX:c.x,width:a.getBoundingClientRect().width}}''')
   assert info['space']=='\u00a0' and info['countX']>=info['wordRight']-1 and abs(info['wordBottom']-info['countBottom'])<5,info
   await goto(page,'/franke-drez-bfg-611-970x500mm-cierna-matna/')
   rec=await page.evaluate('''()=>[...document.querySelectorAll('.products-related-block .product,.products-alternative-block .product')].map(e=>{let strong=e.querySelector('.price-final>strong'),n=e.querySelector('a.name'),c=strong.cloneNode(true);for(let span of c.querySelectorAll('.ts-price-number'))span.replaceWith(...span.childNodes);strong.after(c);let before=getComputedStyle(c).color; c.remove();return {alternative:!!e.closest('.products-alternative-block'),color:getComputedStyle(strong).color,beforeCleanupColor:before,align:getComputedStyle(n).textAlign}})''')
   assert any(x['alternative'] for x in rec) and rec,rec
   assert all(x['color']==x['beforeCleanupColor']=='rgb(36, 84, 166)' and x['align']=='left' for x in rec),rec
   results.append({'width':w,'stock':info,'recommendations':rec,'pass':True});(base/'stock-price-results.json').write_text(json.dumps(results,indent=2));print('PASS central stock last-word + amount and static related/similar prices',w,flush=True)
   await page.close()
  await b.close()
asyncio.run(main())
