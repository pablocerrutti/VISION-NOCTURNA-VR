window.LW=window.LW||{};
LW.measure={
 cameraHeight:1.65,targetHeight:0.75,targetWidth:0.45,
 autoHeight:false,heightMin:0.70,heightMax:1.60,heightCalibrated:false,
 fov:35.06,horizontalFov:58.632,sourceWidth:1920,sourceHeight:1080,fovSource:'fallback',
 min:10,max:150,preferredAccuracyMax:80,
 clamp(v,a,b){return Math.min(b,Math.max(a,v))},
 setCameraHeight(h){const n=Number(h);if(!Number.isFinite(n))return this.cameraHeight;this.cameraHeight=this.clamp(n,this.heightMin,this.heightMax);this.autoHeight=true;this.heightCalibrated=true;return this.cameraHeight},
 clearAutoHeight(){this.autoHeight=false;this.heightCalibrated=false;this.cameraHeight=1.65},
 configureCamera(info){if(info&&Number.isFinite(+info.horizontal))this.horizontalFov=+info.horizontal;if(info&&Number.isFinite(+info.sourceWidth))this.sourceWidth=+info.sourceWidth;if(info&&Number.isFinite(+info.sourceHeight))this.sourceHeight=+info.sourceHeight;if(info?.source)this.fovSource=info.source;this.fov=this.verticalFov(innerWidth,innerHeight,.9);return this.fov},
 verticalFov(viewportWidth=innerWidth,viewportHeight=innerHeight,zoom=.9){const vw=Math.max(1,Number(viewportWidth)||innerWidth),vh=Math.max(1,Number(viewportHeight)||innerHeight),sw=Math.max(1,Number(this.sourceWidth)||1920),sh=Math.max(1,Number(this.sourceHeight)||1080),sourceAspect=sw/sh,viewportAspect=vw/vh,hf=Math.max(1,Number(this.horizontalFov)||58.632)*Math.PI/180;let vf=2*Math.atan(Math.tan(hf/2)/sourceAspect);if(viewportAspect>sourceAspect)vf=2*Math.atan(Math.tan(hf/2)/viewportAspect);const z=Math.max(.9,Number(zoom)||.9);return 2*Math.atan(Math.tan(vf/2)/z)*180/Math.PI},
 effectiveFov(zoom=.9,viewportWidth=innerWidth,viewportHeight=innerHeight){return this.verticalFov(viewportWidth,viewportHeight,zoom)},
 angleFromScreenY(y,viewportHeight=innerHeight,zoom=.9,viewportWidth=innerWidth){const h=Number(viewportHeight),w=Number(viewportWidth);if(!Number.isFinite(y)||!Number.isFinite(h)||h<=0)return null;const offset=2*(y/h-.5),half=this.effectiveFov(zoom,w,h)*Math.PI/360;return Math.atan(offset*Math.tan(half))},
 distanceFromTwoAngles(baseAngle,topAngle){if(!Number.isFinite(baseAngle)||!Number.isFinite(topAngle))return this.outOfRange();const delta=Math.abs(Math.tan(topAngle)-Math.tan(baseAngle));if(delta<=1e-8)return this.outOfRange();const d=this.targetHeight/delta;if(!Number.isFinite(d)||d<this.min||d>this.max)return this.outOfRange();return{value:d,text:d.toFixed(1)+' M',baseAngle,topAngle,delta}},
 distanceFromTwoScreenPoints(baseY,topY,viewportHeight=innerHeight,viewportWidth=innerWidth,zoom=.9){const b=this.angleFromScreenY(baseY,viewportHeight,zoom,viewportWidth),t=this.angleFromScreenY(topY,viewportHeight,zoom,viewportWidth);return this.distanceFromTwoAngles(b,t)},
 outOfRange(){return{value:null,text:'FUERA DE RANGO'}}
};
