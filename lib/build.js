'use strict';
const ApiBase = require('./api-base').ApiBase;
const consoleBuilder = require('api-console-builder');
const colors = require('colors/safe');
/**
 * The ApiBuild class is a command to build the API Console for specific API spec.
 */
class ApiBuild extends ApiBase {
  /**
   * Constructs the builder.
   * @param {Object} opts Options passed from the command line.
   */
  constructor(opts) {
    super(opts);
    this.opts = opts;
    /**
     * Parsed command options from the command line to pass to the builder module.
     * It will be set automatically while calling the `run()` function if it wans't called before.
     */
    this.moduleOptions = undefined;
  }
  /**
   * Parses CLI options passed to the command and validates them.
   * This function shouldn't be called if there's no need for that because the `run` command
   * will call it if the option s wans't set.
   *
   * This function will throw an Error if option validation didn't passed.
   */
  parseOptions() {
    let moduleOptions = this._prepareOptions(this.opts);
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
    if (opts.attributes && opts.attributes.length) {
      result.attributes = opts.attributes;
    }
    if ('verbose' in opts) {
      result.verbose = true;
    }
    if ('tag' in opts) {
      result.tagVersion = opts.tag;
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
    var isRemote = this.isRemoteFile(opts.raml);
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
}

exports.ApiBuild = ApiBuild;
