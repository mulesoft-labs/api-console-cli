'use strict';

process.title = 'api-console dev';

const program = require('commander');
const colors = require('colors/safe');
const {ApiDev} = require('../lib/dev');
var docs = require('./dev-help.json');

program
  .arguments('<raml>')
  .usage('\n\n  $ api-console dev [options] <raml>')
  .description(docs.main)
  .option('-r, --project-root [path]', docs.projectRoot)
  .option('-H, --host [host]', docs.host)
  .option('-p, --port [port]', docs.port)
  .option('-s, --source [path]', docs.source)
  .option('-z, --source-is-zip', docs.sourceIsZip)
  .option('-t, --tag [version]', docs.tagVersion)
  .option('-o, --open', docs.open)
  .option('--no-bower', docs.noBower)
  .option('--verbose', 'Print verbose messages.')
  .action(function(raml, options) {
    if (!raml) {
      console.log();
      console.log(colors.red('  Source RAML file not specified.'));
      process.exit(1);
      return;
    }
    try {
      const script = new ApiDev(raml, options);
      script.run()
      .catch((cause) => {
        console.log(colors.red('  ' + cause.message));
        console.log();
        if (options.verbose) {
          console.log(cause.stack);
          console.log();
        }
        process.exit(1);
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
    console.log('\n\n  Examples:');
    console.log();
    console.log('    $ api-console dev api.raml');
    console.log('    $ api-console dev --project-root ".." api.raml');
    console.log('    $ api-console dev -o -p 8080  -H corp.console.dev api.raml');
    console.log('    $ api-console dev -s "/path/to/console.zip" --no-bower api.raml');
    console.log();
  })
  .parse(process.argv);
