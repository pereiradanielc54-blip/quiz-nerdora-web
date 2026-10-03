import {atlas} from '../atlas/atlas-engine.js';

let busy=false;
const history=[];

function el(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n}
function norm(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim()}
function currentMap(){return window.__NERDORA_TERRA_CORE__?.map||null}
function buildContext(){
  const map=currentMap(),c=map?.getCenter?.();
  return {
    latitude:c?Number(c.lat.toFixed(5)):null,
    longitude:c?Number(c.lng.toFixed(5)):null,
    zoom:map?Number(map.getZoom().toFixed(2)):null,
    pitch:map?Number(map.getPitch().toFixed(1)):null,
    imagery:window.__NERDORA_TERRA_CORE__?.imagery||'EOX Sentinel-2',
    divisions:document.querySelector('#geoDivisionsBtn')?.getAttribute('aria-pressed')==='true',
    selectedPlace:document.querySelector('#sheet.open #sheetTitle')?.textContent||null,
    live:[...document.querySelectorAll('[data-live-feed][aria-pressed="true"]')].map(x=>x.dataset.liveFeed)
  };
}
function addMessage(role,text){
  const box=document.querySelector('#terraAiMessages');if(!box)return;
  const msg=el('div','terra-ai-msg '+role);msg.textContent=text;box.append(msg);box.scrollTop=box.scrollHeight;
}
function remember(role,content){history.push({role,content:String(content||'').slice(0,900)});if(history.length>10)history.splice(0,history.length-10)}
function setStatus(text){const n=document.querySelector('#terraAiStatus');if(n)n.textContent=text}

function explicitPlaceIn(text){
  const q=norm(text);
  return [...atlas.records]
    .filter(p=>q.includes(norm(p.name)))
    .sort((a,b)=>norm(b.name).length-norm(a.name).length)[0]||null;
}
function resolvePlace(query,question=''){
  const exact=explicitPlaceIn(query)||explicitPlaceIn(question);
  if(exact)return exact;
  const q=norm(query);
  const direct=atlas.records.find(p=>norm(p.name)===q);
  return direct||null;
}
function flyToAtlas(query,question=''){
  const place=resolvePlace(query,question),map=currentMap();
  if(!place||!map)return {ok:false,text:'Não consegui identificar esse lugar com segurança. Diga o nome exato do local.'};
  const target=Math.min(19,Math.max(5,(place.zoom||7)+1.8));
  map.flyTo({center:place.center,zoom:target,pitch:target>=14?62:target>=9?50:25,bearing:0,duration:2300,essential:true});
  setTimeout(()=>{
    const sheet=document.querySelector('#sheet');if(!sheet)return;
    document.querySelector('#sheetIcon').textContent=place.category==='História'?'🏛️':place.category==='Natureza'?'🌿':'📍';
    document.querySelector('#sheetKind').textContent='ATLAS NERDORA • '+place.category.toUpperCase();
    document.querySelector('#sheetTitle').textContent=place.name;
    document.querySelector('#sheetText').textContent=place.description+' • '+place.country;
    sheet.classList.add('open');sheet.setAttribute('aria-hidden','false');
  },1100);
  return {ok:true,text:'Indo para '+place.name+'.'};
}
function toggleDivisions(enabled){
  const btn=document.querySelector('#geoDivisionsBtn');if(!btn)return {ok:false,text:'Controle de divisões indisponível.'};
  const current=btn.getAttribute('aria-pressed')==='true';if(current!==!!enabled)btn.click();
  return {ok:true,text:enabled?'Divisões ativadas.':'Divisões ocultadas.'};
}
function openDiscover(query=''){
  document.querySelector('[data-action="discover"]')?.click();
  if(query)setTimeout(()=>{const input=document.querySelector('#discoverSearch');if(input){input.value=query;input.dispatchEvent(new Event('input',{bubbles:true}))}},180);
  return {ok:true,text:query?'Abrindo o Atlas para '+query+'.':'Abrindo o Descobrir.'};
}
function openLive(feed='all'){
  const panel=document.querySelector('#liveSheet');if(!panel?.classList.contains('open'))document.querySelector('#liveDataBtn')?.click();
  if(feed&&feed!=='all')setTimeout(()=>{const row=document.querySelector(`[data-live-feed="${feed}"]`);if(row&&row.getAttribute('aria-pressed')!=='true')row.click()},220);
  return {ok:true,text:'Abrindo a Terra ao Vivo.'};
}
function setTime(ma){
  const age=Math.max(0,Math.min(1000,Number(ma)||0));
  location.href='./tempo.html?v=25&age='+encodeURIComponent(age);
  return {ok:true,text:'Abrindo a Terra em '+age+' milhões de anos atrás.'};
}

function actionAllowed(action,question){
  const q=norm(question),t=action?.type,a=action?.args||{};
  const nav=/\b(me leve|leve-me|leve|va para|vá para|ir para|localize|localizar|mostre no mapa|mostrar no mapa|quero ver no mapa)\b/.test(q);
  const open=/\b(abra|abrir|mostre|mostrar|ative|ativar|desative|desativar|ligue|desligue|quero ver)\b/.test(q);
  if(t==='fly_to')return nav&&!!resolvePlace(a.query||'',question);
  if(t==='toggle_divisions')return /divis/.test(q)&&open;
  if(t==='open_discover')return /(descobrir|atlas)/.test(q)&&open;
  if(t==='set_time')return /(viaj|mostre|mostrar|terra ha|terra há|volte|ir para)/.test(q)&&/(\d+(?:[.,]\d+)?\s*(?:ma|milh|milhao|milhão))/.test(q);
  if(t==='open_live')return open&&/(ao vivo|terremot|incendi|queimada|satelit|clima|tempestad|furacao|ciclone)/.test(q);
  return false;
}
function executeAction(action,question){
  if(!actionAllowed(action,question))return {ok:false,text:''};
  const t=action.type,a=action.args||{};
  if(t==='fly_to')return flyToAtlas(a.query||'',question);
  if(t==='toggle_divisions')return toggleDivisions(a.enabled);
  if(t==='open_discover')return openDiscover(a.query||'');
  if(t==='set_time')return setTime(a.ma);
  if(t==='open_live')return openLive(a.feed||'all');
  return {ok:false,text:''};
}

function basicAnswer(question){
  const q=norm(question),place=explicitPlaceIn(question);
  const actionVerb=/\b(me leve|leve-me|leve|va para|vá para|localize|localizar|mostre no mapa|mostrar no mapa)\b/.test(q);
  const openVerb=/\b(abra|abrir|mostre|mostrar|ative|ativar|desative|desativar|ligue|desligue|quero ver)\b/.test(q);

  if(actionVerb&&place)return {answer:'Encontrei '+place.name+' no Atlas.',actions:[{type:'fly_to',args:{query:place.name}}]};
  if(/divis/.test(q)&&openVerb){const off=/deslig|desativ|ocult|escond|tir|remov/.test(q);return {answer:off?'Vou ocultar as divisões.':'Vou mostrar as divisões.',actions:[{type:'toggle_divisions',args:{enabled:!off}}]};}
  if(openVerb&&/terremot/.test(q))return {answer:'Abrindo os terremotos ao vivo.',actions:[{type:'open_live',args:{feed:'earthquakes'}}]};
  if(openVerb&&/incendi|queimada|fogo/.test(q))return {answer:'Abrindo os focos de incêndio ao vivo.',actions:[{type:'open_live',args:{feed:'fires'}}]};
  if(openVerb&&/satelit/.test(q))return {answer:'Abrindo os satélites ao vivo.',actions:[{type:'open_live',args:{feed:'satellites'}}]};
  if(openVerb&&/clima|tempestad|furacao|ciclone/.test(q))return {answer:'Abrindo os eventos climáticos ao vivo.',actions:[{type:'open_live',args:{feed:'weather'}}]};
  const tm=q.match(/(\d+(?:[.,]\d+)?)\s*(?:ma|milhoes? de anos|milhao de anos|milhão de anos)/);
  if(tm&&/(viaj|mostr|terra ha|terra há|volte|ir para)/.test(q))return {answer:'Vamos viajar no tempo.',actions:[{type:'set_time',args:{ma:Number(tm[1].replace(',','.'))}}]};
  if(/(descobrir|atlas)/.test(q)&&openVerb)return {answer:'Abrindo o Atlas Nerdora.',actions:[{type:'open_discover',args:{query:''}}]};
  if(place&&!actionVerb){return {answer:`${place.name} fica em ${place.country}. ${place.description}`,actions:[]};}
  return {answer:'A IA online ainda não está conectada neste deploy. Posso executar comandos do mapa e responder informações básicas do Atlas, mas não vou mover o planeta por conta própria. Para perguntas gerais, a IA completa precisa do AI Gateway ativo.',actions:[]};
}

async function askGateway(question){
  if(!location.hostname.endsWith('.vercel.app'))throw new Error('preview_without_gateway');
  const res=await fetch('/api/terra/ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question,context:buildContext(),history})});
  if(!res.ok){const err=new Error('AI '+res.status);err.status=res.status;throw err}
  return await res.json();
}
async function send(question){
  const clean=question.trim();if(busy||!clean)return;busy=true;
  addMessage('user',clean);remember('user',clean);setStatus('Pensando…');
  const input=document.querySelector('#terraAiInput');if(input)input.value='';
  let data,online=false;
  try{data=await askGateway(clean);online=true;setStatus('IA online • contexto do globo ativo')}
  catch{data=basicAnswer(clean);setStatus('Modo básico • AI Gateway não conectado')}
  const results=[];
  for(const action of data.actions||[]){const r=executeAction(action,clean);if(r.text)results.push(r.text)}
  const answer=data.answer||results.join(' ')||'Pronto.';
  addMessage('assistant',answer);remember('assistant',answer);
  if(online&&(data.actions||[]).length&&results.length===0)setStatus('IA online • ação bloqueada por segurança porque não foi pedida explicitamente');
  busy=false;
}

function buildUi(){
  const header=document.querySelector('.header');if(!header||document.querySelector('#terraAiBtn'))return;
  const btn=el('button','terra-ai-head-btn');btn.id='terraAiBtn';btn.type='button';btn.setAttribute('aria-label','Nerdora Terra IA');btn.title='Nerdora Terra IA';btn.textContent='✦';
  const sound=header.querySelector('[data-action="sound"]');header.insertBefore(btn,sound||null);

  const aside=el('aside','terra-ai-sheet');aside.id='terraAiSheet';aside.setAttribute('aria-hidden','true');
  aside.innerHTML=`<div class="terra-ai-backdrop" id="terraAiBackdrop"></div><section class="terra-ai-card panel"><div class="terra-ai-head"><div><small>NERDORA TERRA IA</small><h3>Converse com o planeta ✦</h3><p>Pergunte normalmente. O mapa só se move quando você pedir.</p></div><button id="terraAiClose" aria-label="Fechar">×</button></div><div class="terra-ai-chips"><button data-ai-prompt="Me leve até as Pirâmides de Gizé">Pirâmides</button><button data-ai-prompt="Mostre terremotos ao vivo">Terremotos</button><button data-ai-prompt="Mostre a Terra há 66 Ma">66 Ma</button><button data-ai-prompt="Ative as divisões">Divisões</button></div><div class="terra-ai-messages" id="terraAiMessages"></div><form id="terraAiForm" class="terra-ai-form"><input id="terraAiInput" autocomplete="off" maxlength="900" placeholder="Pergunte sobre a Terra ou dê um comando…"><button type="submit">Enviar</button></form><div id="terraAiStatus" class="terra-ai-status">Verificando IA…</div></section>`;
  document.querySelector('.screen')?.appendChild(aside);
  addMessage('assistant','Pergunte o que quiser. Se você só fizer uma pergunta, eu respondo sem mexer no globo; só navego quando você pedir explicitamente.');

  const open=()=>{aside.classList.add('open');aside.setAttribute('aria-hidden','false');setTimeout(()=>document.querySelector('#terraAiInput')?.focus(),180)};
  const close=()=>{aside.classList.remove('open');aside.setAttribute('aria-hidden','true')};
  btn.onclick=open;document.querySelector('#terraAiClose').onclick=close;document.querySelector('#terraAiBackdrop').onclick=close;
  document.querySelector('#terraAiForm').onsubmit=e=>{e.preventDefault();send(document.querySelector('#terraAiInput').value)};
  document.querySelectorAll('[data-ai-prompt]').forEach(b=>b.onclick=()=>send(b.dataset.aiPrompt));
  setStatus('Pronta • o mapa só se move sob comando explícito');
}

if(document.readyState==='complete')setTimeout(buildUi,100);else window.addEventListener('load',()=>setTimeout(buildUi,100),{once:true});
