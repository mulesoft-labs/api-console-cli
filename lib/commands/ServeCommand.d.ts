import { Command, CommandResult } from './Command.js';
import { ServeOptions } from '../serve/Serve.js';

/**
 * Serve API Console command.
 */
export class ServeCommand extends Command {
  constructor();

  /**
   * Runs the command
   * @param opts Server configuration
   */
  run(opts: ServeOptions): Promise<CommandResult>;

  /**
   * Generates a help message and prints it into the console.
   */
  help(): Promise<void>;
}
