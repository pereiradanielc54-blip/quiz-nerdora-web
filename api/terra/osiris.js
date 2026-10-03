const ALLOWED=new Set(['earthquakes','fires','weather','satellites','region-dossier']);

module.exports=async function handler(req,res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,HEAD,OPTIONS');
  if(req.method==='OPTIONS')return res.status(204).end();
  if(req.method!=='GET'&&req.method!=='HEAD')return res.status(405).json({error:'method_not_allowed'});

  const incoming=new URL(req.url,'https://nerdora.local');
  const feed=incoming.searchParams.get('feed')||'';
  if(!ALLOWED.has(feed))return res.status(400).json({error:'feed_not_allowed'});

  const target=new URL('https://osirisai.live/api/'+feed);
  for(const [key,value] of incoming.searchParams.entries()){
    if(key!=='feed')target.searchParams.append(key,value);
  }

  const ttl=feed==='weather'||feed==='satellites'?300:feed==='region-dossier'?1800:600;
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),12000);
  try{
    const upstream=await fetch(target,{signal:controller.signal,headers:{Accept:'application/json'}});
    const text=await upstream.text();
    res.status(upstream.status);
    res.setHeader('Content-Type',upstream.headers.get('content-type')||'application/json; charset=utf-8');
    res.setHeader('Cache-Control',`public, s-maxage=${ttl}, stale-while-revalidate=${Math.max(ttl,3600)}`);
    res.setHeader('X-Nerdora-Terra-Cache','edge');
    if(req.method==='HEAD')return res.end();
    return res.send(text);
  }catch(error){
    res.setHeader('Cache-Control','no-store');
    return res.status(error?.name==='AbortError'?504:502).json({error:'upstream_unavailable'});
  }finally{
    clearTimeout(timer);
  }
};
