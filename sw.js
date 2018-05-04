'use strict';

self.addEventListener('fetch', function(event) {
  console.log('Received fetch event: ' + event.request.method + ' ' + event.request.url);
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          console.log('Cache hit');
          return response;
        }
        console.log('Cache miss');
        return fetch(event.request);
      }
    )
  );
});
