window.LW=window.LW||{};
LW.measureGesture=(()=>{
  let listening=false,last={alpha:null,elevation:null},yawSamples=[],pitchSamples=[],lastTrigger=0;
  const SAMPLE_MS=620,TRIGGER_DEG=5,COOLDOWN_MS=900;
  const finite=v=>Number.isFinite(v);
  const wrap=(a,b)=>{let d=a-b;while(d>180)d-=360;while(d<-180)d+=360;return d};
  const trim=(arr,now)=>arr.filter(s=>now-s.t<=SAMPLE_MS);
  function landscapeElevation(e){
    const a=e.accelerationIncludingGravity;if(!a)return null;
    const x=Number(a.x)||0,y=Number(a.y)||0,z=Number(a.z);
    if(!finite(z))return null;
    const mag=Math.hypot(x,y,z);if(mag<1)return null;
    return Math.asin(Math.max(-1,Math.min(1,z/mag)))*180/Math.PI;
  }
  function handleOrientation(e){
    const now=performance.now(),a=Number(e.alpha);if(!finite(a))return;
    yawSamples=trim(yawSamples,now);yawSamples.push({t:now,v:a});
    if(now-lastTrigger<COOLDOWN_MS)return;
    const prev=last.alpha;
    if(prev!==null&&Math.abs(wrap(a,prev))>=TRIGGER_DEG){
      lastTrigger=now;yawSamples=[];pitchSamples=[];
      if(LW.measureGesture._onShake)LW.measureGesture._onShake('horizontal');
    }
    last.alpha=a;
  }
  function handleMotion(e){
    const now=performance.now(),elev=landscapeElevation(e);if(!finite(elev))return;
    pitchSamples=trim(pitchSamples,now);pitchSamples.push({t:now,v:elev});
    if(now-lastTrigger<COOLDOWN_MS)return;
    const prev=last.elevation;
    if(prev!==null&&Math.abs(elev-prev)>=TRIGGER_DEG){
      lastTrigger=now;yawSamples=[];pitchSamples=[];
      if(LW.measureGesture._onShake)LW.measureGesture._onShake('vertical');
    }
    last.elevation=elev;
  }
  function start(onShake){
    if(listening)return true;listening=true;LW.measureGesture._onShake=onShake;
    yawSamples=[];pitchSamples=[];last={alpha:null,elevation:null};lastTrigger=performance.now();
    window.addEventListener('deviceorientationabsolute',handleOrientation,true);
    window.addEventListener('deviceorientation',handleOrientation,true);
    window.addEventListener('devicemotion',handleMotion,true);return true;
  }
  function stop(){if(!listening)return;listening=false;yawSamples=[];pitchSamples=[];window.removeEventListener('deviceorientationabsolute',handleOrientation,true);window.removeEventListener('deviceorientation',handleOrientation,true);window.removeEventListener('devicemotion',handleMotion,true)}
  async function requestPermission(){try{const p=[];if(typeof DeviceMotionEvent!=='undefined'&&typeof DeviceMotionEvent.requestPermission==='function')p.push(DeviceMotionEvent.requestPermission());if(typeof DeviceOrientationEvent!=='undefined'&&typeof DeviceOrientationEvent.requestPermission==='function')p.push(DeviceOrientationEvent.requestPermission());if(p.length){const r=await Promise.all(p);return r.every(v=>v==='granted')}return true}catch(e){console.warn('Sensor permission:',e);return false}}
  function pitchDegrees(){return finite(last.elevation)?Math.abs(last.elevation):null}
  function orientation(){return screen.orientation?.angle??(innerWidth>innerHeight?90:0)}
  return{start,stop,requestPermission,pitchDegrees,orientation};
})();
