process.env.dev = true;
require('./config');
const socket = require('./socket_connection');
const Gate = require('./gate');
const gate = new Gate(process.env['gate_relay_port_num']);
let stateListener = null;
const {AccessKeysCollection} = require('./db/db_handler');
const accessKeyHandler = new AccessKeysCollection();


onConnect = () => {
  stateListener = stateListener ? stateListener : gate.onStateChange()
      .on('state', _ => emitState(_));
  gate.getState();
};

socket.on('ready', _ => onConnect());

const emitState = (state) => {
  socket.emit('state', state);
};

socket.on('operate', cmd => {
  console.log(cmd);
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
  console.log('connected');
});

socket.on('disconnect', _ => {
  console.log('disconnected');
});

socket.on('reconnect',  _ => {
  console.log('reconnected');
});

// socket.on('connect', _ => {
//   console.log('connected');
// });
//
// socket.on('connection_error', _ => {
//   console.log(_);
// });
//
// socket.on('reconnect_failed',  _ => {
//   console.log('reconnect failed');
// });
//
// socket.on('reconnecting',  _ => {
//   console.log('reconnecting');
// });