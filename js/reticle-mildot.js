window.LW=window.LW||{};
LW.reticle={
 draw(ctx,w,h,s){
  if(!s.reticle)return;
  const cx=w/2,cy=h/2,c=s.mode==='thermal'?'rgba(255,255,255,.9)':'rgba(110,255,130,.9)';
  ctx.save();ctx.strokeStyle=c;ctx.fillStyle=c;ctx.lineWidth=Math.max(1,w/900);
  const cross=Math.max(16,w*.018);ctx.beginPath();ctx.moveTo(cx-cross,cy);ctx.lineTo(cx+cross,cy);ctx.moveTo(cx,cy-cross);ctx.lineTo(cx,cy+cross);ctx.stroke();ctx.beginPath();ctx.arc(cx,cy,3,0,Math.PI*2);ctx.fill();
  this.milDots(ctx,cx,cy,w,h,c);this.targetFrame(ctx,cx,cy,w,h,c,s.measureActive||s.measureArmed);
  if(s.measureActive||s.measureArmed)this.measureRing(ctx,cx,cy,w,s.measureProgress||0,s.measureConfirmed);
  ctx.restore();
 },
 milDots(ctx,cx,cy,w,h,c){const gap=Math.min(w,h)*.075/5,r=Math.max(2,w/1400);ctx.save();ctx.fillStyle=c;ctx.globalAlpha=.9;for(let i=-4;i<=4;i++){if(i){ctx.beginPath();ctx.arc(cx+i*gap,cy,r,0,Math.PI*2);ctx.fill()}}for(let i=-3;i<=3;i++){if(i){ctx.beginPath();ctx.arc(cx,cy+i*gap,r,0,Math.PI*2);ctx.fill()}}ctx.globalAlpha=.45;ctx.setLineDash([5,7]);ctx.strokeStyle=c;ctx.strokeRect(cx-4*gap,cy-3*gap,8*gap,6*gap);ctx.restore()},
 targetFrame(ctx,cx,cy,w,h,c,active){const rh=Math.max(h*.20,180),rw=rh*45/75,x=cx-rw/2,y=cy-rh/2;ctx.save();ctx.strokeStyle=c;ctx.globalAlpha=active?.98:.8;ctx.lineWidth=Math.max(2,w/900);ctx.setLineDash(active?[]:[10,8]);ctx.strokeRect(x,y,rw,rh);ctx.setLineDash([]);const p=Math.max(7,w/180);[[x,y],[x+rw,y],[x,y+rh],[x+rw,y+rh]].forEach(q=>{ctx.beginPath();ctx.arc(q[0],q[1],p,0,Math.PI*2);ctx.fill()});ctx.font=`${Math.max(12,w/110)}px monospace`;ctx.textAlign='center';ctx.fillText('75 cm',cx,y-Math.max(10,w/90));ctx.save();ctx.translate(x-Math.max(12,w/90),cy);ctx.rotate(-Math.PI/2);ctx.fillText('45 cm',0,0);ctx.restore();ctx.restore()},
 measureRing(ctx,x,y,w,p,confirmed){const r=Math.max(24,w*.03);ctx.save();ctx.lineWidth=Math.max(3,w/500);ctx.strokeStyle='rgba(110,255,130,.28)';ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.stroke();if(p>0){ctx.strokeStyle=confirmed?'rgba(90,255,110,.98)':'rgba(110,255,130,.98)';ctx.lineWidth=Math.max(4,w/430);ctx.beginPath();ctx.arc(x,y,r,-Math.PI/2,-Math.PI/2+Math.PI*2*Math.min(1,p));ctx.stroke()}ctx.restore()}
};
