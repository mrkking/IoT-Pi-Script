const Updater = require(__dirname+'/updater');
const {accessKeys} = require(__dirname+'/../db/db_handler');
const config = require(__dirname+'/../config');

module.exports = class {

  constructor(socket, gate, events) {
    this._gate = gate;
    this.events = events;
    this._gate.setStateListener(_ => this.emitGateState(_));
    this.setSocket(socket);
  }

  setSocket(socket) {
    this._socket = socket;
    config.env === 'DEV' ?
        require(__dirname+'/dev_connect_log')(socket) :
        null;
    this.setupSocket();
  }

  setupSocket() {
    this._socket.on('ready', _ => this.connect());
    this._socket.on('operate', _ => this.controlGate(_));
    this._socket.on('access_keys', _ => this.updateGateAccessKeys(_));
    this._socket.resetConnection = () => this.events.emit('reset');
  }

  connect() {
    this._gate.getState();
    new Updater(this._socket);
    require(__dirname+'/provision')(this._socket);
  }

  disconnect() {
    this._socket.disconnect();
    delete this._socket;
  }

  controlGate(cmd) {
    switch(cmd['state']) {
      case 'open':
        this._gate.open();
        break;
      case 'close':
        this._gate.close();
        break;
      case 'toggle':
        this._gate.toggle();
        break;
      default:
        this._gate.getState();
        break;
    }
  }

  emitGateState(_) {
    this._socket.emit('state', _);
  }

  updateGateAccessKeys(data) {
    accessKeys.addNewKeys(data ? data['keys'] : []);
  }

};

// socket.resetConnection = () => {
//   console.log('resetting connection');
//   socket.disconnect();
//   require('./config');
//   socket = require('./socket_connection');
// };

// onConnect = () => {
//   stateListener = gate.setStateListener(_ => emitState(_));
//   gate.getState();
//   updater = new Updater(socket);
//   require('./utils/provision')(socket);
// };


//ngray@sofs.cc
