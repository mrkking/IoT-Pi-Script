const tessel = require('tessel');
const Keypad = require('tessel-matrix-keypad');
const gpio = tessel.port['GPIO'].pin;
const modD = tessel.port['D'].pin;
console.log(gpio);
const keypad = new Keypad({
  keys: [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#']
  ]
});
