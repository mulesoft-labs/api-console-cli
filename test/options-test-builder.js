const {Command} = require('commander');

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

class OptionsTestBuilder {

  static parseArgs(args) {
    if (typeof args === 'string') {
      args = args.split(' ');
    }
    var result = [];
    result.push(process.argv[0]);
    result.push(__filename);
    result = result.concat(args);
    return result;
  }

  static optionsForBuild(args) {
    return new Promise((resolve) => {
      args = OptionsTestBuilder.parseArgs(args);
      var program = new Command();
      program
        .arguments('<raml>')
        .option('-o, --output [path]')
        .option('-s, --source [path]')
        .option('-t, --tag [version]')
        .option('-f, --main-file [path]')
        .option('-z, --source-is-zip')
        .option('-j, --json')
        .option('-i, --inline-json')
        .option('-e, --embedded')
        .option('-l, --compilation-level [level]')
        .option('-a, --attributes [name]:<value>', '', collectArguments, [])
        .option('--no-optimization')
        .option('--no-css-optimization')
        .option('--no-html-optimization')
        .option('--no-js-optimization')
        .option('--verbose', 'Print verbose messages.')
        .action((raml, options) => {
          resolve(options);
        })
        .parse(args);
    });
  }
}

exports.OptionsTestBuilder = OptionsTestBuilder;
