const Relay = require('./relay');
// const moment = require('moment');

module.exports = class Gate extends Relay {

  constructor(port, sensor) {
    super(port);
    this.gateStateTimeout = null;
    this.gateOpenDurationTimeout = null;
    // sensor.events.on('objectDetected', _ => this._onObjectDetected());
  }

  openGate() {
    if (['opening', 'open'].includes(this.state))
      return;

    this.open();
    this._setState({state: 'opening'});
    this.gateStateTimeout = setTimeout(_ => {
      this.updateState();
    }, 1000);
  }

  closeGate() {
    if (['closing', 'close'].includes(this.state))
      return;

    this.close();
    this._setState({state: 'closing'});
    this.gateStateTimeout = setTimeout(_ => {
      this.updateState();
    }, 1000);
  }

  _onObjectDetected() {
    if (this.state && this.state === 'closing') {
      if(this.gateStateTimeout) {
        clearTimeout(this.gateStateTimeout);
      }
      this.openGate();
      this.gateStateTimeout = setTimeout(_ => {
        this.closeGate();
      }, 5000);
    }
  }
};