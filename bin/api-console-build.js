'use strict';

process.title = 'api-console build';

const program = require('commander');
const colors = require('colors/safe');
const {ApiBuild} = require('../lib/build');
var docs = require('./build-help.json');

function collectArguments(val, memo) {
  if (!val) {
    return;
  }
  var index = val.indexOf(':');
  if (index !== -1) {
    let name = val.substr(0, index);
    let value = val.substr(index + 1);
    val = {};
    val[name] = value;
  }
  memo.push(val);
  return memo;
}
program
  .arguments('<raml>')
  .usage('\n\n  $ api-console build [options] <raml>')
  .description(docs.main)
  .option('-o, --output [path]', docs.output)
  .option('-s, --source [path]', docs.source)
  .option('-t, --tag [version]', docs.tagVersion)
  .option('-f, --main-file [path]', docs.mainFile)
  .option('-z, --source-is-zip', docs.sourceIsZip)
  .option('-j, --json', docs.useJson)
  .option('-i, --inline-json', docs.inlineJson)
  .option('-e, --embedded', docs.embedded)
  .option('-l, --compilation-level [level]', docs.jsCompilationLevel)
  .option('-a, --attributes [name]:<value>', docs.attributes, collectArguments, [])
  .option('-n, --no-optimization', docs.nooptimization)
  .option('--no-css-optimization', docs.noCssoptimization)
  .option('--no-html-optimization', docs.noHtmloptimization)
  .option('--no-js-optimization', docs.noJsoptimization)
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
    console.log('    $ api-console build ./api.raml');
    console.log('    $ api-console build http://domain.com/api.raml --json');
    console.log('    $ api-console build ./api.raml -o "../api-docs"');
    console.log('    $ api-console build ./api.raml -a proxy:https://proxy.com');
    console.log();
  })
  .parse(process.argv);
