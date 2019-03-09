/**
 * @copyright Matthew Bill
 */

const Generator = require('yeoman-generator');

const ComponentNames = require('../../src/component-names.js');

module.exports = class extends Generator {
  default() {
    this.composeWith(require.resolve('../app'));
  }

  async propting() {
    const self = this;
    self.answers.test = 'asdsad';
  }

  async writing() {
    const self = this;
    console.log(self.answers);

    self.fs.copyTpl(
      self.templatePath('bin/index.js'),
      self.destinationPath('bin/index.js'),
      {
        name: self.answers.name,
        componentNameVar: self.answers.description.componentNameVar,
        componentNameClass: self.answers.description.componentNameClass,
        copyright: self.answers.license,
      },
    );

    if (self.answers.jest) {
      self.fs.copy(
        self.templatePath('__tests__/bin/index.test.js'),
        self.destinationPath('__tests__/bin/index.test.js'),
      );
    }
  }
};
