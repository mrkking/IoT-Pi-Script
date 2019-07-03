const config = require('./config.json');
const package_info = require('../package');
const fs = require('fs');

process.env['APP_VERSION'] = package_info['version'];

Object.keys(config).forEach(function(key){
  process.env[key] = config[key];
});
