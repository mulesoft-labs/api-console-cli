'use strict';

const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
const winston = require('winston');
/**
 * Base class for CLI commands.
 *
 */
class ApiBase {
  /**
   * Sets global options.
   * @param {Object} opts Passed user options.
   */
  constructor(opts) {
    opts = opts || {};
    this.verbose = opts.verbose || false;
    this.logger = this.__setupLogger();
  }
  /**
   * Creates a logger object to log debug output.
   * @return {Object}
   */
  __setupLogger() {
    const level = this.verbose ? 'debug' : 'info';
    const format = winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    );
    const logger = winston.createLogger({
      level,
      format,
      exitOnError: false,
      transports: [
        new winston.transports.Console()
      ]
    });
    return logger;
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
    .catch((exists) => {
      if (!exists) {
        return this._createDir(path);
      }
      return Promise.resolve();
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

  /**
   * Execute shell command
   *
   * @param {String} cmd Command to execute
   * @param {String?} dir A directoy where to execute the command.
   * @return {Promise} Promise resolves itself if the command was executed successfully and
   * rejects it there was an error.
   */
  exec(cmd, dir) {
    dir = dir || undefined;
    return new Promise((resolve, reject) => {
      const opts = {};
      if (dir) {
        opts.cwd = dir;
      }
      this.log(`Executing command: ${cmd} in dir: ${dir}`);
      exec(cmd, opts, (err, stdout, stderr) => {
        if (err) {
          let currentDir = process.cwd();
          if (opts.cwd) {
            currentDir = opts.cwd;
          }
          reject(new Error('Unable to execute command: ' + err.message +
            '. Was in dir: ' + currentDir + '. stdout: ', stdout, '. stderr: ', stderr));
          return;
        }
        resolve(stdout);
      });
    });
  }

  // Checks if given `url` is a local or remote file.
  isRemoteFile(url) {
    if (!url) {
      // current dir?
      return false;
    }
    if (url.indexOf('http') === 0) {
      return true;
    }
    if (url.indexOf('ftp') === 0) {
      return true;
    }
    return false;
  }
}
exports.ApiBase = ApiBase;
