export class Command {
  constructor(name, aliases=[], description='') {
    this.name = name;
    this.aliases = aliases;
    this.description = description;
    this.args = [];
  }
  async run() {}
  async help() {}
}

/**
 * CommandResult represent a result of running a command.
 * The exit code (0 by default) is used to exit the process.
 */
export class CommandResult {
  constructor(exitCode=0) {
    this.exitCode = exitCode;
    this.message = undefined;
  }
}
