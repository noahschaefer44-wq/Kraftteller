/* Kern: Rezeptliste, Filter, Rezeptansicht, Korb, Navigation */
const ACT={};
const CATNAME={fruehstueck:'Frühstück',haupt:'Hauptgericht',snack:'Snack',dessert:'Dessert',shake:'Shake'};
const SLOTNAME=Object.assign(Object.fromEntries(SLOTS.map(s=>[s.k,s.n])),SLOT_EXTRA);
const F={q:'',cat:'',slot:'',prot:new Set(),time:150,price:12,kcal:0,pro:0,diet:new Set(),sort:'rel',fav:false,prep:false,comm:false};
const PAGE=48;let shown=PAGE,cur=[];

/* ---------- Toast ---------- */
let tt;function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),2400)}

/* ---------- Bewertungen ---------- */
function rateOf(id){const s=S.stats[id];return s&&s.n?{avg:s.total/s.n,n:s.n}:null}

/* ---------- Teller-Diagramm ---------- */
function plateSVG(r){
  const R=21,C=2*Math.PI*R,g={};
  for(const [id,q] of r.ing){const k=groupOf(id);if(!k)continue;const w=weight(id,q);if(w<10)continue;g[k]=(g[k]||0)+w}
  const tot=Object.values(g).reduce((a,b)=>a+b,0)||1;let off=0,out='';
  for(const k in g){const len=Math.max(1,g[k]/tot*C-1.6);out+=`<circle class="seg ${k}" cx="32" cy="32" r="${R}" stroke-dasharray="${len.toFixed(2)} ${(C-len).toFixed(2)}" stroke-dashoffset="${(-off).toFixed(2)}" transform="rotate(-90 32 32)"/>`;off+=g[k]/tot*C}
  return `<svg class="plate" viewBox="0 0 64 64" aria-hidden="true"><circle class="bg" cx="32" cy="32" r="31"/>${out}<circle class="hole" cx="32" cy="32" r="12"/></svg>`;
}
function legend(r){const s=new Set();r.ing.forEach(([id])=>{const k=groupOf(id);if(k)s.add(k)});return[...s].map(k=>`<span><i style="background:var(--c-${k})"></i>${GROUP_LABEL[k]}</span>`).join('')}
function macroBar(n){const a=n.p*4,b=n.f*9,c=n.c*4,t=a+b+c||1;return`<div class="bar" title="Kalorienanteil: Eiweiß, Fett, Kohlenhydrate"><i class="p" style="width:${a/t*100}%"></i><i class="f" style="width:${b/t*100}%"></i><i class="c" style="width:${c/t*100}%"></i></div>`}
function badges(r){const b=[];if(r.p>=40)b.push(['Proteinreich',1]);if(r.kcal>=900)b.push(['Kalorienbombe',1]);if(r.time<=10)b.push(['Schnell']);if(r.price<=2)b.push(['Günstig']);if(r.prep)b.push(['Meal-Prep']);if(r.gf)b.push(['Glutenfrei']);if(r.author)b.push(['Community',1]);
  return b.slice(0,3).map(([t,h])=>`<span class="badge${h?' hot':''}">${t}</span>`).join('')}

function card(r,i){
  const rt=rateOf(r.id);
  return`<article class="card" data-act="open" data-id="${r.id}" style="--i:${i%12}">
    <div class="head">${plateSVG(r)}<div class="t"><div class="eyebrow">${CATNAME[r.cats[0]]||''}${r.author?' · von '+esc(r.author):''}</div><h3>${esc(r.name)}</h3></div></div>
    <div class="meta"><div><b>${r.time}′</b><span>Min.</span></div><div><b>${eur0(r.price).replace(' €','€')}</b><span>Portion</span></div><div><b>${num(r.kcal)}</b><span>kcal</span></div><div><b>${num(r.p)} g</b><span>Eiweiß</span></div></div>
    ${macroBar(r)}
    <div class="badges">${badges(r)}${rt?`<span class="stars"><b>★</b> ${one(rt.avg)} (${rt.n})</span>`:''}</div>
    <div class="actions"><button class="btn primary" data-act="add" data-id="${r.id}" type="button">In den Korb</button><button class="btn heart" data-act="fav" data-id="${r.id}" type="button" aria-pressed="${S.favs.has(r.id)}" aria-label="Favorit">${S.favs.has(r.id)?'★':'☆'}</button></div>
  </article>`;
}

/* ---------- Filtern ---------- */
function filtered(){
  const terms=F.q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const a=RECIPES.filter(r=>{
    if(F.cat&&!r.cats.includes(F.cat))return false;
    if(F.slot&&!r.slots.includes(F.slot))return false;
    if(F.prot.size&&![...F.prot].some(t=>r.tags.includes(t)))return false;
    if(F.time<150&&r.time>F.time)return false;
    if(F.price<12&&r.price>F.price)return false;
    if(r.kcal<F.kcal||r.p<F.pro)return false;
    if(F.diet.has('gf')&&!r.gf)return false;if(F.diet.has('df')&&!r.df)return false;if(F.diet.has('nf')&&!r.nf)return false;
    if(F.prep&&!r.prep)return false;
    if(F.fav&&!S.favs.has(r.id))return false;
    if(F.comm&&!r.author)return false;
    if(terms.length){const hay=(r.name+' '+r.ing.map(x=>ING[x[0]].name).join(' ')).toLowerCase();if(!terms.every(t=>hay.includes(t)))return false}
    return true});
  const rt=id=>{const x=rateOf(id);return x?x.avg*10+Math.min(x.n,20)/10:0};
  const SORT={rel:(x,y)=>x.rel-y.rel,kcal:(x,y)=>y.kcal-x.kcal,pro:(x,y)=>y.p-x.p,kpe:(x,y)=>y.kpe-x.kpe,price:(x,y)=>x.price-y.price,time:(x,y)=>x.time-y.time,name:(x,y)=>x.name.localeCompare(y.name,'de'),best:(x,y)=>rt(y.id)-rt(x.id)||x.rel-y.rel};
  return a.sort(SORT[F.sort]);
}
function activeFilterCount(){return(F.q?1:0)+(F.cat?1:0)+(F.slot?1:0)+F.prot.size+(F.time<150?1:0)+(F.price<12?1:0)+(F.kcal?1:0)+(F.pro?1:0)+F.diet.size+(F.fav?1:0)+(F.prep?1:0)+(F.comm?1:0)}
function render(reset){
  if(reset)shown=PAGE;
  cur=filtered();
  $('#count').textContent=`${cur.length} ${cur.length===1?'Rezept':'Rezepte'}`;
  const g=$('#grid');
  if(!cur.length)g.innerHTML=`<div class="empty" style="grid-column:1/-1"><b>Kein Rezept passt.</b>Erhöhe Zeit oder Preis, oder senke die Mindestwerte.<div style="margin-top:14px"><button class="btn" data-act="reset" type="button">Filter zurücksetzen</button></div></div>`;
  else g.innerHTML=cur.slice(0,shown).map(card).join('');
  $('#btnMore').hidden=cur.length<=shown;
  $('#btnMore').textContent=`Mehr Rezepte laden (${cur.length-shown} weitere)`;
  const n=activeFilterCount();$('#filterN').hidden=!n;$('#filterN').textContent=n;
  $('#btnFilterApply').textContent=`${cur.length} Rezepte zeigen`;
}
function syncOutputs(){
  $('#oTime').textContent=F.time>=150?'egal':`${F.time} Min.`;
  $('#oPrice').textContent=F.price>=12?'egal':eur0(F.price);
  $('#oKcal').textContent=F.kcal?`${F.kcal} kcal`:'egal';
  $('#oPro').textContent=F.pro?`${F.pro} g`:'egal';
}
function chipGroup(el,items,onTap){
  $(el).innerHTML=items.map(([k,l])=>`<button class="chip" type="button" data-k="${esc(k)}" aria-pressed="false">${l}</button>`).join('');
  $(el).addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;onTap(b.dataset.k);syncChips();render(true)});
}
function buildChips(){
  chipGroup('#fSlot',[['','Alle'],...SLOTS.map(s=>[s.k,s.n]),['pre','Vor Training'],['post','Nach Training']],k=>F.slot=k);
  chipGroup('#fCats',[['','Alle'],['fruehstueck','Frühstück'],['haupt','Hauptgericht'],['snack','Snack'],['dessert','Dessert'],['shake','Shake']],k=>F.cat=k);
  chipGroup('#fProt',['Rind','Schwein','Geflügel','Lamm','Fisch','Ei','Vegetarisch'].map(x=>[x,x]),k=>F.prot.has(k)?F.prot.delete(k):F.prot.add(k));
  chipGroup('#fQuick',[['5','bis 5 Min.'],['15','bis 15 Min.'],['30','bis 30 Min.'],['60','bis 1 Std.'],['150','egal']],k=>{F.time=+k;$('#fTime').value=k;syncOutputs()});
  chipGroup('#fDiet',[['gf','Glutenfrei'],['df','Ohne Milchprodukte'],['nf','Ohne Nüsse'],['prep','Meal-Prep'],['fav','★ Favoriten'],['comm','Community']],k=>{
    if(k==='fav')F.fav=!F.fav;else if(k==='prep')F.prep=!F.prep;else if(k==='comm')F.comm=!F.comm;else F.diet.has(k)?F.diet.delete(k):F.diet.add(k)});
}
function syncChips(){
  $$('#fSlot .chip').forEach(b=>b.setAttribute('aria-pressed',b.dataset.k===F.slot));
  $$('#fCats .chip').forEach(b=>b.setAttribute('aria-pressed',b.dataset.k===F.cat));
  $$('#fProt .chip').forEach(b=>b.setAttribute('aria-pressed',F.prot.has(b.dataset.k)));
  $$('#fQuick .chip').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.k===F.time));
  $$('#fDiet .chip').forEach(b=>{const k=b.dataset.k;b.setAttribute('aria-pressed',k==='fav'?F.fav:k==='prep'?F.prep:k==='comm'?F.comm:F.diet.has(k))});
}
function resetFilters(){
  Object.assign(F,{q:'',cat:'',slot:'',time:150,price:12,kcal:0,pro:0,sort:'rel',fav:false,prep:false,comm:false});F.prot.clear();F.diet.clear();
  $('#fQ').value='';$('#fTime').value=150;$('#fPrice').value=12;$('#fKcal').value=0;$('#fPro').value=0;$('#fSort').value='rel';
  syncChips();syncOutputs();render(true);
}
function openFilters(on){$('#filters').classList.toggle('show',on);$('#filterVeil').classList.toggle('show',on)}

/* ---------- Overlays ---------- */
function veilUpdate(){$('#veil').classList.toggle('on',$('#modal').classList.contains('on')||$('#drawer').classList.contains('on'))}
function openSheet(html){$('#sheet').innerHTML=html;$('#modal').classList.add('on');veilUpdate();$('#sheet').scrollTop=0;const c=$('#sheet .close');if(c)c.focus()}
function closeModal(){$('#modal').classList.remove('on');veilUpdate()}
function openCart(){$('#drawer').classList.add('on');veilUpdate();renderCart()}
function closeCart(){$('#drawer').classList.remove('on');veilUpdate()}

/* ---------- Rezeptansicht ---------- */
let mId=null,mP=1,mB=new Set();
function stepTimer(s){const m=s.match(/(\d+)(?:\s*(?:bis|–|-)\s*(\d+))?\s*(Minuten|Min\.|Stunden?)/);if(!m)return 0;const v=+(m[2]||m[1]);return/Stunde/.test(m[3])?v*60:v}
function openRecipe(id){mId=id;mP=1;mB=new Set();drawRecipe();}
function drawRecipe(){
  const r=BYID[mId];if(!r)return;const b=[...mB];const n=nutriOf(r,b);const rt=rateOf(r.id);const mine=S.mine[r.id]||0;
  const ing=ingOf(r,b);
  const canRate=window.KTB&&KTB.enabled();
  openSheetKeep(`<button class="btn iconbtn close" type="button" data-act="close" aria-label="Schließen">✕</button>
   <div class="eyebrow">${r.cats.map(c=>CATNAME[c]).join(' · ')} · ${r.tags.join(', ')}${r.author?' · von '+esc(r.author):''}</div>
   <h2 class="title" id="mTitle">${esc(r.name)}</h2>
   ${canRate?`<div class="rate" role="group" aria-label="Bewertung">${[1,2,3,4,5].map(i=>`<button type="button" data-act="rate" data-v="${i}" class="${i<=mine?'on':''}" aria-label="${i} Sterne">★</button>`).join('')}<small>${rt?`${one(rt.avg)} von 5 · ${rt.n} ${rt.n===1?'Bewertung':'Bewertungen'}`:'Noch keine Bewertung'}</small></div>`:''}
   <div class="top-row">${plateSVG(r)}<div class="nutri">
     <div><b>${num(n.kcal)}</b><span>kcal</span></div><div><b>${num(n.p)} g</b><span>Eiweiß</span></div><div><b>${num(n.f)} g</b><span>Fett</span></div><div><b>${num(n.c)} g</b><span>Kohlenhydr.</span></div>
     <div><b>${r.time}′</b><span>Minuten</span></div><div><b>${eur(n.price)}</b><span>je Portion</span></div></div></div>
   ${macroBar(n)}<div class="legend">${legend(r)}</div>
   <div class="legend" style="margin-top:-6px"><span>Passt zu: ${r.slots.filter(s=>SLOTNAME[s]).map(s=>SLOTNAME[s]).join(', ')}</span></div>
   <div class="boost"><h3 class="sh">Kalorien-Booster</h3><div class="chips">${BOOST.map(x=>`<button class="chip" type="button" data-act="boost" data-k="${x.k}" aria-pressed="${mB.has(x.k)}">${x.n}</button>`).join('')}</div></div>
   <div class="cols" style="margin-top:18px"><div><h3>Zutaten für ${mP} ${mP===1?'Portion':'Portionen'}</h3>
      <div class="stepper" style="margin-bottom:8px"><button data-act="mminus" type="button" aria-label="Weniger Portionen">−</button><output>${mP}×</output><button data-act="mplus" type="button" aria-label="Mehr Portionen">+</button></div>
      <ul class="ings">${ing.map(([id,q])=>`<li><span>${esc(ING[id].name)}</span><span>${fmtQty(id,q*mP)}</span></li>`).join('')}</ul></div>
     <div><h3>Zubereitung</h3><ol class="steps">${r.steps.map(s=>{const t=stepTimer(s);return`<li><span>${esc(s)}${t?` <button class="btn sm tm" type="button" data-act="timer" data-min="${t}">⏱ ${t} Min.</button>`:''}</span></li>`}).join('')}</ol></div></div>
   <div class="buy"><div class="price"><span class="eyebrow">${mP}× zusammen</span><b>${eur(n.price*mP)}</b></div>
     <button class="btn heart" data-act="mfav" type="button" aria-pressed="${S.favs.has(r.id)}" aria-label="Favorit" style="width:38px">${S.favs.has(r.id)?'★':'☆'}</button>
     ${r.own?`<button class="btn danger" data-act="delrecipe" data-id="${r.id}" type="button">Löschen</button>`:''}
     <button class="btn" data-act="cook" type="button">Kochmodus</button>
     <button class="btn" data-act="meaten" type="button">Gegessen</button>
     <button class="btn primary" data-act="madd" type="button">${mP}× in den Korb</button></div>`);
}
/* Rezept neu zeichnen ohne Scrollposition zu verlieren */
function openSheetKeep(html){const el=$('#sheet');const st=el.scrollTop;const was=$('#modal').classList.contains('on');el.innerHTML=html;$('#modal').classList.add('on');veilUpdate();el.scrollTop=was?st:0;if(!was){const c=$('#sheet .close');if(c)c.focus()}}
function toggleFav(id){S.favs.has(id)?S.favs.delete(id):S.favs.add(id);persist('fav')}

/* ---------- Korb ---------- */
const bkey=b=>[...b].sort().join(',');
function addCart(id,p=1,b=[]){
  const e=S.cart.find(x=>x.id===id&&bkey(x.b||[])===bkey(b));
  if(e)e.p=Math.min(20,e.p+p);else S.cart.push({id,p,b:[...b]});
  persist('cart');renderCart();
  const n=$('#cartN').parentElement;n.classList.remove('bump');void n.offsetWidth;n.classList.add('bump');
  const nm=BYID[id].name;toast(`„${nm.length>42?nm.slice(0,40)+'…':nm}“ liegt im Korb`);
}
let copyText='',showCopy=false,clearArm=false;
function cartSum(){
  const sum={};let kcal=0,pro=0;
  for(const e of S.cart){const r=BYID[e.id];const n=nutriOf(r,e.b);kcal+=n.kcal*e.p;pro+=n.p*e.p;for(const [id,q] of ingOf(r,e.b))sum[id]=(sum[id]||0)+q*e.p}
  return{sum,kcal,pro};
}
function renderCart(){
  const total=S.cart.reduce((a,e)=>a+e.p,0);$('#cartN').textContent=total;
  const body=$('#cartBody'),foot=$('#cartFoot');
  if(!S.cart.length){body.innerHTML=`<div class="cempty"><b>Dein Korb ist leer.</b>Tippe bei einem Rezept auf „In den Korb“. Die Einkaufsliste entsteht hier automatisch. Ein Wochenplan lässt sich mit einem Klick hineinlegen.</div>`;foot.innerHTML='';return}
  const {sum,kcal,pro}=cartSum();
  const by={};let price=0,saved=0;
  for(const id in sum){(by[ING[id].aisle]=by[ING[id].aisle]||[]).push(id);const c=lineCost(id,sum[id]);if(S.pantry.has(id))saved+=c;else price+=c}
  const target=Math.round(dayGoal());
  const meter=target?`<div><div class="total"><small class="mono">Kalorien im Korb</small><small class="mono">${Math.min(999,Math.round(kcal/target*100))} % eines Tagesziels</small></div><div class="meter" style="margin-top:6px"><i style="width:${Math.min(100,kcal/target*100)}%"></i></div></div>`:'';
  body.innerHTML=`<section><h3>Rezepte</h3>${S.cart.map((e,i)=>{const r=BYID[e.id];const n=nutriOf(r,e.b);return`<div class="centry"><a data-act="open" data-id="${e.id}" data-close="1">${esc(r.name)}${e.b&&e.b.length?` <small>(+${e.b.length} Booster)</small>`:''}</a><button class="rm" data-act="crm" data-i="${i}" type="button" aria-label="Entfernen">×</button>
      <small>${num(n.kcal*e.p)} kcal · ${eur(n.price*e.p)}</small><div class="stepper"><button data-act="cminus" data-i="${i}" type="button" aria-label="Weniger">−</button><output>${e.p}×</output><button data-act="cplus" data-i="${i}" type="button" aria-label="Mehr">+</button></div></div>`}).join('')}</section>
    <section><h3>Einkaufsliste</h3>${AISLE_ORDER.filter(a=>by[a]).map(a=>`<div class="aisle"><h4>${AISLE[a]}</h4>${by[a].sort((x,y)=>ING[x].name.localeCompare(ING[y].name,'de')).map(id=>{const have=S.pantry.has(id);return`<label class="line${S.done.has(id)?' done':''}${have?' have':''}"><input type="checkbox" data-act="cdone" data-ing="${id}" ${S.done.has(id)?'checked':''}><span>${esc(ING[id].name)}${have?' <small class="mono">· im Vorrat</small>':''}</span><span class="q">${fmtQty(id,sum[id])}</span></label>`}).join('')}</div>`).join('')}</section>
    ${showCopy?`<section><h3>Zum Kopieren</h3><textarea class="copybox" id="copyBox" readonly>${esc(copyText)}</textarea></section>`:''}`;
  copyText='Einkaufsliste\n'+AISLE_ORDER.filter(a=>by[a]).map(a=>`\n${AISLE[a]}\n`+by[a].filter(id=>!S.pantry.has(id)).map(id=>{const q=fmtQty(id,sum[id]);return`- ${q==='nach Bedarf'?'':q+' '}${ING[id].name}`}).join('\n')).join('\n');
  foot.innerHTML=`${meter}<div class="total"><span>Geschätzt${saved>0?` <small class="mono muted">(${eur(saved)} im Vorrat)</small>`:''}</span><b>${eur(price)}</b></div><small class="mono muted">${num(kcal)} kcal · ${num(pro)} g Eiweiß insgesamt</small>
    <div class="row"><button class="btn primary" data-act="ccopy" type="button" style="flex:1;justify-content:center">Liste kopieren</button><button class="btn ghost" data-act="cclear" type="button">Korb leeren</button></div>`;
}

/* ---------- Ziel-Rechner ---------- */
function openGoal(){
  const p=S.profile;
  openSheet(`<button class="btn iconbtn close" type="button" data-act="close" aria-label="Schließen">✕</button>
   <div class="eyebrow">Mein Kalorienziel</div><h2 class="title">Wie viel musst du essen?</h2>
   <div class="grid2">
    <div class="field"><label for="cW">Gewicht (kg)</label><input id="cW" type="number" min="30" max="200" inputmode="decimal" value="${p.w}"></div>
    <div class="field"><label for="cH">Größe (cm)</label><input id="cH" type="number" min="120" max="230" inputmode="decimal" value="${p.h}"></div>
    <div class="field"><label for="cA">Alter</label><input id="cA" type="number" min="14" max="90" inputmode="numeric" value="${p.a}"></div>
    <div class="field"><label for="cS">Geschlecht</label><select id="cS"><option value="m"${p.sex==='m'?' selected':''}>männlich</option><option value="f"${p.sex==='f'?' selected':''}>weiblich</option></select></div>
    <div class="field" style="grid-column:1/-1"><label for="cAct">Aktivität</label><select id="cAct">${[['1.4','Überwiegend sitzend'],['1.55','Etwas Bewegung, 1 bis 3 × Training'],['1.75','Aktiv, 4 bis 5 × Training'],['1.9','Sehr aktiv oder körperliche Arbeit']].map(([v,l])=>`<option value="${v}"${+v===p.act?' selected':''}>${l}</option>`).join('')}</select></div>
    <div class="field" style="grid-column:1/-1"><label for="cP">Überschuss: <span id="cPv"></span> kcal pro Tag</label><input id="cP" type="range" min="250" max="800" step="50" value="${p.plus}" style="accent-color:var(--moss)"></div>
    <div class="field" style="grid-column:1/-1"><label for="cM">Mahlzeiten pro Tag</label><select id="cM">${[3,4,5,6].map(n=>`<option${n===(p.meals||4)?' selected':''}>${n}</option>`).join('')}</select></div>
   </div>
   <div class="panel" style="margin-top:14px;background:var(--surface2);border:0"><small class="muted">Tagesziel zum Zunehmen</small><div class="total"><b style="font-size:2.2rem"><span id="rDay">–</span> kcal</b></div><small class="muted"><span id="rMeal">–</span> kcal pro Mahlzeit · <span id="rPro">–</span> g Eiweiß pro Tag</small></div>
   <div class="buy"><button class="btn primary" data-act="applygoal" type="button">Rezepte für eine Mahlzeit filtern</button></div>
   <p class="muted" style="font-size:12.5px">Rechnung nach Mifflin-St-Jeor mit Aktivitätsfaktor. Ein Überschuss von 300 bis 500 kcal bringt meist 0,25 bis 0,5 kg pro Woche.</p>`);
  const upd=()=>{S.profile={w:+$('#cW').value||65,h:+$('#cH').value||178,a:+$('#cA').value||25,sex:$('#cS').value,act:+$('#cAct').value,plus:+$('#cP').value,meals:+$('#cM').value};persist('profile');
    const g=dayGoal();$('#rDay').textContent=num(g);$('#rMeal').textContent=num(g/S.profile.meals);$('#rPro').textContent=num(proteinGoal());$('#cPv').textContent='+'+S.profile.plus;refreshDash()};
  ['#cW','#cH','#cA','#cS','#cAct','#cP','#cM'].forEach(s=>$(s).addEventListener('input',upd));upd();
}

/* ---------- Heute-Karte und Jetzt-Streifen ---------- */
function todayTotals(k=dayKey()){let kcal=0,prot=0,price=0;S.diary.forEach(e=>{if(e.day===k){kcal+=e.kcal;prot+=e.prot||0;price+=e.price||0}});return{kcal,prot,price}}
function ringSVG(pct,label,sub){
  const R=46,C=2*Math.PI*R,v=Math.min(1,pct);
  return`<svg class="ring" viewBox="0 0 118 118" role="img" aria-label="${esc(label)}"><circle class="t" cx="59" cy="59" r="${R}"/><circle class="v${pct>1.05?' v2':''}" cx="59" cy="59" r="${R}" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${(C*(1-v)).toFixed(1)}" transform="rotate(-90 59 59)"/><text x="59" y="60">${label}</text><text class="s" x="59" y="76">${sub}</text></svg>`;
}
function renderToday(){
  const t=todayTotals(),g=dayGoal(),sl=slotNow(),left=Math.max(0,g-t.kcal);
  $('#todayCard').innerHTML=`${ringSVG(t.kcal/g,num(t.kcal),'von '+num(g))}<div><div class="eyebrow">Heute, ${dayLabel(dayKey())}</div><h2>${left>0?`Noch ${num(left)} kcal offen`:'Tagesziel erreicht'}</h2>
    <div class="facts"><span>Eiweiß <b>${num(t.prot)} / ${num(proteinGoal())} g</b></span><span>Jetzt: <b>${sl.n}</b></span></div>
    <div class="row" style="margin-top:12px"><a class="btn primary sm" href="#tagebuch">Eintragen</a><button class="btn sm" data-act="goal" type="button">Ziel anpassen</button></div></div>`;
}
let nowSeed=0;
function nowPicks(sl,k=dayKey()){
  const budget=dayGoal()*sl.share*(S.profile.meals&&S.profile.meals<4?1.15:1);
  let seed=0;for(const c of k+sl.k)seed=(seed*31+c.charCodeAt(0))>>>0;seed+=nowSeed*977;
  const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
  return RECIPES.filter(r=>r.slots.includes(sl.k)).map(r=>({r,s:Math.abs(r.kcal-budget)/budget+rnd()*.5})).sort((a,b)=>a.s-b.s).slice(0,8).map(x=>x.r);
}
function renderNow(){
  const sl=slotNow(),d=new Date(),hh=`${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const picks=nowPicks(sl);
  $('#nowStrip').innerHTML=`<div class="now-head"><h2>Jetzt, ${hh} Uhr: ${sl.n}</h2><div class="row"><span class="muted mono" style="font-size:12px">Ziel etwa ${num(dayGoal()*sl.share)} kcal</span><button class="btn sm" data-act="nowmore" type="button">Andere zeigen</button></div></div>
    <div class="now-list">${picks.map(r=>`<div class="mini" data-act="open" data-id="${r.id}" role="button" tabindex="0"><b>${esc(r.name)}</b><div class="m"><span>${num(r.kcal)} kcal</span><span>${num(r.p)} g Eiweiß</span><span>${r.time}′</span><span>${eur0(r.price)}</span></div>
      <div class="row"><button class="btn sm primary" data-act="add" data-id="${r.id}" type="button">In den Korb</button><button class="btn sm" data-act="eat" data-id="${r.id}" type="button">Gegessen</button></div></div>`).join('')}</div>`;
}
function refreshDash(){renderToday();renderNow();renderCart();if(window.renderActiveTab)renderActiveTab()}

/* ---------- Navigation ---------- */
const TABS=['rezepte','plan','vorrat','tagebuch'];
const TABFN={};
let tab='rezepte';
function route(){
  let t=(location.hash||'#rezepte').slice(1);if(!TABS.includes(t))t='rezepte';
  const changed=t!==tab;tab=t;
  TABS.forEach(x=>{$('#v-'+x).hidden=x!==t});
  $$('[data-tab]').forEach(a=>a.classList.toggle('on',a.dataset.tab===t));
  if(TABFN[t])TABFN[t]();
  if(changed)window.scrollTo(0,0);
}
function renderActiveTab(){if(TABFN[tab])TABFN[tab]()}

/* ---------- Aktionen ---------- */
ACT.open=(el,e)=>{if(e.target.closest('button')&&e.target.closest('button')!==el)return;if(el.dataset.close)closeCart();openRecipe(el.dataset.id)};
ACT.close=()=>closeModal();
ACT.add=(el,e)=>{e.stopPropagation();addCart(el.dataset.id)};
ACT.fav=(el,e)=>{e.stopPropagation();const id=el.dataset.id;toggleFav(id);const on=S.favs.has(id);el.setAttribute('aria-pressed',on);el.textContent=on?'★':'☆';if(F.fav)render(true)};
ACT.reset=()=>resetFilters();
ACT.goal=()=>openGoal();
ACT.nowmore=()=>{nowSeed++;renderNow()};
ACT.applygoal=()=>{F.kcal=Math.min(1400,Math.round(dayGoal()/S.profile.meals/50)*50);$('#fKcal').value=F.kcal;syncOutputs();closeModal();location.hash='#rezepte';render(true);toast(`Filter: ab ${F.kcal} kcal pro Portion`);$('#liste').scrollIntoView()};
ACT.boost=el=>{const k=el.dataset.k;mB.has(k)?mB.delete(k):mB.add(k);drawRecipe()};
ACT.mplus=()=>{mP=Math.min(12,mP+1);drawRecipe()};
ACT.mminus=()=>{mP=Math.max(1,mP-1);drawRecipe()};
ACT.mfav=()=>{toggleFav(mId);drawRecipe();render()};
ACT.madd=()=>{addCart(mId,mP,[...mB]);closeModal()};
ACT.crm=el=>{S.cart.splice(+el.dataset.i,1);persist('cart');renderCart()};
ACT.cplus=el=>{const e=S.cart[+el.dataset.i];e.p=Math.min(20,e.p+1);persist('cart');renderCart()};
ACT.cminus=el=>{const e=S.cart[+el.dataset.i];e.p=Math.max(1,e.p-1);persist('cart');renderCart()};
ACT.cdone=el=>{el.checked?S.done.add(el.dataset.ing):S.done.delete(el.dataset.ing);persist('done');el.closest('.line').classList.toggle('done',el.checked)};
ACT.ccopy=()=>{
  const fb=()=>{showCopy=true;renderCart();const b=$('#copyBox');if(b){b.focus();b.select()}toast('Markiere den Text und kopiere ihn')};
  try{navigator.clipboard.writeText(copyText).then(()=>toast('Einkaufsliste kopiert'),fb)}catch(err){fb()}
};
ACT.cclear=el=>{
  if(!clearArm){clearArm=true;el.textContent='Wirklich leeren?';setTimeout(()=>{clearArm=false;if(el.isConnected)el.textContent='Korb leeren'},3000);return}
  S.cart=[];S.done.clear();clearArm=false;showCopy=false;persist('cart','done');renderCart();toast('Korb geleert');
};

document.addEventListener('click',e=>{
  const a=e.target.closest('[data-act]');
  if(a&&ACT[a.dataset.act]&&a.type!=='checkbox')ACT[a.dataset.act](a,e);
});
document.addEventListener('change',e=>{const a=e.target.closest('[data-act]');if(a&&a.type==='checkbox'&&ACT[a.dataset.act])ACT[a.dataset.act](a,e)});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){if(!$('#cook').hidden&&window.closeCook)closeCook();else{closeModal();closeCart();openFilters(false)}}
  if((e.key==='Enter'||e.key===' ')&&e.target.classList&&e.target.classList.contains('mini')){e.preventDefault();ACT.open(e.target,e)}
});
$('#modal').addEventListener('click',e=>{if(e.target.id==='modal')closeModal()});
$('#veil').addEventListener('click',()=>{closeModal();closeCart()});

/* ---------- Start ---------- */
function bootApp(){
  loadState();
  $('#sN').textContent=RECIPES.length;$('#sQuick').textContent=RECIPES.filter(r=>r.time<=10).length;
  buildChips();syncChips();syncOutputs();
  $('#fQ').addEventListener('input',e=>{F.q=e.target.value;render(true)});
  [['#fTime','time'],['#fPrice','price'],['#fKcal','kcal'],['#fPro','pro']].forEach(([s,k])=>$(s).addEventListener('input',e=>{F[k]=+e.target.value;syncOutputs();syncChips();render(true)}));
  $('#fSort').addEventListener('change',e=>{F.sort=e.target.value;render(true)});
  $('#btnReset').addEventListener('click',resetFilters);
  $('#btnFilters').addEventListener('click',()=>openFilters(true));
  $('#btnFilterClose').addEventListener('click',()=>openFilters(false));
  $('#btnFilterApply').addEventListener('click',()=>{openFilters(false);$('#liste').scrollIntoView()});
  $('#filterVeil').addEventListener('click',()=>openFilters(false));
  $('#btnMore').addEventListener('click',()=>{shown+=PAGE;render()});
  $('#btnCart').addEventListener('click',openCart);
  $('#btnCloseCart').addEventListener('click',closeCart);
  $('#btnRandom').addEventListener('click',()=>{const l=cur.length?cur:RECIPES;openRecipe(l[Math.floor(Math.random()*l.length)].id)});
  $('#btnTheme').addEventListener('click',()=>{
    const r=document.documentElement;const dark=r.dataset.theme?r.dataset.theme==='dark':matchMedia('(prefers-color-scheme: dark)').matches;
    const nx=dark?'light':'dark';r.dataset.theme=nx;store.set('theme',nx)});
  TABFN.rezepte=()=>{};
  window.addEventListener('hashchange',route);
}
