const {spawn} = require('child_process');

const cmd = spawn('python', ['./gate_py_scripts/keypad2.py']);
cmd.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});
cmd.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});
cmd.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
