window.LW=window.LW||{};
LW.camera={
  stream:null,track:null,running:false,
  settings:null,capabilities:null,
  fovHorizontal:null,fovSourceWidth:1920,fovSourceHeight:1080,fovSource:'profile',
  async start(){
    const video=document.getElementById('camera');
    if(!navigator.mediaDevices?.getUserMedia)throw new Error('getUserMedia no disponible');
    this.stop();
    this.stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'},width:{ideal:1920},height:{ideal:1080},frameRate:{ideal:30,max:30}},audio:false});
    video.srcObject=this.stream;video.muted=true;video.playsInline=true;
    await new Promise(r=>video.readyState>=2&&video.videoWidth?r():video.onloadedmetadata=r);
    await video.play();
    this.track=this.stream.getVideoTracks()[0];
    this.settings=this.track.getSettings?this.track.getSettings():{};
    this.capabilities=this.track.getCapabilities?this.track.getCapabilities():{};
    this.fovSourceWidth=video.videoWidth||this.settings.width||1920;
    this.fovSourceHeight=video.videoHeight||this.settings.height||1080;
    const reported=Number(this.settings.fieldOfView||this.capabilities.fieldOfView);
    if(Number.isFinite(reported)&&reported>20&&reported<120){
      this.fovHorizontal=reported;this.fovSource='browser';
    }else{
      const ua=navigator.userAgent||'';
      // iPhone SE 2020 rear camera: Apple specifies 58.632° horizontal FOV for 1920x1080/4K.
      this.fovHorizontal=/iPhone|iPad|iPod/i.test(ua)?58.632:60.0;
      this.fovSource=/iPhone|iPad|iPod/i.test(ua)?'iphone-se-profile':'generic-profile';
    }
    this.running=true;
    return this.settings;
  },
  getFovInfo(){return {horizontal:this.fovHorizontal,sourceWidth:this.fovSourceWidth,sourceHeight:this.fovSourceHeight,source:this.fovSource}},
  stop(){if(this.stream)this.stream.getTracks().forEach(t=>t.stop());this.stream=null;this.track=null;this.running=false;this.settings=null;this.capabilities=null}
};
