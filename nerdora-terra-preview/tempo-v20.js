import * as maplibregl from 'https://unpkg.com/maplibre-gl@6.11.2/dist/maplibre-gl.mjs';

const GWS='https://gws.gplates.org';
const PBDB='https://paleobiodb.org/data1.2/occs/list.json';
const MODEL='CAO2024';
const empty={type:'FeatureCollection',features:[]};

const PERIODS=[
 {min:0,max:2.58,name:'Quaternário',era:'Cenozoico',eon:'Fanerozoico',icon:'🧑',tag:'MUNDO RECENTE',climate:'Grandes ciclos glaciais e interglaciais moldam o planeta.',life:'Faunas modernas, megafauna recente e expansão humana.',world:'Continentes muito próximos da configuração atual.',event:'Oscilações climáticas rápidas e forte influência humana no final do período.',curiosity:'Mesmo hoje as placas continuam se deslocando alguns centímetros por ano.',accent:'#62efda',accent2:'#3ecfff',land:'#5f8f52',line:'#9ce3b2',ocean:'#03162c'},
 {min:2.58,max:23.03,name:'Neógeno',era:'Cenozoico',eon:'Fanerozoico',icon:'🐘',tag:'MAMÍFEROS MODERNOS',climate:'Tendência geral de resfriamento e expansão de ambientes abertos.',life:'Mamíferos e aves modernas se diversificam amplamente.',world:'Os continentes já lembram muito o mundo atual.',event:'Elevação de cadeias montanhosas e mudanças em conexões oceânicas.',curiosity:'Muitos ecossistemas modernos começaram a adquirir sua aparência nesta fase.',accent:'#6cf2c2',accent2:'#48bff7',land:'#659458',line:'#a2e4b7',ocean:'#061a31'},
 {min:23.03,max:66,name:'Paleógeno',era:'Cenozoico',eon:'Fanerozoico',icon:'🦣',tag:'RADIAÇÃO DOS MAMÍFEROS',climate:'Grande parte do período foi mais quente que hoje, seguida por forte resfriamento.',life:'Mamíferos, aves e plantas modernas ocupam nichos deixados após a extinção do Cretáceo.',world:'Índia colide com a Ásia e o Atlântico continua se alargando.',event:'Transição de um mundo greenhouse para condições mais frias.',curiosity:'No Eoceno houve florestas em latitudes hoje muito frias.',accent:'#7ae7ad',accent2:'#48c8ee',land:'#668f56',line:'#abe6ae',ocean:'#041a2d'},
 {min:66,max:145,name:'Cretáceo',era:'Mesozoico',eon:'Fanerozoico',icon:'🦖',tag:'DINOSSAUROS & FLORES',climate:'Mundo geralmente quente, com mares rasos extensos e pouco gelo permanente.',life:'Dinossauros dominam em terra; plantas com flores se expandem.',world:'A fragmentação de Gondwana acelera e o Atlântico cresce.',event:'O período termina com a extinção de 66 Ma associada ao impacto de Chicxulub.',curiosity:'O nível do mar chegou a ser muito mais alto que o atual em partes do Cretáceo.',accent:'#9eff6d',accent2:'#48d6a8',land:'#769d50',line:'#b9ef8e',ocean:'#041b2b'},
 {min:145,max:201.4,name:'Jurássico',era:'Mesozoico',eon:'Fanerozoico',icon:'🦕',tag:'PANGEIA SEPARA',climate:'Clima global quente e úmido em muitas regiões.',life:'Dinossauros muito diversos; primeiros pássaros conhecidos aparecem.',world:'Pangeia se rompe e novos oceanos começam a se abrir.',event:'A abertura inicial do Atlântico transforma a geografia global.',curiosity:'Muitos litorais modernos ainda não existiam.',accent:'#8df49b',accent2:'#42c6d9',land:'#678b4c',line:'#ade6a8',ocean:'#071a2a'},
 {min:201.4,max:251.9,name:'Triássico',era:'Mesozoico',eon:'Fanerozoico',icon:'🌋',tag:'PANGEIA',climate:'Interior de Pangeia frequentemente árido e com extremos sazonais.',life:'Primeiros dinossauros e primeiros mamíferos surgem.',world:'Quase toda a terra emersa integra o supercontinente Pangeia.',event:'O período termina com outra grande extinção em massa.',curiosity:'O oceano Panthalassa ocupava enorme parte do planeta.',accent:'#ffb260',accent2:'#ff725d',land:'#866e4c',line:'#ffc182',ocean:'#11152a'},
 {min:251.9,max:298.9,name:'Permiano',era:'Paleozoico',eon:'Fanerozoico',icon:'🔥',tag:'A GRANDE MORTE',climate:'Clima continental intenso em um planeta dominado por Pangeia.',life:'Sinapsídeos e diversos grupos paleozoicos prosperam antes da crise final.',world:'Pangeia está consolidada.',event:'A maior extinção em massa conhecida encerra o período por volta de 252 Ma.',curiosity:'A crise Permiano–Triássico eliminou grande parte das espécies marinhas conhecidas.',accent:'#ff9f5e',accent2:'#ff5b59',land:'#846949',line:'#ffc07e',ocean:'#12152a'},
 {min:298.9,max:358.9,name:'Carbonífero',era:'Paleozoico',eon:'Fanerozoico',icon:'🌿',tag:'FLORESTAS DE CARVÃO',climate:'Glaciações no sul coexistem com regiões equatoriais muito úmidas.',life:'Grandes florestas pantanosas, insetos diversos e primeiros amniotas.',world:'Massas continentais convergem para formar Pangeia.',event:'Acúmulo de matéria orgânica contribui para grandes depósitos de carvão.',curiosity:'Alguns artrópodes atingiram tamanhos impressionantes em certos ecossistemas.',accent:'#77f28c',accent2:'#35b987',land:'#4f8747',line:'#9be9a3',ocean:'#041a29'},
 {min:358.9,max:419.2,name:'Devoniano',era:'Paleozoico',eon:'Fanerozoico',icon:'🐟',tag:'ERA DOS PEIXES',climate:'Clima em geral quente, mas com mudanças importantes no final do período.',life:'Peixes se diversificam; florestas e vertebrados terrestres aparecem.',world:'Laurússia e Gondwana dominam a configuração continental.',event:'O final do Devoniano inclui uma crise biológica prolongada.',curiosity:'As primeiras florestas alteraram solos, rios e o ciclo global do carbono.',accent:'#5fe7d9',accent2:'#3b9ddb',land:'#568b64',line:'#91e0bd',ocean:'#05182d'},
 {min:419.2,max:443.8,name:'Siluriano',era:'Paleozoico',eon:'Fanerozoico',icon:'🌱',tag:'VIDA EM TERRA',climate:'Após a glaciação do fim do Ordoviciano, o clima se torna mais estável.',life:'Plantas vasculares simples e artrópodes avançam sobre continentes.',world:'Oceanos antigos ainda separam grandes massas continentais.',event:'Ecossistemas terrestres começam a se tornar mais complexos.',curiosity:'As primeiras plantas terrestres eram pequenas, mas mudariam profundamente o planeta.',accent:'#67e7c7',accent2:'#47aee8',land:'#5b8760',line:'#a2dfbd',ocean:'#05182c'},
 {min:443.8,max:485.4,name:'Ordoviciano',era:'Paleozoico',eon:'Fanerozoico',icon:'🐚',tag:'MARES DIVERSOS',climate:'Grande parte do período foi quente, terminando com intensa glaciação.',life:'Forte diversificação da vida marinha.',world:'Continentes ocupam posições muito diferentes das atuais.',event:'Uma grande extinção marca o fim do período.',curiosity:'Recifes e comunidades marinhas se diversificaram muito antes de vertebrados dominarem em terra.',accent:'#5fd7dd',accent2:'#537fea',land:'#5c7f6d',line:'#a8d8c4',ocean:'#07172c'},
 {min:485.4,max:538.8,name:'Cambriano',era:'Paleozoico',eon:'Fanerozoico',icon:'🦐',tag:'EXPLOSÃO CAMBRIANA',climate:'Mares rasos cobrem extensas plataformas continentais.',life:'Muitos planos corporais animais aparecem ou se diversificam rapidamente no registro fóssil.',world:'Grandes blocos continentais estão dispersos.',event:'A chamada Explosão Cambriana transforma o registro da vida animal.',curiosity:'Trilobitas se tornaram alguns dos fósseis mais conhecidos deste intervalo.',accent:'#66d0f0',accent2:'#7d85ff',land:'#647b74',line:'#b1d9d0',ocean:'#07172e'},
 {min:538.8,max:635,name:'Ediacarano',era:'Neoproterozoico',eon:'Proterozoico',icon:'🪼',tag:'VIDA COMPLEXA',climate:'O planeta se recupera de episódios glaciais extremos.',life:'Organismos multicelulares de corpo mole tornam-se mais diversos.',world:'Blocos continentais se reorganizam após grandes ciclos tectônicos.',event:'A biota ediacarana antecede a diversificação do Cambriano.',curiosity:'Muitos organismos ediacaranos não têm equivalentes modernos claros.',accent:'#ba8cff',accent2:'#5e9dff',land:'#6a6d87',line:'#c8b5ff',ocean:'#07142b'},
 {min:635,max:720,name:'Criogeniano',era:'Neoproterozoico',eon:'Proterozoico',icon:'🧊',tag:'TERRA BOLA DE NEVE',climate:'Episódios de glaciação global ou quase global marcam o período.',life:'Vida microscópica domina; eucariotos continuam evoluindo.',world:'Continentes e oceanos passam por reorganizações profundas.',event:'Grandes glaciações Sturtiana e Marinoana estão associadas a esta faixa de tempo.',curiosity:'Há fortes evidências de gelo alcançando baixas latitudes em partes do Criogeniano.',accent:'#9bcfff',accent2:'#7d8cff',land:'#71788c',line:'#cad7ff',ocean:'#081329'},
 {min:720,max:1000.1,name:'Toniano',era:'Neoproterozoico',eon:'Proterozoico',icon:'🧩',tag:'RODÍNIA',climate:'Condições de longo prazo muito diferentes das atuais.',life:'Eucariotos se diversificam em ecossistemas ainda majoritariamente microscópicos.',world:'Rodínia é o supercontinente associado a grande parte desta faixa temporal.',event:'Montagem e fragmentação de supercontinentes moldam o planeta.',curiosity:'Quanto mais voltamos no tempo, maiores ficam as incertezas tectônicas.',accent:'#d686ff',accent2:'#6c72ff',land:'#6b6683',line:'#d4b7ff',ocean:'#0b1029'}
];

const KEY_AGES=[0,2.58,23,66,100,145,201.4,251.9,300,372,419,539,635,720,1000];
const MOMENTS=[
 {ma:0,icon:'🌍',name:'Hoje',desc:'Configuração continental moderna.'},
 {ma:2.58,icon:'🧊',name:'Início do Quaternário',desc:'Ciclos glaciais recentes ganham força.'},
 {ma:23.03,icon:'🐘',name:'Início do Neógeno',desc:'Mamíferos modernos se expandem.'},
 {ma:66,icon:'☄️',name:'Chicxulub',desc:'Fim do Cretáceo e extinção em massa.'},
 {ma:145,icon:'🦖',name:'Cretáceo inicial',desc:'Continentes seguem se separando.'},
 {ma:201.4,icon:'🌋',name:'Fim do Triássico',desc:'Crise biológica e grande vulcanismo.'},
 {ma:251.9,icon:'🔥',name:'A Grande Morte',desc:'Maior extinção em massa conhecida.'},
 {ma:300,icon:'🌿',name:'Florestas de carvão',desc:'Grandes pântanos do Carbonífero.'},
 {ma:372,icon:'🐟',name:'Crise Devoniana',desc:'Mudanças profundas nos mares paleozoicos.'},
 {ma:539,icon:'🦐',name:'Explosão Cambriana',desc:'Grande diversificação da vida animal.'},
 {ma:635,icon:'🧊',name:'Fim de grandes glaciações',desc:'Transição para o Ediacarano.'},
 {ma:1000,icon:'🧩',name:'Tempo de Rodínia',desc:'Mundo dominado por ciclos de supercontinentes.'}
];

const EVENTS=[
 {ma:66,tol:3,icon:'☄️',name:'Impacto de Chicxulub',desc:'Grande impacto associado à extinção do fim do Cretáceo.',center:[-89.5,21.4],type:'Impacto'},
 {ma:66,tol:4,icon:'🌋',name:'Trapps do Decão',desc:'Enorme província vulcânica ativa perto do fim do Cretáceo.',center:[73.5,20.5],type:'Vulcanismo'},
 {ma:201.4,tol:5,icon:'🌋',name:'Província Magmática do Atlântico Central',desc:'Vulcanismo em escala continental próximo da crise Triássico–Jurássico.',center:[-45,15],type:'Vulcanismo'},
 {ma:251.9,tol:5,icon:'🔥',name:'Trapps Siberianos',desc:'Vulcanismo gigantesco associado à crise Permiano–Triássico.',center:[90,60],type:'Vulcanismo'},
 {ma:372,tol:12,icon:'⚠️',name:'Crises do Devoniano tardio',desc:'Pulso prolongado de extinções, especialmente em ambientes marinhos.',type:'Extinção'},
 {ma:443.8,tol:5,icon:'🧊',name:'Extinção Ordoviciano–Siluriano',desc:'Crise biológica ligada a forte mudança climática e glaciação.',type:'Extinção'},
 {ma:539,tol:14,icon:'🦐',name:'Explosão Cambriana',desc:'Rápida diversificação de muitos grupos animais no registro fóssil.',type:'Evolução'},
 {ma:635,tol:12,icon:'🧊',name:'Fim da glaciação Marinoana',desc:'Fim de um dos grandes episódios de Terra Bola de Neve.',type:'Clima'}
];

const FOSSIL_GROUPS=[
 {id:'dino',name:'Dinossauros',icon:'🦖',taxon:'Dinosauria'},
 {id:'mammal',name:'Mamíferos',icon:'🐘',taxon:'Mammalia'},
 {id:'trilo',name:'Trilobitas',icon:'🦐',taxon:'Trilobita'},
 {id:'ammon',name:'Amonites',icon:'🐚',taxon:'Ammonoidea'},
 {id:'plants',name:'Plantas',icon:'🌿',taxon:'Tracheophyta'},
 {id:'ichthyo',name:'Ictiossauros',icon:'🐬',taxon:'Ichthyosauria'}
];

const TRACK_PLACES=[
 {id:'brasilia',name:'Brasília',country:'Brasil',lng:-47.8825,lat:-15.7942},
 {id:'amazonia',name:'Amazônia (Manaus)',country:'Brasil',lng:-60.0217,lat:-3.1190},
 {id:'rio',name:'Rio de Janeiro',country:'Brasil',lng:-43.1729,lat:-22.9068},
 {id:'sp',name:'São Paulo',country:'Brasil',lng:-46.6333,lat:-23.5505},
 {id:'lisboa',name:'Lisboa',country:'Portugal',lng:-9.1393,lat:38.7223},
 {id:'cairo',name:'Cairo',country:'Egito',lng:31.2357,lat:30.0444},
 {id:'tokyo',name:'Tóquio',country:'Japão',lng:139.6917,lat:35.6895},
 {id:'ny',name:'Nova York',country:'Estados Unidos',lng:-74.006,lat:40.7128},
 {id:'sydney',name:'Sydney',country:'Austrália',lng:151.2093,lat:-33.8688}
];

let map;
let currentAge=0;
let mode='earth';
let compareOn=false;
let compareOpacity=.82;
let playTimer=null;
let toastTimer=null;
let coastToken=0;
let platesToken=0;
let eventsToken=0;
let trackToken=0;
let currentFossil=null;
let fossilData=empty;
let platesOn=false;
let trackedPlace=null;
let trackedPaleo=null;
let ageDebounce=null;

const $=s=>document.querySelector(s);

function clamp(v,min,max){return Math.max(min,Math.min(max,v))}
function num(v){const n=Number(v);return Number.isFinite(n)?n:null}
function fmtAge(ma){if(ma===0)return 'Hoje';if(ma<10)return ma.toLocaleString('pt-BR',{maximumFractionDigits:2})+' Ma';return Math.round(ma).toLocaleString('pt-BR')+' Ma'}
function getPeriod(ma){return PERIODS.find(p=>ma>=p.min&&ma<p.max)||PERIODS[PERIODS.length-1]}
function windowForAge(ma){if(ma<5)return 1.5;if(ma<80)return 5;if(ma<250)return 9;if(ma<500)return 15;return 25}

function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2400)}

async function fetchJSON(url,ms=18000){
 const controller=new AbortController();
 const t=setTimeout(()=>controller.abort(),ms);
 try{
  const res=await fetch(url,{mode:'cors',cache:'no-store',signal:controller.signal,headers:{Accept:'application/json'}});
  if(!res.ok)throw new Error('HTTP '+res.status);
  return await res.json();
 }finally{clearTimeout(t)}
}

async function fetchCoastlines(ma){
 return await fetchJSON(`${GWS}/reconstruct/coastlines/?time=${ma}&model=${MODEL}&wrap=true`,22000);
}

async function loadCoastlines(ma){
 const token=++coastToken;
 const loading=$('#timeLoading');
 loading.classList.remove('hide');
 loading.textContent='Reconstruindo continentes em '+fmtAge(ma)+'...';
 try{
  const data=await fetchCoastlines(ma);
  if(token!==coastToken)return;
  map.getSource('paleo')?.setData(data);
  loading.classList.add('hide');
 }catch(e){
  if(token!==coastToken)return;
  loading.textContent='Reconstrução indisponível agora.';
  toast('Não foi possível carregar esta reconstrução agora.');
 }
}

async function reconstructPoints(points,ma){
 if(!points.length)return [];
 const lons=points.map(p=>p[0]).join(',');
 const lats=points.map(p=>p[1]).join(',');
 const url=`${GWS}/reconstruct/reconstruct_points/?lons=${encodeURIComponent(lons)}&lats=${encodeURIComponent(lats)}&time=${ma}&model=${MODEL}&fc`;
 const data=await fetchJSON(url,18000);
 if(data?.type==='FeatureCollection')return (data.features||[]).map(f=>f?.geometry?.coordinates||null);
 if(Array.isArray(data))return data.map(x=>x?.geometry?.coordinates||x?.coordinates||null);
 return [];
}

function applyTheme(p){
 const root=document.documentElement.style;
 root.setProperty('--accent',p.accent);root.setProperty('--accent2',p.accent2);root.setProperty('--land',p.land);root.setProperty('--line',p.line);root.setProperty('--ocean',p.ocean);
 if(map?.getLayer('ocean'))map.setPaintProperty('ocean','background-color',p.ocean);
 if(map?.getLayer('land-fill'))map.setPaintProperty('land-fill','fill-color',p.land);
 if(map?.getLayer('land-line'))map.setPaintProperty('land-line','line-color',p.line);
}

function renderEra(){
 const p=getPeriod(currentAge);
 applyTheme(p);
 $('#eraTitle').textContent=fmtAge(currentAge);
 $('#ageBadge').textContent=fmtAge(currentAge);
 $('#eraIcon').textContent=p.icon;
 $('#eraPeriod').textContent=p.name.toUpperCase();
 $('#eraEventTag').textContent=p.tag;
 $('#eraName').textContent=currentAge===0?'O mundo atual':p.name+' — '+fmtAge(currentAge);
 $('#eraText').textContent=p.event;
 $('#geoPath').innerHTML=`<span>${p.eon}</span><span>${p.era}</span><span>${p.name}</span>`;
 $('#timelineAge').textContent=currentAge===0?'Hoje':currentAge.toLocaleString('pt-BR',{maximumFractionDigits:2})+' milhões de anos';
 $('#timeSlider').value=String(currentAge);
 $('#ageInput').value=currentAge.toFixed(currentAge<10?2:0).replace(/\.00$/,'');
 renderKeyAges();
 if(mode==='earth')renderMode();
}

function renderKeyAges(){
 const box=$('#keyAges');
 box.innerHTML=KEY_AGES.map(a=>`<button class="${Math.abs(a-currentAge)<.6?'active':''}" data-age="${a}">${fmtAge(a)}</button>`).join('');
 box.querySelectorAll('button').forEach(b=>b.onclick=()=>setAge(Number(b.dataset.age)));
}

function setAge(value,opts={}){
 currentAge=clamp(Number(value)||0,0,1000);
 renderEra();
 clearTimeout(ageDebounce);
 ageDebounce=setTimeout(()=>{
  loadCoastlines(currentAge);
  updateEventLayer();
  if(platesOn)loadPlates();
  if(trackedPlace)updateTrackedPlace();
  if(currentFossil)loadFossils(currentFossil,false);
 },opts.immediate?0:260);
}

function setMode(next){
 mode=next;
 document.querySelectorAll('.mode-btn').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));
 renderMode();
}

function renderMode(){
 const panel=$('#modeContent');
 if(mode==='earth'){
  const p=getPeriod(currentAge);
  panel.innerHTML=`<div class="mode-head"><div><small>TERRA</small><h3>Planeta em ${fmtAge(currentAge)}</h3><p>${p.world}</p></div><span class="mode-badge">GPlates</span></div>
  <div class="action-grid">${MOMENTS.slice(0,6).map(m=>`<button class="action-card" data-moment="${m.ma}"><span>${m.icon}</span><b>${m.name}</b><small>${m.desc}</small></button>`).join('')}</div>
  <div class="compare-control"><span>Comparação com hoje</span><input id="compareRange" type="range" min="0" max="100" value="${Math.round(compareOpacity*100)}"><output>${Math.round(compareOpacity*100)}%</output></div>`;
  panel.querySelectorAll('[data-moment]').forEach(b=>b.onclick=()=>setAge(Number(b.dataset.moment)));
  const range=$('#compareRange');
  range.oninput=()=>{compareOpacity=Number(range.value)/100;range.nextElementSibling.textContent=range.value+'%';if(compareOn)applyCompareOpacity()};
 }else if(mode==='life')renderLifeMode();
 else if(mode==='events')renderEventsMode();
 else if(mode==='place')renderPlaceMode();
 else renderGeologyMode();
}

function renderLifeMode(status=''){
 const panel=$('#modeContent');
 const w=windowForAge(currentAge);
 panel.innerHTML=`<div class="mode-head"><div><small>VIDA • PALEOBIOLOGY DATABASE</small><h3>Fósseis reais</h3><p>Ocorrências próximas de ${fmtAge(currentAge)} em uma janela de ±${w} Ma.</p></div><span class="mode-badge">PBDB</span></div>
 <div class="fossil-groups">${FOSSIL_GROUPS.map(g=>`<button class="fossil-chip ${currentFossil?.id===g.id?'active':''}" data-fossil="${g.id}">${g.icon} ${g.name}</button>`).join('')}</div>
 <div class="status-box" id="fossilStatus">${status|| (currentFossil?`<b>${fossilData.features.length}</b> ocorrências posicionadas no globo.`:'Escolha um grupo para buscar ocorrências fósseis reais.')}</div>
 <button id="clearFossils" class="secondary-btn" style="width:100%;margin-top:7px">Limpar fósseis do globo</button>`;
 panel.querySelectorAll('[data-fossil]').forEach(b=>b.onclick=()=>{const g=FOSSIL_GROUPS.find(x=>x.id===b.dataset.fossil);if(g){currentFossil=g;renderLifeMode('Buscando registros fósseis…');loadFossils(g,true)}});
 $('#clearFossils').onclick=()=>{currentFossil=null;fossilData=empty;map.getSource('fossils')?.setData(empty);renderLifeMode('Camada de fósseis limpa.')};
}

async function loadFossils(group,focus=false){
 const w=windowForAge(currentAge);
 const minMa=Math.max(0,currentAge-w);
 const maxMa=currentAge+w;
 if(mode==='life')renderLifeMode(`Buscando ${group.name.toLowerCase()} entre ${minMa.toFixed(1)} e ${maxMa.toFixed(1)} Ma…`);
 try{
  const params=new URLSearchParams({base_name:group.taxon,min_ma:minMa.toFixed(2),max_ma:maxMa.toFixed(2),show:'coords,paleoloc,time,loc,phylo',limit:'500'});
  const data=await fetchJSON(PBDB+'?'+params.toString(),22000);
  const rows=(data.records||[]).slice(0,500);
  const features=[];
  const needs=[];
  const needRows=[];
  rows.forEach((r,i)=>{
   let lng=num(r.paleolng??r.pln??r.paleo_lng);
   let lat=num(r.paleolat??r.plt??r.paleo_lat);
   const modernLng=num(r.lng??r.longitude);
   const modernLat=num(r.lat??r.latitude);
   const props={
    kind:'fossil',group:group.name,icon:group.icon,
    name:r.tna||r.nam||r.accepted_name||r.taxon_name||r.identification||group.name,
    country:r.cc2||r.cc||r.country||r.stp||'',
    early:r.eag??r.max_ma??'',late:r.lag??r.min_ma??'',
    collection:r.cid||r.collection_no||'',occurrence:r.oid||r.occurrence_no||'',
    modernLng,modernLat
   };
   if(lng!==null&&lat!==null&&Math.abs(lat)<=90&&Math.abs(lng)<=180){features.push({type:'Feature',geometry:{type:'Point',coordinates:[lng,lat]},properties:props})}
   else if(modernLng!==null&&modernLat!==null&&currentAge<=440&&needs.length<120){needs.push([modernLng,modernLat]);needRows.push(props)}
   else if(currentAge<1&&modernLng!==null&&modernLat!==null){features.push({type:'Feature',geometry:{type:'Point',coordinates:[modernLng,modernLat]},properties:props})}
  });
  if(needs.length){
   try{
    const coords=await reconstructPoints(needs,currentAge);
    coords.forEach((c,i)=>{if(Array.isArray(c)&&Math.abs(Number(c[1]))<=90&&Math.abs(Number(c[0]))<=180)features.push({type:'Feature',geometry:{type:'Point',coordinates:[Number(c[0]),Number(c[1])]},properties:needRows[i]})});
   }catch(e){}
  }
  fossilData={type:'FeatureCollection',features};
  map.getSource('fossils')?.setData(fossilData);
  if(mode==='life')renderLifeMode(`<b>${features.length}</b> ocorrências com posição paleo-geográfica exibidas de ${rows.length} registros recebidos.`);
  if(focus&&features.length){
   const c=features[0].geometry.coordinates;map.easeTo({center:c,zoom:2.2,duration:700});
  }
 }catch(e){
  fossilData=empty;map.getSource('fossils')?.setData(empty);
  if(mode==='life')renderLifeMode('A Paleobiology Database não respondeu agora. Tente novamente em instantes.');
 }
}

function renderEventsMode(){
 const panel=$('#modeContent');
 const list=[...EVENTS].sort((a,b)=>Math.abs(a.ma-currentAge)-Math.abs(b.ma-currentAge));
 panel.innerHTML=`<div class="mode-head"><div><small>EVENTOS MARCANTES</small><h3>Momentos que mudaram a Terra</h3><p>Toque em um evento para viajar diretamente até sua época.</p></div><span class="mode-badge">${EVENTS.length} eventos</span></div>
 <div class="event-list">${list.map((e,i)=>`<button class="event-row ${Math.abs(e.ma-currentAge)<=e.tol?'near':''}" data-event="${EVENTS.indexOf(e)}"><span class="ico">${e.icon}</span><span><b>${e.name}</b><small>${e.desc}</small></span><strong>${fmtAge(e.ma)}</strong></button>`).join('')}</div>`;
 panel.querySelectorAll('[data-event]').forEach(b=>b.onclick=()=>{const e=EVENTS[Number(b.dataset.event)];setAge(e.ma,{immediate:true});setTimeout(()=>showEventDetail(e),250)});
}

function renderPlaceMode(status=''){
 const panel=$('#modeContent');
 const chosen=trackedPlace||TRACK_PLACES[0];
 panel.innerHTML=`<div class="mode-head"><div><small>MEU LUGAR NO TEMPO</small><h3>Onde este lugar estava?</h3><p>Reconstrua a paleo-posição de um ponto atual.</p></div><span class="mode-badge">GPlates</span></div>
 <div class="place-form"><select id="placePreset">${TRACK_PLACES.map(p=>`<option value="${p.id}" ${chosen.id===p.id?'selected':''}>${p.name} • ${p.country}</option>`).join('')}<option value="custom" ${chosen.id==='custom'?'selected':''}>Coordenadas personalizadas</option></select>
 <div class="coord-row"><input id="placeLat" type="number" step="0.0001" min="-90" max="90" value="${chosen.lat}"><input id="placeLng" type="number" step="0.0001" min="-180" max="180" value="${chosen.lng}"></div>
 <button id="trackPlaceBtn" class="primary-btn">📍 Reconstruir em ${fmtAge(currentAge)}</button></div>
 <div class="status-box" id="trackStatus">${status||trackedStatusText()}</div>`;
 $('#placePreset').onchange=e=>{
  const p=TRACK_PLACES.find(x=>x.id===e.target.value);
  if(p){$('#placeLat').value=p.lat;$('#placeLng').value=p.lng}
 };
 $('#trackPlaceBtn').onclick=()=>{
  const sel=$('#placePreset').value;const p=TRACK_PLACES.find(x=>x.id===sel);
  const lat=clamp(Number($('#placeLat').value)||0,-90,90);const lng=clamp(Number($('#placeLng').value)||0,-180,180);
  trackedPlace=p?{...p}:{id:'custom',name:'Ponto personalizado',country:'',lat,lng};
  trackedPlace.lat=lat;trackedPlace.lng=lng;
  renderPlaceMode('Reconstruindo a paleo-posição…');updateTrackedPlace(true);
 };
}

function trackedStatusText(){
 if(!trackedPlace)return 'Escolha um lugar ou digite latitude e longitude.';
 if(!trackedPaleo)return `<b>${trackedPlace.name}</b> selecionado. Aguardando reconstrução.`;
 return `<b>${trackedPlace.name}</b> em ${fmtAge(currentAge)} → ${trackedPaleo[1].toFixed(2)}° lat, ${trackedPaleo[0].toFixed(2)}° lon.`;
}

async function updateTrackedPlace(focus=false){
 if(!trackedPlace)return;
 const token=++trackToken;
 try{
  let coord=[trackedPlace.lng,trackedPlace.lat];
  if(currentAge>0){const out=await reconstructPoints([[trackedPlace.lng,trackedPlace.lat]],currentAge);coord=out[0]||null}
  if(token!==trackToken||!coord)throw new Error('no point');
  trackedPaleo=[Number(coord[0]),Number(coord[1])];
  map.getSource('tracked')?.setData({type:'FeatureCollection',features:[{type:'Feature',geometry:{type:'Point',coordinates:trackedPaleo},properties:{name:trackedPlace.name,kind:'tracked'}}]});
  if(focus)map.easeTo({center:trackedPaleo,zoom:2.4,duration:900});
  if(mode==='place')renderPlaceMode(trackedStatusText());
 }catch(e){
  if(token!==trackToken)return;
  trackedPaleo=null;map.getSource('tracked')?.setData(empty);
  if(mode==='place')renderPlaceMode('Não foi possível reconstruir este ponto nesta idade com o modelo atual.');
 }
}

function renderGeologyMode(status=''){
 const panel=$('#modeContent');
 panel.innerHTML=`<div class="mode-head"><div><small>GEOLOGIA</small><h3>Placas e blocos tectônicos</h3><p>Sobreponha polígonos tectônicos reconstruídos na mesma idade do globo.</p></div><span class="mode-badge">GPlates</span></div>
 <button id="plateToggle" class="plate-toggle" style="width:100%"><div><b>🧩 Polígonos tectônicos</b><small>Mostra limites aproximados dos blocos reconstruídos.</small></div><span class="switch ${platesOn?'on':''}"><i></i></span></button>
 <div class="status-box">${status|| (platesOn?'Camada tectônica ativa em '+fmtAge(currentAge)+'.':'Ative a camada para comparar continentes e placas.')}</div>`;
 $('#plateToggle').onclick=()=>{platesOn=!platesOn;if(!platesOn){setPlateVisibility(false);renderGeologyMode('Camada tectônica desativada.')}else{renderGeologyMode('Carregando placas tectônicas…');loadPlates(true)}};
}

function setPlateVisibility(show){
 ['plate-fill','plate-line'].forEach(id=>{if(map.getLayer(id))map.setLayoutProperty(id,'visibility',show?'visible':'none')});
}

async function loadPlates(focus=false){
 if(!platesOn)return;
 const token=++platesToken;
 try{
  const data=await fetchJSON(`${GWS}/reconstruct/static_polygons/?time=${currentAge}&model=${MODEL}`,22000);
  if(token!==platesToken)return;
  map.getSource('plates')?.setData(data?.type==='FeatureCollection'?data:empty);
  setPlateVisibility(true);
  if(mode==='geology')renderGeologyMode('Polígonos tectônicos carregados para '+fmtAge(currentAge)+'.');
  if(focus)toast('Placas tectônicas ativadas 🧩');
 }catch(e){
  if(token!==platesToken)return;
  setPlateVisibility(false);
  if(mode==='geology')renderGeologyMode('A camada tectônica não está disponível para esta idade/modelo agora.');
 }
}

async function updateEventLayer(){
 const token=++eventsToken;
 const active=EVENTS.filter(e=>e.center&&Math.abs(e.ma-currentAge)<=e.tol);
 if(!active.length){map.getSource('events')?.setData(empty);return}
 try{
  let coords=active.map(e=>e.center);
  if(currentAge>0)coords=await reconstructPoints(coords,currentAge);
  if(token!==eventsToken)return;
  const features=[];
  active.forEach((e,i)=>{const c=coords[i];if(c)features.push({type:'Feature',geometry:{type:'Point',coordinates:[Number(c[0]),Number(c[1])]},properties:{kind:'event',idx:EVENTS.indexOf(e),name:e.name,type:e.type,icon:e.icon,ma:e.ma,desc:e.desc}})});
  map.getSource('events')?.setData({type:'FeatureCollection',features});
 }catch(e){if(token===eventsToken)map.getSource('events')?.setData(empty)}
}

function showDetail(icon,kind,title,rows){
 $('#detailIcon').textContent=icon;$('#detailKind').textContent=kind;$('#detailTitle').textContent=title;
 $('#detailBody').innerHTML=rows.filter(r=>r[1]!==''&&r[1]!==null&&r[1]!==undefined).map(r=>`<div class="detail-row"><span>${r[0]}</span><b>${String(r[1])}</b></div>`).join('');
 $('#detailSheet').classList.add('open');$('#detailSheet').setAttribute('aria-hidden','false');
}
function closeDetail(){$('#detailSheet').classList.remove('open');$('#detailSheet').setAttribute('aria-hidden','true')}
function showEventDetail(e){showDetail(e.icon,'EVENTO GEOLÓGICO',e.name,[['Idade aproximada',fmtAge(e.ma)],['Tipo',e.type],['Contexto',e.desc]])}
function showFossilDetail(p){
 const age=(p.early||p.late)?[p.early,p.late].filter(Boolean).join(' – ')+' Ma':'';
 showDetail(p.icon||'🦴','REGISTRO FÓSSIL • PBDB',p.name||p.group,[['Grupo',p.group],['Idade do registro',age],['País / região',p.country],['Coleção PBDB',p.collection],['Ocorrência PBDB',p.occurrence]]);
}

function applyCompareOpacity(){if(map?.getLayer('modern-line'))map.setPaintProperty('modern-line','line-opacity',compareOn?compareOpacity:0)}
function toggleCompare(){compareOn=!compareOn;$('#compareBtn').classList.toggle('active',compareOn);$('#compareBtn').textContent=compareOn?'◉ Hoje sobreposto':'◎ Comparar com hoje';applyCompareOpacity()}

function togglePlay(){
 const btn=$('#playBtn');
 if(playTimer){clearInterval(playTimer);playTimer=null;btn.classList.remove('active');btn.textContent='▶ Viagem';return}
 btn.classList.add('active');btn.textContent='Ⅱ Pausar';
 let i=KEY_AGES.findIndex(a=>a>=currentAge-.1);if(i<0)i=0;
 playTimer=setInterval(()=>{i++;if(i>=KEY_AGES.length){clearInterval(playTimer);playTimer=null;btn.classList.remove('active');btn.textContent='▶ Viagem';return}setAge(KEY_AGES[i],{immediate:true})},1900);
}

function initMap(){
 map=new maplibregl.Map({
  container:'paleoMap',
  style:{version:8,glyphs:'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',sources:{},layers:[{id:'ocean',type:'background',paint:{'background-color':'#03162c'}}]},
  center:[0,12],zoom:1.05,minZoom:.4,maxZoom:6,attributionControl:false,renderWorldCopies:false
 });
 map.on('style.load',async()=>{
  map.setProjection({type:'globe'});
  map.addSource('plates',{type:'geojson',data:empty});
  map.addSource('paleo',{type:'geojson',data:empty});
  map.addSource('modern',{type:'geojson',data:empty});
  map.addSource('events',{type:'geojson',data:empty});
  map.addSource('tracked',{type:'geojson',data:empty});
  map.addSource('fossils',{type:'geojson',data:empty,cluster:true,clusterRadius:38,clusterMaxZoom:4});
  map.addLayer({id:'plate-fill',type:'fill',source:'plates',layout:{visibility:'none'},paint:{'fill-color':'#8a6cff','fill-opacity':.08}});
  map.addLayer({id:'plate-line',type:'line',source:'plates',layout:{visibility:'none'},paint:{'line-color':'#bc9dff','line-width':.75,'line-opacity':.65}});
  map.addLayer({id:'land-fill',type:'fill',source:'paleo',paint:{'fill-color':'#5f8f52','fill-opacity':.94}});
  map.addLayer({id:'land-line',type:'line',source:'paleo',paint:{'line-color':'#9ce3b2','line-width':.85,'line-opacity':.86}});
  map.addLayer({id:'modern-line',type:'line',source:'modern',paint:{'line-color':'#ffffff','line-width':1.05,'line-opacity':0,'line-dasharray':[3,2]}});
  map.addLayer({id:'fossil-cluster',type:'circle',source:'fossils',filter:['has','point_count'],paint:{'circle-radius':['step',['get','point_count'],10,10,14,50,18,150,23],'circle-color':'#ffd166','circle-opacity':.88,'circle-stroke-color':'#fff1b8','circle-stroke-width':.8}});
  map.addLayer({id:'fossil-cluster-count',type:'symbol',source:'fossils',filter:['has','point_count'],layout:{'text-field':['get','point_count_abbreviated'],'text-font':['Noto Sans Regular'],'text-size':9},paint:{'text-color':'#201500'}});
  map.addLayer({id:'fossil-point',type:'circle',source:'fossils',filter:['!', ['has','point_count']],paint:{'circle-radius':['interpolate',['linear'],['zoom'],1,2.2,5,5.4],'circle-color':'#ffd166','circle-stroke-color':'#fff7d0','circle-stroke-width':.7,'circle-opacity':.94}});
  map.addLayer({id:'event-glow',type:'circle',source:'events',paint:{'circle-radius':14,'circle-color':'#ff5d52','circle-opacity':.18,'circle-blur':.6}});
  map.addLayer({id:'event-point',type:'circle',source:'events',paint:{'circle-radius':6,'circle-color':'#ff725c','circle-stroke-color':'#fff','circle-stroke-width':1,'circle-opacity':.96}});
  map.addLayer({id:'track-glow',type:'circle',source:'tracked',paint:{'circle-radius':16,'circle-color':'#45efff','circle-opacity':.2,'circle-blur':.6}});
  map.addLayer({id:'track-point',type:'circle',source:'tracked',paint:{'circle-radius':6.5,'circle-color':'#57f7d0','circle-stroke-color':'#fff','circle-stroke-width':1.2}});

  map.on('click','fossil-cluster',async e=>{const f=e.features?.[0];if(!f)return;const id=f.properties?.cluster_id;try{const z=await map.getSource('fossils').getClusterExpansionZoom(id);map.easeTo({center:f.geometry.coordinates,zoom:Math.min(5.5,z),duration:650})}catch{}});
  map.on('click','fossil-point',e=>{const f=e.features?.[0];if(f)showFossilDetail(f.properties||{})});
  map.on('click','event-point',e=>{const f=e.features?.[0];if(f)showEventDetail(EVENTS[Number(f.properties?.idx)]||{icon:'⚡',name:f.properties?.name,type:f.properties?.type,desc:f.properties?.desc,ma:f.properties?.ma})});
  map.on('click','track-point',()=>{if(trackedPlace)showDetail('📍','MEU LUGAR NO TEMPO',trackedPlace.name,[['Idade',fmtAge(currentAge)],['Latitude paleo',trackedPaleo?.[1]?.toFixed(2)+'°'],['Longitude paleo',trackedPaleo?.[0]?.toFixed(2)+'°'],['Posição atual',trackedPlace.lat.toFixed(2)+'°, '+trackedPlace.lng.toFixed(2)+'°']])});

  ['fossil-point','event-point','track-point','fossil-cluster'].forEach(id=>{map.on('mouseenter',id,()=>map.getCanvas().style.cursor='pointer');map.on('mouseleave',id,()=>map.getCanvas().style.cursor='')});
  try{const modern=await fetchCoastlines(0);map.getSource('modern')?.setData(modern)}catch{}
  setAge(0,{immediate:true});
 });
}

function bindUi(){
 $('#backBtn').onclick=()=>{location.href='./index.html?v=18'};
 $('#compareBtn').onclick=toggleCompare;
 $('#playBtn').onclick=togglePlay;
 $('#timeSlider').oninput=e=>{currentAge=Number(e.target.value);renderEra()};
 $('#timeSlider').onchange=e=>setAge(Number(e.target.value),{immediate:true});
 $('#ageInput').onchange=e=>setAge(Number(e.target.value),{immediate:true});
 document.querySelectorAll('.mode-btn').forEach(b=>b.onclick=()=>setMode(b.dataset.mode));
 $('#detailClose').onclick=closeDetail;$('#detailBackdrop').onclick=closeDetail;
}

initMap();
bindUi();
renderEra();
renderMode();
