'use strict';

const {ApiDev} = require('../lib/dev');
const assert = require('chai').assert;
const {OptionsTestDev} = require('./options-test-dev');

const API_FILE = 'test-api.raml';
const PROJECT_ROOT = '../';
const HOST = '192.168.0.1';
const PORT = '8128';
const SOURCE_PATH = 'test/path';
const TAG_VERSION = 'v4.0.0-test';

describe('api-console-cli', () => {
  describe('Dev', () => {
    describe('options validation for defaults', () => {
      var options;
      var build;

      before(function() {
        var args = [];
        args.push(API_FILE);

        return OptionsTestDev.optionsForBuild(args)
        .then((opts) => {
          build = new ApiDev(API_FILE, opts);
          build.parseOptions();
          options = build.moduleOptions;
        });
      });

      it('RAML file source is set', function() {
        assert.equal(options.api, API_FILE);
      });

      it('projectRoot is set', function() {
        assert.typeOf(options.projectRoot, 'string');
      });

      it('Host is undefined', function() {
        assert.isUndefined(options.host);
      });

      it('Port is undefined', function() {
        assert.isUndefined(options.port);
      });

      it('sourceIsZip is undefined', function() {
        assert.isUndefined(options.sourceIsZip);
      });

      it('tagVersion is undefined', function() {
        assert.isUndefined(options.tagVersion);
      });

      it('src is undefined', function() {
        assert.isUndefined(options.src);
      });

      it('open is undefined', function() {
        assert.isUndefined(options.open);
      });

      it('noBower is undefined', function() {
        assert.isUndefined(options.noBower);
      });
    });

    describe('options validation for set values', () => {
      var options;
      var build;

      before(function() {
        var args = [];
        args.push('--project-root');
        args.push(PROJECT_ROOT);
        args.push('--host');
        args.push(HOST);
        args.push('--port');
        args.push(PORT);
        args.push('--open');
        args.push('--no-bower');
        args.push(API_FILE);
        return OptionsTestDev.optionsForBuild(args)
        .then((opts) => {
          build = new ApiDev(API_FILE, opts);
          build.parseOptions();
          options = build.moduleOptions;
        });
      });

      it('RAML file source is set', function() {
        assert.equal(options.api, API_FILE);
      });

      it('projectRoot is set', function() {
        assert.equal(options.projectRoot, PROJECT_ROOT);
      });

      it('host is set', function() {
        assert.equal(options.host, HOST);
      });

      it('port is set', function() {
        assert.strictEqual(options.port, Number(PORT));
      });

      it('sourceIsZip is undefined', function() {
        assert.isUndefined(options.sourceIsZip);
      });

      it('tagVersion is undefined', function() {
        assert.isUndefined(options.tagVersion);
      });

      it('src is undefined', function() {
        assert.isUndefined(options.src);
      });

      it('open is set', function() {
        assert.isTrue(options.open);
      });

      it('noBower is set', function() {
        assert.isTrue(options.noBower);
      });
    });

    describe('options validation for sources options', () => {
      var baseArgs = [API_FILE];
      var build;

      it('Source is set', function() {
        const args = Array.from(baseArgs);
        args.push('--source');
        args.push(SOURCE_PATH);
        return OptionsTestDev.optionsForBuild(args)
        .then((opts) => {
          build = new ApiDev(API_FILE, opts);
          build.parseOptions();
          assert.equal(build.moduleOptions.src, SOURCE_PATH);
        });
      });

      it('sourceIsZip is set', function() {
        const args = Array.from(baseArgs);
        args.push('--source');
        args.push(SOURCE_PATH);
        args.push('--source-is-zip');
        return OptionsTestDev.optionsForBuild(args)
        .then((opts) => {
          build = new ApiDev(API_FILE, opts);
          build.parseOptions();
          assert.isTrue(build.moduleOptions.sourceIsZip);
        });
      });

      it('tagVersion is set', function() {
        const args = Array.from(baseArgs);
        args.push('--tag');
        args.push(TAG_VERSION);
        return OptionsTestDev.optionsForBuild(args)
        .then((opts) => {
          build = new ApiDev(API_FILE, opts);
          build.parseOptions();
          assert.equal(build.moduleOptions.tagVersion, TAG_VERSION);
        });
      });
    });
  });

  describe('validation errors', () => {
    var build;
    it('Throws for remote RAML file', function() {
      const args = ['https://domain.com/api.raml'];
      return OptionsTestDev.optionsForBuild(args)
      .then((opts) => {
        build = new ApiDev(args[0], opts);
        assert.throws(function() {
          build.parseOptions();
        });
      });
    });

    it('Throws paths missmatch', function() {
      const args = ['api.raml'];
      args.push('--project-root');
      args.push('/other/path/');
      return OptionsTestDev.optionsForBuild(args)
      .then((opts) => {
        build = new ApiDev(API_FILE, opts);
        assert.throws(function() {
          build.parseOptions();
        });
      });
    });

    it('Throws for ambiguous sources', function() {
      const args = ['api.raml'];
      args.push('--tag');
      args.push(TAG_VERSION);
      args.push('--source');
      args.push(SOURCE_PATH);
      return OptionsTestDev.optionsForBuild(args)
      .then((opts) => {
        build = new ApiDev(API_FILE, opts);
        assert.throws(function() {
          build.parseOptions();
        });
      });
    });

    it('Throws for invalid use of sourceIsZip', function() {
      const args = ['api.raml'];
      args.push('--source-is-zip');
      return OptionsTestDev.optionsForBuild(args)
      .then((opts) => {
        build = new ApiDev(API_FILE, opts);
        assert.throws(function() {
          build.parseOptions();
        });
      });
    });
  });
});
