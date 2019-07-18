const {spawn} = require('child_process');
const {EventEmitter} = require('events');

module.exports = class Port {

  constructor(port) {
    this.port = port ? port : 26;
    this.state = null;
    this.events = new EventEmitter();
  }

  _onStateChange() {
    this.events.emit('state', {state: this.state});
  }

  close(updateState) {
    spawn('python', [__dirname+'/gate_py_scripts/main.py', this.port, 'close']);
    if (updateState) {
      this.updateState();
    }
  }

  open(updateState) {
    spawn('python', [__dirname+'/gate_py_scripts/main.py', this.port, 'open']);
    if (updateState) {
      this.updateState();
    }
  }

  _setState(data) {
    this.state = data['state'];
    this._onStateChange();
  }

  updateState() {
    const cmd = spawn('python', [__dirname+'/gate_py_scripts/main.py', this.port, 'state']);
    cmd.stdout.on('data', (data) => {
      try {
        if (`${data}` !== '') {
          this.setState(JSON.parse(`${data}`.trim()));
        }
      } catch(e) {
        console.log(e, data);
      }
      cmd.kill();
    });
  }

};