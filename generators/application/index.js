/**
 * @copyright Matthew Bill
 */

const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  initializing() {
    const self = this;
    self.composeWith(require.resolve('../app/index.js'), { parent: self, writeSampleIndex: false });
  }

  async writing() {
    const self = this;

    self.fs.copyTpl(
      self.templatePath('app.js'),
      self.destinationPath('app.js'),
      { 
        copyright: self.appGenerator.answers.copyright, 
      }
    );

    self.fs.copy(
      self.templatePath('__tests__/app.test.js'),
      self.destinationPath('__tests__/app.test.js'),
    );
  }
};
