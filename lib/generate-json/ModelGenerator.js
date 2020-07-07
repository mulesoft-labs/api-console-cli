import amf from 'amf-client-js';
import fs from 'fs-extra';
import path from 'path';

/** @typedef {import('./ModelGenerator').ModelGeneratorOptions} ModelGeneratorOptions */

/**
 * A class responsible for generating a JSON model for a web API via AMF parser.
 */
export class ModelGenerator {
  /**
   * @param {ModelGeneratorOptions} opts
   */
  constructor(opts) {
    const { file, apiType, output, apiMediaType='application/yaml', pipeline='editing' } = opts;
    this.source = file;
    this.type = apiType;
    this.mime = apiMediaType;
    this.output = output;
    this.pipeline = pipeline;
  }

  /**
   * Runs API generation process.
   * @return {Promise<void>}
   */
  async run() {
    amf.plugins.document.WebApi.register();
    amf.plugins.document.Vocabularies.register();
    amf.plugins.features.AMFValidation.register();
    await amf.Core.init();
    const doc = await this.parse();
    await this.validate(doc);
    const resolved = await this.resolve(doc);
    await this.store(resolved);
  }

  /**
   * Parses the API
   * @return {Promise<amf.model.document.BaseUnit>} A graph generated from the API specification.
   */
  async parse() {
    const { source, type, mime } = this;
    const parser = amf.Core.parser(type, mime);
    let url;
    if (source.indexOf('http') === 0) {
      url = source;
    } else {
      const exists = await fs.pathExists(source);
      if (!exists) {
        throw new Error(`The file ${source} does not exist.`);
      }
      url = `file://${source}`;
    }
    try {
      return await parser.parseFileAsync(url);
    } catch (e) {
      return e.toString();
    }
  }

  /**
   * Validates parsed API
   * @param {amf.model.document.BaseUnit} doc Parsed document
   * @return {Promise<void>}
   */
  async validate(doc) {
    const { type } = this;
    let validateProfile;
    switch (type) {
      case 'RAML 1.0': validateProfile = amf.ProfileNames.RAML; break;
      case 'RAML 0.8': validateProfile = amf.ProfileNames.RAML08; break;
      case 'OAS 2.0':
      case 'OAS 3.0':
        validateProfile = amf.ProfileNames.OAS;
        break;
    }
    // @ts-ignore
    const report = await amf.AMF.validate(doc, validateProfile);
    if (!report.conforms) {
      /* eslint-disable-next-line no-console */
      console.warn(report.toString());
    }
  }

  /**
   * AMF parser supports different resolution pipelined depending on the use case.
   * API Console most often work with the `editing` pipeline but more can be
   * supported in the future.
   *
   * @param {amf.model.document.BaseUnit} doc Parsed document
   * @return {Promise<amf.model.document.BaseUnit>} Resolved document
   */
  async resolve(doc) {
    const { type, pipeline } = this;
    const resolver = amf.Core.resolver(type);
    try {
      return await resolver.resolve(doc, pipeline);
    } catch (e) {
      return e.toString();
    }
  }

  /**
   * Stores API model as a LD+JSON model in a file.
   *
   * @param {amf.model.document.BaseUnit} doc Resolved document
   * @return {Promise<void>}
   */
  async store(doc) {
    const { output } = this;
    // @ts-ignore
    const opts = amf.render.RenderOptions().withSourceMaps.withCompactUris;
    const generator = amf.Core.generator('AMF Graph', 'application/ld+json');
    const data = await generator.generateString(doc, opts);
    const dir = path.dirname(output);
    await fs.ensureDir(dir);
    await fs.writeFile(output, data, 'utf8');
  }
}
