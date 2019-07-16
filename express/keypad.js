const express = require('express');
const app = express();
const {accessKeys} = require(__dirname+'/../db/db_handler');
const config = require('../config');

app.get('/:pin', (req, res) => {
  const pin = parseInt(req.params.pin);
  const user = accessKeys.getKeyByPin(pin);
  console.log(pin);
  console.log(config.getValue('provision_token'));
  if (config.getValue('provision_token')) {
    req.event_emitter.emit('provision_pin', {pin: pin});
  }
  if (user) {
    req.event_emitter.emit('pin', user);
  }
  res.send({});
});

module.exports = app;
