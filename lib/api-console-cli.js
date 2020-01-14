import commandLineArgs from 'command-line-args';
import { BuildCommand } from './commands/BuildCommand.js';


export class ApiConsoleCli {
  constructor(argv=[]) {
    const mainDefinitions = [
      { name: 'command', defaultOption: true },
      { name: '--help' },
    ];
    const mainOptions = commandLineArgs(mainDefinitions, {
      stopAtFirstUnknown: true,
      argv
    });
    this.command = mainOptions.command;
    this.argv = mainOptions._unknown || [];

    this.commands = new Map();
    this.addCommand(new BuildCommand());
  }

  addCommand(cmd) {
    this.commands.set(cmd.name, cmd);
    cmd.aliases.forEach((alias) => {
      this.commands.set(alias, cmd);
    });
  }

  async run() {
    const command = this.commands.get(this.command);
    if (!command) {
      throw new Error(`Unknown command: ${this.command}`);
    }
    const { argv } = this;
    if (argv.indexOf('--help') !== -1) {
      return await command.help();
    }
    const commandOptions = commandLineArgs(command.args, { argv, camelCase: true });
    try {
      return await command.run(commandOptions);
    } catch (e) {
      console.log(e);
    }
  }
}
