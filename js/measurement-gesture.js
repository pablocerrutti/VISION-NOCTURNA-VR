window.LW=window.LW||{};
LW.measureGesture=(()=>{
  let listening=false,last={beta:null,gamma:null,time:0},baseline={beta:null,gamma:null},candidate={count:0,lastDelta:0,start:0},lastTrigger=0;
  // Activation uses only physical tilt (beta/gamma), never compass alpha.
  // A 45° displacement from a stable baseline must be sustained before triggering.
  // This avoids false activations caused by compass jitter while the head is still.
  const TRIGGER_DEG=45.0,SUSTAIN_MS=350,CONFIRM_SAMPLES=6,BASELINE_SETTLE_MS=1000,COOLDOWN_MS=3000,MAX_SAMPLE_INTERVAL=350;
  const finite=v=>Number.isFinite(v);
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const angleDelta=(a,b)=>{let d=a-b;while(d>180)d-=360;while(d<-180)d+=360;return d};
  function trigger(kind,now){
    if(now-lastTrigger<COOLDOWN_MS)return;
    lastTrigger=now;candidate={count:0,lastDelta:0,start:0};baseline={beta:null,gamma:null};
    if(LW.measureGesture._onShake)LW.measureGesture._onShake(kind);
  }
  function check(beta,gamma,now){
    if(baseline.beta===null||baseline.gamma===null){baseline={beta,gamma};candidate={count:0,lastDelta:0,start:0};return}
    const db=angleDelta(beta,baseline.beta),dg=angleDelta(gamma,baseline.gamma);
    const delta=Math.hypot(db,dg);
    if(delta<TRIGGER_DEG){
      candidate={count:0,lastDelta:delta,start:0};
      // Slowly follow only genuinely stable positions, never during a candidate movement.
      if(now-lastTrigger>BASELINE_SETTLE_MS){baseline.beta=beta;baseline.gamma=gamma;}
      return;
    }
    if(!candidate.start){candidate={count:1,lastDelta:delta,start:now};return}
    // Require the large displacement to remain present; isolated sensor spikes are rejected.
    if(Math.abs(delta-candidate.lastDelta)>12){candidate={count:1,lastDelta:delta,start:now};return}
    candidate.count++;candidate.lastDelta=delta;
    if(candidate.count>=CONFIRM_SAMPLES && now-candidate.start>=SUSTAIN_MS)trigger('tilt',now);
  }
  function handleOrientation(e){
    const now=performance.now(),beta=Number(e.beta),gamma=Number(e.gamma);
    if(!finite(beta)||!finite(gamma))return;
    if(last.time&&now-last.time>MAX_SAMPLE_INTERVAL){baseline={beta,gamma};candidate={count:0,lastDelta:0,start:0};}
    last={beta,gamma,time:now};
    check(beta,gamma,now);
  }
  function start(onShake){
    if(listening)return true;
    listening=true;LW.measureGesture._onShake=onShake;
    const now=performance.now();last={beta:null,gamma:null,time:now};baseline={beta:null,gamma:null};candidate={count:0,lastDelta:0,start:0};lastTrigger=now;
    window.addEventListener('deviceorientationabsolute',handleOrientation,true);
    window.addEventListener('deviceorientation',handleOrientation,true);
    return true;
  }
  function stop(){
    if(!listening)return;listening=false;
    window.removeEventListener('deviceorientationabsolute',handleOrientation,true);
    window.removeEventListener('deviceorientation',handleOrientation,true);
  }
  async function requestPermission(){
    try{
      let orientation='granted',motion='granted';
      if(typeof DeviceMotionEvent!=='undefined'&&typeof DeviceMotionEvent.requestPermission==='function')motion=await DeviceMotionEvent.requestPermission();
      if(motion!=='granted')return false;
      if(typeof DeviceOrientationEvent!=='undefined'&&typeof DeviceOrientationEvent.requestPermission==='function')orientation=await DeviceOrientationEvent.requestPermission();
      return orientation==='granted';
    }catch(e){console.warn('Sensor permission:',e);return false}
  }
  function pitchDegrees(){return finite(last.beta)?Math.abs(last.beta):null}
  function orientation(){return screen.orientation?.angle??(innerWidth>innerHeight?90:0)}
  return{start,stop,requestPermission,pitchDegrees,orientation};
})();
