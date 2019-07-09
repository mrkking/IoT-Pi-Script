const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: true}));
//app.use(cors);

app.get('/', (req, res) => {

	res.send('hello world');
})

app.use('/kp', require('./keypad'));

app.listen(4000, () => {
  console.log('Running local server on port 4000');
});
