import {atlas} from './atlas-engine.js';

function esc(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

function closeDiscover(){
  const sheet=document.querySelector('#discoverSheet');
  sheet?.classList.remove('open');
  sheet?.setAttribute('aria-hidden','true');
}

function showAtlasCard(place){
  const sheet=document.querySelector('#sheet');
  if(!sheet)return;
  document.querySelector('#sheetIcon').textContent=place.category==='História'?'🏛️':place.category==='Natureza'?'🌿':place.category==='Geologia'?'🌋':place.category==='Cidades'?'🏙️':'📍';
  document.querySelector('#sheetKind').textContent='ATLAS NERDORA • '+place.category.toUpperCase();
  document.querySelector('#sheetTitle').textContent=place.name;
  document.querySelector('#sheetText').textContent=place.description+' • '+place.country+' • '+place.subcategory;
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
    <div class="top"><div class="icon">${p.category==='História'?'🏛️':p.category==='Natureza'?'🌿':p.category==='Geologia'?'🌋':p.category==='Cidades'?'🏙️':'📍'}</div><b>${esc(p.name)}</b></div>
    <p>${esc(p.description)}</p>
    <div class="atlas-path">${esc(p.category)} › ${esc(p.subcategory)}</div>
    <div class="meta"><span>${esc(p.country)}</span><span>Localizar ›</span></div>
    <div class="atlas-tags">${(p.tags||[]).slice(0,4).map(t=>`<i>${esc(t)}</i>`).join('')}</div>
  </button>`).join('');
  list.querySelectorAll('[data-atlas-place]').forEach(btn=>btn.onclick=()=>go(results[Number(btn.dataset.atlasPlace)]));
  return true;
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
}

if(document.readyState==='complete')setTimeout(install,120);
else window.addEventListener('load',()=>setTimeout(install,120),{once:true});
