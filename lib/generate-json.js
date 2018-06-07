'use strict';
const amf = require('amf-client-js');
const fs = require('fs-extra');
const ApiBase = require('./api-base').ApiBase;

/**
 * Builds a JSON file with the API definition out from the RAML file.
 */
class JsonGenerator extends ApiBase {
  /**
   * Constructs the builder.
   *
   * @param {String} apiFile Target RAML file to build the console from.
   * @param {Object} opts Options passed from the command line.
   */
  constructor(apiFile, opts) {
    opts = opts || {};
    super(opts);
    if (!apiFile) {
      throw new Error('The apiFile argument is not specified.');
    }
    if (!opts.output) {
      opts.output = './api-model.json';
    }
    this.apiFile = apiFile;
    this.apiType = opts.apiType;
    this.verbose = opts.verbose;
    this.output = opts.output;
  }

  /**
   * Runs the command.
   */
  run() {
    if (this.verbose) {
      console.info(
        'Generating API model from ', this.apiFile, 'using', this.apiType, 'parser');
    }
    amf.plugins.document.WebApi.register();
    amf.plugins.document.Vocabularies.register();
    amf.plugins.features.AMFValidation.register();
    return amf.Core.init()
    .then(() => {
      const parser = amf.Core.parser(this.apiType, 'application/yaml');
      let url;
      if (this.apiFile.indexOf('http') === 0) {
        url = this.apiFile;
      } else {
        url = `file://${this.apiFile}`;
      }
      return parser.parseFileAsync(url);
    })
    .then((doc) => {
      if (this.verbose) {
        console.info('API data parsed. Resolving model using "editing" pipeline.');
      }
      const resolver = amf.Core.resolver('RAML 1.0');
      return resolver.resolve(doc, 'editing');
    })
    .then((model) => {
      if (this.verbose) {
        console.info('Storing API data model to file.', this.output);
      }
      const generator = amf.Core.generator('AMF Graph', 'application/ld+json');
      return generator.generateString(model)
      .then((data) => fs.writeFile(this.output, data, 'utf8'));
    });
  }
}

exports.JsonGenerator = JsonGenerator;
