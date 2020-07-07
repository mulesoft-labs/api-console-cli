export declare interface CommandArgument {
  /**
   * The name of the argument
   */
  name: string;
  /**
   * The alias for the argument
   */
  alias?: string;
  /**
   * The class that reprersents the type of the argument
   */
  type?: object;
  /**
   * The description of the argument.
   */
  description: string;
  /**
   * Marks a default option to the command as an argument after the command name.
   * Can be only one per configuration.
   */
  defaultOption?: boolean;
  /**
   * A default value for the argument.
   */
  defaultValue?: string|boolean;
  /**
   * Weh set the argument can accept multiple values.
   */
  multiple?: boolean;

  typeLabel?: string;
}

/**
 * Base class for commands.
 */
export declare class Command {
  /**
   * The command name
   */
  name: string;
  /**
   * Aliases for the command
   */
  aliases?: string[];
  /**
   * Description of the command
   */
  description?: string;
  /**
   * Passed arguments.
   */
  args?: CommandArgument[];

  /**
   * @param {string} name Command name
   * @param {string[]=} [aliases=[]] Command aliases
   * @param {string=} [description=''] Command description.
   */
  constructor(name: string, aliases?: string[], description?: string);

  /**
   * Runs the command
   */
  run(opts?: any): Promise<CommandResult>;

  /**
   * Prints help message for the command
   */
  help(): Promise<void>;
}

/**
 * CommandResult represent a result of running a command.
 * The exit code (0 by default) is used to exit the process.
 */
export declare class CommandResult {
  exitCode: number;
  message: string;
  /**
   * @param {number=} [exitCode=0] Process exit code.
   */
  constructor(exitCode?: number);
}
