'use strict';
const path = require('path');
const winston = require('winston');
const {GaHelper} = require('./ga-helper');
/**
 * Base class for CLI commands.
 *
 */
class ApiBase {
  /**
   * Sets global options.
   *
   * @param {Object} opts Command options.
   */
  constructor(opts) {
    if (!opts) {
      opts = {};
    }
    this.opts = opts;
    this.logger = this.__setupLogger();
    this.ga = new GaHelper(!opts.ga);
  }
  /**
   * Creates a logger object to log debug output.
   * @return {Object}
   */
  __setupLogger() {
    const level = this.opts.verbose ? 'debug' : 'warn';
    this.debugFile = path.join(process.cwd(), 'api-console-cli.log');
    const format = winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    );
    const logger = winston.createLogger({
      level,
      format,
      exitOnError: false,
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({filename: this.debugFile, level: 'error'})
      ]
    });
    return logger;
  }
}
exports.ApiBase = ApiBase;
