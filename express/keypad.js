const express = require('express');
const app = express();
const {accessKeys} = require(__dirname+'/../db/db_handler');

app.get('/:pin', (req, res) => {
  const pin = parseInt(req.params.pin);
  const user = accessKeys.getKeyByPin(pin);
  if (user) {
    req.event_emitter.emit('pin', user);
  }
  res.send({});
});

module.exports = app;
