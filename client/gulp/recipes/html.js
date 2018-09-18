const gulp = require('gulp');
const inject = require('gulp-inject');
const series = require('stream-series');
const replace = require('gulp-replace');

module.exports = (config) => {
  return () => {
    let streams = config.sources
      .map(sources => {
        return gulp.src(sources, {
          read: false,
          cwd: config.cwd
        });
      });

    let stream = gulp.src(config.input);

    config.replacements.forEach(replacement => {
      stream = stream.pipe(replace(replacement[0], replacement[1]))
    });
    
    return stream
      .pipe(inject(series.apply(series, streams), {
        addRootSlash: true
      }))
      .pipe(gulp.dest(config.output));
  }
};