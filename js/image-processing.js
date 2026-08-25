window.LW=window.LW||{};
LW.image={
  thermal(v){if(v<.2){let t=v/.2;return[0,60*t,150+105*t]}if(v<.4){let t=(v-.2)/.2;return[0,60+195*t,255-180*t]}if(v<.6){let t=(v-.4)/.2;return[255*t,255,75*(1-t)]}if(v<.8){let t=(v-.6)/.2;return[255,255-180*t,0]}let t=(v-.8)/.2;return[255,75*t,75*t]},
  channel(v,s){return Math.min(255,Math.max(0,((v/255-.5)*s.contrast+.5)*s.brightness*s.gain*255))},
  process(data,s){
    for(let i=0;i<data.length;i+=4){
      if(s.mode==='normal'){
        data[i]=this.channel(data[i],s);data[i+1]=this.channel(data[i+1],s);data[i+2]=this.channel(data[i+2],s);continue;
      }
      let y=(.2126*data[i]+.7152*data[i+1]+.0722*data[i+2])/255;
      y=Math.min(1,Math.max(0,((y-.5)*s.contrast+.5)*s.brightness*s.gain));
      if(s.mode==='green'){data[i]=y*55;data[i+1]=y*255;data[i+2]=y*75}
      else if(s.mode==='bw'){let q=y*255;data[i]=data[i+1]=data[i+2]=q}
      else if(s.mode==='thermal'){let c=this.thermal(y);data[i]=c[0];data[i+1]=c[1];data[i+2]=c[2]}
    }
  }
};
