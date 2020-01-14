import { Command, CommandResult } from './Command.js';
import commandLineUsage from 'command-line-usage';

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
        defaultValue: 'build',
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
        name: 'theme-file',
        alias: 'c',
        type: String,
        description: 'Location of custom theme file.',
        typeLabel: '{underline file}',
      },
      {
        name: 'index-file',
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
        name: 'verbose',
        type: Boolean,
        defaultValue: false,
        description: 'Shows detailed output.',
      },
      {
        name: 'no-ga',
        type: Boolean,
        defaultValue: false,
        description: 'Disable Google Analytics when running any command.',
      },
      {
        name: 'no-cache',
        type: Boolean,
        defaultValue: false,
        description: 'Ignore cached builds.',
      },
    ];
  }

  async run(opts) {
    console.log('BUILD', opts);
  }

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
