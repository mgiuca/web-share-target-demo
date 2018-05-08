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
          const form = document.createElement('form');
          form.action = action;
          form.method = 'POST';
          for (let key of ['title', 'text', 'url']) {
            if (params[key] && event.data[key]) {
              const input = document.createElement('input');
              input.type = 'hidden';
              input.id = params[key];
              input.name = params[key];
              input.value = event.data[key];
              form.appendChild(input);
            }
          }
          const targetBody = document.getElementById('target').contentWindow.document.body;
          targetBody.appendChild(form);
          form.submit();
          targetBody.removeChild(form);
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
      } else if (myJson.share_target && myJson.share_target.url_template) {
        // e.g. "url_template": "share-target-destination.html?received_title={title}&received_text={text}&received_url={url}"
        let url = myJson.share_target.url_template;
        let length = url.length;
        for (;;) {
          const index = url.lastIndexOf('{', length);
          const endIndex = url.lastIndexOf('}', length);
          if (index < 0 && endIndex < 0) {
            console.log('URL = "' + url + '"');
            document.getElementById('target').contentWindow.location.href = url;
            return;
          }
          if (index < 0 || endIndex <= index) {
            return; // Unmatched { or }.
          }
          const key = url.substring(index + 1, endIndex);
          const data = (new Set(['title', 'text', 'url']).has(key) && event.data[key]) || '';
          url = url.substring(0, index) + encodeURIComponent(data) + url.substring(endIndex + 1);
          length = index;
        }
      }
    });
  }

  window.addEventListener("message", receiveMessage, false);
})();

