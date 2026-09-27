import * as maplibregl from 'https://unpkg.com/maplibre-gl@6.11.2/dist/maplibre-gl.mjs';

const ERAS=[
 {ma:0,label:'Hoje',period:'Holoceno',name:'O mundo atual',icon:'🌍',text:'Continentes e oceanos na configuração moderna.'},
 {ma:20,label:'20 Ma',period:'Neógeno',name:'Um planeta já familiar',icon:'🐘',text:'Os continentes se aproximam bastante das posições modernas, mas importantes mares e conexões ainda eram diferentes.'},
 {ma:66,label:'66 Ma',period:'Fim do Cretáceo',name:'O fim dos grandes dinossauros',icon:'☄️',text:'Os continentes estavam separados, o Atlântico era menor e o planeta vivia uma grande transição biológica.'},
 {ma:145,label:'145 Ma',period:'Cretáceo inicial',name:'Continentes se afastando',icon:'🦖',text:'A fragmentação de Pangeia acelerava e novos oceanos ganhavam espaço.'},
 {ma:201,label:'201 Ma',period:'Jurássico inicial',name:'Pangeia começa a se partir',icon:'🦕',text:'Grandes massas continentais ainda permaneciam conectadas enquanto riftes começavam a separar o supercontinente.'},
 {ma:252,label:'252 Ma',period:'Triássico inicial',name:'Pangeia domina o globo',icon:'🌋',text:'Quase todas as grandes massas de terra estavam reunidas em Pangeia.'},
 {ma:300,label:'300 Ma',period:'Carbonífero',name:'A montagem de Pangeia',icon:'🌿',text:'Grandes continentes convergiam e extensas florestas ocupavam regiões equatoriais.'},
 {ma:410,label:'410 Ma',period:'Devoniano inicial',name:'Mundos paleozoicos',icon:'🐟',text:'Os continentes tinham formas e posições muito diferentes, com oceanos antigos entre grandes blocos de terra.'},
 {ma:600,label:'600 Ma',period:'Ediacarano',name:'Antes da explosão cambriana',icon:'🪼',text:'O planeta abrigava continentes muito diferentes dos atuais e a vida multicelular começava a se diversificar.'},
 {ma:1000,label:'1.000 Ma',period:'Neoproterozoico',name:'Tempo de supercontinentes',icon:'🧩',text:'As reconstruções profundas ajudam a visualizar a organização de antigos blocos continentais em escalas de bilhões de anos.'}
];

const GWS='https://gws.gplates.org/reconstruct/coastlines/';
let map,currentIndex=0,requestToken=0,toastTimer;
const empty={type:'FeatureCollection',features:[]};

map=new maplibregl.Map({
 container:'paleoMap',
 style:{version:8,sources:{},layers:[{id:'ocean',type:'background',paint:{'background-color':'#03162c'}}]},
 center:[0,12],zoom:1.05,minZoom:.4,maxZoom:5,attributionControl:false,renderWorldCopies:false
});
map.dragRotate.disable();
map.touchZoomRotate.disableRotation();
map.on('style.load',()=>{
 map.setProjection({type:'globe'});
 map.addSource('paleo',{type:'geojson',data:empty});
 map.addLayer({id:'land-fill',type:'fill',source:'paleo',paint:{'fill-color':'#5f8f52','fill-opacity':.92}});
 map.addLayer({id:'land-line',type:'line',source:'paleo',paint:{'line-color':'#9ce3b2','line-width':.7,'line-opacity':.75}});
 map.addLayer({id:'coast-line',type:'line',source:'paleo',filter:['==',['geometry-type'],'LineString'],paint:{'line-color':'#8ef1c8','line-width':1.1,'line-opacity':.85}});
 setEra(0,true);
});

function toast(msg){const t=document.querySelector('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),2400)}

async function loadCoastlines(ma){
 const token=++requestToken;
 const loading=document.querySelector('#timeLoading');
 loading.classList.remove('hide');
 loading.textContent='Reconstruindo continentes...';
 try{
   const model='CAO2024';
   const url=`${GWS}?time=${ma}&model=${model}&wrap=true`;
   const res=await fetch(url,{mode:'cors'});
   if(!res.ok)throw new Error('HTTP '+res.status);
   const data=await res.json();
   if(token!==requestToken)return;
   map.getSource('paleo')?.setData(data);
   loading.classList.add('hide');
 }catch(err){
   if(token!==requestToken)return;
   loading.textContent='Não foi possível carregar esta reconstrução agora.';
   map.getSource('paleo')?.setData(empty);
   toast('A reconstrução científica não carregou. Tente novamente.');
 }
}

function renderTicks(){
 const box=document.querySelector('#ticks');
 box.innerHTML=ERAS.map((e,i)=>`<button data-i="${i}" class="${i===currentIndex?'active':''}">${e.ma===1000?'1 bi':e.ma+' Ma'}</button>`).join('');
 box.querySelectorAll('button').forEach(b=>b.onclick=()=>setEra(+b.dataset.i));
}
function renderJump(){
 const box=document.querySelector('#jumpGrid');
 box.innerHTML=ERAS.map((e,i)=>`<button class="jump-btn ${i===currentIndex?'active':''}" data-i="${i}"><b>${e.period}</b><span>${e.label} • ${e.name}</span></button>`).join('');
 box.querySelectorAll('button').forEach(b=>b.onclick=()=>setEra(+b.dataset.i));
}

function setEra(i,first=false){
 currentIndex=i;
 const e=ERAS[i];
 document.querySelector('#eraTitle').textContent=e.label;
 document.querySelector('#ageBadge').textContent=e.ma===1000?'1.000 Ma':e.ma+' Ma';
 document.querySelector('#eraIcon').textContent=e.icon;
 document.querySelector('#eraPeriod').textContent=e.period.toUpperCase();
 document.querySelector('#eraName').textContent=e.name;
 document.querySelector('#eraText').textContent=e.text;
 document.querySelector('#timelineAge').textContent=e.ma===0?'Hoje':e.ma.toLocaleString('pt-BR')+' milhões de anos';
 document.querySelector('#timeSlider').value=i;
 renderTicks();
 renderJump();
 if(!first)map.easeTo({center:[0,12],zoom:1.05,duration:600});
 loadCoastlines(e.ma);
}

document.querySelector('#timeSlider').addEventListener('input',e=>setEra(+e.target.value));
document.querySelector('#backBtn').onclick=()=>location.href='./index.html?v=6';
renderTicks();
renderJump();