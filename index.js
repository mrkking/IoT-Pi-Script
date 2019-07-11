const config = require('./config');
const html_events = require(__dirname+'/express');
const {EventEmitter} = require('events');
const app_events = new EventEmitter();
require(__dirname+'/keypad_handler');
const connectSocket = require(__dirname+'/socket_connection');
const Socket = require(__dirname+'/utils/socket');
const Gate = require(__dirname+'/gate');
const gate = new Gate(config.getValue('gate_relay_port_num'));

html_events.on('pin', _ => {
  gate.open();
  setTimeout(_ => {
    gate.close();
  }, 60000);
});

let socket = new Socket(connectSocket(), gate, app_events);

app_events.on('reset', _ => {
  socket.disconnect();
  socket.setSocket(connectSocket());
});



