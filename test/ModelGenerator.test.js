import { assert } from 'chai';
import fs from 'fs-extra';
import path from 'path';
import { ModelGenerator } from '../lib/generate-json/ModelGenerator.js';

describe('JsonGenerator', function() {
  const workingDir = path.join('test', 'generate-json');
  const output = path.join(workingDir, 'model.json');

  describe('constructor()', () => {
    it('sets output', () => {
      const instance = new ModelGenerator({ output });
      assert.equal(instance.output, output);
    });

    it('sets file as source', () => {
      const file = 'test-api.raml';
      const instance = new ModelGenerator({ file });
      assert.equal(instance.source, file);
    });

    it('sets apiType as type', () => {
      const apiType = 'test-api.raml';
      const instance = new ModelGenerator({ apiType });
      assert.equal(instance.type, apiType);
    });

    it('sets apiMediaType as mime', () => {
      const apiMediaType = 'test/plain';
      const instance = new ModelGenerator({ apiMediaType });
      assert.equal(instance.mime, apiMediaType);
    });

    it('sets pipeline', () => {
      const pipeline = 'custom';
      const instance = new ModelGenerator({ pipeline });
      assert.equal(instance.pipeline, pipeline);
    });

    it('sets default as mime', () => {
      const instance = new ModelGenerator({});
      assert.equal(instance.mime, 'application/yaml');
    });

    it('sets default pipeline', () => {
      const instance = new ModelGenerator({});
      assert.equal(instance.pipeline, 'editing');
    });
  });

  describe('parsing an API', () => {
    [
      ['RAML 0.8', 'api-raml-08.raml'],
      ['RAML 1.0', 'api-raml-10.raml'],
      ['OAS 2.0', 'api-oas-20.json', 'application/json'],
      ['OAS 2.0', 'api-oas-20.yaml'],
      ['OAS 3.0', 'api-oas-30.yaml']
    ].forEach(([type, file, mime]) => {
      it(`generates API model for ${type}`, async () => {
        const output = path.join(workingDir, 'api-model.json');
        const apiLocation = path.join('test', 'test-apis', file);
        const instance = new ModelGenerator({
          output,
          file: apiLocation,
          apiType: type,
          apiMediaType: mime,
        });
        await instance.run();
        const contents = await fs.readJson(output);
        assert.typeOf(contents, 'array', 'Model is saved');
      });
    });
  });
});
