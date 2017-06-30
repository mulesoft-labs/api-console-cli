'use strict';
const {ApiBase} = require('./api-base');
const polyserve = require('polyserve');
const {ServerOptions} = require('polyserve/lib/start_server');
const {args} = require('polyserve/lib/args');
const colors = require('colors/safe');
const url = require('url');
/**
 *
 */
class ApiServe extends ApiBase {

  /**
   * Constructs the builder.
   *
   * @param {String} startPath Target RAML file to build the console from.
   * @param {Object} opts Options passed from the command line.
   */
  constructor(startPath, opts) {
    super(opts);
    this.opts = opts;
    console.log(startPath, opts);
  }

  run() {
    const startServers = polyserve.startServers;
    const getServerUrls = polyserve.getServerUrls;

    const options = this.opts;
    const serverOptions = {
      root: options.root,
      entrypoint: options.entrypoint,
      port: options.port,
      hostname: options.hostname,
      open: options.open,
      browser: options.browser,
      openPath: options.openPath
    };

    return startServers(serverOptions)
    .then((serverInfos) => {
      if (serverInfos.kind === 'mainline') {
        const mainlineServer = serverInfos;
        const urls = getServerUrls(options, mainlineServer.server);
        console.info(
            `Files in this directory are available under the following URLs
        applications: ${url.format(urls.serverUrl)}
        reusable components: ${url.format(urls.componentUrl)}
      `);
      } else {
        // We started multiple servers, just tell the user about the control
        // server, it serves out human-readable info on how to access the others.
        const urls = getServerUrls(options, serverInfos.control.server);
        console.info(`Started multiple servers with different variants:
        View the Polyserve console here: ${url.format(urls.serverUrl)}`);
      }
    });
  }
}

exports.ApiServe = ApiServe;
