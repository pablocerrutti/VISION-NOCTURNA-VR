window.LW=window.LW||{};
LW.vr={draw(ctx,work,w,h,s){
  const gap=w*s.vrSeparation,ew=(w-gap)/2,sc=s.vrScale,dw=ew*sc,dh=h*sc,y=(h-dh)/2;
  ctx.drawImage(work,(ew-dw)/2,y,dw,dh);ctx.drawImage(work,ew+gap+(ew-dw)/2,y,dw,dh);
}};
