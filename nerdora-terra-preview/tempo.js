import * as maplibregl from 'https://unpkg.com/maplibre-gl@6.11.2/dist/maplibre-gl.mjs';

const ERAS=[
 {ma:0,label:'Hoje',period:'Holoceno',name:'O mundo atual',icon:'🌍',eventTag:'MUNDO ATUAL',text:'Continentes e oceanos na configuração moderna.',climate:'Clima moderno, com grandes zonas tropicais, temperadas e polares.',life:'Biodiversidade moderna e forte influência humana nos ecossistemas.',world:'Continentes nas posições atuais.',event:'É a referência usada para comparar todas as reconstruções anteriores.',curiosity:'A superfície terrestre continua se movendo alguns centímetros por ano.',accent:'#62efda',accent2:'#3ecfff',land:'#5f8f52',line:'#9ce3b2',ocean:'#03162c'},
 {ma:20,label:'20 Ma',period:'Neógeno',name:'Um planeta já familiar',icon:'🐘',eventTag:'MAMÍFEROS EM EXPANSÃO',text:'Os continentes já lembravam bastante o mundo moderno, mas mares e conexões ainda eram diferentes.',climate:'Em geral mais quente que hoje, seguido por tendência de resfriamento.',life:'Mamíferos e aves já dominavam muitos ecossistemas terrestres.',world:'Atlântico já amplo; Índia integrada à Ásia; mudanças importantes em mares regionais.',event:'Grandes cadeias montanhosas continuavam sendo elevadas pela tectônica.',curiosity:'Muitos grupos de mamíferos modernos já existiam, mas as paisagens ainda não eram as de hoje.',accent:'#6cf2c2',accent2:'#48bff7',land:'#659458',line:'#a2e4b7',ocean:'#061a31'},
 {ma:66,label:'66 Ma',period:'Fim do Cretáceo',name:'O fim dos grandes dinossauros',icon:'☄️',eventTag:'EXTINÇÃO EM MASSA',text:'Os continentes estavam separados, o Atlântico era menor e o planeta vivia uma mudança biológica gigantesca.',climate:'Clima global geralmente quente, com pouco ou nenhum gelo permanente nos polos.',life:'Dinossauros não avianos desaparecem; aves, mamíferos e muitos outros grupos sobrevivem.',world:'América do Sul e África já separadas; Índia ainda viajava para o norte.',event:'O impacto de Chicxulub coincide com a extinção do fim do Cretáceo.',curiosity:'A extinção abriu muitos nichos ecológicos que depois seriam ocupados por mamíferos.',accent:'#ffd05f',accent2:'#ff795d',land:'#7e8751',line:'#ffd98f',ocean:'#10182f'},
 {ma:145,label:'145 Ma',period:'Cretáceo inicial',name:'Continentes se afastando',icon:'🦖',eventTag:'NOVOS OCEANOS',text:'A fragmentação de Pangeia acelerava e novos oceanos ganhavam espaço.',climate:'Mundo quente, com altos níveis do mar em grande parte do período.',life:'Dinossauros diversos; plantas com flores começam sua grande expansão no Cretáceo.',world:'Laurásia e Gondwana já estavam se fragmentando em blocos menores.',event:'A abertura do Atlântico Sul avançava progressivamente.',curiosity:'O mapa já começa a lembrar vagamente continentes modernos, mas ainda há enormes diferenças.',accent:'#9eff6d',accent2:'#48d6a8',land:'#769d50',line:'#b9ef8e',ocean:'#041b2b'},
 {ma:201,label:'201 Ma',period:'Jurássico inicial',name:'Pangeia começa a se partir',icon:'🦕',eventTag:'PANGEIA FRATURA',text:'Grandes massas continentais ainda permaneciam conectadas enquanto riftes começavam a separar o supercontinente.',climate:'Quente em muitas regiões, com fortes contrastes sazonais no interior continental.',life:'Dinossauros se diversificam rapidamente após a crise do fim do Triássico.',world:'Pangeia ainda domina o globo, mas já apresenta grandes zonas de ruptura.',event:'A extinção Triássico–Jurássico marca a transição para o Jurássico.',curiosity:'O Atlântico ainda era apenas um sistema de riftes e mares estreitos em formação.',accent:'#8df49b',accent2:'#42c6d9',land:'#678b4c',line:'#ade6a8',ocean:'#071a2a'},
 {ma:252,label:'252 Ma',period:'Triássico inicial',name:'Pangeia domina o globo',icon:'🌋',eventTag:'A GRANDE MORTE',text:'Quase todas as grandes massas de terra estavam reunidas em Pangeia.',climate:'Interior continental vasto e frequentemente árido, com extremos sazonais.',life:'A biosfera se recuperava da maior extinção em massa conhecida.',world:'Um supercontinente gigantesco cercado por um oceano global dominante.',event:'A extinção Permiano–Triássico ocorre por volta de 252 milhões de anos atrás.',curiosity:'Pangeia era tão grande que seu interior ficava muito distante da influência moderadora dos oceanos.',accent:'#ffaf5d',accent2:'#ff625b',land:'#876c48',line:'#ffc182',ocean:'#11152a'},
 {ma:300,label:'300 Ma',period:'Carbonífero',name:'A montagem de Pangeia',icon:'🌿',eventTag:'FLORESTAS DE CARVÃO',text:'Grandes continentes convergiam e extensas florestas ocupavam regiões equatoriais.',climate:'Períodos glaciais no hemisfério sul coexistiam com zonas equatoriais úmidas.',life:'Grandes florestas pantanosas, insetos diversos e primeiros amniotas em expansão.',world:'Blocos continentais convergiam para formar Pangeia.',event:'Grandes volumes de matéria vegetal foram enterrados e contribuíram para depósitos de carvão.',curiosity:'Os ecossistemas pantanosos do Carbonífero foram muito diferentes das florestas modernas.',accent:'#77f28c',accent2:'#35b987',land:'#4f8747',line:'#9be9a3',ocean:'#041a29'},
 {ma:410,label:'410 Ma',period:'Devoniano inicial',name:'Mundos paleozoicos',icon:'🐟',eventTag:'ERA DOS PEIXES',text:'Os continentes tinham formas e posições muito diferentes, separados por oceanos antigos.',climate:'Clima variável, geralmente mais quente que o atual em amplas regiões.',life:'Peixes se diversificam; plantas vasculares e artrópodes expandem sua presença em terra.',world:'Laurússia e Gondwana eram grandes protagonistas da geografia do período.',event:'Ecossistemas terrestres começam a ficar mais complexos.',curiosity:'As primeiras florestas verdadeiras surgiriam durante o Devoniano.',accent:'#5fe7d9',accent2:'#3b9ddb',land:'#568b64',line:'#91e0bd',ocean:'#05182d'},
 {ma:600,label:'600 Ma',period:'Ediacarano',name:'Antes da explosão cambriana',icon:'🪼',eventTag:'VIDA COMPLEXA',text:'O planeta abrigava continentes muito diferentes dos atuais e a vida multicelular começava a se diversificar.',climate:'O planeta saía de episódios glaciais extremos do Neoproterozoico.',life:'Organismos multicelulares de corpo mole aparecem com maior diversidade no registro fóssil.',world:'Blocos continentais antigos se reorganizavam após a fragmentação de supercontinentes anteriores.',event:'A biota ediacarana antecede a grande diversificação animal do Cambriano.',curiosity:'Muitos organismos ediacaranos não têm equivalentes modernos claros.',accent:'#ba8cff',accent2:'#5e9dff',land:'#6a6d87',line:'#c8b5ff',ocean:'#07142b'},
 {ma:1000,label:'1.000 Ma',period:'Neoproterozoico',name:'Tempo de supercontinentes',icon:'🧩',eventTag:'RODÍNIA',text:'Reconstruções profundas ajudam a visualizar antigos blocos continentais em escalas de bilhões de anos.',climate:'Condições de longo prazo muito diferentes; grandes mudanças climáticas ocorreriam no Neoproterozoico.',life:'Vida principalmente microscópica e eucariótica, com ecossistemas muito mais simples que os atuais.',world:'Rodínia é o grande supercontinente associado a esta faixa de tempo.',event:'Montagem e reorganização de grandes blocos continentais em ciclos supercontinentais.',curiosity:'Quanto mais voltamos no tempo, maiores ficam as incertezas nas reconstruções tectônicas.',accent:'#d686ff',accent2:'#6c72ff',land:'#6b6683',line:'#d4b7ff',ocean:'#0b1029'}
];

const GWS='https://gws.gplates.org/reconstruct/coastlines/';
let map,currentIndex=0,requestToken=0,toastTimer,compareOn=false,modernData=null,playTimer=null;
const empty={type:'FeatureCollection',features:[]};

map=new maplibregl.Map({
 container:'paleoMap',
 style:{version:8,sources:{},layers:[{id:'ocean',type:'background',paint:{'background-color':'#03162c'}}]},
 center:[0,12],zoom:1.05,minZoom:.4,maxZoom:5,attributionControl:false,renderWorldCopies:false
});
map.dragRotate.disable();
map.touchZoomRotate.disableRotation();
map.on('style.load',async()=>{
 map.setProjection({type:'globe'});
 map.addSource('paleo',{type:'geojson',data:empty});
 map.addSource('modern',{type:'geojson',data:empty});
 map.addLayer({id:'land-fill',type:'fill',source:'paleo',paint:{'fill-color':'#5f8f52','fill-opacity':.92}});
 map.addLayer({id:'land-line',type:'line',source:'paleo',paint:{'line-color':'#9ce3b2','line-width':.8,'line-opacity':.8}});
 map.addLayer({id:'modern-line',type:'line',source:'modern',paint:{'line-color':'#ffffff','line-width':1.05,'line-opacity':0,'line-dasharray':[3,2]}});
 try{modernData=await fetchCoastlines(0);map.getSource('modern')?.setData(modernData)}catch{}
 setEra(0,true);
});

function toast(msg){const t=document.querySelector('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),2400)}
async function fetchCoastlines(ma){
 const url=`${GWS}?time=${ma}&model=CAO2024&wrap=true`;
 const res=await fetch(url,{mode:'cors'});
 if(!res.ok)throw new Error('HTTP '+res.status);
 return res.json();
}
async function loadCoastlines(ma){
 const token=++requestToken;
 const loading=document.querySelector('#timeLoading');
 loading.classList.remove('hide');
 loading.textContent='Reconstruindo continentes...';
 try{
   const data=await fetchCoastlines(ma);
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
function applyTheme(e){
 const root=document.documentElement.style;
 root.setProperty('--accent',e.accent);
 root.setProperty('--accent2',e.accent2);
 root.setProperty('--land',e.land);
 root.setProperty('--landline',e.line);
 root.setProperty('--ocean',e.ocean);
 if(map?.getLayer('land-fill'))map.setPaintProperty('land-fill','fill-color',e.land);
 if(map?.getLayer('land-line'))map.setPaintProperty('land-line','line-color',e.line);
 if(map?.getLayer('ocean'))map.setPaintProperty('ocean','background-color',e.ocean);
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
function updateDetails(e){
 document.querySelector('#drawerPeriod').textContent=e.period.toUpperCase();
 document.querySelector('#drawerTitle').textContent=e.name;
 document.querySelector('#factClimate').textContent=e.climate;
 document.querySelector('#factLife').textContent=e.life;
 document.querySelector('#factWorld').textContent=e.world;
 document.querySelector('#factEvent').textContent=e.event;
 document.querySelector('#factCuriosity').textContent=e.curiosity;
}
function setEra(i,first=false){
 currentIndex=Math.max(0,Math.min(ERAS.length-1,i));
 const e=ERAS[currentIndex];
 applyTheme(e);
 document.querySelector('#eraTitle').textContent=e.label;
 document.querySelector('#ageBadge').textContent=e.ma===1000?'1.000 Ma':e.ma+' Ma';
 document.querySelector('#eraIcon').textContent=e.icon;
 document.querySelector('#eraPeriod').textContent=e.period.toUpperCase();
 document.querySelector('#eraEventTag').textContent=e.eventTag;
 document.querySelector('#eraName').textContent=e.name;
 document.querySelector('#eraText').textContent=e.text;
 document.querySelector('#climateChip').textContent='🌡️ '+e.climate.split('.')[0];
 document.querySelector('#lifeChip').textContent='🧬 '+e.life.split('.')[0];
 document.querySelector('#worldChip').textContent='🧩 '+e.world.split('.')[0];
 document.querySelector('#timelineAge').textContent=e.ma===0?'Hoje':e.ma.toLocaleString('pt-BR')+' milhões de anos';
 document.querySelector('#timeSlider').value=currentIndex;
 document.querySelector('#eraPrev').disabled=currentIndex===0;
 document.querySelector('#eraNext').disabled=currentIndex===ERAS.length-1;
 const compare=document.querySelector('#compareBtn');
 compare.disabled=currentIndex===0;
 if(currentIndex===0&&compareOn)toggleCompare(false);
 updateDetails(e);
 renderTicks();
 renderJump();
 const card=document.querySelector('.era-card');card.classList.remove('flash');requestAnimationFrame(()=>card.classList.add('flash'));
 if(!first)map.easeTo({center:[0,12],zoom:1.05,duration:600});
 loadCoastlines(e.ma);
}
function toggleCompare(force){
 compareOn=typeof force==='boolean'?force:!compareOn;
 const btn=document.querySelector('#compareBtn');
 btn.classList.toggle('active',compareOn);
 btn.innerHTML=compareOn?'<span>◉</span> Hoje sobreposto':'<span>◎</span> Comparar com hoje';
 if(map?.getLayer('modern-line'))map.setPaintProperty('modern-line','line-opacity',compareOn?.8:0);
 if(compareOn)toast('Linha branca tracejada = continentes atuais');
}
function openDrawer(){const d=document.querySelector('#detailsDrawer');d.classList.add('open');d.setAttribute('aria-hidden','false')}
function closeDrawer(){const d=document.querySelector('#detailsDrawer');d.classList.remove('open');d.setAttribute('aria-hidden','true')}
function togglePlay(){
 const btn=document.querySelector('#playBtn');
 if(playTimer){clearInterval(playTimer);playTimer=null;btn.classList.remove('active');document.querySelector('#playIcon').textContent='▶';return}
 btn.classList.add('active');document.querySelector('#playIcon').textContent='Ⅱ';
 playTimer=setInterval(()=>{const next=currentIndex>=ERAS.length-1?0:currentIndex+1;setEra(next)},3500);
}

document.querySelector('#timeSlider').addEventListener('input',e=>{if(playTimer)togglePlay();setEra(+e.target.value)});
document.querySelector('#backBtn').onclick=()=>location.href='./index.html?v=7';
document.querySelector('#eraPrev').onclick=()=>{if(playTimer)togglePlay();setEra(currentIndex-1)};
document.querySelector('#eraNext').onclick=()=>{if(playTimer)togglePlay();setEra(currentIndex+1)};
document.querySelector('#compareBtn').onclick=()=>toggleCompare();
document.querySelector('#playBtn').onclick=togglePlay;
document.querySelector('#detailsBtn').onclick=openDrawer;
document.querySelector('#drawerClose').onclick=closeDrawer;
document.querySelector('#drawerBackdrop').onclick=closeDrawer;
renderTicks();
renderJump();