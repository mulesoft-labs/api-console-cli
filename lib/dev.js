'use strict';
const ApiBase = require('./api-base').ApiBase;
const {ApiConsoleDevPreview} = require('api-console-dev-preview');
const path = require('path');
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
class ApiDev extends ApiBase {

  /**
   * Constructs the server.
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
  }

  parseOptions() {
    var moduleOptions = this._prepareOptions(this.opts);
    moduleOptions = this._validateOptions(moduleOptions);
    this.moduleOptions = moduleOptions;
  }

  _prepareOptions(opts) {
    opts = opts || {};
    var result = {};
    result.api = this.raml;

    if ('projectRoot' in opts) {
      result.projectRoot = opts.projectRoot;
    } else {
      result.projectRoot = path.dirname(path.resolve(this.raml));
    }

    if ('host' in opts) {
      result.host = opts.host;
    }
    if ('port' in opts) {
      result.port = Number(opts.port);
    }
    if ('source' in opts) {
      result.src = opts.source;
    }
    if ('sourceIsZip' in opts) {
      result.sourceIsZip = true;
    }
    if ('tag' in opts) {
      result.tagVersion = opts.tag;
    }
    if ('open' in opts) {
      result.open = true;
    }
    if ('verbose' in opts) {
      result.verbose = true;
    }
    if (!opts.bower) {
      result.noBower = true;
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
    if (this.isRemoteFile(opts.api)) {
      throw new Error('API entry point can\'t be a remote file.');
    }

    var root = path.resolve(opts.projectRoot);
    var file = path.dirname(path.resolve(opts.api));
    if (file.indexOf(root) === -1) {
      throw new Error('API entry point not in the project root.');
    }
    if ('src' in opts && 'tagVersion' in opts) {
      let msg = 'Ambiguous options for API console sources. Provide one of: ';
      msg += '"source", "tagVersion" or none.';
      throw new Error(msg);
    }
    if (!('src' in opts) && opts.sourceIsZip) {
      let msg = 'Invalid use of sourceIsZip. Source is not specified.';
      throw new Error(msg);
    }

    return opts;
  }

  /**
   * Runs the command.
   */
  run() {
    if (!this.moduleOptions) {
      try {
        this.parseOptions();
      } catch (e) {
        return Promise.reject(new Error(e.message));
      }
    }
    const server = new ApiConsoleDevPreview(this.moduleOptions);
    return server.run()
    .then(() => {
      console.log('  Press ctrl + c to stop the server.');
    });
  }
}

exports.ApiDev = ApiDev;
