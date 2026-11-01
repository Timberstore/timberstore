import {browser,context,visit} from '../audit-2026-11-01/lib.mjs';
import {readFileSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const ROOT='/workspace/timberstore/work/audit-preview',DIR='/workspace/timberstore/work/audit-preview-evidence';
const sha=process.env.TS_AUDIT_SHA||'6f13da714479107b73ff453b40d3336841ac56cc',live=!!process.env.TS_AUDIT_SHA;
const b=await browser(),out=[];
async function dismiss(p){await p.evaluate(()=>{document.querySelector('[data-testid=buttonCookiesReject]')?.click();document.querySelector('.site-msg.information .js-close-information-msg')?.click()});await p.waitForTimeout(150)}

function ratio(a,b){const lum=c=>{const v=c.match(/[\d.]+/g).slice(0,3).map(Number).map(x=>{x/=255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4});return v[0]*.2126+v[1]*.7152+v[2]*.0722};const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
try {
 for(const width of [375,1440,320,1024]){
  const {c,errors,blocked}=await context(b,width);
  if(!live)await c.route('**/dist/timber.min.*',route=>{const ext=route.request().url().match(/timber\.min\.(js|css)(?:\?|$)/)?.[1];return ext?route.fulfill({contentType:ext==='js'?'application/javascript':'text/css',body:readFileSync(ROOT+'/dist/timber.min.'+ext)}):route.fallback()});
  const p=await c.newPage();
  const paths=width===320||width===1024?['/kontakty/']:['/kontakty/','/doprava-a-platba/','/obchodne-podmienky/','/reklamacny-poriadok/','/hmozdinka-do-steny-10x60mm/','/','/profily-a-listy-k-pracovnym-doskam/'];
  for(const path of paths){
   await visit(p,path+'?ts_preview='+sha+'&ts_contrast=copper');await dismiss(p);
   const base=await p.evaluate(()=>({version:Timber.version,preview:TimberLoader.preview,variant:document.documentElement.dataset.tsContrast,overflow:document.documentElement.scrollWidth-innerWidth,h1:[...document.querySelectorAll('h1')].map(e=>e.textContent.trim())}));
   assert(base.preview);assert.equal(base.variant,'copper');assert(base.overflow<=2,JSON.stringify({path,width,base}));
   const data={path,width,...base};
   if(path==='/')assert.deepEqual(base.h1,['Nábytkové kovanie a príslušenstvo']);
   if(path==='/kontakty/'){
    data.contact=await p.evaluate(()=>{const f=document.querySelector('#formContact'),a=document.querySelector('.ts-contact-page');return{forms:a.querySelectorAll('#formContact').length,action:f.getAttribute('action'),method:f.method,inputs:[...f.querySelectorAll('input,textarea')].map(e=>({name:e.name,type:e.type,required:e.required,value:e.type==='hidden'?e.value:undefined})),valid:f.checkValidity(),hours:a.querySelectorAll('.ts-service-bar__hours').length,hoursText:a.querySelector('.ts-service-bar__hours').textContent,company:a.querySelector('.ts-contact-company').textContent,links:[...a.querySelectorAll('a')].map(e=>({href:e.getAttribute('href'),text:e.textContent.trim()})),captcha:!!f.querySelector('[name="captcha"]'),consent:!!f.querySelector('[name="consents[]"]'),h1:a.querySelectorAll('h1').length,columns:getComputedStyle(a.querySelector('.ts-contact-grid')).gridTemplateColumns}});
    assert.equal(data.contact.forms,1);assert.equal(data.contact.action,'/action/MailForm/SendEmail/');assert.equal(data.contact.method,'post');assert.equal(data.contact.valid,false);assert.equal(data.contact.hours,1);assert(data.contact.captcha&&data.contact.consent);assert(data.contact.company.includes('56 039 921'));assert(data.contact.company.includes('SK2122201609'));assert(data.contact.company.includes('DIČ: 2122201609'));assert.equal(data.contact.h1,1);
    await p.evaluate(()=>{window.tsAuditForm=document.querySelector('#formContact');window.tsAuditFields=[...tsAuditForm.querySelectorAll('input,textarea')];for(let i=0;i<3;i++)document.dispatchEvent(new CustomEvent('ShoptetDOMPageContentLoaded'))});
    assert(await p.evaluate(()=>tsAuditForm===document.querySelector('#formContact')&&tsAuditFields.every(e=>e.isConnected)&&document.querySelectorAll('.ts-contact-grid').length===1));
    await p.keyboard.press('Tab');await p.locator('.ts-contact-link').first().focus();assert.equal(await p.locator('.ts-contact-link').first().evaluate(e=>getComputedStyle(e).outlineWidth),'2px');
    await p.locator('.ts-contact-link').first().evaluate(e=>e.blur());await dismiss(p);
    await p.screenshot({path:DIR+`/${live?'cdn':'local'}-contacts-${width}.png`,fullPage:true,timeout:15000});
   }
   if(['/doprava-a-platba/','/obchodne-podmienky/','/reklamacny-poriadok/'].includes(path)){
    assert.equal(base.h1.length,1);
    data.headings=await p.locator('.pageArticleDetail h1,.pageArticleDetail h2,.pageArticleDetail h3').evaluateAll(es=>es.map(e=>({tag:e.tagName,text:e.textContent.trim()})));
    assert(data.headings.some(e=>e.tag==='H2'));
    if(path==='/doprava-a-platba/')assert(data.headings.some(e=>e.tag==='H3'&&e.text==='Tovar skladom'));
   }
   if(path==='/hmozdinka-do-steny-10x60mm/'){
    data.brand=await p.locator('[data-testid=productCardBrandName]').evaluateAll(es=>es.map(e=>({tag:e.tagName,text:e.textContent,href:e.getAttribute('href')})));
    assert(data.brand.length>=1);assert(data.brand.every(e=>e.text.includes('Timber Store')&&!e.text.includes('N/A')&&!e.href));
    assert.equal(await p.locator('[itemprop=brand] meta[itemprop=name]').first().getAttribute('content'),'Timber Store');
    data.colors=[];
    for(const variant of ['copper','ink']){
     await visit(p,path+'?ts_preview='+sha+'&ts_contrast='+variant);await dismiss(p);
     const btn=p.locator('.p-detail .add-to-cart-button').first();
     for(const state of ['normal','hover','focus']){
      if(state==='hover'&&width>=768)await btn.hover();
      if(state==='focus')await btn.focus();
      await p.waitForTimeout(350);
      const s=await btn.evaluate(e=>({fg:getComputedStyle(e).color,bg:getComputedStyle(e).backgroundColor,outline:getComputedStyle(e).outlineWidth,icon:getComputedStyle(e,'::after').color,disabled:e.disabled}));s.ratio=ratio(s.fg,s.bg);assert(s.ratio>=4.5,JSON.stringify({width,variant,state,s}));data.colors.push({variant,state,...s});
     }
     await btn.scrollIntoViewIfNeeded();await p.locator('.p-info-wrapper').screenshot({path:DIR+`/${live?'cdn':'local'}-${variant}-${width}.png`,timeout:15000});
    }
   }
   out.push(data);console.log(JSON.stringify({width,path,pass:true}));
  }
  out.push({width,errors,blocked:blocked.filter(e=>!['scripts.luigisbox.tech','friends.shopcode.cz','www.heureka.sk','cdnjs.cloudflare.com'].includes(e.host))});await c.close();
 }
}finally{writeFileSync(DIR+`/${live?'cdn':'local'}-qa.json`,JSON.stringify({live,sha,results:out},null,2));await b.close();}
