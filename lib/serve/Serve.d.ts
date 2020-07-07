import http from 'http';

export declare interface Header {
  name: string;
  value: string;
}

export declare interface ServeOptions {
  root?: string;
  entrypoint?: string;
  port?: number;
  hostname?: string;
  headers?: Header[];
  open?: boolean;
}

export declare const headersValue: symbol;

export declare class Serve {
  root?: string;
  entrypoint?: string;
  port?: number;
  hostname?: string;
  headers?: Header[];
  open?: boolean;
  constructor(opts?: ServeOptions);

  /**
   * Replaces user options with used by the application values.
   */
  setDefaults(): Promise<void>;

  /**
   * Sets a `root` path.
   */
  setRootPath(): Promise<void>

  /**
   * Creates a valid headers object to be passed to the response.
   */
  setHeaders(): void;

  /**
   * Runs the command.
   * When then command is executed the process is still active until the user
   * interrupt it or `stopServer()` is called.
   */
  run(): Promise<void>;

  /**
   * Creates and starts the server.
   */
  _create(): Promise<void>;

  /**
   * Stops the server if exists.
   */
  stopServer(): void;

  /**
   * A handler for a request.
   * It tries to serve the requested content or sends 404 if not found.
   */
  _requestHandler(req: http.IncomingMessage, res: http.ServerResponse): Promise<void>;

  /**
   * Sends 404 response.
   */
  _send404(res: http.ServerResponse): void;

  /**
   * A handler for when the server is created and ready to be served.
   * Prints info message to the console.
   */
  _createdHandler(): Promise<void>;
}
