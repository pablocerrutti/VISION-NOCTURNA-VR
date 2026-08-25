window.LW=window.LW||{};
LW.measureGesture=(()=>{
  let listening=false,last={alpha:null,elevation:null,time:0},lastTrigger=0;
  // Deliberate activation gesture: 30° avoids accidental head/camera movement.
  const TRIGGER_DEG=30.0,COOLDOWN_MS=2200,MAX_TRIGGER_INTERVAL=260;
  const finite=v=>Number.isFinite(v);
  const wrap=(a,b)=>{let d=a-b;while(d>180)d-=360;while(d<-180)d+=360;return d};
  function landscapeElevation(e){
    const a=e.accelerationIncludingGravity;if(!a)return null;
    const x=Number(a.x)||0,y=Number(a.y)||0,z=Number(a.z);
    if(!finite(z))return null;
    const mag=Math.hypot(x,y,z);if(mag<7)return null;
    return Math.asin(Math.max(-1,Math.min(1,z/mag)))*180/Math.PI;
  }
  function trigger(kind,now){
    if(now-lastTrigger<COOLDOWN_MS)return;
    lastTrigger=now;
    if(LW.measureGesture._onShake)LW.measureGesture._onShake(kind);
  }
  function handleOrientation(e){
    const now=performance.now(),a=Number(e.alpha);if(!finite(a))return;
    const prev=last.alpha,prevTime=last.time;last.alpha=a;last.time=now;
    if(prev===null||now-prevTime>MAX_TRIGGER_INTERVAL)return;
    if(Math.abs(wrap(a,prev))>=TRIGGER_DEG)trigger('horizontal',now);
  }
  function handleMotion(e){
    const now=performance.now(),elev=landscapeElevation(e);if(!finite(elev))return;
    const prev=last.elevation,prevTime=last.time;last.elevation=elev;last.time=now;
    if(prev===null||now-prevTime>MAX_TRIGGER_INTERVAL)return;
    if(Math.abs(elev-prev)>=TRIGGER_DEG)trigger('vertical',now);
  }
  function start(onShake){
    if(listening)return true;listening=true;LW.measureGesture._onShake=onShake;
    last={alpha:null,elevation:null,time:performance.now()};lastTrigger=performance.now();
    window.addEventListener('deviceorientationabsolute',handleOrientation,true);
    window.addEventListener('deviceorientation',handleOrientation,true);
    window.addEventListener('devicemotion',handleMotion,true);return true;
  }
  function stop(){if(!listening)return;listening=false;window.removeEventListener('deviceorientationabsolute',handleOrientation,true);window.removeEventListener('deviceorientation',handleOrientation,true);window.removeEventListener('devicemotion',handleMotion,true)}
  async function requestPermission(){
    try{
      let motion='granted',orientation='granted';
      if(typeof DeviceMotionEvent!=='undefined'&&typeof DeviceMotionEvent.requestPermission==='function')motion=await DeviceMotionEvent.requestPermission();
      if(motion!=='granted')return false;
      if(typeof DeviceOrientationEvent!=='undefined'&&typeof DeviceOrientationEvent.requestPermission==='function')orientation=await DeviceOrientationEvent.requestPermission();
      return orientation==='granted';
    }catch(e){console.warn('Sensor permission:',e);return false}
  }
  function pitchDegrees(){return finite(last.elevation)?Math.abs(last.elevation):null}
  function orientation(){return screen.orientation?.angle??(innerWidth>innerHeight?90:0)}
  return{start,stop,requestPermission,pitchDegrees,orientation};
})();
