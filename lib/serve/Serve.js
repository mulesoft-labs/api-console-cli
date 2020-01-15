import fs from 'fs-extra';
import path from 'path';
import http from 'http';
import portfinder from 'portfinder';
import open from 'open';
import mime from 'mime-types';

portfinder.basePort = 8000;
portfinder.highestPort = 8888;

export class Serve {
  constructor(opts={}) {
    const { root, entrypoint, port, hostname, headers, open, } = opts;
    this.root = root;
    this.entrypoint = entrypoint;
    this.port = port;
    this.hostname = hostname;
    this.headers = headers;
    this.open = open;
  }
  /**
   * Replaces user options with used by the application values.
   *
   * @return {Promise}
   */
  async setDefaults() {
    await this.setRootPath();
    this.setHeaders();
  }

  /**
   * Sets a `root` path.
   * @return {Promise} [description]
   */
  async setRootPath() {
    const buildFilder = 'build';
    let { root } = this;
    if (!root) {
      const exists = await fs.pathExists(buildFilder);
      if (exists) {
        root = buildFilder;
      } else {
        root = '.';
      }
    }
    this.root = path.resolve(root);
  }

  /**
   * Creates a valid headers object to be passed to the response.
   */
  setHeaders() {
    const result = {};
    const { headers } = this;
    if (headers && headers.length) {
      headers.forEach((header) => {
        const { name, value } = header;
        if (result[name]) {
          result[name] += `, ${value}`;
        } else {
          result[name] = value;
        }
      });
    }
    this.headers = result;
  }

  /**
   * Runs the command.
   * When then command is executed the process is still active until the user
   * interrupt it or `stopServer()` is called.
   *
   * @return {Promise}
   */
  async run() {
    await this.setDefaults();
    await this._create();
    ['exit', 'SIGINT'].forEach((event) => {
      process.on(event, () => {
        process.exit(0, this.stopServer.bind(this));
      });
    });
    process.on('uncaughtException', error => {
      /* eslint-disable-next-line no-console */
      console.error(error);
      this.stopServer();
    });
  }

  /**
   * Creates and starts the server.
   * @return {Promise}
   */
  async _create() {
    let port;
    try {
      port = typeof this.port === 'number' ? this.port : await portfinder.getPortPromise();
    } catch (_) {
      throw new Error('Unable to find free port to use.');
    }
    this.server = http.createServer(this._requestHandler.bind(this));
    this.server.listen(port, this.hostname, this._createdHandler.bind(this));
  }

  /**
   * Stops the server if exists.
   */
  stopServer() {
    const { server } = this;
    if (server) {
      server.close();
      this.server = undefined;
    }
  }

  /**
   * A handler for a request.
   * It tries to serve the requested content or sends 404 if not found.
   *
   * @param {Object} req
   * @param {Object} res
   * @return {Promise}
   */
  async _requestHandler(req, res) {
    let { url } = req;
    const { root, entrypoint, } = this;
    if (!url || url === '/') {
      url = entrypoint;
    }
    const file = path.join(root, url);
    const exists = await fs.pathExists(file);
    if (!exists) {
      this._send404(res);
      return;
    }
    const stat = await fs.stat(file);
    if (!stat.isFile()) {
      this._send404(res);
      return;
    }
    const content = await fs.readFile(file);
    const ct = mime.lookup(file) || 'text/plain';
    const headers = { ...this.headers };
    headers['content-type'] = ct;
    res.writeHead(200, headers);
    res.end(content);
  }

  /**
   * Sends 404 response.
   * @param {Object} res
   */
  _send404(res) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('The requested path does not exist.');
  }

  /**
   * A handler for when the server is created and ready to be served.
   * Prints info message to the console.
   *
   * @return {Promise}
   */
  async _createdHandler() {
    const addr = this.server.address();
    const hostname = addr.address;
    const port = addr.port;
    const msgs = [''];
    msgs.push(`started server on http://${hostname}:${port}`);
    msgs.push(`  Serving files from '${this.root}'.`);
    if (this.open) {
      msgs.push(`  Opening browser for ${this.entrypoint}.`);
    }
    msgs.push('');
    /* eslint-disable-next-line no-console */
    console.log(msgs.join('\n'));
    // boxen
    if(this.open) {
      await open(`http://${hostname}:${port}/${this.entrypoint}`);
    }
  }
}
