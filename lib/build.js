'use strict';

const fs = require('fs');
const path = require('path');
const ApiBase = require('./api-base').ApiBase;
const {JsonGenerator} = require('./generate-json');
const consoleBuilder = require('api-console-builder');
const del = require('del');
const https = require('https');
const tmp = require('tmp');
const unzip = require('unzip');
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
    /**
     * Generated JSON file path.
     */
    this._jsonFile = 'api.json';
    /**
     * URL to the latest API console sources.
     *
     * TODO: (jarrodek): Update it to the master branch after merging with master.
     */
    this._apiConsoleSrc = opts.consoleSource ||
      'https://github.com/mulesoft/api-console/archive/release/4.0.0.zip';
    this._apiConsoleSrcDir = 'api-console-release-4.0.0';
  }

  /**
   * Runs the command.
   */
  run() {
    this.log('Building API console in %s', this._targetDir);
    return del([this._targetDir])
    .then(() => this.ensurePath(this._targetDir))
    .then(() => this.createTempDirSources())
    .then(() => this.getConsoleSource(this._apiConsoleSrc))
    .then((buffer) => this.writeConsoleSources(buffer))
    .then(() => this.processConsoleSource())
    .then(() => this.generateJson())
    .then(() => this.build())
    .catch((cause) => {
      console.error('Unable to build the console.', cause);
    });
  }

  // Creates a temp dir for the API sources where the zip fil will be unpacked.
  createTempDirSources() {
    return this._createTempDir()
    .then((path) => this._consoleSourcesTempDir = path);
  }

  // Creates a temp dir for the build.
  createTempDir() {
    return this._createTempDir()
    .then((path) => this._tempDir = path);
  }

  _createTempDir() {
    return new Promise((resolve, reject) => {
      tmp.dir((err, path) => {
        if (err) {
          reject(new Error('Unable to create a temp dir: ' + err.message));
          return;
        }
        resolve(path);
      });
    });
  }

  // Generates JSON form RAML
  generateJson() {
    this.log('Generating JSON from RAML to %s', this._jsonFile);
    const generator = new JsonGenerator(this._sourceFile, {
      verbose: this.verbose,
      output: path.join(this._consoleSourcesTempDir, this._apiConsoleSrcDir, this._jsonFile)
    });
    return generator.run();
  }

  getConsoleSource(source) {
    this.log('Downloading latest console from %s', source);
    return new Promise((resolve, reject) => {
      https.get(source, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400) {
          res.resume();
          this.log('Redirecting...');
          return resolve(this.getConsoleSource(res.headers.location));
        }
        if (res.statusCode < 200 && res.statusCode >= 300) {
          reject(new Error('API console source unavailable. Response code: ', res.statusCode));
          res.resume();
          return;
        }
        let rawData;
        res.on('data', (chunk) => {
          if (!rawData) {
            rawData = chunk;
          } else {
            rawData = Buffer.concat([rawData, chunk]);
          }
        });
        res.on('end', () => {
          this.log('API console sources downloaded.');
          resolve(rawData);
        });
      })
      .on('error', (e) => {
        console.error(e);
        reject(new Error(e.message));
      });
    });
  }

  writeConsoleSources(buffer) {
    this.log('Writing source data to file...');
    return new Promise((resolve, reject) => {
      this.log('Creating temp file for API console sources...');
      tmp.file((err, path, fd) => {
        if (err) {
          console.error(err);
          reject(new Error('Unable to create a temp file: ' + err.message));
          return;
        }
        this.log('Writing API console sources to %s', path);
        this._apiConsoleFd = fd;
        fs.writeFile(path, buffer, (err) => {
          if (err) {
            console.error(err);
            reject(new Error('Unable to write to temp file: ' + err.message));
            return;
          }
          this.log('API console sources saved.');
          resolve();
        });
      });
    });
  }
  /**
   * Unzpips the API console sources to a temp directory.
   */
  processConsoleSource() {
    this.log('Unpacking the API console to %s...', this._consoleSourcesTempDir);
    return new Promise((resolve, reject) => {
      fs.createReadStream(undefined, {
        fd: this._apiConsoleFd
      })
      .pipe(unzip.Extract({
        path: this._consoleSourcesTempDir
      }))
      .on('finish', () => {
        this.log('API console sources ready to build');
        resolve();
      })
      .on('error', function() {
        reject(new Error('Unable to unzip the API console sources'));
      });
    });
  }

  build() {
    this.log('Building the API console...');
    return consoleBuilder({
      src: path.join(this._consoleSourcesTempDir, this._apiConsoleSrcDir),
      dest: this._targetDir,
      mainFile: 'index.html',
      jsonFile: path.join(this._consoleSourcesTempDir, this._apiConsoleSrcDir, this._jsonFile),
      verbose: this.verbose
    });
  }
}

exports.ApiBuild = ApiBuild;
