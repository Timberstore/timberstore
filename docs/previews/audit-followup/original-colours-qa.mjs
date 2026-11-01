import {browser,context,visit} from '../audit-2026-11-01/lib.mjs';
import {writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const SHA='2e3f454619984b7326e89373697e1ee706c0031b',DIR='/workspace/timberstore/work/audit-original-colours';
const b=await browser(),rows=[];
async function dismiss(p){await p.evaluate(()=>{document.querySelector('[data-testid=buttonCookiesReject]')?.click();document.querySelector('.site-msg.information .js-close-information-msg')?.click()});}
async function paint(p,selector){return p.locator(selector).first().evaluate(e=>{const s=getComputedStyle(e);return{color:s.color,background:s.backgroundColor,border:s.borderTopColor}})}
async function buttonPaint(p,selector){const result={normal:await paint(p,selector)};if(p.viewportSize().width>=768){await p.locator(selector).first().hover();await p.waitForTimeout(350);result.hover=await paint(p,selector);await p.mouse.move(0,0);}return result;}
async function info(p){return{footer:await paint(p,'#footer .custom-footer__articles a'),footerIcon:await paint(p,'#footer .mail svg'),footerCTA:await buttonPaint(p,'#footer .custom-footer__contact a.btn')}}
try{
 await Promise.all([375,1440].map(async width=>{
  const {c,errors}=await context(b,width),p=await c.newPage();
  await c.addInitScript(()=>sessionStorage.setItem('ts-audit-contrast','copper'));
  await visit(p,'/kontakty/?ts_preview=off');await dismiss(p);
  const original={form:await buttonPaint(p,'#formContact button[type=submit]'),...await info(p)};
  await visit(p,'/kontakty/?ts_preview='+SHA+'&ts_contrast=copper');await dismiss(p);
  assert.equal(await p.locator('html').getAttribute('data-ts-contrast'),null);
  const current={form:await buttonPaint(p,'#formContact button[type=submit]'),...await info(p)};
  assert.deepEqual(current,original);
  assert.equal((await paint(p,'.ts-contact-link svg')).color,original.footerIcon.color);
  const contact=await p.evaluate(()=>({hours:document.querySelectorAll('.ts-contact-page .ts-service-bar__hours').length,hoursText:document.querySelector('.ts-contact-page .ts-service-bar__hours').textContent,company:document.querySelector('.ts-contact-company').textContent,valid:document.querySelector('#formContact').checkValidity(),action:document.querySelector('#formContact').getAttribute('action'),overflow:document.documentElement.scrollWidth-innerWidth}));
  assert.equal(contact.hours,1);assert(contact.company.includes('DIČ: 2122201609'));assert.equal(contact.valid,false);assert.equal(contact.action,'/action/MailForm/SendEmail/');assert(contact.overflow<=2);
  await p.evaluate(()=>{window.tsOriginalForm=document.querySelector('#formContact');for(let i=0;i<3;i++)document.dispatchEvent(new CustomEvent('ShoptetDOMPageContentLoaded'))});assert(await p.evaluate(()=>tsOriginalForm===document.querySelector('#formContact')&&document.querySelectorAll('.ts-contact-grid').length===1));
  await p.mouse.move(0,0);await dismiss(p);await p.screenshot({path:DIR+'/contacts-'+width+'.png',fullPage:true});
  rows.push({width,path:'/kontakty/',pass:true,original,current,contact,iconsMatchOriginalOrange:true,staleVariantIgnored:true});
  await visit(p,'/hmozdinka-do-steny-10x60mm/?ts_preview=off');await dismiss(p);
  const originalProduct={button:await buttonPaint(p,'.p-detail .add-to-cart-button'),stock:await paint(p,'.availability-label')};
  await visit(p,'/hmozdinka-do-steny-10x60mm/?ts_preview='+SHA+'&ts_contrast=ink');await dismiss(p);
  const currentProduct={button:await buttonPaint(p,'.p-detail .add-to-cart-button'),stock:await paint(p,'.availability-label')};assert.deepEqual(currentProduct,originalProduct);
  assert.equal(await p.locator('html').getAttribute('data-ts-contrast'),null);assert(await p.locator('[data-testid=productCardBrandName]').first().textContent().then(t=>t.includes('Timber Store')));
  rows.push({width,path:'/hmozdinka-do-steny-10x60mm/',pass:true,originalProduct,currentProduct});
  if(width===1440){
   for(const path of ['/doprava-a-platba/','/obchodne-podmienky/','/reklamacny-poriadok/']){
    const snapshot=()=>p.locator('.pageArticleDetail').evaluate(e=>({text:e.textContent,headings:[...e.querySelectorAll('header h1,.ts-audit-heading,h1,h2,h3,h4')].map(h=>({text:h.textContent,style:['fontSize','fontWeight','lineHeight','marginTop','marginBottom','color'].map(k=>getComputedStyle(h)[k])})),h1:e.querySelectorAll('h1').length}));
    await visit(p,path+'?ts_preview=off');const old=await snapshot();await visit(p,path+'?ts_preview='+SHA);const updated=await snapshot();assert.equal(updated.h1,1);assert.equal(old.text,updated.text);assert.deepEqual(updated.headings,old.headings);rows.push({width,path,pass:true,textAndHeadingSizesColoursIdentical:true,h1Before:old.h1,h1After:1});
   }
   await visit(p,'/?ts_preview='+SHA);assert.equal(await p.locator('h1').count(),1);assert.equal(await p.locator('h1').textContent(),'Nábytkové kovanie a príslušenstvo');rows.push({path:'/',pass:true});
  }
  rows.push({width,errors});assert.deepEqual(errors,[]);await c.close();console.log(JSON.stringify({width,pass:true}));
 }));
}finally{writeFileSync(DIR+'/cdn-qa.json',JSON.stringify({sha:SHA,rows},null,2));await b.close()}
