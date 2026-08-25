window.LW=window.LW||{};
(()=>{
  const M=LW.measure;
  M.distanceFromTargetFrame=function(rectPx,viewportWidth,viewportHeight,zoom=1){
    if(!rectPx||!Number.isFinite(rectPx.height)||rectPx.height<=0||!Number.isFinite(viewportHeight)||viewportHeight<=0)return this.outOfRange();
    const z=Math.max(.9,Number(zoom)||.9);
    const vf=this.effectiveFov(z,viewportWidth,viewportHeight)*Math.PI/180;
    const angular=2*Math.atan((rectPx.height/(2*viewportHeight))*2*Math.tan(vf/2));
    return this.distanceFromAngle(angular,this.targetHeight);
  };
  M.frameMils=function(rectPx,viewportWidth,viewportHeight,zoom=1){
    if(!rectPx||!Number.isFinite(rectPx.height)||rectPx.height<=0)return null;
    const z=Math.max(.9,Number(zoom)||.9),vf=this.effectiveFov(z,viewportWidth,viewportHeight)*Math.PI/180;
    const angular=2*Math.atan((rectPx.height/(2*viewportHeight))*2*Math.tan(vf/2));
    return this.milsFromAngle(angular);
  };
})();
