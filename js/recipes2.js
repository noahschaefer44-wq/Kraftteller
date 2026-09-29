/* Weitere Rezept-Familien: einfaches Frühstück, Snacks, Suppen, Bowls, Pfannen, Schmorgerichte */
const Q=(name,cats,time,ing,steps)=>add(name,cats,time,ing,steps);

/* --- Belegte Brote --- */
const BEL=[
 ['Käse und Gurke',[['gouda',40],['gurke',50]],'Käse und Gurkenscheiben darauflegen.'],
 ['Frischkäse und Räucherlachs',[['frisch',40],['raeuchlachs',50]],'Mit Frischkäse bestreichen und den Räucherlachs darauflegen.'],
 ['Quark und Honig',[['quark',60],['honig',12]],'Quark aufstreichen und mit Honig beträufeln.'],
 ['Schinken und Ei',[['schinken',40],['ei',1]],'Ei hart kochen, in Scheiben schneiden und mit Schinken belegen.'],
 ['Avocado und Ei',[['avocado',0.5],['ei',1]],'Avocado zerdrücken, aufstreichen und Eischeiben darauflegen.'],
 ['Camembert und Birne',[['camembert',50],['birne',0.5]],'Camembert und Birnenscheiben darauflegen.'],
 ['Hüttenkäse und Tomate',[['huettenk',60],['tomate',60]],'Hüttenkäse aufstreichen und Tomatenscheiben darauflegen.'],
 ['Matjes und Zwiebel',[['matjes',50],['zwiebel',20],['cf',20]],'Matjes, Zwiebelringe und Crème fraîche daraufgeben.'],
 ['Thunfisch und Frischkäse',[['thun',50],['frisch',30]],'Frischkäse aufstreichen und Thunfisch darauf verteilen.'],
 ['Mozzarella und Tomate',[['mozz',60],['tomate',60]],'Mozzarella und Tomate in Scheiben darauflegen.'],
 ['Rührei und Speck',[['ei',2],['speck',30]],'Speck knusprig braten, Eier rühren und beides auf das Brot geben.'],
 ['Mandelmus und Honig',[['mandelmus',25],['honig',10]],'Mandelmus aufstreichen und mit Honig beträufeln.'],
 ['Frischkäse und Gurke',[['frisch',40],['gurke',50]],'Frischkäse aufstreichen und Gurkenscheiben darauflegen.'],
 ['Gouda und Apfel',[['gouda',40],['apfel',0.5]],'Käse und Apfelscheiben darauflegen.'],
 ['Erdnussbutter und Apfel',[['erdnussb',25],['apfel',0.5]],'Erdnussbutter aufstreichen und Apfelscheiben darauflegen.'],
 ['Kräuterquark und Gurke',[['quark',60],['kraeuter',0.25],['gurke',40]],'Quark mit Kräutern und Salz verrühren, aufstreichen und Gurke darauflegen.'],
 ['Mandelmus und Banane',[['mandelmus',25],['banane',0.5]],'Mandelmus aufstreichen und Bananenscheiben darauflegen.'],
 ['Räucherlachs und Avocado',[['raeuchlachs',50],['avocado',0.5]],'Avocado zerdrücken, aufstreichen und den Lachs darauflegen.'],
 ['Speck und Spiegelei',[['speck',30],['ei',1]],'Speck knusprig braten, Spiegelei braten und auf das Brot legen.'],
 ['Schinken und Camembert',[['schinken',40],['camembert',40]],'Schinken und Camembert in Scheiben darauflegen.'],
 ['Ei und Tomate',[['ei',2],['tomate',60]],'Eier hart kochen, in Scheiben schneiden und mit Tomate belegen.'],
 ['Mascarpone und Beeren',[['mascarpone',40],['beeren',40]],'Mascarpone aufstreichen und aufgetaute Beeren darübergeben.']];
BEL.forEach(([n,ing,s])=>{
  Q(`Vollkornbrot mit ${n}`,[FR,SN],5,[['brot',80],['butter',10],...ing],['Brot mit Butter bestreichen.',s]);
  Q(`Doppelt belegtes Brot mit ${n}`,[FR],7,[['brot',150],['butter',18],...ing.map(([i,q])=>[i,q*1.6])],['Zwei dicke Scheiben Brot mit Butter bestreichen.',s]);
});

/* --- Overnight Oats, Chia, Milchreis --- */
TOP.forEach(T=>{
  Q(`Overnight Oats mit ${T.n}`,FR,5,[['hafer',60],['milch',150],['joghurt',100],...T.ing],['Haferflocken, Milch und Joghurt im Glas verrühren.','Abgedeckt mindestens 6 Stunden oder über Nacht in den Kühlschrank stellen.',T.s]);
  Q(`Protein-Overnight-Oats mit ${T.n}`,FR,5,[['hafer',70],['milch',120],['skyr',120],['sahne',30],...T.ing],['Haferflocken, Milch, Skyr und Sahne im Glas verrühren.','Abgedeckt mindestens 6 Stunden oder über Nacht in den Kühlschrank stellen.',T.s]);
  Q(`Chia-Pudding mit ${T.n}`,[FR,DE],5,[['chia',40],['milch',250],['sahne',40],['honig',10],...T.ing],['Chiasamen mit Milch, Sahne und Honig verrühren.','Nach 10 Minuten noch einmal umrühren und über Nacht im Kühlschrank quellen lassen.',T.s]);
  Q(`Milchreis mit ${T.n}`,DE,40,[['reis',80],['milch',400],['butter',10],...T.ing],['Reis mit Milch und Butter aufkochen und 30 Minuten bei niedriger Hitze quellen lassen, dabei oft rühren.',T.s]);
});
[['Bircher-Müsli mit Mandeln',[['mandel',25]]],['Bircher-Müsli mit Walnüssen',[['walnuss',25]]],['Bircher-Müsli mit Haselnüssen',[['haselnuss',25]]]].forEach(([n,x])=>
  Q(n,FR,10,[['hafer',60],['milch',120],['joghurt',120],['apfel',1],['honig',10],['zitrone',0.25],...x],['Haferflocken mit Milch und Joghurt 10 Minuten quellen lassen.','Apfel grob reiben, mit Zitronensaft und Honig unterrühren.','Nüsse hacken und darüberstreuen.']));

/* --- Eier und Klassiker fürs Frühstück --- */
Q('Spiegeleier mit Speck und Vollkornbrot',FR,10,[['ei',3],['speck',40],['brot',80],['butter',10]],['Speck knusprig braten und herausnehmen.','Eier in Butter braten.','Mit Brot servieren.']);
Q('Weichgekochte Eier mit Butterbrot',FR,8,[['ei',3],['brot',100],['butter',15]],['Eier 6 Minuten kochen und abschrecken.','Brot mit Butter bestreichen und zu den Eiern essen.']);
Q('Eier im Glas mit Kräutern',FR,10,[['ei',3],['butter',10],['brot',60],['kraeuter',0.25]],['Eier 6 Minuten kochen, pellen und im Glas mit Butter, Salz und Kräutern zerdrücken.','Brot dazu servieren.']);
Q('Pochierte Eier auf Avocadobrot',FR,12,[['ei',2],['brot',80],['avocado',1],['zitrone',0.25]],['Wasser mit einem Schuss Essig oder Zitronensaft knapp unter dem Kochen halten.','Eier einzeln 3 Minuten pochieren.','Avocado auf dem Brot zerdrücken, Eier darauflegen.']);
Q('Eier im Kartoffelnest',FR,30,[['kart',250],['butter',15],['milch',40],['ei',2]],['Kartoffeln kochen und mit Butter und Milch zu Püree stampfen.','Zwei Nester auf ein Blech setzen und je ein Ei hineinschlagen.','Bei 200 °C 10 Minuten backen.']);
Q('Bauernfrühstück',HA,30,[['kart',300],['speck',50],['ei',3],['zwiebel',40],['butter',10]],['Gekochte Kartoffeln in Scheiben in Butter braten.','Speck und Zwiebel zugeben.','Eier verquirlen, darübergießen und stocken lassen.']);
Q('Käse-Rührei auf Toast',FR,10,[['ei',3],['gouda',40],['sahne',30],['brot',80],['butter',10]],['Eier mit Sahne verquirlen und in Butter rühren.','Käse unterheben.','Auf geröstetem Brot servieren.']);
Q('Herzhafter Eierkuchen mit Speck',FR,20,[['mehl',60],['ei',2],['milch',150],['speck',40],['butter',10]],['Teig aus Mehl, Eiern, Milch und Salz rühren.','Speck in der Pfanne auslassen, Teig darübergießen.','Von beiden Seiten goldbraun backen.']);
Q('Ofen-Ei im Avocadoboot',FR,25,[['avocado',1],['ei',2],['gouda',20]],['Avocado halbieren und den Kern entfernen, etwas Fruchtfleisch herauslösen.','Ei in jede Hälfte geben, Käse darüberstreuen.','Bei 200 °C 15 Minuten backen.']);
Q('Kartoffelpuffer mit Quark',HA,25,[['kart',300],['ei',1],['mehl',20],['olivenoel',25],['quark',100],['kraeuter',0.25]],['Kartoffeln reiben und ausdrücken, mit Ei, Mehl und Salz mischen.','In Öl flache Puffer goldbraun braten.','Quark mit Kräutern verrühren und dazu servieren.']);
Q('Rührei mit Räucherlachs und Frischkäse',FR,10,[['ei',3],['raeuchlachs',60],['frisch',30],['butter',10],['brot',60]],['Eier in Butter cremig rühren.','Frischkäse unterrühren, Lachs in Streifen daraufgeben.','Mit Brot servieren.']);
Q('Einfaches Käse-Omelett',FR,8,[['ei',3],['gouda',40],['butter',10],['milch',30]],['Eier mit Milch verquirlen und in Butter stocken lassen.','Käse darauf verteilen und zusammenklappen.']);
Q('Haferflocken-Pfannkuchen mit Banane',FR,15,[['hafer',60],['ei',2],['banane',1],['milch',50],['butter',10]],['Alle Zutaten außer Butter fein pürieren.','In Butter kleine Pfannkuchen 2 bis 3 Minuten pro Seite backen.']);
Q('Zwei-Zutaten-Pancakes mit Banane',FR,12,[['ei',2],['banane',1],['hafer',40],['butter',10]],['Banane zerdrücken, mit Eiern und Haferflocken verrühren.','In Butter kleine Pancakes backen.']);

/* --- Frühstück ohne Gluten und Milchprodukte --- */
Q('Rührei mit Speck und Bratkartoffeln',[FR,HA],25,[['ei',3],['speck',40],['kart',200],['olivenoel',10],['zwiebel',30]],['Kartoffeln würfeln und in Öl 12 Minuten braten, Zwiebel und Speck zugeben.','Eier verquirlen, darübergießen und stocken lassen.']);
Q('Süßkartoffel-Hash mit Spiegelei',[FR,HA],30,[['sue',250],['ei',2],['speck',30],['zwiebel',30],['olivenoel',10]],['Süßkartoffeln in kleine Würfel schneiden und in Öl 12 Minuten braten.','Zwiebel und Speck zugeben, weitere 5 Minuten braten.','Spiegeleier daraufsetzen.']);
Q('Avocado-Ei-Schale mit Schinken',[FR,SN],10,[['avocado',1],['ei',3],['schinken',40],['zitrone',0.25],['olivenoel',10]],['Eier 8 Minuten kochen und würfeln.','Avocado würfeln und mit Zitronensaft, Öl und Schinken mischen, Eier unterheben.']);
Q('Kokos-Chia-Pudding mit Beeren',[FR,DE],5,[['chia',40],['kokosm',250],['beeren',80],['honig',10]],['Chiasamen mit Kokosmilch und Honig verrühren.','Nach 10 Minuten nochmal umrühren und über Nacht im Kühlschrank quellen lassen.','Mit aufgetauten Beeren servieren.']);
Q('Kokos-Chia-Pudding mit Banane und Mandeln',[FR,DE],5,[['chia',40],['kokosm',250],['banane',1],['mandel',20]],['Chiasamen mit Kokosmilch verrühren.','Nach 10 Minuten nochmal umrühren und über Nacht quellen lassen.','Bananenscheiben und gehackte Mandeln darübergeben.']);
Q('Bananen-Ei-Pfannkuchen mit Erdnussbutter',FR,12,[['ei',3],['banane',1],['erdnussb',25],['olivenoel',10]],['Banane zerdrücken und mit den Eiern verquirlen.','In Öl kleine Pfannkuchen 2 Minuten pro Seite backen.','Mit Erdnussbutter bestreichen.']);
Q('Kartoffel-Frittata mit Speck',[FR,HA],30,[['ei',4],['kart',200],['speck',40],['zwiebel',30],['olivenoel',10]],['Gekochte Kartoffeln, Speck und Zwiebel in Öl anbraten.','Verquirlte Eier darübergießen.','Bei 200 °C 10 Minuten im Ofen stocken lassen.']);
Q('Hackpfanne mit Ei und Paprika',[FR,HA],20,[['hack',120],['ei',2],['paprika',80],['zwiebel',30],['olivenoel',10]],['Zwiebel und Paprika in Öl anbraten, Hack zugeben und krümelig braten.','Eier darüberschlagen und stocken lassen.']);
Q('Lachs-Rührei mit Avocado',FR,12,[['ei',3],['lachs',80],['avocado',0.5],['olivenoel',10]],['Lachs würfeln und in Öl 3 Minuten braten.','Eier zugeben und rühren, bis sie stocken.','Mit Avocadostücken servieren.']);
Q('Bananen-Kokos-Shake ohne Milch',[FR,SH],5,[['kokosm',250],['banane',2],['dattel',30],['mandelmus',25]],['Alles im Mixer 60 Sekunden pürieren.']);
Q('Reisbrei mit Kokosmilch und Datteln',[FR,DE],25,[['reis',80],['kokosm',300],['dattel',30]],['Reis mit Kokosmilch und etwas Wasser 20 Minuten köcheln, bis er cremig ist.','Datteln klein schneiden und unterrühren.']);

/* --- Snacks --- */
const SNK=[
 ['Nussmix Klassik',3,[['mandel',25],['walnuss',25],['haselnuss',20],['rosinen',15]],['Alles in einer Schale mischen.']],
 ['Cashew-Kürbiskern-Mix',3,[['cashew',30],['kuerbisk',20],['rosinen',15],['kokos',10]],['Alles in einer Schale mischen.']],
 ['Schoko-Nuss-Mix',3,[['haselnuss',30],['mandel',25],['schoko',20],['rosinen',10]],['Schokolade grob hacken und mit allem mischen.']],
 ['Erdnuss-Rosinen-Mix',3,[['erdnuss',40],['rosinen',25],['sonnenb',15]],['Alles in einer Schale mischen.']],
 ['Kokos-Mandel-Mix mit Datteln',5,[['mandel',30],['kokos',15],['dattel',30]],['Datteln klein schneiden und mit den anderen Zutaten mischen.']],
 ['Walnüsse mit Honig',3,[['walnuss',40],['honig',15]],['Walnüsse mit Honig beträufeln.']],
 ['Mandelmus-Löffel mit Banane',3,[['mandelmus',30],['banane',1]],['Banane in Stücke schneiden und mit Mandelmus essen.']],
 ['Gefüllte Datteln mit Frischkäse',8,[['dattel',60],['frisch',40]],['Datteln aufschneiden und entkernen.','Mit Frischkäse füllen.']],
 ['Gefüllte Datteln mit Erdnussbutter',8,[['dattel',60],['erdnussb',30]],['Datteln aufschneiden und entkernen.','Mit Erdnussbutter füllen.']],
 ['Gefüllte Datteln mit Mandelmus und Kokos',8,[['dattel',60],['mandelmus',25],['kokos',5]],['Datteln aufschneiden und entkernen.','Mit Mandelmus füllen und in Kokosraspeln wenden.']],
 ['Datteln im Speckmantel',15,[['dattel',50],['speck',40]],['Datteln entkernen und mit Bacon umwickeln.','Bei 200 °C 10 Minuten im Ofen knusprig backen.']],
 ['Bananenboote mit Erdnussbutter und Schoko',5,[['banane',2],['erdnussb',30],['schoko',20]],['Bananen längs aufschneiden.','Mit Erdnussbutter füllen und Schokolade darüberhobeln.']],
 ['Bananen-Quark-Schale',5,[['banane',1],['quark',150],['honig',10],['walnuss',15]],['Quark mit Honig glatt rühren, Banane und Walnüsse darübergeben.']],
 ['Bananen-Bites mit Schoko',15,[['banane',1],['schoko',30],['erdnussb',15]],['Banane in Scheiben schneiden, mit Erdnussbutter bestreichen und einfrieren.','Schokolade schmelzen, Bissen eintauchen und kalt stellen.']],
 ['Apfel-Sandwiches mit Mandelmus',5,[['apfel',2],['mandelmus',25],['walnuss',15]],['Äpfel in Scheiben schneiden.','Mandelmus und Walnüsse dazwischen setzen.']],
 ['Birne mit Camembert und Walnüssen',5,[['birne',1],['camembert',60],['walnuss',20]],['Birne in Spalten schneiden und mit Käse und Nüssen anrichten.']],
 ['Orange mit Skyr und Mandeln',5,[['orange',1],['skyr',150],['mandel',20]],['Orange filetieren und mit Skyr und Mandeln anrichten.']],
 ['Gefüllte Eier mit Crème fraîche',20,[['ei',3],['cf',30],['kraeuter',0.25]],['Eier 9 Minuten kochen, pellen und halbieren.','Eigelb mit Crème fraîche und Kräutern verrühren und zurückfüllen.']],
 ['Eier mit Avocado',5,[['ei',2],['avocado',1],['zitrone',0.25]],['Eier hart kochen.','Mit Avocado und Zitronensaft anrichten und salzen.']],
 ['Käse-Schinken-Ei-Muffins',30,[['ei',3],['schinken',40],['gouda',30],['paprika',30]],['Alles würfeln und mit den verquirlten Eiern mischen.','In Muffinförmchen bei 180 °C 18 Minuten backen.']],
 ['Ei-Thunfisch-Salat',12,[['ei',2],['thun',80],['cf',30],['gurke',60]],['Eier hart kochen und würfeln.','Mit Thunfisch, Crème fraîche und Gurke mischen.']],
 ['Gouda-Würfel mit Mandeln',3,[['gouda',60],['mandel',25]],['Käse würfeln und mit Mandeln essen.']],
 ['Camembert mit Nüssen und Honig',10,[['camembert',80],['walnuss',20],['honig',10]],['Camembert 8 Minuten bei 200 °C backen.','Mit Nüssen und Honig servieren.']],
 ['Mozzarella-Tomaten-Becher',5,[['mozz',100],['tomate',100],['olivenoel',10]],['Alles würfeln, mit Öl und Salz mischen.']],
 ['Schinken-Käse-Röllchen',5,[['schinken',60],['gouda',40],['gurke',40]],['Käse und Gurke in Stifte schneiden.','In Schinken einrollen.']],
 ['Frischkäse-Kugeln in Walnüssen',10,[['frisch',80],['walnuss',20],['kraeuter',0.25]],['Frischkäse mit Kräutern verrühren und zu Kugeln formen.','In gehackten Walnüssen wälzen.']],
 ['Paprikaschiffchen mit Frischkäse',8,[['paprika',150],['frisch',60],['schinken',30]],['Paprika in Schiffchen schneiden.','Mit Frischkäse und gewürfeltem Schinken füllen.']],
 ['Gefüllte Gurke mit Thunfisch-Creme',10,[['gurke',200],['thun',80],['frisch',40]],['Gurke halbieren und entkernen.','Thunfisch mit Frischkäse verrühren und einfüllen.']],
 ['Hüttenkäse mit Nüssen und Honig',3,[['huettenk',200],['walnuss',20],['honig',10]],['Hüttenkäse in eine Schale geben, Nüsse und Honig darübergeben.']],
 ['Hüttenkäse pikant mit Gurke und Tomate',5,[['huettenk',200],['gurke',60],['tomate',60],['olivenoel',5],['sonnenb',10]],['Gemüse würfeln und mit Hüttenkäse, Öl und Kernen mischen.']],
 ['Hüttenkäse mit Beeren und Mandeln',3,[['huettenk',200],['beeren',80],['mandel',20]],['Beeren auftauen und mit Hüttenkäse und Mandeln mischen.']],
 ['Schoko-Proteinquark',3,[['mquark',250],['kakao',10],['honig',15],['erdnussb',20]],['Alles glatt rühren.']],
 ['Vanille-Quark mit Nüssen',3,[['quark',200],['honig',15],['haselnuss',20]],['Quark mit Honig und Vanille verrühren, Nüsse darüberstreuen.']],
 ['Skyr mit Erdnussbutter und Banane',3,[['skyr',250],['erdnussb',25],['banane',1]],['Skyr in eine Schale geben, Banane und Erdnussbutter darauf verteilen.']],
 ['Kefir-Beeren-Becher',5,[['kefir',300],['beeren',100],['hafer',20],['honig',10]],['Kefir mit aufgetauten Beeren, Haferflocken und Honig verrühren.']],
 ['Ofen-Kartoffelchips',35,[['kart',250],['olivenoel',15]],['Kartoffeln hauchdünn hobeln und mit Öl und Salz mischen.','Auf Backpapier bei 200 °C 20 bis 25 Minuten knusprig backen.']],
 ['Süßkartoffel-Pommes mit Quarkdip',40,[['sue',250],['olivenoel',15],['quark',60],['kraeuter',0.25]],['Süßkartoffeln in Stifte schneiden, mit Öl mischen und bei 220 °C 25 Minuten backen.','Quark mit Kräutern und Salz verrühren.']],
 ['Geröstete Kichererbsen',30,[['kichererbsen',200],['olivenoel',10]],['Kichererbsen abtropfen und trocknen, mit Öl und Salz mischen.','Bei 200 °C 25 Minuten knusprig backen.']],
 ['Mini-Frikadellen',25,[['mischhack',150],['ei',0.5],['hafer',10],['zwiebel',20],['olivenoel',10]],['Hack mit Ei, Haferflocken, Zwiebel und Salz verkneten.','Kleine Bällchen formen und 8 Minuten in Öl braten.']],
 ['Hähnchen-Bites',15,[['haehn',150],['olivenoel',10],['kraeuter',0.25]],['Hähnchen in Würfel schneiden.','In Öl 6 Minuten braten und mit Kräutern bestreuen.']],
 ['Knusprige Bacon-Streifen',15,[['speck',60]],['Bacon auf ein Blech legen und bei 200 °C 10 bis 12 Minuten knusprig backen.']],
 ['Sardinen-Avocado-Schiffchen',8,[['sardine',100],['avocado',1],['zitrone',0.25]],['Avocado halbieren und entkernen.','Sardinen einlegen und mit Zitronensaft beträufeln.']],
 ['Thunfisch-Reis-Schale',15,[['reis',80],['thun',100],['mais',40],['olivenoel',10]],['Reis garen.','Mit Thunfisch, Mais und Öl mischen.']],
 ['Kartoffelsalat mit Ei und Speck',30,[['kart',250],['ei',2],['speck',30],['cf',40],['zwiebel',30],['gurke',40]],['Kartoffeln kochen, pellen und in Scheiben schneiden.','Speck auslassen, mit Zwiebel, Crème fraîche und Gurke mischen und unter die Kartoffeln heben.','Eier hart kochen und dazu essen.']]];
SNK.forEach(([n,t,i,s])=>Q(n,SN,t,i,s));

/* --- Einfache Hauptgerichte --- */
Q('Reis mit Butter, Ei und Parmesan',[HA,SN],18,[['reis',90],['butter',15],['ei',2],['parm',15]],['Reis garen.','Spiegeleier braten.','Reis mit Butter und Parmesan mischen und die Eier darauflegen.']);
Q('Nudeln mit Butter und Parmesan',[HA,SN],12,[['nudeln',120],['butter',20],['parm',25]],['Nudeln bissfest kochen.','Mit Butter und Parmesan schwenken.']);
Q('Nudeln mit Schinken-Sahne',HA,20,[['nudeln',110],['schinken',60],['sahne',100],['erbsen',40],['parm',15]],['Nudeln kochen.','Schinken anbraten, Sahne und Erbsen zugeben und 4 Minuten köcheln.','Mit den Nudeln mischen und Parmesan darüberreiben.']);
Q('Nudeln mit Tomatensauce und Käse',HA,20,[['nudeln',120],['tomdose',200],['zwiebel',30],['olivenoel',10],['gouda',50]],['Nudeln kochen.','Zwiebel anschwitzen, Tomaten zugeben und 10 Minuten köcheln.','Nudeln mit Sauce und geriebenem Käse servieren.']);
Q('Quarkkartoffeln mit Leinsamen',HA,30,[['kart',350],['quark',180],['lein',10],['kraeuter',0.5],['olivenoel',10]],['Kartoffeln kochen.','Quark mit Kräutern und Leinsamen verrühren und dazu servieren.']);
Q('Kartoffeln mit Spiegelei und Spinat',HA,30,[['kart',300],['ei',2],['spinat',150],['sahne',40],['butter',10]],['Kartoffeln kochen.','Spinat mit Sahne erhitzen.','Spiegeleier in Butter braten und alles anrichten.']);

/* --- Suppen: Basis + Einlage --- */
const SBASE=[
 {n:'Kürbissuppe',ing:[['kuerbis',300],['zwiebel',40],['olivenoel',10],['sahne',80]],s:'Kürbis und Zwiebel würfeln, in Öl anbraten, mit Wasser bedecken und 20 Minuten weich kochen. Sahne zugeben.'},
 {n:'Kartoffelsuppe',ing:[['kart',250],['lauch',80],['zwiebel',30],['butter',10],['sahne',80]],s:'Kartoffeln, Lauch und Zwiebel in Butter anschwitzen, mit Wasser bedecken und 20 Minuten kochen. Sahne zugeben.'},
 {n:'Karotten-Ingwer-Suppe',ing:[['karotte',250],['ingwer',10],['kokosm',100],['zwiebel',30]],s:'Karotten, Ingwer und Zwiebel würfeln, mit Wasser bedecken und 20 Minuten kochen. Kokosmilch zugeben.'},
 {n:'Brokkolicremesuppe',ing:[['brokkoli',250],['kart',100],['sahne',80],['zwiebel',30]],s:'Brokkoli, Kartoffel und Zwiebel mit Wasser bedecken und 15 Minuten kochen. Sahne zugeben.'},
 {n:'Tomatencremesuppe',ing:[['tomdose',300],['zwiebel',40],['sahne',80],['olivenoel',10],['knob',1]],s:'Zwiebel und Knoblauch in Öl anschwitzen, Tomaten zugeben und 15 Minuten köcheln. Sahne zugeben.'},
 {n:'Lauchcremesuppe',ing:[['lauch',200],['kart',100],['sahne',80],['butter',10]],s:'Lauch in Butter anschwitzen, Kartoffeln zugeben, mit Wasser bedecken und 20 Minuten kochen. Sahne zugeben.'}];
const SEIN=[
 {n:'Bacon',ing:[['speck',40]],s:'Bacon knusprig braten und über die Suppe geben.'},
 {n:'Hackfleisch',ing:[['hack',100],['olivenoel',5]],s:'Hackfleisch krümelig anbraten und in die Suppe geben.'},
 {n:'Hähnchen',ing:[['haehn',120],['olivenoel',5]],s:'Hähnchen würfeln, braten und in die Suppe geben.'},
 {n:'Ei und Brot-Croutons',ing:[['ei',1],['brot',60],['butter',10]],s:'Ei hart kochen. Brot würfeln, in Butter rösten und mit dem Ei zur Suppe reichen.'},
 {n:'Lachs',ing:[['lachs',100],['olivenoel',5]],s:'Lachs würfeln, 3 Minuten braten und auf die Suppe legen.'},
 {n:'Käse-Croutons',ing:[['gouda',40],['brot',50]],s:'Brot würfeln, mit Käse bestreuen und im Ofen bei 200 °C 5 Minuten überbacken.'}];
SBASE.forEach(B=>SEIN.forEach(E=>Q(`${B.n} mit ${E.n}`,HA,35,[...B.ing,...E.ing],[B.s,'Mit dem Stabmixer fein pürieren.',E.s,'Suppe mit der Einlage servieren.'])));

/* --- Gefüllte Ofenkartoffeln --- */
const OFK=[
 ['Hack und Käse',[['hack',100],['gouda',40]],'Hack krümelig anbraten und mit Käse bestreuen.'],
 ['Räucherlachs und Frischkäse',[['raeuchlachs',60],['frisch',50]],'Frischkäse in die Kartoffel geben und den Lachs darauflegen.'],
 ['Speck und Crème fraîche',[['speck',40],['cf',50]],'Bacon knusprig braten und mit Crème fraîche in die Kartoffel geben.'],
 ['Kräuterquark',[['quark',120],['kraeuter',0.5]],'Quark mit Kräutern und Salz verrühren und einfüllen.'],
 ['Thunfisch und Mais',[['thun',100],['mais',40],['cf',30]],'Thunfisch mit Mais und Crème fraîche mischen und einfüllen.'],
 ['Hähnchen und Brokkoli',[['haehn',120],['brokkoli',100],['gouda',30]],'Hähnchen und Brokkoli anbraten, einfüllen und mit Käse überbacken.'],
 ['Feta und Spinat',[['feta',60],['spinat',100]],'Spinat auftauen und mit Feta mischen.'],
 ['Schinken und Käse',[['schinken',60],['gouda',40],['sahne',30]],'Schinken mit Sahne erwärmen, einfüllen und mit Käse überbacken.'],
 ['Chili-Hack und Bohnen',[['hack',100],['kidney',60],['tomdose',60]],'Hack anbraten, mit Bohnen und Tomaten 10 Minuten köcheln und einfüllen.'],
 ['Ei und Speck',[['ei',2],['speck',30]],'Speck braten, Kartoffeln aufdrücken, Ei aufschlagen und 8 Minuten weiterbacken.'],
 ['Champignons und Rahm',[['pilze',100],['sahne',50],['gouda',20]],'Pilze braten, Sahne zugeben, einfüllen und mit Käse überbacken.'],
 ['Lamm und Joghurt',[['lamm',100],['gjoghurt',60],['tomate',50]],'Lammhack anbraten, einfüllen und mit Joghurt und Tomate toppen.']];
OFK.forEach(([n,ing,s])=>Q(`Ofenkartoffel mit ${n}`,HA,65,[['kart',350],['butter',10],...ing],['Kartoffeln waschen, mehrfach einstechen und bei 200 °C 55 Minuten backen.',s,'Kartoffeln aufschneiden, mit Butter und Füllung anrichten.']));

/* --- Protein-Bowls --- */
const BOWLB=[
 {n:'Reis',t:15,ing:[['reis',80]],s:'Reis garen und abgießen.'},
 {n:'Couscous',t:6,ing:[['couscous',80],['butter',8]],s:'Couscous mit heißem Salzwasser übergießen, 5 Minuten quellen lassen, Butter unterrühren.'},
 {n:'Bulgur',t:12,ing:[['bulgur',80]],s:'Bulgur mit doppelter Menge Wasser 10 Minuten garen.'},
 {n:'Quinoa',t:15,ing:[['quinoa',80]],s:'Quinoa heiß abspülen und in doppelter Menge Salzwasser 12 Minuten garen.'}];
const BOWLD=[
 {n:'Joghurt-Zitronen-Dressing',ing:[['gjoghurt',70],['zitrone',0.25]],s:'Joghurt mit Zitronensaft und Salz verrühren.'},
 {n:'Erdnuss-Kokos-Dressing',ing:[['erdnussb',25],['kokosm',60]],s:'Erdnussbutter mit Kokosmilch glatt rühren.'},
 {n:'Kräuter-Frischkäse-Dressing',ing:[['frisch',40],['kraeuter',0.25],['olivenoel',5]],s:'Frischkäse mit Kräutern, Öl und etwas Wasser glatt rühren.'}];
PRO.forEach((P,i)=>BOWLB.forEach((B,j)=>{
  const D=BOWLD[(i+j)%3];
  Q(`${P.n}-Bowl mit ${B.n} und ${D.n}`,HA,5+Math.max(B.t,P.t),[...P.ing,...B.ing,['avocado',0.5],['gurke',60],['tomate',60],...D.ing],[B.s,P.s,'Avocado, Gurke und Tomate in Stücke schneiden.',D.s,'Alles in einer Schüssel anrichten.']);
}));

/* --- Kartoffelpfannen --- */
const KPV=[
 {n:'Paprika und Käse',ing:[['zwiebel',50],['paprika',100],['gouda',40]],s:'Zwiebel und Paprika zugeben, 8 Minuten mitbraten und mit Käse bestreuen.'},
 {n:'Champignons und Lauch',ing:[['pilze',100],['lauch',80],['sahne',60]],s:'Pilze und Lauch zugeben, 8 Minuten braten und mit Sahne ablöschen.'},
 {n:'Zucchini und Feta',ing:[['zucchini',100],['tomate',100],['feta',40]],s:'Zucchini und Tomate zugeben, 8 Minuten braten und Feta darüberbröseln.'}];
['haehn','pute','sfilet','nacken','hack','mischhack','lamm','lachs'].forEach(id=>{
  const P=PRO.find(x=>x.ing[0][0]===id);
  KPV.forEach(V=>Q(`Kartoffelpfanne mit ${P.n} und ${V.n}`,HA,35,[['kart',300],['olivenoel',10],...P.ing,...V.ing],['Kartoffeln in kleine Würfel schneiden und 12 Minuten in Olivenöl braten.',P.s,V.s,'Alles vermengen und heiß servieren.']));
});

/* --- Nudelaufläufe --- */
const NP=[...PRO.filter(p=>['haehn','pute','hack','mischhack','sfilet','lachs'].includes(p.ing[0][0])),
 {n:'Thunfisch',t:3,ing:[['thun',120]],s:'Thunfisch abtropfen lassen und zerzupfen.'},
 {n:'Schinken',t:3,ing:[['schinken',80]],s:'Schinken würfeln.'}];
const NS=[
 {n:'Tomate und Mozzarella',ing:[['tomdose',200],['mozz',70]],s:'Tomaten würzen und über die Nudeln geben, Mozzarella zerpflücken und darauf verteilen.'},
 {n:'Sahne und Käse',ing:[['sahne',120],['gouda',50]],s:'Sahne mit Pfeffer verrühren, über die Nudeln gießen und Käse darüberstreuen.'}];
NP.forEach(P=>NS.forEach(S=>Q(`Nudelauflauf mit ${P.n} in ${S.n}`,HA,50,[['nudeln',100],...P.ing,...S.ing],['Nudeln 3 Minuten kürzer als angegeben kochen.',P.s,'Nudeln und Fleisch oder Fisch in eine Form geben.',S.s,'Bei 200 °C 20 Minuten überbacken.'])));

/* --- Schmorgerichte, Eintöpfe, Fisch --- */
H('Rinderschmorbraten mit Kartoffeln und Karotten',150,[['gulasch',250],['zwiebel',80],['karotte',100],['kart',300],['tomatenm',20],['butter',10]],['Fleisch in Butter kräftig anbraten.','Zwiebel, Karotte und Tomatenmark zugeben, mit Wasser aufgießen und 100 Minuten schmoren.','Kartoffeln zugeben und weitere 25 Minuten garen.']);
H('Hähnchen-Schmortopf mit Kartoffeln und Pilzen',60,[['schenkel',300],['kart',250],['pilze',100],['zwiebel',50],['sahne',60]],['Schenkel in einem Topf anbraten.','Zwiebel, Pilze und Kartoffeln zugeben, mit Wasser halb bedecken und 40 Minuten schmoren.','Sahne einrühren.']);
H('Schweinebraten mit Kohl und Kartoffeln',100,[['nacken',250],['kohl',200],['kart',250],['zwiebel',60],['butter',10]],['Nacken salzen und bei 180 °C 60 Minuten im Ofen braten.','Kohl in Streifen und Kartoffeln in Butter dünsten.','Aufschneiden und mit Beilagen servieren.']);
H('Lamm-Eintopf mit weißen Bohnen',45,[['lamm',170],['weissb',120],['tomdose',150],['zwiebel',50],['knob',2]],['Lammhack mit Zwiebel und Knoblauch anbraten.','Tomaten und Bohnen zugeben.','25 Minuten köcheln.']);
H('Irish Stew mit Lamm',60,[['lamm',170],['kart',250],['karotte',100],['zwiebel',60],['kohl',80]],['Alles grob würfeln.','Lammhack anbraten, Gemüse zugeben und mit Wasser bedecken.','40 Minuten köcheln.']);
H('Weißkohl-Hack-Topf',40,[['mischhack',170],['kohl',250],['zwiebel',50],['kart',150],['tomatenm',15],['sahne',50]],['Hack mit Zwiebel anbraten.','Kohl, Kartoffelwürfel und Tomatenmark zugeben, mit Wasser halb bedecken.','25 Minuten garen, Sahne einrühren.']);
H('Rosenkohl-Speck-Pfanne mit Kartoffeln',35,[['rosenkohl',200],['speck',50],['kart',250],['sahne',50]],['Kartoffeln kochen und würfeln.','Speck auslassen, Rosenkohl und Kartoffeln 12 Minuten braten.','Sahne zugeben und kurz einkochen.']);
H('Grüne Bohnen mit Hackfleisch und Kartoffeln',35,[['bohnen',200],['mischhack',150],['kart',250],['zwiebel',40]],['Kartoffeln kochen.','Hack mit Zwiebel anbraten, Bohnen zugeben und 10 Minuten garen.','Mit den Kartoffeln servieren.']);
H('Schweinefilet mit Pastinaken-Kartoffel-Stampf',35,[['pastinake',150],['kart',200],['butter',15],['sfilet',180],['sahne',30]],['Pastinaken und Kartoffeln weich kochen und mit Butter und Sahne stampfen.','Filet in Scheiben 4 Minuten pro Seite braten.']);
H('Weiße-Bohnen-Suppe mit Speck',35,[['weissb',150],['speck',50],['kart',120],['zwiebel',40],['karotte',60]],['Speck auslassen, Zwiebel und Karotte anschwitzen.','Kartoffelwürfel und Bohnen zugeben, mit Wasser bedecken und 20 Minuten kochen.']);
H('Lachs-Spinat-Auflauf mit Kartoffeln',50,[['lachs',150],['spinat',150],['kart',250],['sahne',100],['gouda',30]],['Kartoffeln in Scheiben vorkochen.','Mit Spinat, Lachswürfeln und Sahne in eine Form schichten.','Mit Käse bestreuen und 25 Minuten bei 190 °C backen.']);
H('Fischpfanne mit Kabeljau, Garnelen und Reis',30,[['kabeljau',120],['garnele',80],['reis',80],['paprika',80],['sahne',50],['olivenoel',10]],['Reis garen.','Paprika in Öl anbraten, Fisch und Garnelen zugeben und 5 Minuten braten.','Sahne einrühren und mit dem Reis servieren.']);
H('Makrele mit Kartoffelsalat',35,[['makrele',150],['kart',250],['zwiebel',30],['gurke',50],['cf',40]],['Kartoffeln kochen, pellen und in Scheiben schneiden.','Mit Zwiebel, Gurke und Crème fraîche mischen.','Makrele 3 Minuten pro Seite braten.']);
H('Matjes mit Pellkartoffeln und Apfel-Quark',30,[['matjes',120],['kart',350],['quark',100],['zwiebel',30],['apfel',0.5]],['Kartoffeln in der Schale kochen.','Quark mit Apfelwürfeln und Zwiebel verrühren.','Mit Matjes servieren.']);
H('Thunfisch-Kartoffel-Salat mit Ei',30,[['thun',120],['kart',300],['ei',2],['zwiebel',30],['olivenoel',15],['gurke',50]],['Kartoffeln und Eier kochen.','Alles würfeln, mit Thunfisch und Öl mischen.']);
H('Sardinen-Nudeln mit Tomaten',20,[['nudeln',110],['sardine',100],['tomdose',150],['knob',2]],['Nudeln kochen.','Knoblauch anschwitzen, Tomaten und Sardinen zugeben und 6 Minuten köcheln.','Mit den Nudeln mischen.']);

/* --- Mehr Süßes --- */
Q('Bananenbrot mit Walnüssen',DE,60,[['mehl',80],['banane',2],['ei',1],['butter',30],['honig',15],['walnuss',20]],['Bananen zerdrücken und mit Ei, Butter und Honig verrühren.','Mehl und Walnüsse unterheben.','In einer Form bei 180 °C 40 Minuten backen.']);
Q('Bratbananen mit Honig und Nüssen',DE,10,[['banane',2],['butter',15],['honig',10],['walnuss',20]],['Bananen längs halbieren und in Butter 2 Minuten pro Seite braten.','Mit Honig und Nüssen servieren.']);
Q('Kokos-Milchreis',DE,40,[['reis',80],['kokosm',200],['milch',200],['honig',15],['kokos',10]],['Reis mit Kokosmilch und Milch 30 Minuten köcheln.','Mit Honig süßen und Kokosraspeln darüberstreuen.']);
Q('Avocado-Schoko-Pudding',DE,10,[['avocado',1],['dattel',40],['kakao',15],['milch',50]],['Alle Zutaten fein pürieren und kalt stellen.']);
Q('Haselnuss-Schoko-Aufstrich auf Brot',[DE,SN],10,[['haselnuss',60],['kakao',15],['honig',20],['butter',20],['brot',80]],['Haselnüsse rösten und fein mixen.','Kakao, Honig und weiche Butter einarbeiten.','Auf Brot streichen.']);
Q('Joghurt-Beeren-Eis',DE,10,[['gjoghurt',250],['beeren',100],['honig',15]],['Alles pürieren und mindestens 3 Stunden einfrieren.']);

/* --- Mehr Shakes --- */
[['Kefir-Shake mit Beeren und Hafer',[['kefir',300],['beeren',100],['hafer',40],['honig',10]]],
 ['Buttermilch-Bananen-Shake',[['buttermilch',300],['banane',1],['hafer',40],['honig',10]]],
 ['Kokos-Schoko-Shake',[['kokosm',200],['milch',150],['kakao',15],['banane',1],['dattel',20]]],
 ['Mandel-Dattel-Shake',[['milch',300],['mandelmus',25],['dattel',40]]],
 ['Erdnuss-Schoko-Skyr-Shake',[['skyr',150],['milch',250],['erdnussb',30],['kakao',10],['banane',1]]],
 ['Orangen-Quark-Shake',[['orange',2],['quark',150],['milch',200],['honig',10]]]].forEach(([n,i])=>Q(n,SH,5,i,['Alle Zutaten in den Mixer geben.','60 Sekunden pürieren und sofort trinken.']));

/* --- Abschluss --- */
(function(){let s=20260929;const rnd=()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
  RECIPES.forEach(r=>r.rel=rnd())})();
RECIPES.forEach(r=>{r.kpe=r.kcal/r.price});
const BYID=Object.fromEntries(RECIPES.map(r=>[r.id,r]));
if(typeof module!=='undefined')module.exports={RECIPES,ING};
