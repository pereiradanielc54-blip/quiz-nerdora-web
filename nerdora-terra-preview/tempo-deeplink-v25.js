(()=>{
  const params=new URLSearchParams(location.search);
  if(!params.has('age'))return;
  const raw=Number(String(params.get('age')).replace(',','.'));
  if(!Number.isFinite(raw))return;
  const age=Math.max(0,Math.min(1000,raw));

  function apply(){
    const input=document.querySelector('#ageInput');
    const slider=document.querySelector('#timeSlider');
    if(!input||!slider)return false;
    input.value=String(age);
    slider.value=String(age);
    input.dispatchEvent(new Event('change',{bubbles:true}));
    return true;
  }

  window.addEventListener('load',()=>{
    let tries=0;
    const timer=setInterval(()=>{
      tries++;
      if(apply()||tries>25)clearInterval(timer);
    },120);
  },{once:true});
})();
