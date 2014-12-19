var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

function parseIfJSON(data) {
  try {
    return JSON.parse(data);
  } catch (e) {
    return data;
  }
}

function xhr(type, url, data) {
  var callbacks = {
    success: [],
    error: []
  };

  var request = XMLHttpRequest ?
    new XMLHttpRequest() :
    new ActiveXObject('MSXML2.XMLHTTP.3.0');

  request.open(type, url, true);
  request.setRequestHeader(
    'Content-type',
    'application/json'
  );
  request.setRequestHeader(
    'Access-Control-Allow-Origin',
    '*'
  );

  request.onreadystatechange = function() {
    if (request.readyState === 4) {
      var invokeCallback = function(callback) {
        callback.call(undefined, parseIfJSON(request.responseText), request);
      };

      if (request.status > 99 && request.status < 400) {
        callbacks.success.forEach(invokeCallback);
      } else {
        callbacks.error.forEach(invokeCallback);
      }
    }
  };

  request.send(data);

  return {
    success: function(callback) {
      callbacks.success.push(callback);
    },
    error: function(callback) {
      callbacks.error.push(callback);
    }
  }
}

module.exports = xhr;