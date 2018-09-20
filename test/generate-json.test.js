'use strict';

const {JsonGenerator} = require('../lib/generate-json');
const assert = require('chai').assert;
const fs = require('fs-extra');
const path = require('path');

const workingDir = path.join('test', 'parsing-test');

describe('JsonGenerator', function() {
  this.timeout(500000);

  it('Throws when API file is not defined', function() {
    assert.throws(function() {
      new JsonGenerator();
    });
  });

  [
    ['RAML 0.8', 'api-raml-08.raml', 'YAML'],
    ['RAML 1.0', 'api-raml-10.raml', 'YAML'],
    ['OAS 2.0', 'api-oas-20.json', 'JSON'],
    ['OAS 2.0', 'api-oas-20.yaml', 'YAML'],
    ['OAS 3.0', 'api-oas-30.yaml', 'YAML']
  ].forEach((item) => {
    after(function() {
      return fs.remove(workingDir);
    });

    it('Generates from: ' + item[0] + ', format: ' + item[2], function() {
      const output = path.join(workingDir, 'api-model.json');
      const generator = new JsonGenerator('test/test-apis/' + item[1], {
        apiType: item[0],
        output,
        verbose: true
      });
      return generator.run()
      .then(() => fs.readJson(output))
      .then((model) => {
        assert.typeOf(model, 'array', 'Model is saved');
        const api = model[0];
        assert.typeOf(api['@context'], 'object', 'Model is compact');
      });
    });
  });
});
