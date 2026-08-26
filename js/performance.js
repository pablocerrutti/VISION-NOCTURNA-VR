(()=>{'use strict';
// Mobile performance layer: keeps the camera preview fluid without changing UI, camera modes or measurement.
const proto=HTMLCanvasElement.prototype;
const widthSet=Object.getOwnPropertyDescriptor(proto,'width').set;
const heightSet=Object.getOwnPropertyDescriptor(proto,'height').set;
const widthGet=Object.getOwnPropertyDescriptor(proto,'width').get;
const heightGet=Object.getOwnPropertyDescriptor(proto,'height').get;
const original={};
Object.defineProperty(proto,'width',{get:widthGet,set(v){if(!this.isConnected&&v>720){original[this]=v;v=720}if(this.id==='view'&&v>1280)v=1280;widthSet.call(this,v)}});
Object.defineProperty(proto,'height',{get:heightGet,set(v){if(!this.isConnected&&v>405){v=405}if(this.id==='view'&&v>720)v=720;heightSet.call(this,v)}});
window.LW=window.LW||{};
LW.performance={mobileCap:720,targetFps:30};
})();
