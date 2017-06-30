'use strict';

process.title = 'api-console serve';

const program = require('commander');
const colors = require('colors/safe');
const {ApiServe} = require('../lib/serve');
var docs = require('./serve-help.json');

program
  .arguments('[path]')
  .description(docs.description)
  .option('-r, --root [value]', docs.root)
  .option('-e, --entrypoint [value]', docs.entrypoint)
  .option('-p, --port [value]', docs.mainFile, parseInt)
  .option('-H, --hostname [value]', docs.hostname)
  .option('-h, --headers [value...]', docs.headers)
  .option('-o, --open', docs.open)
  .option('-b, --browser [value...]', docs.browser)
  .option('-l, --open-path [value]', docs.openPath)
  .action(function(path, options) {
    try {
      const script = new ApiServe(path, options);
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
    console.log('  Examples:');
    console.log();
    console.log('    $ api-console serve');
    console.log('    $ api-console serve build/');
    console.log('    $ api-console serve --open');
    console.log();
  })
  .parse(process.argv);
