# api-console serve

Runs a local web server serving a content of the current directory or selected path.

It uses [polyserve](https://github.com/Polymer/polyserve/) module under the hood.

## Basic usage

```
$ api-console serve build
```

## Command arguments

### `[path]`

Type: `String`

**Optional.**

Path to serve in current directory.

It should point to a build folder if the build folder is not current directory.

## Command options

#### -r, --root \[value\]

Type: `String`

The same as passing \[path\] argument.
This value (as an argument) takes precedence over the \[path\] value.

#### -e, --entrypoint \[value\]

Type: `String`

The path on disk of the entry point HTML file that will be served. Must be contained by `root`. Defaults to `index.html`.

#### -p, --port \[value\]

Type: `Number`

The port to serve from

#### -H, --hostname \[value\]

Type: `String`

The hostname to serve from.


#### `-h, --headers [value...]`

Type: `String`

Headers to send with every response.

#### `-o, --open`

Type: `Boolean`

Whether to open the browser when run

#### `-b, --browser [value...]`

Type: `String`

The browser(s) to open when run with open argument.


#### `-l, --open-path [value]`

Type: `String`

The URL path to open in each browser

#### `-P, --protocol [value]`

Type: `String`

The protocol, choice of \[http, https\], defaults to http

#### `-k, --keyPath [value]`

Type: `String`

The file path to ssl key

#### `-c, --certPath [value]`

Type: `String`

jThe file path to ssl cert
