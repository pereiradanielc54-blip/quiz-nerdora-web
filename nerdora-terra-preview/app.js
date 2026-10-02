import * as maplibregl from 'https://unpkg.com/maplibre-gl@6.11.2/dist/maplibre-gl.mjs';

const IMAGERY='https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/g/{z}/{y}/{x}.jpg';
const MAPTERHORN_TILEJSON='https://tiles.mapterhorn.com/tilejson.json';
const MAPTERHORN_DIRECT='https://tiles.mapterhorn.com/{z}/{x}/{y}.webp';
const AWS_TERRAIN='https://elevation-tiles-prod.s3.amazonaws.com/terrarium/{z}/{x}/{y}.png';

const OSIRIS_BASE='https://osirisai.live';
const LIVE_ENDPOINTS={
 earthquakes:'/api/earthquakes',
 fires:'/api/fires',
 weather:'/api/weather',
 satellites:'/api/satellites'
};
const LIVE_REFRESH_MS={
 earthquakes:10*60*1000,
 fires:10*60*1000,
 weather:5*60*1000,
 satellites:5*60*1000
};

const BRAZIL_STAC='https://data.inpe.br/bdc/stac/v1/search';
const BRAZIL_COLLECTION='CB4A-WPM-PCA-FUSED-1';
const BRAZIL_TMS='https://data.inpe.br/bdc/tms/tiles/WebMercatorQuad/{z}/{x}/{y}?url=';

const REGIONAL_IMAGERY=[
 {
  id:'japan-gsi',name:'Japão • GSI Aerial',bounds:[122.0,20.0,154.5,46.5],minzoom:13,maxzoom:18,
  tiles:['https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg'],tileSize:256
 },
 {
  id:'swissimage',name:'Suíça • SWISSIMAGE',bounds:[5.75,45.65,10.75,47.95],minzoom:10,maxzoom:19,
  tiles:['https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.swissimage/default/current/3857/{z}/{x}/{y}.jpeg'],tileSize:256
 },
 {
  id:'netherlands-pdok',name:'Países Baixos • PDOK HR',bounds:[3.15,50.65,7.35,53.75],minzoom:11,maxzoom:21,
  tiles:['https://service.pdok.nl/hwh/luchtfotorgb/wmts/v1_0?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=Actueel_orthoHR&STYLE=&FORMAT=image/jpeg&tileMatrixSet=OGC:1.0:GoogleMapsCompatible&tileMatrix={z}&tileRow={y}&tileCol={x}'],tileSize:256
 },
 {
  id:'france-ign',name:'França • IGN Ortho HR',bounds:[-5.8,41.0,10.0,51.25],minzoom:10,maxzoom:19,
  tiles:['https://data.geopf.fr/wmts?service=WMTS&request=GetTile&version=1.0.0&tilematrixset=PM&tilematrix={z}&tilecol={x}&tilerow={y}&layer=HR.ORTHOIMAGERY.ORTHOPHOTOS&format=image/jpeg&style=normal'],tileSize:256
 },
 {
  id:'spain-pnoa',name:'Espanha • PNOA',bounds:[-9.7,35.5,4.6,43.95],minzoom:10,maxzoom:20,
  tiles:['https://www.ign.es/wmts/pnoa-ma?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=OI.OrthoimageCoverage&STYLE=default&FORMAT=image/jpeg&TileMatrixSet=GoogleMapsCompatible&TileMatrix={z}&TileRow={y}&TileCol={x}'],tileSize:256
 },
 {
  id:'usa-usgs',name:'Estados Unidos • USGS Imagery',bounds:[-125.1,24.1,-66.2,49.7],minzoom:9,maxzoom:20,
  tiles:['https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}'],tileSize:256
 },
 {
  id:'estonia-ortho',name:'Estônia • Ortofoto nacional',bounds:[21.5,57.2,28.3,59.85],minzoom:11,maxzoom:20,
  tiles:['https://kaart.maaamet.ee/wms/alus-geo?SERVICE=WMS&REQUEST=GetMap&VERSION=1.1.1&LAYERS=of10000&STYLES=&FORMAT=image/jpeg&TRANSPARENT=false&SRS=EPSG:3857&BBOX={bbox-epsg-3857}&WIDTH=256&HEIGHT=256'],tileSize:256
 },
 {
  id:'uruguay-ortho',name:'Uruguai • IDE.uy Ortofoto',bounds:[-58.55,-35.1,-53.05,-30.0],minzoom:10,maxzoom:20,
  tiles:['https://mapas.ide.uy/geoserver-raster/ortofotos/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image/jpeg&TRANSPARENT=false&LAYERS=ortofotos:ortofoto_nacional&STYLES=&SRS=EPSG:3857&WIDTH=256&HEIGHT=256&BBOX={bbox-epsg-3857}'],tileSize:256
 },
 {
  id:'wallonia-ortho',name:'Bélgica/Valônia • SPW Ortho',bounds:[2.8,49.45,6.55,50.85],minzoom:11,maxzoom:20,
  tiles:['https://geoservices.wallonie.be/arcgis/services/IMAGERIE/ORTHO_LAST/MapServer/WMSServer?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&LAYERS=0&STYLES=&FORMAT=image/jpeg&TRANSPARENT=false&SRS=EPSG:3857&WIDTH=256&HEIGHT=256&BBOX={bbox-epsg-3857}'],tileSize:256
 }
];

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

let activeImagery='EOX Sentinel-2';
let brazilSceneKey='';
let brazilRequestSeq=0;
let regionalRefreshTimer=null;

function pointInBounds(lon,lat,b){
 return lon>=b[0]&&lon<=b[2]&&lat>=b[1]&&lat<=b[3];
}

function updateCredit(){
 const credit=document.querySelector('.credit');
 if(credit)credit.textContent=activeImagery+' • '+terrainProvider+' • MapLibre'+(divisionsEnabled?' • OSM/OpenFreeMap':'');
}

function addRegionalImageryLayers(){
 for(const cfg of REGIONAL_IMAGERY){
  try{
   const sourceId='regional-source-'+cfg.id;
   const layerId='regional-layer-'+cfg.id;
   if(!map.getSource(sourceId)){
    map.addSource(sourceId,{
     type:'raster',
     tiles:cfg.tiles,
     tileSize:cfg.tileSize||256,
     bounds:cfg.bounds,
     minzoom:cfg.minzoom,
     maxzoom:cfg.maxzoom,
     attribution:cfg.name
    });
   }
   if(!map.getLayer(layerId)){
    map.addLayer({
     id:layerId,
     type:'raster',
     source:sourceId,
     minzoom:cfg.minzoom,
     maxzoom:cfg.maxzoom+1,
     paint:{
      'raster-opacity':1,
      'raster-fade-duration':180,
      'raster-saturation':0.02,
      'raster-contrast':0.03
     }
    });
   }
  }catch(e){}
 }
}

function bestStaticRegionalLayer(){
 if(!map)return null;
 const c=map.getCenter(),z=map.getZoom();
 const matches=REGIONAL_IMAGERY.filter(r=>z>=r.minzoom&&pointInBounds(c.lng,c.lat,r.bounds));
 if(!matches.length)return null;
 matches.sort((a,b)=>b.minzoom-a.minzoom);
 return matches[0];
}

function removeBrazilLayer(){
 try{if(map.getLayer('brazil-cbers-layer'))map.removeLayer('brazil-cbers-layer')}catch(e){}
 try{if(map.getSource('brazil-cbers-source'))map.removeSource('brazil-cbers-source')}catch(e){}
 brazilSceneKey='';
}

async function refreshBrazilImagery(){
 if(!map)return false;
 const c=map.getCenter(),z=map.getZoom();
 const brazilBounds=[-74.1,-34.0,-34.7,5.5];
 if(z<9||!pointInBounds(c.lng,c.lat,brazilBounds)){
  if(map.getLayer('brazil-cbers-layer'))removeBrazilLayer();
  return false;
 }
 const seq=++brazilRequestSeq;
 const span=Math.max(.035,Math.min(.22,2.8/Math.pow(2,Math.max(0,z-8))));
 const bbox=[c.lng-span,c.lat-span,c.lng+span,c.lat+span].join(',');
 const url=BRAZIL_STAC+'?collections='+encodeURIComponent(BRAZIL_COLLECTION)+'&bbox='+bbox+'&limit=12';
 try{
  const res=await fetchWithTimeout(url,7000);
  if(!res.ok)throw new Error('STAC '+res.status);
  const data=await res.json();
  if(seq!==brazilRequestSeq)return false;
  const features=(data.features||[]).slice().sort((a,b)=>{
   const da=Date.parse(a.properties?.datetime||a.properties?.start_datetime||0)||0;
   const db=Date.parse(b.properties?.datetime||b.properties?.start_datetime||0)||0;
   return db-da;
  });
  const item=features.find(f=>{
   const a=f.assets||{};
   return a.tci?.href||Object.values(a).some(v=>v?.href&&/\.tif(f)?($|\?)/i.test(v.href));
  });
  if(!item)return false;
  const assets=item.assets||{};
  const asset=assets.tci||Object.values(assets).find(v=>v?.href&&/\.tif(f)?($|\?)/i.test(v.href));
  if(!asset?.href)return false;
  const sceneKey=item.id||asset.href;
  if(sceneKey===brazilSceneKey&&map.getLayer('brazil-cbers-layer'))return true;
  removeBrazilLayer();
  if(seq!==brazilRequestSeq)return false;
  const tileUrl=BRAZIL_TMS+encodeURIComponent(asset.href)+'&color_formula=gamma%20rg%201.15';
  map.addSource('brazil-cbers-source',{
   type:'raster',
   tiles:[tileUrl],
   tileSize:256,
   bounds:Array.isArray(item.bbox)&&item.bbox.length>=4?item.bbox:brazilBounds,
   minzoom:8,
   maxzoom:21,
   attribution:'CBERS-4A/WPM • INPE'
  });
  map.addLayer({
   id:'brazil-cbers-layer',
   type:'raster',
   source:'brazil-cbers-source',
   minzoom:9,
   maxzoom:22,
   paint:{'raster-opacity':1,'raster-fade-duration':220,'raster-contrast':0.03}
  });
  brazilSceneKey=sceneKey;
  return true;
 }catch(e){
  return false;
 }
}

async function refreshRegionalImagery(){
 if(!map)return;
 const brazil=await refreshBrazilImagery();
 if(brazil){
  activeImagery='Brasil • CBERS-4A/WPM 2 m (INPE)';
 }else{
  const region=bestStaticRegionalLayer();
  activeImagery=region?region.name:'EOX Sentinel-2';
 }
 if(divisionsEnabled)raiseDivisionLayers();
 if(liveAnyActive())raiseLiveLayers();
 updateCredit();
}

function scheduleRegionalRefresh(){
 clearTimeout(regionalRefreshTimer);
 regionalRefreshTimer=setTimeout(()=>refreshRegionalImagery(),260);
}

let divisionsEnabled=false;
let divisionsReady=false;
const DIVISION_LAYER_IDS=[
 'geo-admin-country',
 'geo-admin-state',
 'geo-admin-local',
 'geo-label-country',
 'geo-label-state',
 'geo-label-city'
];

function raiseDivisionLayers(){
 if(!map||!divisionsReady)return;
 for(const id of DIVISION_LAYER_IDS){
  try{if(map.getLayer(id))map.moveLayer(id)}catch(e){}
 }
}

async function ensureDivisionLayers(){
 if(divisionsReady)return true;
 if(!map)return false;
 if(!map.isStyleLoaded()){
  await new Promise(resolve=>map.once('load',resolve));
 }
 try{
  if(!map.getSource('geo-divisions')){
   map.addSource('geo-divisions',{
    type:'vector',
    url:'https://tiles.openfreemap.org/planet',
    attribution:'OpenFreeMap © OpenMapTiles © OpenStreetMap contributors'
   });
  }

  map.addLayer({
   id:'geo-admin-country',
   type:'line',
   source:'geo-divisions',
   'source-layer':'boundary',
   minzoom:0,
   filter:['==',['to-number',['get','admin_level']],2],
   layout:{visibility:'none','line-cap':'round','line-join':'round'},
   paint:{
    'line-color':'rgba(111,238,255,.96)',
    'line-width':['interpolate',['linear'],['zoom'],0,.75,3,1.1,7,1.55,12,2.1],
    'line-opacity':.94,
    'line-blur':.15
   }
  });

  map.addLayer({
   id:'geo-admin-state',
   type:'line',
   source:'geo-divisions',
   'source-layer':'boundary',
   minzoom:3.6,
   filter:['==',['to-number',['get','admin_level']],4],
   layout:{visibility:'none','line-cap':'round','line-join':'round'},
   paint:{
    'line-color':'rgba(255,255,255,.76)',
    'line-width':['interpolate',['linear'],['zoom'],4,.5,8,.9,12,1.25],
    'line-opacity':.76,
    'line-dasharray':[2,1.4]
   }
  });

  map.addLayer({
   id:'geo-admin-local',
   type:'line',
   source:'geo-divisions',
   'source-layer':'boundary',
   minzoom:7,
   filter:['match',['to-number',['get','admin_level']],[6,7],true,false],
   layout:{visibility:'none','line-cap':'round','line-join':'round'},
   paint:{
    'line-color':'rgba(196,235,255,.55)',
    'line-width':['interpolate',['linear'],['zoom'],7,.35,11,.65,15,1],
    'line-opacity':.55,
    'line-dasharray':[1.2,1.8]
   }
  });

  map.addLayer({
   id:'geo-label-country',
   type:'symbol',
   source:'geo-divisions',
   'source-layer':'place',
   minzoom:1,
   maxzoom:6.3,
   filter:['==',['get','class'],'country'],
   layout:{
    visibility:'none',
    'text-field':['coalesce',['get','name:pt'],['get','name']],
    'text-font':['Noto Sans Regular'],
    'text-size':['interpolate',['linear'],['zoom'],1,10,3,14,5.8,17],
    'text-letter-spacing':.05,
    'text-max-width':8,
    'text-allow-overlap':false
   },
   paint:{
    'text-color':'#f4feff',
    'text-halo-color':'rgba(0,16,30,.88)',
    'text-halo-width':1.5,
    'text-halo-blur':.5
   }
  });

  map.addLayer({
   id:'geo-label-state',
   type:'symbol',
   source:'geo-divisions',
   'source-layer':'place',
   minzoom:4,
   maxzoom:10,
   filter:['match',['get','class'],['state','province'],true,false],
   layout:{
    visibility:'none',
    'text-field':['coalesce',['get','name:pt'],['get','name']],
    'text-font':['Noto Sans Regular'],
    'text-size':['interpolate',['linear'],['zoom'],4,9,7,12,9.5,14],
    'text-letter-spacing':.025,
    'text-max-width':9,
    'text-allow-overlap':false
   },
   paint:{
    'text-color':'#d8fbff',
    'text-halo-color':'rgba(0,14,27,.88)',
    'text-halo-width':1.35,
    'text-halo-blur':.45
   }
  });

  map.addLayer({
   id:'geo-label-city',
   type:'symbol',
   source:'geo-divisions',
   'source-layer':'place',
   minzoom:6.5,
   maxzoom:16.5,
   filter:['match',['get','class'],['city','town'],true,false],
   layout:{
    visibility:'none',
    'text-field':['coalesce',['get','name:pt'],['get','name']],
    'text-font':['Noto Sans Regular'],
    'text-size':['interpolate',['linear'],['zoom'],6.5,8,10,11,14,13],
    'text-max-width':10,
    'text-allow-overlap':false
   },
   paint:{
    'text-color':'#ffffff',
    'text-halo-color':'rgba(0,12,24,.92)',
    'text-halo-width':1.25,
    'text-halo-blur':.4
   }
  });

  divisionsReady=true;
  raiseDivisionLayers();
  return true;
 }catch(e){
  return false;
 }
}

function setDivisionsVisibility(visible){
 if(!map||!divisionsReady)return;
 for(const id of DIVISION_LAYER_IDS){
  try{if(map.getLayer(id))map.setLayoutProperty(id,'visibility',visible?'visible':'none')}catch(e){}
 }
 if(visible)raiseDivisionLayers();
}

async function toggleGeographicDivisions(){
 const btn=document.querySelector('#geoDivisionsBtn');
 if(!btn)return;
 btn.disabled=true;
 if(!divisionsReady){
  const ok=await ensureDivisionLayers();
  if(!ok){
   btn.disabled=false;
   toast('Não foi possível carregar as divisões agora.');
   return;
  }
 }
 divisionsEnabled=!divisionsEnabled;
 setDivisionsVisibility(divisionsEnabled);
 btn.classList.toggle('active',divisionsEnabled);
 btn.setAttribute('aria-pressed',String(divisionsEnabled));
 btn.title=divisionsEnabled?'Ocultar divisões geográficas':'Mostrar divisões geográficas';
 updateCredit();
 toast(divisionsEnabled?'Divisões geográficas ativadas 🗺️':'Divisões geográficas ocultadas');
 btn.disabled=false;
}


const LIVE_LAYER_IDS=[
 'live-earthquakes-cluster','live-earthquakes-cluster-count','live-earthquakes-glow','live-earthquakes',
 'live-fires-cluster','live-fires-cluster-count','live-fires-glow','live-fires',
 'live-weather-cluster','live-weather-cluster-count','live-weather-glow','live-weather',
 'live-satellites-cluster','live-satellites-cluster-count','live-satellites'
];
const liveState={
 earthquakes:{active:false,count:null,totalCount:null,loadedAt:0,loading:false,raw:null},
 fires:{active:false,count:null,totalCount:null,loadedAt:0,loading:false,raw:null},
 weather:{active:false,count:null,totalCount:null,loadedAt:0,loading:false,raw:null},
 satellites:{active:false,count:null,totalCount:null,loadedAt:0,loading:false,raw:null}
};
const liveFilters={earthquakes:'2.5',fires:'all',weather:'all',satellites:'all'};
const livePollTimers={};
let liveLayersReady=false;
let dossierPickMode=false;

function liveAnyActive(){
 return Object.values(liveState).some(v=>v.active);
}

function raiseLiveLayers(){
 if(!map||!liveLayersReady)return;
 for(const id of LIVE_LAYER_IDS){
  try{if(map.getLayer(id))map.moveLayer(id)}catch(e){}
 }
}

function liveEmptyFC(){
 return {type:'FeatureCollection',features:[]};
}

function safeNum(v,fallback=0){
 const n=Number(v);
 return Number.isFinite(n)?n:fallback;
}

function validCoord(lng,lat){
 return Number.isFinite(Number(lng))&&Number.isFinite(Number(lat))&&Math.abs(Number(lat))<=90&&Math.abs(Number(lng))<=180;
}

function asFeature(lng,lat,props){
 return {type:'Feature',geometry:{type:'Point',coordinates:[Number(lng),Number(lat)]},properties:props};
}

function formatLiveCount(n){
 return n==null?'—':new Intl.NumberFormat('pt-BR',{notation:n>9999?'compact':'standard',maximumFractionDigits:1}).format(n);
}

function setLiveStatus(msg){
 const el=document.querySelector('#liveStatus');
 if(el)el.textContent=msg;
}

function updateLiveUi(){
 const countIds={
  earthquakes:'#liveCountEarthquakes',
  fires:'#liveCountFires',
  weather:'#liveCountWeather',
  satellites:'#liveCountSatellites'
 };
 for(const [key,state] of Object.entries(liveState)){
  const row=document.querySelector('[data-live-feed="'+key+'"]');
  const count=document.querySelector(countIds[key]);
  if(row){
   row.classList.toggle('active',state.active);
   row.classList.toggle('loading',state.loading);
   row.setAttribute('aria-pressed',String(state.active));
  }
  if(count)count.textContent=state.loading?'…':formatLiveCount(state.count);
 }
 const btn=document.querySelector('#liveDataBtn');
 if(btn)btn.classList.toggle('has-live',liveAnyActive());
}

async function fetchLiveJson(url,ms=15000){
 const controller=new AbortController();
 const t=setTimeout(()=>controller.abort(),ms);
 try{
  const res=await fetch(url,{mode:'cors',credentials:'omit',cache:'no-store',signal:controller.signal,headers:{Accept:'application/json'}});
  if(!res.ok)throw new Error('HTTP '+res.status);
  return await res.json();
 }finally{
  clearTimeout(t);
 }
}

async function fetchOsirisFeed(key){
 return await fetchLiveJson(OSIRIS_BASE+LIVE_ENDPOINTS[key],key==='satellites'?24000:16000);
}

async function fetchEarthquakesFallback(){
 const data=await fetchLiveJson('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson',12000);
 return {
  earthquakes:(data.features||[]).map(f=>{
   const c=f.geometry?.coordinates||[];
   const p=f.properties||{};
   return {id:f.id,lng:c[0],lat:c[1],depth:c[2],magnitude:p.mag,place:p.place,time:p.time,tsunami:p.tsunami};
  }),
  total:(data.features||[]).length,
  source:'USGS direto'
 };
}

async function fetchWeatherFallback(){
 const data=await fetchLiveJson('https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=120',12000);
 const events=[];
 for(const e of data.events||[]){
  const category=e.categories?.[0]?.id||'event';
  if(category==='wildfires'||category==='earthquakes')continue;
  const g=e.geometry?.[e.geometry.length-1];
  if(!g?.coordinates||g.type!=='Point')continue;
  const severity=category==='severeStorms'||category==='volcanoes'?'high':category==='seaIce'?'medium':'low';
  events.push({
   id:e.id,title:e.title,type:e.categories?.[0]?.title||'Evento natural',category,severity,
   lng:g.coordinates[0],lat:g.coordinates[1],date:g.date,provider:'NASA EONET'
  });
 }
 return {events,total:events.length,source:'NASA EONET direto'};
}

async function fetchFiresFallback(){
 const data=await fetchLiveJson('https://eonet.gsfc.nasa.gov/api/v3/events?status=open&category=wildfires&limit=300',12000);
 const fires=[];
 for(const e of data.events||[]){
  const g=e.geometry?.[e.geometry.length-1];
  if(!g?.coordinates||g.type!=='Point')continue;
  fires.push({id:e.id,title:e.title,type:'fire',lng:g.coordinates[0],lat:g.coordinates[1],date:g.date,confidence:'event'});
 }
 return {fires,total:fires.length,source:'NASA EONET fallback'};
}

async function getLivePayload(key){
 try{
  const data=await fetchOsirisFeed(key);
  return {...data,_source:'OSIRIS'};
 }catch(err){
  if(key==='earthquakes')return {...await fetchEarthquakesFallback(),_source:'USGS fallback'};
  if(key==='fires')return {...await fetchFiresFallback(),_source:'NASA fallback'};
  if(key==='weather')return {...await fetchWeatherFallback(),_source:'NASA fallback'};
  throw err;
 }
}

function buildEarthquakeGeo(data){
 const arr=data.earthquakes||data.features||[];
 return {
  type:'FeatureCollection',
  features:arr.filter(q=>validCoord(q.lng,q.lat)).map(q=>asFeature(q.lng,q.lat,{
   id:q.id||'',kind:'earthquake',
   magnitude:safeNum(q.magnitude??q.mag,0),
   depth:safeNum(q.depth,0),
   title:q.place||'Terremoto',
   place:q.place||'Local não informado',
   time:q.time||'',
   tsunami:q.tsunami?1:0
  }))
 };
}

function buildFiresGeo(data){
 const arr=data.fires||[];
 return {
  type:'FeatureCollection',
  features:arr.filter(f=>validCoord(f.lng,f.lat)).map((f,i)=>asFeature(f.lng,f.lat,{
   id:f.id||String(i),kind:f.type==='volcano'?'volcano':'fire',
   title:f.title||'Foco de calor',
   brightness:safeNum(f.brightness,0),
   frp:safeNum(f.frp,0),
   confidence:String(f.confidence||''),
   date:String(f.date||''),
   time:String(f.time||'')
  }))
 };
}

function buildWeatherGeo(data){
 const arr=data.events||data.weather_events||[];
 return {
  type:'FeatureCollection',
  features:arr.filter(e=>validCoord(e.lng,e.lat)).map((e,i)=>asFeature(e.lng,e.lat,{
   id:e.id||String(i),kind:'weather',
   title:e.title||e.type||'Evento climático',
   type:e.type||e.category||'Evento',
   severity:e.severity||'low',
   provider:e.provider||'OSIRIS',
   area:e.area||'',
   date:e.date||''
  }))
 };
}

function buildSatellitesGeo(data){
 let arr=data.satellites||[];
 if(arr.length>2600){
  const step=Math.ceil(arr.length/2400);
  arr=arr.filter((s,i)=>i%step===0||/ISS|HUBBLE|SENTINEL|LANDSAT|TIANGONG/i.test(s.name||'')).slice(0,2800);
 }
 return {
  type:'FeatureCollection',
  features:arr.filter(s=>validCoord(s.lng,s.lat)).map((s,i)=>asFeature(s.lng,s.lat,{
   id:s.noradId||String(i),kind:'satellite',
   title:s.name||'Satélite',
   mission:s.mission||'Objeto orbital',
   category:s.category||'other',
   alt:safeNum(s.alt,0),
   color:s.color||'#5cf4ff'
  }))
 };
}

function prettyLiveDate(value){
 if(!value)return '';
 const d=new Date(Number.isFinite(Number(value))?Number(value):value);
 if(Number.isNaN(d.getTime()))return String(value);
 return d.toLocaleString('pt-BR',{dateStyle:'short',timeStyle:'short'});
}

function clearLiveDetail(){
 const body=document.querySelector('#liveDetailBody');
 const meta=document.querySelector('#liveDetailMeta');
 if(body)body.innerHTML='';
 if(meta)meta.textContent='';
}

function addDetailRow(label,value){
 if(value===undefined||value===null||value==='')return;
 const body=document.querySelector('#liveDetailBody');
 if(!body)return;
 const row=document.createElement('div');
 row.className='live-detail-row';
 const l=document.createElement('span');
 const v=document.createElement('b');
 l.textContent=label;
 v.textContent=String(value);
 row.append(l,v);
 body.append(row);
}

function openLiveDetail(props,coords){
 clearLiveDetail();
 const sheet=document.querySelector('#liveDetailSheet');
 const icon=document.querySelector('#liveDetailIcon');
 const kind=document.querySelector('#liveDetailKind');
 const title=document.querySelector('#liveDetailTitle');
 const meta=document.querySelector('#liveDetailMeta');
 if(!sheet||!icon||!kind||!title)return;

 if(props.kind==='earthquake'){
  icon.textContent='〽️'; kind.textContent='TERREMOTO • USGS / OSIRIS';
  title.textContent='M '+safeNum(props.magnitude,0).toFixed(1)+' — '+(props.title||'Evento sísmico');
  addDetailRow('Magnitude',safeNum(props.magnitude,0).toFixed(1));
  addDetailRow('Profundidade',Math.round(safeNum(props.depth,0))+' km');
  addDetailRow('Local',props.place||props.title||'Não informado');
  addDetailRow('Horário',prettyLiveDate(props.time));
  addDetailRow('Tsunami',Number(props.tsunami)?'Alerta indicado pela fonte':'Não indicado');
 }else if(props.kind==='fire'||props.kind==='volcano'){
  icon.textContent=props.kind==='volcano'?'🌋':'🔥';
  kind.textContent=props.kind==='volcano'?'ATIVIDADE VULCÂNICA':'INCÊNDIO / FOCO DE CALOR';
  title.textContent=props.title||'Detecção térmica';
  addDetailRow('Confiança',props.confidence||'Não informada');
  if(safeNum(props.frp,0)>0)addDetailRow('Potência radiativa',safeNum(props.frp,0).toFixed(1)+' MW');
  if(safeNum(props.brightness,0)>0)addDetailRow('Brilho',safeNum(props.brightness,0).toFixed(1));
  addDetailRow('Data',props.date||'');
  addDetailRow('Horário',props.time||'');
 }else if(props.kind==='weather'){
  icon.textContent='🌀'; kind.textContent='CLIMA SEVERO / EVENTO NATURAL';
  title.textContent=props.title||'Evento climático';
  addDetailRow('Tipo',props.type||'Evento');
  addDetailRow('Severidade',props.severity||'Não informada');
  addDetailRow('Área',props.area||'');
  addDetailRow('Fonte',props.provider||'OSIRIS');
  addDetailRow('Atualização',prettyLiveDate(props.date));
 }else{
  icon.textContent='🛰️'; kind.textContent='OBJETO ORBITAL';
  title.textContent=props.title||'Satélite';
  addDetailRow('Missão',props.mission||'Objeto orbital');
  addDetailRow('Categoria',props.category||'other');
  addDetailRow('Altitude aproximada',Math.round(safeNum(props.alt,0))+' km');
  addDetailRow('NORAD',props.id||'');
 }
 if(coords&&meta)meta.textContent='Lat '+Number(coords[1]).toFixed(3)+' • Lon '+Number(coords[0]).toFixed(3);
 sheet.classList.add('open');
 sheet.setAttribute('aria-hidden','false');
}

function closeLiveDetail(){
 const sheet=document.querySelector('#liveDetailSheet');
 sheet?.classList.remove('open');
 sheet?.setAttribute('aria-hidden','true');
}

function registerLiveClick(layerId){
 map.on('click',layerId,e=>{
  if(dossierPickMode)return;
  const f=e.features?.[0];
  if(!f)return;
  openLiveDetail(f.properties||{},f.geometry.coordinates.slice());
 });
 map.on('mouseenter',layerId,()=>{map.getCanvas().style.cursor='pointer'});
 map.on('mouseleave',layerId,()=>{map.getCanvas().style.cursor=''});
}

function registerClusterClick(layerId,sourceId){
 map.on('click',layerId,async e=>{
  if(dossierPickMode)return;
  const f=e.features?.[0];
  if(!f)return;
  const id=f.properties?.cluster_id;
  const src=map.getSource(sourceId);
  if(id===undefined||!src?.getClusterExpansionZoom)return;
  try{
   const z=await src.getClusterExpansionZoom(id);
   map.easeTo({center:f.geometry.coordinates,zoom:Math.min(z,13),duration:650});
  }catch(e){}
 });
 map.on('mouseenter',layerId,()=>{map.getCanvas().style.cursor='zoom-in'});
 map.on('mouseleave',layerId,()=>{map.getCanvas().style.cursor=''});
}

function featurePassesLiveFilter(key,f){
 const p=f.properties||{};
 const value=liveFilters[key];
 if(key==='earthquakes')return safeNum(p.magnitude,0)>=safeNum(value,2.5);
 if(key==='fires'){
  if(value==='high')return String(p.confidence||'').toLowerCase()==='high'||safeNum(p.frp,0)>=30;
  if(value==='frp50')return safeNum(p.frp,0)>=50;
  return true;
 }
 if(key==='weather'){
  if(value==='high')return p.severity==='high';
  if(value==='medium')return p.severity==='high'||p.severity==='medium';
  return true;
 }
 if(key==='satellites'){
  if(value==='weather')return p.mission==='Weather';
  return value==='all'||p.category===value;
 }
 return true;
}

function applyLiveFilter(key){
 const state=liveState[key];
 if(!state?.raw)return;
 const filtered={type:'FeatureCollection',features:(state.raw.features||[]).filter(f=>featurePassesLiveFilter(key,f))};
 state.count=filtered.features.length;
 setLiveSourceData(key,filtered);
 updateLiveUi();
}

function distanceKm(aLat,aLng,bLat,bLng){
 const r=6371,dLat=(bLat-aLat)*Math.PI/180,dLng=(bLng-aLng)*Math.PI/180;
 const x=Math.sin(dLat/2)**2+Math.cos(aLat*Math.PI/180)*Math.cos(bLat*Math.PI/180)*Math.sin(dLng/2)**2;
 return 2*r*Math.asin(Math.min(1,Math.sqrt(x)));
}

async function ensureRawForDossier(key){
 const state=liveState[key];
 if(state.raw&&Date.now()-state.loadedAt<LIVE_REFRESH_MS[key])return state.raw;
 try{
  const payload=await getLivePayload(key);
  const geo=key==='earthquakes'?buildEarthquakeGeo(payload):key==='fires'?buildFiresGeo(payload):key==='weather'?buildWeatherGeo(payload):buildSatellitesGeo(payload);
  state.raw=geo;
  state.totalCount=geo.features.length;
  state.loadedAt=Date.now();
  if(state.active)applyLiveFilter(key);
  return geo;
 }catch(e){
  return state.raw||liveEmptyFC();
 }
}

function nearbyCount(fc,lat,lng,radius){
 return (fc?.features||[]).filter(f=>{
  const c=f.geometry?.coordinates;
  return c&&distanceKm(lat,lng,c[1],c[0])<=radius;
 }).length;
}

async function openRegionDossier(lat,lng){
 closeLiveDetail();
 const sheet=document.querySelector('#liveDetailSheet');
 const icon=document.querySelector('#liveDetailIcon');
 const kind=document.querySelector('#liveDetailKind');
 const title=document.querySelector('#liveDetailTitle');
 const meta=document.querySelector('#liveDetailMeta');
 if(!sheet||!icon||!kind||!title)return;
 clearLiveDetail();
 icon.textContent='📍'; kind.textContent='O QUE ESTÁ ACONTECENDO AQUI?';
 title.textContent='Analisando região…';
 if(meta)meta.textContent='Lat '+lat.toFixed(3)+' • Lon '+lng.toFixed(3);
 sheet.classList.add('open'); sheet.setAttribute('aria-hidden','false');

 const [quake,fire,weather,dossier]=await Promise.all([
  ensureRawForDossier('earthquakes'),
  ensureRawForDossier('fires'),
  ensureRawForDossier('weather'),
  fetchLiveJson(OSIRIS_BASE+'/api/region-dossier?lat='+lat.toFixed(5)+'&lng='+lng.toFixed(5),14000).catch(()=>null)
 ]);

 const place=dossier?.location?.display_name||dossier?.location?.city||dossier?.location?.state||dossier?.location?.country||'Região selecionada';
 title.textContent=place;
 if(dossier?.wikipedia?.extract)addDetailRow('Sobre o local',dossier.wikipedia.extract);
 if(dossier?.country?.capital)addDetailRow('Capital do país',dossier.country.capital);
 if(dossier?.country?.population)addDetailRow('População do país',new Intl.NumberFormat('pt-BR').format(dossier.country.population));
 addDetailRow('Terremotos em até 500 km',nearbyCount(quake,lat,lng,500));
 addDetailRow('Incêndios / focos em até 250 km',nearbyCount(fire,lat,lng,250));
 addDetailRow('Clima severo em até 750 km',nearbyCount(weather,lat,lng,750));

 const sat=liveState.satellites.raw;
 if(sat)addDetailRow('Satélites projetados em até 500 km',nearbyCount(sat,lat,lng,500));
 if(meta)meta.textContent=(dossier?.attribution?'Localização: OpenStreetMap • ':'')+'Lat '+lat.toFixed(3)+' • Lon '+lng.toFixed(3);
}

function startDossierPick(){
 dossierPickMode=true;
 closeLiveSheet();
 closeLiveDetail();
 toast('Toque em qualquer ponto do globo para analisar 📍');
}

async function ensureLiveLayers(){
 if(liveLayersReady)return true;
 if(!map)return false;
 if(!map.isStyleLoaded())await new Promise(resolve=>map.once('load',resolve));
 try{
  for(const sourceId of ['live-earthquakes','live-fires','live-weather','live-satellites']){
   if(!map.getSource(sourceId))map.addSource(sourceId,{
    type:'geojson',
    data:liveEmptyFC(),
    cluster:true,
    clusterMaxZoom:sourceId==='live-satellites'?6:9,
    clusterRadius:sourceId==='live-satellites'?36:46
   });
  }

  const clusterDefs=[
   ['live-earthquakes','#ff754a'],
   ['live-fires','#ff6b00'],
   ['live-weather','#4bdcff'],
   ['live-satellites','#70f1ff']
  ];
  for(const [sourceId,color] of clusterDefs){
   map.addLayer({id:sourceId+'-cluster',type:'circle',source:sourceId,filter:['has','point_count'],layout:{visibility:'none'},paint:{
    'circle-radius':['step',['get','point_count'],12,25,16,100,21,500,27],
    'circle-color':color,'circle-opacity':.82,'circle-stroke-color':'rgba(255,255,255,.78)','circle-stroke-width':1
   }});
   map.addLayer({id:sourceId+'-cluster-count',type:'symbol',source:sourceId,filter:['has','point_count'],layout:{
    visibility:'none','text-field':['get','point_count_abbreviated'],'text-font':['Noto Sans Regular'],'text-size':10
   },paint:{'text-color':'#00111d'}});
  }

  map.addLayer({id:'live-earthquakes-glow',type:'circle',source:'live-earthquakes',layout:{visibility:'none'},paint:{
   'circle-radius':['interpolate',['linear'],['get','magnitude'],2.5,8,5,17,7,28],
   'circle-color':['interpolate',['linear'],['get','magnitude'],2.5,'#ffd166',4.5,'#ff8c42',6,'#ff3b30',8,'#ff005d'],
   'circle-opacity':.18,'circle-blur':.65
  }});
  map.addLayer({id:'live-earthquakes',type:'circle',source:'live-earthquakes',filter:['!', ['has','point_count']],layout:{visibility:'none'},paint:{
   'circle-radius':['interpolate',['linear'],['get','magnitude'],2.5,3.2,5,6,7,9],
   'circle-color':['interpolate',['linear'],['get','magnitude'],2.5,'#ffe66d',4.5,'#ff9f43',6,'#ff453a',8,'#ff1744'],
   'circle-stroke-color':'rgba(255,255,255,.9)','circle-stroke-width':.7,'circle-opacity':.94
  }});

  map.addLayer({id:'live-fires-glow',type:'circle',source:'live-fires',layout:{visibility:'none'},paint:{
   'circle-radius':['interpolate',['linear'],['zoom'],1,3,6,7,12,13],
   'circle-color':'#ff3b00','circle-opacity':.22,'circle-blur':.8
  }});
  map.addLayer({id:'live-fires',type:'circle',source:'live-fires',filter:['!', ['has','point_count']],layout:{visibility:'none'},paint:{
   'circle-radius':['interpolate',['linear'],['zoom'],1,1.8,6,3.6,12,6],
   'circle-color':['case',['==',['get','kind'],'volcano'],'#ff00a8','#ff6b00'],
   'circle-stroke-color':'#ffd2a6','circle-stroke-width':.5,'circle-opacity':.9
  }});

  map.addLayer({id:'live-weather-glow',type:'circle',source:'live-weather',layout:{visibility:'none'},paint:{
   'circle-radius':['interpolate',['linear'],['zoom'],1,8,6,14,12,22],
   'circle-color':['match',['get','severity'],'high','#ff2d55','medium','#ffcc00','#45e7ff'],
   'circle-opacity':.16,'circle-blur':.72
  }});
  map.addLayer({id:'live-weather',type:'circle',source:'live-weather',filter:['!', ['has','point_count']],layout:{visibility:'none'},paint:{
   'circle-radius':['interpolate',['linear'],['zoom'],1,3.8,6,6.2,12,8.5],
   'circle-color':['match',['get','severity'],'high','#ff2d55','medium','#ffcc00','#45e7ff'],
   'circle-stroke-color':'rgba(255,255,255,.88)','circle-stroke-width':.7,'circle-opacity':.92
  }});

  map.addLayer({id:'live-satellites',type:'circle',source:'live-satellites',filter:['!', ['has','point_count']],layout:{visibility:'none'},paint:{
   'circle-radius':['interpolate',['linear'],['zoom'],1,1.2,5,2.3,10,3.4],
   'circle-color':['coalesce',['get','color'],'#62efff'],
   'circle-opacity':.9,'circle-stroke-color':'rgba(255,255,255,.45)','circle-stroke-width':.35
  }});

  ['live-earthquakes','live-fires','live-weather','live-satellites'].forEach(registerLiveClick);
  ['live-earthquakes','live-fires','live-weather','live-satellites'].forEach(id=>registerClusterClick(id+'-cluster',id));
  map.on('click',e=>{
   if(!dossierPickMode)return;
   dossierPickMode=false;
   openRegionDossier(e.lngLat.lat,e.lngLat.lng);
  });
  liveLayersReady=true;
  raiseLiveLayers();
  return true;
 }catch(e){
  console.warn('Ao Vivo layer init:',e);
  return false;
 }
}

function liveLayerIdsFor(key){
 if(key==='earthquakes')return ['live-earthquakes-cluster','live-earthquakes-cluster-count','live-earthquakes-glow','live-earthquakes'];
 if(key==='fires')return ['live-fires-cluster','live-fires-cluster-count','live-fires-glow','live-fires'];
 if(key==='weather')return ['live-weather-cluster','live-weather-cluster-count','live-weather-glow','live-weather'];
 return ['live-satellites-cluster','live-satellites-cluster-count','live-satellites'];
}

function setLiveLayerVisibility(key,visible){
 for(const id of liveLayerIdsFor(key)){
  try{if(map.getLayer(id))map.setLayoutProperty(id,'visibility',visible?'visible':'none')}catch(e){}
 }
 if(visible)raiseLiveLayers();
}

function setLiveSourceData(key,data){
 const source=map?.getSource('live-'+key);
 if(source?.setData)source.setData(data);
}

async function loadLiveFeed(key,force=false){
 const state=liveState[key];
 if(!state||state.loading)return;
 const fresh=Date.now()-state.loadedAt<LIVE_REFRESH_MS[key];
 if(fresh&&!force){
  setLiveLayerVisibility(key,state.active);
  return;
 }
 state.loading=true;
 updateLiveUi();
 setLiveStatus('Atualizando '+({earthquakes:'terremotos',fires:'incêndios',weather:'clima severo',satellites:'satélites'}[key])+'…');
 try{
  const payload=await getLivePayload(key);
  let geo;
  if(key==='earthquakes')geo=buildEarthquakeGeo(payload);
  else if(key==='fires')geo=buildFiresGeo(payload);
  else if(key==='weather')geo=buildWeatherGeo(payload);
  else geo=buildSatellitesGeo(payload);

  state.raw=geo;
  state.totalCount=safeNum(payload.total,geo.features.length);
  state.loadedAt=Date.now();
  applyLiveFilter(key);
  setLiveStatus((payload._source||'OSIRIS')+' • '+formatLiveCount(state.count)+' exibidos');
 }catch(e){
  state.count=state.count??0;
  setLiveStatus(key==='satellites'?'Satélites indisponíveis agora; as outras camadas continuam funcionando.':'Feed temporariamente indisponível.');
  console.warn('Nerdora Terra Ao Vivo:',key,e);
 }finally{
  state.loading=false;
  updateLiveUi();
  if(state.active)setLiveLayerVisibility(key,true);
 }
}

function startLivePolling(key){
 clearInterval(livePollTimers[key]);
 livePollTimers[key]=setInterval(()=>{
  if(liveState[key]?.active&&!document.hidden)loadLiveFeed(key,true);
 },LIVE_REFRESH_MS[key]);
}

function stopLivePolling(key){
 clearInterval(livePollTimers[key]);
 delete livePollTimers[key];
}

async function toggleLiveFeed(key){
 const state=liveState[key];
 if(!state)return;
 const ready=await ensureLiveLayers();
 if(!ready){
  toast('Não foi possível preparar as camadas ao vivo.');
  return;
 }
 state.active=!state.active;
 setLiveLayerVisibility(key,state.active);
 if(state.active){
  await loadLiveFeed(key,false);
  startLivePolling(key);
 }else{
  stopLivePolling(key);
 }
 updateLiveUi();
}

function openLiveSheet(){
 closeSheet();
 closeDiscoverSheet();
 const el=document.querySelector('#liveSheet');
 const btn=document.querySelector('#liveDataBtn');
 el?.classList.add('open');
 el?.setAttribute('aria-hidden','false');
 btn?.setAttribute('aria-expanded','true');
 updateLiveUi();
}

function closeLiveSheet(){
 const el=document.querySelector('#liveSheet');
 const btn=document.querySelector('#liveDataBtn');
 el?.classList.remove('open');
 el?.setAttribute('aria-hidden','true');
 btn?.setAttribute('aria-expanded','false');
}

async function refreshActiveLiveFeeds(){
 const keys=Object.keys(liveState).filter(k=>liveState[k].active);
 if(!keys.length){
  setLiveStatus('Ative uma camada para começar.');
  return;
 }
 await Promise.all(keys.map(k=>loadLiveFeed(k,true)));
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
 updateCredit();
 if(loading)loading.textContent='Finalizando Terra 3D...';
}

try{
 map=new maplibregl.Map({
   container:'earthMap',
   style:{
     version:8,
     projection:{type:'globe'},
     glyphs:'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',
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
 map.on('style.load',async()=>{
  addRegionalImageryLayers();
  await configureTerrain();
  await refreshRegionalImagery();
 });
 map.on('moveend',scheduleRegionalRefresh);
 map.on('zoomend',scheduleRegionalRefresh);
 map.once('idle',()=>{
  document.querySelector('#loading').classList.add('hide');
  requestAnimationFrame(()=>map?.resize());
 });
 window.addEventListener('resize',()=>requestAnimationFrame(()=>map?.resize()),{passive:true});
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
 closeLiveSheet();
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

document.querySelector('#geoDivisionsBtn').onclick=toggleGeographicDivisions;
document.querySelector('#liveDataBtn').onclick=()=>{
 const livePanel=document.querySelector('#liveSheet');
 livePanel?.classList.contains('open')?closeLiveSheet():openLiveSheet();
};
document.querySelector('#liveClose').onclick=closeLiveSheet;
document.querySelector('#liveBackdrop').onclick=closeLiveSheet;
document.querySelector('#liveRefresh').onclick=refreshActiveLiveFeeds;
document.querySelector('#liveDossier').onclick=startDossierPick;
document.querySelector('#liveDetailClose').onclick=closeLiveDetail;
document.querySelector('#liveDetailBackdrop').onclick=closeLiveDetail;
document.querySelectorAll('[data-live-feed]').forEach(row=>row.onclick=()=>toggleLiveFeed(row.dataset.liveFeed));
document.querySelectorAll('[data-live-filter]').forEach(select=>select.onchange=()=>{
 liveFilters[select.dataset.liveFilter]=select.value;
 applyLiveFilter(select.dataset.liveFilter);
});
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