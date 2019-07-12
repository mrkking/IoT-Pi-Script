const config = require('../config');
let _socket;
const software_version = config.app_version;

const setup_token = (token_type, tokenObj) => {
  config.setValue(token_type, tokenObj['token']);
  _socket.emit('init_asset', {software_version: software_version});
  setTimeout(_ => {
    _socket.resetConnection();
  }, 1000);
};

module.exports = (socket) => {
  _socket = socket;
  socket.on('provision_token', _ => setup_token('provision_token', _));
  socket.on('token', _ => setup_token('token', _));
};
