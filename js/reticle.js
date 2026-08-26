window.LW=window.LW||{};
LW.reticle={
 draw(ctx,w,h,s){if(!s.reticle)return;const cx=w/2,cy=h/2,c=s.mode==='thermal'?'rgba(255,255,255,.95)':'rgba(110,255,130,.95)';ctx.save();ctx.strokeStyle=c;ctx.fillStyle=c;ctx.lineWidth=Math.max(2,w/700);const cross=Math.max(22,w*.022);ctx.beginPath();ctx.moveTo(cx-cross,cy);ctx.lineTo(cx+cross,cy);ctx.moveTo(cx,cy-cross);ctx.lineTo(cx,cy+cross);ctx.stroke();ctx.beginPath();ctx.arc(cx,cy,4,0,Math.PI*2);ctx.fill();
 if(s.measureStage==='base'||s.measureStage==='top')this.targetPoint(ctx,cx,cy,w,c,s.measureStage);
 if(s.measureStage==='baseLocked'||s.measureStage==='topLocked'||s.measureStage==='result'){const p=s.measureStage==='baseLocked'?s.basePoint:s.topPoint;if(p)this.lockedPoint(ctx,p.x,p.y,w,c)}
 if(s.basePoint&&s.topPoint)this.connection(ctx,s.basePoint,s.topPoint,w,c);
 ctx.restore()},
 targetPoint(ctx,x,y,w,c,stage){ctx.save();ctx.strokeStyle=c;ctx.lineWidth=Math.max(3,w/500);ctx.beginPath();ctx.arc(x,y,Math.max(20,w*.025),0,Math.PI*2);ctx.stroke();ctx.font=`bold ${Math.max(20,w/55)}px sans-serif`;ctx.textAlign='center';ctx.fillStyle=c;ctx.fillText(stage==='base'?'FIJE BASE':'FIJE ALTURA',x,y-Math.max(28,w*.035));ctx.restore()},
 lockedPoint(ctx,x,y,w,c){ctx.save();ctx.fillStyle=c;ctx.strokeStyle=c;ctx.lineWidth=Math.max(3,w/600);ctx.beginPath();ctx.arc(x,y,Math.max(8,w*.012),0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.moveTo(x-22,y);ctx.lineTo(x+22,y);ctx.moveTo(x,y-22);ctx.lineTo(x,y+22);ctx.stroke();ctx.restore()},
 connection(ctx,a,b,w,c){ctx.save();ctx.strokeStyle=c;ctx.globalAlpha=.75;ctx.lineWidth=Math.max(2,w/850);ctx.setLineDash([10,8]);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.setLineDash([]);ctx.font=`bold ${Math.max(18,w/65)}px sans-serif`;ctx.textAlign='center';ctx.fillStyle=c;ctx.fillText('75 CM', (a.x+b.x)/2+Math.max(30,w*.025),(a.y+b.y)/2);ctx.restore()}
};
