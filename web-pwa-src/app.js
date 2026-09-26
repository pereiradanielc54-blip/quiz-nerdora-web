const $ = (s, root=document) => root.querySelector(s);
const app = $('#app');
let db=null, run=null, deferredInstall=null, music=null;
const state={screen:'home', level:0, xp:0, lives:3, combo:0, bestCombo:0, correct:0, answered:0, timer:null, remaining:null, current:0, locked:false};
const levels=[
 {name:'Novato de Academia',count:10,color:'#9f39ff'},
 {name:'Senpai Otaku',count:15,color:'#29d8ff'},
 {name:'Elite Shonen',count:20,color:'#ff7e26'},
 {name:'Lenda do Multiverso',count:25,color:'#ff3d68'}
];
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
const pick=(arr,n)=>[...arr].sort(()=>Math.random()-.5).slice(0,n);
function playMusic(kind){try{if(music){music.pause();music=null} music=new Audio(kind==='game'?'./primeiro_desafio.mp3':'./portal_nerdora.mp3');music.loop=true;music.volume=.28;music.play().catch(()=>{});}catch{}}
function shell(content, nav=true){return `<div class="app"><div class="bg"></div><div class="shell">${content}</div>${nav?bottomNav():''}</div>`}
function topbar(){return `<div class="topbar"><div class="profile glass"><img class="avatar" src="./icon.png"><div><h3>SakuraGeek</h3><div class="title">👑 Mestre do Duelo</div><div class="xp-mini">Nível 28 • 320 / 500 XP</div></div></div><div class="tools"><button class="iconbtn" title="Instalar" data-install>⬇</button><button class="iconbtn">⚙</button></div></div>`}
function bottomNav(){return `<div class="bottom"><nav class="nav glass"><button data-go="home" class="${state.screen==='home'?'active':''}"><span>⌂</span>INÍCIO</button><button data-go="play"><span>🎮</span>JOGAR</button><button data-go="achievements" class="${state.screen==='achievements'?'active':''}"><span>✦</span>COLEÇÃO</button><button><span>🛒</span>LOJA</button><button><span>♧</span>COMUNIDADE</button></nav></div>`}
function home(){state.screen='home';clearTimer();playMusic('menu');app.innerHTML=shell(`${topbar()}<section class="hero"><img class="hero-img" src="./home_art.png" alt="Nerdola e Nyan"><div class="hero-copy"><div class="logo"><span>QUIZ</span><span>NERDORA</span></div><div class="tagline">Conhecimento também é poder</div><div class="speech-row"><div class="speech"><b>NYAN</b>Pronto para testar seu conhecimento? Nya! ♡</div><div class="speech"><b>NERDOLA</b>Conhecimento também é poder. Bora jogar?</div></div></div></section><button class="play" data-action="start">🎮 JOGAR »</button><div class="grid4"><button class="feature orange" data-action="daily"><div class="ico">🗓</div><strong>DESAFIO DIÁRIO</strong><small>NOVOS DESAFIOS TODO DIA</small></button><button class="feature blue" data-action="duel"><div class="ico">⚔</div><strong>DUELO OTAKU</strong><small>BATALHE COM OUTRO JOGADOR</small></button><button class="feature pink" data-action="ranking"><div class="ico">🏆</div><strong>RANKING</strong><small>VEJA OS MELHORES</small></button><button class="feature purple" data-action="achievements"><div class="ico">✦</div><strong>CONQUISTAS</strong><small>EVOLUA E DESBLOQUEIE RECOMPENSAS</small></button></div><div class="status"><div class="status-card glass"><div class="kicker">👑 TÍTULO ATUAL</div><strong>Mestre do Duelo</strong><small>Perfil competitivo</small></div><div class="status-card glass"><div class="kicker">NÍVEL 28</div><div class="progress"><i></i></div><small>320 / 500 XP</small></div></div><div id="install-box" class="install-banner glass"><div><b>Instale como aplicativo</b><div style="font-size:10px;color:var(--muted)">Abre em tela cheia e atualiza automaticamente.</div></div><button data-install>INSTALAR</button></div><div class="quote glass">“Aqui, cada pergunta é um novo nível na sua jornada otaku!” <b>— Nerdola</b></div><div class="version" id="version-label">Web PWA • verificando versão…</div>`);bind();}
function selectRun(levelIndex){const l=db.levels[levelIndex];const total=l.questions_per_match;const normal=l.questions.filter(q=>!q.boss_eligible);const boss=l.questions.filter(q=>q.boss_eligible&&q.difficulty_band===3);const chosen=[];const anime=new Set();for(const band of [1,2,3]){for(const q of pick(normal.filter(x=>x.difficulty_band===band),Math.ceil((total-1)/3))){if(chosen.length>=total-1)break;if(!chosen.some(x=>x.fact_id===q.fact_id)&&(chosen.length>8||!anime.has(q.anime))){chosen.push(q);anime.add(q.anime)}}}for(const q of pick(normal,total)){if(chosen.length>=total-1)break;if(!chosen.some(x=>x.fact_id===q.fact_id))chosen.push(q)}const b=pick(boss.length?boss:l.questions.filter(q=>q.difficulty_band===3),1)[0]||pick(l.questions,1)[0];return [...chosen.slice(0,total-1),b];}
function start(level=0){state.level=level;state.lives=3;state.combo=0;state.bestCombo=0;state.correct=0;state.answered=0;state.xp=0;state.current=0;state.locked=false;run=selectRun(level);playMusic('game');question();}
function timerLimit(){return state.level===2?20:state.level===3?15:null}
function comboStep(){return [1,3,5,7][state.level]}
function question(){state.screen='play';clearTimer();state.locked=false;const q=run[state.current],boss=state.current===run.length-1;let lim=timerLimit();state.remaining=lim;app.innerHTML=shell(`<div class="screen"><div class="screen-head"><div><h1>${boss?'BOSS QUESTION':esc(levels[state.level].name)}</h1><small>${boss?esc(levels[state.level].name):`Pergunta ${state.current+1}/${run.length}`}</small></div><button class="back" data-go="home">←</button></div><div class="hud"><div class="glass hearts">${'♥'.repeat(state.lives)}${'♡'.repeat(3-state.lives)}</div><div class="glass">COMBO <b>x${state.combo}</b></div><div class="glass"><b>${state.xp}</b> XP</div></div><div class="question-card glass ${boss?'boss':''}">${boss?'<div class="boss-ribbon">⚠ BOSS QUESTION • +50 XP</div>':''}<div class="meta">${esc(q.anime)} • ${esc(q.category)} ${lim?`• <span class="timer" id="timer">${lim}s</span>`:''}</div><div class="question">${esc(q.question)}</div><div class="answers">${q.options.map(o=>`<button class="answer" data-answer="${o.id}"><b>${o.id}</b><span>${esc(o.text)}</span></button>`).join('')}</div><div id="feedback"></div></div></div>`);bind();if(lim){state.timer=setInterval(()=>{state.remaining--;const el=$('#timer');if(el)el.textContent=`${state.remaining}s`;if(state.remaining<=0){clearTimer();answer(null,true)}},1000)}}
function answer(id,timeout=false){if(state.locked)return;state.locked=true;clearTimer();const q=run[state.current],correct=id===q.correct_option,boss=state.current===run.length-1;state.answered++;if(correct){let add=10+state.combo*comboStep();if(state.level>=2&&state.remaining!=null){if(state.level===2)add+=state.remaining>15?4:state.remaining>10?3:state.remaining>5?1:0;else add+=state.remaining>10?4:state.remaining>5?2:0}if(boss)add+=50;state.xp+=add;state.correct++;state.combo++;state.bestCombo=Math.max(state.bestCombo,state.combo);}else{state.lives=Math.max(0,state.lives-1);state.combo=0}document.querySelectorAll('.answer').forEach(b=>{b.disabled=true;if(b.dataset.answer===q.correct_option)b.classList.add('correct');else if(b.dataset.answer===id)b.classList.add('wrong')});const f=$('#feedback');f.className=`feedback ${correct?'ok':'bad'}`;f.innerHTML=correct?`✅ <b>Acertou!</b> ${boss?'+50 XP de Boss.':''}`:`${timeout?'⏱ Tempo esgotado.':'❌ Resposta incorreta.'} <b>${esc(q.options.find(o=>o.id===q.correct_option)?.text||'')}</b>`;const n=document.createElement('button');n.className='next';n.textContent=state.lives<=0?'VER RESULTADO':state.current>=run.length-1?'CONCLUIR NÍVEL':'PRÓXIMA PERGUNTA';n.onclick=next;f.after(n)}
function next(){if(state.lives<=0||state.current>=run.length-1){results();return}state.current++;question()}
function results(){clearTimer();const acc=Math.round((state.correct/Math.max(1,state.answered))*100);state.screen='results';app.innerHTML=shell(`<div class="screen"><div class="screen-head"><h1>${state.lives>0?'NÍVEL CONCLUÍDO':'RUN ENCERRADA'}</h1><button class="back" data-go="home">←</button></div><div class="big-result glass"><div style="font-size:43px">${state.lives>0?'🏆':'⚡'}</div><h2>${state.xp} XP</h2><small>${esc(levels[state.level].name)}</small></div><div class="results"><div class="stat glass"><small>ACERTOS</small><strong>${state.correct}/${state.answered}</strong></div><div class="stat glass"><small>PRECISÃO</small><strong>${acc}%</strong></div><div class="stat glass"><small>MAIOR COMBO</small><strong>x${state.bestCombo}</strong></div><div class="stat glass"><small>VIDAS</small><strong>${state.lives}/3</strong></div></div>${state.lives>0&&state.level<3?'<button class="next" data-action="next-level">PRÓXIMO NÍVEL →</button>':'<button class="next" data-go="home">VOLTAR AO PORTAL</button>'}</div>`);bind()}
function ranking(){state.screen='ranking';const names=['SakuraGeek','KaitoBR','LunaOtaku','ShadowNerd','NekoSensei','AnimeZero'];app.innerHTML=shell(`<div class="screen"><div class="screen-head"><div><h1>RANKING OTAKU</h1><small>Protótipo web local</small></div><button class="back" data-go="home">←</button></div><div class="rank-list">${names.map((n,i)=>`<div class="rank-row glass"><div class="badge">#${i+1}</div><div><b>${n}</b><br><small>${['SSS','SS','S','A','A','B'][i]}</small></div><b>${[54230,48910,41760,31640,28980,25410][i].toLocaleString('pt-BR')} XP</b></div>`).join('')}</div></div>`);bind()}
function achievements(){state.screen='achievements';const a=[['Primeiro Salto no Portal','Conclua uma run completa'],['Caçador de Chefes','Acerte os 4 Boss'],['Além do Limite','Alcance combo x20'],['Disciplina Otaku','7 Dailies consecutivos'],['SSS do Dia','#1 no Desafio Diário'],['???','Conquista secreta']];app.innerHTML=shell(`<div class="screen"><div class="screen-head"><div><h1>CONQUISTAS</h1><small>Exclusivas do Quiz Nerdora</small></div><button class="back" data-go="home">←</button></div><div class="achievement-list">${a.map((x,i)=>`<div class="ach glass ${i===5?'locked':''}"><div style="font-size:24px">${i===4?'👑':i===5?'❔':'✦'}</div><strong>${x[0]}</strong><small>${x[1]}</small></div>`).join('')}</div></div>`);bind()}
function simple(title,text){state.screen='simple';app.innerHTML=shell(`<div class="screen"><div class="screen-head"><h1>${title}</h1><button class="back" data-go="home">←</button></div><div class="glass" style="border-radius:24px;padding:20px"><p>${text}</p><button class="next" data-go="home">VOLTAR</button></div></div>`);bind()}
function bind(){document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{const g=b.dataset.go;if(g==='home')home();else if(g==='play')start();else if(g==='achievements')achievements()});document.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>{const a=b.dataset.action;if(a==='start')start();if(a==='ranking')ranking();if(a==='achievements')achievements();if(a==='daily')simple('DESAFIO DIÁRIO','A versão web está pronta para testar a interface e a jogabilidade. O Daily online real será conectado ao backend depois.');if(a==='duel')simple('DUELO OTAKU','O modo web mantém o espaço do Duelo. A sincronização entre dois jogadores depende do backend online.');if(a==='next-level')start(state.level+1)});document.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>answer(b.dataset.answer));document.querySelectorAll('[data-install]').forEach(b=>b.onclick=installPwa);updateInstallUI();loadVersionLabel()}
function clearTimer(){if(state.timer){clearInterval(state.timer);state.timer=null}}
async function installPwa(){if(matchMedia('(display-mode: standalone)').matches||navigator.standalone){return}if(deferredInstall){try{deferredInstall.prompt();await deferredInstall.userChoice}catch{}deferredInstall=null;updateInstallUI();return}const local=location.protocol==='file:'||location.protocol==='content:';if(local){simple('INSTALAR NO CELULAR','Este arquivo está aberto diretamente da pasta Downloads. O Chrome não permite instalar PWA nem registrar atualização automática em content:// ou file://. Abra a versão publicada em HTTPS e toque novamente em INSTALAR.')}else{simple('INSTALAR NO CELULAR','O botão de instalação está ativo. Se o aviso nativo ainda não apareceu, no Chrome Android toque no menu ⋮ e escolha “Instalar app” ou “Adicionar à tela inicial”. Assim que o Chrome liberar o aviso, este botão abrirá a instalação diretamente.')}}
function updateInstallUI(){const installed=matchMedia('(display-mode: standalone)').matches||navigator.standalone;document.querySelectorAll('[data-install]').forEach(b=>{if(installed){b.textContent='✓';b.disabled=true}});const box=$('#install-box');if(installed&&box)box.classList.add('hidden')}
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstall=e;updateInstallUI()});window.addEventListener('appinstalled',()=>{deferredInstall=null;updateInstallUI()});
async function loadVersionLabel(){try{const v=await fetch(`./version.json?t=${Date.now()}`,{cache:'no-store'}).then(r=>r.json());const el=$('#version-label');if(el)el.textContent=`Web PWA • ${v.version} • ${String(v.build).slice(0,8)}`;}catch{}}
async function setupUpdates(){
 if(!('serviceWorker'in navigator))return;
 const reg=await navigator.serviceWorker.register('./sw.js');
 let checking=false,reloading=false;

 const applyWaiting=()=>{if(reg.waiting){$('#update-toast')?.classList.remove('hidden');reg.waiting.postMessage({type:'SKIP_WAITING'})}};
 const check=async()=>{
   if(checking||!navigator.onLine)return;
   checking=true;
   try{
     const v=await fetch(`./version.json?t=${Date.now()}`,{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('version');return r.json()});
     const current=localStorage.getItem('qn-build');
     if(!current){localStorage.setItem('qn-build',v.build)}
     else if(current!==v.build){
       localStorage.setItem('qn-target-build',v.build);
       $('#update-toast')?.classList.remove('hidden');
       await reg.update().catch(()=>{});
       applyWaiting();
     }else{
       await reg.update().catch(()=>{});
       applyWaiting();
     }
   }catch{}finally{checking=false}
 };

 reg.addEventListener('updatefound',()=>{
   const w=reg.installing;
   if(!w)return;
   w.addEventListener('statechange',()=>{
     if(w.state==='installed'&&navigator.serviceWorker.controller){
       $('#update-toast')?.classList.remove('hidden');
       w.postMessage({type:'SKIP_WAITING'});
     }
   });
 });

 navigator.serviceWorker.addEventListener('controllerchange',()=>{
   if(reloading)return;
   reloading=true;
   const target=localStorage.getItem('qn-target-build');
   if(target){localStorage.setItem('qn-build',target);localStorage.removeItem('qn-target-build')}
   location.reload();
 });

 await check();
 setInterval(check,5*60*1000);
 window.addEventListener('focus',check);
 window.addEventListener('online',check);
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')check()});
}
async function init(){try{db=await fetch('./quiz_questions.json').then(r=>r.json())}catch(e){app.innerHTML='<p style="padding:20px">Não foi possível carregar o banco de perguntas.</p>';return}home();setupUpdates()}
init();