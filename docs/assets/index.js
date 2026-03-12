"use strict";
const h = React.createElement;
const { useState, useEffect, useRef, Fragment } = React;

/* ═══════════════════════════════════════════════════════════
   SENTENCE DATA  — ~900 pairs, tagged by level
   Level 1 = A1-A2, Level 2 = A2-B1, Level 3 = B1-B2
   ═══════════════════════════════════════════════════════════ */

function getLevel(id) {
  const prefix = id.replace(/\d+/g, '');
  const num = parseInt(id.replace(/\D+/g, ''));
  const L1 = ['gr','fa','dr','nu'];
  if (L1.includes(prefix)) return 1;
  const SPLIT = {fo:20,sh:15,tr:15,ho:15,we:15,wo:15,he:15,le:15,ev:15,an:10,co:10};
  if (prefix in SPLIT) return num <= SPLIT[prefix] ? 1 : 2;
  const L2 = ['pa','fu','op','re','de','na','tv','bk','sc','te','cu','cl','bo','pe','sp','ci','en','ce','mo','sf','sv','tp','rv','ac','ir','em','vm','vc','jd','rl'];
  if (L2.includes(prefix)) return 2;
  if (prefix === 'a2') return num <= 50 ? 2 : 3;
  return 3;
}

const ALL_SENTENCES=[{id:"gr001",en:"Hello, my name is Anna.",de:"Hallo, mein Name ist Anna."},{id:"gr002",en:"Good morning, how are you?",de:"Guten Morgen, wie geht es Ihnen?"},{id:"gr003",en:"Good afternoon, nice to meet you.",de:"Guten Tag, schön Sie kennenzulernen."},{id:"gr004",en:"Good evening, how was your day?",de:"Guten Abend, wie war Ihr Tag?"},{id:"gr005",en:"Goodbye, see you tomorrow.",de:"Auf Wiedersehen, bis morgen."},{id:"gr006",en:"Bye, see you later!",de:"Tschüss, bis später!"},{id:"gr007",en:"I am fine, thank you.",de:"Mir geht es gut, danke."},{id:"gr008",en:"Not so well, actually.",de:"Nicht so gut, eigentlich."},{id:"gr009",en:"Where are you from?",de:"Woher kommen Sie?"},{id:"gr010",en:"I am from Germany.",de:"Ich komme aus Deutschland."},{id:"gr011",en:"I live in Berlin.",de:"Ich wohne in Berlin."},{id:"gr012",en:"How old are you?",de:"Wie alt sind Sie?"},{id:"gr013",en:"I am twenty-five years old.",de:"Ich bin fünfundzwanzig Jahre alt."},{id:"gr014",en:"What do you do for work?",de:"Was machen Sie beruflich?"},{id:"gr015",en:"I am a teacher.",de:"Ich bin Lehrer."},{id:"gr016",en:"This is my friend Maria.",de:"Das ist meine Freundin Maria."},{id:"gr017",en:"Nice to meet you!",de:"Schön, Sie kennenzulernen!"},{id:"gr018",en:"Can you spell your name?",de:"Können Sie Ihren Namen buchstabieren?"},{id:"gr019",en:"What is your phone number?",de:"Was ist Ihre Telefonnummer?"},{id:"gr020",en:"What is your email address?",de:"Was ist Ihre E-Mail-Adresse?"},{id:"gr021",en:"I come from Austria.",de:"Ich komme aus Österreich."},{id:"gr022",en:"I live in a small town.",de:"Ich wohne in einer kleinen Stadt."},{id:"gr023",en:"My name is difficult to pronounce.",de:"Mein Name ist schwer auszusprechen."},{id:"gr024",en:"I am thirty years old.",de:"Ich bin dreißig Jahre alt."},{id:"gr025",en:"We met at a party.",de:"Wir haben uns auf einer Party kennengelernt."},{id:"gr026",en:"Do you know each other?",de:"Kennen Sie sich?"},{id:"gr027",en:"I have heard a lot about you.",de:"Ich habe viel von Ihnen gehört."},{id:"gr028",en:"Please call me by my first name.",de:"Bitte nennen Sie mich beim Vornamen."},{id:"gr029",en:"It is a pleasure to meet you.",de:"Es ist mir eine Freude, Sie kennenzulernen."},{id:"gr030",en:"How long have you lived here?",de:"Wie lange wohnen Sie schon hier?"},{id:"fa001",en:"I have a big family.",de:"Ich habe eine große Familie."},{id:"fa002",en:"My mother is a doctor.",de:"Meine Mutter ist Ärztin."},{id:"fa003",en:"My father works in an office.",de:"Mein Vater arbeitet in einem Büro."},{id:"fa004",en:"I have two sisters and one brother.",de:"Ich habe zwei Schwestern und einen Bruder."},{id:"fa005",en:"My sister is younger than me.",de:"Meine Schwester ist jünger als ich."},{id:"fa006",en:"My brother lives in Munich.",de:"Mein Bruder wohnt in München."},{id:"fa007",en:"My grandparents are very old.",de:"Meine Großeltern sind sehr alt."},{id:"fa008",en:"Do you have children?",de:"Haben Sie Kinder?"},{id:"fa009",en:"I have one son and two daughters.",de:"Ich habe einen Sohn und zwei Töchter."},{id:"fa010",en:"My daughter is five years old.",de:"Meine Tochter ist fünf Jahre alt."},{id:"fa011",en:"We visit our parents every Sunday.",de:"Wir besuchen unsere Eltern jeden Sonntag."},{id:"fa012",en:"My aunt and uncle live nearby.",de:"Meine Tante und mein Onkel wohnen in der Nähe."},{id:"fa013",en:"My cousin is getting married next year.",de:"Mein Cousin heiratet nächstes Jahr."},{id:"fa014",en:"Are you married or single?",de:"Sind Sie verheiratet oder ledig?"},{id:"fa015",en:"I have been married for three years.",de:"Ich bin seit drei Jahren verheiratet."},{id:"fa016",en:"My grandmother makes the best cake.",de:"Meine Großmutter macht den besten Kuchen."},{id:"fa017",en:"We have a family dinner every Friday.",de:"Wir essen jeden Freitag gemeinsam als Familie."},{id:"fa018",en:"My parents have been together for thirty years.",de:"Meine Eltern sind seit dreißig Jahren zusammen."},{id:"fa019",en:"She is my stepmother.",de:"Sie ist meine Stiefmutter."},{id:"fa020",en:"I am an only child.",de:"Ich bin ein Einzelkind."},{id:"fa021",en:"My nephew is very funny.",de:"Mein Neffe ist sehr lustig."},{id:"fa022",en:"Her niece loves to dance.",de:"Ihre Nichte tanzt sehr gerne."},{id:"fa023",en:"We are expecting a baby.",de:"Wir erwarten ein Baby."},{id:"fa024",en:"My parents divorced when I was young.",de:"Meine Eltern haben sich getrennt, als ich jung war."},{id:"fa025",en:"I miss my family very much.",de:"Ich vermisse meine Familie sehr."},{id:"dr001",en:"I wake up at seven o'clock.",de:"Ich wache um sieben Uhr auf."},{id:"dr002",en:"I eat breakfast in the morning.",de:"Ich frühstücke morgens."},{id:"dr003",en:"I take a shower every day.",de:"Ich dusche jeden Tag."},{id:"dr004",en:"I go to work by bus.",de:"Ich fahre mit dem Bus zur Arbeit."},{id:"dr005",en:"I start work at nine in the morning.",de:"Ich fange um neun Uhr morgens mit der Arbeit an."},{id:"dr006",en:"I eat lunch at noon.",de:"Ich esse mittags zu Mittag."},{id:"dr007",en:"I finish work at five in the afternoon.",de:"Ich höre um fünf Uhr nachmittags auf zu arbeiten."},{id:"dr008",en:"I cook dinner in the evening.",de:"Ich koche abends das Abendessen."},{id:"dr009",en:"I watch television after dinner.",de:"Ich schaue nach dem Abendessen fern."},{id:"dr010",en:"I go to bed at eleven o'clock.",de:"Ich gehe um elf Uhr ins Bett."},{id:"dr011",en:"I read a book before sleeping.",de:"Ich lese ein Buch, bevor ich schlafe."},{id:"dr012",en:"I exercise three times a week.",de:"Ich mache dreimal pro Woche Sport."},{id:"dr013",en:"On weekends I sleep late.",de:"Am Wochenende schlafe ich lange."},{id:"dr014",en:"I do the shopping on Saturdays.",de:"Ich mache samstags Einkäufe."},{id:"dr015",en:"I clean my apartment every week.",de:"Ich putze meine Wohnung jede Woche."},{id:"dr016",en:"I walk to the park in the afternoon.",de:"Ich gehe nachmittags in den Park."},{id:"dr017",en:"I call my parents on Sunday evening.",de:"Ich rufe meine...(truncated 174564 characters)...,gap:5},onClick:handleBan}, h(Icon.Ban),' Don\'t play again')),
      h('div',{style:S.ansRow},
        h('button',{style:S.btnWrong,onClick:()=>handleRevealDone(false)}, h(Icon.X),' Wrong'),
        h('button',{style:S.btnRight,onClick:()=>handleRevealDone(true)}, h(Icon.Check),' Got it!'))),
    isAwaiting && !isReveal && h('div',{style:S.ansRow},
      h('button',{style:S.btnWrong,onClick:()=>handleAnswer(false)}, h(Icon.X),' Wrong'),
      h('button',{style:S.btnRight,onClick:()=>handleAnswer(true)}, h(Icon.Check),' Got it!')),
    !isAwaiting && !isReveal && !done && h('div',{style:S.ctrlRow},
      h('button',{style:{...S.ctrlBtn,color:C.red,borderColor:C.redDim},onClick:handleBan,title:"Don't play again"}, h(Icon.Ban)),
      h('button',{style:S.ctrlBtnMain,onClick:togglePause}, paused?h(Icon.Play):h(Icon.Pause)),
      h('button',{style:S.ctrlBtn,onClick:skipSentence,title:'Skip'}, h(Icon.Skip))),
    paused && h('div',{style:S.pausedLbl},'⏸ Paused — tap play to continue'),
    showBtn && score.correct+score.wrong>0 && h('div',{style:S.scoreTick},
      h('span',{style:{color:C.gold}},'✓ '+score.correct),
      h('span',{style:{color:'#444',margin:'0 8px'}},'|'),
      h('span',{style:{color:C.red}},'✗ '+score.wrong))
  ));
}

// --- Stats Screen ---
function StatsScreen({userData, onBack, onRemove}){
  const srs = userData.srsData||{};
  const total = ALL_SENTENCES.length;
  const modeStats = m => {
    const cards = srs[m]||{};
    const vals = Object.values(cards);
    return { seen:vals.length, totalPlays:vals.reduce((a,c)=>a+(c.totalPlays||0),0),
      accuracy: vals.reduce((a,c)=>a+(c.totalPlays||0),0)?Math.round(vals.reduce((a,c)=>a+(c.correctPlays||0),0)/vals.reduce((a,c)=>a+(c.totalPlays||0),0)*100):0,
      mastered:vals.filter(c=>c.level>=4).length, iter:srs[m+'_iter']||0 };
  };
  const skipIds = userData.skipList||[];
  const skipItems = ALL_SENTENCES.filter(s=>skipIds.includes(s.id));
  return h('div',{style:S.page},h('div',{style:S.card},
    h('button',{style:S.backBtn,onClick:onBack}, h(Icon.Back),' Back'),
    h('h2',{style:S.h2},'Progress'),
    h('div',{style:S.flagStripe}),
    h(ModeBlock,{label:'English → German',stats:modeStats('en_to_de'),color:C.gold,srs,mode:'en_to_de',total}),
    h(ModeBlock,{label:'German → English',stats:modeStats('de_to_en'),color:C.red,srs,mode:'de_to_en',total}),
    h('div',{style:S.srsExplain},
      h('div',{style:S.explainTitle},'📈 How spacing works'),
      h('div',{style:S.explainBody},'Sentences return after a number of other sentences played — not time. Each correct answer pushes it further back (3 → 8 → 20 → 50 → 150). A wrong answer resets to 3. Progress is tracked separately for each direction.')),
    skipItems.length>0 && h('div',{style:{marginTop:14}},
      h('div',{style:{fontSize:13,fontWeight:700,color:C.red,marginBottom:8}},'🚫 Do Not Play ('+skipItems.length+')'),
      skipItems.map(s=>h('div',{key:s.id,style:{background:'#111',border:'1px solid #1e1e1e',borderRadius:10,padding:'12px 14px',display:'flex',alignItems:'center',gap:10,marginBottom:6}},
        h('div',{style:{flex:1,minWidth:0}},
          h('div',{style:{color:'#e0e0e0',fontSize:14,fontWeight:600,marginBottom:3}},s.de),
          h('div',{style:{color:'#555',fontSize:13}},s.en)),
        h('button',{style:{background:'none',border:'1px solid #4ade8044',borderRadius:8,color:'#4ade80',cursor:'pointer',fontSize:12,padding:'6px 10px',whiteSpace:'nowrap'},onClick:()=>onRemove(s.id)},'↩ Restore'))))
  ));
}

function ModeBlock({label,stats,color,srs,mode,total}){
  const cards = srs[mode]||{};
  const dist = [0,0,0,0,0,0];
  dist[0] = total - Object.keys(cards).length;
  Object.values(cards).forEach(c=>{ dist[Math.min(c.level+1,5)]++; });
  const maxD = Math.max(...dist,1);
  const cols = ['#333','#93c5fd','#60a5fa','#3b82f6','#1d4ed8','#4ade80'];
  const labels = ['Unseen','Lv1','Lv2','Lv3','Lv4','Master'];
  return h('div',{style:{...S.modeBlock,borderColor:color+'33'}},
    h('div',{style:{...S.modeLbl,color}},label),
    h('div',{style:S.modeGrid},
      h('div',{style:S.mStat},h('div',{style:{...S.mStatN,color}},stats.seen),h('div',{style:S.mStatLbl},'Seen')),
      h('div',{style:S.mStat},h('div',{style:{...S.mStatN,color}},stats.accuracy+'%'),h('div',{style:S.mStatLbl},'Accuracy')),
      h('div',{style:S.mStat},h('div',{style:{...S.mStatN,color}},stats.mastered),h('div',{style:S.mStatLbl},'Mastered')),
      h('div',{style:S.mStat},h('div',{style:{...S.mStatN,color}},stats.iter),h('div',{style:S.mStatLbl},'Plays'))),
    h('div',{style:S.distRow}, dist.map((v,i)=>
      h('div',{key:i,style:S.distCol},
        h('div',{style:S.distBarWrap},h('div',{style:{...S.distBar,height:Math.round(v/maxD*48)+'px',background:cols[i]}})),
        h('div',{style:S.distN},v),
        h('div',{style:S.distLbl},labels[i]))))
  );
}

/* ═══════════════════════════════════
   APP ROOT
   ═══════════════════════════════════ */
function App(){
  const [store, setStore2] = useState(loadStore());
  const [user, setUser2] = useState(null);
  const [screen, setScreen] = useState('auth');

  const ss = d=>{ saveStore(d); setStore2(d); };
  const login = (u,p)=>{ const users=getUsers(store); if(!users[u]) return 'User not found'; if(users[u].password!==p) return 'Wrong password'; setUser2({username:u}); setScreen('home'); return null; };
  const register = (u,p)=>{ if(!u.trim()) return 'Enter a username'; if(u.length<3) return 'Min 3 characters'; if(!p||p.length<4) return 'Password min 4 chars'; if(getUsers(store)[u]) return 'Username taken'; const s=setUser(store,u,{password:p,srsData:{}}); ss(s); setUser2({username:u}); setScreen('home'); return null; };
  const logout = ()=>{ setUser2(null); setScreen('auth'); };
  const ud = ()=> getUsers(store)[user?.username]||{};
  const saveSrs = d=>{ const u2={...ud(),srsData:d}; const s=setUser(store,user.username,u2); ss(s); };
  const addSkip = id=>{ const u2={...ud(),skipList:[...(ud().skipList||[]),id]}; const s=setUser(store,user.username,u2); ss(s); };
  const rmSkip = id=>{ const u2={...ud(),skipList:(ud().skipList||[]).filter(x=>x!==id)}; const s=setUser(store,user.username,u2); ss(s); };

  if(screen==='auth') return h(AuthScreen,{onLogin:login,onRegister:register});
  if(screen==='home') return h(HomeScreen,{user,userData:ud(),onLogout:logout,onStart:()=>setScreen('setup'),onStats:()=>setScreen('stats')});
  if(screen==='setup') return h(SetupScreen,{onBack:()=>setScreen('home'),onStart:cfg=>setScreen({name:'session',cfg})});
  if(screen==='stats') return h(StatsScreen,{userData:ud(),onBack:()=>setScreen('home'),onRemove:rmSkip});
  if(screen?.name==='session') return h(SessionScreen,{cfg:screen.cfg,srsData:ud().srsData||{},onSave:saveSrs,onDone:()=>setScreen('home'),skipList:ud().skipList||[],onSkipAdd:addSkip});
  return null;
}

// Mount
ReactDOM.createRoot(document.getElementById('root')).render(h(React.StrictMode,null,h(App)));