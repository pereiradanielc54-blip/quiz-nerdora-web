(()=>{
  const originalFetch=window.fetch.bind(window);
  const COAST='/reconstruct/coastlines/';
  const HOST='gws.gplates.org';
  const AGES=[0,2.58,23,66,100,145,201.4,251.9,300,372,419,539,635,720,1000];
  const cache=new Map();
  const MAX=8;
  let hits=0,misses=0;

  function keyFrom(raw){
    try{
      const u=new URL(typeof raw==='string'||raw instanceof URL?String(raw):raw?.url,location.href);
      if(u.hostname!==HOST||u.pathname!==COAST)return null;
      const time=Number(u.searchParams.get('time')||0);
      const model=u.searchParams.get('model')||'CAO2024';
      return `${time}|${model}|${u.searchParams.get('wrap')||''}`;
    }catch{return null}
  }
  function responseFrom(text,status=200,headers={}){
    const h=new Headers(headers);if(!h.has('content-type'))h.set('content-type','application/json');
    h.set('x-nerdora-time-cache','memory');
    return new Response(text,{status,headers:h});
  }
  function trim(){while(cache.size>MAX)cache.delete(cache.keys().next().value)}
  function storeFetch(input,init,key){
    const promise=originalFetch(input,init).then(async res=>{
      if(!res.ok)throw new Error('HTTP '+res.status);
      return {text:await res.clone().text(),status:res.status,headers:[...res.headers.entries()]};
    }).catch(e=>{cache.delete(key);throw e});
    cache.set(key,promise);trim();return promise;
  }

  window.fetch=async function(input,init){
    const key=keyFrom(input);
    if(!key)return originalFetch(input,init);
    let p=cache.get(key);
    if(p)hits++;else{misses++;p=storeFetch(input,init,key)}
    const v=await p;
    return responseFrom(v.text,v.status,v.headers);
  };

  function url(age){return `https://${HOST}${COAST}?time=${age}&model=CAO2024&wrap=true`}
  function prefetch(age){
    const u=url(age),key=keyFrom(u);if(!key||cache.has(key))return;
    storeFetch(u,{mode:'cors',cache:'force-cache',headers:{Accept:'application/json'}},key).catch(()=>{});
  }
  function neighbors(age){
    let idx=0,best=Infinity;
    AGES.forEach((a,i)=>{const d=Math.abs(a-age);if(d<best){best=d;idx=i}});
    return [AGES[idx-1],AGES[idx+1],AGES[idx+2]].filter(v=>v!==undefined);
  }
  function schedule(age){
    const run=()=>neighbors(age).forEach(prefetch);
    if('requestIdleCallback'in window)requestIdleCallback(run,{timeout:1800});else setTimeout(run,500);
  }
  function install(){
    const input=document.querySelector('#ageInput');
    const slider=document.querySelector('#timeSlider');
    const changed=()=>schedule(Number(input?.value||slider?.value||0));
    input?.addEventListener('change',changed);slider?.addEventListener('change',changed);
    [0,2.58,23].forEach(prefetch);
    const q=new URLSearchParams(location.search).get('age');
    if(q!==null&&Number.isFinite(Number(q))){
      setTimeout(()=>{if(input){input.value=String(Math.max(0,Math.min(1000,Number(q))));input.dispatchEvent(new Event('change',{bubbles:true}))}},420);
    }
  }
  window.NerdoraTimePrefetch={prefetch,stats:()=>({entries:cache.size,hits,misses})};
  if(document.readyState==='complete')setTimeout(install,80);else window.addEventListener('load',()=>setTimeout(install,80),{once:true});
})();
