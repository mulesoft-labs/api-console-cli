const config = require('./config.js');
const ua = require('universal-analytics');
/**
 * Helper class to support Google Analytics.
 */
class GaHelper {
  /**
   * @param {Boolean} gaDisabled
   */
  constructor(gaDisabled) {
    this.gaDisabled = gaDisabled;
    this.ua = ua('UA-71458341-6');
  }
  /**
   * Tests if Google Analytics has been enabled by the user.
   * @return {Promise<Boolean|undefined>} Promise resolved to:
   * - `true` - when the user allowed Google Analytics
   * - `false` - when the user did not allowed GA tracking
   * - `undefined` - when Ga no configuration (ask the user)
   */
  gaAllowed() {
    if (this.gaDisabled) {
      return Promise.resolve(false);
    }
    return config.readConfig()
    .catch(() => {
      return {};
    })
    .then((config) => {
      if (typeof config.gaEnabled) {
        return config.gaEnabled;
      }
    });
  }

  updatePermissions(value) {
    return config.storeConfig('gaEnabled', value);
  }
}

module.exports.GaHelper = GaHelper;
