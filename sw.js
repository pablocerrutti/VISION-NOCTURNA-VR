const CACHE_NAME='lonewolf-nightvision-v2.1.0';
const SHELL=['./','./index.html','./css/style.css','./js/camera.js','./js/image-processing.js','./js/measurement.js','./js/reticle.js','./js/vr.js','./js/compass.js','./js/app.js','./manifest.json','./assets/icon-192.png','./assets/icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const u=new URL(e.request.url);
 if(u.origin!==self.location.origin){e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));return}
 e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{if(r.ok)caches.open(CACHE_NAME).then(c=>c.put(e.request,r.clone()));return r}).catch(()=>caches.match(e.request)));
});
