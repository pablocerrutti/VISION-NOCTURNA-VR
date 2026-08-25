window.LW=window.LW||{};
LW.reticle={
 draw(ctx,w,h,s){
  if(!s.reticle)return;
  const cx=w/2,cy=h/2,c=s.mode==='thermal'?'rgba(255,255,255,.9)':'rgba(110,255,130,.9)';
  ctx.save();ctx.strokeStyle=c;ctx.fillStyle=c;ctx.lineWidth=Math.max(1,w/900);
  const cross=Math.max(16,w*.018);ctx.beginPath();ctx.moveTo(cx-cross,cy);ctx.lineTo(cx+cross,cy);ctx.moveTo(cx,cy-cross);ctx.lineTo(cx,cy+cross);ctx.stroke();ctx.beginPath();ctx.arc(cx,cy,3,0,Math.PI*2);ctx.fill();
  this.milDots(ctx,cx,cy,w,h,c);this.targetReference(ctx,cx,cy,w,h,c);
  if(s.measureActive||s.measureArmed)this.measureRing(ctx,cx,cy,w,s.measureProgress||0,s.measureConfirmed);
  ctx.restore();
 },
 milDots(ctx,cx,cy,w,h,c){
  const vf=(LW.measure?.effectiveFov?LW.measure.effectiveFov(.9,w,h):35.06)*Math.PI/180;
  // 1 MIL = 0.001 rad. Pixel spacing for the calibrated camera FOV.
  const gap=Math.max(3,(h/2)*Math.tan(.001)/Math.tan(vf/2));
  const r=Math.max(2,w/1400);ctx.save();ctx.fillStyle=c;ctx.globalAlpha=.95;
  for(let i=-5;i<=5;i++){if(i){ctx.beginPath();ctx.arc(cx+i*gap,cy,r,0,Math.PI*2);ctx.fill()}}
  for(let i=-5;i<=5;i++){if(i){ctx.beginPath();ctx.arc(cx,cy+i*gap,r,0,Math.PI*2);ctx.fill()}}
  ctx.globalAlpha=.6;ctx.setLineDash([5,7]);ctx.strokeStyle=c;ctx.strokeRect(cx-5*gap,cy-5*gap,10*gap,10*gap);
  ctx.globalAlpha=.9;ctx.font=`${Math.max(11,w/130)}px monospace`;ctx.textAlign='left';ctx.fillText('1 MIL',cx+gap+5,cy-gap-5);ctx.restore();
 },
 targetReference(ctx,cx,cy,w,h,c){
  const gap=Math.max(3,(h/2)*Math.tan(.001)/Math.tan((LW.measure?.effectiveFov?.(.9,w,h)||35.06)*Math.PI/360));
  ctx.save();ctx.strokeStyle=c;ctx.globalAlpha=.72;ctx.lineWidth=Math.max(1,w/1100);ctx.setLineDash([8,8]);
  // Known target: 75 x 45 cm. This is a visual reference only; distance is
  // obtained from the MILs subtended by the target, exactly like a Mil-Dot scope.
  const rw=6*gap,rh=10*gap;
  ctx.strokeRect(cx-rw/2,cy-rh/2,rw,rh);ctx.setLineDash([]);
  ctx.font=`${Math.max(11,w/150)}px monospace`;ctx.textAlign='center';ctx.fillText('75×45 CM · 0.9×',cx,cy+rh/2+Math.max(14,w/90));
  ctx.textAlign='left';ctx.fillText('10–150 M',cx+rw/2+8,cy+5);
  ctx.restore();
 },
 measureRing(ctx,x,y,w,p,confirmed){const r=Math.max(24,w*.03);ctx.save();ctx.lineWidth=Math.max(3,w/500);ctx.strokeStyle='rgba(110,255,130,.28)';ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.stroke();if(p>0){ctx.strokeStyle=confirmed?'rgba(90,255,110,.98)':'rgba(110,255,130,.98)';ctx.lineWidth=Math.max(4,w/430);ctx.beginPath();ctx.arc(x,y,r,-Math.PI/2,-Math.PI/2+Math.PI*2*Math.min(1,p));ctx.stroke()}ctx.restore()}
};
