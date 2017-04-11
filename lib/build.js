'use strict';

// const fs = require('fs');
// const path = require('path');
const ApiBase = require('./api-base').ApiBase;

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
    /**
     * The RAML source file.
     */
    this._sourceFile = raml;
    /**
     * A place where to put the API console source code.
     */
    this._targetDir = opts.output || './build/';
  }

  /**
   * Runs the command.
   */
  run() {
    return new Promise((resolve) => {
      resolve();
    });
  }
}

exports.ApiBuild = ApiBuild;
