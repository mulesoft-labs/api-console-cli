# API console CLI

The command-line tool for the MuleSoft API Console.

## Features

- __build__ - Build the API Console application optimized for production
- __generate-json__ - (Re)generates the JSON file that is accepted as console's data model
- __serve__ - Test generated bundle in local environment.

## Installation

```sh
npm i -g api-console-cli
```

In macOS and Linux you may need to use `sudo` prefix.

## Compatibility

__This version does not work with API console version 4 and 5__.

This CLI tool works with version 6 only.

Please, use other versions of the CLI for previous versions of the console. Note, that previous versions of API Console are not longer supported. Please, see [API Console Docs](https://docs.api-console.io/) for latest release documentation.

```sh
npm install -g api-console-cli@1.0.14
```

## Command Overview

CLI __--help__ is your friend. Run any command with `--help` option to see list of available options.

### General options

#### `api-console [COMMAND] --help`

Run `api-console --help` to get a list of supported commands. Pass it a command name (ex: `api-console build --help`) to get detailed information about that command and the options it supports.

## Commands

### `api-console build -t TYPE [options] FILE`

Builds the API Console for specific API definition. The build is optimized for production.

### `api-console generate-json -t TYPE [options] FILE`

Creates a JSON file from the RAML or OAS spec that can be used as a data source for the API Console.

### `api-console serve [options] [PATH]`

Runs a local web server serving a content of the current directory or selected path.

## Supported APIs

API Console consumes [AMF](https://github.com/aml-org/amf) data model generated from one of the following specifications:

- RAML 1.0
- RAML 0.8
- OAS 2.0
- OAS 3.0 - Experimental support. There might be some issues.

API support is not covered by nighter this CLI tool, building module, or API Console. This is provided by the AMF parser.

## Contribution

Your feedback is welcome. If you need support for a method, command options other than described here please, file a feature request. If you find a bug, please, file a bug report with details so we can fix it.
