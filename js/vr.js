window.LW=window.LW||{};
LW.vr=(()=>{
  let active=false;
  function setHUD(v){active=!!v;document.body.classList.toggle('vr-mode',active)}
  function draw(ctx,work,cw,ch,state){
    const sep=Math.max(0,Math.min(.20,+state.vrSeparation||0));
    const scale=Math.max(.85,Math.min(1.15,+state.vrScale||1));
    const eyeW=cw*(.5+sep*.5),eyeH=ch;
    ctx.clearRect(0,0,cw,ch);
    ctx.save();
    ctx.translate(cw*.25, ch*.5);ctx.scale(scale,scale);ctx.drawImage(work,-eyeW*.5,-eyeH*.5,eyeW,eyeH);ctx.restore();
    ctx.save();
    ctx.translate(cw*.75, ch*.5);ctx.scale(scale,scale);ctx.drawImage(work,-eyeW*.5,-eyeH*.5,eyeW,eyeH);ctx.restore();
  }
  function drawOverlay(ctx,cw,ch,state){
    const sep=Math.max(0,Math.min(.20,+state.vrSeparation||0));
    const scale=Math.max(.85,Math.min(1.15,+state.vrScale||1));
    const eyeW=cw*(.5+sep*.5);
    const centers=[cw*.25,cw*.75];
    centers.forEach(cx=>{
      ctx.save();ctx.translate(cx,ch*.5);ctx.scale(scale,scale);ctx.translate(-cx,-ch*.5);
      if(LW.reticle?.draw) LW.reticle.draw(ctx,eyeW,ch,state,cx-eyeW*.5);
      ctx.restore();
    });
  }
  return {setHUD,draw,drawOverlay,isActive:()=>active};
})();
