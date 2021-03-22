/* exported assetLoader */
/* global swan */

var assetLoader = (function () {
  function formatResponse(xhr) {
    if (xhr.response && typeof xhr.response === 'object') {
      return xhr.response;
    } if (xhr.response && typeof xhr.response === 'string') {
      return JSON.parse(xhr.response);
    } if (xhr.responseText) {
      return JSON.parse(xhr.responseText);
    }
    return null;
  }

  function loadAsset(path, callback, errorCallback) {
    if (swan) {
      var cache = swan.getStorageSync(path);
      if (cache) {
        callback(cache);
        return;
      }
    }
    var response;
    var xhr = new XMLHttpRequest();
    // set responseType after calling open or IE will break.
    try {
      // This crashes on Android WebView prior to KitKat
      xhr.responseType = 'json';
    } catch (err) {} // eslint-disable-line no-empty
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          response = formatResponse(xhr);
          callback(response);
          if (swan) {
            swan.setStorageSync(path, response);
          }
        } else {
          try {
            response = formatResponse(xhr);
            callback(response);
            if (swan) {
              swan.setStorageSync(path, response);
            }
          } catch (err) {
            if (errorCallback) {
              errorCallback(err);
            }
          }
        }
      }
    };
    xhr.open('GET', path, true);
    xhr.send();
  }
  return {
    load: loadAsset,
  };
}());
