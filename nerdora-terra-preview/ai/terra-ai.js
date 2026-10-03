import {atlas} from '../atlas/atlas-engine.js';
import {answerFree,resolveFreePlace} from './terra-knowledge.js';

let busy=false;
const history=[];

function el(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n}
function norm(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim()}
function currentMap(){return window.__NERDORA_TERRA_CORE__?.map||null}
function addMessage(role,text){const box=document.querySelector('#terraAiMessages');if(!box)return;const msg=el('div','terra-ai-msg '+role);msg.textContent=text;box.append(msg);box.scrollTop=box.scrollHeight}
function remember(role,content){history.push({role,content:String(content||'').slice(0,900)});if(history.length>10)history.splice(0,history.length-10)}
function setStatus(text){const n=document.querySelector('#terraAiStatus');if(n)n.textContent=text}

function explicitAtlas(text){
 const q=norm(text);
 return [...atlas.records].filter(p=>q.includes(norm(p.name))).sort((a,b)=>norm(b.name).length-norm(a.name).length)[0]||null;
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
 location.href='./tempo.html?v=27&age='+encodeURIComponent(age);
 return {ok:true,text:'Abrindo a Terra em '+age+' milhões de anos atrás.'};
}
function showPlaceCard(place){
 const sheet=document.querySelector('#sheet');if(!sheet)return;
 document.querySelector('#sheetIcon').textContent='📍';
 document.querySelector('#sheetKind').textContent='NERDORA TERRA • '+String(place.source||'LOCAL').toUpperCase();
 document.querySelector('#sheetTitle').textContent=place.name;
 document.querySelector('#sheetText').textContent=place.description||'Local encontrado pela Nerdora Terra IA.';
 sheet.classList.add('open');sheet.setAttribute('aria-hidden','false');
}
function flyResolved(place){
 const map=currentMap();if(!place||!map)return false;
 const z=Math.min(19,Math.max(5,Number(place.zoom)||10));
 map.flyTo({center:place.center,zoom:z,pitch:z>=14?62:z>=9?50:25,bearing:0,duration:2300,essential:true});
 setTimeout(()=>showPlaceCard(place),1000);return true;
}

function destinationFrom(question){
 let s=String(question||'').trim();
 s=s.replace(/^(por favor\s*)?(me\s+)?(leve(?:-me)?|va|vá|ir|localize|localizar|mostre|mostrar)\s+(?:me\s+)?(?:ate|até|para|no mapa|a|ao|à|o|os|as)?\s*/i,'').trim();
 s=s.replace(/^(no mapa|para)\s+/i,'').replace(/[?!.]+$/,'').trim();
 return s;
}
function hasNavVerb(q){return /\b(me leve|leve-me|leve|va para|vá para|ir para|localize|localizar|mostre no mapa|mostrar no mapa|quero ver no mapa)\b/.test(norm(q))}
function hasOpenVerb(q){return /\b(abra|abrir|mostre|mostrar|ative|ativar|desative|desativar|ligue|desligue|quero ver)\b/.test(norm(q))}

async function commandAnswer(question){
 const q=norm(question),open=hasOpenVerb(question);
 if(/divis/.test(q)&&open){const off=/deslig|desativ|ocult|escond|tir|remov/.test(q);const r=toggleDivisions(!off);return {handled:true,answer:r.text}}
 if(open&&/terremot/.test(q)){openLive('earthquakes');return {handled:true,answer:'Abrindo os terremotos ao vivo.'}}
 if(open&&/incendi|queimada|fogo/.test(q)){openLive('fires');return {handled:true,answer:'Abrindo os focos de incêndio ao vivo.'}}
 if(open&&/satelit/.test(q)){openLive('satellites');return {handled:true,answer:'Abrindo os satélites ao vivo.'}}
 if(open&&/clima|tempestad|furacao|ciclone/.test(q)){openLive('weather');return {handled:true,answer:'Abrindo os eventos climáticos ao vivo.'}}
 const tm=q.match(/(\d+(?:[.,]\d+)?)\s*(?:ma|milhoes? de anos|milhao de anos|milhão de anos)/);
 if(tm&&/(viaj|mostr|terra ha|terra há|volte|ir para)/.test(q)){setTime(Number(tm[1].replace(',','.')));return {handled:true,answer:'Vamos viajar no tempo.'}}
 if(/(descobrir|atlas)/.test(q)&&open){openDiscover('');return {handled:true,answer:'Abrindo o Atlas Nerdora.'}}
 if(hasNavVerb(question)){
   const atlasPlace=explicitAtlas(question);
   if(atlasPlace){flyResolved({...atlasPlace,source:'Atlas Nerdora'});return {handled:true,answer:'Indo para '+atlasPlace.name+'.'}}
   const dest=destinationFrom(question);
   if(!dest)return {handled:true,answer:'Qual lugar você quer localizar?'};
   setStatus('Procurando o lugar…');
   try{
     const place=await resolveFreePlace(dest);
     if(!place)return {handled:true,answer:'Não consegui identificar esse lugar com segurança. Tente informar o nome completo, cidade ou país.'};
     flyResolved(place);return {handled:true,answer:'Encontrei '+place.name+'. Indo para lá.'};
   }catch{return {handled:true,answer:'Não consegui consultar a base geográfica agora. Tente novamente em alguns instantes.'}}
 }
 return {handled:false};
}

function realtimeQuestion(question){
 const q=norm(question);
 return /(hoje|agora|neste momento|atual|tempo real)/.test(q)&&/(terremot|incendi|queimada|satelit|clima|tempestad|furacao|ciclone)/.test(q);
}

async function send(question){
 const clean=question.trim();if(busy||!clean)return;busy=true;
 addMessage('user',clean);remember('user',clean);setStatus('Pensando sem custo…');
 const input=document.querySelector('#terraAiInput');if(input)input.value='';
 try{
   const cmd=await commandAnswer(clean);
   if(cmd.handled){addMessage('assistant',cmd.answer);remember('assistant',cmd.answer);setStatus('IA gratuita • comandos do Terra ativos');busy=false;return}
   if(realtimeQuestion(clean)){
     const answer='Essa pergunta depende de dados atuais. Posso usar o painel Terra ao Vivo, que reúne as fontes em tempo real, mas só vou abri-lo se você pedir “mostre … ao vivo”.';
     addMessage('assistant',answer);remember('assistant',answer);setStatus('IA gratuita • dados atuais ficam no Ao Vivo');busy=false;return;
   }
   const data=await answerFree(clean);
   const answer=data.source?`${data.answer}\n\nFonte: ${data.source}`:data.answer;
   addMessage('assistant',answer);remember('assistant',answer);setStatus('IA gratuita • Atlas + Wikipédia • sem cobrança');
 }catch{
   const place=explicitAtlas(clean);
   const answer=place?`${place.name} fica em ${place.country}. ${place.description}`:'Não encontrei uma resposta confiável nas bases gratuitas agora. Tente reformular a pergunta com o nome do lugar, fenômeno ou período geológico.';
   addMessage('assistant',answer);remember('assistant',answer);setStatus('IA gratuita • modo local');
 }
 busy=false;
}

function buildUi(){
 const header=document.querySelector('.header');if(!header||document.querySelector('#terraAiBtn'))return;
 const btn=el('button','terra-ai-head-btn');btn.id='terraAiBtn';btn.type='button';btn.setAttribute('aria-label','Nerdora Terra IA');btn.title='Nerdora Terra IA';btn.textContent='✦';
 const sound=header.querySelector('[data-action="sound"]');header.insertBefore(btn,sound||null);
 const aside=el('aside','terra-ai-sheet');aside.id='terraAiSheet';aside.setAttribute('aria-hidden','true');
 aside.innerHTML=`<div class="terra-ai-backdrop" id="terraAiBackdrop"></div><section class="terra-ai-card panel"><div class="terra-ai-head"><div><small>NERDORA TERRA IA • GRATUITA</small><h3>Converse com o planeta ✦</h3><p>Atlas Nerdora + Wikipédia + dados do Terra. Sem cobrança por pergunta.</p></div><button id="terraAiClose" aria-label="Fechar">×</button></div><div class="terra-ai-chips"><button data-ai-prompt="Me leve até as Pirâmides de Gizé">Pirâmides</button><button data-ai-prompt="O que é a Fossa das Marianas?">Marianas</button><button data-ai-prompt="Mostre a Terra há 66 Ma">66 Ma</button><button data-ai-prompt="Qual é a montanha mais alta do mundo?">Everest</button></div><div class="terra-ai-messages" id="terraAiMessages"></div><form id="terraAiForm" class="terra-ai-form"><input id="terraAiInput" autocomplete="off" maxlength="900" placeholder="Pergunte sobre a Terra ou dê um comando…"><button type="submit">Enviar</button></form><div id="terraAiStatus" class="terra-ai-status">IA gratuita • sem cobrança</div></section>`;
 document.querySelector('.screen')?.appendChild(aside);
 addMessage('assistant','Agora funciono em modo gratuito: uso o Atlas Nerdora e fontes públicas para responder perguntas, e só movo o globo quando você pedir explicitamente.');
 const open=()=>{aside.classList.add('open');aside.setAttribute('aria-hidden','false');setTimeout(()=>document.querySelector('#terraAiInput')?.focus(),180)};
 const close=()=>{aside.classList.remove('open');aside.setAttribute('aria-hidden','true')};
 btn.onclick=open;document.querySelector('#terraAiClose').onclick=close;document.querySelector('#terraAiBackdrop').onclick=close;
 document.querySelector('#terraAiForm').onsubmit=e=>{e.preventDefault();send(document.querySelector('#terraAiInput').value)};
 document.querySelectorAll('[data-ai-prompt]').forEach(b=>b.onclick=()=>send(b.dataset.aiPrompt));
}

if(document.readyState==='complete')setTimeout(buildUi,100);else window.addEventListener('load',()=>setTimeout(buildUi,100),{once:true});
