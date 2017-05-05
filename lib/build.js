'use strict';
const ApiBase = require('./api-base').ApiBase;
const consoleBuilder = require('api-console-builder');
/**
 * The ApiBuild class is a command to build the API Console for specific API spec.
 *
 * Tasks to perform:
 * 1) Parse RAML and generate JSON
 * 2) Enhance JSON with raml2obj
 * 3) Download latest release of the API console element
 * 4) Generate index.html page with the API console element and JSON data
 * 5) Build the Polymer application.
 * 6) Copy it to the build dir
 * 7) Cleanup.
 */
class ApiBuild extends ApiBase {

  /**
   * Constructs the builder.
   *
   * @param {String} raml Target RAML file to build the console from.
   * @param {Object} opts Options passed from the command line.
   */
  constructor(raml, opts) {
    super(opts);
    this.opts = opts;
    this.raml = raml;
    /**
     * URL to the latest API console sources.
     *
     * TODO: (jarrodek): Update it to the master branch after merging with master.
     */
    this._masterSource = 'https://github.com/mulesoft/api-console/archive/release/4.0.0.zip';
  }

  /**
   * Runs the command.
   */
  run() {
    console.log('  Building the API console. This may take a moment.');
    const startTime = Date.now();
    var moduleOptions = this._prepareOptions(this.opts);
    // console.log(moduleOptions);
    // throw 'a';
    return consoleBuilder(moduleOptions)
    .then(() => {
      const time = Date.now() - startTime;
      console.log('  Console built in ' + time + ' seconds.');
    });
  }

  _prepareOptions(opts) {
    opts = opts || {};
    var result = {};
    result.raml = this.raml;

    if ('output' in opts) {
      result.dest = opts.output;
    }
    if ('source' in opts) {
      result.src = opts.source;
    } else {
      result.src = this._masterSource;
    }

    if ('mainFile' in opts) {
      result.mainFile = opts.mainFile;
    }
    if ('sourceIsZip' in opts) {
      result.sourceIsZip = true;
    }
    if ('json' in opts) {
      result.useJson = true;
    }
    if ('inlineJson' in opts) {
      result.inlineJson = true;
    }
    if ('embedded' in opts) {
      result.embedded = true;
    }
    if ('compilationLevel' in opts) {
      result.jsCompilationLevel = opts.compilationLevel;
    }
    if (!opts.optimisation) {
      result.noOptimisation = true;
    }
    if (!opts.cssOptimisation) {
      result.noCssOptimisation = true;
    }
    if (!opts.htmlOptimisation) {
      result.noHtmlOptimisation = true;
    }
    if (!opts.jsOptimisation) {
      result.noJsOptimisation = true;
    }
    if (!opts.tryIt) {
      result.noTryit = true;
    }
    if ('narrowView' in opts) {
      result.narrowView = true;
    }
    if ('proxy' in opts) {
      result.proxy = opts.proxy;
    }
    if ('proxyEncodeUrl' in opts) {
      result.proxyEncodeUrl = true;
    }
    if ('appendHeaders' in opts) {
      result.appendHeaders = opts.appendHeaders;
    }
    return result;
  }
}

exports.ApiBuild = ApiBuild;
