window.LW=window.LW||{};
LW.measure={
 height:1.65,target:0.45,refDistance:20,min:5,max:100,fov:50,last:null,
 angleToDistance(angle){return angle>0?this.target/Math.tan(angle):Infinity},
 outOfRange(){return{value:null,text:'FUERA DE RANGO'}},
 fromScreenY(y,viewportHeight=innerHeight){const n=y/viewportHeight;if(n<=.5)return null;const theta=Math.atan(((n-.5)*2)*Math.tan(this.fov*Math.PI/360));const d=this.angleToDistance(theta);if(!Number.isFinite(d)||d<this.min||d>this.max)return this.outOfRange();return{value:d,text:d.toFixed(1)+' M'}},
 targetAngularSize(distance){return 2*Math.atan((this.target/2)/distance)},
 rulerRatio(distance){return this.refDistance/distance},
 distanceFromRulerRatio(r){if(!r)return null;const d=this.refDistance/r;return d>=this.min&&d<=this.max?d:null},
 rulerDistanceFromY(y,viewportHeight){const cy=viewportHeight/2,top=cy+54,bottom=Math.min(viewportHeight-70,cy+viewportHeight*.34),span=Math.max(130,bottom-top);const r=1-(y-top)/span;if(r<=0)return this.outOfRange();const d=this.refDistance/r;if(d<this.min||d>this.max)return this.outOfRange();return{value:d,text:d.toFixed(1)+' M'}}
};
