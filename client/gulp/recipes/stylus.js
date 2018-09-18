const gulp = require('gulp');
const stylus = require('gulp-stylus');
const concat = require('gulp-concat');
const plumber = require('gulp-plumber');

module.exports = (config) => {
  return () => {
    return gulp.src(config.input)
      .pipe(plumber())
      .pipe(stylus({ 'import': config.include || [] }))
      .pipe(concat(config.name))
      .pipe(gulp.dest(config.output));
  };
};
