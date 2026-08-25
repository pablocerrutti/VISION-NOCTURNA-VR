window.LW=window.LW||{};
LW.reticle={
 draw(ctx,w,h,s){
  if(!s.reticle)return;
  const cx=w/2,cy=h/2,c=s.mode==='thermal'?'rgba(255,255,255,.9)':'rgba(110,255,130,.9)';
  ctx.save();ctx.strokeStyle=c;ctx.fillStyle=c;ctx.lineWidth=Math.max(1,w/900);
  const cross=Math.max(16,w*.018);ctx.beginPath();ctx.moveTo(cx-cross,cy);ctx.lineTo(cx+cross,cy);ctx.moveTo(cx,cy-cross);ctx.lineTo(cx,cy+cross);ctx.stroke();ctx.beginPath();ctx.arc(cx,cy,3,0,Math.PI*2);ctx.fill();
  this.milDots(ctx,cx,cy,w,h,c,s);this.targetFrame(ctx,cx,cy,w,h,c,s);
  if(s.measureActive||s.measureArmed)this.measureRing(ctx,cx,cy,w,s.measureProgress||0,s.measureConfirmed);
  ctx.restore();
 },
 milDots(ctx,cx,cy,w,h,c,s){
  const zoom=Math.max(.9,Number(s.zoom)||.9),vf=(LW.measure?.effectiveFov?LW.measure.effectiveFov(zoom,w,h):35.06)*Math.PI/180;
  // One dot spacing is exactly one mil at the current calibrated vertical FOV.
  const gap=Math.max(3,(h*Math.tan(.001))/Math.tan(vf/2));
  const r=Math.max(2,w/1400);ctx.save();ctx.fillStyle=c;ctx.globalAlpha=.95;
  for(let i=-5;i<=5;i++){if(i){ctx.beginPath();ctx.arc(cx+i*gap,cy,r,0,Math.PI*2);ctx.fill()}}
  for(let i=-5;i<=5;i++){if(i){ctx.beginPath();ctx.arc(cx,cy+i*gap,r,0,Math.PI*2);ctx.fill()}}
  ctx.globalAlpha=.6;ctx.setLineDash([5,7]);ctx.strokeStyle=c;ctx.strokeRect(cx-5*gap,cy-5*gap,10*gap,10*gap);
  ctx.globalAlpha=.85;ctx.font=`${Math.max(11,w/130)}px monospace`;ctx.textAlign='left';ctx.fillText('1 MIL',cx+gap+5,cy-gap-5);ctx.restore();
 },
 targetFrame(ctx,cx,cy,w,h,c,s){
  const zoom=Math.max(.9,Number(s.zoom)||.9),vf=(LW.measure?.effectiveFov?LW.measure.effectiveFov(zoom,w,h):35.06)*Math.PI/180;
  // Zoom acts as the user's optical adjustment. The frame is calibrated to 75x45 cm
  // and spans the useful 10-150 m range as zoom changes.
  const t=Math.min(1,Math.max(0,(zoom-.9)/(4-.9))),distance=10+t*140;
  const angularH=2*Math.atan(.75/(2*distance));
  const rh=Math.max(18,Math.min(h*.70,(h*Math.tan(angularH/2))/Math.tan(vf/2)));
  const rw=rh*.45/.75,x=cx-rw/2,y=cy-rh/2;
  ctx.save();ctx.strokeStyle=c;ctx.globalAlpha=s.measureActive||s.measureArmed?.98:.8;ctx.lineWidth=Math.max(2,w/900);ctx.setLineDash(s.measureActive||s.measureArmed?[]:[10,8]);ctx.strokeRect(x,y,rw,rh);ctx.setLineDash([]);
  const p=Math.max(7,w/180);[[x,y],[x+rw,y],[x,y+rh],[x+rw,y+rh]].forEach(q=>{ctx.beginPath();ctx.arc(q[0],q[1],p,0,Math.PI*2);ctx.fill()});
  ctx.font=`${Math.max(12,w/110)}px monospace`;ctx.textAlign='center';ctx.fillText('75 cm',cx,y-Math.max(10,w/90));ctx.save();ctx.translate(x-Math.max(12,w/90),cy);ctx.rotate(-Math.PI/2);ctx.fillText('45 cm',0,0);ctx.restore();ctx.textAlign='left';ctx.fillText(`${distance.toFixed(0)} m`,x+rw+8,cy+5);ctx.restore();
 },
 measureRing(ctx,x,y,w,p,confirmed){const r=Math.max(24,w*.03);ctx.save();ctx.lineWidth=Math.max(3,w/500);ctx.strokeStyle='rgba(110,255,130,.28)';ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.stroke();if(p>0){ctx.strokeStyle=confirmed?'rgba(90,255,110,.98)':'rgba(110,255,130,.98)';ctx.lineWidth=Math.max(4,w/430);ctx.beginPath();ctx.arc(x,y,r,-Math.PI/2,-Math.PI/2+Math.PI*2*Math.min(1,p));ctx.stroke()}ctx.restore()}
};