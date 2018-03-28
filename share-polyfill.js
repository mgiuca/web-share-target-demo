'use strict';

navigator.share = (data) => {
  return new Promise((resolve, reject) => {
    if ('title' in data || 'text' in data || 'url' in data) {
      window.parent.postMessage(data, '*');
      setTimeout(resolve, 0);
    } else {
      console.log('Share request is invalid');
      setTimeout(reject, 0, new TypeError('Please set title, text and/or url'));
    }
  });
};
