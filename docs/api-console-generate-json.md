# api-console generate-json

Creates a JSON file from the RAML spec that can be used as a data source for the API Console.

## Basic usage

```
$ api-console generate-json <path or URL to raml file> [OPTIONS]
```

## Command arguments

### `<RAML>`

Type: `String`

**Required.**

Path or URL to a main RAML file.

Any RAML fragments (dependencies) referenced in the main RAML file has to be accessible for current user (either via local filesystem or on remote machine).

The documentation displayed in the API Console will contain information from this RAML file(s).

## Command options

#### -o, --output [value]

Type: `String`

Default: `api.json`

Generated JSON file path.


#### -p, --pretty-print

Type: `String`

Generated JSON in the output file will be formatted.
Note that this will increase build file size.

#### `--verbose`

Type: `Boolean`

Prints the debug output.
