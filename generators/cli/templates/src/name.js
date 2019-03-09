/**
 * @copyright Matthew Bill
 */

const program = require('commander');
const { BaseConsole } = require('mdb-cli-framework');
const { LoggerFactory } = require('mdb-logging');
const { EnvironmentNames } = require('mdb-core');

const MyCommand = require('./commands/my-command.js');

/**
 * Class representing {insert description}.
 */
class Name extends BaseConsole {
  constructor() {
    super();
    const self = this;
    const loggerFactory = new LoggerFactory();
    self.logger = loggerFactory.getLogger(EnvironmentNames.PRODUCTION, false);
  }

  start() {
    const self = this;
    program
      .command('commandname <dir>')
      .description('Description for your command.')
      .option('-o, --option <value>', 'Your option.')
      .action((dir, options) => {
        const { option1 } = options;
        const myCommand = new MyCommand({
          option1,
          logger: self.logger,
        });
        myCommand.execute().then(() => {
          self.logger.info('finished running command.');
        });
      });

    program.parse(process.argv);
  }
}

module.exports = Name;
