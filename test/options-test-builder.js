const {Command} = require('commander');

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
        .option('-o, --output [value]')
        .option('-s, --source [value]')
        .option('-f, --main-file [value]')
        .option('-z, --source-is-zip')
        .option('-j, --json')
        .option('-i, --inline-json')
        .option('-e, --embedded')
        .option('-l, --compilation-level [value]')
        .option('--no-optimization')
        .option('--no-css-optimization')
        .option('--no-html-optimization')
        .option('--no-js-optimization')
        .option('--no-try-it')
        .option('--narrow-view')
        .option('--proxy [value]')
        .option('--proxy-encode-url')
        .option('--append-headers [value]')
        .option('--verbose', 'Print verbose messages.')
        .action((raml, options) => {
          resolve(options);
        })
        .parse(args);
    });
  }
}

exports.OptionsTestBuilder = OptionsTestBuilder;
