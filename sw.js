const CACHE_NAME='lonewolf-nightvision-v33';
const SHELL=['./','./index.html','./css/style.css','./js/performance.js','./js/camera.js','./js/image-processing.js','./js/measurement-v2.js','./js/reticle.js','./js/measurement-frame.js','./js/vr.js','./js/compass-v2.js','./js/vr-control.js','./js/app-v2.js','./js/nightvision-plus.js','./manifest.json','./assets/icon-192.jpg','./assets/icon-512.jpg'];

self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache=>cache.addAll(SHELL))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('message',event=>{
  if(event.data?.type==='SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin) return;
  const isAppCode=/\.(js|css|html)$/i.test(url.pathname);
  if(isAppCode){
    event.respondWith(
      fetch(event.request,{cache:'no-store'})
        .then(response=>{
          if(response.ok){const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy));}
          return response;
        })
        .catch(()=>caches.match(event.request).then(cached=>cached||caches.match('./index.html')))
    );
    return;
  }
  event.respondWith(
    caches.match(event.request)
      .then(cached=>cached||fetch(event.request).then(response=>{
        if(response.ok){const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy));}
        return response;
      }))
      .catch(()=>caches.match('./index.html'))
  );
});
