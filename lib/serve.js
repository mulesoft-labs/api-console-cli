'use strict';
const {ApiBase} = require('./api-base');
const polyserve = require('polyserve');
const url = require('url');
/**
 * Based on Polyserve library lightweigth www server to display build results.
 */
class ApiServe extends ApiBase {

  /**
   * Constructs the builder.
   *
   * @param {Object} opts Options passed from the command line.
   */
  constructor(opts) {
    super(opts);
    this.opts = this._applyOpts(opts);
  }

  _applyOpts(options) {
    var root = options.root;
    if (!root && options.args && options.args.length) {
      root = options.args[0];
    }
    var opts = {};
    // Set protocol as http by default
    opts.protocol = 'http';

    if (root) {
      opts.root = root;
    }
    if (options.entrypoint) {
      opts.entrypoint = options.entrypoint;
    }
    if (options.port) {
      opts.port = options.port;
    }
    if (options.hostname) {
      opts.hostname = options.hostname;
    }
    if (options.open) {
      opts.open = options.open;
    }
    if (options.browser && options.browser.length) {
      opts.browser = options.browser;
    }
    if (options.openPath) {
      opts.openPath = options.openPath;
    }
    if (options.protocol) {
      var possibleProtocols = ['http', 'https'];
      opts.protocol = ~possibleProtocols.indexOf(options.protocol) ?
        options.protocol : 'http';
    }
    if (options.keyPath) {
      opts.keyPath = options.keyPath;
    }
    if (options.certPath) {
      opts.certPath = options.certPath;
    }
    return opts;
  }

  run() {
    const startServers = polyserve.startServers;
    const getServerUrls = polyserve.getServerUrls;
    return startServers(this.opts)
    .then((serverInfos) => {
      if (serverInfos.kind === 'mainline') {
        const mainlineServer = serverInfos;
        const urls = getServerUrls(this.opts, mainlineServer.server);
        console.info(
            `Files in this directory are available under the following URLs
        applications: ${url.format(urls.serverUrl)}
      `);
      } else {
        // We started multiple servers, just tell the user about the control
        // server, it serves out human-readable info on how to access the others.
        const urls = getServerUrls(this.opts, serverInfos.control.server);
        console.info(`Started multiple servers with different variants:
        View the Polyserve console here: ${url.format(urls.serverUrl)}`);
      }
    });
  }
}

exports.ApiServe = ApiServe;
