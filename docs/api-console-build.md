# api-console build command

Builds the API Console for specific API definition, optimized for production.


## Basic usage

__Preview notice__

API console version 5 is in preview. Because of that the sources resolution won't find
the package until specific tag is provided. To build the console always add `-n "5.0.0-preview-1"` to the command.

```
$ api-console build [OPTIONS] -a <path or URL to raml/oas file> -t "API TYPE"
```

## Command options

#### -a, --api \[value\]

Type: `String`

Location to an API file to use to generate data model.

#### -t, --api-type \[value\]

Type: `String`

Type of the API file. One of:

-   RAML 0.8
-   RAML 1.0
-   OAS 1.0
-   OAS 2.0
-   OAS 3.0

#### -l, --local \[value\]

Type: `String`

Location of local sources of the API console to use with the build process.
By default this will use latest released version from GitHub.

#### -n, --tag-name

Type: `String`

Release tag name to use to build the console. To be used to build specific release of the console. Only versions >= 5.0.0.

#### -o, --output \[value\]

Type: `String`

Output directory. Defaults to `./build`.

#### --theme-file

Type: `String`

Location of a theme file that should replace console's default theme.

#### -e, --embedded

Type: `Boolean`

Creates a bundles of the API console to be imported into your website. When
the console is included into the website it can be used as a HTML element.

#### --no-oauth

Type: `Boolean`

Use it when you know what you are doing. Prohibits including ARC OAuth library
to the build to reduce build size. It's to be used if the app already support
OAuth authorization and can handle API console's OAuth events.

This option is ignored when `embedded` is set.

#### no-crypto-js

Type: `Boolean`

Use it when you know what you are doing. Prohibits including CryptoJs library into
the build. Use this option if you embedding the console on a website that already
uses CryptoJs library.

This option is ignored when `embedded` is set.

#### no-js-polyfills

Type: `Boolean`

Prohibits including JS polyfills (for Array class in most cases and for Polyfills).
If you targeting only modern browsers you may want to use this option.
Polyfills are never included into `es6-bundle` build.

This option is ignored when `embedded` is set.

#### no-xhr

Type: `Boolean`

Prohibits including XHR component into the build. If your application is planning
to handle `api-request` and `api-response` custom events then set this option to
reduce size of the bundle.

This option is ignored when `embedded` is set.

#### no-web-animations

Type: `Boolean`

Right no there's no browser that support Web Animations specification natively
so don't use it.
When set, web animations polyfill is not included into the build.

This option is ignored when `embedded` is set.

#### no-cache

Type: `Boolean`

To speed up the build process the module caches build result by default so next
build will result with restoring cached data (API data model is always regenerated).

To prevent the module from using cached file, set this option and the build is
always performed from latest sources.

#### -a, --arguments

Type: `String`

List of attributes to set on the console. For attributes with values set value after a colon (:).

This options is valid only if `embedded` is not set.

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
