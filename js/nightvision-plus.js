(()=>{'use strict';
window.LW=window.LW||{};
const cfg={shadow:62,noise:55,temporal:false,frames:3,exposure:0,historyFrames:[],width:0,height:0};
const $=id=>document.getElementById(id);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const saved=(()=>{try{return JSON.parse(localStorage.getItem('lonewolf-nightvision-plus-v1')||'{}')}catch(e){return {}}})();
Object.assign(cfg,saved);
function persist(){try{localStorage.setItem('lonewolf-nightvision-plus-v1',JSON.stringify({shadow:cfg.shadow,noise:cfg.noise,temporal:cfg.temporal,frames:cfg.frames,exposure:cfg.exposure}))}catch(e){}}
function addControlUI(){
 const first=document.querySelector('.controls section');
 if(!first||$('nightVisionPlus'))return;
 const modes=first.querySelector('.grid');
 if(modes){
  for(const [mode,label] of [['lowlight','LOW LIGHT'],['extreme','LOW LIGHT EXTREME']]){
   const b=document.createElement('button');b.type='button';b.dataset.mode=mode;b.textContent=label;modes.appendChild(b);
  }
 }
 const sec=document.createElement('section');sec.id='nightVisionPlus';
 sec.innerHTML='<h2>OPTIMIZACIÓN DE BAJA LUMINOSIDAD</h2>'+
 '<label>RECUPERACIÓN DE SOMBRAS <output id="nvShadowOut"></output><input id="nvShadow" type="range" min="0" max="100" step="1"></label>'+
 '<label>REDUCCIÓN DE RUIDO <output id="nvNoiseOut"></output><input id="nvNoise" type="range" min="0" max="100" step="1"></label>'+
 '<div class="nv-option"><label class="nv-check"><input id="nvTemporal" type="checkbox"> STABILIZED NIGHT VIEW</label></div>'+
 '<label>VENTANA TEMPORAL <output id="nvFramesOut"></output><input id="nvFrames" type="range" min="1" max="5" step="1"></label>'+
 '<label>COMPENSACIÓN DE EXPOSICIÓN <output id="nvExposureOut"></output><input id="nvExposure" type="range" min="-2" max="2" step="0.1"></label>'+
 '<p class="help">La exposición real depende de las capacidades que Safari/iOS habilite para la cámara. Si no está disponible, se mantiene el procesamiento digital.</p>';
 first.insertAdjacentElement('afterend',sec);
 const bindRange=(id,key,out,suffix='%')=>{const el=$(id),o=$(out);if(!el)return;el.value=cfg[key];const update=()=>{cfg[key]=Number(el.value);if(o)o.textContent=cfg[key]+suffix;persist();if(key==='exposure')applyExposure()};el.addEventListener('input',update);update()};
 bindRange('nvShadow','shadow','nvShadowOut');
 bindRange('nvNoise','noise','nvNoiseOut');
 bindRange('nvFrames','frames','nvFramesOut',' frames');
 bindRange('nvExposure','exposure','nvExposureOut',' EV');
 const check=$('nvTemporal');if(check){check.checked=!!cfg.temporal;check.addEventListener('change',()=>{cfg.temporal=check.checked;persist();resetHistory()})}
 document.querySelectorAll('[data-mode="lowlight"],[data-mode="extreme"]').forEach(b=>b.addEventListener('click',()=>{setTimeout(()=>{const label=$('modeLabel');if(label)label.textContent=b.dataset.mode==='extreme'?'LOW LIGHT EXTREME':'LOW LIGHT';applyExposure()},0)}));
}
function applyExposure(){
 const track=LW.camera?.track,caps=LW.camera?.capabilities;
 if(!track||!caps||typeof track.applyConstraints!=='function')return;
 const range=caps.exposureCompensation;
 if(!range||!Number.isFinite(range.min)||!Number.isFinite(range.max))return;
 const value=clamp(cfg.exposure,range.min,range.max);
 track.applyConstraints({advanced:[{exposureCompensation:value}]}).catch(()=>{});
}
function resetHistory(){cfg.historyFrames=[];cfg.width=0;cfg.height=0}
function temporal(data,w,h,mode){
 if(!cfg.temporal||mode==='normal'||!w||!h)return;
 const strength=(mode==='extreme'?.56:.32);
 const threshold=12+(cfg.noise/100)*24;
 if(cfg.width!==w||cfg.height!==h){cfg.historyFrames=[];cfg.width=w;cfg.height=h}
 if(!cfg.historyFrames.length){cfg.historyFrames.push(new Uint8ClampedArray(data));return}
 const count=Math.min(cfg.historyFrames.length,cfg.frames-1);
 for(let i=0;i<data.length;i+=4){
  let pr=0,pg=0,pb=0;
  for(let k=cfg.historyFrames.length-count;k<cfg.historyFrames.length;k++){const frame=cfg.historyFrames[k];pr+=frame[i];pg+=frame[i+1];pb+=frame[i+2]}
  pr/=count;pg/=count;pb/=count;
  const y=.2126*data[i]+.7152*data[i+1]+.0722*data[i+2];
  const py=.2126*pr+.7152*pg+.0722*pb;
  const diff=Math.abs(y-py);
  if(diff<threshold){
   const a=strength*(1-diff/threshold);
   data[i]=data[i]*(1-a)+pr*a;data[i+1]=data[i+1]*(1-a)+pg*a;data[i+2]=data[i+2]*(1-a)+pb*a;
  }
 }
 cfg.historyFrames.push(new Uint8ClampedArray(data));
 while(cfg.historyFrames.length>Math.max(1,cfg.frames-1))cfg.historyFrames.shift();
}
function enhanceShadows(data,amount){
 const strength=amount/100;
 for(let i=0;i<data.length;i+=4){
  const r=data[i],g=data[i+1],b=data[i+2];
  const y=(.2126*r+.7152*g+.0722*b)/255;
  const lifted=y+strength*.92*(Math.sqrt(y)-y)*(1-y*.45);
  const scale=y>.002?lifted/y:1;
  data[i]=clamp(r*scale,0,255);data[i+1]=clamp(g*scale,0,255);data[i+2]=clamp(b*scale,0,255);
 }
}
function install(){
 if(!LW.image||!LW.image.process||LW.image.__nightVisionPlus)return false;
 const original=LW.image.process.bind(LW.image);
 LW.image.process=function(data,state){
  const mode=state.mode;
  if(mode==='lowlight'||mode==='extreme'){
   const amount=clamp(cfg.shadow+(mode==='extreme'?22:0),0,100);
   enhanceShadows(data,amount);
   original(data,{...state,mode:'green',brightness:1,contrast:mode==='extreme'?1.42:1.28,gain:1});
   temporal(data,window.LW.__workWidth||0,window.LW.__workHeight||0,mode);
   return;
  }
  original(data,state);
  if(cfg.temporal&&mode!=='normal')temporal(data,window.LW.__workWidth||0,window.LW.__workHeight||0,mode);
 };
 LW.image.__nightVisionPlus=true;
 return true;
}
function observeMode(){
 const body=new MutationObserver(()=>{const m=document.body.dataset.mode,label=$('modeLabel');if(label&&(m==='lowlight'||m==='extreme'))label.textContent=m==='extreme'?'LOW LIGHT EXTREME':'LOW LIGHT'});
 body.observe(document.body,{attributes:true,attributeFilter:['data-mode']});
}
function init(){addControlUI();install();observeMode();$('startBtn')?.addEventListener('click',()=>setTimeout(applyExposure,700));document.querySelectorAll('[data-mode="lowlight"],[data-mode="extreme"]').forEach(b=>b.addEventListener('click',()=>resetHistory()));}
init();
window.addEventListener('resize',resetHistory);
window.LW.nightVisionPlus={config:cfg,resetHistory,applyExposure};
})();