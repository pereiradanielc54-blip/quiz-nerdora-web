// Nerdora Terra Core 3.4
// Non-invasive bootstrap: captures the existing MapLibre instance, raises the
// supported camera zoom, manages imagery visibility, relief and buildings.
// Landmarks are loaded as an optional module so a Three.js/CDN failure can never
// prevent the Earth, terrain, imagery or buildings from starting.

import * as maplibregl from 'https://unpkg.com/maplibre-gl@6.11.2/dist/maplibre-gl.mjs';
import {SatelliteSourceManager} from './satellite-source-manager.js';
import {enableTerrainHillshade} from './terrain-enhancements.js';
import {Buildings3DManager} from './buildings-3d.js';

const CORE_VERSION='3.4.0';
const booted=new WeakSet();

function installSafeApiProxy(){
  const host=location.hostname.toLowerCase();
  const useProxy=host.endsWith('.vercel.app');
  if(!useProxy||window.__NERDORA_FETCH_PROXY__)return;

  const nativeFetch=window.fetch.bind(window);
  const proxyFetch=(target,originalInput,init)=>nativeFetch(target,init).then(res=>{
    if(res.ok)return res;
    return nativeFetch(originalInput,init);
  }).catch(()=>nativeFetch(originalInput,init));

  window.fetch=function(input,init){
    try{
      const raw=typeof input==='string'||input instanceof URL?String(input):input?.url;
      if(!raw)return nativeFetch(input,init);
      const u=new URL(raw,location.href);

      if(u.origin==='https://osirisai.live'&&u.pathname.startsWith('/api/')){
        const feed=u.pathname.slice('/api/'.length);
        const target=new URL('/api/terra/osiris',location.origin);
        target.searchParams.set('feed',feed);
        u.searchParams.forEach((v,k)=>target.searchParams.append(k,v));
        return proxyFetch(target,input,init);
      }

      if(u.origin==='https://data.inpe.br'&&u.pathname==='/bdc/stac/v1/search'){
        const target=new URL('/api/terra/inpe-stac',location.origin);
        u.searchParams.forEach((v,k)=>target.searchParams.append(k,v));
        return proxyFetch(target,input,init);
      }
    }catch{}
    return nativeFetch(input,init);
  };

  window.__NERDORA_FETCH_PROXY__={enabled:true,host};
}

async function bootOptionalLandmarks(map){
  try{
    const {Landmarks3DManager}=await import('./landmarks-3d.js');
    const landmarks=new Landmarks3DManager(map,maplibregl);
    window.__NERDORA_TERRA_CORE__.landmarks3D=landmarks;
    window.__NERDORA_TERRA_CORE__.landmarks3DStatus='ready';
    landmarks.start();
  }catch(error){
    window.__NERDORA_TERRA_CORE__.landmarks3D=null;
    window.__NERDORA_TERRA_CORE__.landmarks3DStatus='unavailable';
    console.warn('Nerdora Terra landmarks 3D unavailable; base globe remains active.',error);
  }
}

function boot(map){
  if(!map||booted.has(map))return;
  booted.add(map);

  try{map.setMaxZoom(21)}catch{}

  window.__NERDORA_TERRA_CORE__={
    version:CORE_VERSION,
    map,
    maxZoom:21,
    imagery:'EOX Sentinel-2',
    satelliteSourceManager:null,
    buildings3D:null,
    landmarks3D:null,
    landmarks3DStatus:'loading',
    hillshade:true,
    apiProxy:!!window.__NERDORA_FETCH_PROXY__?.enabled
  };

  const imagery=new SatelliteSourceManager(map,{
    onChange(provider){
      if(window.__NERDORA_TERRA_CORE__)window.__NERDORA_TERRA_CORE__.imagery=provider?.name||'EOX Sentinel-2';
    }
  });
  window.__NERDORA_TERRA_CORE__.satelliteSourceManager=imagery;
  imagery.start();

  enableTerrainHillshade(map);

  const buildings=new Buildings3DManager(map);
  window.__NERDORA_TERRA_CORE__.buildings3D=buildings;
  buildings.start();

  // Optional: does not block the core if Three.js or the external module fails.
  setTimeout(()=>bootOptionalLandmarks(map),250);

  window.dispatchEvent(new CustomEvent('nerdora:terra-core-ready',{detail:{version:CORE_VERSION,map}}));
}

function capture(map){
  try{
    const container=map?.getContainer?.();
    if(container?.id!=='earthMap')return;
  }catch{return}
  queueMicrotask(()=>boot(map));
}

installSafeApiProxy();

if(!maplibregl.Map.prototype.__nerdoraCorePatched){
  const originalOn=maplibregl.Map.prototype.on;
  Object.defineProperty(maplibregl.Map.prototype,'__nerdoraCorePatched',{value:true,configurable:false});
  maplibregl.Map.prototype.on=function(...args){
    capture(this);
    return originalOn.apply(this,args);
  };
}
