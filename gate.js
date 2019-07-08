const {spawn} = require('child_process');
const {EventEmitter} = require('events');


module.exports = class Gate {

  constructor(port) {
    this.port = port ? port : 26;
    this.onStateChangeListener = null;
  }

  setStateListener(fn) {
    this.onStateChangeListener = fn;
  }

  onStateChange(state) {
    if (this.onStateChangeListener) {
      this.onStateChangeListener(state);
    }
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
        if (`${data}` !== '') {
          this.onStateChange(JSON.parse(`${data}`.trim()));
        }
      } catch(e) {
        console.log(e, data);
      }
      cmd.kill();
    });

    cmd.stderr.on('data', _ => {
      console.log(`${_}`);
    })
  }

};
