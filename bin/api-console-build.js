'use strict';

process.title = 'api-console build';

const program = require('commander');
const colors = require('colors/safe');
const docs = require('./build-help.json');

function collectArguments(val, memo) {
  if (!val) {
    return;
  }
  const index = val.indexOf(':');
  if (index !== -1) {
    const name = val.substr(0, index);
    const value = val.substr(index + 1);
    val = {};
    val[name] = value;
  }
  memo.push(val);
  return memo;
}
program
  .usage('\n\n  $ api-console build [options]')
  .description(docs.main)
  .option('-o, --output [path]', docs.output)
  .option('-l, --local [path]', docs.local)
  .option('-n, --tag-name [version]', docs.tagName)
  .option('-a, --api [path]', docs.api)
  .option('-t, --api-type [type]', docs.apiType)
  .option('--theme-file [path]', docs.themeFile)
  .option('--attr, --attributes [name]:<value>', docs.attributes, collectArguments, [])
  .option('-e, --embedded', docs.embedded)
  .option('--no-oauth', docs.noOauth)
  .option('--no-crypto-js', docs.noCryptoJs)
  .option('--no-js-polyfills', docs.noJsPolyfills)
  .option('--no-xhr', docs.noXhr)
  .option('--no-web-animations', docs.noWebAnimations)
  .option('--no-cache', docs.noCache)
  .option('--verbose', 'Print verbose messages.')
  .option('--no-ga', 'Disallow Google Analytics when running this command')
  .on('--help', function() {
    console.log('\n\n  Examples:');
    console.log();
    console.log('    $ api-console build -a ./api.raml -t "RAML 1.0"');
    console.log('    $ api-console build -a http://domain.com/api.raml -t "RAML 1.0"');
    console.log('    $ api-console build -a ./api.raml -t "RAML 1.0" -o "../api-docs"');
    console.log('    $ api-console build -a ./api.raml -t "RAML 1.0" -attr proxy:https://proxy.com');
    console.log();
  })
  .parse(process.argv);

try {
  const {ApiBuild} = require('../lib/build');
  const script = new ApiBuild(program);
  script.run()
  .catch((cause) => {
    console.log(colors.red('  ' + cause.message));
    console.log();
    if (program.verbose) {
      console.log(cause.stack);
      console.log();
    }
    process.exit(1);
  });
} catch (e) {
  console.log(colors.red('  ' + e.message));
  console.log();
  if (program.verbose) {
    console.log(e.stack);
    console.log();
  }
  process.exit(1);
}
