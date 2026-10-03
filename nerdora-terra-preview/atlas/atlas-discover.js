import {atlas} from './atlas-engine.js';

function esc(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function iconFor(p){return p.category==='História'?'🏛️':p.category==='Natureza'?'🌿':p.category==='Geologia'?'🌋':p.category==='Cidades'?'🏙️':'📍'}

function closeDiscover(){
  const sheet=document.querySelector('#discoverSheet');
  sheet?.classList.remove('open');
  sheet?.setAttribute('aria-hidden','true');
}

function install3DAction(place){
  const sheet=document.querySelector('#sheet');
  const locate=document.querySelector('#locate');
  if(!sheet||!locate)return;
  sheet.querySelector('#atlas3dBtn')?.remove();
  const canLandmark=!!place.model3d;
  const canBuildings=place.category==='Cidades'||place.subcategory==='Arranha-céus';
  if(!canLandmark&&!canBuildings)return;
  const btn=document.createElement('button');
  btn.id='atlas3dBtn';btn.className='atlas-3d-btn';
  btn.textContent=canLandmark?'◈ Ver marco em 3D':'▦ Explorar construções 3D';
  btn.onclick=()=>{
    const map=window.__NERDORA_TERRA_CORE__?.map;if(!map)return;
    map.flyTo({center:place.center,zoom:canLandmark?18.3:16.5,pitch:64,bearing:canLandmark?-20:18,duration:2300,essential:true});
  };
  locate.insertAdjacentElement('afterend',btn);
}

function showAtlasCard(place){
  const sheet=document.querySelector('#sheet');
  if(!sheet)return;
  document.querySelector('#sheetIcon').textContent=iconFor(place);
  document.querySelector('#sheetKind').textContent='ATLAS NERDORA • '+place.category.toUpperCase();
  document.querySelector('#sheetTitle').textContent=place.name;
  document.querySelector('#sheetText').textContent=place.description+' • '+place.country+' • '+place.subcategory;
  install3DAction(place);
  sheet.classList.add('open');
  sheet.setAttribute('aria-hidden','false');
}

function go(place){
  closeDiscover();
  const map=window.__NERDORA_TERRA_CORE__?.map;
  if(map){
    const target=Math.min(19,Math.max(5,(place.zoom||7)+1.8));
    map.resize();
    map.flyTo({center:place.center,zoom:target,pitch:target>=14?62:target>=9?50:25,bearing:0,duration:2300,essential:true});
  }
  setTimeout(()=>showAtlasCard(place),1050);
}

function renderAtlasResults(query){
  const results=atlas.search(query,{limit:36});
  if(!results.length)return false;
  const list=document.querySelector('#discoverList');
  const step=document.querySelector('#discoverStep');
  const title=document.querySelector('#discoverTitle');
  if(!list||!step||!title)return false;

  step.textContent='ATLAS NERDORA';
  title.textContent=results.length+' resultados relacionados';
  list.className='discover-list discover-place-grid atlas-results';
  list.innerHTML=results.map((p,i)=>`<button class="discover-item discover-place atlas-place" data-atlas-place="${i}">
    <div class="top"><div class="icon">${iconFor(p)}</div><b>${esc(p.name)}</b>${p.model3d?'<span class="atlas-3d-mark">3D</span>':''}</div>
    <p>${esc(p.description)}</p>
    <div class="atlas-path">${esc(p.category)} › ${esc(p.subcategory)}</div>
    <div class="meta"><span>${esc(p.country)}</span><span>Localizar ›</span></div>
    <div class="atlas-tags">${(p.tags||[]).slice(0,4).map(t=>`<i>${esc(t)}</i>`).join('')}</div>
  </button>`).join('');
  list.querySelectorAll('[data-atlas-place]').forEach(btn=>btn.onclick=()=>go(results[Number(btn.dataset.atlasPlace)]));
  return true;
}

function matchOpenSheet(){
  const sheet=document.querySelector('#sheet');
  const title=document.querySelector('#sheetTitle')?.textContent?.trim();
  if(!sheet?.classList.contains('open')||!title)return;
  const exact=atlas.search(title,{limit:5}).find(p=>p.name.toLocaleLowerCase('pt-BR')===title.toLocaleLowerCase('pt-BR'));
  if(exact)install3DAction(exact);
}

function install(){
  const input=document.querySelector('#discoverSearch');
  const wrap=input?.closest('.discover-search-wrap');
  if(!input||input.dataset.atlasReady)return;
  input.dataset.atlasReady='1';
  if(wrap&&!wrap.querySelector('.atlas-badge')){
    const badge=document.createElement('b');
    badge.className='atlas-badge';
    badge.textContent='ATLAS';
    wrap.appendChild(badge);
  }
  input.addEventListener('input',()=>{
    const q=input.value.trim();
    if(q.length<2)return;
    setTimeout(()=>renderAtlasResults(q),0);
  });
  const sheet=document.querySelector('#sheet');
  if(sheet)new MutationObserver(()=>setTimeout(matchOpenSheet,0)).observe(sheet,{attributes:true,attributeFilter:['class'],subtree:true,childList:true,characterData:true});
}

if(document.readyState==='complete')setTimeout(install,120);
else window.addEventListener('load',()=>setTimeout(install,120),{once:true});
