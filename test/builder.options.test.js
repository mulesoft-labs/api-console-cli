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

        it('The dest should not be undefined', function() {
          assert.isUndefined(options.dest);
        });

        it('The mainFile should not be undefined', function() {
          assert.isUndefined(options.mainFile);
        });

        it('The sourceIsZip should not be undefined', function() {
          assert.isUndefined(options.sourceIsZip);
        });

        it('The inlineJson should not be undefined', function() {
          assert.isUndefined(options.inlineJson);
        });

        it('The embedded should be not undefined', function() {
          assert.isUndefined(options.embedded);
        });

        it('The jsCompilationLevel should not be undefined', function() {
          assert.isUndefined(options.jsCompilationLevel);
        });

        it('The noOptimization should be not undefined', function() {
          assert.isUndefined(options.noOptimization);
        });

        it('The noCssOptimization should not be set', function() {
          assert.isUndefined(options.noCssOptimization);
        });

        it('The noHtmlOptimization should not be set', function() {
          assert.isUndefined(options.noHtmlOptimization);
        });

        it('The noJsOptimization should not be set', function() {
          assert.isUndefined(options.noJsOptimization);
        });

        it('The attributes should not be set', function() {
          assert.isUndefined(options.attributes);
        });

        it('The tagVersion should not be set', function() {
          assert.isUndefined(options.tagVersion);
        });
      });

      describe('options validation for set values', () => {
        var options;
        var build;

        function findAttribute(name) {
          if (!options.attributes || !(options.attributes instanceof Array)) {
            return;
          }
          for (let i = 0, len = options.attributes.length; i < len; i++) {
            let item = options.attributes[i];
            if (!item) {
              continue;
            }
            if (typeof item === 'string') {
              if (item === name) {
                return item;
              }
              continue;
            }
            let keys = Object.keys(item);
            for (let j = 0, lenKeys = keys.length; j < lenKeys; j++) {
              if (keys[j] === name) {
                return {
                  name: keys[j],
                  value: item[keys[j]]
                };
              }
            }
          }
        }

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
          args.push('-a');
          args.push('proxy:' + PROXY);
          args.push('-a');
          args.push('narrow');
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

        it('Attribute with value should be set', function() {
          var proxy = findAttribute('proxy');
          assert.ok(proxy);
        });

        it('Attribute\'s name should be set', function() {
          var proxy = findAttribute('proxy');
          assert.equal(proxy.name, 'proxy');
        });

        it('Attribute\'s value should be set', function() {
          var proxy = findAttribute('proxy');
          assert.equal(proxy.value, 'http://proxy.org');
        });

        it('Boolean attribute should be set', function() {
          var narrow = findAttribute('narrow');
          assert.typeOf(narrow, 'string');
        });
      });
    });
  });
});
