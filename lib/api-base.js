'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Base class for CLI commands.
 *
 */
class ApiBase {
  /**
   * Sets global options.
   */
  constructor(opts) {
    opts = opts || {};
    this.verbose = opts.verbose || false;
  }

  /**
   * Ensures that given path exists in filesystem.
   *
   * @param {String} path A path to test
   * @return {Promise} Resolced promise when the path exists. Rejects when unable to create the
   * path.
   */
  ensurePath(path) {
    return this.pathExists(path)
    .catch(() => {
      return this._createDir(path);
    });
  }
  // Creates a directory recursively.
  _createDir(dirPath) {
    return new Promise((resolve, reject) => {
      fs.mkdir(dirPath, (error) => {
        if (error && error.code === 'ENOENT') {
          this._createDir(path.dirname(dirPath))
          .then(() => {
            return this._createDir(dirPath);
          })
          .then(resolve)
          .catch(reject);
        } else if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Checks if `path` exists in the filesystem.
   *
   * @param {String} path A path to check
   * @return {Promise} A promise resolves itself if `path` exists and rejects if don't.
   */
  pathExists(path) {
    return new Promise((resolve, reject) => {
      fs.access(path, fs.constants.F_OK, (err) => {
        if (err) {
          return reject();
        }
        resolve();
      });
    });
  }
}
exports.ApiBase = ApiBase;
