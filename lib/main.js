import updateNotifier from 'update-notifier';
import { ApiConsoleCli } from './api-console-cli.js';
import packageJson from '../package.json';

process.title = 'api console cli';
updateNotifier({ pkg: packageJson }).notify();

(async () => {
  const args = process.argv.slice(2);
  const cli = new ApiConsoleCli(args);
  try {
    const result = await cli.run();
    if (result && result.constructor &&
        result.constructor.name === 'CommandResult') {
      process.exit(result.exitCode);
    }
  } catch (err) {
    const msgs = [];
    msgs.push('runtime error: ' + err);
    if (err.stack) {
      msgs.push(err.stack);
    }
    /* eslint-disable-next-line no-console */
    console.log(msgs.join('\n'));
    process.exit(1);
  }
})();
