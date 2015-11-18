'use strict';

var gulp = require('gulp');
var files = ['index.js', 'test/*.js', 'gulpfile.js'];

gulp.task('test', function() {
    var mocha = require('gulp-mocha');
    return gulp.src('test/*.js', { read: false })
      .pipe(mocha());
});

gulp.task('default', ['test']);

gulp.task('watch', ['test'], function() {
    gulp.watch(files, ['test']);
});
