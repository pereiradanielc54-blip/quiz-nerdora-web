import {ATLAS_PLACES} from './atlas-data.js';

const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const tokenize=s=>norm(s).split(/[^a-z0-9]+/).filter(Boolean);

function haversine(a,b){
  const R=6371,toRad=d=>d*Math.PI/180;
  const dLat=toRad(b[1]-a[1]),dLng=toRad(b[0]-a[0]);
  const x=Math.sin(dLat/2)**2+Math.cos(toRad(a[1]))*Math.cos(toRad(b[1]))*Math.sin(dLng/2)**2;
  return 2*R*Math.asin(Math.min(1,Math.sqrt(x)));
}

function score(place,query){
  const q=norm(query);
  if(!q)return 0;
  const name=norm(place.name),country=norm(place.country),category=norm(place.category),subcategory=norm(place.subcategory);
  const tags=(place.tags||[]).map(norm);
  const desc=norm(place.description);
  let s=0;
  if(name===q)s+=140;
  if(name.startsWith(q))s+=80;
  if(name.includes(q))s+=55;
  if(country.includes(q))s+=24;
  if(category.includes(q)||subcategory.includes(q))s+=28;
  if(tags.some(t=>t===q))s+=48;
  if(tags.some(t=>t.includes(q)||q.includes(t)))s+=30;
  const tokens=tokenize(q);
  for(const t of tokens){
    if(name.includes(t))s+=18;
    if(tags.some(x=>x.includes(t)))s+=12;
    if(country.includes(t))s+=8;
    if(desc.includes(t))s+=4;
  }
  return s;
}

export class NerdoraAtlas{
  constructor(records=ATLAS_PLACES){
    this.records=records;
    this.byId=new Map(records.map(r=>[r.id,r]));
  }
  get(id){return this.byId.get(id)||null}
  search(query,{limit=20,category}={}){
    const pool=category?this.records.filter(r=>norm(r.category)===norm(category)):this.records;
    return pool.map(place=>({place,score:score(place,query)})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score||a.place.name.localeCompare(b.place.name,'pt-BR')).slice(0,limit).map(x=>x.place);
  }
  nearest(center,{limit=8,maxKm=Infinity,category}={}){
    const pool=category?this.records.filter(r=>norm(r.category)===norm(category)):this.records;
    return pool.map(place=>({place,distanceKm:haversine(center,place.center)})).filter(x=>x.distanceKm<=maxKm).sort((a,b)=>a.distanceKm-b.distanceKm).slice(0,limit);
  }
  categories(){
    const map=new Map();
    for(const p of this.records){
      if(!map.has(p.category))map.set(p.category,new Set());
      map.get(p.category).add(p.subcategory);
    }
    return [...map].map(([name,subs])=>({name,subcategories:[...subs]}));
  }
}

export const atlas=new NerdoraAtlas();
if(typeof window!=='undefined')window.NerdoraAtlas=atlas;
