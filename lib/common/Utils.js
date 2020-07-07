/** @typedef {import('./Utils').CliOption} CliOption */

/**
 * Parses CLI input that is to be a map and name is separated from the value
 * by a colon.
 *
 * If the value is no present an emty string is used.
 *
 * @param {string} item User input
 * @return {CliOption} An object with `name` and `value` properties.
 */
export function cliMapParser(item) {
  let name = item;
  let value = '';
  const index = item.indexOf(':');
  if (index !== -1) {
    name = item.substr(0, index).trim();
    value = item.substr(index + 1).trim();
  }
  return {
    name,
    value,
  };
}
