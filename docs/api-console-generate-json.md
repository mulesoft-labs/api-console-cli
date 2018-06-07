# api-console generate-json

Creates a JSON file from the RAML spec that can be used as a data source for the API Console.

## Basic usage

```
$ api-console generate-json <path or URL to raml file> [OPTIONS]
```

## Command arguments

### `<api-file>`

Type: `String`

**Required.**

Path or URL to an API spec file file.

## Command options

#### -t, --type \[value\]

Type: `String`

Type of the API file. One of:

-   RAML 0.8
-   RAML 1.0
-   OAS 1.0
-   OAS 2.0
-   OAS 3.0

#### -o, --output \[value\]

Type: `String`

Default: `api.json`

Generated JSON file path.

#### `--verbose`

Type: `Boolean`

Prints the debug output.
