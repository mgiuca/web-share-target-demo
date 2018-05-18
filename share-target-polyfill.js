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
              console.log('params[key] ' + params[key] + ', event.data[key] ' + event.data[key]);
            }
          }

          if (params['file'] && params['file'].length > 0 && params['file'][0]['name'] && event.data['file']) {
            const name = params['file'][0]['name'];
            const value = event.data['file'][0];
            const filename = value.name;
            console.log('name ' + name + ', filename ' + filename + ' (' + value.size + ' bytes)');
            formData.append(name, value, filename);
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

