'use strict';

const program = require('commander');
const updateNotifier = require('update-notifier');
const packageJson = require('../package.json');

// See https://github.com/yeoman/update-notifier#how for how this works.
updateNotifier({pkg: packageJson}).notify();

program
  .version(packageJson.version)
  .description('API console tools')
  .command('build',
    'Builds the API console application source code')
  .command('generate-model -av RAML 1.0 <api-file>',
    'Generates a JSON file from RAML spec that is used in the API console')
  .command('serve [path]',
    'Creates a www server to run the console locally')
  .command('dev -av RAML 1.0 <api-file>',
    'Displays API console while working on your API')
  .parse(process.argv);
