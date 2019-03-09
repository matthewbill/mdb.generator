const fs = require('fs');
const os = require('os');

class GeneratorConfigService {
  constructor() {
    const self = this;
    self.homeDir = os.homedir();
    self.path = `${self.homeDir}/mdb-generator.json`
  }

  checkConfigExists() {
    const self = this;
    return fs.existsSync(self.path);
  }

  getConfigSync() {
    const self = this;
    if(self.checkConfigExists()) {
      return require(self.path);
    } else {
      return {};
    }
  }

  saveConfigSync(config) {
    const self = this;
    fs.writeFileSync(self.path, JSON.stringify(config));
  }
}

module.exports = GeneratorConfigService;
