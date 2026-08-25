window.LW=window.LW||{};
LW.measureGesture=(()=>{
  let listening=false,last={alpha:null,elevation:null},lastTrigger=0;
  let candidate={alpha:null,elevation:null,alphaCount:0,elevationCount:0};
  // Se mantiene la idea de una sacudida mínima, pero se filtra el ruido de los sensores.
  // El movimiento efectivo debe superar ~1.5° y confirmarse en dos lecturas consecutivas.
  const TRIGGER_DEG=1.5,CONFIRM_SAMPLES=2,COOLDOWN_MS=1200;
  const finite=v=>Number.isFinite(v);
  const wrap=(a,b)=>{let d=a-b;while(d>180)d-=360;while(d<-180)d+=360;return d};
  function landscapeElevation(e){
    const a=e.accelerationIncludingGravity;if(!a)return null;
    const x=Number(a.x)||0,y=Number(a.y)||0,z=Number(a.z);
    if(!finite(z))return null;
    const mag=Math.hypot(x,y,z);if(mag<1)return null;
    return Math.asin(Math.max(-1,Math.min(1,z/mag)))*180/Math.PI;
  }
  function resetCandidate(){candidate={alpha:null,elevation:null,alphaCount:0,elevationCount:0}}
  function fire(type,now){
    lastTrigger=now;
    resetCandidate();
    if(LW.measureGesture._onShake)LW.measureGesture._onShake(type);
  }
  function handleOrientation(e){
    const now=performance.now(),a=Number(e.alpha);if(!finite(a))return;
    if(now-lastTrigger<COOLDOWN_MS){last.alpha=a;resetCandidate();return}
    const prev=last.alpha;
    last.alpha=a;
    if(prev===null){candidate.alpha=null;candidate.alphaCount=0;return}
    const delta=Math.abs(wrap(a,prev));
    if(delta>=TRIGGER_DEG){
      if(candidate.alpha!==null&&Math.abs(wrap(a,candidate.alpha))<0.75)candidate.alphaCount++;
      else {candidate.alpha=a;candidate.alphaCount=1}
      if(candidate.alphaCount>=CONFIRM_SAMPLES)fire('horizontal',now);
    }else if(delta<0.55){
      candidate.alpha=null;candidate.alphaCount=0;
    }
  }
  function handleMotion(e){
    const now=performance.now(),elev=landscapeElevation(e);if(!finite(elev))return;
    if(now-lastTrigger<COOLDOWN_MS){last.elevation=elev;resetCandidate();return}
    const prev=last.elevation;
    last.elevation=elev;
    if(prev===null){candidate.elevation=null;candidate.elevationCount=0;return}
    const delta=Math.abs(elev-prev);
    if(delta>=TRIGGER_DEG){
      if(candidate.elevation!==null&&Math.abs(elev-candidate.elevation)<0.75)candidate.elevationCount++;
      else {candidate.elevation=elev;candidate.elevationCount=1}
      if(candidate.elevationCount>=CONFIRM_SAMPLES)fire('vertical',now);
    }else if(delta<0.55){
      candidate.elevation=null;candidate.elevationCount=0;
    }
  }
  function start(onShake){
    if(listening)return true;listening=true;LW.measureGesture._onShake=onShake;
    last={alpha:null,elevation:null};lastTrigger=performance.now();resetCandidate();
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
