'use strict';

self.addEventListener('fetch', function(event) {
  const handleClientSide = true;

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
                  const file = formData.get('received_file'); // File object
                  console.log('file="' + file + '"');

                  const init = {
                      status: 200,
                      statusText: "OK",
                      headers: {'Content-Type': 'text/html'}
                  };

                  let body = page
                    .replace('{{generation_location}}', 'client-side')
                    .replace("{{received_title}}", title)
                    .replace("{{received_text}}", text)
                    .replace("{{received_url}}", url);

                  if (!file) {
                    body = body
                      .replace("{{received_file}}", '');
                    return new Response(body, init);
                  }

                  return new Promise(function(resolve, reject) {
                    const fileReader = new FileReader();
                    fileReader.onload = function(fileLoadedEvent){
                      const textFromFileLoaded = fileLoadedEvent.target.result;
                      body = body
                        .replace("{{received_file}}", textFromFileLoaded);
                      resolve(new Response(body, init));
                    };
                    fileReader.readAsText(file, "UTF-8");
                  });
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
