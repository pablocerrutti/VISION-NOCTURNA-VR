window.LW=window.LW||{};
LW.measure={
  cameraHeight:1.65,targetHeight:0.45,targetWidth:0.45,
  autoHeight:false,heightMin:0.70,heightMax:1.60,heightCalibrated:false,
  fov:35.06,horizontalFov:58.632,sourceWidth:1920,sourceHeight:1080,fovSource:'fallback',
  min:5,max:150,preferredAccuracyMax:80,last:null,
  clamp(v,a,b){return Math.min(b,Math.max(a,v))},
  setCameraHeight(h){const n=Number(h);if(!Number.isFinite(n))return this.cameraHeight;this.cameraHeight=this.clamp(n,this.heightMin,this.heightMax);this.autoHeight=true;this.heightCalibrated=true;return this.cameraHeight},
  clearAutoHeight(){this.autoHeight=false;this.heightCalibrated=false;this.cameraHeight=1.65},
  heightFromKnownReference(distance,baseAngle){if(!Number.isFinite(distance)||distance<=0||!Number.isFinite(baseAngle))return null;const h=distance*Math.tan(Math.abs(baseAngle));if(!Number.isFinite(h)||h<this.heightMin||h>this.heightMax)return null;return this.setCameraHeight(h)},
  configureCamera(info){if(info&&Number.isFinite(+info.horizontal))this.horizontalFov=+info.horizontal;if(info&&Number.isFinite(+info.sourceWidth))this.sourceWidth=+info.sourceWidth;if(info&&Number.isFinite(+info.sourceHeight))this.sourceHeight=+info.sourceHeight;if(info?.source)this.fovSource=info.source;this.fov=this.verticalFov(innerWidth,innerHeight,1);return this.fov},
  verticalFov(viewportWidth=innerWidth,viewportHeight=innerHeight,zoom=1){const vw=Math.max(1,Number(viewportWidth)||innerWidth),vh=Math.max(1,Number(viewportHeight)||innerHeight),sw=Math.max(1,Number(this.sourceWidth)||1920),sh=Math.max(1,Number(this.sourceHeight)||1080),sourceAspect=sw/sh,viewportAspect=vw/vh,hf=Math.max(1,Number(this.horizontalFov)||58.632)*Math.PI/180;let vf=2*Math.atan(Math.tan(hf/2)/sourceAspect);if(viewportAspect>sourceAspect)vf=2*Math.atan(Math.tan(hf/2)/viewportAspect);const z=Math.max(0.9,Number(zoom)||1),effectiveZoom=Math.max(1,z);return 2*Math.atan(Math.tan(vf/2)/effectiveZoom)*180/Math.PI},
  effectiveFov(zoom=1,viewportWidth=innerWidth,viewportHeight=innerHeight){return this.verticalFov(viewportWidth,viewportHeight,zoom)},
  angleToDistance(angle){if(!Number.isFinite(angle)||angle<=0)return Infinity;return this.cameraHeight/Math.tan(angle)},
  outOfRange(){return{value:null,text:'FUERA DE RANGO'}},
  distanceFromAngle(angle){if(!Number.isFinite(angle)||angle<=0)return this.outOfRange();const d=this.angleToDistance(angle);if(!Number.isFinite(d)||d<this.min||d>this.max)return this.outOfRange();return{value:d,text:d<=this.preferredAccuracyMax?d.toFixed(1)+' M':d.toFixed(1)+' M · ERROR RELATIVO'}},
  distanceFromPitchDegrees(pitch){const a=Math.abs(Number(pitch));if(!Number.isFinite(a))return this.outOfRange();return this.distanceFromAngle(a*Math.PI/180)},
  angleFromScreenY(y,viewportHeight=innerHeight,zoom=1,viewportWidth=innerWidth){const h=Number(viewportHeight),w=Number(viewportWidth);if(!Number.isFinite(y)||!Number.isFinite(h)||h<=0)return null;const n=y/h,offset=2*(n-.5);if(offset<=0)return 0;const half=this.effectiveFov(zoom,w,h)*Math.PI/360;return Math.atan(offset*Math.tan(half))},
  fromScreenY(y,viewportHeight=innerHeight,zoom=1,viewportWidth=innerWidth){const angle=this.angleFromScreenY(y,viewportHeight,zoom,viewportWidth);if(angle===null)return this.outOfRange();return this.distanceFromAngle(angle)},
  rulerDistanceFromY(y,viewportHeight,zoom=1,viewportWidth=innerWidth){return this.fromScreenY(y,viewportHeight,zoom,viewportWidth)},
  targetAngularSize(distance){if(!Number.isFinite(distance)||distance<=0)return null;return 2*Math.atan((this.targetHeight/2)/distance)},
  rulerRatio(distance){if(!Number.isFinite(distance)||distance<=0)return null;return this.min/distance},
  distanceFromRulerRatio(r){if(!Number.isFinite(r)||r<=0)return null;const d=this.min/r;return d>=this.min&&d<=this.max?d:null}
};
