// Nerdora Terra Core 3.0 — terrain visual enhancements
// Adds subtle multidimensional relief shading on top of the existing 3D DEM.

export function enableTerrainHillshade(map){
  if(!map)return;

  const install=()=>{
    try{
      if(!map.isStyleLoaded())return false;
      if(!map.getSource('terrainSource'))return false;
      if(map.getLayer('terrain-hillshade'))return true;

      map.addLayer({
        id:'terrain-hillshade',
        type:'hillshade',
        source:'terrainSource',
        minzoom:2,
        maxzoom:18.5,
        paint:{
          'hillshade-exaggeration':0.32,
          'hillshade-shadow-color':'#061522',
          'hillshade-highlight-color':'#d9f3ff',
          'hillshade-accent-color':'#36576e',
          'hillshade-illumination-anchor':'map',
          'hillshade-illumination-direction':330
        }
      });

      // Keep labels, divisions and live layers above the relief shading when present.
      for(const id of [
        'geo-admin-country','geo-admin-state','geo-admin-local',
        'geo-label-country','geo-label-state','geo-label-city',
        'live-earthquakes-cluster','live-earthquakes-cluster-count','live-earthquakes-glow','live-earthquakes',
        'live-fires-cluster','live-fires-cluster-count','live-fires-glow','live-fires',
        'live-weather-cluster','live-weather-cluster-count','live-weather-glow','live-weather',
        'live-satellites-cluster','live-satellites-cluster-count','live-satellites'
      ]){
        try{if(map.getLayer(id))map.moveLayer(id)}catch{}
      }
      return true;
    }catch(e){
      console.warn('Nerdora Terra hillshade:',e);
      return false;
    }
  };

  let attempts=0;
  const retry=()=>{
    if(install())return;
    attempts+=1;
    if(attempts<12)setTimeout(retry,350);
  };

  map.on('style.load',()=>setTimeout(retry,0));
  setTimeout(retry,180);
}
