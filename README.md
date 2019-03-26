# Matthew Bill Code Generator

![mdb generator run](docs/mdb-generator-run.gif)

## Generators

The following generators are included in this package:

| name          | binary             | cli                | envvar config      | package            |
| ------------- | ------------------ | ------------------ | ------------------ | ------------------ |
|  default      |                    |                    |                    |                    |
| `package`     |                    |                    |                    | :heavy_check_mark: |
| `application` |                    |                    | :heavy_check_mark: |                    |
| `bin`         | :heavy_check_mark: |                    | :heavy_check_mark: | :heavy_check_mark: |
| `cli`         | :heavy_check_mark: | :heavy_check_mark: |                    | :heavy_check_mark: |

## Prerequisites

The Matthew Bill code generator is based on [Yeoman](https://yeoman.io/). The `yo` npm package first needs to be installed globally.

``` bash

npm install yo -g

```

## Install

The generator should be installed at the global level:

``` bash

npm install generator-mdb -g

```

## Running

Run the following command to get a list of all generators and then select the `Mdb` generator:

``` bash

yo

```
or to run the generator directly, run the following command:

``` bash

yo mdb

```
## Generated Files

The generator outputs the following files; they have been categorised by their engineering function.

### Version Control Files

**.gitignore**

Added with the nodejs template taking from the github repository.

### Package Files ###

**.npmrc**

Configuration tool for npm. `save` is set to true so that when installing a package, it also updates the package.json file. `save-exact` is set to true, so as to make installs save an exact version and ensure that all developers are working with the same versions of all packages.

**package.json**

The package.json file needed for all node apps. Most of the other functions will make changes to this file as well, but they are described in their own section.

Will set the `homepage` and `bugs` page based on the `name` parameter specified by the user and assuming that the code is stored on github.

### Linting ###

Eslint is used as the tool of choice for linting.

**.eslintignore**

Contains a list of folders that should not have the rules applied, such as node_modules. It also contains a number of custom folders within projects not to lint, such as the documentation folder. A decision has been made to not to lint test folders as with test we often have to do strange things which would break a strict rule set.

**.eslintrc.js**

Specifies the ruleset used by eslint. The file links to a shared npm package so that all linting is consistent across projects. These rules are a public package on npm (eslint-config-mdb) and available on github. The rules are based upon the Airbnb rule set.

**package.json**

- `eslint` and required supporting packages for the linting rule set are added to the `devDependencies`.
- `eslint-config-mdb` added as the shared linting ruleset for projects by Matthew Bill.

### Testing ###

Jest is the testing tool of choice.

**[Optional] jest.config.js**

File added for the unit testing tool Jest. This configuration file has `collectCoverage` set to true, so that we collect and display test coverage, even during the development process. `verbose` is also set to true to provide lots of feedback. Given the convention for projects to be small and lightweight, it makes sense for this option to be turned on. A mono repo would probably not want this option turned on.

**jest.config.js**

The configuration file for the jest testing tool.

**package.json**

- `jest` added to the `devDependencies`.
- `test` script added for easily running the unit tests with full unit test coverage.
- `int-test` script added for easily running integration tests with full unit test coverage.

### CI ###

**[Optional] .travis.yml**

Build file for Travis, a free for open source CI tool. The file is set up to trigger on the master branch, increment the patch version number and upload the package to npm. There are a number of assumed environment parameters setup in Travis to make this possible, such as `$MDB_NPM_EMAIL`.

### CD ###

**[Optional] /scripts/deployment/component.json**

Adds a file with scaffolding for an AWS CloudFormation script. The scaffolding includes parameters for a resource prefix, so that you may have multiple versions of the component running within the same account. This allows for different environments, branches, etc to be worked on at the same time.

### Documentation ###

A `README.md` file is added to the root of the repository, so it will appear on repository homepages like github. This file contains some very simple, bare-bones documentation based on the name a description specified by the user.

### Auto Documentation ###

Jsdoc is the package of choice used for the creations of the api reference documentation.

**.package.json**

- `jsdoc` added to the `devDependencies`.
- `docs` script added for easy running of jsdocs and output it to the `/docs/api` folder.

### License ###

**.package.json**

The 'license property' is set to the desired license on the repository. For example, this might be `MIT`. If there is no license, it is set to `UNLICENSED`.

**LICENSE**

Contains the license for the repository. If there is it is unlicensed, then a license file is not included.
