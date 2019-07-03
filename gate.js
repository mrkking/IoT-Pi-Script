const {spawn} = require('child_process');
const {EventEmitter} = require('events');


module.exports = class Gate {

  constructor(port) {
    this.port = port ? port : 26;
    this.onStateChangeListener = new EventEmitter();
    this.__state_dev = {state: 'close'};
  }

  onStateChange() {
    return this.onStateChangeListener;
  }

  close() {
    if (process.env.hasOwnProperty('dev')) {
      this.__state_dev = {state: 'close'};
      this.getState();
      return;
    }
    const cmd = spawn('python', ['./gate_py_scripts/main.py', this.port, 'close']);
    cmd.stdout.on('data', (data) => {
      this.getState();
    });
  }

  open() {
    if (process.env.hasOwnProperty('dev')) {
      this.__state_dev = {state: 'open'};
      this.getState();
      return;
    }
    const cmd = spawn('python', ['./gate_py_scripts/main.py', this.port, 'open']);
    cmd.stdout.on('data', (data) => {
   	this.getState();
    });
  }

  toggle() {
    if (process.env.hasOwnProperty('dev')) {
      this.__state_dev = {state: 'open'};
      this.getState();
      setTimeout(_ => {
        this.__state_dev = {state: 'close'};
        this.getState();
      }, 5000);
      return;
    }
    const cmd = spawn('python', ['./gate_py_scripts/main.py', this.port, 'toggle']);
    cmd.stdout.on('data', (data) => {
      console.log(data);
      this.getState();
    });
  }

  getState() {
    if (process.env.hasOwnProperty('dev')) {
      this.onStateChangeListener.emit('state', this.__state_dev);
      return;
    }
    const cmd = spawn('python', ['main.py', this.port, 'state']);
    cmd.stdout.on('data', (data) => {
      try {
	console.log(data);
        this.onStateChangeListener.emit('state', JSON.parse(data));
      } catch(e) {
        console.log(e, data);
      }
    });
  }

};
