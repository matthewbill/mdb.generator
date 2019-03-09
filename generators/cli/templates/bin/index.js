#!/usr/bin/env node

/**
 * @copyright <%= copyright %>
*/

const <%= componentNameClass %> = require('../src/<%= name %>.js');

console.log('hello world - this should break linting');

const <%= componentNameVar %> = new <%= componentNameClass %>();
<%= componentNameVar %>.start();


