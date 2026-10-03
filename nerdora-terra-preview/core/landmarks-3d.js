// Nerdora Terra Core 3.2 — on-demand 3D landmarks.
// Uses lightweight procedural models at very close zoom and can later accept GLB assets.

import * as THREE from 'three';
import {LANDMARKS_3D} from '../atlas/atlas-data.js';

const EARTH_RADIUS=6371008.8;
const LAYER_ID='nerdora-landmark-3d';
const ALTITUDE={giza:24,eiffel:35,cristo:705,taj:170,stonehenge:100,moai:80};

function km(a,b){
  const R=6371,r=d=>d*Math.PI/180;
  const dLat=r(b[1]-a[1]),dLon=r(b[0]-a[0]);
  const x=Math.sin(dLat/2)**2+Math.cos(r(a[1]))*Math.cos(r(b[1]))*Math.sin(dLon/2)**2;
  return 2*R*Math.asin(Math.min(1,Math.sqrt(x)));
}

function mat(color,opts={}){return new THREE.MeshStandardMaterial({color,roughness:.72,metalness:.08,...opts})}
function add(group,geometry,material,pos=[0,0,0],rot=[0,0,0],scale=[1,1,1]){
  const m=new THREE.Mesh(geometry,material);m.position.set(...pos);m.rotation.set(...rot);m.scale.set(...scale);group.add(m);return m;
}

function buildGiza(){
  const g=new THREE.Group(),sand=mat(0xd4b47b),dark=mat(0xa98a5a);
  add(g,new THREE.ConeGeometry(162,146,4),sand,[0,73,0],[0,Math.PI/4,0]);
  add(g,new THREE.ConeGeometry(151,136,4),sand,[330,68,110],[0,Math.PI/4,0]);
  add(g,new THREE.ConeGeometry(76,65,4),dark,[-250,32,-150],[0,Math.PI/4,0]);
  return g;
}
function buildEiffel(){
  const g=new THREE.Group(),bronze=mat(0x9b7653,{wireframe:true,metalness:.35,roughness:.4});
  add(g,new THREE.ConeGeometry(62,300,4,7,true),bronze,[0,150,0],[0,Math.PI/4,0]);
  add(g,new THREE.CylinderGeometry(2.6,5,28,8),mat(0xb08b68,{metalness:.3}),[0,314,0]);
  add(g,new THREE.BoxGeometry(68,3,68),mat(0x8a694b),[0,60,0]);
  add(g,new THREE.BoxGeometry(35,3,35),mat(0x8a694b),[0,116,0]);
  return g;
}
function buildCristo(){
  const g=new THREE.Group(),stone=mat(0xe3e6df);
  add(g,new THREE.BoxGeometry(10,9,10),mat(0x9da6a2),[0,4.5,0]);
  add(g,new THREE.BoxGeometry(5,22,5),stone,[0,20,0]);
  add(g,new THREE.BoxGeometry(29,3.6,4),stone,[0,25,0]);
  add(g,new THREE.SphereGeometry(2.4,16,10),stone,[0,33,0]);
  return g;
}
function buildTaj(){
  const g=new THREE.Group(),white=mat(0xf2f0e7),shadow=mat(0xded8c8);
  add(g,new THREE.BoxGeometry(102,8,102),shadow,[0,4,0]);
  add(g,new THREE.BoxGeometry(58,45,58),white,[0,30,0]);
  add(g,new THREE.SphereGeometry(20,24,16,0,Math.PI*2,0,Math.PI/2),white,[0,52,0],[Math.PI,0,0],[1,.82,1]);
  add(g,new THREE.CylinderGeometry(1.8,1.8,18,10),white,[0,72,0]);
  for(const [x,z] of [[46,46],[-46,46],[46,-46],[-46,-46]]){
    add(g,new THREE.CylinderGeometry(3,4,52,12),white,[x,30,z]);
    add(g,new THREE.SphereGeometry(4,12,8,0,Math.PI*2,0,Math.PI/2),white,[x,57,z],[Math.PI,0,0]);
  }
  return g;
}
function buildStonehenge(){
  const g=new THREE.Group(),stone=mat(0x9d9685);
  const count=16,r=15;
  for(let i=0;i<count;i++){
    const a=i/count*Math.PI*2,x=Math.cos(a)*r,z=Math.sin(a)*r;
    add(g,new THREE.BoxGeometry(2.2,7,2.4),stone,[x,3.5,z],[0,-a,0]);
    if(i%2===0){
      const a2=(i+1)/count*Math.PI*2,x2=Math.cos(a2)*r,z2=Math.sin(a2)*r;
      const mx=(x+x2)/2,mz=(z+z2)/2,len=Math.hypot(x2-x,z2-z);
      add(g,new THREE.BoxGeometry(len+1,1.4,2.5),stone,[mx,7.4,mz],[0,-Math.atan2(z2-z,x2-x),0]);
    }
  }
  return g;
}
function buildMoai(){
  const g=new THREE.Group(),rock=mat(0x777b72),dark=mat(0x50554f);
  add(g,new THREE.CapsuleGeometry(3.7,8,5,10),rock,[0,7,0],[0,0,0],[1,.9,.8]);
  add(g,new THREE.BoxGeometry(6.2,7,4.6),rock,[0,14,0],[0,0,0],[1,.95,.78]);
  add(g,new THREE.BoxGeometry(5.4,1.1,5),dark,[0,16.2,-1.5]);
  return g;
}
function build(kind){
  if(kind==='giza')return buildGiza();
  if(kind==='eiffel')return buildEiffel();
  if(kind==='cristo')return buildCristo();
  if(kind==='taj')return buildTaj();
  if(kind==='stonehenge')return buildStonehenge();
  if(kind==='moai')return buildMoai();
  return new THREE.Group();
}

function mercatorMatrix(maplibregl,location,altitude){
  const merc=maplibregl.MercatorCoordinate.fromLngLat(location,altitude),s=merc.meterInMercatorCoordinateUnits();
  return new THREE.Matrix4().makeTranslation(merc.x,merc.y,merc.z).multiply(new THREE.Matrix4().makeRotationZ(Math.PI)).multiply(new THREE.Matrix4().makeRotationX(Math.PI/2)).multiply(new THREE.Matrix4().makeScale(-s,s,s));
}
function globeMatrix(location,altitude){
  const [lng,lat]=location,s=1/EARTH_RADIUS;
  return new THREE.Matrix4().makeRotationY(lng/180*Math.PI).multiply(new THREE.Matrix4().makeRotationX(-lat/180*Math.PI)).multiply(new THREE.Matrix4().makeTranslation(0,0,1+altitude/EARTH_RADIUS)).multiply(new THREE.Matrix4().makeRotationX(Math.PI/2)).multiply(new THREE.Matrix4().makeScale(s,s,s));
}

export class Landmarks3DManager{
  constructor(map,maplibregl){this.map=map;this.maplibregl=maplibregl;this.active=null;this.layer=null;this.enabled=true;this._update=this.update.bind(this)}
  start(){
    if(!this.map)return;
    this.map.on('moveend',this._update);this.map.on('zoomend',this._update);this.map.on('style.load',()=>setTimeout(this._update,0));
    setTimeout(this._update,800);
  }
  nearest(){
    if(!this.map||this.map.getZoom()<15.2)return null;
    const c=this.map.getCenter(),center=[c.lng,c.lat];
    let best=null;
    for(const l of LANDMARKS_3D){const d=km(center,l.center);if(d<=12&&(!best||d<best.d))best={place:l,d}}
    return best?.place||null;
  }
  update(){
    if(!this.enabled)return this.remove();
    const next=this.nearest();
    if(next?.id===this.active?.id)return;
    this.active=next;
    this.removeLayerOnly();
    if(next)this.add(next);
  }
  removeLayerOnly(){try{if(this.map.getLayer(LAYER_ID))this.map.removeLayer(LAYER_ID)}catch{} this.layer=null}
  remove(){this.active=null;this.removeLayerOnly()}
  add(place){
    if(!this.map?.isStyleLoaded())return;
    const manager=this;
    const layer={
      id:LAYER_ID,type:'custom',renderingMode:'3d',
      onAdd(map,gl){
        this.map=map;this.camera=new THREE.Camera();this.scene=new THREE.Scene();
        const amb=new THREE.AmbientLight(0xffffff,2.1);this.scene.add(amb);
        const sun=new THREE.DirectionalLight(0xffffff,3.2);sun.position.set(20,-40,90).normalize();this.scene.add(sun);
        const fill=new THREE.DirectionalLight(0x8bdcff,1.0);fill.position.set(-60,40,45).normalize();this.scene.add(fill);
        this.scene.add(build(place.model3d.kind));
        this.renderer=new THREE.WebGLRenderer({canvas:map.getCanvas(),context:gl,antialias:true});this.renderer.autoClear=false;
      },
      render(gl,args){
        if(!manager.active||manager.active.id!==place.id)return;
        const globe=args.defaultProjectionData?.projectionTransition>0;
        const altitude=ALTITUDE[place.model3d.kind]||0;
        const local=globe?globeMatrix(place.center,altitude):mercatorMatrix(manager.maplibregl,place.center,altitude);
        const main=new THREE.Matrix4().fromArray(args.defaultProjectionData.mainMatrix);
        this.camera.projectionMatrix=main.multiply(local);
        this.renderer.resetState();this.renderer.render(this.scene,this.camera);this.map.triggerRepaint();
      },
      onRemove(){try{this.renderer?.dispose()}catch{}}
    };
    try{this.map.addLayer(layer);this.layer=layer;window.dispatchEvent(new CustomEvent('nerdora:landmark-3d',{detail:{place}}))}catch(e){console.warn('Nerdora landmark 3D:',e)}
  }
  setEnabled(v){this.enabled=!!v;this.update();return this.enabled}
}
