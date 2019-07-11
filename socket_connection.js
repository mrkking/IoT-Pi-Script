const io = require('socket.io-client');
const btoa = require('btoa');
const config = require(__dirname+'/config');


module.exports = () => {
  const token = config.getValue('token');
  const provision_token = config.getValue('provision_token');

  const creds = btoa(JSON.stringify({
    token: token,
    'connection-type': config.getValue('connection_type'),
    provision_token: token ? undefined : provision_token
  }));

  return io(config.getValue('server_uri'), {
    'reconnection': true,
    'reconnectionDelay': 1000,
    query: {
      credentials: creds,
      software_version: process.env['APP_VERSION']
    }
  });
};
