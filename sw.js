'use strict';

(() => {

let handleClientSide = true;

self.addEventListener('fetch', function(event) {

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

                  let body = page
                    .replace('{{generation_location}}', 'client-side')
                    .replace("{{received_title}}", title)
                    .replace("{{received_text}}", text)
                    .replace("{{received_url}}", url);

                  const file_fields = [
                    "received_html_files",
                    "received_css_files"
                  ];

                  let field_index = 0;

                  let files = undefined;
                  let file_contents = '';
                  let index = 0;

                  function prepareField() {
                    files = formData.getAll(file_fields[field_index]); // sequence of File objects
                    file_contents = '';
                    index = 0;
                  }

                  prepareField();

                  return new Promise(function(resolve, reject) {
                    function progress() {
                      while (index === files.length) {
                        body = body
                          .replace('{{' + file_fields[field_index] + '}}', file_contents);

                        ++field_index;
                        if (field_index === file_fields.length) {
                          resolve(new Response(body, init));
                          return;
                        }
                        prepareField();
                      }

                      const fileReader = new FileReader();
                      fileReader.onload = function(fileLoadedEvent) {
                        const textFromFileLoaded = fileLoadedEvent.target.result;
                        if (index > 0) {
                          file_contents += ', ';
                        }
                        file_contents += textFromFileLoaded;
                        index += 1;
                        progress();
                      };
                      fileReader.readAsText(files[index], "UTF-8");
                    }

                    progress();
                  });
                })
            })
        })
    );
  }

  // console.log('Received fetch event: ' + event.request.method + ' ' + event.request.url);
  if (event.request.method === 'POST') {
    const url = event.request.url;
    if (url.endsWith('/client')) {
      handleClientSide = true;
      event.respondWith(
        fetch('share-target-destination.template.html'));
      return;
    } else if (url.endsWith('/server')) {
      handleClientSide = false;
      event.respondWith(
        fetch('share-target-destination.template.html'));
      return;
    } else if (handleClientSide) {
      respondToShare(event);
      return;
    }
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

})();
