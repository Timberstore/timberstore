import { chromium } from '/opt/codex/cua_node/lib/node_modules/playwright/index.mjs';
import { readFileSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const sha=process.env.TS_QA_SHA||'a221c7affdf0c207953fe8d3cbe37cb13cd1bb42';
const published=!!process.env.TS_QA_SHA;
const url='https://www.timberstore.sk/spojovacia-lista-rohova-na-pracovnu-dosku-38-l-p-hlinik/?ts_preview='+sha;
const css=readFileSync('src/styles/overrides/product-downloads.css','utf8');
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
const cache=new Map(), blocked=new Set();
async function resource(u){
 if(!cache.has(u)) cache.set(u,(async()=>{const r=await fetch(u);const headers=Object.fromEntries(r.headers);delete headers['content-encoding'];delete headers['content-length'];return {status:r.status,headers,body:Buffer.from(await r.arrayBuffer())}})());
 return cache.get(u);
}
const results=[];
try{
for(const width of (process.env.TS_QA_WIDTHS?process.env.TS_QA_WIDTHS.split(',').map(Number):[320,375,390,768,1024,1440])){
 const mobile=width<768;
 const context=await browser.newContext({viewport:{width,height:1000},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:1});
 await context.route('**/*',async route=>{
  const u=route.request().url();
  // Never open attachment contents; all test clicks are captured before navigation.
  if(u.includes('demos24plus.com')){blocked.add(u);return route.abort();}
  if(!/^https?:/.test(u))return route.continue();
  try{return await route.fulfill(await resource(u))}catch{return route.abort()}
 });
 const page=await context.newPage();
 await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000});
 await page.waitForSelector('#relatedFiles .detail-tab-content',{state:'attached',timeout:30000});
 await page.waitForSelector('#relatedFiles.ts-downloads',{state:'attached',timeout:30000});
 const reject=page.locator('[data-testid=buttonCookiesReject]');if(await reject.isVisible()){await reject.click();await reject.waitFor({state:'hidden'});}
 const toggle=mobile?page.locator('#relatedFiles .js-detail-tab-item'):page.locator('.shp-tab-link[href="#relatedFiles"]');
 await toggle.click();
 await page.locator('#relatedFiles li a').first().waitFor({state:'visible'});
 await page.waitForTimeout(350);
 const before=await page.evaluate(()=>{
  const panel=document.querySelector('#relatedFiles');
  return {links:[...panel.querySelectorAll('li a')].map(a=>({name:a.querySelector('.ts-downloads__name').textContent,href:a.getAttribute('href')})),untouched:[...document.querySelectorAll('#description,#productDiscussion')].map(el=>({id:el.id,padding:getComputedStyle(el).padding,html:el.innerHTML})),oldPadding:{panel:getComputedStyle(panel).paddingBottom,body:getComputedStyle(panel.querySelector('.detail-tab-content')).paddingBottom}};
 });
 if(!published)await page.addStyleTag({content:css});
 const measurement=await page.evaluate(()=>{
  const panel=document.querySelector('#relatedFiles'),body=panel.querySelector('.detail-tab-content');
  const rows=[...panel.querySelectorAll('li a')].map(a=>{
   const r=a.getBoundingClientRect(),s=getComputedStyle(a),left=getComputedStyle(a,'::before'),right=getComputedStyle(a,'::after');
   return {width:r.width,height:r.height,grid:s.gridTemplateColumns,display:s.display,href:a.getAttribute('href'),name:a.querySelector('.ts-downloads__name').textContent,left:{width:left.width,height:left.height,mask:left.maskImage,border:left.borderWidth},right:{width:right.width,height:right.height,mask:right.maskImage,content:right.content},overflow:a.scrollWidth>a.clientWidth};
  });
  return {rows,padding:{panel:getComputedStyle(panel).paddingBottom,body:getComputedStyle(body).paddingBottom},viewportOverflow:document.documentElement.scrollWidth>innerWidth,untouched:[...document.querySelectorAll('#description,#productDiscussion')].map(el=>({id:el.id,padding:getComputedStyle(el).padding,html:el.innerHTML}))};
 });
 assert.equal(measurement.rows.length,2);assert.deepEqual(measurement.rows.map(({name,href})=>({name,href})),before.links);assert.deepEqual(measurement.untouched,before.untouched);
 assert.equal(measurement.viewportOverflow,false);
 for(const r of measurement.rows){assert(r.height>=56);assert(!r.overflow);assert(r.left.mask.includes('svg'));assert(r.right.mask.includes('svg'));assert.equal(r.left.border,'0px');assert.equal(r.right.content,'""');}
 assert.equal(measurement.padding[mobile?'body':'panel'],'16px');assert.equal(measurement.padding[mobile?'panel':'body'],'0px');
 // Dismiss the existing native information toast before testing underlying rows.
 const closeInfo=page.locator('.site-msg.information .js-close-information-msg');if(await closeInfo.isVisible()){await closeInfo.click();await page.waitForTimeout(350);}
 // Test the real tap/click path at both edges and text in each full-width anchor.
 await page.evaluate(()=>{window.tsQaClicks=[];document.addEventListener('click',e=>{const a=e.target.closest('#relatedFiles li a');if(a){e.preventDefault();e.stopImmediatePropagation();window.tsQaClicks.push(a.getAttribute('href'));}},true)});
 for(let index=0;index<2;index++){
  const row=page.locator('#relatedFiles li a').nth(index);await row.scrollIntoViewIfNeeded();
  await page.waitForTimeout(650);const box=await row.boundingBox();
  for(const x of [box.x+5,box.x+box.width/2,box.x+box.width-5]){
   if(mobile)await page.touchscreen.tap(x,box.y+box.height/2);else await page.mouse.click(x,box.y+box.height/2);
  }
 }
 const clicks=await page.evaluate(()=>window.tsQaClicks);if(clicks.length!==6){await page.screenshot({path:'work/downloads/polish/failure.png'});console.log(await page.evaluate(()=>({vw:innerWidth,vh:innerHeight,scrollY,rows:[...document.querySelectorAll('#relatedFiles li a')].map(a=>{const r=a.getBoundingClientRect();return {r:r.toJSON(),hit:document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.outerHTML.slice(0,500)}})})))};assert.deepEqual(clicks,[...Array(3).fill(before.links[0].href),...Array(3).fill(before.links[1].href)]);
 // Real desktop hover and keyboard focus styling.
 const first=page.locator('#relatedFiles li a').first();await first.scrollIntoViewIfNeeded();await page.waitForTimeout(650);await first.hover();await page.waitForTimeout(50);
 const hover=await first.evaluate(el=>getComputedStyle(el).backgroundColor);assert.notEqual(hover,'rgba(0, 0, 0, 0)');
 await first.focus();await page.keyboard.press('Shift+Tab');await page.keyboard.press('Tab');const focus=await first.evaluate(el=>({width:getComputedStyle(el).outlineWidth,style:getComputedStyle(el).outlineStyle}));assert.equal(focus.width,'2px');
 await page.locator('#relatedFiles').screenshot({path:`work/downloads/polish/${published?'cdn':'local'}-${width}.png`});
 // Browser-only long title; URL and shipped names are not changed.
 await first.locator('.ts-downloads__name').evaluate(el=>{el.textContent='Veľmi dlhý názov dokumentácie k produktu – '+('DlhýNázovBezMedzier'.repeat(12))});
 const long=await first.evaluate(el=>({overflow:el.scrollWidth>el.clientWidth,pageOverflow:document.documentElement.scrollWidth>innerWidth,height:el.getBoundingClientRect().height}));assert(!long.overflow&&!long.pageOverflow);assert(long.height>=measurement.rows[0].height);
 // Native toggle close/open: accordion on mobile, description/files on desktop.
 if(mobile){await toggle.click();assert.equal(await page.locator('#relatedFiles').evaluate(el=>el.classList.contains('active')),false);await toggle.click();}
 else {await page.locator('.shp-tab-link[href="#description"]').click();await page.waitForFunction(()=>document.querySelector('#description').classList.contains('active'));assert.equal(await page.locator('#description').evaluate(el=>el.classList.contains('active')),true);await toggle.click();}
 await page.waitForFunction(()=>document.querySelector('#relatedFiles').classList.contains('active'));
 assert.equal(await page.locator('#relatedFiles').evaluate(el=>el.classList.contains('active')),true);
 const row={width,mobile,pass:true,oldPadding:before.oldPadding,padding:measurement.padding,rows:measurement.rows,edgeAndTextClicks:clicks.length,hover,focus,long,nativeTabs:true,otherPanesUnchanged:true};results.push(row);console.log(JSON.stringify({width,pass:true,padding:row.padding,taps:clicks.length,longHeight:long.height}));
 await context.close();
}
assert.equal(blocked.size,0);
writeFileSync(`work/downloads/polish/${published?'cdn':'local'}-qa.json`,JSON.stringify({url,published,results,documentRequests:[...blocked],physicalIPhoneSafari:'NOT TESTED',note:'Chromium 151 desktop and mobile touch emulation; HTTPS resources fetched with Node using inherited proxy and CA trust, then fulfilled to browser to retain TLS validation. Local mode adds only candidate downloads CSS to prior preview; published mode uses immutable CDN assets unchanged.'},null,2));
}finally{await browser.close()}
