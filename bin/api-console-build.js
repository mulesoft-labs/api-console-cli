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
  .arguments('<api>')
  .usage('\n\n  $ api-console build [options]')
  .description(docs.main)
  .option('-o, --output [path]', docs.output)
  .option('-s, --source [path]', docs.source)
  .option('-t, --tag [version]', docs.tagVersion)
  .option('-e, --embedded', docs.embedded)
  .option('-a, --api', docs.api)
  .option('-at, --api-type', docs.apiType)
  .option('-theme-file', docs.themeFile)
  .option('-attr, --attributes [name]:<value>', docs.attributes, collectArguments, [])
  .option('-no-oauth', docs.noOauth)
  .option('-no-crypto-js', docs.noCryptoJs)
  .option('-no-js-polyfills', docs.noJsPolyfills)
  .option('-no-xhr', docs.noXhr)
  .option('-no-web-animations', docs.noWebAnimations)
  .option('--verbose', 'Print verbose messages.')
  .action(function(options) {
    try {
      const script = new ApiBuild(options);
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
    console.log('    $ api-console build -a ./api.raml -at RAML 1.0');
    console.log('    $ api-console build -a http://domain.com/api.raml -at RAML 1.0');
    console.log('    $ api-console build -a ./api.raml -at RAML 1.0 -o "../api-docs"');
    console.log('    $ api-console build -a ./api.raml -at RAML 1.0 -attr proxy:https://proxy.com');
    console.log();
  })
  .parse(process.argv);
