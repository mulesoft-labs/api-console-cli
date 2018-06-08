'use strict';

const {JsonGenerator} = require('../lib/generate-json');
const assert = require('chai').assert;
const fs = require('fs-extra');

const RAML_FILE = 'test/api.raml';
const RAML_TYPE = 'RAML 1.0';
const DEFAULT_JSON_FILE = './api-model.json';
const OTHER_JSON_FILE = './api-other.json';

describe('api-console-cli', function() {
  describe('JsonGenerator', function() {
    let currentApiFile;
    it('Throws when API file is not defined', function() {
      assert.throws(function() {
        new JsonGenerator();
      });
    });

    afterEach(() => {
      if (currentApiFile) {
        return fs.remove(currentApiFile);
      }
    });

    it('Generates the default file', function() {
      const generator = new JsonGenerator(RAML_FILE, {
        apiType: RAML_TYPE
      });
      currentApiFile = DEFAULT_JSON_FILE;
      return generator.run()
      .then(() => fs.pathExists(DEFAULT_JSON_FILE))
      .then((exists) => assert.isTrue(exists));
    });

    it('Generates specific file', function() {
      currentApiFile = OTHER_JSON_FILE;
      const generator = new JsonGenerator(RAML_FILE, {
        output: OTHER_JSON_FILE,
        apiType: RAML_TYPE
      });
      return generator.run()
      .then(() => fs.pathExists(OTHER_JSON_FILE))
      .then((exists) => assert.isTrue(exists));
    });
  });
});
