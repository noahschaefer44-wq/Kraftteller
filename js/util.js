/* Hilfsfunktionen, Zustand und Speicher */
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const eur=n=>n.toLocaleString('de-DE',{minimumFractionDigits:2,maximumFractionDigits:2})+' €';
const eur0=n=>eur(n).replace(',00',',–');
const num=n=>Math.round(n).toLocaleString('de-DE');
const one=n=>(Math.round(n*10)/10).toLocaleString('de-DE');
const store={
  get(k,d){try{const v=localStorage.getItem('kt.'+k);return v==null?d:JSON.parse(v)}catch(e){return d}},
  set(k,v){try{localStorage.setItem('kt.'+k,JSON.stringify(v))}catch(e){}}
};
const uid=()=>(crypto.randomUUID?crypto.randomUUID():'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=Math.random()*16|0;return(c==='x'?r:(r&3|8)).toString(16)}));

/* Datum als lokaler ISO-Tag */
const pad=n=>String(n).padStart(2,'0');
const dayKey=(d=new Date())=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const parseDay=k=>{const [y,m,d]=k.split('-').map(Number);return new Date(y,m-1,d)};
const addDays=(k,n)=>{const d=parseDay(k);d.setDate(d.getDate()+n);return dayKey(d)};
const WD=['So','Mo','Di','Mi','Do','Fr','Sa'];
const dayLabel=k=>{const d=parseDay(k);return `${WD[d.getDay()]} ${d.getDate()}.${d.getMonth()+1}.`};

/* Tageszeiten */
const SLOTS=[
 {k:'morgen',n:'Frühstück',t:'07:30',share:.22,from:5,to:10},
 {k:'vormittag',n:'Vormittags-Snack',t:'10:00',share:.10,from:10,to:12},
 {k:'mittag',n:'Mittagessen',t:'12:30',share:.25,from:12,to:15},
 {k:'nachmittag',n:'Nachmittags-Snack',t:'15:30',share:.10,from:15,to:17.5},
 {k:'abend',n:'Abendessen',t:'18:30',share:.25,from:17.5,to:21},
 {k:'spaet',n:'Spätmahlzeit',t:'21:30',share:.08,from:21,to:29}];
const SLOT_EXTRA={pre:'Vor dem Training',post:'Nach dem Training'};
function slotNow(d=new Date()){let h=d.getHours()+d.getMinutes()/60;if(h<5)h+=24;return SLOTS.find(s=>h>=s.from&&h<s.to)||SLOTS[5]}

/* Kalorienziel */
const S={
  cart:[],favs:new Set(),done:new Set(),pantry:new Set(),diary:[],weights:[],
  profile:{w:65,h:178,a:25,sex:'m',act:1.55,plus:500,meals:4},
  plan:{days:{},times:{},opts:{budget:15,maxTime:45,diet:[],prep:false}},
  stats:{},mine:{},updatedAt:0
};
const dayGoal=()=>{const p=S.profile;const bmr=10*p.w+6.25*p.h-5*p.a+(p.sex==='m'?5:-161);return bmr*p.act+p.plus};
const proteinGoal=()=>S.profile.w*1.8;

function loadState(){
  S.cart=(store.get('cart',[])||[]);
  S.favs=new Set(store.get('fav',[]));
  S.done=new Set(store.get('done',[]));
  S.pantry=new Set(store.get('pantry',[]));
  S.diary=store.get('diary',[])||[];
  S.weights=store.get('weights',[])||[];
  Object.assign(S.profile,store.get('profile',{}));
  const pl=store.get('plan',null);if(pl)S.plan={days:pl.days||{},times:pl.times||{},opts:Object.assign({budget:15,maxTime:45,diet:[],prep:false},pl.opts||{})};
  S.mine=store.get('mine',{})||{};
  S.updatedAt=store.get('updatedAt',0);
}
/* keys: welche Teile geändert wurden; löst Server-Sync aus */
function persist(...keys){
  const map={cart:()=>store.set('cart',S.cart),fav:()=>store.set('fav',[...S.favs]),done:()=>store.set('done',[...S.done]),pantry:()=>store.set('pantry',[...S.pantry]),
    diary:()=>store.set('diary',S.diary),weights:()=>store.set('weights',S.weights),profile:()=>store.set('profile',S.profile),plan:()=>store.set('plan',S.plan),mine:()=>store.set('mine',S.mine)};
  keys.forEach(k=>map[k]&&map[k]());
  if(keys.some(k=>['cart','fav','done','pantry','profile','plan','mine'].includes(k))){S.updatedAt=Date.now();store.set('updatedAt',S.updatedAt);if(window.KTB)KTB.queueState()}
}
function stateBlob(){return{cart:S.cart,fav:[...S.favs],done:[...S.done],pantry:[...S.pantry],profile:S.profile,plan:S.plan,mine:S.mine,updatedAt:S.updatedAt}}
function applyBlob(b){
  if(!b)return;
  S.cart=(b.cart||[]).filter(e=>BYID[e.id]);S.favs=new Set(b.fav||[]);S.done=new Set(b.done||[]);S.pantry=new Set(b.pantry||[]);
  if(b.profile)Object.assign(S.profile,b.profile);
  if(b.plan)S.plan={days:b.plan.days||{},times:b.plan.times||{},opts:Object.assign({budget:15,maxTime:45,diet:[],prep:false},b.plan.opts||{})};
  S.mine=b.mine||{};S.updatedAt=b.updatedAt||Date.now();
  store.set('cart',S.cart);store.set('fav',[...S.favs]);store.set('done',[...S.done]);store.set('pantry',[...S.pantry]);store.set('profile',S.profile);store.set('plan',S.plan);store.set('mine',S.mine);store.set('updatedAt',S.updatedAt);
}

/* Mengen */
function frac(q){const r=Math.round(q*4)/4,w=Math.floor(r),d=r-w;const f={0:'',.25:'1/4',.5:'1/2',.75:'3/4'}[d];return w?(f?`${w} ${f}`:String(w)):(f||'1/4')}
function fmtQty(id,q){
  const i=ING[id];if(i.unit==='')return'nach Bedarf';
  if(i.unit==='Stk'){const u=id==='knob'?'Zehe(n)':id==='kraeuter'?'Bund':'Stk.';return frac(q)+' '+u}
  if(q>=1000)return(Math.round(q/10)/100).toLocaleString('de-DE')+(i.unit==='g'?' kg':' l');
  const r=q>=50?Math.round(q/5)*5:Math.round(q*2)/2;return r.toLocaleString('de-DE')+' '+i.unit;
}
const lineCost=(id,q)=>{const i=ING[id];return i.price*((i.unit==='g'||i.unit==='ml')?q/100:q)};
const weight=(id,q)=>ING[id].unit==='Stk'?(STKW[id]||100)*q:q;

/* Booster: Kalorien erhöhen ohne neues Rezept */
const BOOST=[
 {k:'oel',n:'+ 1 EL Olivenöl',ing:[['olivenoel',15]]},
 {k:'butter',n:'+ Butter',ing:[['butter',15]]},
 {k:'sahne',n:'+ Sahne-Schuss',ing:[['sahne',50]]},
 {k:'kaese',n:'+ Käse gerieben',ing:[['gouda',30]]},
 {k:'nuss',n:'+ Handvoll Nüsse',ing:[['walnuss',30]]},
 {k:'ei',n:'+ Spiegelei',ing:[['ei',1],['butter',5]]},
 {k:'avo',n:'+ Avocado',ing:[['avocado',0.5]]},
 {k:'mus',n:'+ Erdnussbutter',ing:[['erdnussb',20]]},
 {k:'brot',n:'+ Brot dazu',ing:[['brot',60],['butter',8]]}];
/* Zutaten je Portion inkl. Booster */
function ingOf(r,b=[]){
  const m=new Map(r.ing);
  for(const k of b){const B=BOOST.find(x=>x.k===k);if(B)for(const [id,q] of B.ing)m.set(id,(m.get(id)||0)+q)}
  return [...m.entries()];
}
function nutriOf(r,b=[]){return b&&b.length?calc(ingOf(r,b)):{kcal:r.kcal,p:r.p,f:r.f,c:r.c,price:r.price}}

/* Neue Version der App laden, damit Kartendaten nach Sync nicht veralten */
function gid(){return uid()}
