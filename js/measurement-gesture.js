window.LW=window.LW||{};
LW.measureGesture=(()=>{
  let listening=false,last={alpha:null,elevation:null,time:0},baseline={alpha:null,elevation:null},candidate={kind:null,count:0,lastDelta:0},lastTrigger=0;
  // The trigger is measured against a stable baseline, not between adjacent sensor samples.
  // This prevents sensor spikes from activating measurement accidentally.
  const TRIGGER_DEG=45.0,CONFIRM_SAMPLES=4,BASELINE_RESET_MS=700,COOLDOWN_MS=2500,MAX_SAMPLE_INTERVAL=350;
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
    candidate={kind:null,count:0,lastDelta:0};
    baseline={alpha:null,elevation:null};
    if(LW.measureGesture._onShake)LW.measureGesture._onShake(kind);
  }
  function confirm(kind,delta,now){
    if(delta<TRIGGER_DEG){candidate={kind:null,count:0,lastDelta:0};return}
    if(candidate.kind!==kind || Math.abs(delta-candidate.lastDelta)>8){candidate={kind,count:1,lastDelta:delta};return}
    candidate.count++;candidate.lastDelta=delta;
    if(candidate.count>=CONFIRM_SAMPLES)trigger(kind,now);
  }
  function handleOrientation(e){
    const now=performance.now(),a=Number(e.alpha);if(!finite(a))return;
    const prevTime=last.time;last.alpha=a;last.time=now;
    if(prevTime&&now-prevTime>MAX_SAMPLE_INTERVAL){baseline.alpha=a;candidate={kind:null,count:0,lastDelta:0};return}
    if(baseline.alpha===null){baseline.alpha=a;return}
    const delta=Math.abs(wrap(a,baseline.alpha));
    confirm('horizontal',delta,now);
    if(now-lastTrigger>BASELINE_RESET_MS && delta<8 && candidate.count===0)baseline.alpha=a;
  }
  function handleMotion(e){
    const now=performance.now(),elev=landscapeElevation(e);if(!finite(elev))return;
    const prevTime=last.time;last.elevation=elev;last.time=now;
    if(prevTime&&now-prevTime>MAX_SAMPLE_INTERVAL){baseline.elevation=elev;candidate={kind:null,count:0,lastDelta:0};return}
    if(baseline.elevation===null){baseline.elevation=elev;return}
    const delta=Math.abs(elev-baseline.elevation);
    confirm('vertical',delta,now);
    if(now-lastTrigger>BASELINE_RESET_MS && delta<8 && candidate.count===0)baseline.elevation=elev;
  }
  function start(onShake){
    if(listening)return true;listening=true;LW.measureGesture._onShake=onShake;
    const now=performance.now();last={alpha:null,elevation:null,time:now};baseline={alpha:null,elevation:null};candidate={kind:null,count:0,lastDelta:0};lastTrigger=now;
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
