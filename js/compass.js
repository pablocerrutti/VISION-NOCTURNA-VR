window.LW=window.LW||{};
LW.compass=(()=>{
 const HUD_ID='compassHUD',TICKS_ID='compassTicks',READOUT_ID='compassReadout';
 const PX_PER_DEG=5.0;
 let heading=null,displayHeading=null,listening=false;
 const normalize=d=>((d%360)+360)%360;
 const shortest=(target,current)=>((target-current+540)%360)-180;
 const screenAngle=()=>{
  const a=screen.orientation&&Number.isFinite(screen.orientation.angle)?screen.orientation.angle:(Number.isFinite(window.orientation)?window.orientation:0);
  return normalize(a);
 };
 const label=d=>{const n=Math.round(normalize(d))%360;if(n===0)return'N';if(n===45)return'NE';if(n===90)return'E';if(n===135)return'SE';if(n===180)return'S';if(n===225)return'SO';if(n===270)return'O';if(n===315)return'NO';return''};
 function buildTicks(el){
  if(!el)return;
  el.innerHTML='';
  for(let d=-1080;d<=1080;d+=1){
   const a=normalize(d),tick=document.createElement('div');
   const deg=Math.round(a)%360;
   tick.className='compass-tick'+(deg%10===0?' major':'')+(deg%45===0?' cardinal':'')+(deg%5===0?' five':'');
   tick.style.left=d*PX_PER_DEG+'px';
   if(deg%45===0||deg%10===0){const s=document.createElement('span');s.textContent=label(deg)||String(deg).padStart(3,'0')+'°';tick.appendChild(s)}
   el.appendChild(tick);
  }
 }
 function renderOne(h,root){
  const el=root.querySelector('.compass-ticks');buildTicks(el);
  if(el)el.style.transform=`translateX(${-h*PX_PER_DEG}px)`;
  const r=root.querySelector('.compass-readout');
  if(r){const deg=Math.round(normalize(h));r.textContent=`${label(deg)} ${String(deg).padStart(3,'0')}°`.trim()}
 }
 function render(h){
  const root=document.getElementById(HUD_ID);if(root)renderOne(h,root);
  document.querySelectorAll('.vr-hud').forEach(root=>renderOne(h,root));
 }
 function handle(e){
  let h=null;
  if(typeof e.webkitCompassHeading==='number'&&isFinite(e.webkitCompassHeading)) h=normalize(e.webkitCompassHeading);
  else if(e.absolute&&typeof e.alpha==='number'&&isFinite(e.alpha)) h=normalize(360-e.alpha+screenAngle());
  if(h===null)return;
  heading=h;
  if(displayHeading===null)displayHeading=h;
  else displayHeading=normalize(displayHeading+shortest(h,displayHeading)*.82);
  render(displayHeading);
 }
 async function start(){
  buildTicks(document.getElementById(TICKS_ID));
  if(listening)return true;
  try{
   if(typeof DeviceOrientationEvent==='undefined'){document.getElementById(READOUT_ID).textContent='BRÚJULA: NO DISP.';return false}
   if(typeof DeviceOrientationEvent.requestPermission==='function'){
    const p=await DeviceOrientationEvent.requestPermission();
    if(p!=='granted'){document.getElementById(READOUT_ID).textContent='BRÚJULA: SIN PERMISO';return false}
   }
   window.addEventListener('deviceorientationabsolute',handle,true);
   window.addEventListener('deviceorientation',handle,true);
   listening=true;return true;
  }catch(err){console.warn('Compass permission:',err);document.getElementById(READOUT_ID).textContent='BRÚJULA: SIN SEÑAL';return false}
 }
 function stop(){if(!listening)return;window.removeEventListener('deviceorientationabsolute',handle,true);window.removeEventListener('deviceorientation',handle,true);listening=false}
 function syncVR(){if(displayHeading!==null)document.querySelectorAll('.vr-hud').forEach(root=>renderOne(displayHeading,root))}
 return{start,stop,syncVR,get heading(){return heading}};
})();
