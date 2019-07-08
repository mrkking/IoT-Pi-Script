require('./config');
const socket = require('./socket_connection');
const Gate = require('./gate');
const gate = new Gate(process.env['gate_relay_port_num']);
let stateListener = null;
const {AccessKeysCollection} = require('./db/db_handler');
const accessKeyHandler = new AccessKeysCollection();

onConnect = () => {
  stateListener = gate.setStateListener(_ => emitState(_))
};

socket.on('ready', _ => onConnect());

const emitState = (state) => {
  console.log('emit state', state);
  socket.emit('state', gate.getState());
};

socket.on('operate', cmd => {
  console.log('from server', cmd);
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
  gate.getState();
});

socket.on('access_keys', data => {
  accessKeyHandler.addNewKeys(data ? data['keys'] : []);
});

socket.on('connect', _ => {
  console.log('connected to server at: '+ process.env['server_uri']);
});

socket.on('disconnect', _ => {
  console.log('disconnected');
});

socket.on('reconnect',  _ => {
  console.log('reconnected to server at: ' + process.env['server_uri']);
});

socket.on('connect', _ => {
  console.log('connected');
});

socket.on('connection_error', _ => {
 console.log(_);
});

socket.on('reconnecting',  _ => {
 console.log('connecting to server at: ' + process.env['server_uri']);
});
