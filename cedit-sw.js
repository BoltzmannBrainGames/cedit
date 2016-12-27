const CACHE_NAME = "cedit-v1";

const URLS_TO_CACHE = [
"/cedit/",
// "/cedit/cedit.html", // do not fucking cache this in dev
// "/cedit/cedit.js",   // do not fucking cache this in dev
"/cedit/lib/",
"/cedit/lib/pixi.js",
"/cedit/icons/",
"/cedit/icons/icon-pencil.png",
"/cedit/icons/icon-eraser.png",
"/cedit/icons/icon-hand.png",
"/cedit/icons/icon-eye.png",
"/cedit/icons/icon-eye-closed.png"
];

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log("Opened cache:  %s", CACHE_NAME);
      return cache.addAll(URLS_TO_CACHE);
    })
	);
});

self.addEventListener("fetch", function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// This deletes all caches that are not in the whitelist.  It allows us
// to update the service worker, change cache names etc if we want.
self.addEventListener("activate", function(event) {
  let cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

