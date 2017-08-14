'use strict';

const program = require('commander');
const updateNotifier = require('update-notifier');
const packageJson = require('../package.json');

// See https://github.com/yeoman/update-notifier#how for how this works.
updateNotifier({pkg: packageJson}).notify();

program
  .version(packageJson.version)
  .description('API console tools')
  .command('build <raml>',
    'Builds the API console application source code for given RAML file.')
  .command('generate-json <raml>',
    'Generates a JSON file from RAML spec that is used in the API console')
  .command('serve [path]',
    'Creates a www server do run the console locally')
  .command('dev <raml>',
    'Displays API console while working on RAML sources')
  .parse(process.argv);
