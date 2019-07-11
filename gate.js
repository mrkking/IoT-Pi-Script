const {spawn} = require('child_process');

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
    spawn('python', [__dirname+'/gate_py_scripts/main.py', this.port, 'close']);
    this.getState();
  }

  open() {
    spawn('python', [__dirname+'/gate_py_scripts/main.py', this.port, 'open']);
    this.getState();
  }

  toggle() {
    spawn('python', [__dirname+'/gate_py_scripts/main.py', this.port, 'toggle']);
  }

  getState() {
    const cmd = spawn('python', [__dirname+'/gate_py_scripts/main.py', this.port, 'state']);
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
  }

};