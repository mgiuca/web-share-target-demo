'use strict';

(() => {
  function receiveMessage(event) {
    const manifestURL = document.querySelector('link[rel=manifest]').href;
    console.log(manifestURL);
    fetch(manifestURL)
    .then((response) => {
      return response.json();
    })
    .then((myJson) => {
      if (myJson.share_target && myJson.share_target.url_template) {
        let url = myJson.share_target.url_template;
        let index = url.length;
        while (index >= 0) {
          index = url.lastIndexOf('{', index);
          if (index < 0) {
            console.log('URL = "' + url + '"');
            document.getElementById('target').contentWindow.location.href = url;
            return;
          }
          const endIndex = url.indexOf('}', index);
          if (endIndex < 0) {
            return;
          }
          const key = url.substring(index + 1, endIndex);
          const data = event.data[key] || '';
          url = url.substring(0, index) + encodeURIComponent(data) + url.substring(endIndex + 1);
        }
      }
    });
  }

  window.addEventListener("message", receiveMessage, false);
})();

