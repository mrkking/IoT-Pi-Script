const {spawn} = require('child_process');

module.exports = class {

  constructor(socket) {
    this._socket = socket;
    this._socket.on('software_update', (_, __) => this.softwareUpdateCommands(_, __));
  }

  softwareUpdateCommands(command, data) {
    switch(command) {
      case 'status':
        this.getStatus();
        break;
      case 'update':
        this.updateSoftware();
        break;
      case 'stash':
        this.stashChanges();
        break;
      case 'restart-app':
        this.restartApp();
        break;
      case 'restart-device':
        this.restartDevice(data);
        break;
    }
  }

  restartDevice(password) {
    password ? spawn('echo', [password, '|', 'sudo', '-S', 'reboot']) : null;
  }

  restartApp() {
    process.exit(1);
    process.on('exit', _ => {
      spawn('yarn', ['run', 'start']);
    });
  };

  stashChanges() {
    const cmd = spawn('git', ['stash']);
    cmd.stdout.on('data', (data) => {
      this._socket.emit('updater', 'status', `${data}`);
    });
  }

  updateSoftware() {
    const cmd = spawn('git', ['pull']);
    cmd.stdout.on('data', (data) => {
      this._socket.emit('updater', 'status', `${data}`);
    });
  }

  getStatus() {
    const cmd = spawn('git', ['status']);
    cmd.stdout.on('data', (data) => {
      this._socket.emit('updater', 'status', `${data}`);
    });
  }
};