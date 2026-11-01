import {browser,context,visit}from'../audit-2026-11-01/lib.mjs';
import{writeFileSync}from'node:fs';import assert from'node:assert/strict';
const SHA='3bfcd5b8f5ce3fc2ac83c7377e070028158de743',DIR='/workspace/timberstore/work/social-frames',b=await browser(),rows=[];
async function dismiss(p){await p.evaluate(()=>{document.querySelector('[data-testid=buttonCookiesReject]')?.click();document.querySelector('.site-msg.information .js-close-information-msg')?.click()});}
async function icons(p){return p.locator('a[href*="facebook.com/timberstore"],a[href*="instagram.com/timberstore.sk"]').evaluateAll(es=>es.map(e=>{const svg=e.querySelector('svg.ts-social-icon'),s=svg&&getComputedStyle(svg),r=svg?.getBoundingClientRect();return{href:e.getAttribute('href'),kind:e.dataset.tsSocialBrand,count:e.querySelectorAll('svg').length,label:e.getAttribute('aria-label')||e.textContent.trim(),legacy:getComputedStyle(e,'::before').content,path:svg?.querySelector('path')?.getAttribute('d'),visible:!!r?.width,rect:r&&{width:r.width,height:r.height},style:s&&Object.fromEntries(['width','height','padding','borderWidth','borderColor','borderRadius','color','fill','stroke','strokeWidth','backgroundColor','backgroundImage'].map(k=>[k,s[k]]))}}));}
try{
 await Promise.all([375,1440].map(async width=>{
 const{c,errors}=await context(b,width),p=await c.newPage(),reference={};
 for(const path of ['/kontakty/','/profily-a-listy-k-pracovnym-doskam/','/hmozdinka-do-steny-10x60mm/','/kosik/','/']){
  await visit(p,path+'?ts_preview='+SHA);await dismiss(p);await p.waitForTimeout(400);
  const items=await icons(p);assert(items.length>=2);
  function verify(list){for(const i of list){assert(i.kind,JSON.stringify(i));assert.equal(i.count,1);assert(i.label);assert(['none','normal','""'].includes(i.legacy));assert.equal(i.style.width,'32px');assert.equal(i.style.height,'32px');assert.equal(i.style.borderRadius,'8px');assert.equal(i.style.borderWidth,'1px');assert.equal(i.style.borderColor,'rgb(229, 224, 218)');assert.equal(i.style.color,'rgb(212, 136, 74)');if(i.visible)assert.deepEqual(i.rect,{width:32,height:32});assert.equal(i.style.backgroundColor,'rgb(255, 255, 255)');assert.equal(i.style.backgroundImage,'none');if(reference[i.kind]){assert.deepEqual(i.style,reference[i.kind].style);assert.equal(i.path,reference[i.kind].path);}else reference[i.kind]=i;}}
  verify(items);
  assert(await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth<=2));
  await p.evaluate(()=>{for(let i=0;i<3;i++)document.dispatchEvent(new CustomEvent('ShoptetDOMPageContentLoaded'))});await p.waitForTimeout(200);verify(await icons(p));
  if(path==='/kontakty/'){
   if(width<768){await p.locator('a[data-testid=hamburgerMenu]').evaluate(e=>e.click());await p.waitForTimeout(350);assert(await p.evaluate(()=>document.body.classList.contains('navigation-window-visible')));verify(await icons(p));const menu=p.locator('#header .navigation-in-bottom .ts-menu-socials');assert(await menu.isVisible());await menu.screenshot({path:DIR+'/mobile-menu.png'});await p.locator('a[data-testid=hamburgerMenu]').evaluate(e=>e.click());}
   else{const a=p.locator('.ts-contact-socials a').first();await a.hover();await p.waitForTimeout(350);const hovered=await a.locator('svg').evaluate(e=>({color:getComputedStyle(e).color,bg:getComputedStyle(e).backgroundColor,border:getComputedStyle(e).borderColor}));assert.deepEqual(hovered,{color:'rgb(212, 136, 74)',bg:'rgb(255, 248, 241)',border:'rgb(212, 136, 74)'});await p.keyboard.press('Tab');await a.focus();assert.equal(await a.evaluate(e=>getComputedStyle(e).outlineWidth),'2px');await a.evaluate(e=>e.blur());await p.mouse.move(0,0);await p.locator('.top-navigation-bar').screenshot({path:DIR+'/desktop-header.png'});}
   await p.locator('.ts-contact-support').screenshot({path:DIR+'/contacts-'+width+'.png'});
   await p.locator('#footer .contact-box-icon-list').screenshot({path:DIR+'/footer-'+width+'.png'});
   assert.equal(await p.locator('#formContact').evaluate(e=>e.checkValidity()),false);
   // Rebuild just the native footer icon contents as Apollo may do; its existing
   // scoped observer must recover exactly one shared icon per original anchor.
   await p.locator('#footer a[data-testid=contactboxFacebook]').evaluate(e=>e.replaceChildren());await p.waitForTimeout(250);verify(await icons(p));
  }
  if(path==='/hmozdinka-do-steny-10x60mm/')assert.equal(await p.locator('.p-detail .add-to-cart-button').first().evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(212, 136, 74)');
  rows.push({width,path,pass:true,items});console.log(JSON.stringify({width,path,pass:true}));
 }
 if(width===1440){await visit(p,'/kontakty/?ts_preview='+SHA);for(const w of [768,1024,320,1440]){await p.setViewportSize({width:w,height:1000});await p.waitForTimeout(450);assert(await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth<=2));const is=await icons(p);for(const i of is.filter(i=>i.visible))assert.deepEqual(i.rect,{width:32,height:32});rows.push({resizedWidth:w,pass:true});}}
 rows.push({width,errors});assert.deepEqual(errors,[]);await c.close();
 }));
}finally{writeFileSync(DIR+'/cdn-qa.json',JSON.stringify({sha:SHA,rows},null,2));await b.close()}
