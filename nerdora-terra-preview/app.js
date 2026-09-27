import * as maplibregl from 'https://unpkg.com/maplibre-gl@6.11.2/dist/maplibre-gl.mjs';

const IMAGERY='https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/g/{z}/{y}/{x}.jpg';
const MAPTERHORN_TILEJSON='https://tiles.mapterhorn.com/tilejson.json';
const MAPTERHORN_DIRECT='https://tiles.mapterhorn.com/{z}/{x}/{y}.webp';
const AWS_TERRAIN='https://elevation-tiles-prod.s3.amazonaws.com/terrarium/{z}/{x}/{y}.png';

const spots=[
 {name:'Amazônia',icon:'🌳',kind:'NATUREZA',center:[-61.5,-4.5],zoom:3.4,text:'A maior floresta tropical do planeta ocupa uma enorme área da América do Sul.'},
 {name:'Monte Everest',icon:'🏔️',kind:'NATUREZA',center:[86.925,27.988],zoom:5.6,text:'O ponto mais alto da superfície terrestre acima do nível do mar.'},
 {name:'Fossa das Marianas',icon:'🌊',kind:'OCEANOS',center:[142.2,11.35],zoom:4.4,text:'Região do Pacífico onde fica o Challenger Deep.'},
 {name:'Grande Barreira de Coral',icon:'🐠',kind:'OCEANOS',center:[147.7,-18.28],zoom:5,text:'O maior sistema de recifes de coral do planeta.'},
 {name:'Cordilheira dos Andes',icon:'⛰️',kind:'NATUREZA',center:[-71,-20],zoom:3.5,text:'Uma cadeia montanhosa colossal na América do Sul.'},
 {name:'Antártida',icon:'🧊',kind:'OCEANOS',center:[0,-76],zoom:2.7,text:'O continente polar coberto pela maior massa de gelo da Terra.'}
];

const BIOMES=[
 {
  id:'floresta-tropical',name:'Floresta Tropical',icon:'🌳',desc:'Ambientes quentes, úmidos e extremamente biodiversos.',
  places:[
   {name:'Amazônia',country:'Brasil e países vizinhos',desc:'Maior floresta tropical do planeta.',center:[-61.5,-4.5],zoom:4.2},
   {name:'Bacia do Congo',country:'África Central',desc:'Segundo maior bloco contínuo de floresta tropical.',center:[22.5,-1.5],zoom:4.5},
   {name:'Bornéu',country:'Sudeste Asiático',desc:'Ilha coberta por antigas florestas tropicais.',center:[114.5,0.8],zoom:5}
  ]
 },
 {
  id:'deserto',name:'Deserto',icon:'🏜️',desc:'Regiões áridas com baixa precipitação e grande amplitude térmica.',
  places:[
   {name:'Saara',country:'Norte da África',desc:'Maior deserto quente do mundo.',center:[13,23.5],zoom:4.1},
   {name:'Atacama',country:'Chile',desc:'Uma das regiões não polares mais secas do planeta.',center:[-69,-23],zoom:5.3},
   {name:'Deserto da Arábia',country:'Península Arábica',desc:'Grande área desértica do sudoeste asiático.',center:[45,23],zoom:4.4}
  ]
 },
 {
  id:'savana',name:'Savana',icon:'🦁',desc:'Campos tropicais com árvores espaçadas e forte sazonalidade.',
  places:[
   {name:'Serengeti',country:'Tanzânia e Quênia',desc:'Savana famosa por suas grandes migrações animais.',center:[34.8,-2.3],zoom:5.3},
   {name:'Cerrado',country:'Brasil',desc:'Savana tropical de altíssima biodiversidade.',center:[-47,-15],zoom:4.7},
   {name:'Miombo',country:'África Austral',desc:'Mosaico de savanas e florestas abertas.',center:[28,-13],zoom:4.6}
  ]
 },
 {
  id:'tundra',name:'Tundra',icon:'🧊',desc:'Bioma frio com vegetação rasteira e solos permanentemente gelados em muitas áreas.',
  places:[
   {name:'Alasca Ártico',country:'Estados Unidos',desc:'Tundra costeira e interior do extremo norte.',center:[-152,69],zoom:4.7},
   {name:'Sibéria Ártica',country:'Rússia',desc:'Imensas extensões de tundra no norte da Ásia.',center:[110,71],zoom:4.2},
   {name:'Groenlândia costeira',country:'Groenlândia',desc:'Tundra ao redor das margens da grande camada de gelo.',center:[-42,72],zoom:4.2}
  ]
 },
 {
  id:'temperada',name:'Floresta Temperada',icon:'🍂',desc:'Florestas de clima moderado, com estações bem definidas.',
  places:[
   {name:'Montanhas Apalaches',country:'Estados Unidos',desc:'Grandes áreas de floresta temperada no leste da América do Norte.',center:[-81,37],zoom:5},
   {name:'Europa Central',country:'Europa',desc:'Mosaicos de florestas temperadas e áreas humanizadas.',center:[12,49],zoom:4.7},
   {name:'Honshu',country:'Japão',desc:'Florestas temperadas em relevo montanhoso.',center:[138,36],zoom:5}
  ]
 },
 {
  id:'taiga',name:'Taiga',icon:'🌲',desc:'Floresta boreal de coníferas das altas latitudes do hemisfério norte.',
  places:[
   {name:'Taiga Canadense',country:'Canadá',desc:'Uma das maiores extensões contínuas de floresta boreal.',center:[-105,57],zoom:4.2},
   {name:'Taiga Siberiana',country:'Rússia',desc:'Imensa faixa de coníferas atravessando a Sibéria.',center:[95,60],zoom:4.1},
   {name:'Lapônia',country:'Finlândia e Suécia',desc:'Florestas boreais próximas ao Círculo Polar Ártico.',center:[25,67],zoom:5}
  ]
 },
 {
  id:'mediterraneo',name:'Mediterrâneo',icon:'🌿',desc:'Vegetação adaptada a verões quentes e secos e invernos suaves.',
  places:[
   {name:'Bacia do Mediterrâneo',country:'Sul da Europa',desc:'Região clássica desse bioma.',center:[15,39],zoom:4.8},
   {name:'Califórnia',country:'Estados Unidos',desc:'Chaparral e vegetação mediterrânea na costa oeste.',center:[-120,36],zoom:5},
   {name:'Cabo Ocidental',country:'África do Sul',desc:'Vegetação fynbos extremamente diversa.',center:[18.5,-34],zoom:5.4}
  ]
 },
 {
  id:'marinho',name:'Bioma Marinho',icon:'🌊',desc:'Ecossistemas oceânicos, costeiros e recifes de coral.',
  places:[
   {name:'Grande Barreira de Coral',country:'Austrália',desc:'Maior sistema de recifes de coral do planeta.',center:[147.7,-18.28],zoom:5},
   {name:'Fossa das Marianas',country:'Pacífico Ocidental',desc:'Região que contém o Challenger Deep.',center:[142.2,11.35],zoom:4.8},
   {name:'Galápagos',country:'Equador',desc:'Arquipélago vulcânico com ecossistemas marinhos únicos.',center:[-90.5,-0.8],zoom:5.4}
  ]
 }
];

let map,selected=null,timer;
let terrainProvider='Mapterhorn';

async function fetchWithTimeout(url,ms=4500){
 const controller=new AbortController();
 const id=setTimeout(()=>controller.abort(),ms);
 try{return await fetch(url,{mode:'cors',signal:controller.signal,cache:'force-cache'})}
 finally{clearTimeout(id)}
}

async function configureTerrain(){
 const loading=document.querySelector('#loading');
 try{
   const res=await fetchWithTimeout(MAPTERHORN_TILEJSON,4500);
   if(!res.ok)throw new Error('Mapterhorn HTTP '+res.status);
   const tj=await res.json();
   map.addSource('terrainSource',{
     type:'raster-dem',
     tiles:Array.isArray(tj.tiles)&&tj.tiles.length?tj.tiles:[MAPTERHORN_DIRECT],
     tileSize:Number(tj.tileSize||tj.tilesize||512),
     maxzoom:Number(tj.maxzoom||14),
     encoding:'terrarium',
     attribution:'Mapterhorn'
   });
   map.setTerrain({source:'terrainSource',exaggeration:1.12});
   terrainProvider='Mapterhorn';
 }catch(err){
   terrainProvider='AWS Terrarium';
   try{
     if(map.getSource('terrainSource')){
       map.setTerrain(null);
       map.removeSource('terrainSource');
     }
     map.addSource('terrainSource',{
       type:'raster-dem',
       tiles:[AWS_TERRAIN],
       tileSize:256,
       maxzoom:14,
       encoding:'terrarium',
       attribution:'AWS Terrain Tiles'
     });
     map.setTerrain({source:'terrainSource',exaggeration:1.12});
   }catch(fallbackErr){
     terrainProvider='sem relevo';
   }
 }
 const credit=document.querySelector('.credit');
 if(credit)credit.textContent='EOX Sentinel-2 • '+terrainProvider+' • MapLibre';
 if(loading)loading.textContent='Finalizando Terra 3D...';
}

try{
 map=new maplibregl.Map({
   container:'earthMap',
   style:{
     version:8,
     projection:{type:'globe'},
     sources:{
       sat:{
         type:'raster',
         tiles:[IMAGERY],
         tileSize:256,
         minzoom:0,
         maxzoom:14,
         attribution:'EOX Sentinel-2 Cloudless'
       }
     },
     layers:[{
       id:'satellite',
       type:'raster',
       source:'sat',
       paint:{'raster-fade-duration':120,'raster-saturation':0.05,'raster-contrast':0.06}
     }],
     sky:{
       'atmosphere-blend':['interpolate',['linear'],['zoom'],0,1,5,1,7,0]
     },
     light:{anchor:'map',position:[1.5,90,80]}
   },
   center:[-35,8],
   zoom:1.15,
   minZoom:.45,
   maxZoom:16,
   maxPitch:85,
   pitch:0,
   attributionControl:false,
   renderWorldCopies:false
 });
 map.dragRotate.enable();
 map.touchZoomRotate.enableRotation();
 if(map.touchPitch?.enable)map.touchPitch.enable();
 map.on('style.load',async()=>{await configureTerrain()});
 map.once('idle',()=>document.querySelector('#loading').classList.add('hide'));
}catch(e){
 document.querySelector('#loading').textContent='Globo indisponível neste navegador';
}

const sheet=document.querySelector('#sheet');
const toastEl=document.querySelector('#toast');
const discoverSheet=document.querySelector('#discoverSheet');
const discoverBackdrop=document.querySelector('#discoverBackdrop');
const discoverClose=document.querySelector('#discoverClose');
const discoverBack=document.querySelector('#discoverBack');
const discoverList=document.querySelector('#discoverList');
const discoverStep=document.querySelector('#discoverStep');
const discoverTitle=document.querySelector('#discoverTitle');

let currentBiome=null;

function toast(msg){
 toastEl.textContent=msg;
 toastEl.classList.add('show');
 clearTimeout(timer);
 timer=setTimeout(()=>toastEl.classList.remove('show'),2200);
}
function showSpot(p){
 selected=p;
 document.querySelector('#sheetIcon').textContent=p.icon||'📍';
 document.querySelector('#sheetKind').textContent=p.kind||'LUGAR';
 document.querySelector('#sheetTitle').textContent=p.name;
 document.querySelector('#sheetText').textContent=p.text||p.desc||'';
 sheet.classList.add('open');
 sheet.setAttribute('aria-hidden','false');
}
function closeSheet(){
 sheet.classList.remove('open');
 sheet.setAttribute('aria-hidden','true');
}
function fly(p){
 const targetZoom=Math.min(12,(p.zoom||4)+3.2);
 const targetPitch=targetZoom>=8?58:(targetZoom>=6?38:0);
 map?.flyTo({center:p.center,zoom:targetZoom,pitch:targetPitch,bearing:0,duration:2200,essential:true});
}
function random(pool=spots){
 const p=pool[Math.floor(Math.random()*pool.length)];
 showSpot(p);
 fly(p);
}

function openDiscoverSheet(){
 closeSheet();
 discoverSheet.classList.add('open');
 discoverSheet.setAttribute('aria-hidden','false');
 renderBiomeList();
}
function closeDiscoverSheet(){
 discoverSheet.classList.remove('open');
 discoverSheet.setAttribute('aria-hidden','true');
 currentBiome=null;
}
function renderBiomeList(){
 currentBiome=null;
 discoverStep.textContent='BIOMAS';
 discoverTitle.textContent='Escolha um bioma';
 discoverBack.classList.remove('show');
 discoverList.innerHTML=BIOMES.map(b=>`
  <button class="discover-item" data-biome="${b.id}">
    <div class="top"><div class="icon">${b.icon}</div><b>${b.name}</b></div>
    <p>${b.desc}</p>
    <div class="meta"><span>${b.places.length} lugares</span><span>Explorar no globo</span></div>
  </button>`).join('');
 discoverList.querySelectorAll('[data-biome]').forEach(btn=>{
  btn.onclick=()=>{
   const biome=BIOMES.find(b=>b.id===btn.dataset.biome);
   if(biome)renderPlaceList(biome);
  };
 });
}
function renderPlaceList(biome){
 currentBiome=biome;
 discoverStep.textContent='LUGARES';
 discoverTitle.textContent=biome.name;
 discoverBack.classList.add('show');
 discoverList.innerHTML=biome.places.map((p,i)=>`
  <button class="discover-item" data-place="${i}">
    <div class="top"><div class="icon">${biome.icon}</div><b>${p.name}</b></div>
    <p>${p.desc}</p>
    <div class="meta"><span>${p.country}</span><span>Ir para o local ›</span></div>
  </button>`).join('');
 discoverList.querySelectorAll('[data-place]').forEach(btn=>{
  btn.onclick=()=>{
   const p=biome.places[Number(btn.dataset.place)];
   if(!p)return;
   closeDiscoverSheet();
   map?.resize();
   fly(p);
   setTimeout(()=>{
    showSpot({
      ...p,
      icon:biome.icon,
      kind:biome.name.toUpperCase(),
      text:`${p.desc} • ${p.country}`
    });
   },1150);
   toast(`${p.name} localizado no globo 🌍`);
  };
 });
}

document.querySelector('#closeSheet').onclick=closeSheet;
document.querySelector('#locate').onclick=()=>{if(selected){closeSheet();fly(selected)}};
discoverBackdrop.onclick=closeDiscoverSheet;
discoverClose.onclick=closeDiscoverSheet;
discoverBack.onclick=renderBiomeList;

document.querySelectorAll('[data-action]').forEach(btn=>btn.onclick=async()=>{
 const a=btn.dataset.action;
 if(a==='fullscreen'){
  try{document.fullscreenElement?await document.exitFullscreen():await document.documentElement.requestFullscreen()}
  catch{toast('Tela cheia não disponível')}
  return;
 }
 if(a==='sound'){toast('Som ativado 🔊');return}
 if(a==='explore'){map?.easeTo({zoom:2.4,pitch:20,duration:1000});toast('Aproxime para revelar o relevo 3D 🌍');return}
 if(a==='random'){random();return}
 if(a==='nature'){random(spots.filter(x=>x.kind==='NATUREZA'));return}
 if(a==='ocean'){random(spots.filter(x=>x.kind==='OCEANOS'));return}
 if(a==='terra'){closeDiscoverSheet();closeSheet();map?.flyTo({center:[-35,8],zoom:1.15,pitch:0,bearing:0,duration:1100});return}
 if(a==='discover'){openDiscoverSheet();return}
 if(a==='universe'){toast('Integração com Nerdora Universe reservada ✨')}
});