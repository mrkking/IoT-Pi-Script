const config = require('./config');
const html_events = require('./express');
const {EventEmitter} = require('events');
const app_events = new EventEmitter();
require('./keypad_handler');
const connectSocket = require('./socket_connection');
const Socket = require('./utils/socket');
const Gate = require('./gate');
const gate = new Gate(config.getValue('gate_relay_port_num'));

if (!config.getValue('provision_token')) {
  gate.open();
} else {
  gate.close();
}

html_events.on('pin', _ => {
  gate.open();
  setTimeout(_ => {
    gate.close();
  }, 60000);
});

let socket = new Socket(connectSocket(), gate, html_events);

app_events.on('reset', _ => {
  socket.disconnect();
  socket.setSocket(connectSocket());
});



