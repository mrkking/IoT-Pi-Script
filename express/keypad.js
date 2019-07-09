const express = require('express');
const app = express();
const {accessKeys} = require('../db/db_handler');

app.get('/:pin', (req, res) => {
  const pin = req.params.pin;
  console.log(pin);
  console.log(accessKeys.getKeyByPin(pin));
  res.send({});
});

module.exports = app;
