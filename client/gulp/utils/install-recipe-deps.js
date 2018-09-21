'use strict';

const fs = require('fs');
const path = require('path');
const spawn = require('child_process').spawn;

const provided = ['path', 'fs'];
const regex = /require\('(.*?)'\);/g;

function match(str, re) {
  var matches = str.match(re);
  return !matches ? [] : matches
    .map(m => {
      re.lastIndex = 0;
      return re.exec(m);
    })
    .filter(e => !!e);
}

function scrape(dir, tasks) {
  let filenames = fs.readdirSync(dir);

  if(tasks) {
    filenames = filenames
      .filter(filename => tasks.indexOf(filename.replace(/\.js/g, '')))
  }

  return filenames
    .map(filename => path.join(dir, filename))
    .map(filename => fs.readFileSync(filename, 'utf8'))
    .map(content => match(content, regex).map(e => e[1]))
    .reduce((all, single) => all.concat(single), [])
    .filter((e, i, a) => a.indexOf(e) == i)
    .filter(e => provided.indexOf(e) < 0);
}

function install(dependencies) {
  let dependency = dependencies[0];
  let npmi = spawn('npm', ['i', '--save-dev', dependency]);

  npmi.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  npmi.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  npmi.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    if(dependencies.length > 1) {
      install(dependencies.slice(1))
    }
  });
}

function command(dependencies) {
  return 'npm i --save-dev ' + dependencies.join(' ');
}

function installDeps(dir) {
  dir = path.join(process.cwd(), dir || '');

  let dependencies = scrape(dir);

  install(dependencies);
}

function generateCommand(dir, tasks) {
  dir = path.join(process.cwd(), dir || '');

  let dependencies = scrape(dir, tasks);

  console.log(command(dependencies));
}

module.exports = {
  install: installDeps,
  command: generateCommand
};