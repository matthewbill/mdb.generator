/**
 * @copyright Matthew Bill
 */

const Generator = require('yeoman-generator');

const ComponentNames = require('../../src/component-names.js');

module.exports = class extends Generator {
  initializing() {
    const self = this;
    self.composeWith(require.resolve('../app/index.js'), { parent: self, writeSampleIndex: false, package: true, binary: true });
  }

  async writing() {
    const self = this;
    const moduleUrl = `src/${self.appGenerator.answers.componentName}.js`;

    self.fs.copyTpl(
      self.templatePath('bin/index.js'),
      self.destinationPath('bin/index.js'),
      {
        componentName: self.appGenerator.answers.componentNameVar,
        componentNameVar: self.appGenerator.answers.componentNameVar,
        componentNameClass: self.appGenerator.answers.componentNameClass,
        copyright: self.appGenerator.answers.copyright, 
      },
    );

    self.fs.copyTpl(
      self.templatePath('src/component-name.js'),
      self.destinationPath(moduleUrl),
      {
        componentName: self.appGenerator.answers.componentNameVar,
        componentNameVar: self.appGenerator.answers.componentNameVar,
        componentNameClass: self.appGenerator.answers.componentNameClass,
        copyright: self.appGenerator.answers.copyright, 
      },
    );

    self.fs.copyTpl(
      self.templatePath('src/commands/my-command.js'),
      self.destinationPath('src/commands/my-command.js'),
      {
        copyright: self.appGenerator.answers.copyright, 
      },
    );

    if (self.appGenerator.answers.jest) {
      self.fs.copy(
        self.templatePath('__tests__/bin/index.test.js'),
        self.templatePath('__tests__/bin/index.test.js'),
      );
    }
  }
};
