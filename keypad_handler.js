const {spawn} = require('child_process');
const config = require(__dirname+'/config');

if (config.env === 'PROD') {
  const cmd = spawn('python', [__dirname + '/gate_py_scripts/keypad.py']);
  cmd.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });
  cmd.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });
  cmd.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
}
