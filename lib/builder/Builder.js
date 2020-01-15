import { ApiConsoleProject } from '@api-components/api-console-builder';

export class Builder {
  constructor(opts={}) {
    this.opts = opts;
  }

  /**
   * Runs the command.
   * @return {Promise<void>}
   */
  async run() {
    const projectOpts = this.translateOptions(this.opts);
    const project = new ApiConsoleProject(projectOpts);
    await project.bundle();
  }

  /**
   * Translates CLI options to builder options definition.
   * @param {Object} opts A map of user options
   * @return {Object} List of builder options
   */
  translateOptions(opts={}) {
    const result = {};
    if (opts.tagName) {
      result.tagName = opts.tagName;
    }
    // API data options
    if (opts.api) {
      result.api = opts.api;
    }
    if (opts.apiType) {
      result.apiType = opts.apiType;
    }
    if (opts.apiMediaType) {
      result.apiMediaType = opts.apiMediaType;
    }
    // Build options
    if (opts.output) {
      result.destination = opts.output;
    }
    if (opts.theme) {
      result.themeFile = opts.theme;
    }
    if (opts.index) {
      result.indexFile = opts.index;
    }
    if (opts.appTitle) {
      result.appTitle = opts.appTitle;
    }
    if (opts.verbose) {
      result.verbose = true;
    }
    if (opts.noCache) {
      result.noCache = true;
    }
    if (opts.strict) {
      result.strict = true;
    }
    if (opts.attr && opts.attr.length) {
      result.attributes = this.translateAttributes(opts.attr);
    }
    return result;
  }

  /**
   * Translates CLI attributes array into the struct accepted by the builder.
   * @param {Array<Object>} attr List of attributes.
   * @return {Array<String|Object>} Generated list of attributes
   */
  translateAttributes(attr) {
    const result = [];
    attr.forEach((item) => {
      const { name, value } = item;
      item = {};
      item[name] = value;
      result[result.length] = item;
    });
    return result;
  }
}
