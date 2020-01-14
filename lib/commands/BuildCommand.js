import commandLineUsage from 'command-line-usage';
import { ApiConsoleProject } from '@api-components/api-console-builder';
import { Command, CommandResult } from './Command.js';

export class BuildCommand extends Command {
  constructor() {
    super(
      'build',
      ['b'],
      'Creates a production ready API Console bundle.'
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
        type: String,
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

  async run(opts) {
    const projectOpts = this.translateOptions(opts);
    const project = new ApiConsoleProject(projectOpts);
    try {
      await project.bundle();
    } catch (e) {
      /* eslint-disable-next-line no-console */
      console.error(e);
      return new CommandResult(1);
    }
  }

  /**
   * Translates CLI options to builder options definition.
   * @param {Object} opts A map of user options
   * @return {Object} List of builder options
   */
  translateOptions(opts={}) {
    const result = {};
    if (opts.tagName) {
      result.tagName = opts.tagName;
    }
    // API data options
    if (opts.api) {
      result.api = opts.api;
    }
    if (opts.apiType) {
      result.apiType = opts.apiType;
    }
    if (opts.apiMediaType) {
      result.apiMediaType = opts.apiMediaType;
    }
    // Build options
    if (opts.output) {
      result.destination = opts.output;
    }
    if (opts.theme) {
      result.themeFile = opts.theme;
    }
    if (opts.index) {
      result.indexFile = opts.index;
    }
    if (opts.appTitle) {
      result.appTitle = opts.appTitle;
    }
    if (opts.verbose) {
      result.verbose = true;
    }
    if (opts.noCache) {
      result.noCache = true;
    }
    if (opts.strict) {
      result.strict = true;
    }
    if (opts.attr && opts.attr.length) {
      result.attributes = this.translateAttributes(opts.attr);
    }
    return result;
  }

  /**
   * Translates CLI attributes array into the struct accepted by the builder.
   * @param {Array<String>} attr List of attributes.
   * @return {Array<String|Object>} Generated list of attributes
   */
  translateAttributes(attr) {
    const result = [];
    attr.forEach((item) => {
      const index = item.indexOf(':');
      if (index !== -1) {
        const name = item.substr(0, index);
        const value = item.substr(index + 1);
        item = {};
        item[name] = value;
      }
      result[result.length] = item;
    });
    return result;
  }

  /**
   * Generates a help message and prints it into the console.
   * @return {Promise}
   */
  async help() {
    const sections = [
      {
        header: 'API Console build',
        content: 'Creates a production ready bundle of API Console application.'
      },
      {
        header: 'Synopsis',
        content: [
          '$ api-console build {bold -a} {underline file} {bold -t} {underline type}',
          '$ api-console build {bold -a} {underline file} {bold -t} {underline type} [{bold --output}]',
          '$ api-console build {bold -a} {underline file} {bold -t} {underline type} [{bold --api-media-type}]',
          '$ api-console build {bold -a} {underline file} {bold -t} {underline type} [{bold --theme-file}]',
          '$ api-console build {bold -a} {underline file} {bold -t} {underline type} [{bold --index-file}]',
          '$ api-console build {bold -a} {underline file} {bold -t} {underline type} [{bold --attr} "name:value"]',
        ]
      },
      {
        header: 'Options',
        optionList: [
          ...this.args,
          {
            name: 'help',
            description: 'Print this usage guide.',
            type: Boolean,
          }
        ]
      }
    ];
    const usage = commandLineUsage(sections)
    /* eslint-disable-next-line no-console */
    console.log(usage)
  }
}
