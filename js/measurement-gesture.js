window.LW=window.LW||{};
LW.measureGesture=(()=>{
  let listening=false,last={alpha:null,elevation:null},yawSamples=[],pitchSamples=[],stableSince=0,cooldownUntil=0;
  const SAMPLE_MS=760,START_RANGE=16,STOP_RANGE=8,REVERSALS=2,STABLE_DEG=.65,STABLE_MS=1100;
  const finite=v=>Number.isFinite(v);
  const wrap=(a,b)=>{let d=a-b;while(d>180)d-=360;while(d<-180)d+=360;return d};
  const range=values=>values.length<4?0:Math.max(...values)-Math.min(...values);
  const reversals=values=>{let prev=0,n=0;for(let i=1;i<values.length;i++){const d=values[i]-values[i-1];if(Math.abs(d)<1.2)continue;const sign=Math.sign(d);if(prev&&sign!==prev)n++;prev=sign}return n};
  const trim=(arr,now)=>arr.filter(s=>now-s.t<=SAMPLE_MS);
  // En paisaje la referencia física de la cámara es el eje Z de la pantalla.
  // El componente Z de la gravedad permite obtener la elevación de la óptica
  // sin depender de beta/gamma, que cambian de significado al girar el teléfono.
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
    const current=yawSamples.length?yawSamples[yawSamples.length-1].v:null;
    if(current!==null&&last.alpha!==null&&Math.abs(wrap(current,last.alpha))>STABLE_DEG)stableSince=now;
    last.alpha=current;
    if(now<cooldownUntil)return;
    const vals=yawSamples.map(s=>s.v);
    if(range(vals)>=START_RANGE&&reversals(vals)>=REVERSALS){
      cooldownUntil=now+1250;yawSamples=[];pitchSamples=[];stableSince=now;
      if(LW.measureGesture._onStart)LW.measureGesture._onStart();
    }
  }
  function handleMotion(e){
    const now=performance.now(),elev=landscapeElevation(e);if(!finite(elev))return;
    pitchSamples=trim(pitchSamples,now);pitchSamples.push({t:now,v:elev});if(pitchSamples.length>90)pitchSamples.shift();
    const current=pitchSamples[pitchSamples.length-1]?.v;
    if(finite(current)&&finite(last.elevation)&&Math.abs(current-last.elevation)>STABLE_DEG)stableSince=now;
    last.elevation=current;
    if(now<cooldownUntil)return;
    // En paisaje, abajo -> arriba es una oscilación del ángulo de elevación.
    const vals=pitchSamples.map(s=>s.v);
    if(range(vals)>=STOP_RANGE&&reversals(vals)>=REVERSALS){
      cooldownUntil=now+1250;yawSamples=[];pitchSamples=[];stableSince=now;
      if(LW.measureGesture._onStop)LW.measureGesture._onStop();
    }
  }
  function start(onStart,onStop){
    if(listening)return true;listening=true;LW.measureGesture._onStart=onStart;LW.measureGesture._onStop=onStop;
    yawSamples=[];pitchSamples=[];stableSince=performance.now();last={alpha:null,elevation:null};
    window.addEventListener('deviceorientationabsolute',handleOrientation,true);
    window.addEventListener('deviceorientation',handleOrientation,true);
    window.addEventListener('devicemotion',handleMotion,true);return true;
  }
  function stop(){if(!listening)return;listening=false;yawSamples=[];pitchSamples=[];window.removeEventListener('deviceorientationabsolute',handleOrientation,true);window.removeEventListener('deviceorientation',handleOrientation,true);window.removeEventListener('devicemotion',handleMotion,true)}
  async function requestPermission(){
    try{
      const permissions=[];
      if(typeof DeviceMotionEvent!=='undefined'&&typeof DeviceMotionEvent.requestPermission==='function')permissions.push(DeviceMotionEvent.requestPermission());
      if(typeof DeviceOrientationEvent!=='undefined'&&typeof DeviceOrientationEvent.requestPermission==='function')permissions.push(DeviceOrientationEvent.requestPermission());
      if(permissions.length){const r=await Promise.all(permissions);return r.every(v=>v==='granted')}
      return true;
    }catch(e){console.warn('Sensor permission:',e);return false}
  }
  function stabilityProgress(){if(!listening||!stableSince)return 0;return Math.max(0,Math.min(1,(performance.now()-stableSince)/STABLE_MS))}
  function pitchDegrees(){return finite(last.elevation)?Math.abs(last.elevation):null}
  function isStable(){return stabilityProgress()>=1}
  function orientation(){return screen.orientation?.angle??(innerWidth>innerHeight?90:0)}
  return{start,stop,requestPermission,stabilityProgress,isStable,pitchDegrees,orientation};
})();
