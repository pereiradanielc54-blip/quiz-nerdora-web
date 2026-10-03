module.exports=async function handler(req,res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,HEAD,OPTIONS');
  if(req.method==='OPTIONS')return res.status(204).end();
  if(req.method!=='GET'&&req.method!=='HEAD')return res.status(405).json({error:'method_not_allowed'});

  const incoming=new URL(req.url,'https://nerdora.local');
  const target=new URL('https://data.inpe.br/bdc/stac/v1/search');
  for(const [key,value] of incoming.searchParams.entries())target.searchParams.append(key,value);

  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),12000);
  try{
    const upstream=await fetch(target,{signal:controller.signal,headers:{Accept:'application/geo+json,application/json'}});
    const text=await upstream.text();
    res.status(upstream.status);
    res.setHeader('Content-Type',upstream.headers.get('content-type')||'application/json; charset=utf-8');
    res.setHeader('Cache-Control','public, s-maxage=21600, stale-while-revalidate=86400');
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
