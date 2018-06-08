'use strict';

const {ApiBuild} = require('../lib/build');
const assert = require('chai').assert;
const {OptionsTestBuilder} = require('./options-test-builder');
const fs = require('fs-extra');

const API_URL = 'https://domain.com/api.raml';
const LOCAL_API_URL = 'test/api.raml';
const API_TYPE = 'RAML 1.0';
const OUTPUT_DIR = './test/some';
const PROXY = 'http://proxy.org';
const THEME_FILE = 'theme-file.html';

describe('api-console-cli', () => {
  describe('Builder', () => {
    describe('Local API file', () => {
      describe('options validation for defaults', () => {
        let options;
        let build;

        before(function() {
          const args = [];
          return OptionsTestBuilder.optionsForBuild(args)
          .then((opts) => {
            build = new ApiBuild(opts);
            options = build._prepareOptions(opts);
          });
        });

        [
          'api',
          'apiType',
          'destination',
          'embedded',
          'attributes',
          'tagName',
          'themeFile',
          'oauth',
          'cryptoJs',
          'jsPolyfills',
          'xhr',
          'webAnimations',
          'cache'
        ].forEach((item) => {
          it(`Does not set ${item}`, function() {
            assert.isUndefined(options[item]);
          });
        });
      });

      describe('options validation for set values', () => {
        let options;
        let build;

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
          const args = [];
          args.push('-a');
          args.push(LOCAL_API_URL);
          args.push('-t');
          args.push(API_TYPE);
          args.push('--output');
          args.push(OUTPUT_DIR);
          args.push('--embedded');
          args.push('--verbose');
          args.push('--theme-file');
          args.push(THEME_FILE);
          args.push('--attr');
          args.push('proxy:' + PROXY);
          args.push('--attr');
          args.push('narrow');
          args.push('--no-oauth');
          args.push('--no-crypto-js');
          args.push('--no-js-polyfills');
          args.push('--no-xhr');
          args.push('--no-web-animations');
          args.push('--no-cache');
          return OptionsTestBuilder.optionsForBuild(args)
          .then((opts) => {
            build = new ApiBuild(API_URL, opts);
            options = build._prepareOptions(opts);
          });
        });

        it('Sets API file location', function() {
          assert.equal(options.api, LOCAL_API_URL);
        });

        it('Sets API type', function() {
          assert.equal(options.apiType, API_TYPE);
        });

        it('The destination should be set', function() {
          assert.equal(options.destination, OUTPUT_DIR);
        });

        it('Sets theme file', function() {
          assert.equal(options.themeFile, THEME_FILE);
        });

        [
          'embedded',
          'verbose',
          'noOauth',
          'noCryptoJs',
          'noJsPolyfills',
          'noXhr',
          'noWebAnimations',
          'noCache'
        ].forEach((item) => {
          it(`Sets ${item} to true`, function() {
            assert.isTrue(options[item]);
          });
        });

        it('Attribute with value should be set', function() {
          const proxy = findAttribute('proxy');
          assert.ok(proxy);
        });

        it('Attribute\'s name should be set', function() {
          const proxy = findAttribute('proxy');
          assert.equal(proxy.name, 'proxy');
        });

        it('Attribute\'s value should be set', function() {
          const proxy = findAttribute('proxy');
          assert.equal(proxy.value, 'http://proxy.org');
        });

        it('Boolean attribute should be set', function() {
          const narrow = findAttribute('narrow');
          assert.typeOf(narrow, 'string');
        });
      });

      describe('Performs the build', function() {
        let build;
        before(function() {
          const args = [];
          args.push('-a');
          args.push(LOCAL_API_URL);
          args.push('-t');
          args.push(API_TYPE);
          args.push('-n');
          args.push('5.0.0-preview');
          args.push('--output');
          args.push(OUTPUT_DIR);
          args.push('--verbose');
          return OptionsTestBuilder.optionsForBuild(args)
          .then((opts) => {
            build = new ApiBuild(opts);
          });
        });

        after(function() {
          return fs.remove(OUTPUT_DIR);
        });

        it('Builds the console', function() {
          this.timeout(500000);
          return build.run();
        });
      });
    });
  });
});
