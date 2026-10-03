module.exports=async function handler(req,res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  res.setHeader('Cache-Control','no-store');
  if(req.method==='OPTIONS')return res.status(204).end();
  if(req.method!=='POST')return res.status(405).json({error:'method_not_allowed'});

  const token=process.env.AI_GATEWAY_API_KEY||process.env.VERCEL_OIDC_TOKEN;
  if(!token)return res.status(503).json({error:'ai_gateway_not_configured',mode:'basic'});

  const body=typeof req.body==='string'?(()=>{try{return JSON.parse(req.body)}catch{return {}}})():req.body||{};
  const question=String(body.question||'').trim().slice(0,900);
  if(!question)return res.status(400).json({error:'question_required'});
  const context=body.context&&typeof body.context==='object'?body.context:{};
  const history=Array.isArray(body.history)?body.history.slice(-8).filter(x=>x&&['user','assistant'].includes(x.role)&&typeof x.content==='string').map(x=>({role:x.role,content:x.content.slice(0,900)})):[];

  const tools=[
    {type:'function',function:{name:'fly_to',description:'Mover o globo SOMENTE quando o usuário pedir explicitamente para ir, levar, localizar ou mostrar no mapa um lugar.',parameters:{type:'object',properties:{query:{type:'string'}},required:['query'],additionalProperties:false}}},
    {type:'function',function:{name:'toggle_divisions',description:'Ativar ou desativar divisões geográficas SOMENTE quando solicitado explicitamente.',parameters:{type:'object',properties:{enabled:{type:'boolean'}},required:['enabled'],additionalProperties:false}}},
    {type:'function',function:{name:'open_discover',description:'Abrir o catálogo Descobrir/Atlas quando o usuário pedir explicitamente para abrir, pesquisar ou explorar o catálogo.',parameters:{type:'object',properties:{query:{type:'string'}},additionalProperties:false}}},
    {type:'function',function:{name:'set_time',description:'Abrir a máquina do tempo SOMENTE quando o usuário pedir para viajar/mostrar a Terra em uma idade geológica.',parameters:{type:'object',properties:{ma:{type:'number',minimum:0,maximum:1000}},required:['ma'],additionalProperties:false}}},
    {type:'function',function:{name:'open_live',description:'Abrir o painel Terra ao Vivo SOMENTE quando o usuário pedir para abrir/mostrar dados ao vivo.',parameters:{type:'object',properties:{feed:{type:'string',enum:['earthquakes','fires','weather','satellites','all']}},additionalProperties:false}}}
  ];

  const system=`Você é a Nerdora Terra IA, assistente geográfico educacional do aplicativo Nerdora Terra. Responda em português do Brasil, com clareza e precisão. Use o contexto atual do globo quando ele for útil. REGRA CRÍTICA: perguntas informativas NÃO devem mover o mapa nem abrir painéis. Só use ferramentas quando o usuário der uma ordem explícita de interface, como “me leve”, “vá para”, “localize”, “mostre no mapa”, “abra”, “ative”, “desative” ou “viaje para”. Se perguntarem “o que é X?”, “fale sobre X”, “por que X?”, “qual...?”, “como...?” ou qualquer pergunta explicativa, apenas responda. Não invente dados em tempo real. Para dados atuais, explique que o painel Ao Vivo contém as fontes e só o abra se o usuário pedir. Para lugares, nunca escolha um destino aproximado se o nome estiver ambíguo; peça esclarecimento. Em respostas factuais, seja conciso, em até 6 frases.`;

  const payload={
    model:'openai/gpt-5.6-sol',
    messages:[
      {role:'system',content:system},
      ...history,
      {role:'user',content:`Contexto atual do mapa: ${JSON.stringify(context).slice(0,2200)}\n\nPedido atual: ${question}`}
    ],
    tools,
    tool_choice:'auto',
    temperature:0.15,
    max_tokens:800
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
    const actions=(message.tool_calls||[]).filter(t=>t?.type==='function').slice(0,3).map(t=>{
      let args={};try{args=JSON.parse(t.function?.arguments||'{}')}catch{}
      return {type:t.function?.name,args};
    });
    return res.status(200).json({answer:String(message.content||'').trim(),actions,model:'gateway'});
  }catch(error){
    return res.status(error?.name==='AbortError'?504:502).json({error:'ai_unavailable'});
  }finally{clearTimeout(timer)}
};
