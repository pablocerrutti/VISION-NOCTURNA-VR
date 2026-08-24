window.LW=window.LW||{};
LW.vr={
  setHUD(on){document.querySelectorAll('.vr-hud').forEach(el=>el.classList.toggle('active',!!on))},
  draw(ctx,work,w,h,s){
    const gap=w*s.vrSeparation,ew=(w-gap)/2,sc=s.vrScale,dw=ew*sc,dh=h*sc,y=(h-dh)/2;
    ctx.drawImage(work,(ew-dw)/2,y,dw,dh);ctx.drawImage(work,ew+gap+(ew-dw)/2,y,dw,dh);
  },
  drawOverlay(ctx,w,h,s,p){
    const gap=w*s.vrSeparation,ew=(w-gap)/2;

    // Cada ojo se dibuja en su propio sistema de coordenadas.
    // Esto evita que la retícula del ojo derecho quede desplazada
    // fuera de su mitad de pantalla.
    const leftPoint=p?{x:p.x/2,y:p.y}:null;
    const rightPoint=p?{x:p.x/2,y:p.y}:null;

    ctx.save();
    ctx.beginPath();ctx.rect(0,0,ew,h);ctx.clip();
    LW.reticle.draw(ctx,ew,h,{...s,point:leftPoint});
    ctx.restore();

    ctx.save();
    ctx.translate(ew+gap,0);
    ctx.beginPath();ctx.rect(0,0,ew,h);ctx.clip();
    LW.reticle.draw(ctx,ew,h,{...s,point:rightPoint});
    ctx.restore();
  }
};
