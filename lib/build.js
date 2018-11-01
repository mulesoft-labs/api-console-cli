'use strict';
const ApiBase = require('./api-base').ApiBase;
const consoleBuilder = require('@api-components/api-console-builder');
const fs = require('fs-extra');
/**
 * The ApiBuild class is a command to build the API Console
 * for specific API spec.
 */
class ApiBuild extends ApiBase {
  /**
   * Runs the command.
   *
   * @return {Promise}
   */
  run() {
    this.logger.info('  Building the API console. This may take a moment.');
    const moduleOptions = this._prepareOptions(this.opts);
    return consoleBuilder(moduleOptions)
    // If there's no error here then there's no point of leaving the debug file.
    .then(() => fs.remove(this.debugFile));
  }
  /**
   * Creates configuration to be passed to the builder.
   * @param {Object} opts User passed options
   * @return {Object} Builder options
   */
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
    result.logger = this.logger;
    return result;
  }
}

exports.ApiBuild = ApiBuild;
