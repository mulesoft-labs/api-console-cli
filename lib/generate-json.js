'use strict';
const amf = require('amf-client-js');
const fs = require('fs-extra');
const ApiBase = require('./api-base').ApiBase;
const path = require('path');
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
    super(opts);
    if (!apiFile) {
      throw new Error('The apiFile argument is not specified.');
    }
    if (!this.opts.output) {
      this.opts.output = './api-model.json';
    }
    this.apiFile = apiFile;
    this.apiType = this.opts.apiType;
    this.output = this.opts.output;
  }
  /**
   * Runs the command.
   *
   * @return {Promise}
   */
  run() {
    let msg = 'Generating API model from ' + this.apiFile;
    msg += ' using ' + this.apiType + ' parser';
    this.logger.info(msg);

    amf.plugins.document.WebApi.register();
    amf.plugins.document.Vocabularies.register();
    amf.plugins.features.AMFValidation.register();
    return amf.Core.init()
    .then(() => this._parse(this.apiFile, this.apiType))
    .then((doc) => this._validate(doc, this.apiType))
    .then((doc) => this._resolve(doc, this.apiType))
    .then((doc) => this._save(doc, this.output));
  }
  /**
   * Parses API file to AMF graph.
   * @param {String} location API file location
   * @param {String} type API type.
   * @return {Promise} Promise resolved to AMF model.
   */
  _parse(location, type) {
    this.logger.info('AMF ready.');
    this.logger.info('Running API parser...');
    const parser = amf.Core.parser(type, 'application/yaml');
    let url;
    if (location.indexOf('http') === 0) {
      url = location;
    } else {
      url = `file://${location}`;
    }
    return parser.parseFileAsync(url);
  }
  /**
   * Validates API graph
   * @param {Object} doc Parsed document
   * @param {String} type API type.
   * @return {Promise} Promise resolved to the same document.
   */
  _validate(doc, type) {
    this.logger.info('API parsed.');
    this.logger.info('Validating API...');
    let validateProfile;
    switch (type) {
      case 'RAML 1.0': validateProfile = amf.ProfileNames.RAML; break;
      case 'RAML 0.8': validateProfile = amf.ProfileNames.RAML08; break;
      case 'OAS 2.0':
      case 'OAS 3.0':
        validateProfile = amf.ProfileNames.OAS;
        break;
    }
    return amf.AMF.validate(doc, validateProfile)
    .then((report) => {
      if (!report.conforms) {
        this.logger.warn(report.toString());
      } else {
        this.logger.info('API valid.');
      }
      return doc;
    });
  }
  /**
   * Validates types in the model
   * @param {Object} doc Parsed document
   * @param {String} type API type.
   * @return {Promise} Promise resolved to the resolved document.
   */
  _resolve(doc, type) {
    this.logger.info('Resolving API model for API components...');
    const resolver = amf.Core.resolver(type);
    return resolver.resolve(doc, 'editing');
  }
  /**
   * Generates json-ld model and saves it to specified location.
   * @param {Object} doc Document ot use to generate the model
   * @param {String} file Output file location
   * @return {Promise} Resolved when file is saved.
   */
  _save(doc, file) {
    this.logger.info('Generating json-ld model...');
    const opts = amf.render.RenderOptions().withSourceMaps.withCompactUris;
    const generator = amf.Core.generator('AMF Graph', 'application/ld+json');
    const start = Date.now();
    return generator.generateString(doc, opts)
    .then((data) => {
      const time = Date.now() - start;
      this.logger.info(`Model ready in ${time} milliseconds`);
      this.logger.info('Storing API data model to file: ' + file);
      const dir = path.dirname(file);
      return fs.ensureDir(dir)
      .then(() => fs.writeFile(file, data, 'utf8'));
    });
  }
}

exports.JsonGenerator = JsonGenerator;
