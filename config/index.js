const editJsonFile = require("edit-json-file");
const package_info = require('../package');
const configFile = editJsonFile(`${__dirname}/../config/config.json`, {
  autosave: true
});

class Config {

  constructor() {
    this.file = configFile;
    this.app_version = package_info['version'];
  }

  setValue(key, value) {
    this.file.set(key, value);
    this.file.set(key, value);
  }

  getValue(key) {
    return this.file.get(key);
  }
}

const config = new Config();

module.exports = config;
