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
    const moduleUrl = `src/${self.appGenerator.answers.componentName}.js`;

    self.fs.copyTpl(
      self.templatePath('index.js'),
      self.destinationPath('index.js'),
      { 
        componentNameClass: self.appGenerator.answers.componentNameClass,
        moduleUrl,
        copyright: self.appGenerator.answers.copyright, 
      }
    );

    self.fs.copyTpl(
      self.templatePath('src/my-module.js'),
      self.destinationPath(moduleUrl),
      {
        componentNameClass: self.appGenerator.answers.componentNameClass,
        copyright: self.appGenerator.answers.copyright, 
      }
    );

    self.fs.copyTpl(
      self.templatePath('__tests__/index.test.js'),
      self.destinationPath('__tests__/index.test.js'),
      {
        componentNameClass: self.appGenerator.answers.componentNameClass,
        componentName: self.appGenerator.answers.componentName,
      },
    );
  }
};
