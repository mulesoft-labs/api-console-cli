import chalk from 'chalk';
import { ApiConsoleCli } from './api-console-cli.js';
import './common/Update.js';

process.title = 'api console cli';

(async () => {
const args = process.argv.slice(2);
const cli = new ApiConsoleCli(args);
try {
  const result = await cli.run();
  if (result && result.constructor && result.constructor.name === 'CommandResult') {
    // eslint-disable-next-line
    process.exit(result.exitCode);
  }
} catch (err) {
  /* eslint-disable-next-line no-console */
  console.error(chalk`\n{red Runtime error: ${err.message}}\n`);
  if (err.stack) {
    /* eslint-disable-next-line no-console */
    console.log(chalk`{grey ${err.stack}}`);
  }
  // eslint-disable-next-line
  process.exit(1);
}
})();
