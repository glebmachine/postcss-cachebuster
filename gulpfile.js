'use strict';

var gulp = require('gulp');
var files = ['index.js', 'test/*.js', 'gulpfile.js'];
var postcss = require('gulp-postcss');
var cachebuster = require('./index.js');
var rename = require('gulp-rename');


gulp.task('test', function() {
    /*
    gulp.src('test/example.css')
      .pipe(postcss([cachebuster({
        imagesPath : './test/'
      })]))
      .pipe(rename('result.css'))
      .pipe(gulp.dest('test/'));
    */
    var mocha = require('gulp-mocha');
    return gulp.src('test/*.js', { read: false })
      .pipe(mocha());
});

gulp.task('default', ['test']);

gulp.task('watch', ['test'], function() {
    gulp.watch(files, ['test']);
});
