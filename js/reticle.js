window.LW=window.LW||{};
LW.reticle={
 draw(ctx,w,h,s){
   if(!s.reticle)return;
   const cx=w/2,cy=h/2;
   ctx.save();
   const c=s.mode==='thermal'?'rgba(255,255,255,.9)':'rgba(110,255,130,.9)';
   ctx.strokeStyle=c;ctx.fillStyle=c;ctx.lineWidth=Math.max(1,w/900);
   const cross=Math.max(16,w*.018);
   ctx.beginPath();ctx.moveTo(cx-cross,cy);ctx.lineTo(cx+cross,cy);ctx.moveTo(cx,cy-cross);ctx.lineTo(cx,cy+cross);ctx.stroke();
   ctx.beginPath();ctx.arc(cx,cy,3,0,Math.PI*2);ctx.fill();
   if(s.measureActive)this.measureRing(ctx,cx,cy,w,s.measureProgress||0,s.measureConfirmed);
   if(s.pointer)this.pointer(ctx,s.pointer.x,s.pointer.y,w,s.dwellProgress||0);
   ctx.restore();
 },
 measureRing(ctx,x,y,w,progress,confirmed){
   const r=Math.max(24,w*.030),line=Math.max(3,w/500);
   ctx.save();ctx.lineWidth=line;ctx.strokeStyle='rgba(110,255,130,.28)';ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.stroke();
   if(progress>0){ctx.strokeStyle=confirmed?'rgba(90,255,110,.98)':'rgba(110,255,130,.98)';ctx.lineWidth=Math.max(4,w/430);ctx.beginPath();ctx.arc(x,y,r,-Math.PI/2,-Math.PI/2+Math.PI*2*Math.min(1,progress));ctx.stroke()}
   ctx.restore();
 },
 pointer(ctx,x,y,w,progress){
   ctx.save();ctx.strokeStyle='rgba(255,255,255,.95)';ctx.fillStyle='rgba(120,255,140,.95)';ctx.lineWidth=Math.max(2,w/700);
   ctx.beginPath();ctx.arc(x,y,10,0,Math.PI*2);ctx.stroke();
   ctx.beginPath();ctx.moveTo(x-17,y);ctx.lineTo(x+17,y);ctx.moveTo(x,y-17);ctx.lineTo(x,y+17);ctx.stroke();
   if(progress>0){ctx.strokeStyle='rgba(110,255,130,.98)';ctx.lineWidth=Math.max(3,w/520);ctx.beginPath();ctx.arc(x,y,17,-Math.PI/2,-Math.PI/2+Math.PI*2*progress);ctx.stroke()}
   ctx.restore();
 }
};
