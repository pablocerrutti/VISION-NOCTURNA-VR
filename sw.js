const CACHE_NAME='lonewolf-nightvision-v29-reference-40m';
const SHELL=['./','./index.html','./css/style.css','./js/camera.js','./js/image-processing.js','./js/measurement-v2.js','./js/measurement-gesture.js','./js/reticle.js','./js/measurement-frame.js','./js/vr.js','./js/compass-v2.js','./js/vr-control.js','./js/app-v2.js','./manifest.json','./assets/icon-192.jpg','./assets/icon-512.jpg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('message',e=>{if(e.data?.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const u=new URL(e.request.url);if(u.origin!==self.location.origin)return;e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request)).catch(()=>caches.match('./index.html')))});
