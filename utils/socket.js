const Updater = require('./updater');
const {accessKeys} = require('../db/db_handler');
const config = require('../config');


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
        require('./dev_connect_log')(socket) :
        null;
    this.setupSocket();
  }

  setupSocket() {
    if (config.getValue('token')){
      this._socket.on('operate', _ => this.controlGate(_));
      this._socket.on('access_keys', _ => this.updateGateAccessKeys(_));
      this._socket.on('ready', _ => this.connect());
    } else {
      this._socket.on('test', () => this.testGate());
      this._socket.on('ready', () => require('./provision')(this._socket));
    }
    this._socket.resetConnection = () => this.events.emit('reset');
  }

  connect() {
    this._gate.getState();
    new Updater(this._socket);
    gate.setStateListener(_ => this.emitGateState(_));
    this.updater = new Updater(this._socket);
  }

  testGate(num_of_times) {
    this.testInterval = setInterval(_ => {
      if (!this.testTimeout) {

      }
    }, 700);
  }

  testToggleGate() {
    this._gate.close();
    this._gate.open();
    this.testTimeout = setTimeout(_ => {
      this._gate.close();
      this.testTimeout = null;
    }, 300);
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
//   stateListener =
//   gate.getState();
//
//   require('./utils/provision')(socket);
// };


//ngray@sofs.cc
