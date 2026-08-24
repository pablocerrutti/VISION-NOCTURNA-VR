window.LW=window.LW||{};
LW.compass=(()=>{
 const HUD_ID='compassHUD',TICKS_ID='compassTicks',READOUT_ID='compassReadout',PX_PER_DEG=5.2;
 let heading=null,listening=false,lastRaw=null;
 const normalize=d=>((d%360)+360)%360;
 const label=d=>{const n=Math.round(normalize(d));return n===0?'N':n===90?'E':n===180?'S':n===270?'O':n===45?'NE':n===135?'SE':n===225?'SO':n===315?'NO':''};
 function screenAngle(){if(screen.orientation&&typeof screen.orientation.angle==='number')return normalize(screen.orientation.angle);if(typeof window.orientation==='number')return normalize(window.orientation);return 0}
 function buildTicks(el){if(!el||el.childElementCount)return;for(let d=-1080;d<=1080;d+=5){const tick=document.createElement('div'),a=normalize(d);tick.className='compass-tick'+(a%10===0?' major':'')+(a%45===0?' cardinal':'');tick.style.left=d*PX_PER_DEG+'px';if(a%45===0||a%30===0){const s=document.createElement('span');s.textContent=a%45===0?(label(a)||String(Math.round(a)).padStart(3,'0')+'°'):String(Math.round(a)).padStart(3,'0')+'°';tick.appendChild(s)}el.appendChild(tick)}}
 function renderOne(h,root){const el=root.querySelector('.compass-ticks');buildTicks(el);if(el)el.style.transform=`translateX(${-h*PX_PER_DEG}px)`;const r=root.querySelector('.compass-readout');if(r){const deg=Math.round(normalize(h));r.textContent=`${label(deg)||''} ${String(deg).padStart(3,'0')}°`.trim()}}
 function render(h){const root=document.getElementById(HUD_ID);if(root)renderOne(h,root);document.querySelectorAll('.vr-hud').forEach(root=>renderOne(h,root))}
 function rawHeading(e){if(typeof e.webkitCompassHeading==='number'&&isFinite(e.webkitCompassHeading))return normalize(e.webkitCompassHeading);if(typeof e.alpha==='number'&&isFinite(e.alpha)&&(e.absolute||e.type==='deviceorientationabsolute'))return normalize(360-e.alpha);return null}
 function handle(e){const raw=rawHeading(e);if(raw===null)return;lastRaw=raw;heading=normalize(raw+screenAngle());render(heading)}
 function refreshOrientation(){if(lastRaw!==null){heading=normalize(lastRaw+screenAngle());render(heading)}}
 async function start(){buildTicks(document.getElementById(TICKS_ID));if(listening)return true;try{if(typeof DeviceOrientationEvent==='undefined')return false;if(typeof DeviceOrientationEvent.requestPermission==='function'){const p=await DeviceOrientationEvent.requestPermission(true);if(p!=='granted'){const r=document.getElementById(READOUT_ID);if(r)r.textContent='BRÚJULA: SIN PERMISO';return false}}window.addEventListener('deviceorientationabsolute',handle,true);window.addEventListener('deviceorientation',handle,true);window.addEventListener('orientationchange',refreshOrientation,true);if(screen.orientation)screen.orientation.addEventListener('change',refreshOrientation,true);listening=true;return true}catch(err){console.warn('Compass permission:',err);const r=document.getElementById(READOUT_ID);if(r)r.textContent='BRÚJULA: SIN SEÑAL';return false}}
 function stop(){if(!listening)return;window.removeEventListener('deviceorientationabsolute',handle,true);window.removeEventListener('deviceorientation',handle,true);window.removeEventListener('orientationchange',refreshOrientation,true);if(screen.orientation)screen.orientation.removeEventListener('change',refreshOrientation,true);listening=false}
 function syncVR(){if(heading!==null)document.querySelectorAll('.vr-hud').forEach(root=>renderOne(heading,root))}
 return{start,stop,syncVR,get heading(){return heading}};
})();
