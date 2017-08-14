const {Command} = require('commander');

class OptionsTestDev {

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
      args = OptionsTestDev.parseArgs(args);
      var program = new Command();
      program
        .arguments('<raml>')
        .option('-r, --project-root [path]')
        .option('-H, --host [host]')
        .option('-p, --port [port]')
        .option('-s, --source [path]')
        .option('-z, --source-is-zip')
        .option('-t, --tag [version]')
        .option('-o, --open')
        .option('--no-bower')
        .option('--verbose', 'Print verbose messages.')
        .action((raml, options) => {
          resolve(options);
        })
        .parse(args);
    });
  }
}

exports.OptionsTestDev = OptionsTestDev;
