# API console CLI

The command-line tool for the API Console Web Component.

Note, this version works with API console version 4.x.x only.

## Features

-   **build** - Build the api console application optimized for production
-   **generate-json** - Regenerates the JSON file that can be used as a data source in the Console
-   **serve** - Creates a http server on local machine and serves content of current folder.
-   **dev** - Observes a directory with the API spec and runs the API console preview. Refreshes the API data when a file in the directory change.

## Installation

```
$ npm install -g api-console-cli
```

## Command Overview

### `api-console [COMMAND] --help`

Run `api-console --help` to get a list of supported commands. Pass it a command name (ex: `api-console build --help`) to get detailed information about that command and the options it supports.

### `api-console build <RAML PATH> [options]`

Builds the API Console for specific API definition. The build is optimized for production, meaning code bundling and minification.

Most optimizations are enabled by default. You can disable optimization for minification of html, CSS and JS respectively or disable any optimization at all.

Run `api-console build --help` for the full list of available options & optimizations.

Detailed description of all options you can find here: [api-console build doc](docs/api-console-build.md)

### `api-console generate-json <RAML PATH> [options]`

Creates a JSON file from the RAML spec that can be used as a data source for the API Console.

One of the optimization options it to create a JSON file instead of parsing YAML in the browser. This command allows you to create / regenerate this JSON file instead of rebuilding the whole console.

Run `api-console generate-json --help` for the full list of available options & optimizations.

Detailed description of all options you can find here: [api-console generate-json doc](docs/api-console-generate-json.md)

### `api-console serve [options] [path]`

Runs a local web server serving a content of the current directory or selected path.

Detailed description of all options you can find here: [api-console serve doc](docs/api-console-serve.md)

### `api-console dev [options] <raml>`

Runs a local web server serving a content of the current directory or selected path and observers for changes to any of the project files. When change occur it updates API console data.

Detailed description of all options you can find here: [api-console dev doc](docs/api-console-dev.md)

## Contribution

Your feedback is welcome. If you need support for a method, command options other than described here please, file a feature request. If you find a bug, please, file a bug report with details so we can fix it.
