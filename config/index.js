const config = require('./config.json');
const package_info = require('../package');



process.env['APP_VERSION'] = package_info['version'];

const env = process.env.NODE_ENV;

if (!env) {
  evn = 'DEV';
}

Object.keys(config[env]).forEach(function(key){
  process.env[key] = config[key];
});
