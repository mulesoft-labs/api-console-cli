import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import updateNotifier from 'update-notifier';

(async () => {
const pkgLoc = path.join(__dirname, '..', '..', 'package.json');
const pkg = await fs.readJson(pkgLoc);
const notifier = updateNotifier({ pkg });
const { update } = notifier;
if (update) {
  const cmd = `npm i -g ${pkg.name}`;
  const message = chalk`Update available {dim ${update.current}} → {green ${update.latest}}
  Run {cyan ${cmd}} to update.

  Version >= 2.0.0 {bold only works} with API Console >= {underline 6.0.0}.`;
  notifier.notify({
    message,
  });
}
})();
