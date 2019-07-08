const {spawn} = require('child_process');
const {EventEmitter} = require('events');


module.exports = class Gate {

  constructor(port) {
    this.port = port ? port : 26;
    this.onStateChangeListener = new EventEmitter();
  }

  onStateChange() {
    return this.onStateChangeListener;
  }

  close() {
    spawn('python', ['./gate_py_scripts/main.py', this.port, 'close']);
    this.getState();
  }

  open() {
    spawn('python', ['./gate_py_scripts/main.py', this.port, 'open']);
   	this.getState();
  }

  toggle() {
    spawn('python', ['./gate_py_scripts/main.py', this.port, 'toggle']);
    this.getState();
  }

  getState() {
    const cmd = spawn('python', ['main.py', this.port, 'state']);
    cmd.stdout.on('data', (data) => {
      try {
        this.onStateChangeListener.emit('state', JSON.parse(data));
      } catch(e) {
        console.log(e, data);
      }
    });
  }

};
