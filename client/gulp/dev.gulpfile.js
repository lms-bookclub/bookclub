const ENV = process.env.ENV || 'local';

const gulp = require('gulp');
const sync = require('gulp-sync')(gulp).sync;
const ga = require('./utils/ga');
const Config = require('./config')(ENV);
let recipe = (name, config) => require('./recipes/' + name)(config);

console.log('Building with config: ', Config);

gulp.task('env', recipe('env', {
  NODE_PATH: 'source/js:node_modules'
}));

gulp.task('clean', recipe('clean', {
  input: './dist'
}));

gulp.task('css', Config.CSS_BUNDLES.map(title => {
  gulp.task(`css:${title}`, recipe('stylus', {
    input: `./source/css/${title}.bundle.styl`,
    output: './dist/css',
    name: `${title}.css`
  }));

  return `css:${title}`;
}));

gulp.task('js:node_modules', recipe('browserify', {
  input: '',
  require: Config.NODE_MODULES,
  output: './dist/vendor',
  name: 'node_modules.js'
}));

gulp.task('static', recipe('copy', {
  input: './static/**/*',
  output: './dist'
}));

gulp.task('static:node_modules', recipe('copy', {
  input: [
    './node_modules/react/umd/react.development.js',
    './node_modules/react-dom/umd/react-dom.development.js',
  ],
  output: './dist/vendor'
}));

gulp.task('js:client', Config.JS_BUNDLES.map((title, i) => {
  gulp.task(`js:source:${title}`, recipe('tsify-sourcemaps', {
    input: `./source/js/${title}.bundle.${Config.EXT.JS}`,
    external: Config.NODE_MODULES,
    output: './dist/js',
    name: `${title}.js`,
    baseUrl: './source/js',
    ignoreErrors: [
      /Error TS2686: '_' refers to a UMD global, but the current file is a module. Consider adding an import instead./
    ]
  }));

  return `js:source:${title}`;
}));

gulp.task('inject', recipe('html', {
  cwd: './dist',
  input: './source/html/**/*.html',
  sources: [[
    '!vendor/node_modules.js',
    '!vendor/react.development.js',
    '!vendor/react-dom.development.js',
    'vendor/**/*'
  ], [
    '!js/bundle.js',
    'css/client.css',
    'css/**/*',
    'js/**/*',
  ]],
  output: './dist',
  replacements: [
    ['@{SENTRY}', Config.SENTRY],
    ['@{GA}', ga(Config.GA)],
    ['@{VERSION}', Config.VERSION],
    ['@{ENV}', Config.ENV],
  ],
}));

gulp.task('watch', () => {
  gulp.watch([
    './source/html/**/*.html',
    './dist/**/*.js',
    './dist/**/*.css',
    './dist/vendor/**/*',
  ], ['inject']);
  gulp.watch('./source/css/**/*.styl', ['css']);
  gulp.watch('./static/**/*', ['static']);
  gulp.watch('./bower_components/**/*', ['bower']);
});

var compileAsync = ['js:node_modules', 'static:node_modules', 'static', 'css'];
gulp.task('compile', sync(['env', 'clean', compileAsync, 'inject']));
gulp.task('default', ['compile', 'watch',]);