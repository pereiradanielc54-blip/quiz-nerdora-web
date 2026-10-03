import {atlas} from '../atlas/atlas-engine.js';

const WIKI='https://pt.wikipedia.org/w/api.php';
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const stop=new Set(['o','a','os','as','um','uma','de','da','do','das','dos','e','em','no','na','nos','nas','que','qual','quais','como','onde','quando','porque','por','pra','para','me','fale','sobre','explique','mostre','mostrar','diga','quem','foi','é','era','tem','fica']);
let lastTopic='';

function words(s){return norm(s).split(/[^a-z0-9]+/).filter(x=>x&&!stop.has(x)&&x.length>1)}
function short(text,max=700){const s=String(text||'').replace(/\s+/g,' ').trim();if(s.length<=max)return s;const cut=s.slice(0,max);return cut.slice(0,Math.max(cut.lastIndexOf('. ')+1,Math.floor(max*.72))).trim()+'…'}
function explicitAtlas(text){
 const q=norm(text);
 return [...atlas.records].filter(p=>q.includes(norm(p.name))).sort((a,b)=>norm(b.name).length-norm(a.name).length)[0]||null;
}
function subjectFrom(question){
 let s=String(question||'').trim().replace(/[?!.]+$/,'');
 s=s.replace(/^(o que (?:é|foi)|quem (?:é|foi)|onde fica|onde está|fale (?:sobre|do|da|de)|me fale (?:sobre|do|da|de)|explique|qual (?:é|foi)|quais (?:são|foram)|como (?:é|foi)|quando (?:foi|é))\s+/i,'').trim();
 if(words(s).length<2&&lastTopic)return lastTopic;
 return s||lastTopic||question;
}
async function wikiSearch(query,limit=5){
 const params=new URLSearchParams({action:'query',format:'json',origin:'*',generator:'search',gsrsearch:query,gsrlimit:String(limit),gsrnamespace:'0',prop:'extracts|coordinates|description',exintro:'1',explaintext:'1',exsentences:'6',redirects:'1'});
 const r=await fetch(`${WIKI}?${params}`,{headers:{Accept:'application/json'}});
 if(!r.ok)throw new Error('wiki_'+r.status);
 const data=await r.json();
 return Object.values(data?.query?.pages||{}).sort((a,b)=>(a.index??999)-(b.index??999));
}
function titleScore(title,query){
 const t=norm(title),q=norm(query);let s=0;
 if(t===q)s+=100;if(q.includes(t)||t.includes(q))s+=60;
 const qw=words(q),tw=new Set(words(t));for(const w of qw)if(tw.has(w)||t.includes(w))s+=12;
 return s;
}
function bestPage(pages,query,{needsCoords=false}={}){
 const pool=needsCoords?pages.filter(p=>Array.isArray(p.coordinates)&&p.coordinates.length):pages;
 return pool.map(p=>({p,s:titleScore(p.title,query)})).sort((a,b)=>b.s-a.s)[0]||null;
}
function atlasAnswer(place){
 lastTopic=place.name;
 return {answer:`${place.name} fica em ${place.country}. ${place.description}`,source:'Atlas Nerdora',topic:place.name};
}

const facts=[
 {test:/maior montanha|montanha mais alta|pico mais alto/,answer:'O Monte Everest é a montanha mais alta da Terra acima do nível do mar, com cerca de 8.849 m, na fronteira entre Nepal e China.',topic:'Monte Everest'},
 {test:/maior pais|maior país/,answer:'A Rússia é o maior país do mundo em área territorial, com aproximadamente 17,1 milhões de km².',topic:'Rússia'},
 {test:/maior oceano/,answer:'O Oceano Pacífico é o maior oceano da Terra e cobre uma área maior do que todos os continentes somados.',topic:'Oceano Pacífico'},
 {test:/quantos continentes|numero de continentes|número de continentes/,answer:'No modelo mais usado internacionalmente são considerados 7 continentes: África, Antártida, Ásia, Europa, América do Norte, América do Sul e Oceania. No ensino brasileiro também é comum tratar a América como um único continente, totalizando 6.',topic:'Continente'}
];

export async function answerFree(question){
 const q=norm(question);
 const place=explicitAtlas(question);
 if(place)return atlasAnswer(place);
 for(const f of facts){if(f.test.test(q)){lastTopic=f.topic;return {answer:f.answer,source:'Base Nerdora',topic:f.topic}}}
 const subject=subjectFrom(question);
 const pages=await wikiSearch(subject,5);
 const best=bestPage(pages,subject);
 if(!best?.p?.extract)throw new Error('no_knowledge');
 lastTopic=best.p.title;
 const desc=best.p.description?` ${best.p.description}.`:'';
 return {answer:`${best.p.title}.${desc} ${short(best.p.extract,760)}`.replace(/\.\s*\./g,'.'),source:'Wikipédia',topic:best.p.title};
}

export async function resolveFreePlace(query){
 const direct=explicitAtlas(query)||atlas.records.find(p=>norm(p.name)===norm(query));
 if(direct)return {name:direct.name,center:direct.center,zoom:direct.zoom||7,description:direct.description,source:'Atlas Nerdora'};
 const pages=await wikiSearch(query,7);
 const best=bestPage(pages,query,{needsCoords:true});
 if(!best||best.s<24)return null;
 const c=best.p.coordinates?.[0];if(!c)return null;
 return {name:best.p.title,center:[Number(c.lon),Number(c.lat)],zoom:10,description:short(best.p.extract||best.p.description||'',360),source:'Wikipédia'};
}

export function getLastTopic(){return lastTopic}
