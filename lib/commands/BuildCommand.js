import { Command, CommandResult } from './Command.js';
import { Builder } from '../builder/Builder.js';
import { cliMapParser } from '../common/Utils.js';
import commandLineUsage from 'command-line-usage';

/** @typedef {import('../builder/Builder').BuilderOptions} BuilderOptions */

/**
 * Build API Console command.
 */
export class BuildCommand extends Command {
  /**
   * @construcotr
   */
  constructor() {
    super(
      'build',
      ['b'],
      'Creates a production ready API Console bundle.',
    );
    this.args = [
      {
        name: 'output',
        alias: 'o',
        type: String,
        description: 'Output location of bundled API Console. Default to "build/".',
      },
      {
        name: 'tag-name',
        alias: 'n',
        type: String,
        description: 'Release tag name to use to build the console. Only versions >= 6.0.0',
      },
      {
        name: 'api',
        alias: 'a',
        type: String,
        description: 'API file to be used to generate data model for documentation',
        defaultOption: true,
        typeLabel: '{underline file}',
      },
      {
        name: 'api-type',
        alias: 't',
        type: String,
        description: 'API specification format: RAML 1.0, RAML 0.8, OAS 2.0, or OAS 3.0',
      },
      {
        name: 'api-media-type',
        alias: 'm',
        type: String,
        description: 'API media type. Set to application/json or application/yaml for OAS.',
      },
      {
        name: 'theme',
        alias: 'c',
        type: String,
        description: 'Location of custom theme file.',
        typeLabel: '{underline file}',
      },
      {
        name: 'index',
        alias: 'h',
        type: String,
        description: 'Location of custom index.html file.',
        typeLabel: '{underline file}',
      },
      {
        name: 'attr',
        alias: 'r',
        type: (attribute) => cliMapParser(attribute),
        multiple: true,
        description: 'List of attributes to set on the console. For attributes with values set value after a colon (:)',
      },

      {
        name: 'app-title',
        type: String,
        description: 'A title to be put in generated document.',
      },
      {
        name: 'verbose',
        type: Boolean,
        defaultValue: false,
        description: 'Shows detailed output.',
      },
      {
        name: 'no-cache',
        type: Boolean,
        defaultValue: false,
        description: 'Ignore cached builds.',
      },
      {
        name: 'strict',
        type: Boolean,
        defaultValue: false,
        description: 'Always throws error when configuration is invalid.',
      },
    ];
  }

  /**
   * Runs the command
   * @param {BuilderOptions} opts Building configuration
   * @return {Promise<CommandResult>}
   */
  async run(opts) {
    try {
      await new Builder(opts).run();
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
        header: 'api-console build',
        content: 'Creates a production ready bundle of API Console application.',
      },
      {
        header: 'SYNOPSIS',
        content: [
          '$ api-console build {bold -t} {underline type} [options] {underline file}',
          '$ api-console build {bold -t} {underline type} {bold -a} {underline file}',
        ],
      },
      {
        header: 'EXAMPLES',
        content: [
          {
            desc: '1. Minimal options',
            example: '$ api-console build -t "RAML 1.0" ./api.raml',
          },
          {
            desc: '2. Remote API',
            example: '$ api-console build -t "RAML 1.0" https://domain.com/api.raml',
          },
          {
            desc: '3. OAS example (JSON)',
            example: '$ api-console build -t "OAS 2.0" -m "application/json" api.json',
          },
          {
            desc: '4. OAS example (YAML)',
            example: '$ api-console build -t "OAS 3.0" -m "application/yaml" api.yaml',
          },
          {
            desc: '5. API Console version',
            example: '$ api-console build -t "RAML 1.0" -n "6.1.0" api.yaml',
          },
          {
            desc: '6. Attributes',
            example: '$ api-console build -t "RAML 1.0" -r "baseuri:https://api.domain.com" api.json',
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
