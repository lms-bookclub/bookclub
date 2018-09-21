import * as fs from 'fs';
import * as path from'path';

const logdir = path.join(__dirname, '../../logs');
const outfile = path.join(logdir, 'out.txt');
const errfile = path.join(logdir, 'err.txt');
const statefile = path.join(logdir, 'state.json');
const now = (new Date()).getTime();

const MAX_SIZE_MB = 5;
const ENABLE_CONSOLE_LOG = true;
const ENABLE_LOG_FILES = false;

if(ENABLE_LOG_FILES) {
  if(!fs.existsSync(logdir)) {
    fs.mkdirSync(logdir);
  }

  fs.writeFileSync(outfile, `${now}: Init\n`);
  fs.writeFileSync(errfile, `${now}: Init\n`);
  fs.writeFileSync(statefile, `{}`);
}

function appendFile(filename, strings) {
  const string = [`${now}:`, ...strings].join(' ') + '\n';
  const sizeMB = fs.statSync(filename).size / 1000000.0;

  if(sizeMB < MAX_SIZE_MB) {
    fs.appendFileSync(filename, string);
  } else {
    const file = fs.readFileSync(filename, 'utf8');
    let lines = file.split('\n');
    const splitPoint = lines.length / 10;
    lines = lines.slice(splitPoint);
    fs.writeFileSync(file, [...lines, string].join('\n'));
  }
}

export default {
  log(msg?, ...strings) {
    if(ENABLE_CONSOLE_LOG) {
      console.log(msg, ...strings);
    }
    if(ENABLE_LOG_FILES) {
      appendFile(outfile, [msg, ...strings]);
    }
  },
  error(msg, ...strings) {
    if(ENABLE_CONSOLE_LOG) {
      console.error(msg, ...strings);
    }
    if(ENABLE_LOG_FILES) {
      appendFile(errfile, [msg, ...strings]);
    }
  },
  state(state) {
    if(ENABLE_LOG_FILES) {
      const string = JSON.stringify(state, null, 4);
      fs.writeFileSync(statefile, string);
    }
  },
};