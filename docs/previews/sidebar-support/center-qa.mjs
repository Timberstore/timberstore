import { chromium } from '/opt/codex/cua_node/lib/node_modules/playwright/index.mjs';
import {readFileSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const root='/workspace/timberstore/work/downloads/polish-checkout';
const sha=process.env.TS_SIDEBAR_SHA||'752288c3769810da9b3276579c1a6bc7c587546f';
const live=!!process.env.TS_SIDEBAR_SHA;
const path='/profily-a-listy-k-pracovnym-doskam/';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
const cache=new Map();
async function resource(url){if(!cache.has(url))cache.set(url,(async()=>{const r=await fetch(url);const headers=Object.fromEntries(r.headers);delete headers['content-encoding'];delete headers['content-length'];return {status:r.status,headers,body:Buffer.from(await r.arrayBuffer())}})());return cache.get(url)}
const results=[];
try{
 for(const width of [375,768,1024,1280,1440]){
  const mobile=width<768;const context=await browser.newContext({viewport:{width,height:1000},isMobile:mobile,hasTouch:mobile});
  await context.route('**/*',async route=>{const url=route.request().url();if(!/^https?:/.test(url))return route.continue();try{
   const match=url.match(/cdn\.jsdelivr\.net\/gh\/Timberstore\/timberstore@[^/]+\/dist\/timber\.min\.(js|css)(?:\?|$)/);
   if(match&&!live)return route.fulfill({contentType:match[1]==='js'?'application/javascript':'text/css',body:readFileSync(root+'/dist/timber.min.'+match[1])});
   return route.fulfill(await resource(url));
  }catch{return route.abort()}});
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(String(e)));
  await page.goto('https://www.timberstore.sk'+path+'?ts_preview='+sha,{waitUntil:'domcontentloaded',timeout:45000});
  await page.waitForSelector('.sidebar-inner .timber-support.ts-sidebar-support',{state:'attached',timeout:30000});
  await page.waitForFunction(()=>document.body.classList.contains('after-load'));
  const reject=page.locator('[data-testid=buttonCookiesReject]');if(await reject.isVisible()){await reject.click();await reject.waitFor({state:'hidden'})}
  const close=page.locator('.site-msg.information .js-close-information-msg');if(await close.isVisible())await close.click();
  const component=page.locator('.sidebar-inner .timber-support').first();
  const data=await component.evaluate(el=>{
   const c=el.querySelector('.support__contact'),h=c.querySelector('.ts-service-bar__hours');
   return {children:[...c.children].map(x=>x.textContent.trim()),hours:c.querySelectorAll('.ts-service-bar__hours').length,icons:c.querySelectorAll('svg').length,open:h.dataset.open,hoursAria:h.getAttribute('aria-label'),links:[...c.querySelectorAll('a')].map(a=>({href:a.getAttribute('href'),text:a.textContent.trim(),icon:a.querySelectorAll('svg').length})),cta:el.querySelector('.timber-support-btn').getAttribute('href'),ctaText:el.querySelector('.timber-support-btn').textContent,apollo:el.closest('.banner')?.classList.contains('box-support'),overflow:c.scrollWidth>c.clientWidth,heading:el.querySelector('.support__title').textContent};
  });
  assert.deepEqual(data.children,['PO – PIA (08:00 – 16:00)','info@timberstore.sk','+421 904 479 842']);assert.equal(data.hours,1);assert.equal(data.icons,2);assert.equal(data.apollo,true);assert.equal(data.cta,'/kontakty');assert.equal(data.ctaText,'Napíšte nám');assert.equal(data.heading,'Sme tu pre vás');assert.equal(data.overflow,false);
  assert.deepEqual(data.links.map(x=>x.href),['mailto:info@timberstore.sk','tel:+421904479842']);assert(data.links.every(x=>x.icon===1));
  const statuses=await page.locator('.ts-service-bar__hours').evaluateAll(els=>els.map(e=>e.dataset.open));assert(statuses.every(s=>s===data.open));
  const visible=await component.isVisible();assert.equal(visible,width>=1200);
  await page.evaluate(()=>{for(let i=0;i<3;i++)document.dispatchEvent(new CustomEvent('ShoptetDOMPageContentLoaded'))});
  assert.equal(await component.locator('.ts-service-bar__hours').count(),1);assert.equal(await component.locator('.support__contact svg').count(),2);
  if(visible){
   await component.scrollIntoViewIfNeeded();await page.waitForTimeout(650);
   await component.screenshot({path:`/workspace/timberstore/work/sidebar-support/${live?'cdn':'local'}-${width}.png`});
   await page.evaluate(()=>{window.tsContactClicks=[];document.addEventListener('click',e=>{const a=e.target.closest('.ts-sidebar-support a');if(a){e.preventDefault();e.stopImmediatePropagation();window.tsContactClicks.push(a.getAttribute('href'))}},true)});
   for(const a of await component.locator('a').all())await a.click();
   assert.deepEqual(await page.evaluate(()=>window.tsContactClicks),['mailto:info@timberstore.sk','tel:+421904479842','/kontakty']);
   await component.locator('a[href^="mailto:"]').focus();await page.keyboard.press('Shift+Tab');await page.keyboard.press('Tab');
   assert.equal(await component.locator('a[href^="mailto:"]').evaluate(el=>getComputedStyle(el).outlineWidth),'2px');
  }
  if(visible){
   const centered=await component.evaluate(el=>{
    const box=el.getBoundingClientRect(),center=box.x+box.width/2;
    const texts=[...el.querySelectorAll('.support__item,.ts-service-bar__hours')].map(x=>{const r=x.getBoundingClientRect(),s=getComputedStyle(x);return {text:x.textContent.trim(),size:s.fontSize,weight:s.fontWeight,centerOffset:Math.abs(r.x+r.width/2-center)}});
    const b=el.querySelector('.timber-support-btn').getBoundingClientRect();
    return {texts,align:getComputedStyle(el).textAlign,buttonOffset:Math.abs(b.x+b.width/2-center),subtitleWeight:getComputedStyle(el.querySelector('.support__subtitle')).fontWeight};
   });
   assert.equal(centered.align,'center');assert.equal(centered.subtitleWeight,'700');assert(centered.buttonOffset<1);
   for(const row of centered.texts){assert.equal(row.size,'15px');assert.equal(row.weight,'700');assert(row.centerOffset<1);}
  }
  // Restore native banner inner markup as Apollo/admin refresh might do. The
  // component-scoped observer must enrich it again without replacing the root.
  await component.evaluate(el=>{el.innerHTML='<div class="support__content"><div class="support__title">Sme tu pre vás</div><div class="support__contact"><a class="support__item" href="mailto:info@timberstore.sk">info@timberstore.sk</a><a class="support__item" href="tel:+421904479842">+421904 479 842</a></div><a class="btn timber-support-btn" href="/kontakty">Kontaktný formulár</a></div>'});
  await page.waitForFunction(()=>document.querySelector('.ts-sidebar-support .support__contact')?.querySelectorAll('svg').length===2);
  assert.equal(await component.locator('.ts-service-bar__hours').count(),1);
  assert.equal(await page.locator('#footer .ts-footer-contacts__hours').count(),1);
  assert.equal(await page.locator('#footer .mail a').first().getAttribute('href'),'mailto:info@timberstore.sk');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  const row={width,mobile,visible,pass:true,data,statusesMatch:true,idempotent:true,nativeMarkupRefresh:true,footerUnchanged:true,errors};results.push(row);console.log(JSON.stringify({width,visible,pass:true,errors}));await context.close();
 }
 writeFileSync('/workspace/timberstore/work/sidebar-support/'+(live?'center-cdn':'center-local')+'-qa.json',JSON.stringify({verifiedAt:new Date().toISOString(),previewSha:sha,localOverrides:!live,results,physicalIPhoneSafari:'NOT TESTED',note:'Chromium mobile/touch emulation. HTTPS resources fetched with inherited proxy and CA trust; browser route fulfills verified TLS responses. Local mode only replaces Timber CSS/JS; CDN mode uses immutable remote assets unchanged.'},null,2));
}finally{await browser.close()}
