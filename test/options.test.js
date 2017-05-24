'use strict';

const {ApiBuild} = require('../lib/build');
const assert = require('chai').assert;
const {OptionsTestBuilder} = require('./options-test-builder');

const API_URL = 'https://domain.com/api.raml';
const LOCAL_API_URL = 'api.raml';
const OUTPUT_DIR = './some';
const MAIN_FILE = 'imports.html';
const COMPILATION_LEVEL = 'SIMPLE';
const PROXY = 'http://proxy.org';
const HEADERS = 'x-api: test';

describe('api-console-cli', () => {
  describe('Builder', () => {
    describe('Local API file', () => {
      describe('options validation for defaults', () => {
        var options;
        var build;

        before(function() {
          var args = [];
          args.push(LOCAL_API_URL);

          return OptionsTestBuilder.optionsForBuild(args)
          .then((opts) => {
            build = new ApiBuild(LOCAL_API_URL, opts);
            build.parseOptions();
            options = build.moduleOptions;
          });
        });

        it('API console source should equal hardcoded source url', function() {
          assert.equal(options.src, build._masterSource);
        });

        it('RAML file source is set', function() {
          assert.equal(options.raml, LOCAL_API_URL);
        });

        it('The useJson should be changed to true', function() {
          assert.isTrue(options.useJson);
        });

        it('The dest should be undefined', function() {
          assert.isUndefined(options.dest);
        });

        it('The mainFile should be undefined', function() {
          assert.isUndefined(options.mainFile);
        });

        it('The sourceIsZip should be undefined', function() {
          assert.isUndefined(options.sourceIsZip);
        });

        it('The inlineJson should be undefined', function() {
          assert.isUndefined(options.inlineJson);
        });

        it('The embedded should be undefined', function() {
          assert.isUndefined(options.embedded);
        });

        it('The jsCompilationLevel should be undefined', function() {
          assert.isUndefined(options.jsCompilationLevel);
        });

        it('The noOptimization should be undefined', function() {
          assert.isUndefined(options.noOptimization);
        });

        it('The noCssOptimization should be set', function() {
          assert.isUndefined(options.noCssOptimization);
        });

        it('The noHtmlOptimization should be set', function() {
          assert.isUndefined(options.noHtmlOptimization);
        });

        it('The noJsOptimization should be set', function() {
          assert.isUndefined(options.noJsOptimization);
        });

        it('The noTryit should be set', function() {
          assert.isUndefined(options.noTryit);
        });

        it('The narrowView should be set', function() {
          assert.isUndefined(options.narrowView);
        });

        it('The proxy should be set', function() {
          assert.isUndefined(options.proxy);
        });

        it('The proxyEncodeUrl should be set', function() {
          assert.isUndefined(options.proxyEncodeUrl);
        });

        it('The appendHeaders should be set', function() {
          assert.isUndefined(options.appendHeaders);
        });
      });

      describe('options validation for set values', () => {
        var options;
        var build;

        before(function() {
          var args = [];
          args.push(API_URL);
          args.push('--output');
          args.push(OUTPUT_DIR);
          args.push('--main-file');
          args.push(MAIN_FILE);
          args.push('--source-is-zip');
          args.push('--json');
          args.push('--inline-json');
          args.push('--embedded');
          args.push('--compilation-level');
          args.push(COMPILATION_LEVEL);
          args.push('--no-optimization');
          args.push('--no-css-optimization');
          args.push('--no-html-optimization');
          args.push('--no-js-optimization');
          args.push('--no-try-it');
          args.push('--narrow-view');
          args.push('--proxy');
          args.push(PROXY);
          args.push('--proxy-encode-url');
          args.push('--append-headers');
          args.push(HEADERS);
          return OptionsTestBuilder.optionsForBuild(args)
          .then((opts) => {
            build = new ApiBuild(API_URL, opts);
            build.parseOptions();
            options = build.moduleOptions;
          });
        });

        it('API console source should be set', function() {
          assert.equal(options.src, build._masterSource);
        });

        it('RAML file source is set', function() {
          assert.equal(options.raml, API_URL);
        });

        it('The useJson should be true', function() {
          assert.isTrue(options.useJson);
        });

        it('The destination should be set', function() {
          assert.equal(options.dest, OUTPUT_DIR);
        });

        it('The mainFile should be set', function() {
          assert.equal(options.mainFile, MAIN_FILE);
        });

        it('The sourceIsZip should be true', function() {
          assert.isTrue(options.sourceIsZip);
        });

        it('The inlineJson should be true', function() {
          assert.isTrue(options.inlineJson);
        });

        it('The embedded should be true', function() {
          assert.isTrue(options.embedded);
        });

        it('The jsCompilationLevel should equal ' + COMPILATION_LEVEL, function() {
          assert.equal(options.jsCompilationLevel, COMPILATION_LEVEL);
        });

        it('The noOptimization should be true', function() {
          assert.isTrue(options.noOptimization);
        });

        it('The noCssOptimization should be true', function() {
          assert.isTrue(options.noCssOptimization);
        });

        it('The noHtmlOptimization should be true', function() {
          assert.isTrue(options.noHtmlOptimization);
        });

        it('The noJsOptimization should be true', function() {
          assert.isTrue(options.noJsOptimization);
        });

        it('The tryIt should be true', function() {
          assert.isTrue(options.noTryit);
        });

        it('The narrowView should be true', function() {
          assert.isTrue(options.narrowView);
        });

        it('The proxy should be set', function() {
          assert.equal(options.proxy, PROXY);
        });

        it('The proxyEncodeUrl should be true', function() {
          assert.isTrue(options.proxyEncodeUrl);
        });

        it('The appendHeaders should be set', function() {
          assert.equal(options.appendHeaders, HEADERS);
        });
      });
    });
  });
});
