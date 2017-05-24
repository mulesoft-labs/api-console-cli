'use strict';
const ApiBase = require('./api-base').ApiBase;
const consoleBuilder = require('api-console-builder');
const colors = require('colors/safe');
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
     * Parsed command options from the command line to pass to the builder module.
     * It will be set automatically while calling the `run()` function if it wans't called before.
     */
    this.moduleOptions = undefined;
    /**
     * URL to the latest API console sources.
     *
     * TODO: (jarrodek): Update it to the master branch after merging with master.
     */
    this._masterSource = 'https://github.com/mulesoft/api-console/archive/release/4.0.0.zip';
  }
  /**
   * Parses CLI options passed to the command and validates them.
   * This function shouldn't be called if there's no need for that because the `run` command
   * will call it if the option s wans't set.
   *
   * This function will throw an Error if option validation didn't passed.
   */
  parseOptions() {
    var moduleOptions = this._prepareOptions(this.opts);
    moduleOptions = this._validateOptions(moduleOptions);
    this.moduleOptions = moduleOptions;
  }

  /**
   * Runs the command.
   */
  run() {
    console.log('  Building the API console. This may take a moment.');
    const startTime = Date.now();
    if (!this.moduleOptions) {
      try {
        this.parseOptions();
      } catch (e) {
        return Promise.reject(new Error(e.message));
      }
    }
    return consoleBuilder(this.moduleOptions)
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
    if (!opts.optimization) {
      result.noOptimization = true;
    }
    if (!opts.cssOptimization) {
      result.noCssOptimization = true;
    }
    if (!opts.htmlOptimization) {
      result.noHtmlOptimization = true;
    }
    if (!opts.jsOptimization) {
      result.noJsOptimization = true;
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
    if ('verbose' in opts) {
      result.verbose = true;
    }
    return result;
  }
  /**
   * Validates if combination of options are OK.
   * It will print a warning message is some error can be fixed automatically using
   * default behaviors or will exit if options are redicules.
   *
   * @param {Object<String, any>} opts The api-console-builder options object.
   * @return {Object<String, any>} Possibly altered options.
   */
  _validateOptions(opts) {
    var isRemote = this._isRemoteFile(opts.raml);
    if (!isRemote && !opts.useJson) {
      let msg = 'You are trying to use local RAML file as an input but the --use-json option';
      msg += 'is not set. \n';
      msg += 'Users won\'t be able to access the RAML file. The CLI will use --use-json to ';
      msg += 'generate a JSON file for build.';
      console.log();
      console.log(colors.bgYellow('Warning:'), colors.yellow(msg));
      console.log();
      opts.useJson = true;
    }
    return opts;
  }
  // Checks if given `url` is a local or remote file.
  _isRemoteFile(url) {
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

exports.ApiBuild = ApiBuild;
