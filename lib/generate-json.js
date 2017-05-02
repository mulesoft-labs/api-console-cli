'use strict';

const fs = require('fs');
const ApiBase = require('./api-base').ApiBase;
const parser = require('raml-1-parser');
const {RamlJsonEnhancer} = require('raml-json-enhance-node');

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
    /**
     * The RAML source file.
     */
    this._sourceFile = raml;
    /**
     * A JSON file name and path.
     */
    this._targetFile = opts.output || 'api.json';
    /**
     * If true, then the output JSON will be formatted.
     */
    this.prettyPrint = opts.prettyPrint || false;
  }

  /**
   * Runs the command.
   */
  run() {
    this.log('Generating JSON file from %s', this._targetFile);
    return this.parse()
    .then((json) => this.enhance(json))
    .then((json) => this.save(json));
  }
  /**
   * Pasrses the RAML file and generates JSON.
   *
   * @return {Object} The `specification` property of RAML's JSON generator.
   */
  parse() {
    this.log('Parsing RAML...');
    return parser.loadApi(this._sourceFile)
    .then(api => {
      return api.expand(true)
      .toJSON({
        dumpSchemaContents: false,
        rootNodeDetails: true,
        serializeMetadata: false
      }).specification;
    });
  }

  enhance(json) {
    this.log('Enhancing JSON...');
    const enhancer = new RamlJsonEnhancer();
    return enhancer.enhance(json);
  }

  save(json) {
    this.log('Saving to %s...', this._targetFile);
    return new Promise((resolve, reject) => {
      if (this.prettyPrint) {
        json = JSON.stringify(json, null, 2);
      } else {
        json = JSON.stringify(json);
      }
      fs.writeFile(this._targetFile, json, 'utf8', function(err) {
        if (err) {
          reject(new Error(err.message));
          return;
        }
        resolve();
      });
    });
  }
}

exports.JsonGenerator = JsonGenerator;
