/**
 * Base class for commands.
 */
export class Command {
  /**
   * @param {string} name Command name
   * @param {string[]=} [aliases=[]] Command aliases
   * @param {string=} [description=''] Command description.
   */
  constructor(name, aliases=[], description='') {
    this.name = name;
    this.aliases = aliases;
    this.description = description;
    this.args = [];
  }

  /**
   * @return {Promise<any>} Runs the command
   * @abstract
   */
  async run() {
    // ...
  }

  /**
   * @return {Promise<void>} Prints help message for the command
   * @abstract
   */
  async help() {
    // ...
  }
}

/**
 * CommandResult represent a result of running a command.
 * The exit code (0 by default) is used to exit the process.
 */
export class CommandResult {
  /**
   * @param {number=} [exitCode=0] Process exit code.
   */
  constructor(exitCode=0) {
    this.exitCode = exitCode;
    this.message = undefined;
  }
}
