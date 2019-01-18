const config = require('./config.js');
const ua = require('universal-analytics');
const uuid = require('uuid');
const isCi = require('./is-ci.js');
/**
 * Helper class to support Google Analytics.
 */
class GaHelper {
  /**
   * @param {Boolean} gaDisabled
   */
  constructor(gaDisabled) {
    this.gaDisabled = gaDisabled;
  }
  /**
   * Initializes the GA library and creates `allowed` and `ua` proeprties.
   * When UA is disabled the `ua` property is not tes.
   *
   * @return {Promise<Boolean>} Promise resolved to a boolean value where true
   * means that the library is initialized for the first time an should ask
   * for user consent.
   */
  init() {
    if (this.gaDisabled) {
      this.allowed = false;
      return Promise.resolve(false);
    }
    return config.readConfig()
    .catch(() => {
      return {};
    })
    .then((cnf) => {
      let updateCid = false;
      if (typeof cnf.cid === 'undefined') {
        cnf.cid = uuid.v4();
        updateCid = true;
      }
      if (updateCid) {
        return config.storeConfig('cid', cnf.cid).then(() => cnf);
      }
      return cnf;
    })
    .then((cnf) => {
      let gaFirstInit = false;
      if (typeof cnf.gaEnabled === 'boolean') {
        this.allowed = cnf.gaEnabled;
      } else {
        gaFirstInit = true;
      }
      this.cid = cnf.cid;
      this.ua = ua('UA-71458341-6', this.cid);
      this.ua.set('cd1', isCi ? 1 : 0);
      return gaFirstInit;
    });
  }

  updatePermissions(value) {
    return config.storeConfig('gaEnabled', value);
  }
}

module.exports.GaHelper = GaHelper;
