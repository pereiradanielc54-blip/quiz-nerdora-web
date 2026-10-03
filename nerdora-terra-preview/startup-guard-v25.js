(()=>{
  let settled=false;
  const loading=()=>document.querySelector('#loading');
  const hide=()=>{const el=loading();if(el){el.classList.add('hide');settled=true}};
  const map=()=>window.__NERDORA_TERRA_CORE__?.map||null;

  function attach(m){
    if(!m)return;
    try{
      if(m.loaded?.())hide();
      else m.once?.('load',()=>setTimeout(hide,250));
    }catch{}
  }

  window.addEventListener('nerdora:terra-core-ready',e=>attach(e.detail?.map),{once:true});
  window.addEventListener('load',()=>{
    attach(map());

    setTimeout(()=>{
      if(settled||loading()?.classList.contains('hide'))return;
      const m=map();
      try{
        if(m?.isStyleLoaded?.()){
          m.resize?.();
          hide();
          return;
        }
      }catch{}
      const el=loading();
      if(el)el.textContent='Finalizando o globo 3D…';
    },8000);

    setTimeout(()=>{
      if(settled||loading()?.classList.contains('hide'))return;
      const el=loading();
      if(!el)return;
      const m=map();
      try{
        if(m?.getCanvas?.()){
          m.resize?.();
          hide();
          return;
        }
      }catch{}
      el.textContent='Toque para tentar carregar novamente';
      el.setAttribute('role','button');
      el.style.cursor='pointer';
      el.onclick=()=>location.reload();
    },15000);
  },{once:true});
})();
