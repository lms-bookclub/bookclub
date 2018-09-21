const gulp = require('gulp');
const browserify = require('browserify');
const babelify = require('babelify');
const tsify = require('tsify');
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const buffer = require('vinyl-buffer');
const gutil = require('gulp-util');
const plumber = require('gulp-plumber');

module.exports = function(config) {
  return () => {
    var b = browserify({
      debug: true,
      entries: [config.input]
    })
      .plugin(tsify, {
        target: 'es6',
        baseUrl: config.baseUrl || '.'
      });

    if(config.transform) {
      b.transform(babelify.configure(config.transform));
    }

    if(config.presets || config.plugins) {
      b.transform(babelify, {
        presets: config.presets,
        plugins: config.plugins
      });
    }

    if(config.require) {
      b.require(config.require);
    }

    if(config.external) {
      b.external(config.external);
    }

    return b
      .bundle()
      .on('error', (err) => {
        if(config.ignoreErrors) {
          let matchesIgnore = config.ignoreErrors.some((ignore) => ignore.test(err));
          if(matchesIgnore) {
            return;
          }
        }
        gutil.log(gutil.colors.red('Error: '), gutil.colors.red(err.message))
      })
      .pipe(source(config.name))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(config.output));
  };
};
