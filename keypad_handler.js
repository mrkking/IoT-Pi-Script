const {spawn} = require('child_process');
const {EventEmitter} = require('events');
const Port = require('./utils/port');

class Feedback extends Port {

  constructor(port) {
    super(port);
  }

  pingWithInterval(times, duration) {
    if (this.interval) {
      this.clearInterval(this.interval);
    }
    let amt = 0;
    this.interval = setInterval(_ => {
      this.ping(duration);
      amt++;
      if (amt === times) {
        clearInterval(this.interval);
      }
    }, duration ? duration + 250 : 750);
  }

  ping(duration) {
    this.open();
    setTimeout(_ => {
      this.close();
    }, duration ? duration : 500);
  }

}

module.exports = class KeyPad {

  constructor(kp, gate, camera, html_events) {
    this.name = kp.name;
    this.portA = kp.portA;
    this.portB = kp.portB;
    this.cmd = null;
    this.buzzer = new Feedback(kp['buzzer']);
    this.led = new Feedback(kp['led']);
    this.led.open(true);
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