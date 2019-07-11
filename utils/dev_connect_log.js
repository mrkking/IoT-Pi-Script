const config = require(__dirname+'/../config');

module.exports = (socket) => {
  socket.on('connect', _ => {
    console.log('connected to server at: '+ config.getValue('server_uri'));
  });

  socket.on('disconnect', _ => {
    console.log('disconnected');
  });

  socket.on('reconnect',  _ => {
    console.log('reconnected to server at: ' + config.getValue('server_uri'));
  });

  socket.on('connect', _ => {
    console.log('connected');
  });

  socket.on('connection_error', _ => {
    console.log(_);
  });

  socket.on('reconnecting',  _ => {
    console.log('connecting to server at: ' + config.getValue('server_uri'));
  });
};