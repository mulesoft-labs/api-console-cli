import { ProjectConfiguration } from '@api-components/api-console-builder';

export declare interface BuilderOptions {
  /**
   * A release tag name to use. With this option the builder uses specific
   * release of the console. If not set and `src` is not set it uses latest
   * release. Note, only versions >= 6.0.0 can be used with this builder.
   */
  tagName?: string;

  /**
   * Output directory.
   */
  output?: string;

  /**
   * Location of API specification main file.
   * AMF by default supports RAML (0.8, 1.0) and OAS (2, 3) formats.
   *
   * Unlike previous versions of this library, now `api` property is required.
   * The build will fail if this is not set.
   *
   * Set `apiType` property to corresponding value (type of the API,
   * see below).
   *
   * @default `undefined`.
   */
  api?: string;

  /**
   * Type of an API spec file recognizable by [AMF](https://github.com/mulesoft/amf).
   * To be set with `api` property.
   *
   * By default AMF supports following types:
   * - `RAML 0.8`
   * - `RAML 1.0`
   * - `OAS 2.0`
   * - `OAS 3.0`
   */
  apiType?: string;

  /**
   * Media type of the API.
   * For RAML files it is always `application/yaml`.
   * OAS comes with two flavours: `application/yaml` and `application/json`.
   *
   * Use it when the library can't process API spec file due to processing error.
   *
   * @default application/raml
   */
  apiMediaType?: string;

  /**
   * Prints a debug messages.
   */
  verbose?: boolean;

  /**
   * An array of attributes to be set on the `<api-console>` element.
   *
   * For boolean attributes just add name of the attribute as string.
   *
   * For attributes with values add a map where the key is the attribute name
   * and value is the attribute value.
   *
   * Note: Do not use camel case notation. It will not work. See the example.
   *
   * ### Example
   *
   * ```
   * const attributes = [
   *  'proxyencodeurl',
   *  {'proxy': 'https://proxy.domain.com'},
   *  'notryit',
   *  {'page': 'request'},
   * ]
   * ```
   *
   * Example above is the same as:
   *
   * ```
   * const attributes = [
   *  'proxyencodeUrl',
   *  'notryit',
   *  {
   *    'proxy': 'https://proxy.domain.com',
   *    'page': 'request'
   *  }
   * ]
   * ```
   *
   * and will produce the following output:
   *
   * ```
   * <api-console
   *  proxyencodeUrl
   *  notryit
   *  page="request"
   *  proxy="https://proxy.domain.com"
   * ></api-console>
   * ```
   *
   * List of all available options can be found here:
   * https://github.com/mulesoft/api-console/blob/master/docs/configuring-api-console.md
   *
   * Note, you don't need to set this property when providing own `indexFile`.
   * Simply define attributes in the file.
   */
  attr?: (string|object)[];

  /**
   * Location to a theme file with styles definition of the console.
   * It replaces Console's own styles definition.
   * See theming documentation of the API console for more information.
   */
  theme?: string;

  /**
   * Location to a custom `index.html` file that will be used instead of the
   * default template.
   *
   * The template file must include vendor package, API Console sources, and
   * the use of API Console. See `templates/index.html` for an example.
   */
  index?: string;

  /**
   * By default the builder caches build results in user home folder and uses generated
   * sources to speed up the build process.
   *
   * Note, options that influence the build process (`tagName`,
   * `themeFile`, `indexFile`, etc) creates new cached file.
   *
   * API model is never cached.
   */
  noCache?: boolean;

  /**
   * When set to `true` it will stop build process with error when a minor
   * issue has been detected, like missing theme file in declared location
   * which is normally ignored.
   */
  strict?: boolean;

  /**
   * Optional application title put into HTML's `<title>` tag.
   * By default it uses API title or `API Console` if missing.
   */
  appTitle?: string;
}

export declare class Builder {
  opts: BuilderOptions;

  constructor(opts?: BuilderOptions);

  /**
   * Runs the command.
   */
  run(): Promise<void>;

  /**
   * Translates CLI options to builder options definition.
   * @param {BuilderOptions} opts A map of user options
   * @return {ProjectConfiguration} List of builder options
   */
  translateOptions(opts?: BuilderOptions): ProjectConfiguration;

  /**
   * Translates CLI attributes array into the struct accepted by the builder.
   * @param attr List of attributes.
   * @returns Generated list of attributes
   */
  translateAttributes(attr: object[]): object[];
}
