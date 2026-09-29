/* Tagebuch, Plan, Vorrat, Kochmodus, Community und Konto */

/* =================== Tagebuch =================== */
let viewDay=dayKey();
function pendingList(k){return store.get(k,[])||[]}
function addPending(k,v){const l=pendingList(k);if(!l.includes(v)){l.push(v);store.set(k,l)}}

function logEntry(e){
  S.diary.push(e);persist('diary');
  if(KTB.enabled()&&KTB.user)KTB.upsertDiary([e]).then(ok=>{if(!ok)addPending('diaryUp',e.id)});
}
function logMeal(id,p=1,b=[],day=dayKey()){
  const r=BYID[id];if(!r)return;const n=nutriOf(r,b);
  logEntry({id:uid(),day,label:r.name+(b.length?' (mit Booster)':''),rid:id,p,kcal:n.kcal*p,prot:n.p*p,price:n.price*p,ts:Date.now()});
  refreshDash();toast(`Eingetragen: ${num(n.kcal*p)} kcal`);
}
function delEntry(id){
  S.diary=S.diary.filter(e=>e.id!==id);persist('diary');
  if(KTB.enabled()&&KTB.user)KTB.deleteDiary(id).then(ok=>{if(!ok)addPending('diaryDel',id)});
  refreshDash();
}
ACT.eat=(el,e)=>{e.stopPropagation();logMeal(el.dataset.id)};
ACT.meaten=()=>{logMeal(mId,mP,[...mB]);closeModal()};

function weeklyGain(){
  const t0=parseDay(dayKey());
  const pts=S.weights.filter(w=>w.day>=addDays(dayKey(),-42)).map(w=>({x:Math.round((parseDay(w.day)-t0)/864e5),y:w.kg}));
  if(pts.length<2)return null;
  const xs=pts.map(p=>p.x);if(Math.max(...xs)-Math.min(...xs)<5)return null;
  const mx=pts.reduce((a,p)=>a+p.x,0)/pts.length,my=pts.reduce((a,p)=>a+p.y,0)/pts.length;
  let sxy=0,sxx=0;pts.forEach(p=>{sxy+=(p.x-mx)*(p.y-my);sxx+=(p.x-mx)**2});
  return sxx?sxy/sxx*7:null;
}
function streak(){let n=0,k=dayKey();const g=dayGoal();if(todayTotals(k).kcal<g*.9)k=addDays(k,-1);while(todayTotals(k).kcal>=g*.9){n++;k=addDays(k,-1);if(n>400)break}return n}

function barChart(){
  const g=dayGoal(),days=[];for(let i=13;i>=0;i--){const k=addDays(dayKey(),-i);days.push({k,v:todayTotals(k).kcal})}
  const max=Math.max(g*1.15,...days.map(d=>d.v)),W=340,H=150,L=34,B=22,T=8,bw=(W-L-4)/14;
  const y=v=>T+(H-T-B)*(1-v/max);
  const ticks=[0,.5,1].map(f=>Math.round(max*f/100)*100);
  return`<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Kalorien der letzten 14 Tage im Vergleich zum Ziel">
   <g class="grid">${ticks.map(t=>`<line x1="${L}" x2="${W}" y1="${y(t)}" y2="${y(t)}"/><text x="${L-5}" y="${y(t)+3}" text-anchor="end">${t}</text>`).join('')}</g>
   ${days.map((d,i)=>`<rect class="${d.v>=g*.9?'bar-ok':'bar-low'}" x="${L+i*bw+2}" y="${y(d.v)}" width="${bw-4}" height="${Math.max(0,H-B-y(d.v))}" rx="2"/>${i%2===1||i===13?`<text x="${L+i*bw+bw/2}" y="${H-7}" text-anchor="middle">${parseDay(d.k).getDate()}</text>`:''}`).join('')}
   <line class="goal" x1="${L}" x2="${W}" y1="${y(g)}" y2="${y(g)}"/></svg>`;
}
function weightChart(){
  const pts=S.weights.slice().sort((a,b)=>a.day<b.day?-1:1).slice(-40);
  if(pts.length<2)return`<div class="pempty">Trage mindestens zwei Gewichte ein, dann erscheint hier der Verlauf.</div>`;
  const W=340,H=150,L=34,R=8,B=22,T=10,t0=parseDay(pts[0].day).getTime(),t1=parseDay(pts[pts.length-1].day).getTime()||t0+1;
  const ys=pts.map(p=>p.kg),lo=Math.floor(Math.min(...ys)-.5),hi=Math.ceil(Math.max(...ys)+.5);
  const x=d=>L+(W-L-R)*((parseDay(d).getTime()-t0)/Math.max(1,t1-t0)),y=v=>T+(H-T-B)*(1-(v-lo)/(hi-lo));
  const line=pts.map((p,i)=>`${i?'L':'M'}${x(p.day).toFixed(1)} ${y(p.kg).toFixed(1)}`).join(' ');
  const gain=weeklyGain();let trend='';
  if(gain!==null){const my=ys.reduce((a,b)=>a+b,0)/ys.length;const mxd=pts.reduce((a,p)=>a+(parseDay(p.day).getTime()-t0)/864e5,0)/pts.length;const s=gain/7;
    const d0=0,d1=(t1-t0)/864e5;const a=my+s*(d0-mxd),b=my+s*(d1-mxd);trend=`<path class="tr" d="M${x(pts[0].day).toFixed(1)} ${y(a).toFixed(1)}L${x(pts[pts.length-1].day).toFixed(1)} ${y(b).toFixed(1)}"/>`}
  const ticks=[lo,(lo+hi)/2,hi];
  return`<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Gewichtsverlauf"><g class="grid">${ticks.map(t=>`<line x1="${L}" x2="${W-R}" y1="${y(t)}" y2="${y(t)}"/><text x="${L-5}" y="${y(t)+3}" text-anchor="end">${one(t)}</text>`).join('')}</g>
   <path class="ln" d="${line}"/>${trend}${pts.map(p=>`<circle class="dot" cx="${x(p.day).toFixed(1)}" cy="${y(p.kg).toFixed(1)}" r="3"/>`).join('')}
   <text x="${L}" y="${H-7}">${dayLabel(pts[0].day)}</text><text x="${W-R}" y="${H-7}" text-anchor="end">${dayLabel(pts[pts.length-1].day)}</text></svg>`;
}
function diaryResults(q){
  const t=q.trim().toLowerCase().split(/\s+/).filter(Boolean);if(!t.length)return'';
  const l=RECIPES.filter(r=>t.every(x=>r.name.toLowerCase().includes(x))).slice(0,6);
  return l.length?l.map(r=>`<div class="entry"><b>${esc(r.name)}</b><small>${num(r.kcal)} kcal · ${num(r.p)} g Eiweiß</small><button class="btn sm primary" data-act="dlog" data-id="${r.id}" type="button" style="grid-row:1/3;grid-column:2">Eintragen</button></div>`).join(''):'<div class="muted" style="font-size:13px">Nichts gefunden.</div>';
}
ACT.dlog=el=>{logMeal(el.dataset.id,1,[],viewDay);};
ACT.dday=el=>{viewDay=addDays(viewDay,+el.dataset.d);renderDiary()};
ACT.dtoday=()=>{viewDay=dayKey();renderDiary()};
ACT.ddel=el=>delEntry(el.dataset.id);
ACT.dcustom=()=>{
  const name=$('#dcName').value.trim()||'Eigener Eintrag',kcal=+$('#dcKcal').value,prot=+$('#dcPro').value||0;
  if(!(kcal>0)){toast('Gib die Kalorien an');return}
  logEntry({id:uid(),day:viewDay,label:name.slice(0,120),rid:null,p:1,kcal,prot,price:0,ts:Date.now()});renderDiary();refreshToday();toast('Eingetragen');
};
ACT.wsave=()=>{
  const kg=Math.round((+$('#wKg').value)*10)/10,day=$('#wDay').value||dayKey();
  if(!(kg>=20&&kg<=400)){toast('Gib ein Gewicht zwischen 20 und 400 kg an');return}
  const i=S.weights.findIndex(w=>w.day===day);if(i>=0)S.weights[i].kg=kg;else S.weights.push({day,kg});
  S.weights.sort((a,b)=>a.day<b.day?-1:1);persist('weights');
  if(KTB.enabled()&&KTB.user)KTB.upsertWeight({day,kg}).then(ok=>{if(!ok)addPending('weightUp',day)});
  renderDiary();toast('Gewicht gespeichert');
};
ACT.wdel=el=>{const day=el.dataset.day;S.weights=S.weights.filter(w=>w.day!==day);persist('weights');if(KTB.enabled()&&KTB.user)KTB.deleteWeight(day).then(ok=>{if(!ok)addPending('weightDel',day)});renderDiary()};
function refreshToday(){renderToday();renderNow()}

function renderDiary(){
  const root=$('#diaryRoot'),g=dayGoal(),t=todayTotals(viewDay),isToday=viewDay===dayKey();
  const list=S.diary.filter(e=>e.day===viewDay).sort((a,b)=>a.ts-b.ts);
  const gain=weeklyGain();const last=S.weights.length?S.weights[S.weights.length-1]:null;
  let gainHtml='<span class="pill">Noch zu wenig Daten</span>';
  if(gain!==null){const cls=gain>=.15&&gain<=.6?'good':'warn';const txt=gain<.15?'zu langsam, iss etwa 200 kcal mehr':gain>.6?'recht schnell, ein Teil kann Fett sein':'gute Zunahme';gainHtml=`<span class="pill ${cls}">${gain>0?'+':''}${one(gain)} kg pro Woche</span> <small class="muted">${txt}</small>`}
  const st=streak();
  root.innerHTML=`<h1 class="ph">Tagebuch</h1>
  <div class="row"><button class="btn iconbtn" data-act="dday" data-d="-1" type="button" aria-label="Vorheriger Tag">‹</button><b style="font:800 1.2rem var(--f-display)">${isToday?'Heute, ':''}${dayLabel(viewDay)}</b><button class="btn iconbtn" data-act="dday" data-d="1" type="button" aria-label="Nächster Tag">›</button>${isToday?'':'<button class="btn sm" data-act="dtoday" type="button">Zu heute</button>'}<span class="pill" style="margin-left:auto">${st} ${st===1?'Tag':'Tage'} in Folge am Ziel</span></div>
  <div class="two">
   <div class="grid-col" style="display:grid;gap:20px;min-width:0">
    <section class="panel"><div class="today" style="border:0;padding:0;box-shadow:none;background:none">${ringSVG(t.kcal/g,num(t.kcal),'von '+num(g))}<div><h2>${t.kcal>=g?'Tagesziel erreicht':`Noch ${num(g-t.kcal)} kcal offen`}</h2>
       <div class="facts"><span>Eiweiß <b>${num(t.prot)} / ${num(proteinGoal())} g</b></span><span>Ausgaben <b>${eur(t.price)}</b></span></div><div style="margin-top:10px"><button class="btn sm" data-act="goal" type="button">Ziel anpassen</button></div></div></div>
      <div class="meter"><i class="${t.kcal>g*1.1?'over':''}" style="width:${Math.min(100,t.kcal/g*100)}%"></i></div>
      <div>${list.length?list.map(e=>`<div class="entry"><b>${esc(e.label)}${e.p&&e.p!==1?` <small>· ${e.p}×</small>`:''}</b><small>${num(e.kcal)} kcal · ${num(e.prot||0)} g Eiweiß${e.price?' · '+eur(e.price):''}</small><button class="x" data-act="ddel" data-id="${e.id}" type="button" aria-label="Löschen">×</button></div>`).join(''):'<div class="pempty"><b>Noch nichts eingetragen.</b>Suche unten ein Rezept oder tippe bei einem Rezept auf „Gegessen“.</div>'}</div></section>
    <section class="panel"><h2>Etwas eintragen</h2>
      <div class="field"><label for="dSearch">Rezept suchen</label><input id="dSearch" type="search" placeholder="z. B. Porridge, Lachs, Shake" autocomplete="off"></div>
      <div id="dResults"></div>
      <h3 class="eyebrow" style="margin:6px 0 0">Oder frei eintragen</h3>
      <div class="grid2"><div class="field" style="grid-column:1/-1"><label for="dcName">Name</label><input id="dcName" placeholder="z. B. Restaurant, Bäcker"></div>
       <div class="field"><label for="dcKcal">Kalorien</label><input id="dcKcal" type="number" min="1" inputmode="numeric"></div><div class="field"><label for="dcPro">Eiweiß (g)</label><input id="dcPro" type="number" min="0" inputmode="numeric"></div></div>
      <button class="btn primary" data-act="dcustom" type="button">Eintragen</button></section>
   </div>
   <div style="display:grid;gap:20px;min-width:0">
    <section class="panel"><h2>Letzte 14 Tage</h2>${barChart()}<div class="row muted" style="font-size:12.5px"><span><i style="display:inline-block;width:10px;height:10px;background:var(--moss);border-radius:2px"></i> Ziel erreicht</span><span><i style="display:inline-block;width:10px;height:10px;background:var(--c-carb);border-radius:2px"></i> darunter</span><span style="color:var(--yolk)">- - Tagesziel</span></div></section>
    <section class="panel"><h2>Gewicht</h2>
      <div class="grid2"><div class="field"><label for="wKg">Gewicht (kg)</label><input id="wKg" type="number" step="0.1" min="20" max="400" inputmode="decimal" value="${last?last.kg:S.profile.w}"></div><div class="field"><label for="wDay">Datum</label><input id="wDay" type="date" value="${dayKey()}" max="${dayKey()}"></div></div>
      <button class="btn primary" data-act="wsave" type="button">Speichern</button>
      ${weightChart()}<div>${gainHtml}</div>
      <div>${S.weights.slice(-5).reverse().map(w=>`<div class="entry"><b>${one(w.kg)} kg</b><small>${dayLabel(w.day)}</small><button class="x" data-act="wdel" data-day="${w.day}" type="button" aria-label="Löschen">×</button></div>`).join('')}</div></section>
   </div></div>`;
  const s=$('#dSearch');s.addEventListener('input',()=>{$('#dResults').innerHTML=diaryResults(s.value)});
}

/* =================== Plan =================== */
let planDay=dayKey(),planRnd=0;
const activeSlots=()=>{const n=S.profile.meals||4;const keys={3:['morgen','mittag','abend'],4:['morgen','mittag','nachmittag','abend'],5:['morgen','vormittag','mittag','nachmittag','abend'],6:['morgen','vormittag','mittag','nachmittag','abend','spaet']}[n]||['morgen','mittag','nachmittag','abend'];
  const tot=SLOTS.filter(s=>keys.includes(s.k)).reduce((a,s)=>a+s.share,0);return SLOTS.filter(s=>keys.includes(s.k)).map(s=>({...s,w:s.share/tot}))};
const slotTime=k=>S.plan.times[k]||SLOTS.find(s=>s.k===k).t;
function dietOK(r){const d=S.plan.opts.diet;return!(d.includes('gf')&&!r.gf)&&!(d.includes('df')&&!r.df)&&!(d.includes('nf')&&!r.nf)}
function genSlot(sl,used,day){
  const o=S.plan.opts,goal=dayGoal(),budK=goal*sl.w,budE=o.budget*sl.w;
  let best=null,bs=1e9;
  for(const r of RECIPES){
    if(!r.slots.includes(sl.k)||!dietOK(r))continue;
    if((sl.k==='mittag'||sl.k==='abend')&&r.time>o.maxTime)continue;
    const p=Math.max(1,Math.min(3,Math.round(budK/r.kcal)));
    const s=Math.abs(r.kcal*p-budK)/budK+Math.max(0,(r.price*p-budE)/Math.max(budE,1))*1.2+Math.random()*.5+(used.has(r.id)?.9:0)+(p>2?.15*(p-2):0)-(o.prep&&r.prep?.15:0)-(S.favs.has(r.id)?.15:0);
    if(s<bs){bs=s;best={id:r.id,p}}
  }
  return best;
}
function fillDay(day,force=false){
  const d=S.plan.days[day]=S.plan.days[day]||{};
  const used=new Set();Object.values(S.plan.days).forEach(x=>Object.values(x).forEach(m=>m&&used.add(m.id)));
  for(const sl of activeSlots()){
    const cur=d[sl.k];if(cur&&(cur.lock||(!force&&BYID[cur.id])))continue;
    const g=genSlot(sl,used,day);if(g){d[sl.k]={...g,lock:false,eaten:false};used.add(g.id)}
  }
  Object.keys(d).forEach(k=>{if(!activeSlots().some(s=>s.k===k)&&!d[k].lock)delete d[k]});
}
const weekDays=()=>Array.from({length:7},(_,i)=>addDays(dayKey(),i));
function planTotals(day){
  const d=S.plan.days[day]||{};let kcal=0,prot=0,price=0;
  activeSlots().forEach(sl=>{const m=d[sl.k];const r=m&&BYID[m.id];if(r){kcal+=r.kcal*m.p;prot+=r.p*m.p;price+=r.price*m.p}});
  return{kcal,prot,price};
}
function planToCart(days){
  let n=0;days.forEach(day=>{const d=S.plan.days[day]||{};activeSlots().forEach(sl=>{const m=d[sl.k];if(m&&BYID[m.id]){const e=S.cart.find(x=>x.id===m.id&&!(x.b&&x.b.length));if(e)e.p=Math.min(20,e.p+m.p);else S.cart.push({id:m.id,p:m.p,b:[]});n++}})});
  persist('cart');renderCart();toast(n?`${n} Mahlzeiten liegen im Korb`:'Nichts zu übertragen');if(n)openCart();
}
ACT.pday=el=>{planDay=el.dataset.d;renderPlan()};
ACT.pfillday=()=>{fillDay(planDay,true);persist('plan');renderPlan()};
ACT.pfillweek=()=>{weekDays().forEach(d=>fillDay(d,true));persist('plan');renderPlan();toast('Woche gewürfelt')};
ACT.pcartday=()=>planToCart([planDay]);
ACT.pcartweek=()=>planToCart(weekDays());
ACT.proll=el=>{
  const day=planDay,sl=activeSlots().find(s=>s.k===el.dataset.k);const used=new Set();Object.values(S.plan.days).forEach(x=>Object.values(x).forEach(m=>m&&used.add(m.id)));
  const g=genSlot(sl,used,day);if(g){(S.plan.days[day]=S.plan.days[day]||{})[sl.k]={...g,lock:false,eaten:false};persist('plan');renderPlan()}
};
ACT.plock=el=>{const m=(S.plan.days[planDay]||{})[el.dataset.k];if(m){m.lock=!m.lock;persist('plan');renderPlan()}};
ACT.pdel=el=>{const d=S.plan.days[planDay];if(d){delete d[el.dataset.k];persist('plan');renderPlan()}};
ACT.pportion=el=>{const m=(S.plan.days[planDay]||{})[el.dataset.k];if(m){m.p=Math.max(1,Math.min(6,m.p+(+el.dataset.d)));persist('plan');renderPlan()}};
ACT.peat=el=>{const m=(S.plan.days[planDay]||{})[el.dataset.k];if(m&&!m.eaten){m.eaten=true;persist('plan');logMeal(m.id,m.p,[],planDay);renderPlan()}};
ACT.pdiet=el=>{const o=S.plan.opts;const k=el.dataset.k;if(k==='prep')o.prep=!o.prep;else o.diet=o.diet.includes(k)?o.diet.filter(x=>x!==k):[...o.diet,k];persist('plan');renderPlan()};
function renderPlan(){
  const root=$('#planRoot'),o=S.plan.opts,g=dayGoal(),days=weekDays();
  if(!days.includes(planDay))planDay=days[0];
  if(!S.plan.days[planDay]){fillDay(planDay);persist('plan')}
  const d=S.plan.days[planDay]||{},tot=planTotals(planDay);
  const wk=days.map(k=>({k,...planTotals(k)}));const wkPrice=wk.reduce((a,x)=>a+x.price,0);
  root.innerHTML=`<h1 class="ph">Plan</h1>
  <p class="muted" style="margin:-8px 0 0;max-width:60ch">Der Plan verteilt dein Tagesziel von ${num(g)} kcal auf ${activeSlots().length} Mahlzeiten. Würfle neu, sperre Gerichte, die du behalten willst, und lege alles mit einem Klick in den Korb.</p>
  <div class="daybar" role="tablist">${days.map((k,i)=>`<button class="chip" role="tab" type="button" data-act="pday" data-d="${k}" aria-pressed="${k===planDay}">${i===0?'Heute':WD[parseDay(k).getDay()]}<small>${parseDay(k).getDate()}.${parseDay(k).getMonth()+1}.</small></button>`).join('')}</div>
  <div class="two">
   <section class="panel" style="min-width:0"><div class="row" style="justify-content:space-between"><h2>${dayLabel(planDay)}</h2><button class="btn sm" data-act="pfillday" type="button">Tag neu würfeln</button></div>
    <div>${activeSlots().map(sl=>{const m=d[sl.k],r=m&&BYID[m.id];
      return`<div class="slot${m&&m.eaten?' eaten':''}"><div class="when"><input type="time" data-time="${sl.k}" value="${slotTime(sl.k)}" aria-label="Uhrzeit ${sl.n}"><span>${sl.n}</span></div>
      <div class="what">${r?`<a data-act="open" data-id="${r.id}">${esc(r.name)}</a><div class="m"><span>${num(r.kcal*m.p)} kcal</span><span>${num(r.p*m.p)} g Eiweiß</span><span>${eur(r.price*m.p)}</span><span>${r.time}′</span></div>
        <div class="tools"><div class="stepper"><button data-act="pportion" data-k="${sl.k}" data-d="-1" type="button" aria-label="Weniger">−</button><output>${m.p}×</output><button data-act="pportion" data-k="${sl.k}" data-d="1" type="button" aria-label="Mehr">+</button></div>
        <button class="btn" data-act="proll" data-k="${sl.k}" type="button">Neu</button><button class="btn" data-act="plock" data-k="${sl.k}" type="button" aria-pressed="${!!m.lock}">${m.lock?'Gesperrt':'Sperren'}</button>
        <button class="btn" data-act="peat" data-k="${sl.k}" type="button"${m.eaten?' disabled':''}>${m.eaten?'Gegessen':'Gegessen?'}</button><button class="btn danger" data-act="pdel" data-k="${sl.k}" type="button" aria-label="Entfernen">×</button></div>`
        :`<span class="muted">Nichts geplant.</span><div class="tools"><button class="btn primary" data-act="proll" data-k="${sl.k}" type="button">Vorschlag holen</button></div>`}</div></div>`}).join('')}</div>
    <div><div class="total"><small class="mono">Summe</small><small class="mono">${num(tot.kcal)} von ${num(g)} kcal</small></div><div class="meter" style="margin-top:6px"><i class="${tot.kcal>g*1.1?'over':''}" style="width:${Math.min(100,tot.kcal/g*100)}%"></i></div></div>
    <div class="kv"><div><b>${num(tot.kcal)}</b><span>kcal</span></div><div><b>${num(tot.prot)} g</b><span>Eiweiß</span></div><div><b>${eur(tot.price)}</b><span>Kosten</span></div></div>
    <div class="row"><button class="btn primary" data-act="pcartday" type="button">Tag in den Korb</button></div></section>
   <div style="display:grid;gap:20px;min-width:0">
    <section class="panel"><h2>Einstellungen</h2>
      <div class="range"><div class="row" style="justify-content:space-between"><label for="pBudget">Budget pro Tag</label><output>${eur0(o.budget)}</output></div><input id="pBudget" type="range" min="5" max="30" step="1" value="${o.budget}"></div>
      <div class="range"><div class="row" style="justify-content:space-between"><label for="pTime">Kochzeit Mittag und Abend bis</label><output>${o.maxTime} Min.</output></div><input id="pTime" type="range" min="10" max="120" step="5" value="${o.maxTime}"></div>
      <div class="chips">${[['gf','Glutenfrei'],['df','Ohne Milchprodukte'],['nf','Ohne Nüsse'],['prep','Meal-Prep bevorzugen']].map(([k,l])=>`<button class="chip" type="button" data-act="pdiet" data-k="${k}" aria-pressed="${k==='prep'?o.prep:o.diet.includes(k)}">${l}</button>`).join('')}</div>
      <p class="muted" style="font-size:12.5px;margin:0">Mahlzeiten pro Tag stellst du beim Ziel ein.</p><button class="btn sm" data-act="goal" type="button" style="justify-self:start">Ziel anpassen</button></section>
    <section class="panel"><h2>Woche</h2>
      ${wk.map(x=>`<button class="entry" data-act="pday" data-d="${x.k}" type="button" style="background:none;border:0;border-top:1px solid var(--line);text-align:left;width:100%"><b>${dayLabel(x.k)}</b><small>${x.kcal?num(x.kcal)+' kcal · '+eur(x.price):'nicht geplant'}</small></button>`).join('')}
      <div class="total"><span>Woche gesamt</span><b>${eur(wkPrice)}</b></div>
      <div class="row"><button class="btn" data-act="pfillweek" type="button">Woche würfeln</button><button class="btn primary" data-act="pcartweek" type="button">Woche in den Korb</button></div></section>
   </div></div>`;
  $$('[data-time]',root).forEach(i=>i.addEventListener('change',()=>{S.plan.times[i.dataset.time]=i.value;persist('plan')}));
  $('#pBudget',root).addEventListener('change',e=>{o.budget=+e.target.value;persist('plan');renderPlan()});
  $('#pTime',root).addEventListener('change',e=>{o.maxTime=+e.target.value;persist('plan');renderPlan()});
}

/* =================== Vorrat =================== */
let pantryMin=70;
ACT.ptoggle=el=>{const id=el.dataset.id;S.pantry.has(id)?S.pantry.delete(id):S.pantry.add(id);persist('pantry');renderPantry();renderCart()};
ACT.pclear=()=>{S.pantry.clear();persist('pantry');renderPantry();renderCart()};
ACT.pmin=el=>{pantryMin=+el.dataset.v;renderPantry()};
function renderPantry(){
  const root=$('#pantryRoot');const ids=Object.keys(ING).filter(i=>i!=='gew');
  const res=RECIPES.map(r=>{const ing=r.ing.filter(x=>x[0]!=='gew');const have=ing.filter(x=>S.pantry.has(x[0])).length;return{r,have,tot:ing.length,pct:have/ing.length,miss:ing.filter(x=>!S.pantry.has(x[0])).map(x=>ING[x[0]].name)}})
    .filter(x=>x.have>0&&x.pct*100>=pantryMin).sort((a,b)=>b.pct-a.pct||a.miss.length-b.miss.length||b.r.kcal-a.r.kcal);
  root.innerHTML=`<h1 class="ph">Vorrat</h1>
  <p class="muted" style="margin:-8px 0 0;max-width:60ch">Tippe an, was du zu Hause hast. Die Rezepte unten sind nach dem Anteil vorhandener Zutaten sortiert. Salz und Gewürze zählen immer als da. Was im Vorrat liegt, rechnet der Korb nicht zum Preis.</p>
  <section class="panel">${AISLE_ORDER.map(a=>`<div><h3 class="eyebrow" style="margin:0 0 8px">${AISLE[a]}</h3><div class="ingpick">${ids.filter(i=>ING[i].aisle===a).sort((x,y)=>ING[x].name.localeCompare(ING[y].name,'de')).map(i=>`<button class="chip" type="button" data-act="ptoggle" data-id="${i}" aria-pressed="${S.pantry.has(i)}">${esc(ING[i].name)}</button>`).join('')}</div></div>`).join('')}
    <div class="row"><span class="muted mono" style="font-size:12.5px">${S.pantry.size} ausgewählt</span>${S.pantry.size?'<button class="btn sm" data-act="pclear" type="button">Alles abwählen</button>':''}</div></section>
  <div class="row"><h2 style="margin-right:auto">${S.pantry.size?`${res.length} passende Rezepte`:'Wähle Zutaten aus'}</h2><span class="muted" style="font-size:13px">Mindestens</span>${[50,70,90,100].map(v=>`<button class="chip" type="button" data-act="pmin" data-v="${v}" aria-pressed="${pantryMin===v}">${v} %</button>`).join('')}</div>
  <div class="grid">${res.slice(0,36).map(({r,pct,miss},i)=>`<article class="card" data-act="open" data-id="${r.id}" style="--i:${i%12}"><div class="head">${plateSVG(r)}<div class="t"><div class="eyebrow">${Math.round(pct*100)} % vorhanden</div><h3>${esc(r.name)}</h3></div></div>
     <div class="meter"><i style="width:${pct*100}%"></i></div>
     <div class="match"><span class="miss">${miss.length?'Fehlt: '+esc(miss.slice(0,5).join(', '))+(miss.length>5?` und ${miss.length-5} weitere`:''):'Du hast alles da.'}</span><span class="mono muted" style="font-size:12px">${num(r.kcal)} kcal · ${num(r.p)} g Eiweiß · ${r.time}′</span></div>
     <div class="actions"><button class="btn primary" data-act="add" data-id="${r.id}" type="button">In den Korb</button><button class="btn" data-act="eat" data-id="${r.id}" type="button">Gegessen</button></div></article>`).join('')}</div>
  ${S.pantry.size&&!res.length?`<div class="empty"><b>Noch nichts Passendes.</b>Senke den Mindestwert oder wähle mehr Zutaten aus.</div>`:''}`;
}

/* =================== Timer und Kochmodus =================== */
const timers=[];let audioCtx=null,tick=null,wake=null;
function beep(){try{audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.frequency.value=880;o.connect(g);g.connect(audioCtx.destination);g.gain.setValueAtTime(.2,audioCtx.currentTime);o.start();o.stop(audioCtx.currentTime+.35)}catch(e){}}
function startTimer(min,label){
  try{audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==='suspended')audioCtx.resume()}catch(e){}
  timers.push({id:uid(),end:Date.now()+min*60000,label,done:false});drawTimers();
  if(!tick)tick=setInterval(tickTimers,1000);toast(`Timer läuft: ${min} Min.`);
}
function tickTimers(){
  let ring=false;const now=Date.now();
  timers.forEach(t=>{if(!t.done&&now>=t.end){t.done=true;ring=true}});
  if(ring){beep();try{navigator.vibrate&&navigator.vibrate([300,150,300])}catch(e){}toast('Timer abgelaufen')}
  drawTimers();if(!timers.length){clearInterval(tick);tick=null}
}
function drawTimers(){
  let bar=$('#timerbar');if(!bar){bar=document.createElement('div');bar.id='timerbar';bar.className='timerbar';document.body.appendChild(bar)}
  bar.innerHTML=timers.map(t=>{const left=Math.max(0,Math.round((t.end-Date.now())/1000));return`<div class="timer${t.done?' ring-now':''}"><span>${t.done?'Fertig':`${pad(Math.floor(left/60))}:${pad(left%60)}`}</span><small>${esc(t.label)}</small><button type="button" data-act="tstop" data-id="${t.id}" aria-label="Timer beenden">✕</button></div>`}).join('');
}
ACT.tstop=el=>{const i=timers.findIndex(t=>t.id===el.dataset.id);if(i>=0)timers.splice(i,1);drawTimers()};
ACT.timer=el=>startTimer(+el.dataset.min,(BYID[mId]||{name:'Küche'}).name.slice(0,24));

let ck=null;
async function keepAwake(on){try{if(on&&navigator.wakeLock){wake=await navigator.wakeLock.request('screen')}else if(wake){await wake.release();wake=null}}catch(e){}}
function openCook(id,p,b){ck={id,p,b,i:0};$('#cook').hidden=false;document.body.style.overflow='hidden';closeModal();drawCook();keepAwake(true)}
function closeCook(){$('#cook').hidden=true;document.body.style.overflow='';ck=null;keepAwake(false)}
function drawCook(){
  const r=BYID[ck.id],n=r.steps.length,s=r.steps[ck.i],t=stepTimer(s),last=ck.i===n-1;
  $('#cook').innerHTML=`<div class="ch"><b>${esc(r.name)}</b><button class="btn iconbtn" data-act="cookclose" type="button" aria-label="Kochmodus beenden">✕</button></div>
  <div class="cb"><div class="prog">${r.steps.map((_,i)=>`<i class="${i<=ck.i?'on':''}"></i>`).join('')}</div>
    <div class="no">Schritt ${ck.i+1} von ${n}</div><div class="tx">${esc(s)}</div>
    ${t?`<div><button class="btn primary" data-act="cooktimer" data-min="${t}" type="button">⏱ Timer ${t} Min. starten</button></div>`:''}
    ${ck.i===0?`<div><div class="no" style="margin-bottom:8px">Zutaten für ${ck.p} ${ck.p===1?'Portion':'Portionen'}</div><div class="ingl">${ingOf(r,ck.b).filter(x=>x[0]!=='gew').map(([id,q])=>`<span>${fmtQty(id,q*ck.p)} ${esc(ING[id].name)}</span>`).join('')}</div></div>`:''}</div>
  <div class="cf"><button class="btn" data-act="cookprev" type="button"${ck.i===0?' disabled':''}>Zurück</button>${last?'<button class="btn primary" data-act="cookdone" type="button">Fertig, gegessen</button>':'<button class="btn primary" data-act="cooknext" type="button">Weiter</button>'}</div>`;
}
ACT.cook=()=>openCook(mId,mP,[...mB]);
ACT.cookclose=()=>closeCook();
ACT.cooknext=()=>{if(ck&&ck.i<BYID[ck.id].steps.length-1){ck.i++;drawCook()}};
ACT.cookprev=()=>{if(ck&&ck.i>0){ck.i--;drawCook()}};
ACT.cooktimer=el=>startTimer(+el.dataset.min,BYID[ck.id].name.slice(0,24));
ACT.cookdone=()=>{const c=ck;closeCook();logMeal(c.id,c.p,c.b)};
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&ck)keepAwake(true);if(document.visibilityState==='hidden'&&window.KTB)KTB.pushState()});

/* =================== Community-Rezepte =================== */
function removeCommunity(){for(let i=RECIPES.length-1;i>=0;i--){if(RECIPES[i].author){delete BYID[RECIPES[i].id];RECIPES.splice(i,1)}}}
function addCommunity(row){
  const id='u:'+row.id;if(BYID[id])return;
  const ing=(row.ing||[]).filter(x=>Array.isArray(x)&&ING[x[0]]&&x[0]!=='gew'&&+x[1]>0).map(x=>[x[0],Math.min(5000,+x[1])]);
  const steps=(row.steps||[]).map(s=>String(s).slice(0,400)).filter(Boolean);
  if(!ing.length||!steps.length)return;
  const cats=(row.cats||['haupt']).filter(c=>CATNAME[c]);
  const r=add(String(row.name).slice(0,100),cats.length?cats:['haupt'],row.time_min||20,ing,steps,{id,author:String(row.author||'Community').slice(0,40),own:!!(KTB.user&&row.user_id===KTB.user.id),pub:!!row.is_public});
  r.rel=Math.random()*.15;r.kpe=r.kcal/r.price;BYID[id]=r;
}
async function loadCommunity(){
  const rows=await KTB.fetchRecipes();if(!rows)return;
  removeCommunity();rows.forEach(addCommunity);
  S.cart=S.cart.filter(e=>BYID[e.id]);
  render(true);renderActiveTab();
}
let addRows=3;
function ingRow(){return`<div class="irow"><input list="ingList" data-ing placeholder="Zutat" autocomplete="off"><input type="number" min="0" step="any" data-qty placeholder="Menge" inputmode="decimal"><span class="u" data-u></span></div>`}
ACT.addrecipe=()=>{
  if(!KTB.user){openAuth('Melde dich an, um eigene Rezepte zu speichern.');return}
  openSheet(`<button class="btn iconbtn close" type="button" data-act="close" aria-label="Schließen">✕</button>
   <div class="eyebrow">Eigenes Rezept</div><h2 class="title">Rezept hinzufügen</h2>
   <div class="grid2"><div class="field" style="grid-column:1/-1"><label for="nrName">Name</label><input id="nrName" maxlength="100" placeholder="z. B. Hack-Käse-Kartoffelpfanne"></div>
    <div class="field"><label for="nrCat">Gericht</label><select id="nrCat"><option value="haupt">Hauptgericht</option><option value="fruehstueck">Frühstück</option><option value="snack">Snack</option><option value="dessert">Dessert</option><option value="shake">Shake</option></select></div>
    <div class="field"><label for="nrTime">Minuten</label><input id="nrTime" type="number" min="1" max="600" value="20" inputmode="numeric"></div></div>
   <h3 class="sh" style="margin-top:16px">Zutaten für 1 Portion</h3>
   <datalist id="ingList">${Object.values(ING).filter(i=>i.id!=='gew').map(i=>`<option value="${esc(i.name)}"></option>`).join('')}</datalist>
   <div id="nrIng" style="display:grid;gap:8px">${ingRow().repeat(3)}</div>
   <div class="row" style="margin-top:8px"><button class="btn sm" data-act="nradd" type="button">+ Zutat</button><span class="muted mono" id="nrPreview" style="font-size:12.5px"></span></div>
   <div class="field" style="margin-top:14px"><label for="nrSteps">Zubereitung, ein Schritt pro Zeile</label><textarea id="nrSteps" placeholder="Kartoffeln kochen.&#10;Hack anbraten."></textarea></div>
   <label class="row" style="margin-top:12px;gap:8px"><input type="checkbox" id="nrPub" checked style="width:18px;height:18px;accent-color:var(--moss)"> Für alle sichtbar machen</label>
   <div class="msg" id="nrMsg" hidden></div>
   <div class="buy"><button class="btn primary" data-act="nrsave" type="button">Speichern</button></div>`);
  const upd=()=>{const rows=readIngRows();const n=calc(rows.ing);$('#nrPreview').textContent=rows.ing.length?`${num(n.kcal)} kcal · ${num(n.p)} g Eiweiß · ${eur(n.price)}`:'';$$('#nrIng .irow').forEach(r=>{const id=findIng($('[data-ing]',r).value);$('[data-u]',r).textContent=id?(ING[id].unit==='Stk'?'Stück':ING[id].unit):''})};
  $('#nrIng').addEventListener('input',upd);
};
function findIng(txt){
  const t=String(txt).trim().toLowerCase();if(!t)return null;
  let hit=Object.values(ING).find(i=>i.id!=='gew'&&i.name.toLowerCase()===t);
  if(!hit){const c=Object.values(ING).filter(i=>i.id!=='gew'&&i.name.toLowerCase().includes(t));if(c.length===1)hit=c[0]}
  return hit?hit.id:null;
}
function readIngRows(){
  const ing=[],bad=[];
  $$('#nrIng .irow').forEach(r=>{const name=$('[data-ing]',r).value.trim(),q=+$('[data-qty]',r).value;if(!name&&!q)return;const id=findIng(name);if(id&&q>0)ing.push([id,q]);else bad.push(name||'(leer)')});
  return{ing,bad};
}
ACT.nradd=()=>{$('#nrIng').insertAdjacentHTML('beforeend',ingRow())};
ACT.nrsave=async()=>{
  const name=$('#nrName').value.trim(),time=+$('#nrTime').value,steps=$('#nrSteps').value.split('\n').map(s=>s.trim()).filter(Boolean),{ing,bad}=readIngRows(),msg=$('#nrMsg');
  const fail=t=>{msg.hidden=false;msg.className='msg err';msg.textContent=t};
  if(name.length<3)return fail('Der Name braucht mindestens 3 Zeichen.');
  if(!ing.length)return fail('Trage mindestens eine Zutat aus der Liste mit Menge ein.');
  if(bad.length)return fail('Diese Zutaten kenne ich nicht oder es fehlt die Menge: '+bad.join(', ')+'. Wähle Zutaten aus der Liste.');
  if(!steps.length)return fail('Schreibe mindestens einen Schritt.');
  const author=(S.profile.author||(KTB.user.email||'').split('@')[0]||'Community').slice(0,40);
  const cat=$('#nrCat').value,pub=$('#nrPub').checked;
  const r=await KTB.insertRecipe({author,name,cats:[cat],time:Math.max(1,Math.min(600,time||20)),ing,steps:steps.slice(0,30),pub});
  if(r.error)return fail('Speichern hat nicht geklappt: '+(r.error.message||'Fehler'));
  addCommunity({id:r.data.id,user_id:KTB.user.id,author,name,cats:[cat],time_min:time,ing,steps,is_public:pub});
  closeModal();render(true);toast('Rezept gespeichert');
};
ACT.delrecipe=async el=>{
  const id=el.dataset.id;if(!el.dataset.arm){el.dataset.arm='1';el.textContent='Wirklich löschen?';return}
  const ok=await KTB.deleteRecipe(id.slice(2));if(!ok){toast('Löschen hat nicht geklappt');return}
  delete BYID[id];const i=RECIPES.findIndex(r=>r.id===id);if(i>=0)RECIPES.splice(i,1);S.cart=S.cart.filter(e=>e.id!==id);persist('cart');closeModal();render(true);renderCart();toast('Rezept gelöscht');
};

/* =================== Bewertungen =================== */
ACT.rate=async el=>{
  if(!KTB.user){openAuth('Melde dich an, um Rezepte zu bewerben.');return}
  const v=+el.dataset.v,id=mId;if(String(id).startsWith('u:')===false&&!/^r\d+$/.test(id))return;
  const prev=S.mine[id]||0;const ok=await KTB.rate(id,v);if(!ok){toast('Bewertung nicht gespeichert');return}
  const s=S.stats[id]||(S.stats[id]={n:0,total:0});if(prev){s.total+=v-prev}else{s.n++;s.total+=v}
  S.mine[id]=v;persist('mine');drawRecipe();render();toast('Danke für deine Bewertung');
};
async function loadStats(){
  const rows=await KTB.fetchStats();if(!rows)return;
  S.stats={};rows.forEach(x=>S.stats[x.recipe_id]={n:x.n,total:x.total});
  if(rows.length&&![...$('#fSort').options].some(o=>o.value==='best')){$('#fSort').insertAdjacentHTML('beforeend','<option value="best">Beste Bewertung</option>')}
  render();
}

/* =================== Konto und Sync =================== */
function accountLabel(){const u=KTB.user;$('#btnAccount').textContent=u?(u.email||'Konto').split('@')[0].slice(0,9):'Anmelden'}
function openAuth(hint){
  const u=KTB.user;
  if(u){
    openSheet(`<button class="btn iconbtn close" type="button" data-act="close" aria-label="Schließen">✕</button><div class="eyebrow">Konto</div><h2 class="title">Angemeldet</h2>
     <p>${esc(u.email||'')}</p><p class="muted" id="syncInfo">Korb, Favoriten, Plan, Vorrat, Tagebuch und Gewicht werden mit deinem Konto synchronisiert.</p>
     <div class="field"><label for="acAuthor">Anzeigename bei eigenen Rezepten</label><input id="acAuthor" maxlength="40" value="${esc(S.profile.author||(u.email||'').split('@')[0])}"></div>
     <div class="buy"><button class="btn" data-act="acsync" type="button">Jetzt synchronisieren</button><button class="btn danger" data-act="acout" type="button">Abmelden</button></div>`);
    $('#acAuthor').addEventListener('change',e=>{S.profile.author=e.target.value.trim().slice(0,40);persist('profile')});
  }else{
    openSheet(`<button class="btn iconbtn close" type="button" data-act="close" aria-label="Schließen">✕</button><div class="eyebrow">Konto</div><h2 class="title">Anmelden</h2>
     <p class="muted">${esc(hint||'Mit einem Konto liegen Plan, Tagebuch und Gewicht sicher auf dem Server und sind auf Handy und Rechner gleich. Ohne Konto bleibt alles auf diesem Gerät.')}</p>
     <div class="grid2"><div class="field" style="grid-column:1/-1"><label for="acMail">E-Mail</label><input id="acMail" type="email" autocomplete="email" inputmode="email"></div>
     <div class="field" style="grid-column:1/-1"><label for="acPw">Passwort (mindestens 8 Zeichen)</label><input id="acPw" type="password" autocomplete="current-password" minlength="8"></div></div>
     <div class="msg" id="acMsg" hidden></div>
     <div class="buy"><button class="btn primary" data-act="acin" type="button">Anmelden</button><button class="btn" data-act="acup" type="button">Konto erstellen</button></div>
     <p class="muted" style="font-size:12.5px">Nach dem Erstellen schickt der Server eine Bestätigungs-Mail. Klicke auf den Link und melde dich danach hier an.</p>`);
  }
}
const acMsg=(t,err)=>{const m=$('#acMsg');if(m){m.hidden=false;m.className='msg'+(err?' err':'');m.textContent=t}};
ACT.acin=async()=>{
  const email=$('#acMail').value.trim(),pw=$('#acPw').value;if(!email||!pw)return acMsg('Trage E-Mail und Passwort ein.',1);
  acMsg('Anmelden …');const r=await KTB.signIn(email,pw);
  if(r.error)return acMsg(/confirm/i.test(r.error.message||'')?'Bitte bestätige zuerst deine E-Mail über den Link in der Mail.':'Anmeldung fehlgeschlagen. Prüfe E-Mail und Passwort.',1);
  closeModal();toast('Angemeldet');
};
ACT.acup=async()=>{
  const email=$('#acMail').value.trim(),pw=$('#acPw').value;if(!email||pw.length<8)return acMsg('Trage eine E-Mail und ein Passwort mit mindestens 8 Zeichen ein.',1);
  acMsg('Konto wird erstellt …');const r=await KTB.signUp(email,pw);
  if(r.error)return acMsg('Das hat nicht geklappt: '+(r.error.message||'Fehler'),1);
  if(r.data&&r.data.session){closeModal();toast('Konto erstellt und angemeldet')}else acMsg('Fast fertig. Wir haben eine Mail an '+email+' geschickt. Klicke auf den Link darin und melde dich danach hier an.');
};
ACT.acout=async()=>{await KTB.signOut();closeModal();toast('Abgemeldet')};
ACT.acsync=async()=>{const el=$('#syncInfo');if(el)el.textContent='Synchronisiere …';await syncAll();if($('#syncInfo'))$('#syncInfo').textContent='Zuletzt synchronisiert um '+new Date().toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'})+' Uhr.'};

async function syncAll(){
  if(!KTB.user)return;
  /* Zustand: neuere Version gewinnt */
  const srv=await KTB.pullState();
  if(srv&&srv.data&&(srv.data.updatedAt||0)>S.updatedAt){applyBlob(srv.data)}
  else if(S.updatedAt||S.cart.length||S.favs.size){await KTB.queueState();await KTB.pushState()}
  /* Tagebuch: Löschungen und neue Einträge abgleichen, dann zusammenführen */
  const from=addDays(dayKey(),-120);
  const dels=pendingList('diaryDel');for(const id of dels){if(await KTB.deleteDiary(id))store.set('diaryDel',pendingList('diaryDel').filter(x=>x!==id))}
  const rows=await KTB.fetchDiary(from);
  if(rows){
    const delSet=new Set(pendingList('diaryDel'));const have=new Set(S.diary.map(e=>e.id));
    rows.forEach(x=>{if(!have.has(x.id)&&!delSet.has(x.id))S.diary.push({id:x.id,day:x.day,label:x.label,rid:x.recipe_id,p:+x.portions,kcal:x.kcal,prot:x.protein,price:+x.price,ts:new Date(x.eaten_at).getTime()})});
    const srvIds=new Set(rows.map(x=>x.id));const up=S.diary.filter(e=>e.day>=from&&!srvIds.has(e.id));
    if(up.length)await KTB.upsertDiary(up);
    S.diary.sort((a,b)=>a.ts-b.ts);persist('diary');
  }
  /* Gewicht */
  for(const d of pendingList('weightDel')){if(await KTB.deleteWeight(d))store.set('weightDel',pendingList('weightDel').filter(x=>x!==d))}
  const ws=await KTB.fetchWeights();
  if(ws){
    const wDel=new Set(pendingList('weightDel'));const map=new Map(S.weights.map(w=>[w.day,w]));
    ws.forEach(w=>{if(!map.has(w.day)&&!wDel.has(w.day))map.set(w.day,{day:w.day,kg:+w.kg})});
    const srv2=new Set(ws.map(w=>w.day));for(const w of map.values())if(!srv2.has(w.day))await KTB.upsertWeight(w);
    S.weights=[...map.values()].sort((a,b)=>a.day<b.day?-1:1);persist('weights');
  }
  const mine=await KTB.fetchMyRatings();if(mine){mine.forEach(x=>S.mine[x.recipe_id]=x.stars);persist('mine')}
  await loadCommunity();
  store.set('lastSync',Date.now());
  render(true);refreshDash();
}
function onUserChange(){
  accountLabel();
  if(KTB.user){syncAll()}else{removeCommunity();S.cart=S.cart.filter(e=>BYID[e.id]);loadCommunity();render(true);refreshDash()}
}
window.addEventListener('online',()=>{if(KTB.user)syncAll()});

/* =================== Start =================== */
ACT.account=()=>openAuth();
ACT.tabnop=()=>{};
(async function main(){
  bootApp();
  TABFN.plan=renderPlan;TABFN.vorrat=renderPantry;TABFN.tagebuch=renderDiary;
  $('#btnAccount').addEventListener('click',()=>openAuth());
  $('#btnAddRecipe').addEventListener('click',()=>ACT.addrecipe());
  render(true);renderToday();renderNow();renderCart();route();
  const ready=await KTB.init();
  if(!ready||!KTB.enabled())return;
  $('#btnAccount').hidden=false;$('#btnAddRecipe').hidden=false;accountLabel();
  KTB.onUser(onUserChange);
  await Promise.all([loadStats(),loadCommunity()]);
  if(KTB.user)syncAll();
})();
