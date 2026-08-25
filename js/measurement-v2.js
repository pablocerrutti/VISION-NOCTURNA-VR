window.LW=window.LW||{};
LW.measure={
  cameraHeight:1.65,
  targetHeight:1.70,
  targetWidth:0.45,
  fov:45,
  min:5,
  max:100,
  last:null,
  clamp(v,a,b){return Math.min(b,Math.max(a,v))},
  effectiveFov(zoom=1){const z=Math.max(1,Number(zoom)||1);const half=this.fov*Math.PI/360;return 2*Math.atan(Math.tan(half)/z)},
  angleToDistance(angle){if(!Number.isFinite(angle)||angle<=0)return Infinity;return this.cameraHeight/Math.tan(angle)},
  outOfRange(){return{value:null,text:'FUERA DE RANGO'}},
  distanceFromAngle(angle){const d=this.angleToDistance(angle);if(!Number.isFinite(d)||d<this.min||d>this.max)return this.outOfRange();return{value:d,text:d.toFixed(1)+' M'}},
  angleFromScreenY(y,viewportHeight=innerHeight,zoom=1){const h=Number(viewportHeight);if(!Number.isFinite(y)||!Number.isFinite(h)||h<=0)return null;const n=y/h;const offset=2*(n-.5);if(offset<=0)return null;const half=this.effectiveFov(zoom)*Math.PI/360;return Math.atan(offset*Math.tan(half))},
  fromScreenY(y,viewportHeight=innerHeight,zoom=1){const angle=this.angleFromScreenY(y,viewportHeight,zoom);if(angle===null)return this.outOfRange();return this.distanceFromAngle(angle)},
  rulerDistanceFromY(y,viewportHeight,zoom=1){return this.fromScreenY(y,viewportHeight,zoom)},
  targetAngularSize(distance){if(!Number.isFinite(distance)||distance<=0)return null;return 2*Math.atan((this.targetHeight/2)/distance)},
  rulerRatio(distance){if(!Number.isFinite(distance)||distance<=0)return null;return this.min/distance},
  distanceFromRulerRatio(r){if(!Number.isFinite(r)||r<=0)return null;const d=this.min/r;return d>=this.min&&d<=this.max?d:null}
};
