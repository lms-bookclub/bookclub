'use strict';

const gulp = require('gulp');
const replace = require('gulp-replace');

module.exports = (config) => {
  return () => {
    return gulp.src(config.input)
      .pipe(replace(config.from, config.to))
      .pipe(gulp.dest(config.output));
  }
};