import { assert } from 'chai';
import path from 'path';
import fs from 'fs-extra';
import sinon from 'sinon';
import { Serve, headersValue } from '../lib/serve/Serve.js';
/* eslint-disable no-empty-function */
/* eslint-disable require-jsdoc */

describe('Serve', () => {
  const workingDir = path.join('test', 'serve');

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
        // @ts-ignore
        assert.equal(instance[name], value);
      });
    });
  });

  describe('setRootPath()', () => {
    after(async () => fs.remove('build'));

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
      assert.deepEqual(serve[headersValue], {});
    });

    it('sets headers passed in options', () => {
      serve.headers = [{ name: 'a', value: 'b' }, { name: 'c', value: 'd' }];
      serve.setHeaders();
      assert.deepEqual(serve[headersValue], {
        a: 'b',
        c: 'd',
      });
    });

    it('appends non-unique headers', () => {
      serve.headers = [{ name: 'a', value: 'b' }, { name: 'a', value: 'c' }];
      serve.setHeaders();
      assert.deepEqual(serve[headersValue], {
        a: 'b, c',
      });
    });
  });

  describe('stopServer()', () => {
    let serve;
    beforeEach(() => {
      serve = new Serve();
    });

    it('does nothing when no server is created', () => {
      serve.stopServer();
    });

    it('closes the server when created', () => {
      // this just checks whether a function is called to not to create a server
      const server = { close: () => {
        // ...
      } };
      const spy = sinon.spy(server, 'close');
      serve.server = server;
      serve.stopServer();
      assert.isTrue(spy.called);
    });

    it('clears the server variable', () => {
      const server = { close: () => {
        // ...
      } };
      serve.server = server;
      serve.stopServer();
      assert.isUndefined(serve.server);
    });
  });

  describe('_requestHandler()', () => {
    let serve;
    let req;
    let res;
    const f = () => {
      // ...
    };
    beforeEach(async () => {
      serve = new Serve({
        root: path.resolve(workingDir),
        entrypoint: 'index.html',
      });
      req = { url: '' };
      res = { writeHead: f, end: f };
      await serve.setDefaults();
    });

    afterEach(async () => fs.remove(workingDir));

    it('calls _send404() when url is not found', async () => {
      const spy = sinon.spy(serve, '_send404');
      await serve._requestHandler(req, res);
      assert.isTrue(spy.called);
    });

    it('calls _send404() when url is a directory', async () => {
      const loc = path.join(workingDir, 'dir');
      await fs.ensureDir(loc);
      const spy = sinon.spy(serve, '_send404');
      req.url = '/dir';
      await serve._requestHandler(req, res);
      assert.isTrue(spy.called);
    });

    it('returns a content of a file', async () => {
      const file = path.join(workingDir, 'file.js');
      await fs.ensureFile(file);
      await fs.writeFile(file, 'test', 'utf8');
      const spy = sinon.spy(res, 'end');
      req.url = '/file.js';
      await serve._requestHandler(req, res);
      const [content] = spy.args[0];
      assert.equal(content.toString(), 'test');
    });

    it('writes 200 status', async () => {
      const file = path.join(workingDir, 'file.js');
      await fs.ensureFile(file);
      await fs.writeFile(file, 'test', 'utf8');
      const spy = sinon.spy(res, 'writeHead');
      req.url = '/file.js';
      await serve._requestHandler(req, res);
      const [status] = spy.args[0];
      assert.equal(status, 200);
    });

    it('uses "entrypoint" as default index file', async () => {
      const file = path.join(workingDir, 'index.html');
      await fs.ensureFile(file);
      await fs.writeFile(file, 'test', 'utf8');
      const spy = sinon.spy(res, 'end');
      req.url = '/';
      await serve._requestHandler(req, res);
      const [content] = spy.args[0];
      assert.equal(content.toString(), 'test');
    });

    [
      ['index.html', 'text/html'],
      ['file.js', 'application/javascript'],
      ['style.css', 'text/css'],
    ].forEach(([fileName, mime]) => {
      it(`returns ${mime} content type for ${fileName}`, async () => {
        const file = path.join(workingDir, fileName);
        await fs.ensureFile(file);
        await fs.writeFile(file, 'test', 'utf8');
        const spy = sinon.spy(res, 'writeHead');
        req.url = `/${fileName}`;
        await serve._requestHandler(req, res);
        const headers = spy.args[0][1];
        assert.equal(headers['content-type'], mime);
      });
    });

    it('adds headers to the response', async () => {
      serve.headers = [{
        name: 'a',
        value: 'b',
      }];
      await serve.setDefaults();
      const file = path.join(workingDir, 'index.html');
      await fs.ensureFile(file);
      await fs.writeFile(file, 'test', 'utf8');
      const spy = sinon.spy(res, 'writeHead');
      req.url = '/';
      await serve._requestHandler(req, res);
      const headers = spy.args[0][1];
      assert.equal(headers.a, 'b');
    });
  });

  describe('_create()', () => {
    let serve;
    beforeEach(async () => {
      serve = new Serve({
        root: path.resolve(workingDir),
        entrypoint: 'index.html',
      });
      await serve.setDefaults();
    });

    it('creates a server', async () => {
      await serve._create();
      assert.ok(serve.server);
      serve.stopServer();
    });
  });
});
