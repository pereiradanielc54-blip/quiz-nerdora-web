// Nerdora Terra Core 3.0
// Non-invasive bootstrap: captures the existing MapLibre instance, raises the
// supported camera zoom, manages imagery visibility and enhances 3D relief.

import * as maplibregl from 'https://unpkg.com/maplibre-gl@6.11.2/dist/maplibre-gl.mjs';
import {SatelliteSourceManager} from './satellite-source-manager.js';
import {enableTerrainHillshade} from './terrain-enhancements.js';

const CORE_VERSION='3.0.0';
const booted=new WeakSet();

function installSafeApiProxy(){
  const host=location.hostname.toLowerCase();
  // GitHack/local preview keeps calling providers directly. Vercel production
  // gets a same-origin cache/proxy, with automatic direct-provider fallback.
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
        const target=new URL('/api/terra/proxy',location.origin);
        target.searchParams.set('provider','osiris');
        target.searchParams.set('path',u.pathname.slice('/api/'.length));
        u.searchParams.forEach((v,k)=>target.searchParams.append(k,v));
        return proxyFetch(target,input,init);
      }

      if(u.origin==='https://data.inpe.br'&&u.pathname==='/bdc/stac/v1/search'){
        const target=new URL('/api/terra/proxy',location.origin);
        target.searchParams.set('provider','inpe-stac');
        u.searchParams.forEach((v,k)=>target.searchParams.append(k,v));
        return proxyFetch(target,input,init);
      }
    }catch{}
    return nativeFetch(input,init);
  };

  window.__NERDORA_FETCH_PROXY__={enabled:true,host};
}

function boot(map){
  if(!map||booted.has(map))return;
  booted.add(map);

  try{map.setMaxZoom(21)}catch{}

  const imagery=new SatelliteSourceManager(map,{
    onChange(provider){
      window.__NERDORA_TERRA_CORE__.imagery=provider?.name||'EOX Sentinel-2';
    }
  });
  imagery.start();
  enableTerrainHillshade(map);

  window.__NERDORA_TERRA_CORE__={
    version:CORE_VERSION,
    map,
    maxZoom:21,
    imagery:'EOX Sentinel-2',
    satelliteSourceManager:imagery,
    hillshade:true,
    apiProxy:!!window.__NERDORA_FETCH_PROXY__?.enabled
  };

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

// app.js owns the map instance. We keep that ownership intact and only observe
// the first public Map event registration, which gives Core 3.0 the same map
// without rewriting the proven app.js implementation.
if(!maplibregl.Map.prototype.__nerdoraCorePatched){
  const originalOn=maplibregl.Map.prototype.on;
  Object.defineProperty(maplibregl.Map.prototype,'__nerdoraCorePatched',{value:true,configurable:false});
  maplibregl.Map.prototype.on=function(...args){
    capture(this);
    return originalOn.apply(this,args);
  };
}
