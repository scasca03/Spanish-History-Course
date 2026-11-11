const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1400,height:900}});
const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push('CONSOLE '+m.text())});
const f='file://'+process.argv[2];
await p.goto(f+'#inicio');await p.waitForTimeout(500);
const ids=await p.evaluate(()=>LESSONS.map(l=>l.id));
const routes=['inicio','cronologia','atlas','dinastias','instituciones','constituciones','presidentes','datos','personajes','glosario','no-entiendo','conexiones','tarjetas','estudio','pendientes','metodo','modulo-1'].concat(ids);
for(const r of routes){await p.evaluate(h=>location.hash=h,r);await p.waitForTimeout(60);
 const t=await p.evaluate(()=>document.querySelector('#view').innerText.length);
 const bad=await p.evaluate(()=>[...document.querySelectorAll('[data-viz]')].filter(e=>!e.innerHTML.trim()||/No se pudo/.test(e.innerHTML)).map(e=>e.dataset.viz));
 const broken=await p.evaluate(()=>[...document.querySelectorAll('#view a[href^="#"]')].map(a=>a.getAttribute('href').slice(1)).filter(h=>h&&!/^s-/.test(h)));
 if(t<200||bad.length)console.log('ROUTE',r,'len',t,'badviz',bad);
 for(const h of broken){const ok=await p.evaluate(h=>!!(window.LESSONS.find(l=>l.id===h))||['inicio','cronologia','atlas','dinastias','instituciones','constituciones','presidentes','datos','personajes','glosario','no-entiendo','conexiones','tarjetas','estudio','pendientes','metodo'].includes(h)||/^modulo-\d+$/.test(h),h); if(!ok)console.log('BROKEN LINK in',r,'->',h);}
}
console.log('lessons',ids.length);console.log(errs.slice(0,20).join('\n')||'no errors');
if(process.argv[3]){for(const [r,w,n] of [['m2-4',1400,'a'],['atlas',1400,'b'],['m7-4',390,'c'],['inicio',1400,'d']]){await p.setViewportSize({width:w,height:900});await p.evaluate(h=>location.hash=h,r);await p.waitForTimeout(300);await p.screenshot({path:process.argv[3]+'/shot-'+n+'.png'});}}
await b.close()})();
