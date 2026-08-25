window.LW=window.LW||{};
LW.measureGesture=(()=>{
  let listening=false,baselineYaw=null,lastTime=0,lastTrigger=0,candidate={count:0,start:0,lastDelta:0};
  const TRIGGER_DEG=45.0,CONFIRM_SAMPLES=6,SUSTAIN_MS=350,BASELINE_SETTLE_MS=700,COOLDOWN_MS=3000,MAX_SAMPLE_INTERVAL=350;
  const finite=v=>Number.isFinite(v);
  const wrap=(a,b)=>{let d=a-b;while(d>180)d-=360;while(d<-180)d+=360;return d};
  function isLandscape(){const a=Number(screen.orientation?.angle);if(a===90||a===270)return true;return window.matchMedia?.('(orientation: landscape)').matches ?? (innerWidth>innerHeight)}
  function reset(){candidate={count:0,start:0,lastDelta:0}}
  function trigger(now){if(now-lastTrigger<COOLDOWN_MS)return;lastTrigger=now;reset();baselineYaw=null;if(LW.measureGesture._onShake)LW.measureGesture._onShake('left-right')}
  function check(yaw,now){
    if(baselineYaw===null){baselineYaw=yaw;reset();return}
    const delta=Math.abs(wrap(yaw,baselineYaw));
    if(delta<TRIGGER_DEG){reset();if(now-lastTrigger>BASELINE_SETTLE_MS&&delta<8)baselineYaw=yaw;return}
    if(!candidate.start){candidate={count:1,start:now,lastDelta:delta};return}
    if(Math.abs(delta-candidate.lastDelta)>10){reset();return}
    candidate.count++;candidate.lastDelta=delta;
    if(candidate.count>=CONFIRM_SAMPLES&&now-candidate.start>=SUSTAIN_MS)trigger(now);
  }
  function handleOrientation(e){if(!isLandscape())return;const now=performance.now(),yaw=Number(e.alpha);if(!finite(yaw))return;if(lastTime&&now-lastTime>MAX_SAMPLE_INTERVAL){baselineYaw=yaw;reset()}lastTime=now;check(yaw,now)}
  function start(onShake){if(listening)return true;listening=true;LW.measureGesture._onShake=onShake;baselineYaw=null;lastTime=performance.now();reset();lastTrigger=lastTime;window.addEventListener('deviceorientationabsolute',handleOrientation,true);window.addEventListener('deviceorientation',handleOrientation,true);return true}
  function stop(){if(!listening)return;listening=false;window.removeEventListener('deviceorientationabsolute',handleOrientation,true);window.removeEventListener('deviceorientation',handleOrientation,true)}
  async function requestPermission(){
    try{
      // Camera startup must never be blocked by sensor permission. Request orientation
      // permission when the platform exposes it; measurement can be unavailable if denied.
      if(typeof DeviceOrientationEvent!=='undefined'&&typeof DeviceOrientationEvent.requestPermission==='function'){
        const r=await DeviceOrientationEvent.requestPermission();
        if(r!=='granted')console.warn('Orientación no concedida; cámara seguirá iniciando.');
      }
      if(typeof DeviceMotionEvent!=='undefined'&&typeof DeviceMotionEvent.requestPermission==='function'){
        const r=await DeviceMotionEvent.requestPermission();
        if(r!=='granted')console.warn('Movimiento no concedido; cámara seguirá iniciando.');
      }
    }catch(e){console.warn('Sensor permission:',e)}
    return true;
  }
  function pitchDegrees(){return null}
  function orientation(){return screen.orientation?.angle??(innerWidth>innerHeight?90:0)}
  return{start,stop,requestPermission,pitchDegrees,orientation};
})();
