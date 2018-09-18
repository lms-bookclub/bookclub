const gulp = require('gulp');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const buffer = require('vinyl-buffer');
const gutil = require('gulp-util');

module.exports = function(config) {
  return () => {
    var b = browserify({
      debug: true,
      entries: [config.input]
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
      .pipe(source(config.name))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .on('error', gutil.log)
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(config.output));
  };
};