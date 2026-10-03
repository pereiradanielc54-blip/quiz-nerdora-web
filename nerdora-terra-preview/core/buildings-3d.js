// Nerdora Terra Core 3.1 — real OSM/OpenFreeMap building extrusions.
// Loaded only at close zoom; no roads or labels are added.

const SOURCE_ID='terra-3d-buildings-source';
const LAYER_ID='terra-3d-buildings';

function raiseOverlays(map){
  const ids=[
    'geo-admin-country','geo-admin-state','geo-admin-local',
    'geo-label-country','geo-label-state','geo-label-city',
    'live-earthquakes-cluster','live-earthquakes-cluster-count','live-earthquakes-glow','live-earthquakes',
    'live-fires-cluster','live-fires-cluster-count','live-fires-glow','live-fires',
    'live-weather-cluster','live-weather-cluster-count','live-weather-glow','live-weather',
    'live-satellites-cluster','live-satellites-cluster-count','live-satellites'
  ];
  for(const id of ids){try{if(map.getLayer(id))map.moveLayer(id)}catch{}}
}

export class Buildings3DManager{
  constructor(map){
    this.map=map;
    this.enabled=true;
    this.installed=false;
    this._install=this.install.bind(this);
  }

  start(){
    if(!this.map)return;
    this.map.on('style.load',()=>setTimeout(this._install,0));
    setTimeout(this._install,500);
  }

  install(){
    const map=this.map;
    if(!map||!map.isStyleLoaded())return false;
    try{
      if(!map.getSource(SOURCE_ID)){
        map.addSource(SOURCE_ID,{type:'vector',url:'https://tiles.openfreemap.org/planet',attribution:'© OpenStreetMap contributors • OpenMapTiles • OpenFreeMap'});
      }
      if(!map.getLayer(LAYER_ID)){
        map.addLayer({
          id:LAYER_ID,
          type:'fill-extrusion',
          source:SOURCE_ID,
          'source-layer':'building',
          minzoom:15,
          maxzoom:22,
          filter:['!=',['get','hide_3d'],true],
          layout:{visibility:this.enabled?'visible':'none'},
          paint:{
            'fill-extrusion-color':[
              'interpolate',['linear'],['coalesce',['to-number',['get','render_height']],0],
              0,'#b8c4ca',
              50,'#d4dde0',
              180,'#9fc4d5',
              350,'#7cb7d4',
              650,'#b9e9f5'
            ],
            'fill-extrusion-height':[
              'interpolate',['linear'],['zoom'],15,0,15.65,['coalesce',['to-number',['get','render_height']],3]
            ],
            'fill-extrusion-base':[
              'case',['>=',['zoom'],15.65],['coalesce',['to-number',['get','render_min_height']],0],0
            ],
            'fill-extrusion-opacity':0.9,
            'fill-extrusion-vertical-gradient':true
          }
        });
      }
      this.installed=true;
      raiseOverlays(map);
      return true;
    }catch(e){
      console.warn('Nerdora Terra buildings 3D:',e);
      return false;
    }
  }

  setEnabled(value){
    this.enabled=!!value;
    if(!this.installed)this.install();
    try{if(this.map.getLayer(LAYER_ID))this.map.setLayoutProperty(LAYER_ID,'visibility',this.enabled?'visible':'none')}catch{}
    return this.enabled;
  }

  toggle(){return this.setEnabled(!this.enabled)}
}
