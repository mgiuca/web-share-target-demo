'use strict';

self.addEventListener('fetch', function(event) {
  console.log('Received fetch event: ' + event.request.method + ' ' + event.request.url);
  if (event.request.method === 'POST') {
    event.respondWith(
      event.request.formData()
        .then(function(formData) {
          console.log('Received form data');
          const title = formData.get('received_title') || '';
          const text = formData.get('received_text') || '';
          const url = formData.get('received_url') || '';

          // const query = 'share-target-destination.client.html?received_title='+title;
          const query = 'share-target-destination.client.html?title='+title;
          console.log(query);

          return fetch(query);
/*
          return fetch(event.request);

      "title": "received_title",
      "text": "received_text",
      "url": "received_url"


           FormDataEntryValue? get(USVString name);
          return null; // need to return a Response*/
        }
      )
    );


    return;
  }
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
