/**
 * @copyright Matthew Bill
 */

const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  initializing() {
    const self = this;
    self.composeWith(require.resolve('../app/index.js'), { parent: self, writeSampleIndex: false, package: true, binary: true });
  }

  async writing() {
    const self = this;

    self.fs.copyTpl(
      self.templatePath('bin/index.js'),
      self.destinationPath(`bin/${self.appGenerator.answers.componentName}.js`),
      { 
        copyright: self.appGenerator.answers.copyright, 
      }
    );

    self.fs.copy(
      self.templatePath('__tests__/bin/app.test.js'),
      self.destinationPath('__tests__/bin/app.test.js'),
    );
  }
};
