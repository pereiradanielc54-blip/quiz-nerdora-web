import * as maplibregl from 'https://unpkg.com/maplibre-gl@6.11.2/dist/maplibre-gl.mjs';

const IMAGERY='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

const spots=[
 {name:'Amazônia',icon:'🌳',kind:'NATUREZA',center:[-61.5,-4.5],zoom:3.4,text:'A maior floresta tropical do planeta ocupa uma enorme área da América do Sul.'},
 {name:'Monte Everest',icon:'🏔️',kind:'NATUREZA',center:[86.925,27.988],zoom:5.6,text:'O ponto mais alto da superfície terrestre acima do nível do mar.'},
 {name:'Fossa das Marianas',icon:'🌊',kind:'OCEANOS',center:[142.2,11.35],zoom:4.4,text:'Região do Pacífico onde fica o Challenger Deep.'},
 {name:'Grande Barreira de Coral',icon:'🐠',kind:'OCEANOS',center:[147.7,-18.28],zoom:5,text:'O maior sistema de recifes de coral do planeta.'},
 {name:'Cordilheira dos Andes',icon:'⛰️',kind:'NATUREZA',center:[-71,-20],zoom:3.5,text:'Uma cadeia montanhosa colossal na América do Sul.'},
 {name:'Antártida',icon:'🧊',kind:'OCEANOS',center:[0,-76],zoom:2.7,text:'O continente polar coberto pela maior massa de gelo da Terra.'}
];

let map,selected=null,timer;
try{
 map=new maplibregl.Map({
   container:'earthMap',
   style:{version:8,sources:{sat:{type:'raster',tiles:[IMAGERY],tileSize:256}},layers:[{id:'satellite',type:'raster',source:'sat'}]},
   center:[-35,8],zoom:1.15,minZoom:.45,maxZoom:8,attributionControl:false,renderWorldCopies:false
 });
 map.dragRotate.disable();
 map.touchZoomRotate.disableRotation();
 map.on('style.load',()=>map.setProjection({type:'globe'}));
 map.once('idle',()=>document.querySelector('#loading').classList.add('hide'));
}catch(e){document.querySelector('#loading').textContent='Globo indisponível neste navegador';}

const sheet=document.querySelector('#sheet'),toastEl=document.querySelector('#toast');
function toast(msg){toastEl.textContent=msg;toastEl.classList.add('show');clearTimeout(timer);timer=setTimeout(()=>toastEl.classList.remove('show'),2200)}
function showSpot(p){selected=p;document.querySelector('#sheetIcon').textContent=p.icon;document.querySelector('#sheetKind').textContent=p.kind;document.querySelector('#sheetTitle').textContent=p.name;document.querySelector('#sheetText').textContent=p.text;sheet.classList.add('open')}
function closeSheet(){sheet.classList.remove('open')}
function fly(p){map?.flyTo({center:p.center,zoom:p.zoom,duration:1800,essential:true})}
function random(pool=spots){const p=pool[Math.floor(Math.random()*pool.length)];showSpot(p);fly(p)}
document.querySelector('#closeSheet').onclick=closeSheet;
document.querySelector('#locate').onclick=()=>{if(selected){closeSheet();fly(selected)}};
document.querySelectorAll('[data-action]').forEach(btn=>btn.onclick=async()=>{
 const a=btn.dataset.action;
 if(a==='fullscreen'){try{document.fullscreenElement?await document.exitFullscreen():await document.documentElement.requestFullscreen()}catch{toast('Tela cheia não disponível')};return}
 if(a==='sound'){toast('Som ativado 🔊');return}
 if(a==='explore'){map?.easeTo({zoom:1.55,duration:850});toast('Arraste a Terra e belisque para aproximar 🌍');return}
 if(a==='random'){random();return}
 if(a==='nature'){random(spots.filter(x=>x.kind==='NATUREZA'));return}
 if(a==='ocean'){random(spots.filter(x=>x.kind==='OCEANOS'));return}
 if(a==='terra'){closeSheet();map?.flyTo({center:[-35,8],zoom:1.15,duration:1100});return}
 if(a==='discover'){showSpot(spots[0]);return}
 if(a==='time'){location.href='./tempo.html?v=1';return}
 if(a==='universe'){toast('Integração com Nerdora Universe reservada ✨')}
});