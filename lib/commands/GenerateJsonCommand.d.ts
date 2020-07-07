import { Command, CommandResult } from './Command.js';
import { ModelGeneratorOptions } from '../generate-json/ModelGenerator.js';

/**
 * Generate AMF model command.
 */
export class GenerateJsonCommand extends Command {
  constructor();

  /**
   * Runs the command
   * @param opts Building configuration
   */
  run(opts: ModelGeneratorOptions): Promise<CommandResult>;

  /**
   * Generates a help message and prints it into the console.
   */
  help(): Promise<void>;
}
