# api-console dev command

Runs a local web server serving a content of the current directory or selected path and observers for changes to any of the project files. When change occur it updates API console data.

It can use API console sources from latest release, specific tag version, remote location of console's sources or local version of the console.

The fastest option to run the command is to have a local copy of the API console
sources with installed bower dependencies. Go to the [api console repository](https://github.com/mulesoft/api-console)
and download latest release. Unpack it anywhere on you local filesystem and inside
unpacked directory run `bower install` command. (Install [bower](https://bower.io) if required).
When ready use `--source` option to point to the sources directory.
Otherwise the command will determine latest release version, download it, install bower and then the dependencies
each time you run the command.


## Basic usage

```
$ api-console dev [OPTIONS] <path to raml file>
```

## Command arguments

### `<RAML>`

Type: `String`

**Required.**

Path to a main RAML file.

If `--project-root` option is specified then the `<raml>` file must be inside project root path.

## Command options

#### -r, --project-root

Type: `String`

API project folder location. Any change made to this location - including subfolders - cause regeneration of data and update to the running instances of the API console.

#### -s, --source \[value\]

Type: `String`

Source of the API console to use. By default this will use latest released version on GitHub. If set and the value is an URL, it must point to a zip file and will set the `--source-is-zip` option automatically. If points to a local path it can be either a folder or to a zip file with the API Console sources. In later case you must set `--source-is-zip` option to unpack the file.

#### -z, --source-is-zip

Type: `Boolean`

Set this option if the API console source (`--source`) points to a zip file that should be uncompressed. If the `--source` is an URL then it will be set automatically.

#### -t, --tag

Type: `String`

Release tag name to use to build the console. To be used to build specific release of the console. Only versions >= 4.0.0.

#### -H, --host \[host\]

Type: `String`

Host name of the web server.

#### -p, --port \[port\]

Type: `Number`

Port name of the server.

#### --no-bower

Type: `Boolean`

If set to `true` it skips bower components installation. Use it if the `src` property points to the api-console sources with all dependencies installed.

#### --open

Type: `Boolean`

If set it opens browser window when console is ready.

#### --verbose

Type: `Boolean`

Prints the debug output.


## Background

This command uses `api-console-dev-preview` package to perform the task. The module uses `raml-js-data-provider` module to observe changes to the project main folder and push changes to clients listening on a web socket.

## Contribution

This command is stable but any comments and feature requests are welcome. Please, file an issue report for errors and feature request if there's anything we could do better.  
