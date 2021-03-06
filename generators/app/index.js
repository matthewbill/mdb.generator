/**
 * @copyright Matthew Bill
 */

const Generator = require('yeoman-generator');
const { GitHubHostService, GitService } = require('mdb-git-services');

const ComponentNames = require('../../src/component-names.js');
const GeneratorConfigService = require('../../src/generator-config-service.js');
const generatorConfigService = new GeneratorConfigService();

module.exports = class extends Generator {
  initializing() {
    const self = this;
    if (self.options === undefined) { 
      self.options = {}
    }
    if(self.options.writeSampleIndex === undefined) {
      self.options.writeSampleIndex = true;
    }

    if(self.options.package === undefined) {
      self.options.package = false;
    }
    if(self.options.bin === undefined) {
      self.options.bin = false;
    }
  }
  async prompting() {
    const self = this;
    const config = generatorConfigService.getConfigSync();
    const defaultAppName = ComponentNames.getComponentName(self.appname);
    self.answers = await self.prompt([{
      type: 'input',
      name: 'name',
      message: 'Your project name',
      default: defaultAppName,
    },
    {
      type: 'input',
      name: 'description',
      message: 'Your project description',
      default: '',
    }, {
      type: 'input',
      name: 'org',
      message: 'Your organisation (or name)',
      default: config.org || '',
    }, {
      type: 'confirm',
      name: 'createLocalRepo',
      message: 'Would you like to create a local git repo?',
      default: true,
    }, {
      type: 'confirm',
      name: 'installPackages',
      message: 'Would you like to install node packages after generating the files?',
      default: true,
    }, {
      type: 'input',
      name: 'copyright',
      message: 'Copyright',
      default: config.copyright || '',
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

    if (self.answers.createLocalRepo) {
      self.gitLocalAnswers = await self.prompt([{
        type: 'confirm',
        name: 'createRemoteRepo',
        message: 'Would you like to create the remote repo?',
        default: true,
      }]);
      if (self.gitLocalAnswers.createRemoteRepo) {
        self.gitRemoteAnswers = await self.prompt([{
          type: 'input',
          name: 'org',
          message: 'Your git repo host organisation (username for personal)',
          default: config.gitHubOrg || '',
        }, {
          type: 'input',
          name: 'gitHubUsername',
          message: 'Your GutHub username',
          default: config.gitHubUsername || '',
        }, {
          type: 'input',
          name: 'gitHubToken',
          message: 'Your GutHub token',
          default: config.gitHubToken || '',
        }]);
      }
    }

    self.answers.componentName = ComponentNames
      .getComponentName(self.answers.name);
    self.answers.componentNameClass = ComponentNames
      .getComponentNameClass(self.answers.name);
    self.answers.componentNameVar = ComponentNames
      .getComponentNameVarFromClass(self.answers.componentNameClass);

    if (self.options.parent) {
      self.options.parent.appGenerator = this;
    }

    const newConfig = { ...config, 
      org: self.answers.org,
      copyright: self.answers.copyright,
    };

    if(self.gitLocalAnswers && self.gitLocalAnswers.createRemoteRepo) {
      newConfig.gitHubOrg = self.gitRemoteAnswers.gitHubOrg;
      newConfig.gitHubUsername = self.gitRemoteAnswers.gitHubUsername;
      newConfig.gitHubToken = self.gitRemoteAnswers.gitHubToken;
    }

    generatorConfigService.saveConfigSync(newConfig);
  }

  async writing() {
    const self = this;
    if(self.answers.createLocalRepo) {

      var pathToRepo = require("path").resolve("");
      const gitHubUsername = self.gitRemoteAnswers.gitHubUsername;
      const gitHubToken = self.gitRemoteAnswers.gitHubToken;

      // Defined
      const gitUsername = 'mdb-generator';
      const gitEmail = 'matthewdbill@gmail.com';

      const gitHubHostService = new GitHubHostService(gitHubUsername, gitHubToken);
      self.gitService = new GitService(gitHubHostService, gitUsername, gitEmail, gitHubToken);
      self.log('initializing local repo');
      self.repo = await self.gitService.init(pathToRepo);
    }

    if (self.options.writeSampleIndex) {
      self.log('writing sample index file');
      self.fs.copyTpl(
        self.templatePath('index.js'),
        self.destinationPath('index.js'),
        { copyright: self.answers.copyright }
      );
    }

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
      self.fs.copyTpl(
        self.templatePath('LICENSE-MIT'),
        self.destinationPath('LICENSE'),
        { copyright: self.answers.copyright, year: new Date().getFullYear() }
      );
    }

    if (self.answers.travis) {
      self.fs.copyTpl(
        self.templatePath('.travis.yml'),
        self.destinationPath('.travis.yml'),
        { name: self.answers.name, package: self.options.package },
      );
    }

    if (self.answers.jest) {
      self.fs.copyTpl(
        self.templatePath('jest.config.js'),
        self.destinationPath('jest.config.js'),
      );
      if (self.options.writeSampleIndex) {
        self.fs.copy(
          self.templatePath('__tests__/index.test.js'),
          self.destinationPath('__tests__/index.test.js'),
        );
      }
    }

    self.fs.copyTpl(
      self.templatePath('.vscode/launch.json'),
      self.destinationPath('.vscode/launch.json'),
      { tests: self.answers.jest }
    );

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
        createLocalRepo: self.answers.createLocalRepo,
        tests: self.answers.jest,
        componentName: self.answers.componentName,
        bin: self.options.bin,
      },
    );

    self.fs.copyTpl(
      self.templatePath('README.md'),
      self.destinationPath('README.md'),
      { name: self.answers.name, description: self.answers.description },
    );

    let projectKey = self.answers.name;
    if(self.answers.org) {
      projectKey = `${self.answers.org}_${self.answers.name}`;
    }

    self.fs.copyTpl(
      self.templatePath('sonar-project.properties'),
      self.destinationPath('sonar-project.properties'),
      { projectKey },
    );
  }

  install() {
    const self = this;
    if(self.answers.installPackages) {
      self.npmInstall();
    }
  }

  async end() {
    const self = this;
    if(self.answers.createLocalRepo && self.gitLocalAnswers.createRemoteRepo) {
      const repoName = self.answers.name;
      const repoDescription = self.answers.description;
      const repoOrg = self.gitRemoteAnswers.org;
      self.log(`creating remote repo ${repoName} for org ${repoOrg}`);
      self.remoteUrl = await self.gitService.createRemoteRepo(repoName, repoDescription, repoOrg);
      self.log(`remote url: ${self.remoteUrl}`);
      self.log('adding remote');
      self.remote = await self.gitService.createRemote(self.repo, self.remoteUrl);
      self.log('committing files');
      await self.gitService.commitAll(self.repo, 'initial commit - mdb generator');
      if(self.gitLocalAnswers.createRemoteRepo) {
        self.log('pushing');
        await self.gitService.push(self.remote);
      }
    }
  }
};
