const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  async prompting() {
    const self = this;
    self.answers = await self.prompt([{
      type: 'input',
      name: 'name',
      message: 'Your project name',
      default: self.appname, // Default to current folder name
    },
    {
      type: 'input',
      name: 'description',
      message: 'Your project description',
      default: '', // Default to current folder name
    }, {
      type: 'confirm',
      name: 'travis',
      message: 'Would you like to enable a travis build?',
      default: true,
    }, {
      type: 'confirm',
      name: 'jest',
      message: 'Would you like to enable jest for unit testing?',
      default: true,
    }]);
  }

  writing() {
    const self = this;
    self.fs.copy(
      self.templatePath('.eslintignore'),
      self.destinationPath('.eslintignore'),
    );

    self.fs.copy(
      self.templatePath('.eslintrc.js'),
      self.destinationPath('.eslintrc.js'),
    );

    self.fs.copy(
      self.templatePath('.gitignore-template'),
      self.destinationPath('.gitignore'),
    );

    self.fs.copy(
      self.templatePath('.npmrc'),
      self.destinationPath('.npmrc'),
    );

    if (self.answers.travis) {
      self.fs.copy(
        self.templatePath('.travis.yml'),
        self.destinationPath('.travis.yml'),
        { name: self.answers.name, },
      );
    }

    if (self.answers.jest) {
      self.fs.copyTpl(
        self.templatePath('jest.config.js'),
        self.destinationPath('jest.config.js'),
      );
    }

    self.fs.copyTpl(
      self.templatePath('package.json'),
      self.destinationPath('package.json'),
      { name: self.answers.name, description: self.answers.description },
    );

    self.fs.copyTpl(
      self.templatePath('README.md'),
      self.destinationPath('README.md'),
      { name: self.answers.name, description: self.answers.description },
    );
  }
};
