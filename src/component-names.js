class ComponentNames {
  static getComponentName(name) {
    return name.toLowerCase().replace(/[ ]+/g, '-');
  }

  static getComponentNameClass(name) {
    const nameWordsArray = name.split(/[ -]+/);
    let componentNameClass = '';
    for (let i = 0; i < nameWordsArray.length; i += 1) {
      const nameWord = nameWordsArray[i];
      componentNameClass += nameWord.charAt(0).toUpperCase()
      + nameWord.slice(1);
    }
    return componentNameClass;
  }

  static getComponentNameVarFromClass(componentNameVar) {
    return componentNameVar.charAt(0).toLowerCase() + componentNameVar.slice(1);
  }
}

module.exports = ComponentNames;
