<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, minimum-scale=1, initial-scale=1, user-scalable=yes">
    <title>[[API-TITLE]]</title>
    <script>
      window.Polymer = {
        dom: 'shadow'
      };
      (function() {
        'use strict';
        var onload = function() {
          if (!window.HTMLImports) {
            document.dispatchEvent(
              new CustomEvent('WebComponentsReady', {bubbles: true})
            );
          }
        };
        var webComponentsSupported = (
          'registerElement' in document &&
          'import' in document.createElement('link') &&
          'content' in document.createElement('template')
        );
        if (!webComponentsSupported) {
          var script = document.createElement('script');
          script.async = true;
          script.src = '/bower_components/webcomponentsjs/webcomponents-lite.min.js';
          script.onload = onload;
          document.head.appendChild(script);
        } else {
          onload();
        }
      })();
    </script>
    <link rel="import" href="api-console.html">
    <link rel="import" href="bower_components/fetch-polyfill/fetch-polyfill.html">
    <link rel="import" href="bower_components/promise-polyfill/promise-polyfill.html">
  </head>
<body>
  <api-console></api-console>
  <raml-js-parser json></raml-js-parser>
  <raml-json-enhance></raml-json-enhance>
  <script>
  function notifyInitError(message) {
    window.alert('Cannot initialize API console. ' + message);
  }

  function init() {
    var parser = document.querySelector('raml-js-parser');
    parser.addEventListener('api-parse-ready', function(e) {
      var enhacer = document.querySelector('raml-json-enhance');
      enhacer.json = e.detail.json.specification;
    });
    document.querySelector('raml-json-enhance')
    .addEventListener('error', function(e) {
      notifyInitError(e.detail.message);
    });
    window.addEventListener('raml-json-enhance-ready', function(e) {
      var apiConsole = document.querySelector('api-console');
      apiConsole.json = e.detail.json;
    });
    parser.loadApi('[[API-FILE-URL]]')
    .catch(function(cause) {
      notifyInitError(cause.message);
    });
  }
  window.addEventListener('WebComponentsReady', init);
  </script>
</body>
</html>
