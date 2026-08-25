window.LW=window.LW||{};
LW.measureGesture=(()=>{
  let listening=false,last={alpha:null,beta:null,gamma:null},samples=[],lastMove=0,stableSince=0,cooldownUntil=0;
  const SAMPLE_MS=720,START_RANGE=18,STOP_RANGE=10,REVERSALS=2,STABLE_DEG=.8,STABLE_MS=1100;
  const wrap=(a,b)=>{let d=a-b;while(d>180)d-=360;while(d<-180)d+=360;return d};
  const finite=v=>Number.isFinite(v);
  function axisSamples(key,now){return samples.filter(s=>now-s.t<=SAMPLE_MS).map(s=>s[key]).filter(finite)}
  function reversals(values){let prev=0,n=0;for(let i=1;i<values.length;i++){const d=values[i]-values[i-1];if(Math.abs(d)<1.4)continue;const sign=Math.sign(d);if(prev&&sign!==prev)n++;prev=sign}return n}
  function range(values){if(values.length<4)return 0;return Math.max(...values)-Math.min(...values)}
  function start(onStart,onStop){
    if(listening)return true;listening=true;LW.measureGesture._onStart=onStart;LW.measureGesture._onStop=onStop;samples=[];stableSince=performance.now();
    window.addEventListener('deviceorientationabsolute',handle,true);window.addEventListener('deviceorientation',handle,true);window.addEventListener('devicemotion',motion,true);return true;
  }
  function stop(){if(!listening)return;listening=false;samples=[];window.removeEventListener('deviceorientationabsolute',handle,true);window.removeEventListener('deviceorientation',handle,true);window.removeEventListener('devicemotion',motion,true)}
  function handle(e){const now=performance.now();const a=Number(e.alpha),b=Number(e.beta),g=Number(e.gamma);if(!finite(a)&&!finite(b)&&!finite(g))return;samples.push({t:now,alpha:a,beta:b,gamma:g});if(samples.length>120)samples.shift();
    const da=finite(a)&&finite(last.alpha)?wrap(a,last.alpha):0,db=finite(b)&&finite(last.beta)?b-last.beta:0,dg=finite(g)&&finite(last.gamma)?g-last.gamma:0;
    if(Math.max(Math.abs(da),Math.abs(db),Math.abs(dg))>STABLE_DEG)stableSince=now;last={alpha:a,beta:b,gamma:g};
    if(now<cooldownUntil)return;
    const av=axisSamples('alpha',now),bv=axisSamples('beta',now),gv=axisSamples('gamma',now);
    const horizontal=Math.max(range(av),range(gv))>=START_RANGE&&(reversals(av)>=REVERSALS||reversals(gv)>=REVERSALS);
    const vertical=range(bv)>=STOP_RANGE&&reversals(bv)>=REVERSALS;
    if(horizontal){cooldownUntil=now+1200;samples=[];stableSince=now;if(LW.measureGesture._onStart)LW.measureGesture._onStart();return}
    if(vertical){cooldownUntil=now+1200;samples=[];stableSince=now;if(LW.measureGesture._onStop)LW.measureGesture._onStop();return}
  }
  function motion(e){
    const a=e.accelerationIncludingGravity;if(!a||!finite(a.z))return;
    const mag=Math.hypot(a.x||0,a.y||0,a.z||0);if(mag<1)return;
    LW.measureGesture._pitch=Math.asin(Math.max(-1,Math.min(1,-a.z/mag)));
  }
  async function requestPermission(){try{if(typeof DeviceMotionEvent!=='undefined'&&typeof DeviceMotionEvent.requestPermission==='function'){const p=await DeviceMotionEvent.requestPermission();return p==='granted'}return true}catch(e){console.warn('Motion permission:',e);return false}}
  function stabilityProgress(){if(!listening||!stableSince)return 0;return Math.max(0,Math.min(1,(performance.now()-stableSince)/STABLE_MS))}
  function pitchDegrees(){return finite(LW.measureGesture._pitch)?LW.measureGesture._pitch*180/Math.PI:null}
  function isStable(){return stabilityProgress()>=1}
  return{start,stop,requestPermission,stabilityProgress,isStable,pitchDegrees};
})();
