/**
 * @copyright Matthew Bill
*/

const MyModule = require('./src/my-module');

console.log('hello world - this should break linting');

module.exports = {
  MyModule,
};
