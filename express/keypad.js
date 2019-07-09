const express = require('express');
const app = express();

app.get('/:pin', (req, res) => {
  console.log('PIN FROM EXPRESS ROUTE', req.params.pin);
  res.send({});
});

module.exports = app;
