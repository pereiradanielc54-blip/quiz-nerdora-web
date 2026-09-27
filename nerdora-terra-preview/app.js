import * as maplibregl from 'https://unpkg.com/maplibre-gl@6.11.2/dist/maplibre-gl.mjs';

const IMAGERY='https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/g/{z}/{y}/{x}.jpg';
const MAPTERHORN_TILEJSON='https://tiles.mapterhorn.com/tilejson.json';
const MAPTERHORN_DIRECT='https://tiles.mapterhorn.com/{z}/{x}/{y}.webp';
const AWS_TERRAIN='https://elevation-tiles-prod.s3.amazonaws.com/terrarium/{z}/{x}/{y}.png';

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

document.querySelector('#geoDivisionsBtn').onclick=toggleGeographicDivisions;
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