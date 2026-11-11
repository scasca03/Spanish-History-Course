const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const S=process.argv[3];
for(const [r,w,n,dark,scroll] of JSON.parse(process.argv[4])){const p=await b.newPage({viewport:{width:w,height:900},colorScheme:dark?'dark':'light'});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.argv[2]+'#'+r);await p.waitForTimeout(400);
if(scroll){await p.evaluate(s=>{const el=document.querySelector(s);if(el)el.scrollIntoView();},scroll);await p.waitForTimeout(200);}
await p.screenshot({path:S+'/v-'+n+'.png'});if(errs.length)console.log(n,errs);await p.close();}
await b.close()})();
