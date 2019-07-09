const express = require('express');
const app = express();
const {AccessKeysCollection} = require('../db/db_handler');
const keyCollection = new AccessKeysCollection();

app.get('/:pin', (req, res) => {
  const pin = req.params.pin;
  console.log(keyCollection.get());
  console.log(keyCollection.getKeyByPin(pin)); 
  res.send({});
});

module.exports = app;
