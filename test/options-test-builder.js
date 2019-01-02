const {Command} = require('commander');

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

class OptionsTestBuilder {

  static parseArgs(args) {
    if (typeof args === 'string') {
      args = args.split(' ');
    }
    let result = [];
    result.push(process.argv[0]);
    result.push(__filename);
    result = result.concat(args);
    return result;
  }

  static optionsForBuild(args) {
    return new Promise((resolve) => {
      args = OptionsTestBuilder.parseArgs(args);
      const program = new Command();
      program
        .option('-o, --output [path]')
        .option('-l, --local [path]')
        .option('-n, --tag-name [version]')
        .option('-a, --api [path]')
        .option('-t, --api-type [type]')
        .option('--theme-file [path]')
        .option('--attr, --attributes [name]:<value>', '', collectArguments, [])
        .option('-e, --embedded')
        .option('--no-oauth')
        .option('--no-crypto-js')
        .option('--no-js-polyfills')
        .option('--no-xhr')
        .option('--no-web-animations')
        .option('--no-cache')
        .option('--verbose')
        .option('--no-ga')
        .parse(args);
      resolve(program);
    });
  }
}

exports.OptionsTestBuilder = OptionsTestBuilder;
