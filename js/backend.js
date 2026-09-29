/* Supabase-Anbindung. Ohne Konfiguration oder ohne Netz läuft die App lokal weiter. */
const KTB=(()=>{
  const cfg=window.KT_CONFIG||{};
  let sb=null,user=null,timer=null,dirty=false;
  const listeners=[];
  const enabled=()=>!!sb;
  const emit=()=>listeners.forEach(f=>{try{f(user)}catch(e){console.error(e)}});
  const ok=(r)=>r&&!r.error;

  function init(){
    if(!(cfg.supabaseUrl&&cfg.supabaseKey&&window.supabase&&window.supabase.createClient))return Promise.resolve(false);
    sb=window.supabase.createClient(cfg.supabaseUrl,cfg.supabaseKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,storageKey:'kt-auth'}});
    return sb.auth.getSession().then(({data})=>{user=data&&data.session?data.session.user:null}).catch(()=>{}).then(()=>{
      sb.auth.onAuthStateChange((ev,session)=>{const u=session?session.user:null;const changed=(u&&u.id)!==(user&&user.id);user=u;if(changed)emit()});
      return true});
  }
  const wrap=async fn=>{try{const r=await fn();if(r&&r.error){console.warn(r.error.message);return{error:r.error}}return r}catch(e){console.warn(e);return{error:e}}};

  return{
    enabled,init,
    get user(){return user},
    onUser(f){listeners.push(f)},
    async signUp(email,password){return wrap(()=>sb.auth.signUp({email,password,options:{emailRedirectTo:location.origin+location.pathname}}))},
    async signIn(email,password){return wrap(()=>sb.auth.signInWithPassword({email,password}))},
    async signOut(){return wrap(()=>sb.auth.signOut())},

    /* Gesamtzustand (Korb, Favoriten, Plan, Vorrat, Profil) */
    async pullState(){if(!user)return null;const r=await wrap(()=>sb.from('kt_state').select('data,updated_at').eq('user_id',user.id).maybeSingle());return ok(r)?r.data:null},
    queueState(){if(!user)return;dirty=true;clearTimeout(timer);timer=setTimeout(()=>KTB.pushState(),1500)},
    async pushState(){
      if(!user||!dirty)return;dirty=false;
      const blob=stateBlob();
      const r=await wrap(()=>sb.from('kt_state').upsert({user_id:user.id,data:blob,updated_at:new Date().toISOString()}));
      if(r.error){dirty=true;return false}
      window.dispatchEvent(new CustomEvent('kt-synced'));return true;
    },

    /* Tagebuch */
    async fetchDiary(fromDay){const r=await wrap(()=>sb.from('kt_diary').select('*').gte('day',fromDay).order('eaten_at'));return ok(r)?r.data:null},
    async upsertDiary(rows){if(!user||!rows.length)return true;const r=await wrap(()=>sb.from('kt_diary').upsert(rows.map(e=>({id:e.id,day:e.day,label:e.label,recipe_id:e.rid||null,portions:e.p||1,kcal:Math.round(e.kcal),protein:Math.round(e.prot||0),price:Math.round((e.price||0)*100)/100,eaten_at:new Date(e.ts||Date.now()).toISOString()}))));return ok(r)},
    async deleteDiary(id){if(!user)return true;const r=await wrap(()=>sb.from('kt_diary').delete().eq('id',id));return ok(r)},

    /* Gewicht */
    async fetchWeights(){const r=await wrap(()=>sb.from('kt_weights').select('day,kg').order('day'));return ok(r)?r.data:null},
    async upsertWeight(w){if(!user)return true;const r=await wrap(()=>sb.from('kt_weights').upsert({user_id:user.id,day:w.day,kg:w.kg}));return ok(r)},
    async deleteWeight(day){if(!user)return true;const r=await wrap(()=>sb.from('kt_weights').delete().eq('user_id',user.id).eq('day',day));return ok(r)},

    /* Bewertungen */
    async fetchStats(){if(!sb)return null;const r=await wrap(()=>sb.from('kt_recipe_stats').select('recipe_id,n,total').gt('n',0));return ok(r)?r.data:null},
    async fetchMyRatings(){if(!user)return null;const r=await wrap(()=>sb.from('kt_ratings').select('recipe_id,stars'));return ok(r)?r.data:null},
    async rate(recipe_id,stars){if(!user)return false;const r=await wrap(()=>sb.from('kt_ratings').upsert({user_id:user.id,recipe_id,stars,updated_at:new Date().toISOString()}));return ok(r)},

    /* Community-Rezepte */
    async fetchRecipes(){if(!sb)return null;const r=await wrap(()=>sb.from('kt_user_recipes').select('id,user_id,author,name,cats,time_min,ing,steps,is_public,created_at').order('created_at',{ascending:false}).limit(300));return ok(r)?r.data:null},
    async insertRecipe(o){if(!user)return{error:{message:'Nicht angemeldet'}};return wrap(()=>sb.from('kt_user_recipes').insert({user_id:user.id,author:o.author,name:o.name,cats:o.cats,time_min:o.time,ing:o.ing,steps:o.steps,is_public:o.pub}).select('id').single())},
    async deleteRecipe(id){if(!user)return false;const r=await wrap(()=>sb.from('kt_user_recipes').delete().eq('id',id));return ok(r)}
  };
})();
