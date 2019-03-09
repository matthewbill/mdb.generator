/**
 * @copyright Matthew Bill
 */

const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  default() {
    this.composeWith(require.resolve('../app'));
  }

  async writing() {
    const self = this;

    self.fs.copy(
      self.templatePath('bin/index.js'),
      self.destinationPath('bin/index.js'),
    );
  }
};
