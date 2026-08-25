window.LW=window.LW||{};
LW.measureGesture=(()=>{
  let listening=false,baselineYaw=null,lastTime=0,lastTrigger=0,candidate={count:0,start:0,lastDelta:0};
  // Landscape-only activation: deliberate LEFT/RIGHT rotation around the vertical axis.
  // Only alpha (yaw) is used for the trigger; beta/gamma are not trigger inputs.
  const TRIGGER_DEG=45.0,CONFIRM_SAMPLES=6,SUSTAIN_MS=350,BASELINE_SETTLE_MS=1000,COOLDOWN_MS=3000,MAX_SAMPLE_INTERVAL=350;
  const finite=v=>Number.isFinite(v);
  const wrap=(a,b)=>{let d=a-b;while(d>180)d-=360;while(d<-180)d+=360;return d};
  function isLandscape(){const a=Number(screen.orientation?.angle);if(a===90||a===270)return true;return window.matchMedia?.('(orientation: landscape)').matches ?? (innerWidth>innerHeight)}
  function trigger(now){if(now-lastTrigger<COOLDOWN_MS)return;lastTrigger=now;candidate={count:0,start:0,lastDelta:0};baselineYaw=null;if(LW.measureGesture._onShake)LW.measureGesture._onShake('left-right')}
  function check(yaw,now){
    if(baselineYaw===null){baselineYaw=yaw;candidate={count:0,start:0,lastDelta:0};return}
    const delta=Math.abs(wrap(yaw,baselineYaw));
    if(delta<TRIGGER_DEG){candidate={count:0,start:0,lastDelta:0};if(now-lastTrigger>BASELINE_SETTLE_MS&&delta<8)baselineYaw=yaw;return}
    if(!candidate.start){candidate={count:1,start:now,lastDelta:delta};return}
    if(Math.abs(delta-candidate.lastDelta)>12){candidate={count:1,start:now,lastDelta:delta};return}
    candidate.count++;candidate.lastDelta=delta;
    if(candidate.count>=CONFIRM_SAMPLES&&now-candidate.start>=SUSTAIN_MS)trigger(now);
  }
  function handleOrientation(e){
    if(!isLandscape())return;
    const now=performance.now(),yaw=Number(e.alpha);if(!finite(yaw))return;
    if(lastTime&&now-lastTime>MAX_SAMPLE_INTERVAL){baselineYaw=yaw;candidate={count:0,start:0,lastDelta:0};}
    lastTime=now;check(yaw,now);
  }
  function start(onShake){if(listening)return true;listening=true;LW.measureGesture._onShake=onShake;baselineYaw=null;lastTime=performance.now();candidate={count:0,start:0,lastDelta:0};lastTrigger=lastTime;window.addEventListener('deviceorientationabsolute',handleOrientation,true);window.addEventListener('deviceorientation',handleOrientation,true);return true}
  function stop(){if(!listening)return;listening=false;window.removeEventListener('deviceorientationabsolute',handleOrientation,true);window.removeEventListener('deviceorientation',handleOrientation,true)}
  async function requestPermission(){try{let orientation='granted',motion='granted';if(typeof DeviceMotionEvent!=='undefined'&&typeof DeviceMotionEvent.requestPermission==='function')motion=await DeviceMotionEvent.requestPermission();if(motion!=='granted')return false;if(typeof DeviceOrientationEvent!=='undefined'&&typeof DeviceOrientationEvent.requestPermission==='function')orientation=await DeviceOrientationEvent.requestPermission();return orientation==='granted'}catch(e){console.warn('Sensor permission:',e);return false}}
  function pitchDegrees(){return null}
  function orientation(){return screen.orientation?.angle??(innerWidth>innerHeight?90:0)}
  return{start,stop,requestPermission,pitchDegrees,orientation};
})();
