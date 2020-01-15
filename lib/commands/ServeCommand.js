import commandLineUsage from 'command-line-usage';
import { Command, CommandResult } from './Command.js';
import { cliMapParser } from '../common/Utils.js';
import { Serve } from '../serve/Serve.js';

export class ServeCommand extends Command {
  constructor() {
    super(
      'serve',
      ['s'],
      'Creates a www server to serve API Console bundle sources.'
    );
    this.args = [
      {
        name: 'root',
        defaultOption: true,
        type: String,
        description: 'The root directory to serve.',
      },
      {
        name: 'entrypoint',
        alias: 'e',
        type: String,
        defaultValue: 'index.html',
        description: 'The path on disk of the entry point HTML file that will be served. Defaults to `index.html`.',
      },
      {
        name: 'port',
        alias: 'p',
        type: Number,
        description: 'The port to serve from. If not set it is assingled automatically.',
      },
      {
        name: 'hostname',
        alias: 'H',
        type: String,
        defaultValue: 'localhost',
        description: 'The hostname to serve from. Default to localhost.',
      },
      {
        name: 'headers',
        alias: 'h',
        type: (header) => cliMapParser(header),
        multiple: true,
        description: 'Headers to send with every response.',
      },
      {
        name: 'open',
        alias: 'o',
        type: Boolean,
        description: 'Whether to open the browser when run',
      },
    ];
  }

  async run(opts) {
    const cmd = new Serve(opts);
    try {
      await cmd.run();
    } catch (e) {
      /* eslint-disable-next-line no-console */
      console.error(e);
      return new CommandResult(1);
    }
  }

  /**
   * Generates a help message and prints it into the console.
   * @return {Promise}
   */
  async help() {
    const sections = [
      {
        header: 'api-console serve',
        content: 'Creates a http server and serves content form currect directory.'
      },
      {
        header: 'SYNOPSIS',
        content: [
          '$ api-console serve [options] [{underline location}]',
        ]
      },
      {
        header: 'DESCRIPTION',
        content: [
          '{bold api-console serve} is to be used to test generated bundle of ' +
          'API Console. It does not apply any transformation to the served content ' +
          'and it behaves as any regular www server would.\n',
          'It is optional to specify a path to serve. If {bold build} folder ' +
          'exists in currect directory then it will be served by default. Otherwise ' +
          'current derectory is used by default.\n',
          'SSL options nor HTTP 2 are not supported at the time.'
        ]
      },
      {
        header: 'EXAMPLES',
        content: [
          {
            desc: '1. Minimal options',
            example: '$ api-console serve'
          },
          {
            desc: '2. Serve location',
            example: '$ api-console serve output/'
          },
          {
            desc: '3. Open default browser',
            example: '$ api-console serve --open'
          },
          {
            desc: '4. Host and port',
            example: '$ api-console serve -H 192.168.1.10 -p 8081'
          },
          {
            desc: '5. Response headers',
            example: '$ api-console serve -h "Access-Control-Allow-Origin:*"'
          },
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
