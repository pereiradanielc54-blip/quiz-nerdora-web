const MODEL='openai/gpt-5.6-sol';
const ACTIONS=new Set(['fly_to','toggle_divisions','open_discover','set_time','open_live']);

function parseBody(req){
  if(typeof req.body==='string'){
    try{return JSON.parse(req.body)}catch{return {}}
  }
  return req.body&&typeof req.body==='object'?req.body:{};
}

function parseJsonText(text){
  const raw=String(text||'').trim();
  const clean=raw.replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,'').trim();
  try{return JSON.parse(clean)}catch{}
  const a=clean.indexOf('{'),b=clean.lastIndexOf('}');
  if(a>=0&&b>a){try{return JSON.parse(clean.slice(a,b+1))}catch{}}
  return {answer:raw,actions:[]};
}

function safeActions(actions){
  if(!Array.isArray(actions))return [];
  return actions.slice(0,3).filter(a=>a&&ACTIONS.has(a.type)&&a.args&&typeof a.args==='object').map(a=>({type:a.type,args:a.args}));
}

module.exports=async function handler(req,res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  res.setHeader('Cache-Control','no-store');
  if(req.method==='OPTIONS')return res.status(204).end();

  if(req.method==='GET'){
    try{
      const sdk=await import('ai');
      if(req.query?.probe==='terra-oidc-v1'){
        const out=await sdk.generateText({model:MODEL,prompt:'Responda somente com a palavra OK.',maxOutputTokens:8,temperature:0});
        return res.status(200).json({ok:true,mode:'vercel-ai-sdk-oidc',model:MODEL,inference:String(out.text||'').trim()});
      }
      return res.status(200).json({ok:!!sdk.generateText,mode:'vercel-ai-sdk-oidc',model:MODEL});
    }catch(error){
      return res.status(503).json({ok:false,mode:'sdk_unavailable',error:String(error?.message||error).slice(0,280)});
    }
  }
  if(req.method!=='POST')return res.status(405).json({error:'method_not_allowed'});

  const body=parseBody(req);
  const question=String(body.question||'').trim().slice(0,900);
  if(!question)return res.status(400).json({error:'question_required'});
  const context=body.context&&typeof body.context==='object'?body.context:{};
  const history=Array.isArray(body.history)?body.history.slice(-8).filter(x=>x&&['user','assistant'].includes(x.role)&&typeof x.content==='string').map(x=>({role:x.role,content:x.content.slice(0,900)})):[];

  const system=`Você é a Nerdora Terra IA, assistente geográfico educacional do aplicativo Nerdora Terra. Responda em português do Brasil com clareza, precisão e utilidade. Use o contexto atual do globo quando for relevante.

REGRA CRÍTICA DE NAVEGAÇÃO: perguntas informativas NÃO devem mover o mapa, abrir painéis nem alterar camadas. Só gere uma ação quando o usuário der uma ordem explícita de interface como “me leve”, “vá para”, “localize”, “mostre no mapa”, “abra”, “ative”, “desative” ou “viaje para”. Perguntas como “o que é X?”, “fale sobre X”, “por que X?”, “qual...?” e “como...?” devem apenas receber resposta textual.

Nunca escolha um local apenas por aproximação quando o nome estiver ambíguo. Nesse caso, faça uma pergunta curta de esclarecimento. Não invente dados ao vivo. Para terremotos, incêndios, clima severo e satélites, só abra o painel Ao Vivo se o usuário pedir explicitamente. Para idade geológica use set_time apenas em ordens explícitas.

Você deve responder SOMENTE com um JSON válido neste formato:
{"answer":"resposta em português","actions":[]}

Ações permitidas:
- {"type":"fly_to","args":{"query":"nome exato ou inequívoco do lugar"}}
- {"type":"toggle_divisions","args":{"enabled":true}}
- {"type":"open_discover","args":{"query":"termo opcional"}}
- {"type":"set_time","args":{"ma":66}}
- {"type":"open_live","args":{"feed":"earthquakes|fires|weather|satellites|all"}}

Se for apenas uma pergunta, actions deve ser []. Responda em até 7 frases, exceto quando o usuário pedir mais detalhes.`;

  const historyText=history.map(m=>`${m.role==='user'?'Usuário':'Assistente'}: ${m.content}`).join('\n');
  const prompt=`Contexto atual do mapa: ${JSON.stringify(context).slice(0,2400)}\n${historyText?`\nHistórico recente:\n${historyText}\n`:''}\nPedido atual do usuário: ${question}`;

  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),26000);
  try{
    const {generateText}=await import('ai');
    const result=await generateText({
      model:MODEL,
      system,
      prompt,
      temperature:0.15,
      maxOutputTokens:900,
      abortSignal:controller.signal
    });
    const data=parseJsonText(result.text);
    const answer=String(data?.answer||result.text||'').trim();
    const actions=safeActions(data?.actions);
    return res.status(200).json({answer,actions,model:MODEL,auth:'vercel-oidc'});
  }catch(error){
    const message=String(error?.message||error||'ai_unavailable');
    console.error('Terra AI OIDC:',message);
    const status=error?.name==='AbortError'?504:503;
    return res.status(status).json({error:'ai_unavailable',mode:'basic',detail:message.slice(0,280)});
  }finally{
    clearTimeout(timer);
  }
};
