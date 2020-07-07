import amf from 'amf-client-js';

export declare interface ModelGeneratorOptions {
  file: string;
  apiType: string;
  output: string;
  apiMediaType?: string;
  pipeline?: string;
}

/**
 * A class responsible for generating a JSON model for a web API via AMF parser.
 */
export class ModelGenerator {
  file: string;
  apiType: string;
  output: string;
  apiMediaType: string;
  pipeline: string;

  /**
   * @param {ModelGeneratorOptions} opts
   */
  constructor(opts: ModelGeneratorOptions);

  /**
   * Runs API generation process.
   */
  run(): Promise<void>;

  /**
   * Parses the API
   * @returns A graph generated from the API specification.
   */
  parse(): Promise<amf.model.document.BaseUnit>;

  /**
   * Validates parsed API
   * @param doc Parsed document
   */
  validate(doc: amf.model.document.BaseUnit): Promise<void>;

  /**
   * AMF parser supports different resolution pipelined depending on the use case.
   * API Console most often work with the `editing` pipeline but more can be
   * supported in the future.
   *
   * @param doc Parsed document
   * @returns Resolved document
   */
  resolve(doc: amf.model.document.BaseUnit): Promise<amf.model.document.BaseUnit>;

  /**
   * Stores API model as a LD+JSON model in a file.
   *
   * @param doc Resolved document
   */
  store(doc: amf.model.document.BaseUnit): Promise<void>;
}
