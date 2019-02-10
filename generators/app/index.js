/**
 * @copyright Matthew Bill
 */

const Generator = require('yeoman-generator');
const { GitHubHostService, GitService } = require('mdb-git-services');

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
      default: '',
    }, {
      type: 'input',
      name: 'org',
      message: 'Your git repo host organisation (username for personal)',
      default: '',
    }, {
      type: 'input',
      name: 'gitHubUsername',
      message: 'Your GutHub username',
      default: '',
    }, {
      type: 'input',
      name: 'gitHubToken',
      message: 'Your GutHub token',
      default: '',
    }, {
      type: 'list',
      name: 'license',
      message: 'What license should be used?',
      choices: ['UNLICENSED', 'MIT'],
      default: 'MIT',
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
    }, {
      type: 'confirm',
      name: 'cloudformation',
      message: 'Would you like to add an AWS CloudFormation script?',
      default: true,
    }]);
  }

  async writing() {
    const self = this;

    var pathToRepo = require("path").resolve("");
    const gitHubUsername = self.answers.gitHubUsername;
    const gitHubToken = self.answers.gitHubToken;

    const repoName = self.answers.name;
    const repoDescription = self.answers.description;
    const repoOrg = self.answers.org;

    // Defined
    const gitUsername = 'mdb-generator';
    const gitEmail = 'matthewdbill@gmail.com';

    const gitHubHostService = new GitHubHostService(gitHubUsername, gitHubToken);
    self.gitService = new GitService(gitHubHostService, gitUsername, gitEmail, gitHubToken);

    self.remoteDetails = await self.gitService.setupRepo(pathToRepo, repoName, repoDescription, repoOrg)
    self.fs.copy(
      self.templatePath('index.js'),
      self.destinationPath('index.js'),
    );

    self.fs.copy(
      self.templatePath('src/my-module.js'),
      self.destinationPath('src/my-module.js'),
    );

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

    if (self.answers.license === 'MIT') {
      self.fs.copy(
        self.templatePath('LICENSE-MIT'),
        self.destinationPath('LICENSE'),
      );
    }

    if (self.answers.travis) {
      self.fs.copyTpl(
        self.templatePath('.travis.yml'),
        self.destinationPath('.travis.yml'),
        { name: self.answers.name },
      );
    }

    if (self.answers.jest) {
      self.fs.copyTpl(
        self.templatePath('jest.config.js'),
        self.destinationPath('jest.config.js'),
      );

      self.fs.copy(
        self.templatePath('__tests__/index.test.js'),
        self.destinationPath('__tests__/index.test.js'),
      );
    }

    if (self.answers.cloudformation) {
      self.fs.copy(
        self.templatePath('scripts/deployment/component-template.json'),
        self.destinationPath('scripts/deployment/component-template.json'),
      );
    }

    self.fs.copyTpl(
      self.templatePath('package.json'),
      self.destinationPath('package.json'),
      {
        name: self.answers.name,
        description: self.answers.description,
        license: self.answers.license,
      },
    );

    self.fs.copyTpl(
      self.templatePath('README.md'),
      self.destinationPath('README.md'),
      { name: self.answers.name, description: self.answers.description },
    );
  }

  install() {
    const self = this;
    self.npmInstall();
  }

  end() {
    const self = this;
    self.gitService.initialCommit(self.remoteDetails.repo, self.remoteDetails.remote, 'initial commit - mdb generator').then(result => {
      console.log('Finished pushing changes to remote.');
    }).catch(reason => {
      console.log(reason);
    });
  }
};
