const {spawn} = require('child_process');

module.exports = class {

  constructor(socket) {
    this._socket = socket;
    this._socket.on('software_update', (_) => this.softwareUpdateCommands(_));
  }

  softwareUpdateCommands(command) {
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
    }
  }

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