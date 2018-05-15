'use strict';

self.addEventListener('fetch', function(event) {
  const handleClientSide = false;

  // Ideally, share-target-destination.template.html would be cached in advance.
  function respondToShare(event) {
    event.respondWith(
      fetch('share-target-destination.template.html')
        .then(function (response) {
          return response.text()
            .then(function(page) {

              return event.request.formData()
                .then(function(formData) {
                  const title = formData.get('received_title') || '';
                  const text = formData.get('received_text') || '';
                  const url = formData.get('received_url') || '';

                  const init = {
                      status: 200,
                      statusText: "OK",
                      headers: {'Content-Type': 'text/html'}
                  };

                  const body = page
                    .replace('{{generation_location}}', 'client-side')
                    .replace("'{{received_title}}'", JSON.stringify(title))
                    .replace("'{{received_text}}'", JSON.stringify(text))
                    .replace("'{{received_url}}'", JSON.stringify(url));

                  return new Response(body, init);
                })
            })
        })
    );
  }

  // console.log('Received fetch event: ' + event.request.method + ' ' + event.request.url);
  if (event.request.method === 'POST' && handleClientSide) {
    respondToShare(event);
    return;
  }
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
