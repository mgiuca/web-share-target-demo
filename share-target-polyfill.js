'use strict';

(() => {
  function receiveMessage(event) {
    const manifestURL = document.querySelector('link[rel=manifest]').href;

    // console.log('Fetching manifest ' + manifestURL);
    fetch(manifestURL)
    .then((response) => {
      // console.log('Fetched manifest ' + manifestURL);
      return response.json();
    })
    .then((myJson) => {
      if (myJson.share_target && myJson.share_target.action && myJson.share_target.params) {
        const action = myJson.share_target.action;
        const method = (myJson.share_target.method || '').toUpperCase();
        const params = myJson.share_target.params;
        if (method === 'POST') {
          // Use XMLHttpRequest.
          const formData = new FormData();
          for (let key of ['title', 'text', 'url']) {
            if (params[key] && event.data[key]) {
              formData.append(params[key], event.data[key]);
              // console.log('params[key] ' + params[key] + ', event.data[key] ' + event.data[key]);
            }
          }

          if (params['files'] && event.data['files']) {
            // TODO: never append the same file more than once.
            for (let i = 0; i < params['files'].length; ++i) {
              for (let j = 0; j < event.data['files'].length; ++j) {
                const name = params['files'][i]['name'];
                const value = event.data['files'][j];
                const filename = value.name;
                console.log('name ' + name + ', filename ' + filename + ' (' + value.size + ' bytes)');
                formData.append(name, value, filename);
              }
            }
          }

          const xhr = new XMLHttpRequest();
          xhr.open("POST", action);
          // xhr.setRequestHeader("Content-Type","multipart/form-data");
          xhr.onload = function() {
            if (xhr.status !== 200) {
              console.log('XMLHttpRequest failed');
              return;
            }
            document.getElementById('target').contentWindow.document.documentElement.innerHTML = xhr.responseText;
          };
          xhr.send(formData);
        } else {
          const pairs = [];
          for (let key of ['title', 'text', 'url']) {
            if (params[key] && event.data[key]) {
              pairs.push(encodeURIComponent(params[key]) + '=' + encodeURIComponent(event.data[key]));
            }
          }
          const url = action + '?' + pairs.join('&');
          console.log('URL = "' + url + '"');
          document.getElementById('target').contentWindow.location.href = url;
        }
      }
    });
  }

  window.addEventListener("message", receiveMessage, false);
})();

