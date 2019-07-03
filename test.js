require('./config');
const io = require('socket.io-client');
const btoa = require('btoa');

const creds = btoa(JSON.stringify({
  token: process.env['token'],
  'connection-type': process.env['connection_type']
}));

const socket = io('http://localhost:4005', {
  'reconnection': true,
  'reconnectionDelay': 1000,
  query: {
    credentials: creds
  }
});

socket.on('connect', _ => {
  console.log('socket connected');
});

socket.on('connect', _ => {
  console.log('connected');
});

socket.on('connection_error', _ => {
  console.log(_);
});

socket.on('disconnect', _ => {
  console.log('disconnected');
});

socket.on('reconnect',  _ => {
  console.log('reconnected');
});

socket.on('reconnect_failed',  _ => {
  console.log('reconnect failed');
});

socket.on('reconnecting',  _ => {
  console.log('reconnecting');
});

socket.on('command', cmd => {
  console.log(cmd);
  switch(cmd['state']) {
    case 'open':
      open();
      break;
    case 'close':
      close();
      break;
    case 'toggle':
      toggle();
      break;
    default:
      getState();
      break;
  }
});

const open = () => {

};

const close = () => {

};

const toggle = () => {

};

const getState = () => {
  socket.emit('state', {state: 'open'});

};
