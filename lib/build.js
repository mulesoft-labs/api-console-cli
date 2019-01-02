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
    return this.gaUsage(moduleOptions)
    .then(() => consoleBuilder(moduleOptions))
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
    if (opts.apiMediaType) {
      result.apiMediaType = opts.apiMediaType;
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

  gaUsage(moduleOptions) {
    return this.ga.gaAllowed()
    .then((allowed) => {
      if (allowed) {
        this._gaOptions(moduleOptions);
      }
    });
  }

  _gaOptions(opts) {
    const cat = 'Builder';
    let chain = this.ga.ua.pageview('/build');
    if (opts.local) {
      chain = chain.event(cat, 'With local');
    }
    if (opts.tagName) {
      chain.event(cat, 'Tag name', opts.tagName);
    }
    if (opts.api) {
      chain.event(cat, 'With API');
    }
    if (opts.apiType) {
      chain.event(cat, 'API type', opts.apiType);
    }
    if (opts.apiType) {
      chain.event(cat, 'API type', opts.apiType);
    }
    if (opts.apiMediaType) {
      chain.event(cat, 'API media type', opts.apiMediaType);
    }
    if (opts.destination) {
      chain.event(cat, 'With destination');
    }
    if (opts.themeFile) {
      chain.event(cat, 'With theme file');
    }
    if (opts.embedded) {
      chain.event(cat, 'With embedded');
    }
    if (opts.verbose) {
      chain.event(cat, 'With verbose');
    }
    if (opts.withAmf) {
      chain.event(cat, 'With AMF');
    }
    if (opts.noOauth) {
      chain.event(cat, 'With noOauth');
    }
    if (opts.noCryptoJs) {
      chain.event(cat, 'With noCryptoJs');
    }
    if (opts.noJsPolyfills) {
      chain.event(cat, 'With noJsPolyfills');
    }
    if (opts.noXhr) {
      chain.event(cat, 'With noXhr');
    }
    if (opts.noWebAnimations) {
      chain.event(cat, 'With noWebAnimations');
    }
    if (opts.noCache) {
      chain.event(cat, 'With noCache');
    }
    if (opts.attributes) {
      chain.event(cat, 'With attributes');
    }
    chain.send();
  }
}

exports.ApiBuild = ApiBuild;
