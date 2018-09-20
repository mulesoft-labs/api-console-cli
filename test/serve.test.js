'use strict';

const {ApiServe} = require('../lib/serve');
const assert = require('chai').assert;

describe('api-console-cli', () => {
  describe('ApiServe', () => {
    describe('_applyOpts()', () => {
      const args = ['root', 'entrypoint', 'port', 'hostname',
      'open', 'openPath'];
      args.forEach((argument) => {
        it(`Sets ${argument} from option argument`, function() {
          const opts = {};
          opts[argument] = 'test';
          const serve = new ApiServe(opts);
          assert.equal(serve.opts[argument], 'test');
        });
      });

      it('Sets root from args', function() {
        const opts = {
          args: ['test']
        };
        const serve = new ApiServe(opts);
        assert.equal(serve.opts.root, 'test');
      });

      it('Option root takes precedense over root from args', function() {
        const opts = {
          root: 'test1',
          args: ['test2']
        };
        const serve = new ApiServe(opts);
        assert.equal(serve.opts.root, 'test1');
      });

      it(`Sets browser from option argument`, function() {
        const opts = {
          browser: ['test']
        };
        const serve = new ApiServe(opts);
        assert.deepEqual(serve.opts.browser, ['test']);
      });

      it(`Sets protocol from option argument`, function() {
        const opts = {
          protocol: 'https'
        };
        const serve = new ApiServe(opts);
        assert.deepEqual(serve.opts.protocol, 'https');
      });

      it(`Sets protocol to http by default`, function() {
        const serve = new ApiServe({});
        assert.deepEqual(serve.opts.protocol, 'http');
      });
    });
  });
});
