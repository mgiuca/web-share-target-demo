'use strict';

navigator.share = (data) => {
  console.log('Received a share request');
  console.log(data);

  return new Promise((resolve, reject) => {
    if ('title' in data || 'text' in data || 'url' in data) {
      // TBD: postMessage
      setTimeout(resolve, 0);
    } else {
      console.log('Share request is invalid');
      setTimeout(reject, 0, new TypeError('Please set title, text and/or url'));
    }
  });
};
