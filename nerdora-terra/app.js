import * as maplibregl from 'https://unpkg.com/maplibre-gl@6.11.2/dist/maplibre-gl.mjs';

const NASA_WMS='https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&VERSION=1.1.1&LAYERS=BlueMarble_NextGeneration&STYLES=&FORMAT=image/jpeg&TRANSPARENT=false&SRS=EPSG:3857&BBOX={bbox-epsg-3857}&WIDTH=512&HEIGHT=512';

const locations=[
 {id:'amazon',name:'Amazônia',icon:'🌳',kind:'NATUREZA',center:[-61.5,-4.5],zoom:3.4,text:'A maior floresta tropical do planeta ocupa uma enorme área da América do Sul e abriga uma biodiversidade extraordinária.',stats:[['Bioma','Floresta tropical'],['Região','América do Sul']]},
 {id:'everest',name:'Monte Everest',icon:'🏔️',kind:'NATUREZA',center:[86.925,27.988],zoom:5.6,text:'O ponto mais alto da superfície terrestre acima do nível do mar fica no Himalaia.',stats:[['Altitude','8.849 m'],['Região','Himalaia']]},
 {id:'mariana',name:'Fossa das Marianas',icon:'🌊',kind:'OCEANOS',center:[142.2,11.35],zoom:4.4,text:'Nesta região do Pacífico fica o Challenger Deep, o ponto conhecido mais profundo dos oceanos.',stats:[['Profundidade','~10,9 km'],['Oceano','Pacífico']]},
 {id:'reef',name:'Grande Barreira de Coral',icon:'🐠',kind:'OCEANOS',center:[147.7,-18.28],zoom:5,text:'O maior sistema de recifes de coral do planeta se estende ao longo da costa nordeste da Austrália.',stats:[['Ecossistema','Recife de coral'],['País','Austrália']]},
 {id:'andes',name:'Cordilheira dos Andes',icon:'⛰️',kind:'NATUREZA',center:[-71,-20],zoom:3.5,text:'Uma cadeia montanhosa colossal acompanha a margem oeste da América do Sul.',stats:[['Extensão','~7.000 km'],['Continente','América do Sul']]},
 {id:'antarctica',name:'Antártida',icon:'🧊',kind:'OCEANOS',center:[0,-76],zoom:2.7,text:'O continente polar guarda a maior massa de gelo da Terra e influencia o clima e os oceanos globais.',stats:[['Tipo','Continente polar'],['Hemisfério','Sul']]}
];

let map;
try{
  map=new maplibregl.Map({
    container:'earthMap',
    style:{version:8,sources:{nasa:{type:'raster',tiles:[NASA_WMS],tileSize:512,attribution:'NASA GIBS'}},layers:[{id:'earth',type:'raster',source:'nasa',paint:{'raster-fade-duration':0,'raster-contrast':.08,'raster-saturation':.08}}]},
    center:[-45,4],zoom:1.15,bearing:0,pitch:0,maxPitch:0,minZoom:.45,maxZoom:8,attributionControl:false,renderWorldCopies:false
  });
  map.dragRotate.disable();
  map.touchZoomRotate.disableRotation();
  map.on('style.load',()=>{map.setProjection({type:'globe'});try{map.addSource('terrain',{type:'raster-dem',url:'https://demotiles.maplibre.org/terrain-tiles/tiles.json',tileSize:256});map.setTerrain({source:'terrain',exaggeration:1.15})}catch{}});
  map.once('idle',()=>document.querySelector('#earthLoading').classList.add('hide'));
  map.on('error',()=>document.querySelector('#earthLoading').querySelector('b').textContent='Reconectando ao satélite...');
}catch(e){document.querySelector('#earthLoading').querySelector('b').textContent='Globo indisponível neste navegador';}

const info=document.querySelector('#infoPanel'),infoClose=document.querySelector('#infoClose'),focusButton=document.querySelector('#focusButton');
let selected=null,toastTimer;
function toast(msg){const t=document.querySelector('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),2300)}
function resetEarth(){if(!map)return;map.flyTo({center:[-45,4],zoom:1.15,pitch:0,bearing:0,duration:1300});closeInfo()}
function fly(place){if(!map)return;map.flyTo({center:place.center,zoom:place.zoom,pitch:place.zoom>4?28:0,bearing:0,duration:2200,essential:true})}
function openInfo(place){selected=place;document.querySelector('#infoKicker').textContent=place.kind;document.querySelector('#infoIcon').textContent=place.icon;document.querySelector('#infoTitle').textContent=place.name;document.querySelector('#infoText').textContent=place.text;document.querySelector('#infoStats').innerHTML=place.stats.map(([a,b])=>`<div class="info-stat"><small>${a}</small><b>${b}</b></div>`).join('');info.classList.add('open');info.setAttribute('aria-hidden','false')}
function closeInfo(){info.classList.remove('open');info.setAttribute('aria-hidden','true')}
function surprise(pool=locations){const p=pool[Math.floor(Math.random()*pool.length)];openInfo(p);fly(p)}
infoClose.onclick=closeInfo;focusButton.onclick=()=>{if(selected){closeInfo();fly(selected)}};

document.querySelectorAll('[data-action]').forEach(btn=>btn.addEventListener('click',async()=>{
 const a=btn.dataset.action;
 if(a==='fullscreen'){try{document.fullscreenElement?await document.exitFullscreen():await document.documentElement.requestFullscreen()}catch{toast('Tela cheia não disponível aqui')}return}
 if(a==='sound'){toast('Sons do Nerdora Terra ativados 🔊');return}
 if(a==='explore'){toast('Arraste a Terra e belisque para aproximar 🌍');map?.easeTo({zoom:1.55,duration:900});return}
 if(a==='random'){surprise();return}
 if(a==='nature'){surprise(locations.filter(x=>x.kind==='NATUREZA'));return}
 if(a==='ocean'){surprise(locations.filter(x=>x.kind==='OCEANOS'));return}
 if(a==='terra'){resetEarth();return}
 if(a==='discover'){openInfo(locations[0]);return}
 if(a==='time'){openInfo({name:'Terra através do tempo',icon:'🦖',kind:'LINHA DO TEMPO',center:[-45,4],zoom:1.3,text:'A linha do tempo geológica será expandida nesta interface: formação da Terra, primeiros oceanos, vida, dinossauros, eras glaciais e mundo atual.',stats:[['Origem','~4,54 bilhões de anos'],['Modo','Em evolução']]});return}
 if(a==='universe'){toast('Ligação com Nerdora Universe reservada para a integração ✨')}
}));

async function openFaunaObservationFromUrl(){
  const p=new URLSearchParams(location.search);
  if(p.get('modo')!=='fauna')return;
  const lat=Number(p.get('lat')),lng=Number(p.get('lng')),scientific=p.get('scientificName')||'',common=p.get('commonName')||scientific||'Observação do Nerdora Fauna',radius=Math.max(10,Math.min(200,Number(p.get('radius'))||50));
  if(!Number.isFinite(lat)||!Number.isFinite(lng))return;
  clearTimeout(autoTimer);
  const place={name:common,icon:'🐾',kind:'NERDORA FAUNA',center:[lng,lat],zoom:6,text:'Observação registrada no Nerdora Fauna. A posição exibida é aproximada para preservar privacidade.',stats:[['Espécie',scientific||'não informada'],['Posição aproximada',lat.toFixed(1)+', '+lng.toFixed(1)],['Fauna próxima','consultando…']]};
  if(map){
    try{
      const markerEl=document.createElement('div');markerEl.style.cssText='width:22px;height:22px;border-radius:50%;background:#55e99b;border:4px solid white;box-shadow:0 0 0 7px #55e99b33,0 0 24px #55e99b';
      new maplibregl.Marker({element:markerEl}).setLngLat([lng,lat]).addTo(map)
    }catch{}
    map.flyTo({center:[lng,lat],zoom:6,pitch:24,bearing:0,duration:2200,essential:true})
  }
  openInfo(place);
  try{
    const u='https://api.inaturalist.org/v1/observations?lat='+lat+'&lng='+lng+'&radius='+radius+'&iconic_taxa=Animalia&quality_grade=research&photos=true&order_by=observed_on&order=desc&per_page=50';
    const r=await fetch(u),j=await r.json(),seen=new Set(),names=[];
    for(const o of j.results||[]){const t=o.taxon;if(!t||seen.has(t.id))continue;seen.add(t.id);const n=t.preferred_common_name||t.name;if(n&&n!==common&&t.name!==scientific)names.push(n);if(names.length>=6)break}
    place.stats[2]=['Outras espécies próximas',names.length?names.join(' · '):'Nenhuma retornada na amostra'];
    place.text='Observação do Nerdora Fauna nesta região. O Terra consultou registros reais próximos no iNaturalist para mostrar outras espécies observadas por perto.';
    openInfo(place)
  }catch{
    place.stats[2]=['Outras espécies próximas','consulta indisponível agora'];openInfo(place)
  }
}
if(map)map.once('load',()=>openFaunaObservationFromUrl());else setTimeout(openFaunaObservationFromUrl,300);

let autoTimer;function scheduleSpin(){clearTimeout(autoTimer);autoTimer=setTimeout(()=>{if(!map)return;const c=map.getCenter();map.easeTo({center:[c.lng+18,c.lat],duration:12000,easing:t=>t});scheduleSpin()},2500)}
map?.on('dragstart',()=>clearTimeout(autoTimer));map?.on('zoomstart',()=>clearTimeout(autoTimer));map?.on('moveend',scheduleSpin);scheduleSpin();

if('serviceWorker'in navigator)addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));