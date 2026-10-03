// Nerdora Terra Core 3.0 — SatelliteSourceManager
// Keeps only the best regional imagery layer active for the current camera.
// The global EOX layer remains the permanent fallback beneath it.

export const REGIONAL_PROVIDERS = [
  {id:'japan-gsi',name:'Japão • GSI Aerial',bounds:[122.0,20.0,154.5,46.5],minzoom:13,maxzoom:18,priority:90},
  {id:'swissimage',name:'Suíça • SWISSIMAGE',bounds:[5.75,45.65,10.75,47.95],minzoom:10,maxzoom:19,priority:95},
  {id:'netherlands-pdok',name:'Países Baixos • PDOK HR',bounds:[3.15,50.65,7.35,53.75],minzoom:11,maxzoom:21,priority:100},
  {id:'france-ign',name:'França • IGN Ortho HR',bounds:[-5.8,41.0,10.0,51.25],minzoom:10,maxzoom:19,priority:92},
  {id:'spain-pnoa',name:'Espanha • PNOA',bounds:[-9.7,35.5,4.6,43.95],minzoom:10,maxzoom:20,priority:93},
  {id:'usa-usgs',name:'Estados Unidos • USGS Imagery',bounds:[-125.1,24.1,-66.2,49.7],minzoom:9,maxzoom:20,priority:88},
  {id:'estonia-ortho',name:'Estônia • Ortofoto nacional',bounds:[21.5,57.2,28.3,59.85],minzoom:11,maxzoom:20,priority:94},
  {id:'uruguay-ortho',name:'Uruguai • IDE.uy Ortofoto',bounds:[-58.55,-35.1,-53.05,-30.0],minzoom:10,maxzoom:20,priority:91},
  {id:'wallonia-ortho',name:'Bélgica/Valônia • SPW Ortho',bounds:[2.8,49.45,6.55,50.85],minzoom:11,maxzoom:20,priority:96}
];

const BRAZIL = {id:'brazil-cbers',name:'Brasil • CBERS-4A/WPM',bounds:[-74.1,-34.0,-34.7,5.5],minzoom:9,maxzoom:21,priority:110};

function inside(lon,lat,b){
  return lon>=b[0]&&lon<=b[2]&&lat>=b[1]&&lat<=b[3];
}

export class SatelliteSourceManager {
  constructor(map,{onChange}={}){
    this.map=map;
    this.onChange=onChange;
    this.active='global-eox';
    this._timer=null;
    this._started=false;
    this._apply=this.apply.bind(this);
    this._schedule=this.schedule.bind(this);
  }

  start(){
    if(this._started||!this.map)return;
    this._started=true;
    this.map.on('moveend',this._schedule);
    this.map.on('zoomend',this._schedule);
    this.map.on('style.load',()=>setTimeout(this._apply,0));
    setTimeout(this._apply,250);
  }

  stop(){
    if(!this._started)return;
    this._started=false;
    clearTimeout(this._timer);
    try{this.map.off('moveend',this._schedule)}catch{}
    try{this.map.off('zoomend',this._schedule)}catch{}
  }

  schedule(){
    clearTimeout(this._timer);
    this._timer=setTimeout(this._apply,180);
  }

  pick(){
    if(!this.map)return null;
    const c=this.map.getCenter();
    const z=this.map.getZoom();
    const candidates=REGIONAL_PROVIDERS.filter(p=>z>=p.minzoom&&inside(c.lng,c.lat,p.bounds));
    if(this.map.getLayer('brazil-cbers-layer')&&z>=BRAZIL.minzoom&&inside(c.lng,c.lat,BRAZIL.bounds))candidates.push(BRAZIL);
    candidates.sort((a,b)=>(b.priority-a.priority)||(b.minzoom-a.minzoom));
    return candidates[0]||null;
  }

  setLayerVisible(id,visible){
    const layerId=id==='brazil-cbers'?'brazil-cbers-layer':'regional-layer-'+id;
    try{
      if(this.map.getLayer(layerId))this.map.setLayoutProperty(layerId,'visibility',visible?'visible':'none');
    }catch{}
  }

  apply(){
    if(!this.map||!this.map.isStyleLoaded())return;
    const chosen=this.pick();
    for(const provider of REGIONAL_PROVIDERS)this.setLayerVisible(provider.id,chosen?.id===provider.id);
    if(this.map.getLayer('brazil-cbers-layer'))this.setLayerVisible('brazil-cbers',chosen?.id==='brazil-cbers');

    const next=chosen?.id||'global-eox';
    if(next!==this.active){
      this.active=next;
      this.onChange?.(chosen||{id:'global-eox',name:'EOX Sentinel-2',maxzoom:14});
      window.dispatchEvent(new CustomEvent('nerdora:imagery-change',{detail:{provider:chosen||null}}));
    }
  }
}
