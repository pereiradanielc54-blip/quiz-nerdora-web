(()=>{
  const AGES=[0,2.58,23,66,100,145,201.4,251.9,300,372,419,539,635,720,1000];
  let running=false;
  let stopRequested=false;
  let runToken=0;

  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  const fmt=ma=>ma===0?'Hoje':(ma<10?ma.toLocaleString('pt-BR',{maximumFractionDigits:2}):Math.round(ma).toLocaleString('pt-BR'))+' Ma';

  async function waitForReconstruction(token){
    const loading=document.querySelector('#timeLoading');
    if(!loading)return true;

    let started=false;
    const start=Date.now();
    while(Date.now()-start<28000){
      if(token!==runToken||stopRequested)return false;
      const hidden=loading.classList.contains('hide');
      const text=(loading.textContent||'').toLowerCase();

      if(!hidden)started=true;
      if(started&&hidden)return true;
      if(text.includes('indisponível')||text.includes('não foi possível'))return false;

      // A resposta pode vir do cache tão rápido que o estado visível quase não aparece.
      if(!started&&Date.now()-start>1200&&hidden)return true;
      await sleep(120);
    }
    return false;
  }

  function stopJourney(btn,label='▶ Viagem'){
    stopRequested=true;
    running=false;
    runToken++;
    btn.classList.remove('active');
    btn.textContent=label;
  }

  function install(){
    const btn=document.querySelector('#playBtn');
    const ageInput=document.querySelector('#ageInput');
    const slider=document.querySelector('#timeSlider');
    if(!btn||!ageInput)return;

    // Substitui apenas o comportamento antigo do botão Viagem.
    btn.onclick=async()=>{
      if(running){
        stopJourney(btn);
        return;
      }

      stopRequested=false;
      running=true;
      const token=++runToken;
      btn.classList.add('active');

      let current=Number(ageInput.value)||0;
      let nextIndex=AGES.findIndex(a=>a>current+0.05);
      if(nextIndex<0){
        nextIndex=0;
        current=0;
      }

      for(let i=nextIndex;i<AGES.length;i++){
        if(stopRequested||token!==runToken)break;
        const age=AGES[i];

        btn.textContent='Ⅱ Pausar • '+fmt(age);
        ageInput.value=String(age);
        ageInput.dispatchEvent(new Event('change',{bubbles:true}));

        // A próxima época só começa quando o GPlates terminar esta reconstrução.
        const loaded=await waitForReconstruction(token);
        if(stopRequested||token!==runToken)break;
        if(!loaded){
          running=false;
          btn.classList.remove('active');
          btn.textContent='▶ Continuar viagem';
          return;
        }

        // Mantém cada mapa pronto na tela por tempo suficiente para ser percebido.
        await sleep(age===0?1200:2200);
      }

      if(token===runToken&&!stopRequested){
        running=false;
        btn.classList.remove('active');
        btn.textContent='▶ Viagem';
      }
    };

    // Se o usuário mexer manualmente na idade, a viagem automática para.
    const manualStop=e=>{
      if(running&&e.isTrusted)stopJourney(btn);
    };
    slider?.addEventListener('pointerdown',manualStop,{passive:true});
    ageInput.addEventListener('focus',manualStop,{passive:true});
  }

  // Executa depois que o módulo principal do Tempo terminou de ligar seus handlers.
  window.addEventListener('load',()=>setTimeout(install,80),{once:true});
})();
