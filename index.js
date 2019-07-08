require('./config');
const socket = require('./socket_connection');
const Gate = require('./gate');
const gate = new Gate(process.env['gate_relay_port_num']);
let stateListener = null;
const {AccessKeysCollection} = require('./db/db_handler');
const accessKeyHandler = new AccessKeysCollection();
const Updater = require('./utils/updater');
let updater = null;

onConnect = () => {
  stateListener = stateListener ? stateListener : gate.onStateChange()
      .on('state', _ => emitState(_));
  // updater = new Updater(socket);
};

socket.on('ready', _ => onConnect());

const emitState = (state) => {
  console.log(state);
  socket.emit('state', gate.getState());
};

socket.on('operate', cmd => {
  switch(cmd['state']) {
    case 'open':
      gate.open();
      break;
    case 'close':
      gate.close();
      break;
    case 'toggle':
      gate.toggle();
      break;
    default:
      gate.getState();
      break;
  }
});

socket.on('access_keys', data => {
  accessKeyHandler.addNewKeys(data ? data['keys'] : []);
  console.log(accessKeyHandler.get());
});

socket.on('connect', _ => {
  console.log('reconnected to server at: '+ (process.env.hasOwnProperty('dev') ?
    process.env['server_uri']:
    process.env['server_uri']));
});

socket.on('disconnect', _ => {
  console.log('disconnected');
});

socket.on('reconnect',  _ => {
  console.log('reconnected to server at: '+ (process.env.hasOwnProperty('dev') ?
      process.env['server_uri']:
      process.env['server_uri']));
});

// socket.on('connect', _ => {
//   console.log('connected');
// });
//
 socket.on('connection_error', _ => {
   console.log(_);
 });
//
// socket.on('reconnect_failed',  _ => {
//   console.log('reconnect failed');
// });
//
 socket.on('reconnecting',  _ => {
   console.log('connecting to server at: '+ (process.env.hasOwnProperty('dev') ?
       process.env['server_uri']:
       process.env['server_uri']));
 });
