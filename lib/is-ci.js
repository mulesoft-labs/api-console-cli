const env = process.env;
/**
 * Tests if current environment is CI environment.
 * @return {Boolean}
 */
module.exports = !!(env.CI || env.CONTINUOUS_INTEGRATION ||
  env.BUILD_NUMBER || env.RUN_ID || exports.name || false);
