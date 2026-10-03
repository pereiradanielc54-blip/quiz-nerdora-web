import {atlas} from '../atlas/atlas-engine.js';

let busy=false;

function el(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n}
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
function setStatus(text){const n=document.querySelector('#terraAiStatus');if(n)n.textContent=text}

function flyToAtlas(query){
  const place=atlas.search(query,{limit:1})[0];
  const map=currentMap();
  if(!place||!map)return {ok:false,text:'Não encontrei esse lugar no Atlas Nerdora.'};
  const target=Math.min(19,Math.max(5,(place.zoom||7)+1.8));
  map.flyTo({center:place.center,zoom:target,pitch:target>=14?62:target>=9?50:25,bearing:0,duration:2300,essential:true});
  setTimeout(()=>{
    const sheet=document.querySelector('#sheet');
    if(!sheet)return;
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
  location.href='./tempo.html?v=24&age='+encodeURIComponent(age);
  return {ok:true,text:'Abrindo a Terra em '+age+' milhões de anos atrás.'};
}
function executeAction(action){
  const t=action?.type,a=action?.args||{};
  if(t==='fly_to')return flyToAtlas(a.query||'');
  if(t==='toggle_divisions')return toggleDivisions(a.enabled);
  if(t==='open_discover')return openDiscover(a.query||'');
  if(t==='set_time')return setTime(a.ma);
  if(t==='open_live')return openLive(a.feed||'all');
  return {ok:false,text:''};
}

function localIntent(question){
  const q=question.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  if(q.includes('divis')){
    const off=/deslig|ocult|escond|tir|remov/.test(q);return {answer:off?'Vou ocultar as divisões.':'Vou mostrar as divisões.',actions:[{type:'toggle_divisions',args:{enabled:!off}}]};
  }
  if(/terremot/.test(q))return {answer:'Abrindo os terremotos ao vivo.',actions:[{type:'open_live',args:{feed:'earthquakes'}}]};
  if(/incendi|queimada|fogo/.test(q))return {answer:'Abrindo os focos de incêndio ao vivo.',actions:[{type:'open_live',args:{feed:'fires'}}]};
  if(/satelit/.test(q))return {answer:'Abrindo os satélites ao vivo.',actions:[{type:'open_live',args:{feed:'satellites'}}]};
  if(/clima|tempestad|furacao|ciclone/.test(q))return {answer:'Abrindo os eventos climáticos ao vivo.',actions:[{type:'open_live',args:{feed:'weather'}}]};
  const tm=q.match(/(\d+(?:[.,]\d+)?)\s*(?:ma|milhoes? de anos|milhao de anos)/);
  if(tm)return {answer:'Vamos viajar no tempo.',actions:[{type:'set_time',args:{ma:Number(tm[1].replace(',','.'))}}]};
  if(/descobrir|atlas/.test(q))return {answer:'Abrindo o Atlas Nerdora.',actions:[{type:'open_discover',args:{query:''}}]};
  const found=atlas.search(question,{limit:1})[0];
  if(found&&/(leve|va |ir |mostr|localiz|onde fica|quero ver)/.test(q))return {answer:'Encontrei '+found.name+' no Atlas.',actions:[{type:'fly_to',args:{query:found.name}}]};
  return null;
}

async function askGateway(question){
  if(!location.hostname.endsWith('.vercel.app'))throw new Error('preview_without_gateway');
  const res=await fetch('/api/terra/ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question,context:buildContext()})});
  if(!res.ok)throw new Error('AI '+res.status);
  return await res.json();
}
async function send(question){
  if(busy||!question.trim())return;busy=true;
  addMessage('user',question.trim());setStatus('Pensando…');
  const input=document.querySelector('#terraAiInput');if(input)input.value='';
  let data;
  try{data=await askGateway(question.trim());setStatus('IA conectada • contexto do globo ativo')}
  catch{
    data=localIntent(question.trim());
    if(!data){
      const map=currentMap(),c=map?.getCenter?.(),near=c?atlas.nearest([c.lng,c.lat],{limit:1})[0]:null;
      const hint=near?` Você está próximo de ${near.place.name}.`:'';
      data={answer:'A IA avançada não respondeu agora, mas os comandos locais do Terra continuam funcionando.'+hint,actions:[]};
    }
    setStatus('Modo local • comandos do mapa ativos');
  }
  const results=[];for(const action of data.actions||[]){const r=executeAction(action);if(r.text)results.push(r.text)}
  addMessage('assistant',data.answer||results.join(' ')||'Pronto.');busy=false;
}

function buildUi(){
  const header=document.querySelector('.header');if(!header||document.querySelector('#terraAiBtn'))return;
  const btn=el('button','terra-ai-head-btn');btn.id='terraAiBtn';btn.type='button';btn.setAttribute('aria-label','Nerdora Terra IA');btn.title='Nerdora Terra IA';btn.textContent='✦';
  const sound=header.querySelector('[data-action="sound"]');header.insertBefore(btn,sound||null);

  const aside=el('aside','terra-ai-sheet');aside.id='terraAiSheet';aside.setAttribute('aria-hidden','true');
  aside.innerHTML=`<div class="terra-ai-backdrop" id="terraAiBackdrop"></div><section class="terra-ai-card panel"><div class="terra-ai-head"><div><small>NERDORA TERRA IA</small><h3>Converse com o planeta ✦</h3><p>Peça lugares, camadas, tempo geológico ou explicações.</p></div><button id="terraAiClose" aria-label="Fechar">×</button></div><div class="terra-ai-chips"><button data-ai-prompt="Me leve até as Pirâmides de Gizé">Pirâmides</button><button data-ai-prompt="Mostre terremotos ao vivo">Terremotos</button><button data-ai-prompt="Mostre a Terra há 66 Ma">66 Ma</button><button data-ai-prompt="Ative as divisões">Divisões</button></div><div class="terra-ai-messages" id="terraAiMessages"></div><form id="terraAiForm" class="terra-ai-form"><input id="terraAiInput" autocomplete="off" maxlength="900" placeholder="Ex.: me leve ao Everest…"><button type="submit">Enviar</button></form><div id="terraAiStatus" class="terra-ai-status">Contexto do globo pronto</div></section>`;
  document.querySelector('.screen')?.appendChild(aside);
  addMessage('assistant','Posso mover o globo, abrir o Ao Vivo, controlar Divisões, pesquisar o Atlas e viajar no Tempo. O que você quer explorar?');

  const open=()=>{aside.classList.add('open');aside.setAttribute('aria-hidden','false');setTimeout(()=>document.querySelector('#terraAiInput')?.focus(),180)};
  const close=()=>{aside.classList.remove('open');aside.setAttribute('aria-hidden','true')};
  btn.onclick=open;document.querySelector('#terraAiClose').onclick=close;document.querySelector('#terraAiBackdrop').onclick=close;
  document.querySelector('#terraAiForm').onsubmit=e=>{e.preventDefault();send(document.querySelector('#terraAiInput').value)};
  document.querySelectorAll('[data-ai-prompt]').forEach(b=>b.onclick=()=>send(b.dataset.aiPrompt));
}

if(document.readyState==='complete')setTimeout(buildUi,100);else window.addEventListener('load',()=>setTimeout(buildUi,100),{once:true});
