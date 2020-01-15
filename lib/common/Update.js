import updateNotifier from 'update-notifier';
import chalk from 'chalk';
import pkg from '../../package.json';

const notifier = updateNotifier({ pkg });
const { update } = notifier;
if (update) {
  const cmd = `npm i -g ${pkg.name}`;
  const message = chalk`Update available {dim ${update.current}} → {green ${update.latest}}
Run {cyan ${cmd}} to update.

Version >= 2.0.0 {bold only works} with API Console >= {underline 6.0.0}.`;
  notifier.notify({
    message
  });
}
