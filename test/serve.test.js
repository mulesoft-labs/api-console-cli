import { assert } from 'chai';
import path from 'path';
import fs from 'fs-extra';
import sinon from 'sinon';
import { Serve } from '../lib/serve/Serve.js';

describe.only('JsonGenerator', function() {
  describe('constructor()', () => {
    [
      ['root', 'test-root'],
      ['entrypoint', 'test-entrypoint'],
      ['hostname', 'test-hostname'],
      ['port', 8080],
      ['open', true],
      ['headers', [{ name: 'a', value: 'b' }]],
    ].forEach(([name, value]) => {
      it(`sets ${name} property`, () => {
        const opts = {};
        opts[name] = value;
        const instance = new Serve(opts);
        assert.equal(instance[name], value);
      });
    });
  });

  describe('setRootPath()', () => {
    after(async () => await fs.remove('build'));

    it('sets a default path', async () => {
      const instance = new Serve();
      await instance.setRootPath();
      assert.equal(instance.root, path.resolve('.'));
    });

    it('sets build/ when exists', async () => {
      await fs.ensureDir('build');
      const instance = new Serve();
      await instance.setRootPath();
      assert.equal(instance.root, path.resolve('build'));
    });

    it('sets set path', async () => {
      const root = 'test';
      const instance = new Serve({ root });
      await instance.setRootPath();
      assert.equal(instance.root, path.resolve(root));
    });
  });

  describe('setHeaders()', () => {
    let serve;
    beforeEach(() => {
      serve = new Serve();
    });

    it('sets empty object when no headers are set', () => {
      serve.setHeaders();
      assert.deepEqual(serve.headers, {});
    });

    it('sets headers passed in options', () => {
      serve.headers = [{ name: 'a', value: 'b' }, { name: 'c', value: 'd' }];
      serve.setHeaders();
      assert.deepEqual(serve.headers, {
        a: 'b',
        c: 'd',
      });
    });

    it('appends non-unique headers', () => {
      serve.headers = [{ name: 'a', value: 'b' }, { name: 'a', value: 'c' }];
      serve.setHeaders();
      assert.deepEqual(serve.headers, {
        a: 'b, c',
      });
    });
  });

  describe.only('stopServer()', () => {
    let serve;
    beforeEach(() => {
      serve = new Serve();
    });

    it('does nothing when no server is created', () => {
      serve.stopServer();
    });

    it('closes the server when created', () => {
      // this just checks whether a function is called to not to create a server
      const server = { close: function() {} };
      const spy = sinon.spy(server, 'close');
      serve.server = server;
      serve.stopServer();
      assert.isTrue(spy.called);
    });

    it('clears the server variable', () => {
      const server = { close: function() {} };
      serve.server = server;
      serve.stopServer();
      assert.isUndefined(serve.server);
    });
  });
});
