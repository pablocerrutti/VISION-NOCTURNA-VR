window.LW=window.LW||{};
LW.measureGesture=(()=>{
  let listening=false,last={alpha:null,elevation:null},lastTrigger=0;
  const TRIGGER_DEG=1,COOLDOWN_MS=900;
  const finite=v=>Number.isFinite(v);
  const wrap=(a,b)=>{let d=a-b;while(d>180)d-=360;while(d<-180)d+=360;return d};
  function landscapeElevation(e){
    const a=e.accelerationIncludingGravity;if(!a)return null;
    const x=Number(a.x)||0,y=Number(a.y)||0,z=Number(a.z);
    if(!finite(z))return null;
    const mag=Math.hypot(x,y,z);if(mag<1)return null;
    // Landscape: use the gravity component perpendicular to the display plane.
    return Math.asin(Math.max(-1,Math.min(1,z/mag)))*180/Math.PI;
  }
  function handleOrientation(e){
    const now=performance.now(),a=Number(e.alpha);if(!finite(a))return;
    if(now-lastTrigger<COOLDOWN_MS){last.alpha=a;return}
    const prev=last.alpha;
    last.alpha=a;
    if(prev!==null&&Math.abs(wrap(a,prev))>=TRIGGER_DEG){
      lastTrigger=now;
      if(LW.measureGesture._onShake)LW.measureGesture._onShake('horizontal');
    }
  }
  function handleMotion(e){
    const now=performance.now(),elev=landscapeElevation(e);if(!finite(elev))return;
    if(now-lastTrigger<COOLDOWN_MS){last.elevation=elev;return}
    const prev=last.elevation;
    last.elevation=elev;
    if(prev!==null&&Math.abs(elev-prev)>=TRIGGER_DEG){
      lastTrigger=now;
      if(LW.measureGesture._onShake)LW.measureGesture._onShake('vertical');
    }
  }
  function start(onShake){
    if(listening)return true;listening=true;LW.measureGesture._onShake=onShake;
    last={alpha:null,elevation:null};lastTrigger=performance.now();
    window.addEventListener('deviceorientationabsolute',handleOrientation,true);
    window.addEventListener('deviceorientation',handleOrientation,true);
    window.addEventListener('devicemotion',handleMotion,true);return true;
  }
  function stop(){if(!listening)return;listening=false;window.removeEventListener('deviceorientationabsolute',handleOrientation,true);window.removeEventListener('deviceorientation',handleOrientation,true);window.removeEventListener('devicemotion',handleMotion,true)}
  async function requestPermission(){try{const p=[];if(typeof DeviceMotionEvent!=='undefined'&&typeof DeviceMotionEvent.requestPermission==='function')p.push(DeviceMotionEvent.requestPermission());if(typeof DeviceOrientationEvent!=='undefined'&&typeof DeviceOrientationEvent.requestPermission==='function')p.push(DeviceOrientationEvent.requestPermission());if(p.length){const r=await Promise.all(p);return r.every(v=>v==='granted')}return true}catch(e){console.warn('Sensor permission:',e);return false}}
  function pitchDegrees(){return finite(last.elevation)?Math.abs(last.elevation):null}
  function orientation(){return screen.orientation?.angle??(innerWidth>innerHeight?90:0)}
  return{start,stop,requestPermission,pitchDegrees,orientation};
})();
