'use strict';

const {ApiServe} = require('../lib/serve');
const assert = require('chai').assert;

describe('api-console-cli', () => {
  describe('ApiServe', () => {
    describe('_applyOpts()', () => {

      var args = ['root', 'entrypoint', 'port', 'hostname', 'open', 'openPath'];

      args.forEach((argument) => {
        it(`Sets ${argument} from option argument`, function() {
          var opts = {};
          opts[argument] = 'test';
          var serve = new ApiServe(opts);
          assert.equal(serve.opts[argument], 'test');
        });
      });

      it('Sets root from args', function() {
        var opts = {
          args: ['test']
        };
        var serve = new ApiServe(opts);
        assert.equal(serve.opts.root, 'test');
      });

      it('Option root takes precedense over root from args', function() {
        var opts = {
          root: 'test1',
          args: ['test2']
        };
        var serve = new ApiServe(opts);
        assert.equal(serve.opts.root, 'test1');
      });

      it(`Sets browser from option argument`, function() {
        var opts = {
          browser: ['test']
        };
        var serve = new ApiServe(opts);
        assert.deepEqual(serve.opts.browser, ['test']);
      });

      it(`Sets protocol from option argument`, function() {
        var opts = {
          protocol: 'https'
        };
        var serve = new ApiServe(opts);
        assert.deepEqual(serve.opts.protocol, 'https');
      });

      it(`Sets protocol to http by default`, function() {
        var serve = new ApiServe({});
        assert.deepEqual(serve.opts.protocol, 'http');
      });
    });
  });
});
