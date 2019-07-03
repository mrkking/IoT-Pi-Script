const io = require('socket.io-client');
const btoa = require('btoa');

const creds = btoa(JSON.stringify({
  token: process.env['token'],
  'connection-type': process.env['connection_type']
}));

module.exports = io(
process.env.hasOwnProperty('dev') ?
    'http://localhost:4005' :
    process.env['server_uri'], {
  'reconnection': true,
  'reconnectionDelay': 1000,
  query: {
    credentials: creds,
    sofware_version: process.env['APP_VERSION']
  }
});