const editJsonFile = require("edit-json-file");
const package_info = require(__dirname+'/../package');
const configFile = editJsonFile(`${__dirname}/../config/config.json`, {
  autosave: true
});
const ENV = process.env['NODE_ENV'] ? process.env['NODE_ENV'] : 'DEV';

class Config {

  constructor() {
    this.file = configFile;
    this.app_version = package_info['version'];
    this.env = ENV;
  }

  setValue(key, value) {
    this.file.set(this.env+'.'+key, value);
  }

  getValue(key) {
    return this.file.get(this.env+'.'+key);
  }
}

const config = new Config();

module.exports = config;
