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
    'Builds the API console application from the source code')
  .command('generate-model -at RAML 1.0 <api-file>',
    'Generates a JSON file from API spec file')
  .command('serve [path]',
    'Creates a www server to run the console locally')
  .parse(process.argv);
