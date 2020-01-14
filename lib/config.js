const fs = require('fs-extra');
const path = require('path');

/**
 * Creates a path to cache folder under user data folder.
 *
 * @param {?String} platform Current platform. If not set `process.platform`
 * is used.
 * @return {String}
 */
function locateAppDir(platform) {
  let dir;
  if (!platform) {
    platform = process.platform;
  }
  if (typeof process.env.APPDATA !== 'undefined' && process.env.APPDATA) {
    dir = process.env.APPDATA;
  } else if (platform === 'darwin') {
    dir = path.join(process.env.HOME, 'Library', 'Preferences');
  } else if (platform === 'linux') {
    dir = path.join(process.env.HOME, '.config');
  } else {
    dir = '/var/local';
  }
  dir = path.join(dir, 'api-console');
  return dir;
}

const settingsFolder = locateAppDir();
const settingsFile = path.join(settingsFolder, 'cli.json');

function readConfig() {
  return fs.readJson(settingsFile, { throws: false })
  .then((config) => {
    if (!config) {
      config = {};
    }
    return config;
  });
}

/**
 * Saves CLI configuration option.
 * @param {String} property Name of the configuration property
 * @param {String|Number|Boolean} value Value to store
 * @return {Promise}
 */
async function storeConfig(property, value) {
  let config;
  try {
    config = await readConfig();
  } catch (_) {
    config = {};
  }
  config[property] = value;
  await fs.outputJson(settingsFile, config);
}

module.exports = {
  locateAppDir: (platform) => locateAppDir(platform),
  readConfig: () => readConfig(),
  storeConfig: (property, value) => storeConfig(property, value),
  get settingsFile() {
    return settingsFile;
  }
};
