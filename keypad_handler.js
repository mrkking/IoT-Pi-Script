const {spawn} = require('child_process');
const {EventEmitter} = require('events');


module.exports = class KeyPad {

  constructor(name, portA, portB, feedback_port, gate, camera, html_events) {
    this.name = name;
    this.portA = portA;
    this.portB = portB;
    this.cmd = null;
    this.feedback =
    this.events = new EventEmitter();
    this.emitStatus(false);
    // html_events.
  }

  spawn_keypad_process() {
    this.emitStatus(true);
    this.cmd =  spawn('python', [__dirname + '/gate_py_scripts/keypad.py', this.portA, this.portB]);
    this.cmd.stdout.on('data', _ => this._onDataRecieved(_));
    this.cmd.stderr.on('data', _ => this._onError(_));
    this.cmd.on('close', _ => this._onClose(_));
  };

  emitStatus(status) {
    this._connected = status;
    this.event.emit('status', {online: this._connected});
  }

  _onDataRecieved(data) {
    console.log(`stdout: ${data}`);
  }

  _onError(data) {
    this.emitStatus(false);
    console.log('Failed to initialize keypad');
    console.log(`stderr: ${data}`);
  }

  _onClose(code) {
    this.emitStatus(false);
    if (code === 0) {
      setTimeout(_ => {
        this.spawn_keypad_process();
      }, 500);
    }
    console.log(`child process exited with code ${code}`);
  }

};