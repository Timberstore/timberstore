import asyncio,json,os
from pathlib import Path
from playwright.async_api import async_playwright
from regression import route,goto,measure
base=Path(os.environ.get('TIMBER_CART_WORK','/tmp/timberstore-cart-rc1'));base.mkdir(parents=True,exist_ok=True);rows=[]
async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(executable_path=os.environ.get('TIMBER_CHROMIUM','/usr/bin/chromium'),proxy=({'server':os.environ['HTTPS_PROXY']} if os.environ.get('HTTPS_PROXY') else None),args=['--no-sandbox'])
  for w in [375,1440]:
   c=await browser.new_context(viewport={'width':w,'height':1000});page=await c.new_page();errors=[]
   page.on('pageerror',lambda e:errors.append(str(e)));await page.route('**/*',route)
   await goto(page,'/vyhladavanie/?string=15021')
   form=page.locator('#products .product').filter(has=page.locator('.p-code',has_text='15021')).first.locator('form.pr-action')
   await page.wait_for_function('document.querySelector("#products .ts-qty__value")?.value==="10"')
   await form.locator('.ts-qty__btn--plus').click();assert await form.locator('[name=amount]').input_value()=='20'
   await form.locator('.ts-qty__btn--minus').click();assert await form.locator('[name=amount]').input_value()=='10'
   fixture=await form.evaluate('''async f=>{let c=f.closest('.product').cloneNode(true);c.id='test-pack-clone';let form=c.querySelector('form'),amount=form.querySelector('[name=amount]');amount.value='10';amount.setAttribute('value','10');amount.min='10';amount.max='20000';amount.step='10';document.querySelector('#products').append(c);await new Promise(requestAnimationFrame);let field=form.querySelector('.ts-qty__value'),plus=form.querySelector('.ts-qty__btn--plus');field.value='10000';field.dispatchEvent(new Event('change',{bubbles:true}));let typed=amount.value;plus.click();let increased=amount.value;field.value='10001';field.dispatchEvent(new Event('change',{bubbles:true}));let rounded=amount.value;field.value='999999';field.dispatchEvent(new Event('change',{bubbles:true}));let limited=amount.value;let out={typed,increased,rounded,limited,oneAmount:new FormData(form).getAll('amount').length,onePicker:form.querySelectorAll('.ts-qty').length,min:amount.min,max:amount.max,step:amount.step};c.remove();return out}''')
   assert fixture=={'typed':'10000','increased':'10010','rounded':'10010','limited':'20000','oneAmount':1,'onePicker':1,'min':'10','max':'20000','step':'10'},fixture
   await goto(page,'/spojovaci-material/')
   await page.evaluate('''()=>{window.frameResults=[];window.ajaxEvents=0;document.addEventListener('ShoptetDOMPageContentLoaded',()=>window.ajaxEvents++);window.watchQuantities=true;let tick=()=>{let fs=[...document.querySelectorAll('#products .product form.pr-action')];window.frameResults.push(fs.filter(f=>!f.querySelector('.ts-qty,.quantity')).length);if(window.watchQuantities)requestAnimationFrame(tick)};tick()}''')
   if w<768:await page.locator('.ts-mobile-category__button[data-ts-panel=sorting]').click()
   await page.locator('.listSorting__control[data-sort=price]').click();await page.wait_for_function('window.ajaxEvents>=1')
   qty=await page.evaluate(measure);assert all(x['inside'] and x['available']>=x['needed'] for x in qty)
   # Native enabled filter click preserves its delegated AJAX path, independently of display wrappers.
   checkbox=page.locator('#filters input[type=checkbox]:enabled').first
   previous=await page.evaluate('window.ajaxEvents')
   await checkbox.evaluate('(e)=>e.click()');await page.wait_for_function('(n)=>window.ajaxEvents>n',arg=previous)
   qty=await page.evaluate(measure);assert qty and all(x['inside'] and x['available']>=x['needed'] for x in qty)
   frames=await page.evaluate('()=>{window.watchQuantities=false;return window.frameResults}')
   assert all(n==0 for n in frames),frames
   assert not errors,errors
   rows.append({'width':w,'nativePack':[10,20,10],'cloneFiveDigitAndBounds':fixture,'nativeContentEvents':await page.evaluate('window.ajaxEvents'),'ajaxFrames':len(frames),'missing':sum(frames),'filterQuantities':len(qty),'errors':errors});(base/'ajax-pack-results.json').write_text(json.dumps(rows,indent=2)+'\n')
   print('PASS native packs, cloned five digits/bounds, AJAX sort/filter',w,flush=True);await c.close()
  await browser.close()
asyncio.run(main())
