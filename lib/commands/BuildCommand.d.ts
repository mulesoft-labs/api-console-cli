import { Command, CommandResult } from './Command.js';
import { BuilderOptions } from '../builder/Builder';

/**
 * Build API Console command.
 */
export declare class BuildCommand extends Command {
  constructor();

  /**
   * Runs the command
   */
  run(opts: BuilderOptions): Promise<CommandResult>;

  /**
   * Generates a help message and prints it into the console.
   */
  help(): Promise<void>;
}
