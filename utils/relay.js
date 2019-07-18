const {spawn} = require('child_process');
const {EventEmitter} = require('events');

module.exports = class Relay {

  constructor(port) {
    this.port = port ? port : 26;
    this.state = null;
    this.events = new EventEmitter();
  }

  _onStateChange() {
    this.events.emit('state', {state: this.state});
  }

  close() {
    spawn('python', [__dirname+'/gate_py_scripts/main.py', this.port, 'close']);
  }

  open() {
    spawn('python', [__dirname+'/gate_py_scripts/main.py', this.port, 'open']);
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