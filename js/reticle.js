window.LW=window.LW||{};
LW.reticle={
 draw(ctx,w,h,s){
  if(!s.reticle)return;
  // No Mil-Dot/static reticle. The aiming marker appears only during the two-point measurement.
  if(!s.measureStage||!['base','baseLocked','top','topLocked','result'].includes(s.measureStage))return;
  const cx=w/2,cy=h/2,c=s.mode==='thermal'?'rgba(255,255,255,.95)':'rgba(110,255,130,.95)';
  ctx.save();
  if(s.measureStage==='base'||s.measureStage==='top')this.targetPoint(ctx,cx,cy,w,c,s.measureStage);
  if(s.measureStage==='baseLocked'||s.measureStage==='topLocked'||s.measureStage==='result'){
   const p=s.measureStage==='baseLocked'?s.basePoint:s.topPoint;
   if(p)this.lockedPoint(ctx,p.x,p.y,w,c)
  }
  if(s.basePoint&&s.topPoint)this.connection(ctx,s.basePoint,s.topPoint,w,c);
  ctx.restore();
 },
 targetPoint(ctx,x,y,w,c,stage){ctx.save();ctx.strokeStyle=c;ctx.lineWidth=Math.max(3,w/500);const r=Math.max(22,w*.025);ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.moveTo(x-r-12,y);ctx.lineTo(x+r+12,y);ctx.moveTo(x,y-r-12);ctx.lineTo(x,y+r+12);ctx.stroke();ctx.font=`bold ${Math.max(22,w/52)}px sans-serif`;ctx.textAlign='center';ctx.fillStyle=c;ctx.fillText(stage==='base'?'FIJE BASE':'FIJE ALTURA',x,y-r-Math.max(20,w*.025));ctx.restore()},
 lockedPoint(ctx,x,y,w,c){ctx.save();ctx.fillStyle=c;ctx.strokeStyle=c;ctx.lineWidth=Math.max(3,w/600);const r=Math.max(9,w*.012);ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.moveTo(x-25,y);ctx.lineTo(x+25,y);ctx.moveTo(x,y-25);ctx.lineTo(x,y+25);ctx.stroke();ctx.restore()},
 connection(ctx,a,b,w,c){ctx.save();ctx.strokeStyle=c;ctx.globalAlpha=.75;ctx.lineWidth=Math.max(2,w/850);ctx.setLineDash([10,8]);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.setLineDash([]);ctx.font=`bold ${Math.max(20,w/62)}px sans-serif`;ctx.textAlign='center';ctx.fillStyle=c;ctx.fillText('75 CM',(a.x+b.x)/2+Math.max(30,w*.025),(a.y+b.y)/2);ctx.restore()}
};
