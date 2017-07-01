'use strict';

process.title = 'api-console serve';

const program = require('commander');
const colors = require('colors/safe');
const {
  ApiServe
} = require('../lib/serve');
var docs = require('./serve-help.json');

function collect(val, memo) {
  memo.push(val);
  return memo;
}

program
  .description(docs.description)
  .option('-r, --root [value]', docs.root)
  .option('-e, --entrypoint [value]', docs.entrypoint)
  .option('-p, --port [value]', docs.mainFile, parseInt)
  .option('-H, --hostname [value]', docs.hostname)
  .option('-h, --headers [value...]', docs.headers)
  .option('-o, --open', docs.open)
  .option('-b, --browser [value]', docs.browser, collect, [])
  .option('-l, --open-path [value]', docs.openPath)
  .on('--help', function() {
    console.log('  Examples:');
    console.log();
    console.log('    $ api-console serve');
    console.log('    $ api-console serve build/');
    console.log('    $ api-console serve --open');
    console.log();
  })
  .parse(process.argv);

try {
  const script = new ApiServe(program);
  script.run()
    .catch((cause) => {
      console.log(colors.red('  ' + cause.message));
      console.log();
      console.log(cause.stack);
      console.log();
      process.exit(1);
    });
} catch (e) {
  console.log(colors.red('  ' + e.message));
  console.log();
  console.log(e.stack);
  console.log();
  process.exit(1);
}
