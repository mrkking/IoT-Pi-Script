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
  }

  open() {
    spawn('python', ['./gate_py_scripts/main.py', this.port, 'open']);
  }

  toggle() {
    spawn('python', ['./gate_py_scripts/main.py', this.port, 'toggle']);
  }

  getState() {
    const cmd = spawn('python', ['./gate_py_scripts/main.py', this.port, 'state']);
    cmd.stdout.on('data', (data) => {
      try {
        this.onStateChangeListener.emit('state', JSON.parse(data));
	cmd.kill();
      } catch(e) {
        console.log(e, data);
      }
    });
  }

};
