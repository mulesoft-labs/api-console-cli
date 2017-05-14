'use strict';

const ApiBase = require('./api-base').ApiBase;
const {RamlJsonGenerator} = require('raml-json-enhance-node');

/**
 * Builds a JSON file with the API definition out from the RAML file.
 */
class JsonGenerator extends ApiBase {

  /**
   * Constructs the builder.
   *
   * @param {String} raml Target RAML file to build the console from.
   * @param {Object} opts Options passed from the command line.
   */
  constructor(raml, opts) {
    super(opts);

    if (!raml) {
      throw new Error('The RAML argument is not specified.');
    }
    this.enhancer = new RamlJsonGenerator(raml, opts);
  }

  /**
   * Runs the command.
   */
  run() {
    return this.enhancer.generate();
  }
}

exports.JsonGenerator = JsonGenerator;
