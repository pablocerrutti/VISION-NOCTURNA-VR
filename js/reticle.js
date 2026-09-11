window.LW=window.LW||{};
LW.reticle={
 draw(ctx,w,h,s){
  if(!s.reticle)return;
  const c=s.mode==='thermal'?'rgba(255,255,255,.96)':'rgba(110,255,130,.96)';
  const cx=w/2,cy=h/2;
  ctx.save();
  ctx.strokeStyle=c;ctx.fillStyle=c;ctx.shadowColor='rgba(0,0,0,.95)';ctx.shadowBlur=5;
  const gap=Math.max(9,w*.008),arm=Math.max(22,w*.024),lw=Math.max(2,w/420);
  ctx.lineWidth=lw;
  ctx.beginPath();
  ctx.moveTo(cx-arm,cy);ctx.lineTo(cx-gap,cy);
  ctx.moveTo(cx+gap,cy);ctx.lineTo(cx+arm,cy);
  ctx.moveTo(cx,cy-arm);ctx.lineTo(cx,cy-gap);
  ctx.moveTo(cx,cy+gap);ctx.lineTo(cx,cy+arm);
  ctx.stroke();
  ctx.beginPath();ctx.arc(cx,cy,Math.max(2.5,w*.003),0,Math.PI*2);ctx.fill();
  ctx.restore();
  if(!s.scale)return;
  // Reference frame is intentionally generic: 0.50 m x 0.72 m at 30 m.
  // It is a visual calibration aid, not a human-targeting aid.
  const targetH=.72,targetW=.50,distance=30;
  const hf=Math.max(40,Math.min(70,Number(s.fov)||58.6))*Math.PI/180;
  const vf=2*Math.atan(Math.tan(hf/2)*(h/Math.max(1,w)));
  const angularH=2*Math.atan((targetH/2)/distance),angularW=2*Math.atan((targetW/2)/distance);
  const pxH=h*Math.tan(angularH/2)/Math.tan(vf/2),pxW=w*Math.tan(angularW/2)/Math.tan(hf/2);
  const rw=Math.max(18,pxW),rh=Math.max(26,pxH),x=cx-rw/2,y=cy-rh/2;
  ctx.save();ctx.strokeStyle=c;ctx.lineWidth=Math.max(1.5,w/700);ctx.setLineDash([5,5]);ctx.strokeRect(x,y,rw,rh);ctx.setLineDash([]);ctx.font=`900 ${Math.max(11,w/90)}px monospace`;ctx.textAlign='center';ctx.textBaseline='bottom';ctx.shadowColor='rgba(0,0,0,.95)';ctx.shadowBlur=5;ctx.fillStyle=c;ctx.fillText('REFERENCIA 30 M',cx,y-5);ctx.restore();
 }
};
