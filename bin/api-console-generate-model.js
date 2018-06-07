process.title = 'api-console generate-json';

const program = require('commander');
const colors = require('colors/safe');

const desc = 'Use this command to create a data model from the API file. ';
const apiTypes = ['RAML 0.8', 'RAML 1.0', 'OAS 1.0', 'OAS 2.0', 'OAS 3.0'];

program
  .arguments('<api-file>', 'Path to the API spec file. Can be an URL.')
  .usage('\n\n  $ api-console generate-json [options] -T "RAML 1.0" <api-file>')
  .description(desc)
  .option('-T, --api-type [value]', 'API type, can be on of "' + apiTypes.join('", "') + '"')
  .option('-o, --output [value]', 'Output file. Default to "./api-model.json"')
  .option('-p, --pretty-print', 'Generated JSON will be formatted')
  .option('--verbose', 'Print verbose messages')
  .action(function(apiFile, options) {
    console.log();
    if (!apiFile) {
      console.log(colors.red('  Source API file not specified.'));
      console.log();
      process.exit(1);
      return;
    }
    if (!options.apiType) {
      console.log(colors.red('  API type not specified.'));
      console.log();
      process.exit(1);
      return;
    }
    if (apiTypes.indexOf(options.apiType) === -1) {
      console.log(colors.red(`  API type "${options.apiType}" is unknown.`));
      console.log();
      process.exit(1);
      return;
    }
    try {
      const {JsonGenerator} = require('../lib/generate-json');
      const script = new JsonGenerator(apiFile, {
        apiType: options.apiType,
        output: options.output,
        prettyPrint: options.prettyPrint,
        verbose: options.verbose
      });
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
    console.log('    $ api-console generate-json -T "RAML 1.0" ./api.raml');
    console.log('    $ api-console generate-json -T "OAS 2.0" http://domain.com/api.json');
    console.log('    $ api-console generate-json -T "RAML 1.0" ./api.raml -o "../api-data.json"');
    console.log();
  })
  .parse(process.argv);
