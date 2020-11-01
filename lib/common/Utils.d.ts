export declare interface CliOption {
  name: string;
  value: string;
}

/**
 * Parses CLI input that is to be a map and name is separated from the value
 * by a colon.
 *
 * If the value is no present an empty string is used.
 *
 * @param {string} item User input
 * @return {Object} An object with `name` and `value` properties.
 */
export declare function cliMapParser(item: string): CliOption;
