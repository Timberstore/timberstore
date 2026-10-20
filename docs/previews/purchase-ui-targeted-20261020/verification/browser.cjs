const {chromium,devices}=require(process.env.PLAYWRIGHT_CORE||'/opt/codex/cua_node/lib/node_modules/playwright-core');
const {execFile,execFileSync}=require('child_process'),fs=require('fs/promises');
const repoRoot=require('path').resolve(__dirname,'../../../..');
let seq=0;const cache=new Map();
exports.open=async(opts={})=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const context=await browser.newContext({serviceWorkers:"block",javaScriptEnabled:opts.javaScriptEnabled!==false,...opts.mobile?{isMobile:true,hasTouch:true,userAgent:devices['Pixel 5'].userAgent}:{},viewport:{width:opts.width||1440,height:opts.height||1000}});
 const errors=[],requests=[];
 await context.route('**/*',async route=>{
  const req=route.request(),url=req.url(),host=new URL(url).host;
  if(host==='friends.shopcode.cz'&&opts.fixture){await page.waitForFunction(()=>document.querySelector('.p-info-grid'),null,{polling:100,timeout:30000});return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(opts.fixture)})}
  if(!['www.timberstore.sk','cdn.myshoptet.com','cdn.jsdelivr.net','fonts.googleapis.com','fonts.gstatic.com','765909.myshoptet.com','shoptet.webotvurci.cz'].includes(host)){errors.push({excludedExternal:url});return route.abort()}
  if(!opts.cdn&&/\/timber\.min\.(css|js)(\?|$)/.test(url)){const ext=/\.css(?:\?|$)/.test(url)?'css':'js';const body=opts.baseline?execFileSync('git',['show','ff681ac9c1f789e4a848cd5ac13bf7d6d49478f8:dist/timber.min.'+ext],{cwd:repoRoot}):await fs.readFile(repoRoot+'/dist/timber.min.'+ext);return route.fulfill({status:200,contentType:ext==='css'?'text/css':'application/javascript',body})}
  const base='/tmp/header-fetch-'+process.pid+'-'+(++seq);const cacheable=req.method()==='GET'&&(host!=='www.timberstore.sk'||/\.(css|js|woff2?|ttf|jpe?g|png|svg|webp)(\?|$)/.test(url));
  try{
   let result=cacheable&&cache.get(url);
   if(!result){const headers=req.headers(),cookies=await context.cookies(url);if(cookies.length)headers.cookie=cookies.map(c=>c.name+'='+c.value).join('; ');const args=['--silent','--show-error','--max-time','40','--dump-header',base+'.headers','--output',base+'.body'];for(const [k,v]of Object.entries(headers))if(!['host','content-length','connection','accept-encoding'].includes(k))args.push('--header',k+': '+v);if(req.method()!=='GET')args.push('--request',req.method());if(req.postDataBuffer())args.push('--data-binary','@-');args.push(url);await new Promise((resolve,reject)=>{const p=execFile('curl',args,{maxBuffer:100000},e=>e?reject(e):resolve());p.stdin.end(req.postDataBuffer()||undefined)});const raw=await fs.readFile(base+'.headers','utf8'),body=await fs.readFile(base+'.body'),lines=raw.trim().split(/\r?\n\r?\n/).at(-1).split(/\r?\n/),status=+lines.shift().split(' ')[1],out={};for(const l of lines){const i=l.indexOf(':');if(i>0&&!/^(content-encoding|content-length|transfer-encoding|set-cookie)$/i.test(l.slice(0,i)))out[l.slice(0,i).toLowerCase()]=l.slice(i+1).trim()}const set=lines.filter(l=>/^set-cookie:/i.test(l)).map(l=>{let s=l.slice(l.indexOf(':')+1).trim().split(';')[0],i=s.indexOf('=');return{name:s.slice(0,i),value:s.slice(i+1),url:new URL(url).origin}});if(set.length)await context.addCookies(set);result={status,headers:out,body};if(cacheable&&status===200)cache.set(url,result)}
   requests.push({url,status:result.status,type:req.resourceType()});
   if([301,302,303].includes(result.status)&&req.resourceType()==='document'&&result.headers.location){
    const destination=new URL(result.headers.location,url);
    if(destination.protocol!=='https:'||destination.host!=='www.timberstore.sk')throw new Error('Unexpected navigation redirect host');
    const safe=destination.href.replaceAll('&','&amp;').replaceAll('"','&quot;');
    return route.fulfill({status:200,contentType:'text/html',body:'<meta http-equiv="refresh" content="0;url='+safe+'">'});
   }
   await route.fulfill(result);
  }catch(e){errors.push({url,error:e.message.slice(0,140)});await route.abort()}finally{await Promise.allSettled([fs.unlink(base+'.headers'),fs.unlink(base+'.body')])}
 });const page=await context.newPage();page.on('pageerror',e=>errors.push({pageError:e.message,pageUrl:page.url(),stack:e.stack?.slice(0,350)}));return{browser,context,page,errors,requests};
};
