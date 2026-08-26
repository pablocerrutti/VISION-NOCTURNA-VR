window.LW=window.LW||{};
LW.image={
 thermal(v){if(v<.2){let t=v/.2;return[0,60*t,150+105*t]}if(v<.4){let t=(v-.2)/.2;return[0,60+195*t,255-180*t]}if(v<.6){let t=(v-.4)/.2;return[255*t,255,75*(1-t)]}if(v<.8){let t=(v-.6)/.2;return[255,255-180*t,0]}let t=(v-.8)/.2;return[255,75*t,75*t]},
 process(data,s){
  const mode=s.mode,c=s.contrast,b=s.brightness*s.gain,inv=1/255;
  if(mode==='normal'){for(let i=0;i<data.length;i+=4){data[i]=Math.min(255,Math.max(0,((data[i]*inv-.5)*c+.5)*b*255));data[i+1]=Math.min(255,Math.max(0,((data[i+1]*inv-.5)*c+.5)*b*255));data[i+2]=Math.min(255,Math.max(0,((data[i+2]*inv-.5)*c+.5)*b*255))}return}
  const green=mode==='green',bw=mode==='bw';
  for(let i=0;i<data.length;i+=4){let y=(.2126*data[i]+.7152*data[i+1]+.0722*data[i+2])*inv;y=Math.min(1,Math.max(0,((y-.5)*c+.5)*b));if(green){const q=y*255;data[i]=q*.216;data[i+1]=q;data[i+2]=q*.294}else if(bw){const q=y*255;data[i]=data[i+1]=data[i+2]=q}else{const q=this.thermal(y);data[i]=q[0];data[i+1]=q[1];data[i+2]=q[2]}}
 }
};
