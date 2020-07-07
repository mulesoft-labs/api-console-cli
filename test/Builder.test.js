import { assert } from 'chai';
import { Builder } from '../lib/builder/Builder.js';

describe('Builder', () => {
  describe('constructor()', () => {
    it('sets opts', () => {
      const opts = { test: true };
      // @ts-ignore
      const instance = new Builder(opts);
      assert.deepEqual(instance.opts, opts);
    });
  });

  describe('translateOptions()', () => {
    let build;
    beforeEach(() => {
      build = new Builder();
    });

    [
      ['tagName', 'tagName', '1.0.0'],
      ['api', 'api', 'file'],
      ['apiType', 'apiType', 'type'],
      ['apiMediaType', 'apiMediaType', 'mime'],
      ['output', 'destination', 'dist'],
      ['theme', 'themeFile', 'css'],
      ['index', 'indexFile', 'html'],
      ['appTitle', 'appTitle', 'title'],
      ['verbose', 'verbose', true],
      ['noCache', 'noCache', true],
      ['strict', 'strict', true],
    ].forEach(([optName, resName, value]) => {
      it(`sets ${resName} option`, () => {
        const options = {};
        options[optName] = value;
        const result = build.translateOptions(options);
        // @ts-ignore
        assert.equal(result[resName], value);
      });
    });

    it(`sets attributes option`, () => {
      const options = {
        attr: [{ name: 'a', value: 'b' }],
      };
      const result = build.translateOptions(options);
      assert.deepEqual(result.attributes, [{ a: 'b' }]);
    });
  });
});
