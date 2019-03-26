/* eslint-disable no-console */
/* eslint-disable max-len */
const self = this;
self.answers = {};
self.answers.name = 'a gen test 2 2';


const ComponentNames = require('./src/component-names.js');

self.answers.componentName = ComponentNames.getComponentName(self.answers.name);
self.answers.componentNameVar = ComponentNames.getComponentNameClass(self.answers.name);
self.answers.componentNameClass = ComponentNames.getComponentNameVarFromClass(self.answers.componentNameVar);

console.log(self.answers.componentName);
console.log(self.answers.componentNameVar);
console.log(self.answers.componentNameClass);
