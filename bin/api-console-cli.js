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

require('./run');
