global.window=global;require('../data/modules.js');for(const f of require('fs').readdirSync(__dirname+'/../data').filter(f=>/^m\d/.test(f)).sort())require('../data/'+f);
const req=['id','m','t','st','per','why','ctx','body','ppl','tl','cause','cons','prev','next','today','terms','sum','quiz','open','src'];
const ids=new Set(LESSONS.map(l=>l.id));let words=0;
for(const l of LESSONS){const miss=req.filter(k=>!(k in l));if(miss.length)console.log(l.id,'missing',miss.join(','));
 l.quiz.forEach((q,i)=>{if(q.a<0||q.a>=q.o.length)console.log(l.id,'bad answer',i)});
 [...(l.prev||[]),...(l.next||[])].forEach(x=>{if(!ids.has(x))console.log(l.id,'bad ref',x)});
 const w=[l.ctx,l.body,l.today,l.debate||''].join(' ').split(/\s+/).length;words+=w;
 if(!l.debate)console.log(l.id,'no debate');
 console.log(l.id.padEnd(6),String(w).padStart(5),'w',l.quiz.length,'q',l.terms.length,'t',l.tl.filter(t=>t[3]).length,'key');}
console.log('total words',words,'lessons',LESSONS.length);
