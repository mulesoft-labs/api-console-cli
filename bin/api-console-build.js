'use strict';

process.title = 'api-console build';

const program = require('commander');
const colors = require('colors/safe');
const {ApiBuild} = require('../lib/build');

var desc = 'Use this command to build the API Console as a standalone application that can be ';
desc += 'used as a web page hosted on any server.';

program
  .arguments('<raml>')
  .description(desc)
  .option('-o, --output', 'Output dir. Default to "./build/".')
  .option('--console-source',
    'An URL to a zip file with the API console source. Defaul to current release')
  .option('--verbose', 'Print verbose messages.')
  .action(function(raml, options) {
    console.log();
    if (!raml) {
      console.log(colors.red('  Source RAML file not specified.'));
      process.exit(1);
      return;
    }
    try {
      const script = new ApiBuild(raml, options);
      script.run().catch((cause) => {
        throw new Error(cause.message);
      });
    } catch (e) {
      console.log(colors.red('  ' + e.message));
      console.log();
      if (options.verbose) {
        console.log(e.stack);
        console.log();
      }
      process.exit(1);
    }
  })
  .on('--help', function() {
    console.log('  Examples:');
    console.log();
    console.log('    $ api-console build ./api.raml');
    console.log('    $ api-console build http://domain.com/api.raml');
    console.log('    $ api-console build ./api.raml -o "../api-docs"');
    console.log();
  })
  .parse(process.argv);
