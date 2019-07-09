const config = require('./config.json');
const package_info = require('../package');

process.env['APP_VERSION'] = package_info['version'];

let env = process.env.NODE_ENV ? process.env.NODE_ENV : 'PROD';

console.log(config[env]);

Object.keys(config[env]).forEach(function(key){
  process.env[key] = config[env][key];
});
