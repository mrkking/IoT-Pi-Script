const Updater = require('./updater');
const {accessKeys} = require('../db/db_handler');
const config = require('../config');
const fetch = require('node-fetch');

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
      this.events.on('pin', _ => this._socket.emit('log', 'pin_user_access', _));
    } else {
      this._socket.on('test', () => this.testGate());
      this._socket.on('ready', () => require('./provision')(this._socket));
      this.events.on('provision_pin', _ => this._socket.emit('provision_pin', _));
      // this._socket.on('test_pin', _ => fetch('http://localhost:4000/kp/1234').then());
    }
    this._socket.resetConnection = () => this.events.emit('reset');
  }

  connect() {
    this._gate.getState();
    new Updater(this._socket);
    this._gate.setStateListener(_ => this.emitGateState(_));
    this.updater = new Updater(this._socket);
  }

  testGate() {
    console.log('test');
    this._gate.open();
    setTimeout(() => {
      this._gate.close();
    }, 500);
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

//ngray@sofs.cc
