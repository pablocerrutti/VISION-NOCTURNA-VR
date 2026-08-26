window.LW=window.LW||{};
LW.reticle={
 draw(ctx,w,h,s){
  if(!s.reticle)return;
  if(s.measureStage!=='reference')return;
  const c=s.mode==='thermal'?'rgba(255,255,255,.96)':'rgba(110,255,130,.96)';
  // Visual reference: a 75 cm x 45 cm object at exactly 40 m.
  // Angular size is derived from the current camera FOV, so the frame remains
  // calibrated to the actual viewport rather than using a fixed screen size.
  const targetH=.75,targetW=.45,distance=40;
  const vf=(Number(s.fov)||35.06)*Math.PI/180;
  const hf=2*Math.atan(Math.tan(vf/2)*(w/h));
  const angularH=2*Math.atan((targetH/2)/distance),angularW=2*Math.atan((targetW/2)/distance);
  const pxH=2*h*Math.tan(angularH/2)/Math.tan(vf/2);
  const pxW=2*w*Math.tan(angularW/2)/Math.tan(hf/2);
  const rw=Math.max(36,pxW),rh=Math.max(58,pxH),x=(w-rw)/2,y=(h-rh)/2;
  ctx.save();ctx.strokeStyle=c;ctx.fillStyle=c;ctx.lineWidth=Math.max(3,w/500);ctx.setLineDash([12,9]);ctx.strokeRect(x,y,rw,rh);ctx.setLineDash([]);
  const fs=Math.max(22,w/48);ctx.font=`900 ${fs}px sans-serif`;ctx.textAlign='center';ctx.textBaseline='bottom';ctx.shadowColor='rgba(0,0,0,.9)';ctx.shadowBlur=7;
  ctx.fillText('75 × 45 CM  ·  40 M',w/2,y-fs*.35);
  ctx.font=`900 ${Math.max(20,w/58)}px sans-serif`;ctx.textBaseline='top';ctx.fillText('REFERENCIA',w/2,y+rh+10);
  ctx.lineWidth=Math.max(2,w/700);ctx.beginPath();const l=Math.min(38,rw*.18),t=Math.min(38,rh*.18);ctx.moveTo(x,y+t);ctx.lineTo(x,y);ctx.lineTo(x+l,y);ctx.moveTo(x+rw-l,y);ctx.lineTo(x+rw,y);ctx.lineTo(x+rw,y+t);ctx.moveTo(x,y+rh-t);ctx.lineTo(x,y+rh);ctx.lineTo(x+l,y+rh);ctx.moveTo(x+rw-l,y+rh);ctx.lineTo(x+rw,y+rh);ctx.lineTo(x+rw,y+rh-t);ctx.stroke();ctx.restore();
 }
};
