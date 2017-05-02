#!/usr/bin/env node

'use strict';

process.title = 'api-console';

var semver = require('semver');
// Early exit if the user's node version is too low.
if (!semver.satisfies(process.version, '>=4')) {
  console.log(
    'API Console CLI requires at least Node v4. ' +
    'You have ' + process.version + '.');
  process.exit(1);
}

require('./run');
