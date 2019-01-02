#!/usr/bin/env node

'use strict';

process.title = 'api-console';

const semver = require('semver');
// Early exit if the user's node version is too low.
if (!semver.satisfies(process.version, '>=6.4')) {
  const colors = require('colors/safe');
  console.log(colors.red(
    '\n' +
    'API Console CLI requires at least Node v6.4.0. ' +
    'You have ' + process.version + '.' +
    '\n'));
  process.exit(1);
}

function isCi() {
  const env = process.env;
  return !!(env.CI ||
  env.CONTINUOUS_INTEGRATION ||
  env.BUILD_NUMBER ||
  env.RUN_ID ||
  exports.name ||
  false);
}

const noGa = process.argv.indexOf('--no-ga') !== -1;

function run() {
  require('./run');
}

if (noGa) {
  run();
} else {
  const {GaHelper} = require('../lib/ga-helper');
  const helper = new GaHelper();
  helper.gaAllowed()
  .then((allowed) => {
    if (allowed === undefined) {
      if (isCi()) {
        run();
        return;
      }
      const inquirer = require('inquirer');
      inquirer
      .prompt([{
        type: 'confirm',
        name: 'gaEnabled',
        message: 'Allow anonymous usage statistics to help improve our CLI tools?',
        default: true
      }])
      .then((answer) => helper.updatePermissions(answer.gaEnabled))
      .then(() => run());
    } else {
      run();
    }
  });
}
