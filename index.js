const {spawn} = require('child_process');
const io = require('socket.io-client');
const btoa = require('btoa');
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkMTI4MjA3M2JjNGE1NDQ0ZWIzNGQ1MSIsImFzc2V0LXR5cGUiOiI1ZDEyODE2YTNiYzRhNTQ0NGViMzRkNDgiLCJpYXQiOjE1NjE0OTQzNTJ9.qNev5WpLbPBUGw-7VhwV5uJuxSlksYVrOV4hIfAhpdQ';

const creds = btoa(JSON.stringify({
  token: token,
  'connection-type': 'asset'
}));

const socket = io('http://174.129.167.18:4005', {
  'reconnection': true,
  'reconnectionDelay': 1000,
  query: {
    credentials: creds
  }
});

socket.on('connect', _ => {
  console.log('socket connected');
});

socket.on('connect', _ => {
  console.log('connected');
});

socket.on('connection_error', _ => {
  console.log(_);
});

socket.on('disconnect', _ => {
  console.log('disconnected');
});

socket.on('reconnect',  _ => {
  console.log('reconnected');
});

socket.on('reconnect_failed',  _ => {
  console.log('reconnect failed');
});

socket.on('reconnecting',  _ => {
  console.log('reconnecting');
});

socket.on('command', cmd => {
  console.log(cmd);
  switch(cmd['state']) {
    case 'open':
      open();
      break;
    case 'close':
      close();
      break;
    case 'toggle':
      toggle();
      break;
    default:
      getState();
      break;
  }
});

const open = () => {
  spawn('python', ['main.py', 26, 'open']);
  getState();
};

const close = () => {
  spawn('python', ['main.py', 26, 'close']);
  getState();
};

const toggle = () => {
  const cmd = spawn('python', ['main.py', 26, 'toggle']);
  cmd.stdout.on('data', (data) => {
    try {
      socket.emit('state', JSON.parse(data));
    } catch(e) {
      console.log(e);
    }
  });

  cmd.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  cmd.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
};

const getState = () => {
  socket.emit('state', {state: 'open'});
  const cmd = spawn('python', ['main.py', 26, 'state']);
  cmd.stdout.on('data', (data) => {
    try {
      socket.emit('state', JSON.parse(data));
    } catch(e) {
      console.log(e);
    }
  });

  cmd.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  cmd.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
};
