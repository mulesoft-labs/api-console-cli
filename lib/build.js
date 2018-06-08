'use strict';
const ApiBase = require('./api-base').ApiBase;
const consoleBuilder = require('api-console-builder');
/**
 * The ApiBuild class is a command to build the API Console for specific API spec.
 */
class ApiBuild extends ApiBase {
  /**
   * Constructs the builder.
   * @param {Object} opts Options passed from the command line.
   */
  constructor(opts) {
    opts = opts || {};
    super(opts);
    this.opts = opts;
  }

  /**
   * Runs the command.
   */
  run() {
    this.log('  Building the API console. This may take a moment.');
    const startTime = Date.now();
    const moduleOptions = this._prepareOptions(this.opts);
    return consoleBuilder(moduleOptions)
    .then(() => {
      const time = Date.now() - startTime;
      this.log('  Console built in ' + time + ' seconds.');
    });
  }

  _prepareOptions(opts) {
    const result = {};
    // API source options
    if (opts.local) {
      result.local = opts.local;
    }
    if (opts.tagName) {
      result.tagName = opts.tagName;
    }
    // API data options
    if (opts.api) {
      result.api = opts.api;
    }
    if (opts.apiType) {
      result.apiType = opts.apiType;
    }
    // Build options
    if (opts.output) {
      result.destination = opts.output;
    }
    if (opts.themeFile) {
      result.themeFile = opts.themeFile;
    }
    if (opts.embedded) {
      result.embedded = true;
    }
    if (opts.verbose) {
      result.verbose = true;
    }
    if (opts.withAmf) {
      result.withAmf = true;
    }
    if (!opts.oauth) {
      result.noOauth = true;
    }
    if (!opts.cryptoJs) {
      result.noCryptoJs = true;
    }
    if (!opts.jsPolyfills) {
      result.noJsPolyfills = true;
    }
    if (!opts.xhr) {
      result.noXhr = true;
    }
    if (!opts.webAnimations) {
      result.noWebAnimations = true;
    }
    if (!opts.cache) {
      result.noCache = true;
    }
    if (opts.attributes && opts.attributes.length) {
      result.attributes = opts.attributes;
    }
    return result;
  }
}

exports.ApiBuild = ApiBuild;
