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
  <script>
  function init() {
    var apiConsole = document.querySelector('api-console');
    apiConsole.json = [[API-DATA]];
  }
  window.addEventListener('WebComponentsReady', init);
  </script>
</body>
</html>
