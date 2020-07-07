import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';
import { BuildCommand } from './commands/BuildCommand.js';
import { GenerateJsonCommand } from './commands/GenerateJsonCommand.js';
import { ServeCommand } from './commands/ServeCommand.js';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';

/** @typedef {import('./commands/Command').Command} Command */
/** @typedef {import('./commands/Command').CommandResult} CommandResult */

/**
 * Entry point to the API Console CLI tool.
 */
export class ApiConsoleCli {
  /**
   * @param {string[]} [argv=[]] CLI arguments.
   */
  constructor(argv=[]) {
    const mainDefinitions = [
      { name: 'command', defaultOption: true },
      { name: 'help', defaultValue: false, type: Boolean },
      { name: 'version', defaultValue: false, type: Boolean },
    ];
    const mainOptions = commandLineArgs(mainDefinitions, {
      stopAtFirstUnknown: true,
      argv,
    });
    this.command = mainOptions.command;
    this.isHelp = mainOptions.help;
    this.isVersion = mainOptions.version;
    this.argv = mainOptions._unknown || [];

    this.commands = new Map();
    this.addCommand(new BuildCommand());
    this.addCommand(new GenerateJsonCommand());
    this.addCommand(new ServeCommand());
  }

  /**
   * Registers a new command in the CLI tool.
   * @param {Command} cmd A command definition to add.
   */
  addCommand(cmd) {
    this.commands.set(cmd.name, cmd);
    cmd.aliases.forEach((alias) => {
      this.commands.set(alias, cmd);
    });
  }

  /**
   * Runs the cusrent command
   * @return {Promise<CommandResult>}
   */
  async run() {
    const command = this.commands.get(this.command);
    const { argv } = this;
    if (!command) {
      if (this.isHelp) {
        await this.help();
        return;
      }
      if (this.isVersion) {
        await this.version();
        return;
      }
      throw new Error(`Unknown command: ${this.command}`);
    }
    if (this.isHelp) {
      await command.help();
      return;
    }
    try {
      const commandOptions = commandLineArgs(command.args, { argv, camelCase: true });
      return await command.run(commandOptions);
    } catch (e) {
      if (e.name === 'UNKNOWN_OPTION') {
        /* eslint-disable-next-line no-console */
        console.error(chalk`\n{red ${e.message}}`);
        await command.help();
        return;
      }
      throw e;
    }
  }

  /**
   * Prints the current version number.
   * @return {Promise<string>}
   */
  async getCurrentVersion() {
    const pkgLoc = path.join(__dirname, '..', 'package.json');
    const pkg = await fs.readJson(pkgLoc);
    return pkg.version;
  }

  /**
   * Prints the current version number.
   * @return {Promise<void>}
   */
  async version() {
    const version = await this.getCurrentVersion();
    /* eslint-disable-next-line no-console */
    console.log(version);
  }

  /**
   * Prints help message
   *
   * @return {Promise<void>}
   */
  async help() {
    const version = await this.getCurrentVersion();
    const sections = [
      {
        header: `api-console v${version}`,
        content: 'Bundles API Console, generates API data model, and preview bundle in local environment.',
      },
      {
        header: 'SYNOPSIS',
        content: [
          '$ api-console build {bold -t} {underline type} [options] {underline file}',
          '$ api-console generate-json {bold -t} {underline type} [options] {underline file}',
          '$ api-console serve [options] [{underline location}]',
        ],
      },
      {
        header: 'USAGE',
        content: [
          'Run command with {bold --help} option to see help topic.',
          '',
          '$ api-console build --help',
        ],
      },
    ];
    const usage = commandLineUsage(sections);
    /* eslint-disable-next-line no-console */
    console.log(usage);
  }
}
