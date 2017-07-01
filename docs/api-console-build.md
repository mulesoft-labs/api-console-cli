# api-console build command

Builds the API Console for specific API definition. The build is optimized for production, meaning code bundling and minification.


## Basic usage

```
$ api-console build <path or URL to raml file> [OPTIONS]
```

## Command arguments

### `<RAML>`

Type: `String`

**Required.**

Path or URL to a main RAML file.

Any RAML fragments (dependencies) referenced in the main RAML file has to be accessible for current user (either via local filesystem or on remote machine).

The documentation displayed in the API Console will contain information from this RAML file(s).

## Command options

#### -s, --source [value]

Type: `String`

Source of the API console to use. By default this will use latest release version. If set and the value is an URL, it must point to a zip file and will set the `--source-is-zip` option automatically. If points to a local path it can be either a folder with the API Console application or to zip file with the API Console sources. In later case you must set `--source-is-zip` option.

#### -t, --tag

Type: `String`

Release tag name to use to build the console. To be used to build specific release of the console. Only versions >= 4.0.0.

#### -o, --output [value]

Type: `String`

Output directory. Defaults to `./build`.

#### -z, --source-is-zip

Type: `Boolean`

Set this option if the API console source (`--source`) points to a zip file that should be uncopressed. If the `--source` is an URL then it will be set automatically.

#### -f, --main-file [value]

Type: `String`

Source index file, an entry point to the application. Useful for custom builds, when you want to transform your application that is using the API Console to build your application.

Don't set it when downloading the API Console source code from GitHub. Then it will use one of the build-in templates depending on other options. Should point to a file that contains web components imports.

##### Example

```
$ api-console build --main-file imports.html
```

This command assumes that all API Console imports are located in `imports.html` file. Built `imports.html` file should be included in your application using `<link ref="import">` directive.

#### -j, --json

Type: `Boolean`

One of the optimization options. If set, it will generate a JSON file out of the RAML file and will use this pre-generated data as a source in the console.

Use this option to optimize console's load time. It will not include RAML parser and JSON transformer into the build and will use pre-generated JSON to load it into the console. Note that you will have to regenerate the JSON file  each time your API spec changes to reflect the changes.

Generated file will be always named `api.json` file. This may change in the future.

#### -i, --inline-json

Type: `Boolean`

One of the optimization options. Set to inline pre-generated JSON data (with `--json` option) in the main file instead of creating external JSON file.

It is only valid if `--embedded` is not set. Embedded version of the API console always require external JSON file (subject to change).

#### -e, --embedded

Type: `Boolean`

If set it will generate an import file, `import.html`, that will contain bundled API Console. This file can be used in any web application via `<link ref="import">` directive.

Generated sources will contain an example of use of the `api-console` HTML element on any web page.

#### -l, --compilation-level [value]

Type: `String`

Default: `WHITESPACE_ONLY`

Possible values:
- WHITESPACE_ONLY
- SIMPLE

Level of JavaScript compilation used by [Google Closure Compiler](https://developers.google.com/closure/compiler/). Possible options are `WHITESPACE_ONLY` and `SIMPLE`.

**Please, do not use `ADVANCED` level.**

Option `SIMPLE` will make the build process longer than WHITESPACE_ONLY but it will produce less code. Defaults to `WHITESPACE_ONLY`

#### --no-optimization

Type: `Boolean`

If set it will not perform any code optimization. It will disable:
- comments removal
- JS compilation
- HTML minification
- CSS minification

It should be used only for development to reduce build time. Output will contain more data and therefore will be bigger.

This command equals setting `--no-css-optimization`, `--no-html-optimization`, and `--no-js-optimization` all together.

#### --no-css-optimization

Type: `Boolean`

Disables CSS minification (CSS files and `<style>` declarations).


#### --no-html-optimization

Type: `Boolean`

Disables HTML minification. Also disables comments removal.

#### --no-js-optimization

Type: `Boolean`

Disables JavaScript compilation with Google Closure Compiler.

#### -a, --arguments

Type: `String`

List of attributes to set on the console. For attributes with values set value after a colon (:).

##### Examples

```shell
$ api-console build -a no-try-it
```

```shell
$ api-console build -a proxy:http://domain.com
```

```shell
$ api-console build -a append-headers:x-api-token:123\\naccept:application/json
```

#### --verbose

Type: `Boolean`

Prints the debug output.
