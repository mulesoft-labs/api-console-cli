'use strict';

const {JsonGenerator} = require('../lib/generate-json');
const assert = require('chai').assert;
const fs = require('fs-extra');

const RAML_FILE = 'test/api.raml';
const DEFAULT_JSON_FILE = './api.json';
const OTHER_JSON_FILE = './api-other.json';

describe('api-console-cli', function() {
  describe('JsonGenerator', function() {

    it('Throws when daml is not defined', function() {
      assert.throws(function() {
        new JsonGenerator();
      });
    });

    it('Generates the default file', function() {
      const generator = new JsonGenerator(RAML_FILE);
      return generator.run()
      .then(() => fs.pathExists(DEFAULT_JSON_FILE))
      .then(exists => assert.isTrue(exists))
      .then(() => fs.remove(DEFAULT_JSON_FILE));
    });

    it('Generates specific file', function() {
      const generator = new JsonGenerator(RAML_FILE, {
        output: OTHER_JSON_FILE
      });
      return generator.run()
      .then(() => fs.pathExists(OTHER_JSON_FILE))
      .then(exists => assert.isTrue(exists))
      .then(() => fs.remove(OTHER_JSON_FILE));
    });
  });
});
