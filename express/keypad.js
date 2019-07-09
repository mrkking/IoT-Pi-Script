const express = require('express');
const app = express();
const {accessKeys} = require('../db/db_handler');

app.get('/:pin', (req, res) => {
  const pin = parseInt(req.params.pin);
  console.log(typeof pin);
  console.log(accessKeys.getKeyByPin(pin));
  res.send({});
});

module.exports = app;
