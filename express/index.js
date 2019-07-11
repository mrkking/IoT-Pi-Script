const express = require('express');
const app = express();
const {EventEmitter} = require('events');
const events = new EventEmitter();
const config = require(__dirname+'/../config');

const attachEventEmitter = (req, res, next) => {
  req.event_emitter = events;
  next();
};

app.use('/kp', attachEventEmitter, require(__dirname+'/keypad'));

app.listen(4000, () => {
  console.log('Running local server on port 4000');
});

module.exports = events;