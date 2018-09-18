const ENV = process.env.ENV;

if(!ENV) {
  throw 'ENV not set.'
}

if(ENV === 'production') {
  console.log('Loading prod gulpfile.');
  require('./gulp/prod.gulpfile');
} else {
  console.log('Loading dev gulpfile.');
  require('./gulp/dev.gulpfile');
}