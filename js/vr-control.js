window.LW=window.LW||{};
LW.vrControl=(()=>{
  let active=false,baseline=null,x=0,y=0,lastX=0,lastY=0,stableSince=0,onSelect=null;
  const DWELL=1000,STABLE_DEG=.65,SENS_X=10,SENS_Y=9;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const wrapDelta=(a,b)=>{let d=a-b;while(d>180)d-=360;while(d<-180)d+=360;return d};
  function start(cb){onSelect=cb;active=true;baseline=null;stableSince=0;window.addEventListener('deviceorientation',handle,true);window.addEventListener('deviceorientationabsolute',handle,true);return true}
  function stop(){active=false;baseline=null;stableSince=0;window.removeEventListener('deviceorientation',handle,true);window.removeEventListener('deviceorientationabsolute',handle,true)}
  function reset(){baseline=null;stableSince=0}
  function handle(e){if(!active||e.beta==null||e.gamma==null)return;const now=performance.now();if(!baseline){baseline={alpha:e.alpha,beta:e.beta,gamma:e.gamma};x=innerWidth/2;y=innerHeight/2;lastX=x;lastY=y;return}
    const dx=wrapDelta(e.gamma,baseline.gamma),dy=e.beta-baseline.beta;
    x=clamp(innerWidth/2+dx*SENS_X,innerWidth*.08,innerWidth*.92);
    y=clamp(innerHeight/2+dy*SENS_Y,innerHeight*.08,innerHeight*.92);
    const moved=Math.hypot(x-lastX,y-lastY);
    const stable=moved<1.5 && Math.abs(dx-(lastX-innerWidth/2)/SENS_X)<STABLE_DEG && Math.abs(dy-(lastY-innerHeight/2)/SENS_Y)<STABLE_DEG;
    if(stable){if(!stableSince)stableSince=now;if(now-stableSince>=DWELL){const v=document.getElementById('view');const px=x/innerWidth*v.width,py=y/innerHeight*v.height;if(onSelect)onSelect({x:px,y:py});stableSince=now+350}}
    else stableSince=0;
    lastX=x;lastY=y;
  }
  function getPointer(){return{x:x/innerWidth,y:y/innerHeight}}
  function progress(){if(!active||!stableSince)return 0;return clamp((performance.now()-stableSince)/DWELL,0,1)}
  return {start,stop,reset,getPointer,progress,isActive:()=>active};
})();
