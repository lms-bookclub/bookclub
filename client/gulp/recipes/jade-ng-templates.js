const gulp = require('gulp');
const concat = require('gulp-concat');
const ngHtml2Js = require('gulp-ng-html2js');
const minifyHtml = require('gulp-minify-html');
const wrap = require('gulp-wrap');
const jade = require('gulp-jade');

module.exports = function(config) {
  return () => {
    return gulp.src(config.input)
      .pipe(jade())
      .pipe(minifyHtml({
        comments: true,
        spare: true,
        quotes: true
      }))
      .pipe(ngHtml2Js({
        declareModule: false,
        rename: function(url) {
          return url.replace('.jade', '.html');
        },
        prefix: config.name + '/',
        template: "    $templateCache.put('<%= template.url %>', '<%= template.escapedContent %>');\n"
      }))
      .pipe(concat(config.name + '.templates.js'))
      .pipe(wrap(
        "angular.module('<%= moduleName %>', []).run(['$templateCache', function($templateCache) {\n" +
        "<%= contents %>" +
        "}])"
        , { moduleName: config.name + '.templates' }
      ))
      .on('error', function(error) {
        console.log(error.stack);
        this.emit('end');
      })
      .pipe(gulp.dest(config.output));
  }
};