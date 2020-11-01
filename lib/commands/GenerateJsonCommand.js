import commandLineUsage from 'command-line-usage';
import { Command, CommandResult } from './Command.js';
import { ModelGenerator } from '../generate-json/ModelGenerator.js';

/** @typedef {import('../generate-json/ModelGenerator').ModelGeneratorOptions} ModelGeneratorOptions */

const apiTypes = ['RAML 0.8', 'RAML 1.0', 'OAS 2.0', 'OAS 3.0'];

/**
 * Generate AMF model command.
 */
export class GenerateJsonCommand extends Command {
  /**
   * @constructor
   */
  constructor() {
    super(
      'generate-json',
      ['g'],
      'Creates a data model from an API file.',
    );
    this.args = [
      {
        name: 'file',
        defaultOption: true,
        description: 'Path to API main file.',
      },
      {
        name: 'api-type',
        alias: 't',
        type: String,
        description: `API specification format: ${apiTypes.join(', ')}.`,
      },
      {
        name: 'api-media-type',
        alias: 'm',
        type: String,
        defaultValue: 'application/yaml',
        description: 'API media type. Set to application/json or application/yaml for OAS.',
      },
      {
        name: 'output',
        alias: 'o',
        type: String,
        defaultValue: 'api-model.json',
        description: 'Output file. Default to "api-model.json"',
      },
      {
        name: 'pipeline',
        alias: 'p',
        type: String,
        defaultValue: 'editing',
        description: 'Advanced usage. AMF model resolution pipeline.',
      },
      {
        name: 'verbose',
        type: Boolean,
        defaultValue: false,
        description: 'Shows detailed output.',
      },
    ];
  }

  /**
   * Runs the command
   * @param {ModelGeneratorOptions} opts Building configuration
   * @return {Promise<CommandResult>}
   */
  async run(opts) {
    const type = opts.apiType;
    if (apiTypes.indexOf(type) === -1) {
      throw new Error(`Unsupported API type ${type}.`);
    }
    const cmd = new ModelGenerator(opts);
    try {
      await cmd.run();
      return new CommandResult();
    } catch (e) {
      /* eslint-disable-next-line no-console */
      console.error(e);
      return new CommandResult(1);
    }
  }

  /**
   * Generates a help message and prints it into the console.
   * @return {Promise<void>}
   */
  async help() {
    const sections = [
      {
        header: 'api-console generate-json',
        content: 'Creates a data model from an API specification file.',
      },
      {
        header: 'SYNOPSIS',
        content: [
          '$ api-console generate-json {bold -t} {underline type} [options] {underline file}',
        ],
      },
      {
        header: 'DESCRIPTION',
        content: [
          '{bold api-console generate-json} generates data model that is used in API Console ' +
          'to generate the view. The model is generated via AMF parser. You can use the ' +
          'parser library directly to integrate it with your environment.\n\n' +
          'Generated API Console bundle accepts a model that is in the main application '+
          'directory under {bold api-model.json} file.\n\n' +
          'By default "application/yaml" media type is assumed. OAS APIs can be a JSON ' +
          'in which case define {bold --api-media-type} option with {underline application/json} ' +
          'value.\n\n' +
          'Learn more about AMF parser at https://github.com/aml-org/amf',
        ],
      },
      {
        header: 'EXAMPLES',
        content: [
          {
            desc: '1. Minimal options',
            example: '$ api-console generate-json -t "RAML 1.0" ./api.raml',
          },
          {
            desc: '2. Remote API',
            example: '$ api-console generate-json -t "RAML 1.0" https://domain.com/api.raml',
          },
          {
            desc: '3. OAS example',
            example: '$ api-console generate-json -t "OAS 2.0" -m "application/json" api.json',
          },
          {
            desc: '4. OAS YAML example',
            example: '$ api-console generate-json -t "OAS 3.0" -m "application/yaml" api.yaml',
          },
          {
            desc: '5. Model file name',
            example: '$ api-console generate-json -t "RAML 1.0" -o "../model.json" api.json',
          },
        ],
      },
      {
        header: 'Options',
        optionList: [
          ...this.args,
          {
            name: 'help',
            description: 'Print this usage guide.',
            type: Boolean,
          },
        ],
      },
    ];
    const usage = commandLineUsage(sections);
    /* eslint-disable-next-line no-console */
    console.log(usage);
  }
}
