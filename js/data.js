/* ============ ZUTATEN ============ */
const AISLE={O:'Obst & Gemüse',F:'Fleisch & Fisch',E:'Eier & Milchprodukte',G:'Getreide & Backen',K:'Konserven & Hülsenfrüchte',N:'Nüsse, Samen & Süßes',W:'Öl & Gewürze'};
const AISLE_ORDER=['O','F','E','G','K','N','W'];
/* id|Name|Einheit|Gang|Preis €|kcal|Eiweiß|Fett|Kohlenhydrate  (je 100 g / 100 ml bzw. je Stück) */
const RAW=`haehn|Hähnchenbrust|g|F|0.85|110|23|1.5|0
schenkel|Hähnchenschenkel|g|F|0.55|180|17|12|0
pute|Putenbrust|g|F|0.95|105|24|1|0
sfilet|Schweinefilet|g|F|1.00|110|22|2|0
nacken|Schweinenacken|g|F|0.80|230|18|17|0
speck|Bacon|g|F|1.30|350|15|32|0.5
schinken|Kochschinken|g|F|1.20|110|20|3|1
hack|Rinderhack|g|F|1.10|250|18|20|0
mischhack|Gemischtes Hack|g|F|0.85|260|17|21|0
steak|Rumpsteak|g|F|2.40|150|21|7|0
gulasch|Rindergulasch|g|F|1.35|140|21|6|0
leber|Rinderleber|g|F|0.70|135|20|4|4
lamm|Lammhack|g|F|1.70|280|17|23|0
lachs|Lachsfilet|g|F|1.90|200|20|13|0
kabeljau|Kabeljaufilet|g|F|1.60|82|18|0.7|0
makrele|Makrelenfilet|g|F|1.20|250|19|19|0
garnele|Garnelen|g|F|2.20|85|18|1|0
thun|Thunfisch (Dose, im eigenen Saft)|g|K|0.90|110|25|1|0
sardine|Sardinen (Dose, in Olivenöl)|g|K|0.90|210|24|12|0
ei|Eier|Stk|E|0.30|75|6.5|5|0.4
milch|Vollmilch|ml|E|0.11|64|3.4|3.6|4.8
sahne|Sahne|ml|E|0.35|300|2.4|31|3.3
joghurt|Vollmilchjoghurt|g|E|0.15|66|4|3.5|4.8
gjoghurt|Griechischer Joghurt|g|E|0.30|120|5|10|4
quark|Speisequark 40 %|g|E|0.25|160|11|11|3
mquark|Magerquark|g|E|0.20|67|12|0.3|4
huettenk|Hüttenkäse|g|E|0.28|100|12|4.5|3
mozz|Mozzarella|g|E|0.40|250|18|19|1
gouda|Gouda|g|E|0.65|350|25|28|0
parm|Parmesan|g|E|1.60|400|36|28|0
feta|Feta|g|E|0.65|260|17|21|1
butter|Butter|g|E|0.75|740|0.7|82|0.6
frisch|Frischkäse|g|E|0.45|250|6|24|3
skyr|Skyr|g|E|0.28|63|11|0.2|4
mascarpone|Mascarpone|g|E|0.60|400|4|42|3
cf|Crème fraîche|g|E|0.35|300|2.5|30|3
hafer|Haferflocken|g|G|0.12|370|13|7|60
reis|Reis|g|G|0.20|350|7|1|77
nudeln|Nudeln|g|G|0.18|355|12|2|72
kart|Kartoffeln|g|O|0.10|75|2|0.1|16
sue|Süßkartoffeln|g|O|0.25|85|1.5|0.1|20
brot|Vollkornbrot|g|G|0.25|240|8|1.5|45
mehl|Weizenmehl|g|G|0.10|340|10|1|70
couscous|Couscous|g|G|0.25|360|13|2|73
bulgur|Bulgur|g|G|0.22|350|12|1.5|70
gries|Grieß|g|G|0.15|350|11|1|72
gnocchi|Gnocchi|g|G|0.30|150|4|0.5|32
linsen|Rote Linsen|g|G|0.20|350|25|1.5|55
mandel|Mandeln|g|N|1.20|600|21|52|5
walnuss|Walnüsse|g|N|1.30|690|15|65|7
erdnussb|Erdnussbutter (pur)|g|N|0.55|600|25|50|12
cashew|Cashewkerne|g|N|1.50|570|18|44|30
haselnuss|Haselnüsse|g|N|1.10|640|15|61|10
kuerbisk|Kürbiskerne|g|N|1.00|560|30|46|5
lein|Leinsamen|g|N|0.40|500|18|40|2
chia|Chiasamen|g|N|1.20|486|17|31|42
sonnenb|Sonnenblumenkerne|g|N|0.50|580|21|50|12
dattel|Datteln|g|N|0.80|280|2|0.5|65
honig|Honig|g|N|0.90|300|0.3|0|80
ahorn|Ahornsirup|ml|N|1.20|260|0|0|67
rosinen|Rosinen|g|N|0.50|300|3|0.5|70
kakao|Backkakao (ungesüßt)|g|N|1.20|230|20|12|10
schoko|Zartbitterschokolade|g|N|0.70|560|7|40|45
banane|Banane|Stk|O|0.25|105|1.3|0.4|27
apfel|Apfel|Stk|O|0.35|80|0.4|0.3|20
beeren|Beeren (TK)|g|O|0.60|50|0.8|0.5|10
avocado|Avocado|Stk|O|1.00|240|3|22|1
zitrone|Zitrone|Stk|O|0.30|20|0.5|0.2|5
zwiebel|Zwiebeln|g|O|0.10|40|1.2|0.1|9
knob|Knoblauch|Stk|O|0.05|4|0.2|0|0.8
paprika|Paprika|g|O|0.35|30|1|0.3|6
tomate|Tomaten|g|O|0.30|18|0.9|0.2|3.5
spinat|Blattspinat (TK)|g|O|0.20|25|3|0.5|1
brokkoli|Brokkoli|g|O|0.25|34|3|0.4|4
zucchini|Zucchini|g|O|0.25|17|1.2|0.3|2
pilze|Champignons|g|O|0.30|22|3|0.3|0.5
karotte|Karotten|g|O|0.10|41|0.9|0.2|9
lauch|Lauch|g|O|0.20|30|2|0.3|5
kuerbis|Hokkaido-Kürbis|g|O|0.20|26|1|0.1|6
erbsen|Erbsen (TK)|g|O|0.20|70|5|0.4|10
gurke|Gurke|g|O|0.15|12|0.6|0.1|2
salat|Blattsalat|g|O|0.25|15|1.3|0.2|2
rotebete|Rote Bete (vorgegart)|g|O|0.20|43|1.6|0.2|8
blumenkohl|Blumenkohl|g|O|0.25|25|2|0.3|3
kraeuter|Frische Kräuter|Stk|O|0.90|10|1|0.2|1
tomdose|Gehackte Tomaten (Dose)|g|K|0.15|20|1|0.2|4
tomatenm|Tomatenmark|g|K|0.35|80|4|0.5|15
kichererbsen|Kichererbsen (Dose)|g|K|0.15|120|7|2.5|17
kidney|Kidneybohnen (Dose)|g|K|0.15|100|7|0.5|15
mais|Mais (Dose)|g|K|0.15|80|2.5|1|15
kokosm|Kokosmilch|ml|K|0.35|170|1.5|17|3
olivenoel|Olivenöl|ml|W|0.60|880|0|100|0
quinoa|Quinoa|g|G|0.55|370|14|6|64
mandelmus|Mandelmus|g|N|1.60|620|21|55|7
erdnuss|Erdnüsse (ungesalzen)|g|N|0.60|590|26|49|8
kokos|Kokosraspeln|g|N|0.90|660|6|65|7
buttermilch|Buttermilch|ml|E|0.10|37|3.4|0.5|4
kefir|Kefir|ml|E|0.14|60|3.3|3.5|4
camembert|Camembert|g|E|0.80|300|20|24|0.5
birne|Birne|Stk|O|0.40|90|0.6|0.2|22
orange|Orange|Stk|O|0.40|60|1.2|0.2|14
raeuchlachs|Räucherlachs|g|F|3.00|190|20|12|0
matjes|Matjesfilet|g|F|1.20|200|16|15|0
pastinake|Pastinaken|g|O|0.35|75|1.2|0.3|18
kohl|Weißkohl|g|O|0.12|25|1.3|0.2|4
rosenkohl|Rosenkohl|g|O|0.40|43|3.4|0.3|8
bohnen|Grüne Bohnen|g|O|0.30|31|1.8|0.2|5
ingwer|Ingwer|g|O|0.40|80|1.8|0.8|18
weissb|Weiße Bohnen (Dose)|g|K|0.15|100|7|0.5|15`;
const ING={};
RAW.split('\n').forEach(l=>{const [id,name,unit,aisle,price,kcal,p,f,c]=l.split('|');ING[id]={id,name,unit,aisle,price:+price,kcal:+kcal,p:+p,f:+f,c:+c}});
ING.gew={id:'gew',name:'Salz, Pfeffer, Gewürze',unit:'',aisle:'W',price:0.05,kcal:0,p:0,f:0,c:0};
const STKW={birne:150,orange:150,ei:55,banane:120,apfel:150,avocado:150,zitrone:60,knob:4,kraeuter:20};
const MEAT={rind:['hack','steak','gulasch','leber'],schwein:['mischhack','sfilet','nacken','speck','schinken'],gefl:['haehn','schenkel','pute'],lamm:['lamm']};
const FISH=['lachs','kabeljau','makrele','garnele','thun','sardine','raeuchlachs','matjes'];
const GLUTEN=['hafer','nudeln','brot','mehl','couscous','bulgur','gries','gnocchi'];
const DAIRY=['milch','sahne','joghurt','gjoghurt','quark','mquark','huettenk','mozz','gouda','parm','feta','butter','frisch','skyr','mascarpone','cf','buttermilch','kefir','camembert'];
const NUTS=['mandel','walnuss','erdnussb','cashew','haselnuss','mandelmus','erdnuss'];
const CARBS=['quinoa','weissb','hafer','reis','nudeln','kart','sue','brot','mehl','couscous','bulgur','gries','gnocchi','linsen','kichererbsen','kidney','mais'];
const FRUIT=['banane','apfel','birne','orange','kokos','beeren','avocado','zitrone','dattel','rosinen','honig','ahorn'];
function groupOf(id){
  for(const k in MEAT) if(MEAT[k].includes(id)) return 'meat';
  if(FISH.includes(id)) return 'fish'; if(id==='ei') return 'egg'; if(DAIRY.includes(id)) return 'dairy';
  if(FRUIT.includes(id)) return 'fruit'; if(CARBS.includes(id)) return 'carb';
  const a=ING[id].aisle; if(a==='N') return 'nut'; if(a==='W') return null; return 'veg';
}
const GROUP_LABEL={meat:'Fleisch',fish:'Fisch',egg:'Ei',dairy:'Milchprodukte',carb:'Beilage',veg:'Gemüse',nut:'Nüsse & Samen',fruit:'Obst & Süßes'};

/* ============ REZEPTE ============ */
const RECIPES=[]; const NAMES=new Set();
function calc(ing){let kcal=0,p=0,f=0,c=0,price=0;for(const [id,q] of ing){const i=ING[id];const m=(i.unit==='g'||i.unit==='ml')?q/100:q;kcal+=i.kcal*m;p+=i.p*m;f+=i.f*m;c+=i.c*m;price+=i.price*m}return{kcal,p,f,c,price}}
function add(name,cats,time,ing,steps,extra){
  if(!extra){ if(NAMES.has(name)) return; NAMES.add(name); }
  const m=new Map(); for(const [id,q] of ing){ if(!ING[id]) throw new Error('Zutat fehlt: '+id+' in '+name); m.set(id,(m.get(id)||0)+q) }
  m.set('gew',1);
  const list=[...m.entries()]; const n=calc(list); const ids=list.map(x=>x[0]);
  const tags=[]; for(const [k,v] of Object.entries(MEAT)) if(ids.some(x=>v.includes(x))) tags.push({rind:'Rind',schwein:'Schwein',gefl:'Geflügel',lamm:'Lamm'}[k]);
  if(ids.some(x=>FISH.includes(x))) tags.push('Fisch'); if(ids.includes('ei')) tags.push('Ei');
  if(!ids.some(x=>Object.values(MEAT).flat().includes(x)||FISH.includes(x))) tags.push('Vegetarisch');
  const rec={id:(extra&&extra.id)||'r'+RECIPES.length,name,cats:[].concat(cats),time:Math.max(5,Math.round(time/5)*5),ing:list,steps,...n,tags,
    gf:!ids.some(x=>GLUTEN.includes(x)),df:!ids.some(x=>DAIRY.includes(x)),nf:!ids.some(x=>NUTS.includes(x)),
    prep:/Auflauf|Gratin|Eintopf|Suppe|Chili|Gulasch|Bolognese|Lasagne|Curry|Dal|Energy|Riegel|Muffins|Kekse|Schmor|Bowl|Overnight|Hackbällchen|Köfte|Nudelauflauf/.test(name),
    slots:slotsOf([].concat(cats),ids,n,time)};
  if(extra)Object.assign(rec,extra);
  RECIPES.push(rec);return rec;
}
/* Tageszeiten: morgen, vormittag, mittag, nachmittag, abend, spaet, pre (vor Training), post (nach Training) */
function slotsOf(cats,ids,n,time){
  const s=new Set();
  if(cats.includes('fruehstueck'))s.add('morgen');
  if(cats.includes('haupt')){s.add('mittag');s.add('abend')}
  if(cats.includes('snack')){s.add('vormittag');s.add('nachmittag')}
  if(cats.includes('shake')){s.add('vormittag');s.add('nachmittag');s.add('post')}
  if(cats.includes('dessert')){s.add('nachmittag');s.add('spaet')}
  const casein=ids.some(x=>['quark','mquark','skyr','huettenk','gjoghurt'].includes(x));
  if(casein&&n.kcal<=650)s.add('spaet');
  if(n.c>=40&&n.f<=25&&time<=25)s.add('pre');
  if(n.p>=28&&n.c>=35)s.add('post');
  if(n.kcal>=750&&!cats.includes('haupt')&&!cats.includes('fruehstueck'))s.delete('vormittag');
  return [...s];
}
const FR='fruehstueck',HA='haupt',SN='snack',DE='dessert',SH='shake';

/* --- Fleisch/Fisch + Sauce + Beilage + Gemüse: kombiniert --- */
const PRO=[
 {n:'Hähnchenbrust',t:15,ing:[['haehn',180],['olivenoel',10]],s:'Hähnchenbrust in Streifen schneiden, salzen und in Olivenöl 6 bis 8 Minuten goldbraun braten.'},
 {n:'Hähnchenschenkel',t:40,ing:[['schenkel',300],['olivenoel',10]],s:'Schenkel salzen, mit Olivenöl einreiben und bei 200 °C etwa 35 Minuten im Ofen knusprig backen.'},
 {n:'Putenbrust',t:15,ing:[['pute',180],['olivenoel',10]],s:'Putenbrust in Streifen schneiden und in Olivenöl 6 Minuten durchbraten.'},
 {n:'Schweinefilet',t:18,ing:[['sfilet',180],['olivenoel',10]],s:'Schweinefilet in Medaillons schneiden und in Olivenöl von jeder Seite 3 bis 4 Minuten braten.'},
 {n:'Schweinenacken',t:18,ing:[['nacken',200],['olivenoel',10]],s:'Nackensteaks salzen und in Olivenöl von jeder Seite 4 bis 5 Minuten kräftig braten.'},
 {n:'Rumpsteak',t:12,ing:[['steak',200],['olivenoel',10]],s:'Steak salzen und in sehr heißer Pfanne 3 Minuten pro Seite braten. Danach 3 Minuten ruhen lassen.'},
 {n:'Rinderhack',t:12,ing:[['hack',160],['olivenoel',10]],s:'Rinderhack in Olivenöl krümelig anbraten, bis es Farbe nimmt.'},
 {n:'Hackfleisch',t:12,ing:[['mischhack',170],['olivenoel',10]],s:'Hackfleisch in Olivenöl krümelig und kräftig anbraten.'},
 {n:'Lammhack',t:12,ing:[['lamm',150],['olivenoel',10]],s:'Lammhack mit Salz und Kreuzkümmel in Olivenöl 8 Minuten krümelig braten.'},
 {n:'Lachsfilet',t:12,ing:[['lachs',170],['olivenoel',10]],s:'Lachs salzen und in Olivenöl 4 Minuten auf der Hautseite und 2 Minuten auf der anderen Seite braten.'},
 {n:'Kabeljau',t:12,ing:[['kabeljau',200],['olivenoel',10]],s:'Kabeljau salzen und in Olivenöl 3 bis 4 Minuten pro Seite glasig braten.'},
 {n:'Garnelen',t:8,ing:[['garnele',150],['knob',1],['olivenoel',10]],s:'Garnelen mit Knoblauch in Olivenöl 2 bis 3 Minuten pro Seite braten.'}];
const SAU=[
 {n:'in Pilzrahm',t:10,ing:[['pilze',100],['sahne',70],['zwiebel',30]],s:'Champignons und Zwiebel in Scheiben in derselben Pfanne anbraten, mit Sahne ablöschen und 5 Minuten einkochen. Das Fleisch kurz in der Sauce ziehen lassen.'},
 {n:'in Käsesahne',t:6,ing:[['sahne',70],['gouda',35]],s:'Sahne erhitzen, geriebenen Gouda darin schmelzen und mit Pfeffer abschmecken.'},
 {n:'in Tomatensauce',t:12,ing:[['tomdose',150],['zwiebel',30],['knob',1],['olivenoel',10]],s:'Zwiebel und Knoblauch anschwitzen, Tomaten zugeben und 10 Minuten einkochen. Das Fleisch darin erwärmen.'},
 {n:'mit Frischkäse-Kräutern',t:4,ing:[['frisch',60],['kraeuter',0.25]],s:'Frischkäse mit gehackten Kräutern und einem Schuss Kochwasser glatt rühren.'},
 {n:'mit Erdnuss-Kokos-Sauce',t:6,ing:[['erdnussb',30],['kokosm',80]],s:'Erdnussbutter mit Kokosmilch bei niedriger Hitze glatt rühren und salzen.'},
 {n:'mit Kräuterbutter',t:4,ing:[['butter',25],['kraeuter',0.25],['knob',1]],s:'Weiche Butter mit gehackten Kräutern, Knoblauch und Salz verrühren und auf das heiße Fleisch geben.'},
 {n:'mit Joghurt-Zitronen-Dip',t:4,ing:[['gjoghurt',90],['zitrone',0.25],['kraeuter',0.25]],s:'Joghurt mit Zitronensaft, Kräutern und Salz verrühren.'}];
const CAR=[
 {n:'Reis',t:15,ing:[['reis',90]],s:'Reis nach Packungsangabe in Salzwasser garen und abgießen.'},
 {n:'Nudeln',t:11,ing:[['nudeln',100]],s:'Nudeln in reichlich Salzwasser bissfest kochen.'},
 {n:'Salzkartoffeln',t:25,ing:[['kart',300]],s:'Kartoffeln schälen, würfeln und 20 Minuten in Salzwasser garen.'},
 {n:'Ofen-Süßkartoffeln',t:30,ing:[['sue',250],['olivenoel',10]],s:'Süßkartoffeln würfeln, mit Olivenöl und Salz mischen und bei 200 °C 25 Minuten backen.'},
 {n:'Couscous',t:6,ing:[['couscous',90],['butter',10]],s:'Couscous mit gleich viel heißem Salzwasser übergießen, 5 Minuten quellen lassen und Butter unterrühren.'},
 {n:'Bulgur',t:12,ing:[['bulgur',90]],s:'Bulgur mit der doppelten Menge Wasser 10 Minuten köcheln und quellen lassen.'},
 {n:'Kartoffelpüree',t:30,ing:[['kart',300],['butter',15],['milch',50]],s:'Kartoffeln weich kochen, mit Butter und heißer Milch zu Püree stampfen.'},
 {n:'gebratenen Gnocchi',t:10,ing:[['gnocchi',200],['butter',10]],s:'Gnocchi in Butter 6 bis 8 Minuten goldbraun braten.'}];
const VEG=[
 {n:'Brokkoli',t:8,ing:[['brokkoli',150]],s:'Brokkoli in Röschen teilen und 5 Minuten dämpfen.'},
 {n:'Karotten',t:10,ing:[['karotte',120],['butter',10]],s:'Karotten in Scheiben schneiden und in Butter 8 Minuten dünsten.'},
 {n:'Zucchini',t:8,ing:[['zucchini',150],['olivenoel',5]],s:'Zucchini in Scheiben in Olivenöl 5 Minuten anbraten.'},
 {n:'Rahmspinat',t:8,ing:[['spinat',150],['sahne',30]],s:'Spinat im Topf auftauen, Sahne zugeben und mit Salz und Muskat abschmecken.'},
 {n:'Erbsen',t:6,ing:[['erbsen',100],['butter',5]],s:'Erbsen 4 Minuten in Butter schwenken.'},
 {n:'Paprika',t:10,ing:[['paprika',120],['olivenoel',5]],s:'Paprika in Streifen schneiden und in Olivenöl 6 Minuten braten.'},
 {n:'Blattsalat',t:5,ing:[['salat',80],['olivenoel',10],['zitrone',0.25]],s:'Salat mit Olivenöl, Zitronensaft und Salz anmachen.'},
 {n:'Blumenkohl',t:12,ing:[['blumenkohl',150],['butter',10]],s:'Blumenkohl in Röschen 8 Minuten dämpfen und mit Butter schwenken.'}];
PRO.forEach((P,i)=>SAU.forEach((S,j)=>[0,1].forEach(k=>{
  const C=CAR[(i*3+j*5+k*2+k)%CAR.length], V=VEG[(i*5+j*3+k*7+i)%VEG.length];
  const t=5+Math.max(C.t,P.t+S.t,V.t);
  add(`${P.n} ${S.n}, dazu ${C.n} und ${V.n}`,HA,t,[...P.ing,...S.ing,...C.ing,...V.ing],
    [C.s,V.s,P.s,S.s,'Alles auf einem Teller anrichten und warm servieren.']);
})));

/* --- Eier --- */
const FILL=[
 {n:'Speck & Zwiebel',ing:[['speck',45],['zwiebel',30]],s:'Bacon und Zwiebel in der Pfanne knusprig anbraten.'},
 {n:'Champignons & Kräutern',ing:[['pilze',90],['kraeuter',0.25]],s:'Champignons in Scheiben anbraten, Kräuter hacken.'},
 {n:'Spinat & Feta',ing:[['spinat',80],['feta',45]],s:'Spinat auftauen und ausdrücken, Feta zerbröseln.'},
 {n:'Tomate & Mozzarella',ing:[['tomate',90],['mozz',60]],s:'Tomaten und Mozzarella würfeln.'},
 {n:'Schinken & Käse',ing:[['schinken',50],['gouda',40]],s:'Schinken würfeln und Käse reiben.'},
 {n:'Paprika & Zwiebel',ing:[['paprika',90],['zwiebel',30]],s:'Paprika und Zwiebel würfeln und 4 Minuten anbraten.'},
 {n:'Avocado & Feta',ing:[['avocado',0.5],['feta',40]],s:'Avocado und Feta würfeln.'},
 {n:'Hack & Käse',ing:[['hack',80],['gouda',30]],s:'Hack krümelig anbraten, Käse reiben.'},
 {n:'Zucchini & Parmesan',ing:[['zucchini',110],['parm',20]],s:'Zucchini raspeln und kurz anbraten, Parmesan reiben.'},
 {n:'Kartoffeln & Speck',ing:[['kart',150],['speck',30],['zwiebel',30]],s:'Kartoffelwürfel mit Speck und Zwiebel 10 Minuten in der Pfanne braten.'},
 {n:'Lachs & Frischkäse',ing:[['lachs',80],['frisch',40]],s:'Lachs in Würfeln 3 Minuten anbraten, Frischkäse dazugeben.'}];
FILL.forEach(F=>{
  add(`Omelett mit ${F.n}`,[FR,HA],10,[['ei',3],['milch',30],['butter',10],['brot',60],...F.ing],[F.s,'Eier mit Milch und Salz verquirlen.','Butter erhitzen, Eimasse hineingeben und bei mittlerer Hitze stocken lassen.','Füllung auf eine Hälfte geben, zusammenklappen und mit Vollkornbrot servieren.']);
  add(`Rührei mit ${F.n}`,[FR,HA],10,[['ei',4],['sahne',30],['butter',10],['brot',60],...F.ing],[F.s,'Eier mit Sahne und Salz verquirlen.','In Butter bei niedriger Hitze unter Rühren cremig garen.','Füllung unterheben und mit Vollkornbrot servieren.']);
  add(`Frittata mit ${F.n}`,[HA,FR],25,[['ei',4],['sahne',40],['olivenoel',10],...F.ing],[F.s,'Eier mit Sahne, Salz und Pfeffer verquirlen.','Über die Füllung in eine ofenfeste Pfanne gießen.','Bei 200 °C etwa 12 Minuten backen, bis die Masse gestockt ist.']);
});

/* --- Toppings für Porridge, Pfannkuchen, Bowls --- */
const TOP=[
 {n:'Banane & Erdnussbutter',ing:[['banane',1],['erdnussb',25]],s:'Bananenscheiben und Erdnussbutter darauf verteilen.'},
 {n:'Apfel & Walnüssen',ing:[['apfel',1],['walnuss',25]],s:'Apfel würfeln, mit gehackten Walnüssen darüberstreuen.'},
 {n:'Beeren & Honig',ing:[['beeren',80],['honig',12]],s:'Beeren auftauen und mit Honig beträufeln.'},
 {n:'Schoko & Haselnuss',ing:[['kakao',10],['haselnuss',25],['banane',1]],s:'Bananenscheiben, gehackte Haselnüsse und Kakao darübergeben.'},
 {n:'Dattel & Mandel',ing:[['dattel',30],['mandel',25]],s:'Datteln klein schneiden und mit gehackten Mandeln darüberstreuen.'},
 {n:'Kürbiskernen & Ahornsirup',ing:[['kuerbisk',20],['ahorn',15]],s:'Kürbiskerne rösten und mit Ahornsirup darüber geben.'},
 {n:'Chia & Beeren',ing:[['chia',15],['beeren',80]],s:'Chiasamen und aufgetaute Beeren darauf verteilen.'},
 {n:'Rosinen & Cashews',ing:[['rosinen',25],['cashew',25]],s:'Rosinen und gehackte Cashewkerne darüberstreuen.'},
 {n:'Banane & Zartbitter',ing:[['banane',1],['schoko',20]],s:'Bananenscheiben und gehobelte Schokolade darüber geben.'}];
TOP.forEach(T=>{
  add(`Porridge mit ${T.n}`,FR,10,[['hafer',70],['milch',250],...T.ing],['Haferflocken mit Milch aufkochen und 5 Minuten unter Rühren köcheln lassen.',T.s]);
  add(`Cremiges Sahne-Porridge mit ${T.n}`,FR,10,[['hafer',80],['milch',200],['sahne',50],...T.ing],['Haferflocken mit Milch und Sahne aufkochen und 5 Minuten köcheln, bis es cremig ist.',T.s]);
  add(`Pfannkuchen mit ${T.n}`,[FR,DE],20,[['mehl',60],['ei',2],['milch',150],['butter',12],...T.ing],['Mehl, Eier, Milch und eine Prise Salz zu glattem Teig verrühren und 5 Minuten quellen lassen.','Butter erhitzen und dünne Pfannkuchen 2 Minuten pro Seite backen.',T.s]);
  add(`Quark-Pfannkuchen mit ${T.n}`,[FR,DE],20,[['mehl',40],['quark',120],['ei',2],['milch',60],['butter',12],...T.ing],['Quark, Eier, Milch und Mehl zu einem dicken Teig verrühren.','Butter erhitzen, kleine Pfannkuchen bei mittlerer Hitze 3 Minuten pro Seite backen.',T.s]);
  [['Quark-Bowl',[['quark',220]]],['Skyr-Bowl',[['skyr',260]]],['Joghurt-Bowl',[['gjoghurt',260]]]].forEach(([bn,bi])=>
    add(`${bn} mit ${T.n}`,[FR,SN],5,[...bi,['hafer',30],...T.ing],['Basis in eine Schüssel geben und Haferflocken darüberstreuen.',T.s]));
});

/* --- Shakes --- */
const SHK=[
 {n:'Banane & Erdnuss',ing:[['banane',1],['erdnussb',30],['hafer',40]]},
 {n:'Schoko & Banane',ing:[['banane',1],['kakao',12],['hafer',40],['honig',10]]},
 {n:'Beeren & Joghurt',ing:[['beeren',100],['joghurt',100],['honig',12]]},
 {n:'Dattel, Schoko & Mandel',ing:[['dattel',40],['mandel',20],['kakao',10]]},
 {n:'Avocado & Honig',ing:[['avocado',0.5],['banane',1],['honig',12]]},
 {n:'Apfel, Hafer & Zimt',ing:[['apfel',1],['hafer',40],['walnuss',15]]},
 {n:'Quark & Beeren',ing:[['mquark',150],['beeren',100],['ahorn',15]]},
 {n:'Skyr & Haselnuss',ing:[['skyr',150],['banane',1],['haselnuss',25]]}];
SHK.forEach(S=>{
  add(`Kraft-Shake ${S.n}`,SH,5,[['milch',300],...S.ing],['Alle Zutaten in den Mixer geben.','60 Sekunden pürieren und sofort trinken.']);
  add(`Extra-cremiger Shake ${S.n}`,SH,5,[['milch',250],['sahne',60],...S.ing],['Alle Zutaten in den Mixer geben.','60 Sekunden pürieren und sofort trinken.']);
});
add('Heißer Kakao mit Sahne',[SH,DE],8,[['milch',300],['sahne',50],['kakao',15],['honig',20]],['Milch mit Sahne erhitzen.','Kakao und Honig einrühren, kurz aufschäumen.']);

/* --- Hauptgerichte klassisch --- */
const H=(n,t,i,s)=>add(n,HA,t,i,s);
H('Spaghetti Carbonara mit Sahne',20,[['nudeln',110],['speck',60],['ei',2],['parm',30],['sahne',50]],['Nudeln in Salzwasser bissfest kochen.','Bacon in Würfeln knusprig auslassen.','Eier, Parmesan und Sahne verrühren.','Nudeln abgießen, mit Bacon mischen und die Eiersahne vom Herd nehmend unterheben, bis sie cremig bindet.']);
H('Nudeln Bolognese',35,[['nudeln',110],['hack',150],['tomdose',200],['tomatenm',20],['zwiebel',50],['karotte',40],['knob',2],['olivenoel',10],['parm',20]],['Zwiebel, Karotte und Knoblauch fein würfeln und in Olivenöl anschwitzen.','Hack zugeben und krümelig braten.','Tomatenmark einrühren, Tomaten zugeben und 20 Minuten köcheln.','Nudeln kochen, mit der Sauce mischen und Parmesan darüberreiben.']);
H('Lasagne mit Hack und Mozzarella',75,[['nudeln',100],['hack',150],['tomdose',200],['sahne',100],['mozz',80],['zwiebel',40],['parm',20]],['Hack mit Zwiebel anbraten, Tomaten zugeben und 15 Minuten köcheln.','Sahne mit Parmesan verrühren.','Nudelplatten, Hacksauce und Sahnesauce schichten, mit Mozzarella abschließen.','Bei 190 °C 40 Minuten backen.']);
H('Chili con Carne mit Reis',45,[['hack',180],['kidney',120],['mais',60],['tomdose',200],['zwiebel',60],['paprika',80],['reis',80],['cf',30]],['Zwiebel und Paprika würfeln und anbraten.','Hack zugeben und krümelig braten.','Tomaten, Bohnen und Mais zugeben und 25 Minuten köcheln.','Reis kochen und das Chili mit Crème fraîche servieren.']);
H('Rindergulasch mit Kartoffelpüree',120,[['gulasch',200],['zwiebel',100],['paprika',60],['tomatenm',20],['kart',300],['butter',15],['milch',50]],['Gulasch scharf anbraten und herausnehmen.','Zwiebeln anschwitzen, Tomatenmark und Paprika zugeben, Fleisch zurückgeben und mit Wasser aufgießen.','90 Minuten zugedeckt schmoren.','Kartoffeln kochen und mit Butter und Milch zu Püree stampfen.']);
H('Linseneintopf mit Speck',35,[['linsen',90],['speck',50],['karotte',80],['kart',150],['zwiebel',50],['tomatenm',15]],['Bacon auslassen, Zwiebel und Karotte darin anschwitzen.','Tomatenmark, Linsen und Kartoffelwürfel zugeben.','Mit Wasser bedecken und 20 Minuten köcheln.']);
H('Kürbissuppe mit Sahne und Bacon',35,[['kuerbis',300],['zwiebel',50],['sahne',100],['speck',40],['kuerbisk',15],['olivenoel',10]],['Kürbis würfeln, mit Zwiebel in Olivenöl anbraten.','Mit Wasser bedecken und 20 Minuten weich kochen.','Sahne zugeben und pürieren.','Bacon knusprig braten und mit Kürbiskernen über die Suppe geben.']);
H('Shakshuka mit Feta und Brot',30,[['ei',3],['tomdose',250],['paprika',100],['zwiebel',50],['feta',50],['brot',60],['olivenoel',10]],['Zwiebel und Paprika in Olivenöl anbraten.','Tomaten zugeben und 10 Minuten einkochen.','Mulden formen, Eier hineingleiten lassen und zugedeckt 6 Minuten stocken lassen.','Feta darüberbröseln und mit Brot servieren.']);
H('Hackbällchen in Tomatensauce mit Nudeln',40,[['mischhack',180],['ei',0.5],['zwiebel',40],['hafer',15],['nudeln',100],['tomdose',200],['parm',20]],['Hack mit Ei, Zwiebel, Haferflocken und Salz verkneten und Bällchen formen.','Bällchen in der Pfanne rundum anbraten.','Tomaten zugeben und 15 Minuten garen.','Nudeln kochen und mit Parmesan servieren.']);
H('Bratkartoffeln mit Speck und Spiegelei',30,[['kart',350],['speck',50],['zwiebel',50],['ei',2],['butter',10]],['Kartoffeln kochen, abkühlen lassen und in Scheiben schneiden.','Speck und Zwiebel in Butter anbraten, Kartoffeln zugeben und knusprig braten.','Spiegeleier braten und auf die Kartoffeln legen.']);
H('Kartoffelgratin mit Schinken',60,[['kart',350],['sahne',150],['gouda',50],['schinken',60],['knob',1]],['Kartoffeln in dünne Scheiben hobeln.','Mit Schinken, Knoblauch und Sahne in eine Form schichten.','Mit Käse bestreuen und bei 190 °C 45 Minuten backen.']);
H('Rösti mit Lachs und Kräuterquark',35,[['kart',300],['ei',1],['olivenoel',20],['lachs',130],['quark',60],['kraeuter',0.25],['zitrone',0.25]],['Kartoffeln roh raspeln, ausdrücken, mit Ei und Salz mischen.','In Olivenöl flache Rösti 5 Minuten pro Seite braten.','Lachs in der Pfanne braten.','Quark mit Kräutern und Zitrone verrühren und alles anrichten.']);
H('Ofenlachs mit Kartoffeln und Spinat-Rahm',40,[['lachs',180],['kart',300],['spinat',150],['sahne',60],['butter',10],['zitrone',0.5]],['Kartoffeln würfeln, mit Butter mischen und bei 200 °C backen.','Nach 15 Minuten den Lachs mit Zitronenscheiben dazulegen.','Spinat mit Sahne in einem Topf erhitzen und würzen.','Alles zusammen servieren.']);
H('Thunfisch-Nudeln mit Tomaten',20,[['nudeln',110],['thun',120],['tomdose',150],['zwiebel',30],['knob',1],['olivenoel',10],['parm',15]],['Nudeln kochen.','Zwiebel und Knoblauch anschwitzen, Tomaten zugeben und 8 Minuten köcheln.','Thunfisch zerzupfen und unterheben.','Mit den Nudeln mischen und Parmesan darüberreiben.']);
H('Makrele mit Bratkartoffeln und Rote Bete',35,[['makrele',150],['kart',300],['rotebete',100],['zwiebel',40],['butter',10],['cf',40]],['Kartoffeln kochen und mit Zwiebel in Butter braten.','Makrele in der Pfanne 3 Minuten pro Seite braten.','Rote Bete in Scheiben mit Crème fraîche anrichten.']);
H('Garnelen-Reispfanne',25,[['garnele',150],['reis',90],['paprika',100],['erbsen',60],['knob',2],['butter',15],['zitrone',0.5]],['Reis garen.','Paprika und Knoblauch in Butter anbraten.','Garnelen und Erbsen zugeben und 4 Minuten braten.','Reis unterheben und mit Zitronensaft abschmecken.']);
H('Steak mit Ofenkartoffeln und Kräuterbutter',45,[['steak',250],['kart',300],['butter',25],['kraeuter',0.5],['knob',1],['olivenoel',10],['salat',60]],['Kartoffeln vierteln, mit Olivenöl mischen und bei 220 °C 30 Minuten backen.','Butter mit Kräutern und Knoblauch verrühren.','Steak 3 Minuten pro Seite braten und ruhen lassen.','Mit Kräuterbutter und Salat servieren.']);
H('Hack-Kartoffel-Pfanne mit Käse',35,[['hack',180],['kart',300],['zwiebel',50],['gouda',50],['paprika',80],['olivenoel',10]],['Kartoffeln in kleinen Würfeln 15 Minuten in Olivenöl braten.','Zwiebel, Paprika und Hack zugeben und weitere 10 Minuten braten.','Käse darüberstreuen und schmelzen lassen.']);
H('Gefüllte Paprika mit Hack und Reis',60,[['paprika',250],['hack',130],['reis',50],['zwiebel',40],['tomdose',100],['mozz',50]],['Reis vorkochen, Hack mit Zwiebel anbraten und mischen.','Paprika halbieren und füllen.','Tomaten in die Form geben, Paprika hineinsetzen, mit Mozzarella belegen und 35 Minuten bei 190 °C backen.']);
H('Zucchini-Hack-Auflauf',50,[['zucchini',250],['hack',150],['sahne',100],['gouda',50],['ei',1],['zwiebel',40]],['Zucchini in Scheiben schneiden, Hack mit Zwiebel anbraten.','Schichten und mit Ei und Sahne übergießen.','Mit Käse bestreuen und bei 190 °C 30 Minuten backen.']);
H('Hähnchen-Curry mit Kokosmilch',35,[['haehn',180],['kokosm',200],['reis',90],['paprika',100],['zwiebel',50],['tomatenm',10],['olivenoel',10]],['Zwiebel und Hähnchenwürfel in Olivenöl anbraten.','Paprika und Tomatenmark zugeben, mit Kokosmilch ablöschen und 15 Minuten köcheln.','Reis kochen und dazu servieren.']);
H('Hähnchen-Brokkoli-Auflauf mit Käse',45,[['haehn',180],['brokkoli',150],['sahne',100],['gouda',50],['nudeln',80]],['Nudeln halb gar kochen.','Hähnchenwürfel kurz anbraten und mit Brokkoli und Nudeln in eine Form geben.','Sahne darübergießen, Käse aufstreuen und 25 Minuten bei 190 °C backen.']);
H('Geschmorter Schweinenacken mit Kartoffelstampf',120,[['nacken',250],['zwiebel',80],['karotte',80],['tomatenm',15],['kart',300],['butter',15],['milch',50]],['Nacken kräftig anbraten, Zwiebel und Karotte zugeben.','Tomatenmark einrühren, mit Wasser aufgießen und zugedeckt 90 Minuten schmoren.','Kartoffeln kochen und mit Butter und Milch stampfen.']);
H('Schweinefilet im Speckmantel mit Kartoffeln und Brokkoli',45,[['sfilet',200],['speck',40],['kart',300],['brokkoli',150],['sahne',50]],['Filet mit Bacon umwickeln und rundum anbraten.','Bei 180 °C 15 Minuten im Ofen garen.','Kartoffeln kochen, Brokkoli dämpfen.','Sahne in der Pfanne kurz einkochen und über das Filet geben.']);
H('Putengeschnetzeltes mit Reis',30,[['pute',180],['pilze',100],['sahne',100],['zwiebel',40],['reis',90],['butter',10]],['Reis garen.','Pute in Streifen in Butter anbraten, Zwiebel und Pilze zugeben.','Mit Sahne aufgießen und 5 Minuten köcheln.']);
H('Lamm-Köfte mit Joghurt und Bulgur',40,[['lamm',170],['zwiebel',40],['kraeuter',0.5],['bulgur',90],['gjoghurt',100],['tomate',100],['gurke',60],['olivenoel',10]],['Lammhack mit Zwiebel, Kräutern und Salz verkneten, Röllchen formen.','In Olivenöl 8 Minuten braten.','Bulgur garen, Tomate und Gurke würfeln.','Mit Joghurt servieren.']);
H('Kichererbsen-Spinat-Pfanne mit Ei',25,[['kichererbsen',200],['spinat',150],['ei',2],['zwiebel',40],['knob',1],['olivenoel',15],['feta',40]],['Zwiebel und Knoblauch in Olivenöl anbraten.','Kichererbsen und Spinat zugeben und 8 Minuten garen.','Eier hineinschlagen und stocken lassen, Feta darüberbröseln.']);
H('Rotes Linsen-Dal mit Kokosmilch und Ei',30,[['linsen',90],['kokosm',150],['zwiebel',50],['tomdose',100],['ei',2],['reis',70]],['Zwiebel anbraten, Linsen, Tomaten und Kokosmilch zugeben.','20 Minuten köcheln, bis die Linsen zerfallen.','Eier hart kochen und mit dem Reis dazu servieren.']);
H('Süßkartoffel-Feta-Blech mit Ei',40,[['sue',300],['feta',60],['ei',2],['zwiebel',40],['olivenoel',15],['kuerbisk',15]],['Süßkartoffeln und Zwiebel würfeln, mit Olivenöl mischen und 25 Minuten bei 200 °C backen.','Feta zugeben und Mulden für die Eier formen.','Eier aufschlagen und 8 Minuten weiterbacken, mit Kürbiskernen bestreuen.']);
H('Blumenkohl-Käse-Gratin mit Speck',45,[['blumenkohl',300],['sahne',100],['gouda',60],['speck',40],['ei',1]],['Blumenkohl 5 Minuten vorgaren.','Mit Bacon in eine Form geben.','Sahne mit Ei verrühren, darübergießen, mit Käse bestreuen und 25 Minuten bei 190 °C backen.']);
H('Pellkartoffeln mit Kräuterquark und Ei',30,[['kart',350],['quark',150],['ei',2],['kraeuter',0.5],['lein',10],['olivenoel',10]],['Kartoffeln in der Schale 25 Minuten kochen, Eier 9 Minuten mitkochen.','Quark mit Kräutern, Leinsamen, Öl und Salz verrühren.','Pellen und mit Quark und Ei servieren.']);
H('Käsenudeln mit Speck',25,[['nudeln',110],['gouda',80],['sahne',100],['milch',100],['butter',10],['speck',30]],['Nudeln kochen.','Butter, Milch und Sahne erhitzen, Käse darin schmelzen.','Bacon knusprig braten.','Alles mischen und servieren.']);
H('Gnocchi-Pfanne mit Hähnchen und Spinat',25,[['gnocchi',200],['haehn',150],['spinat',100],['sahne',80],['parm',15],['olivenoel',10]],['Hähnchen in Würfeln in Olivenöl anbraten.','Gnocchi zugeben und goldbraun braten.','Spinat und Sahne zugeben und 5 Minuten köcheln, Parmesan darüber.']);
H('Lachs-Sahne-Nudeln mit Erbsen',25,[['nudeln',110],['lachs',130],['sahne',100],['erbsen',60],['zitrone',0.25]],['Nudeln kochen.','Lachs würfeln und in der Pfanne 3 Minuten braten.','Sahne und Erbsen zugeben, 4 Minuten köcheln, mit Zitrone abschmecken und mit den Nudeln mischen.']);
H('Rinderhack-Süßkartoffel-Pfanne',35,[['hack',170],['sue',250],['paprika',80],['zwiebel',40],['cf',40]],['Süßkartoffeln in kleine Würfel schneiden und 12 Minuten braten.','Hack, Zwiebel und Paprika zugeben und 10 Minuten weiterbraten.','Mit Crème fraîche servieren.']);
H('Kabeljau mit Kartoffeln und Lauch-Rahm',35,[['kabeljau',200],['kart',300],['lauch',150],['sahne',80],['butter',10]],['Kartoffeln kochen.','Lauch in Ringen in Butter dünsten, Sahne zugeben und einkochen.','Kabeljau in Butter braten und auf dem Lauch-Rahm anrichten.']);
H('Hähnchenschenkel mit Ofengemüse',60,[['schenkel',300],['kart',250],['karotte',100],['zwiebel',60],['olivenoel',20],['knob',2]],['Gemüse würfeln, mit Olivenöl und Knoblauch mischen.','Schenkel salzen und daraufsetzen.','Bei 200 °C 45 Minuten backen.']);
H('Rinderleber mit Apfel, Zwiebeln und Kartoffelpüree',35,[['leber',180],['apfel',1],['zwiebel',80],['kart',300],['butter',25],['milch',50]],['Kartoffeln kochen und mit Butter und Milch stampfen.','Zwiebeln und Apfel in Butter weich braten.','Leber 2 Minuten pro Seite braten und erst am Ende salzen.']);
H('Kaiserschmarrn mit Rosinen',25,[['mehl',80],['ei',3],['milch',200],['butter',20],['rosinen',20],['honig',15]],['Eier trennen, Eigelb mit Milch und Mehl verrühren.','Eiweiß steif schlagen und unterheben.','In Butter backen, wenden, zerreißen und mit Rosinen und Honig karamellisieren.']);

/* --- Frühstück & Snacks --- */
add('Eiersalat mit Joghurt auf Vollkornbrot',[SN,FR],20,[['ei',3],['gjoghurt',50],['brot',80],['kraeuter',0.25]],['Eier 9 Minuten hart kochen und abschrecken.','Mit Joghurt, Kräutern und Salz zerdrücken.','Auf Vollkornbrot streichen.']);
add('Avocadobrot mit zwei Spiegeleiern',[FR,SN],10,[['brot',80],['avocado',1],['ei',2],['zitrone',0.25],['butter',5]],['Avocado mit Zitronensaft und Salz zerdrücken.','Brot toasten und bestreichen.','Spiegeleier in Butter braten und darauflegen.']);
add('Hüttenkäse-Brot mit Tomate und Kürbiskernen',[FR,SN],5,[['brot',80],['huettenk',150],['tomate',80],['kuerbisk',10],['olivenoel',5]],['Brot mit Hüttenkäse bestreichen.','Tomatenscheiben und Kürbiskerne darauflegen und mit Öl beträufeln.']);
add('Erdnussbutter-Bananen-Brot',[FR,SN],5,[['brot',80],['erdnussb',30],['banane',1],['honig',10]],['Brot mit Erdnussbutter bestreichen.','Bananenscheiben darauflegen und mit Honig beträufeln.']);
add('Studentenfutter ohne Zucker',SN,2,[['mandel',30],['walnuss',30],['cashew',20],['rosinen',20],['kuerbisk',15]],['Alles in einer Schale mischen.']);
add('Energy Balls mit Datteln und Erdnussbutter',SN,15,[['dattel',60],['hafer',30],['erdnussb',30],['kakao',5]],['Datteln mit Haferflocken, Erdnussbutter und Kakao fein mixen.','Zu 4 Kugeln formen und kalt stellen.']);
add('Frischkäse-Schinken-Röllchen',SN,10,[['schinken',80],['frisch',60],['gurke',60]],['Schinken mit Frischkäse bestreichen.','Gurkenstifte darauflegen und aufrollen.']);
add('Thunfisch-Dip mit Gemüsesticks',SN,10,[['thun',100],['frisch',60],['karotte',100],['gurke',100],['paprika',80]],['Thunfisch mit Frischkäse und Salz cremig rühren.','Gemüse in Sticks schneiden und dazu servieren.']);
add('Caprese mit Walnüssen',SN,10,[['mozz',125],['tomate',200],['olivenoel',15],['walnuss',20],['kraeuter',0.25]],['Tomaten und Mozzarella in Scheiben schneiden.','Mit Öl, Kräutern und Walnüssen anrichten.']);
add('Käse-Nuss-Teller mit Apfel',SN,5,[['gouda',60],['mandel',30],['apfel',1],['walnuss',20]],['Käse würfeln, Apfel in Spalten schneiden.','Mit Nüssen anrichten.']);
add('Bacon-Ei-Muffins',SN,25,[['ei',3],['speck',40],['gouda',30],['spinat',30]],['Bacon knusprig braten und zerbröseln.','Eier mit Käse und Spinat verquirlen, Bacon zugeben.','In Muffinförmchen bei 180 °C 15 Minuten backen.']);
add('Joghurt mit Honig-Walnüssen',[SN,DE],5,[['gjoghurt',250],['honig',20],['walnuss',30]],['Joghurt in eine Schale geben.','Walnüsse hacken und mit Honig darübergeben.']);
add('Sardinen auf Vollkornbrot',SN,5,[['sardine',100],['brot',80],['zitrone',0.25],['zwiebel',20]],['Brot toasten und mit Sardinen belegen.','Zwiebelringe und Zitronensaft darübergeben.']);
add('Kichererbsen-Dip mit Brot',SN,10,[['kichererbsen',150],['olivenoel',20],['zitrone',0.5],['knob',1],['brot',60]],['Kichererbsen mit Öl, Zitronensaft, Knoblauch und Salz fein pürieren.','Mit Brot servieren.']);
add('Apfel mit Erdnussbutter und Walnüssen',SN,5,[['apfel',2],['erdnussb',30],['walnuss',15]],['Äpfel in Spalten schneiden.','Erdnussbutter zum Dippen und Walnüsse dazu reichen.']);
add('Hartgekochte Eier mit Butterbrot',[SN,FR],15,[['ei',3],['brot',80],['butter',10]],['Eier 9 Minuten kochen und abschrecken.','Brot mit Butter bestreichen und mit den Eiern essen.']);

/* --- Desserts --- */
add('Milchreis mit Zimt und Beeren',DE,40,[['reis',80],['milch',400],['honig',15],['butter',10],['beeren',80]],['Reis mit Milch und Butter aufkochen und 30 Minuten bei niedriger Hitze quellen lassen, dabei oft rühren.','Mit Honig süßen und mit Beeren servieren.']);
add('Grießbrei mit Butter und Rosinen',DE,10,[['gries',60],['milch',350],['butter',10],['honig',20],['rosinen',20]],['Milch aufkochen, Grieß einrühren und 3 Minuten quellen lassen.','Butter, Honig und Rosinen unterrühren.']);
add('Schoko-Sahne-Creme',DE,15,[['schoko',80],['sahne',200],['mascarpone',50]],['Schokolade mit 60 ml Sahne schmelzen und abkühlen lassen.','Restliche Sahne steif schlagen, Mascarpone und Schokolade unterheben.','Mindestens 2 Stunden kalt stellen.']);
add('Bratapfel mit Nüssen und Mandeln',DE,40,[['apfel',2],['mandel',20],['walnuss',20],['honig',15],['butter',10],['rosinen',15]],['Äpfel entkernen.','Nüsse, Rosinen, Honig und Butter mischen und einfüllen.','Bei 180 °C 30 Minuten backen.']);
add('Quarkcreme mit Beeren',DE,10,[['quark',200],['sahne',100],['honig',15],['beeren',100]],['Sahne steif schlagen.','Quark mit Honig glatt rühren und die Sahne unterheben.','Mit Beeren schichten.']);
add('Bananen-Erdnuss-Kekse',DE,25,[['banane',2],['hafer',60],['erdnussb',30]],['Bananen zerdrücken und mit Haferflocken und Erdnussbutter verkneten.','Kleine Kekse formen und bei 180 °C 15 Minuten backen.']);
add('Quarkauflauf mit Rosinen',DE,50,[['quark',250],['ei',2],['gries',30],['honig',20],['rosinen',20],['butter',10]],['Quark, Eier, Grieß und Honig verrühren, Rosinen unterheben.','In eine gebutterte Form geben und 35 Minuten bei 180 °C backen.']);
add('Dattel-Mandel-Riegel',DE,15,[['dattel',80],['mandel',40],['hafer',30],['kakao',5]],['Alles in einem Mixer grob zerkleinern.','In eine Form drücken, kalt stellen und in Riegel schneiden.']);
add('Mascarpone-Beeren-Creme',DE,10,[['mascarpone',100],['gjoghurt',100],['beeren',100],['honig',15],['mandel',15]],['Mascarpone mit Joghurt und Honig glatt rühren.','Mit Beeren schichten und Mandeln darüberstreuen.']);

