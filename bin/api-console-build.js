'use strict';

process.title = 'api-console build';

const program = require('commander');
const colors = require('colors/safe');
const {ApiBuild} = require('../lib/build');
var docs = require('./build-help.json');

program
  .arguments('<raml>')
  .description(docs.main)
  .option('-o, --output', docs.output)
  .option('-s, --source', docs.source)
  .option('-f, --main-file', docs.mainFile)
  .option('-z, --source-is-zip', docs.sourceIsZip)
  .option('-j, --json', docs.useJson)
  .option('-i, --inline-json', docs.inlineJson)
  .option('-e, --embedded', docs.embedded)
  .option('-l, --compilation-level', docs.jsCompilationLevel)
  .option('--no-optimisation', docs.noOptimisation)
  .option('--no-css-optimisation', docs.noCssOptimisation)
  .option('--no-html-optimisation', docs.noHtmlOptimisation)
  .option('--no-js-optimisation', docs.noJsOptimisation)
  .option('--no-try-it', docs.noTryIt)
  .option('--narrow-view', docs.narrowView)
  .option('--proxy', docs.proxy)
  .option('--proxy-encode-url', docs.proxyEncodeUrl)
  .option('--append-headers', docs.appendHeaders)
  .option('--verbose', 'Print verbose messages.')
  .action(function(raml, options) {
    if (!raml) {
      console.log();
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
    console.log('    $ api-console build http://domain.com/api.raml --json');
    console.log('    $ api-console build ./api.raml -o "../api-docs"');
    console.log();
  })
  .parse(process.argv);
