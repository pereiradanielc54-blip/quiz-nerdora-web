module.exports=async function handler(req,res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  res.setHeader('Cache-Control','no-store');
  if(req.method==='OPTIONS')return res.status(204).end();
  if(req.method!=='POST')return res.status(405).json({error:'method_not_allowed'});

  const token=process.env.AI_GATEWAY_API_KEY||process.env.VERCEL_OIDC_TOKEN;
  if(!token)return res.status(503).json({error:'ai_gateway_not_configured'});

  const body=typeof req.body==='string'?(()=>{try{return JSON.parse(req.body)}catch{return {}}})():req.body||{};
  const question=String(body.question||'').trim().slice(0,900);
  if(!question)return res.status(400).json({error:'question_required'});
  const context=body.context&&typeof body.context==='object'?body.context:{};

  const tools=[
    {type:'function',function:{name:'fly_to',description:'Mover o globo para um lugar geográfico ou monumento.',parameters:{type:'object',properties:{query:{type:'string'}},required:['query'],additionalProperties:false}}},
    {type:'function',function:{name:'toggle_divisions',description:'Ativar ou desativar divisões geográficas e nomes.',parameters:{type:'object',properties:{enabled:{type:'boolean'}},required:['enabled'],additionalProperties:false}}},
    {type:'function',function:{name:'open_discover',description:'Abrir o catálogo Descobrir/Atlas Nerdora.',parameters:{type:'object',properties:{query:{type:'string'}},additionalProperties:false}}},
    {type:'function',function:{name:'set_time',description:'Abrir a máquina do tempo em uma idade geológica, em milhões de anos atrás.',parameters:{type:'object',properties:{ma:{type:'number',minimum:0,maximum:1000}},required:['ma'],additionalProperties:false}}},
    {type:'function',function:{name:'open_live',description:'Abrir o painel Terra ao Vivo.',parameters:{type:'object',properties:{feed:{type:'string',enum:['earthquakes','fires','weather','satellites','all']}},additionalProperties:false}}}
  ];

  const system=`Você é a Nerdora Terra IA, assistente geográfico educacional do aplicativo Nerdora Terra. Responda em português do Brasil, de forma curta, clara e factual. Você conhece o estado atual do globo fornecido no contexto. Quando o pedido do usuário implicar uma ação no aplicativo, use uma das ferramentas disponíveis. Não invente que uma ação foi executada se não usar ferramenta. Não invente dados em tempo real. Para terremotos, incêndios, clima severo ou satélites, prefira abrir o painel Ao Vivo. Para viagens geológicas, use set_time. Para lugares, use fly_to. Se a pergunta for apenas explicativa, responda normalmente em no máximo 5 frases.`;

  const payload={
    model:'openai/gpt-5.6-sol',
    messages:[
      {role:'system',content:system},
      {role:'user',content:`Contexto atual do mapa: ${JSON.stringify(context).slice(0,2200)}\n\nPedido: ${question}`}
    ],
    tools,
    tool_choice:'auto',
    temperature:0.2,
    max_tokens:700
  };

  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),22000);
  try{
    const upstream=await fetch('https://ai-gateway.vercel.sh/v1/chat/completions',{
      method:'POST',signal:controller.signal,
      headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},
      body:JSON.stringify(payload)
    });
    const raw=await upstream.text();
    let data;try{data=JSON.parse(raw)}catch{data=null}
    if(!upstream.ok)return res.status(upstream.status).json({error:'ai_gateway_error',detail:data?.error?.message||'gateway_failed'});
    const message=data?.choices?.[0]?.message||{};
    const actions=(message.tool_calls||[]).filter(t=>t?.type==='function').slice(0,4).map(t=>{
      let args={};try{args=JSON.parse(t.function?.arguments||'{}')}catch{}
      return {type:t.function?.name,args};
    });
    return res.status(200).json({answer:String(message.content||'').trim(),actions,model:'gateway'});
  }catch(error){
    return res.status(error?.name==='AbortError'?504:502).json({error:'ai_unavailable'});
  }finally{clearTimeout(timer)}
};
